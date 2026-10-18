# 后端托管部署指南

这个版本采用「服务器持有 API Key + 用户输入 Tracking ID」的架构：

- 服务器环境变量里保存 `DEEPSEEK_API_KEY`；
- 用户只需要输入你分配的 Tracking ID；
- 每个 ID 有独立的请求频率限制；
- 每次对话会记录到 `usage.jsonl`，也可以从平台日志里看到 `USAGE` 行。

## 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | 是 | 服务器调用 DeepSeek 的 Key，绝不能提交到 Git |
| `USERS_DB` | 建议 | SQLite 用户数据库路径，默认 `data/users.db` |
| `TRACKING_IDS` | 否 | 数据库不可用时的回退 ID；首次启动会预置 `friend-001/002/003` |
| `ADMIN_TOKEN` | 建议 | 查询用量接口的令牌 |
| `REQUIRE_TRACKING` | 否 | 设为 `1` 强制开启 Tracking ID 校验 |
| `RATE_LIMIT` | 否 | 每个 ID 在时间窗口内的最大请求数，默认 30 |
| `RATE_WINDOW_SECONDS` | 否 | 时间窗口秒数，默认 600 |
| `PORT` | 平台自动 | 监听端口；Render/Railway 会自动注入 |

## 用户数据库

用户表以 `tracking_id` 为主键，首次启动自动创建并预置：

```text
friend-001 / friend-002 / friend-003
```

查看用户：

```bash
curl "https://你的域名/api/admin/users?token=你的ADMIN_TOKEN"
```

新增或停用用户：

```bash
curl -X POST "https://你的域名/api/admin/users?token=你的ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tracking_id":"friend-004","display_name":"朋友四号","active":true}'
```

把 `active` 设为 `false` 即可停用，不需要删除记录。

## 方案一：Render（最快）

1. 把 `free-roleplay` 目录推到一个 GitHub 仓库。
2. 在 Render 新建 **Blueprint**，选择这个仓库，它会读取 `render.yaml`。
3. 在环境变量里填写 `DEEPSEEK_API_KEY`、`TRACKING_IDS`、`ADMIN_TOKEN`。
4. 部署完成后会得到一个 `https://xxx.onrender.com` 地址。
5. 把地址发给朋友，让他们输入 Tracking ID。

注意：Render 免费实例会休眠，第一次打开可能需要等几十秒；`usage.jsonl` 在重新部署后可能丢失，长期统计建议把 `USAGE` 日志接入平台日志或数据库。

## 方案二：任意 VPS（Docker）

在服务器上：

```bash
docker build -t free-roleplay .
docker run -d --name free-roleplay \
  -p 8010:8010 \
  -e DEEPSEEK_API_KEY="sk-你的key" \
  -e TRACKING_IDS="friend-001,friend-002" \
  -e ADMIN_TOKEN="换一个随机长字符串" \
  -e REQUIRE_TRACKING=1 \
  free-roleplay
```

然后在 Nginx 或 Caddy 后面反代到 `127.0.0.1:8010`，并配置 HTTPS。

## 方案三：Railway / Fly.io

直接部署这个目录，构建方式选 Docker；在平台的环境变量里填上面几项即可。

## 验证

健康检查：

```bash
curl https://你的域名/api/health
```

校验 Tracking ID：

```bash
curl -X POST https://你的域名/api/session \
  -H "Content-Type: application/json" \
  -d '{"tracking_id":"friend-001"}'
```

查看用量（需要 `ADMIN_TOKEN`）：

```bash
curl "https://你的域名/api/admin/usage?token=你的ADMIN_TOKEN"
```

## 安全提醒

- 不要把你的 API Key 写进前端、压缩包或 Git。
- `TRACKING_IDS` 只适合小范围朋友使用；如果要公开运营，建议接入登录系统、数据库和更严格的反滥用策略。
- 如果 Key 泄露，立刻到 DeepSeek 平台吊销并更换。
- 免费托管平台的文件系统通常是临时的，`usage.jsonl` 不适合作为唯一账本。
