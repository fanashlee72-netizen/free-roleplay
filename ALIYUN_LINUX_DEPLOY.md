# 阿里云 Linux 4 部署（systemd，不用 Docker）

Alibaba Cloud Linux 4 使用 `dnf`，和 Ubuntu 不同。这个方案直接跑 Python，最省事。

## 1. 上传并解压

把 `free-roleplay-aliyun.zip` 上传到 `/opt/`，然后：

```bash
cd /opt
dnf install -y python3 unzip
unzip free-roleplay-aliyun.zip
cd free-roleplay
```

## 2. 配置

```bash
cp .env.server.example .env.server
vi .env.server
```

至少填写：

```env
HOST=0.0.0.0
PORT=8010
DEEPSEEK_API_KEY=sk-REPLACE_WITH_YOUR_KEY
TRACKING_IDS=friend-001,friend-002,friend-003
USERS_DB=data/users.db
ADMIN_TOKEN=REPLACE_WITH_A_RANDOM_STRING
REQUIRE_TRACKING=1
```

注意：`DEEPSEEK_API_KEY` 必须是纯英文/数字的 `sk-...`，不要保留中文占位符，否则会出现 `UnicodeEncodeError`。

## 3. 启动

```bash
bash deploy-aliyun-linux.sh
```

脚本会创建 `free-roleplay.service`，并尝试在 firewalld 放行 8010。

## 4. 阿里云防火墙

系统里的 firewalld 之外，还要在**轻量应用服务器控制台 → 防火墙**再放行一次 TCP 8010。两层都要开。

## 5. 访问

```text
http://47.106.38.236:8010
```

健康检查：

```bash
curl http://127.0.0.1:8010/api/health
```

## 6. 常用命令

```bash
systemctl status free-roleplay
journalctl -u free-roleplay -n 100 --no-pager
systemctl restart free-roleplay
```

## 7. 更新代码

重新上传并解压后：

```bash
cd /opt/free-roleplay
bash deploy-aliyun-linux.sh
```
