# 本地测试与确认

## 1. 配置本地 Tracking ID

本地正式来源是 **SQLite 用户表** `data/users.db`。首次启动会自动建表并预置：

```text
friend-001,朋友一号
friend-002,朋友二号
friend-003,朋友三号
```

`tracking_ids.txt` 只在数据库不可用时作为回退，不再是主配置。

数据库默认路径：

```env
USERS_DB=data/users.db
```

也可以用 `.env` 覆盖：

```env
USERS_DB=data/users.db
```

修改后需要重启 `app.py`，因为 ID 列表是在请求时读取的，但重启最稳妥。

## 2. 启动

```bash
python app.py
```

浏览器打开 <http://127.0.0.1:8010>，输入 `friend-001`。

如果想本地测试管理员用户接口，在 `.env` 里加：

```env
ADMIN_TOKEN=local-admin-test
```

重启 `app.py` 后访问 `/api/admin/users?token=local-admin-test`。

## 3. 一键自检

```bash
python check_local.py friend-001
```

它会依次检查：

1. `/api/health` 是否正常；
2. `friend-001` 是否能通过 `/api/session`；
3. 用“校园祭”场景发一条测试消息，打印流式事件。

如果最后能看到 `data: {"delta": ...}`，说明本地链路完整。

## 4. 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `403 Tracking ID 无效` | ID 不在 `tracking_ids.txt` 或 `.env` | 加入 ID 并重启 |
| `503 服务器尚未配置 Key` | 没有可用的 DeepSeek Key | 设置 `DEEPSEEK_API_KEY` 或 `.env` |
| `UnicodeEncodeError` | Key 里混入了中文/全角字符 | 重新粘贴纯 ASCII 的 `sk-...` |
| `未连接` | 本地 `app.py` 没运行 | 启动 `app.py`，页面会自动重连 |
| 页面没有新功能 | 浏览器缓存或服务没重启 | `Ctrl+F5`，重启 `app.py` |
| 想加新用户 | 用户表现在是主来源 | 用管理员接口或直接改数据库 |

## 5. 确认后再部署

本地自检通过后，再打包并更新云端。云端用的是 `.env.server` 里的 `TRACKING_IDS`，不要把本地的 `tracking_ids.txt` 当云端配置。

生成部署包：

```bash
python build_package.py
```

输出：

```text
../dist/free-roleplay-aliyun.zip
```

这个脚本只会打包代码和部署文件，不会包含：

- `.env`
- `.env.server`
- `.secrets/`
- `tracking_ids.txt`
- `usage.jsonl`
- `server.log`

## 6. 语音菜单

页面右上角的“语音”菜单支持：

- **自动朗读**：用浏览器 TTS 朗读 AI 回复；请在 Edge/Chrome 中测试，Codex 内嵌浏览器可能不支持 `speechSynthesis`。
- **朗读上一条 / 停止朗读**：手动控制。
- **播放本地语音**：播放 `audio/` 目录中你自行放入的授权音频。
- **本地语音彩蛋**：情绪强度较高时自动播放本地音频。

没有音频文件时，“播放本地语音”会提示你把文件放到 `audio/`。文件名和版权说明见 [audio/README.md](audio/README.md)。
