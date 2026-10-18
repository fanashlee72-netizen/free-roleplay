#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

PYTHON="$(command -v python3 || true)"
if [ -z "$PYTHON" ]; then
  echo "找不到 python3。请先执行：dnf install -y python3"
  exit 1
fi

if [ ! -f .env.server ]; then
  echo "缺少 .env.server。请先：cp .env.server.example .env.server"
  exit 1
fi

mkdir -p data

# 补齐 systemd 运行所需的变量
grep -q '^HOST=' .env.server || echo 'HOST=0.0.0.0' >> .env.server
grep -q '^PORT=' .env.server || echo 'PORT=8010' >> .env.server
grep -q '^USAGE_FILE=' .env.server || echo "USAGE_FILE=$(pwd)/data/usage.jsonl" >> .env.server
grep -q '^USERS_DB=' .env.server || echo "USERS_DB=$(pwd)/data/users.db" >> .env.server

SERVICE=/etc/systemd/system/free-roleplay.service
cat > "$SERVICE" <<EOF
[Unit]
Description=FREE! Roleplay Theater
After=network.target

[Service]
Type=simple
WorkingDirectory=$(pwd)
EnvironmentFile=$(pwd)/.env.server
Environment=PYTHONIOENCODING=utf-8
ExecStart=$PYTHON $(pwd)/app.py
Restart=always
RestartSec=3
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now free-roleplay
systemctl restart free-roleplay

if systemctl is-active --quiet firewalld; then
  firewall-cmd --permanent --add-port=8010/tcp || true
  firewall-cmd --reload || true
fi

sleep 2
echo "--- 健康检查 ---"
curl -s --max-time 5 http://127.0.0.1:8010/api/health || true
echo
echo "--- 服务状态 ---"
systemctl --no-pager --full status free-roleplay | head -n 14 || true
