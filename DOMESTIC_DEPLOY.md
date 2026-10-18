# 国内云部署指南

这个项目只需要一台 1 核 1G 以上的 Linux 服务器，或者支持 Docker 容器的 Serverless 平台。

## 为什么适合国内云

- 服务器到 `api.deepseek.com` 的延迟低；
- 不需要访问 GitHub 主站，代码可以通过压缩包上传；
- 数据和用量记录都在你自己的服务器上。

## 方案一：轻量应用服务器（最直接）

推荐：腾讯云轻量应用服务器、阿里云轻量应用服务器、华为云 Flexus，系统选 Ubuntu 22.04/24.04。

### 1. 开放端口

在云厂商控制台的防火墙/安全组里放行 TCP `8010`。

### 2. 上传项目

把 `free-roleplay` 目录上传到服务器，例如：

```bash
scp -r free-roleplay root@你的服务器IP:/opt/
cd /opt/free-roleplay
```

如果服务器访问 GitHub 正常，也可以直接：

```bash
git clone https://github.com/fanashlee72-netizen/free-roleplay.git
cd free-roleplay
```

### 3. 安装 Docker

```bash
curl -fsSL https://get.docker.com | sh
```

如果下载慢，可以用云厂商镜像源安装 Docker，或使用系统包管理器。

### 4. 配置环境变量

```bash
cp .env.server.example .env.server
nano .env.server
```

至少填写：

```env
DEEPSEEK_API_KEY=sk-REPLACE_WITH_YOUR_KEY
TRACKING_IDS=friend-001,friend-002,friend-003
USERS_DB=data/users.db
ADMIN_TOKEN=REPLACE_WITH_A_RANDOM_STRING
REQUIRE_TRACKING=1
```

### 5. 启动

```bash
bash deploy-vps.sh
```

然后访问：

```text
http://服务器公网IP:8010
```

健康检查：

```bash
curl http://服务器公网IP:8010/api/health
```

### 6. 查看用量

```bash
curl "http://服务器公网IP:8010/api/admin/usage?token=你的ADMIN_TOKEN"
```

`data/usage.jsonl` 会持久化到宿主机，重启容器不会丢失。

## 方案二：腾讯云 CloudBase Run / 阿里云函数计算 FC

这两个平台支持 **自定义容器**，可以直接用本项目的 `Dockerfile`：

1. 把镜像构建后推送到腾讯云 TCR 或阿里云 ACR；
2. 创建 Web 服务/自定义容器，端口填 `8010`；
3. 环境变量填 `.env.server` 里的内容；
4. 平台会分配一个公网 HTTPS 地址。

优点是不用管服务器；缺点是第一次配置比轻量服务器复杂，且仍然需要实名认证和付费。

## 域名与 HTTPS

直接用 `IP:8010` 可以访问，但网址不好看，也没有 HTTPS。

推荐用 Caddy 反代：

```text
你的域名 {
    reverse_proxy 127.0.0.1:8010
}
```

注意：**大陆服务器绑定域名通常需要 ICP 备案**；香港/海外区域一般不需要备案，但延迟会高一些。

## 安全提醒

- `TRACKING_IDS` 是访问凭证，不要公开；
- 不要把 `.env.server` 提交到 Git；
- 建议只开放 80/443，把 8010 限制在本机或安全组白名单；
- 免费/低配服务器资源有限，建议保留默认的限流设置。
