# 阿里云部署速查

推荐使用 **轻量应用服务器**，比 ECS 简单，控制台自带防火墙和远程连接。

## 1. 购买

阿里云控制台 → 轻量应用服务器 → 创建服务器：

- 地域：华东1（杭州）或华南1（深圳），离你和 DeepSeek 都近；
- 镜像：系统镜像 → Ubuntu 22.04 或 24.04；
- 配置：2 核 2G 足够，1 核 1G 也能跑；
- 设置 root 密码，记录公网 IP。

大陆地域绑定自定义域名需要 ICP 备案；直接用 `IP:8010` 访问不需要备案。

## 2. 放行端口

轻量应用服务器控制台 → 防火墙 → 添加规则：

- 协议：TCP
- 端口：8010
- 来源：0.0.0.0/0

SSH 的 22 端口默认已放行。以后绑定域名再加 80/443。

## 3. 连接服务器

Windows PowerShell：

```powershell
ssh root@你的公网IP
```

也可以在控制台点“远程连接”，用 Workbench。

## 4. 上传项目

用控制台的“上传文件”把 `free-roleplay-aliyun.zip` 传到 `/opt/`，然后：

```bash
cd /opt
apt-get update && apt-get install -y unzip
unzip free-roleplay-aliyun.zip
cd free-roleplay
```

或者在本地 PowerShell 用 scp：

```powershell
scp free-roleplay-aliyun.zip root@你的公网IP:/opt/
```

## 5. 安装 Docker

Ubuntu 自带源即可：

```bash
apt-get update
apt-get install -y docker.io docker-compose-v2
systemctl enable --now docker
```

如果提示找不到 `docker-compose-v2`，改用：

```bash
apt-get install -y docker-compose
```

也可以使用 Docker 官方脚本：

```bash
curl -fsSL https://get.docker.com | sh
```

国内下载慢时优先用系统源。

## 6. 配置

```bash
cp .env.server.example .env.server
nano .env.server
```

填写：

```env
DEEPSEEK_API_KEY=sk-你的key
TRACKING_IDS=friend-001,friend-002
ADMIN_TOKEN=换成一个随机长字符串
REQUIRE_TRACKING=1
```

保存：`Ctrl+O`，回车，`Ctrl+X`。

## 7. 启动

```bash
bash deploy-vps.sh
```

本机检查：

```bash
curl http://127.0.0.1:8010/api/health
```

浏览器访问：

```text
http://你的公网IP:8010
```

## 8. 查看用量

```bash
curl "http://你的公网IP:8010/api/admin/usage?token=你的ADMIN_TOKEN"
```

用量会持久化在 `data/usage.jsonl`，容器重启不会丢。

## 9. 绑定域名和 HTTPS（可选）

安装 Caddy：

```bash
apt-get install -y caddy
```

编辑 `/etc/caddy/Caddyfile`：

```text
你的域名 {
    reverse_proxy 127.0.0.1:8010
}
```

然后：

```bash
systemctl reload caddy
```

大陆服务器绑定域名通常需要 ICP 备案；香港地域不需要备案，但延迟会高一些。

## 安全提醒

- `.env.server` 不要提交到 Git，也不要发给别人；
- `TRACKING_IDS` 是访问凭证，只发给你信任的人；
- 建议只开放 80/443，把 8010 限制在本机或安全组白名单；
- 默认限流是每个 ID 10 分钟 30 次请求，可在 `.env.server` 里调整。
