# FREE! 同人剧场

山崎宗介 × 松冈凛的非官方同人对话网页。前端是纸张、网点、粗描边和斜切色块的动画原画风格；后端用 Python 标准库把 DeepSeek 的回复流式转发到浏览器。

> 非官方同人作品，仅供个人学习与交流；角色版权归原作方所有。不要用于商业用途。

## 运行

1. 用 PyCharm 打开 `free-roleplay` 文件夹。
2. 右键 `app.py` → **Run 'app'**。
3. 浏览器会自动打开 <http://127.0.0.1:8010>。

没有第三方依赖，Python 3.10+ 即可。

本地 Tracking ID 配置、自检脚本和常见问题见 [LOCAL_TEST.md](LOCAL_TEST.md)。

### 一键启动（推荐给日常使用）

双击 `start.pyw`，它会：

1. 检查后端是否已经在运行；
2. 没运行就在后台静默启动；
3. 等后端就绪后自动打开网页。

整个过程中不会弹出命令行窗口。也可以为它创建一个桌面快捷方式，之后双击快捷方式即可，不需要先打开 PyCharm。

### 开机自动可用

如果希望电脑开机后网站一直可用，可以把 `start.pyw --no-open` 的快捷方式放进 Windows 启动目录：

1. 按 `Win + R`，输入 `shell:startup`，回车。
2. 在启动目录里新建一个指向 `start.pyw` 的快捷方式，并在参数里加上 `--no-open`。

这样登录 Windows 后后端会静默启动，但不会自动弹出浏览器；之后打开网址就能直接连接。

## Tracking ID 与密钥

托管模式下，**API Key 只放在服务器上，用户只输入 Tracking ID**。

服务器读取 Key 的顺序：

1. 环境变量 `DEEPSEEK_API_KEY`
2. 同目录 `.env` 文件里的 `DEEPSEEK_API_KEY=...`
3. 本机开发时，回退到 `~/.codex/config.toml` 里的 DeepSeek token

用户侧只输入管理员分配的 Tracking ID。允许的 ID 来自：

- 环境变量 `TRACKING_IDS="friend-001,friend-002"`
- 或同目录 `tracking_ids.txt`，每行一个 `id,名字`

本地开发可以这样启动：

```bash
set DEEPSEEK_API_KEY=sk-你的key
set TRACKING_IDS=test-friend-001
python app.py
```

如果既没有 Key 也没有 Tracking ID，本地仍会进入演示模式。托管部署请参考 [DEPLOY.md](DEPLOY.md)。

也可以新建 `.env`：

```env
DEEPSEEK_API_KEY=sk-你的key
DEEPSEEK_MODEL=deepseek-chat
```

`.env` 已加入 `.gitignore`，不会提交到 Git。**不要把 Key 放进前端或压缩包。**

## 已实现的功能

| 优先级 | 功能 | 实现方式 |
| --- | --- | --- |
| P0 | 双人对话流 | 浏览器通过 SSE 接收 DeepSeek 的流式输出 |
| P0 | 角色切换 | 你扮演凛或宗介，AI 自动扮演另一位 |
| P1 | 四个场景预设 | 宿舍夜谈 / 泳池边 / 早晨赖床 / 比赛后 |
| P1 | 语气强度滑杆 | 0–100，影响系统提示词与 temperature |
| P2 | 默契值 / 别扭值 | 根据回复中的关键词自动增减，实时显示 |
| P2 | 回忆触发 | 随机插入同人改写的回忆片段，让 AI 即兴回应 |

## 语音菜单

- 页面右上角“语音” → **自动朗读 / 朗读上一条 / 停止朗读**（浏览器 TTS）。
- **播放本地语音**读取 `audio/` 下你自行提供的授权音频。
- **本地语音彩蛋**在高情绪强度时自动播放本地音频。

本项目不附带动画原声。请勿下载并再分发受版权保护的配音；如果你有合法授权的音频，按 [audio/README.md](audio/README.md) 的文件名放入即可。

## 用户数据库

用户表使用 SQLite，`tracking_id` 是主键，默认路径 `data/users.db`。首次启动会自动建表并预置：

```text
friend-001 / friend-002 / friend-003
```

查看用户：

```bash
curl "http://127.0.0.1:8010/api/admin/users?token=你的ADMIN_TOKEN"
```

新增或停用用户：

```bash
curl -X POST "http://127.0.0.1:8010/api/admin/users?token=你的ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tracking_id":"friend-004","display_name":"朋友四号","active":true}'
```

`active` 设为 `false` 即可停用；记录和用量会保留。

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `app.py` | HTTP 服务器、DeepSeek 流式代理、角色提示词 |
| `index.html` | 页面结构 |
| `style.css` | 原画风视觉、布局与动效 |
| `app.js` | 角色/场景状态、流式渲染、关系值、回忆触发 |

## 想继续改

- 在 `app.py` 的 `CHARACTERS` 里调整人物设定和说话习惯。
- 在 `app.py` 的 `SCENES` 里增加新场景。
- 在 `app.js` 的 `MEMORIES` 里增加同人回忆片段。
- 在 `style.css` 顶部的 `:root` 里换配色。
- 公开部署使用 `Dockerfile` / `render.yaml`，详见 [DEPLOY.md](DEPLOY.md)。

## 给其他人访问

推荐把后端部署到 Render、Railway 或任意 VPS，得到一个 HTTPS 地址。朋友打开这个地址，输入你分配的 Tracking ID 就能使用；他们不需要安装 Python，也不需要自己的 API Key。

部署步骤、环境变量和用量查询见 [DEPLOY.md](DEPLOY.md)。

国内云（阿里云、腾讯云、华为云轻量服务器，或 CloudBase Run / 函数计算）见 [DOMESTIC_DEPLOY.md](DOMESTIC_DEPLOY.md)。

如果只是在同一局域网内测试，可以直接运行 `python app.py`，然后用 `http://本机IP:8010` 访问；但不要把带有 Key 的服务长期暴露在公网。
