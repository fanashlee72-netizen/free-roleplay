#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker 未安装。Ubuntu/Debian 可先执行："
  echo "  curl -fsSL https://get.docker.com | sh"
  echo "然后重新运行本脚本。"
  exit 1
fi

if [ ! -f .env.server ]; then
  cp .env.server.example .env.server
  echo "已创建 .env.server，请先填写："
  echo "  DEEPSEEK_API_KEY / TRACKING_IDS / ADMIN_TOKEN"
  echo "填好后重新运行：bash deploy-vps.sh"
  exit 1
fi

docker compose up -d --build
docker compose ps

echo
echo "部署完成。请在浏览器访问："
echo "  http://服务器公网IP:8010"
echo
echo "健康检查："
echo "  curl http://服务器公网IP:8010/api/health"
