"""FREE! 同人对话剧场 · 本地服务器。

无需第三方依赖，直接使用 Python 标准库：
    python app.py

接口密钥读取顺序：
    1. 环境变量 DEEPSEEK_API_KEY
    2. 同目录 .env 文件里的 DEEPSEEK_API_KEY
    3. ~/.codex/config.toml 里的 DeepSeek token（仅本机方便使用）

没有密钥时会自动进入演示模式，页面仍然可以体验。
"""

from __future__ import annotations

import json
import os
import re
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from collections import deque
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8010"))
MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-chat")
API_URL = os.environ.get(
    "DEEPSEEK_API_URL", "https://api.deepseek.com/chat/completions"
)
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "").strip()
REQUIRE_TRACKING = os.environ.get("REQUIRE_TRACKING", "").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}
RATE_LIMIT = max(1, int(os.environ.get("RATE_LIMIT", "30")))
RATE_WINDOW_SECONDS = max(10, int(os.environ.get("RATE_WINDOW_SECONDS", "600")))
USAGE_FILE = Path(
    os.environ.get("USAGE_FILE", str(BASE_DIR / "usage.jsonl"))
).expanduser()

MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".json": "application/json; charset=utf-8",
}

CHARACTERS = {
    "sousuke": {
        "name": "山崎宗介",
        "short": "宗介",
        "kana": "YAMAZAKI SOUSUKE",
        "profile": (
            "鲛柄学园水泳部成员，专攻仰泳。身材高大，表情不多，说话直接，"
            "习惯用短句和停顿。因为肩伤对未来有焦虑，却不愿让任何人担心，"
            "尤其不想让凛看出自己的逞强。对凛有很深的默契与执念，"
            "常以若有若无的调侃掩饰关心。平时叫凛“松冈”，认真时才会叫“凛”。"
        ),
    },
    "rin": {
        "name": "松冈凛",
        "short": "凛",
        "kana": "MATSUOKA RIN",
        "profile": (
            "鲛柄学园水泳部成员，专攻自由泳与蝶泳，目标是世界舞台。"
            "胜负心极强，表面火爆、嘴硬，实则非常重感情。对宗介的肩伤"
            "既生气又担心，常用“哼”“少啰嗦”“别自作主张”掩饰真实情绪，"
            "但关键时刻会说出很坦率的话。称呼宗介为“宗介”。"
        ),
    },
}

SCENES = {
    "dorm": {
        "name": "宿舍夜谈",
        "kana": "MIDNIGHT DORM",
        "description": "熄灯后的鲛柄学园 302 宿舍，窗外有虫鸣，桌上还摊着训练计划。",
    },
    "pool": {
        "name": "泳池边",
        "kana": "POOL SIDE",
        "description": "夜晚的鲛柄学园室内泳池，水面映着灯光，池边只剩你们两个人。",
    },
    "morning": {
        "name": "早晨赖床",
        "kana": "LAZY MORNING",
        "description": "早晨的宿舍，闹钟已经响过三遍，阳光从窗帘缝里钻进来。",
    },
    "after_race": {
        "name": "比赛后",
        "kana": "AFTER THE RACE",
        "description": "比赛结束后的看台通道，人群还没散尽，空气里有消毒水和汗水的气味。",
    },
}

DEMO_REPLIES = {
    "sousuke": [
        "（把毛巾搭在肩上，抬眼看你）……这么晚还不睡。明天训练起不来，可别来找我。",
        "（拧开一瓶水，递过来）先喝水。刚才那组，你的节奏乱了。",
        "（靠在池边，水面晃了晃）别逞强。你那种游法，肩膀迟早会抗议。",
    ],
    "rin": [
        "（把泳镜往额头上一推）哼，少在那儿装镇定。刚才那组，你明明也认真了。",
        "（毛巾往脖子上一挂）别自作主张。我的事，我自己会处理。",
        "（盯着你看了一会儿，声音低下来）……下次别一个人扛着。",
    ],
}


def load_api_key() -> str | None:
    key = os.environ.get("DEEPSEEK_API_KEY", "").strip()
    if key:
        return key

    env_file = BASE_DIR / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("DEEPSEEK_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")

    codex_config = Path.home() / ".codex" / "config.toml"
    if codex_config.exists():
        match = re.search(
            r'experimental_bearer_token\s*=\s*"([^"]+)"',
            codex_config.read_text(encoding="utf-8", errors="replace"),
        )
        if match:
            return match.group(1)

    return None


def load_tracking_ids() -> dict[str, str]:
    """读取允许的 Tracking ID。

    优先读环境变量 TRACKING_IDS（逗号分隔，可写成 id:名字），
    其次读同目录 tracking_ids.txt，每行一个 id 或 id,名字。
    """
    raw = os.environ.get("TRACKING_IDS", "").strip()
    if raw:
        items = raw.split(",")
    else:
        path = BASE_DIR / "tracking_ids.txt"
        if not path.exists():
            return {}
        items = [
            line.strip()
            for line in path.read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.strip().startswith("#")
        ]

    result: dict[str, str] = {}
    for item in items:
        item = item.strip()
        if not item:
            continue
        if "," in item:
            tracking_id, name = item.split(",", 1)
        elif ":" in item:
            tracking_id, name = item.split(":", 1)
        else:
            tracking_id, name = item, ""
        tracking_id = tracking_id.strip()
        if tracking_id:
            result[tracking_id] = name.strip()
    return result


def tracking_required() -> bool:
    return REQUIRE_TRACKING or bool(load_tracking_ids())


_rate_lock = threading.Lock()
_rate_buckets: dict[str, deque] = {}


def rate_ok(tracking_id: str) -> bool:
    now = time.time()
    with _rate_lock:
        bucket = _rate_buckets.setdefault(tracking_id, deque())
        while bucket and now - bucket[0] > RATE_WINDOW_SECONDS:
            bucket.popleft()
        if len(bucket) >= RATE_LIMIT:
            return False
        bucket.append(now)
        return True


_usage_lock = threading.Lock()


def log_usage(tracking_id: str, payload: dict, chars: int, status: str = "ok") -> None:
    if not tracking_id:
        return
    record = {
        "time": datetime.now(timezone.utc).isoformat(),
        "tracking_id": tracking_id,
        "scene": payload.get("scene", ""),
        "chars": chars,
        "status": status,
    }
    line = json.dumps(record, ensure_ascii=False)
    print(f"USAGE {line}", flush=True)
    try:
        with _usage_lock:
            USAGE_FILE.parent.mkdir(parents=True, exist_ok=True)
            with USAGE_FILE.open("a", encoding="utf-8") as handle:
                handle.write(line + "\n")
    except OSError:
        # 某些托管平台的文件系统是只读的，日志仍然会输出到平台控制台
        pass


def usage_summary() -> dict:
    summary: dict[str, dict] = {}
    if not USAGE_FILE.exists():
        return summary
    for line in USAGE_FILE.read_text(encoding="utf-8").splitlines():
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        tracking_id = record.get("tracking_id", "")
        if not tracking_id:
            continue
        item = summary.setdefault(
            tracking_id, {"requests": 0, "chars": 0, "last_used": None}
        )
        item["requests"] += 1
        item["chars"] += int(record.get("chars", 0))
        item["last_used"] = record.get("time")
    return summary


def build_system_prompt(payload: dict) -> str:
    user_role = payload.get("user_role", "rin")
    if user_role not in CHARACTERS:
        user_role = "rin"
    ai_role = "sousuke" if user_role == "rin" else "rin"

    scene_key = payload.get("scene", "dorm")
    scene = SCENES.get(scene_key, SCENES["dorm"])
    intensity = max(0, min(100, int(payload.get("intensity", 35))))
    stats = payload.get("stats") or {}
    rapport = max(0, min(100, int(stats.get("rapport", 42))))
    awkward = max(0, min(100, int(stats.get("awkward", 58))))

    ai = CHARACTERS[ai_role]
    user = CHARACTERS[user_role]

    tone = (
        "偏斗嘴：可以互损、抬杠、故意说反话，但不要真的伤人。"
        if intensity < 35
        else "半推半就：嘴上不饶人，行动上却会照顾对方。"
        if intensity < 70
        else "偏温柔：少一些刺，多一些坦白和关心，允许短暂的沉默和示弱。"
    )

    relationship_note = (
        "两人默契很高，很多话不用说完对方就懂。"
        if rapport >= 70
        else "两人默契还在，但偶尔会错过彼此真正想表达的意思。"
        if rapport >= 40
        else "两人之间有些生疏，容易把关心说成挑衅。"
    )
    awkward_note = (
        "别扭值很高：遇到真心话时会转移话题、嘴硬或故意岔开。"
        if awkward >= 65
        else "别扭值中等：会短暂别扭，但很快回到熟悉的相处方式。"
        if awkward >= 35
        else "别扭值很低：即使不习惯，也愿意把话说开。"
    )

    return f"""你在进行一场《Free! 男子游泳部》的非官方同人角色扮演。

【你扮演】{ai["name"]}（{ai["kana"]}）
{ai["profile"]}

【用户扮演】{user["name"]}

【关系】两人从小在岩鸢一起长大，是彼此最了解的对手和搭档，现在同属鲛柄学园水泳部。
宗介的肩伤是两人之间没有完全说开的心结。互动基调是互相拆台、暗中照顾、无需多言的默契。
{relationship_note}
{awkward_note}

【当前场景】{scene["name"]}：{scene["description"]}

【语气强度】{intensity}/100。{tone}

【写作规则】
1. 只写{ai["name"]}的台词与动作，绝不替用户说话或替用户做决定。
2. 用中文回复，2 到 4 句，简短有力；动作放在全角括号（）里。
3. 保持人物性格与说话习惯，可以夹少量日语语气词，但不要整段日文。
4. 不要大段复述或引用原作台词；可以化用角色气质，但对话必须是新写的。
5. 全年龄向：不写恋爱、性暗示、暴力细节；重点是友情、竞争、游泳与日常。
6. 不要跳出角色，不要解释你是 AI，不要输出分析或括号外的旁白。
7. 不要连续重复上一轮的开头或动作，让对话自然推进。"""


def clamp(value: int) -> int:
    return max(0, min(100, value))


def calc_stats(reply: str, payload: dict) -> dict:
    stats = payload.get("stats") or {}
    rapport = int(stats.get("rapport", 42))
    awkward = int(stats.get("awkward", 58))
    intensity = int(payload.get("intensity", 35))

    warm_words = [
        "一起",
        "谢谢",
        "相信",
        "没事",
        "我在",
        "别逞强",
        "小心",
        "等我",
        "不错",
        "加油",
        "笑",
        "不介意",
        "撑得住",
        "陪你",
        "交给我",
        "当然",
        "说好",
        "约定",
        "下次",
    ]
    sharp_words = [
        "笨蛋",
        "吵死了",
        "少啰嗦",
        "别管",
        "哼",
        "麻烦",
        "幼稚",
        "自作主张",
        "闭嘴",
        "别过脸",
        "突然说什么",
        "谁要",
        "才不是",
    ]

    rapport += sum(1 for word in warm_words if word in reply)
    awkward += sum(1 for word in sharp_words if word in reply)

    if intensity >= 70:
        rapport += 1
    if intensity < 30:
        awkward += 1

    return {"rapport": clamp(rapport), "awkward": clamp(awkward)}


def demo_stream(payload: dict):
    ai_role = "sousuke" if payload.get("user_role") == "rin" else "rin"
    reply = DEMO_REPLIES[ai_role][int(time.time()) % len(DEMO_REPLIES[ai_role])]
    yield {"demo": True}
    for index in range(0, len(reply), 3):
        yield {"delta": reply[index : index + 3]}
        time.sleep(0.05)
    yield {"stats": calc_stats(reply, payload)}
    yield {"done": True}


def api_stream(payload: dict, key: str):
    system_prompt = build_system_prompt(payload)
    messages = [{"role": "system", "content": system_prompt}]

    for item in (payload.get("history") or [])[-16:]:
        role = item.get("role")
        content = str(item.get("content", ""))[:4000]
        if role in {"user", "assistant"} and content:
            messages.append({"role": role, "content": content})

    user_message = str(payload.get("message", "")).strip()[:4000]
    if user_message:
        messages.append({"role": "user", "content": user_message})

    intensity = max(0, min(100, int(payload.get("intensity", 35))))
    temperature = round(0.55 + (100 - intensity) / 100 * 0.35, 2)

    body = {
        "model": MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 420,
        "stream": True,
    }

    request = urllib.request.Request(
        API_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {key}",
            "Accept": "text/event-stream",
        },
        method="POST",
    )

    full_text = []
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            for raw_line in response:
                line = raw_line.decode("utf-8", "replace").strip()
                if not line.startswith("data:"):
                    continue
                data = line[5:].strip()
                if data == "[DONE]":
                    break
                try:
                    obj = json.loads(data)
                except json.JSONDecodeError:
                    continue
                choices = obj.get("choices") or []
                if not choices:
                    continue
                delta = choices[0].get("delta") or {}
                content = delta.get("content")
                if content:
                    full_text.append(content)
                    yield {"delta": content}
    except urllib.error.HTTPError as error:
        detail = error.read(300).decode("utf-8", "replace")
        yield {"error": f"DeepSeek 返回 HTTP {error.code}：{detail}"}
        return
    except Exception as error:  # noqa: BLE001
        yield {"error": f"连接 DeepSeek 失败：{type(error).__name__}"}
        return

    reply = "".join(full_text).strip()
    if reply:
        yield {"stats": calc_stats(reply, payload)}
    yield {"done": True}


def tracked_stream(stream, tracking_id: str, payload: dict):
    chars = 0
    try:
        for event in stream:
            delta = event.get("delta")
            if delta:
                chars += len(delta)
            yield event
    finally:
        log_usage(tracking_id, payload, chars)


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.0"

    def log_message(self, fmt, *args):
        print(f"[{self.log_date_time_string()}] {fmt % args}")

    def send_json(self, status: int, payload: dict):
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        if path == "/api/health":
            key = load_api_key()
            ids = load_tracking_ids()
            self.send_json(
                200,
                {
                    "ok": True,
                    "model": MODEL,
                    "demo": not bool(key),
                    "hosted": tracking_required(),
                    "requires_tracking": tracking_required(),
                    "tracking_count": len(ids),
                },
            )
            return

        if path == "/api/admin/usage":
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            token = (query.get("token") or [""])[0]
            if not ADMIN_TOKEN or token != ADMIN_TOKEN:
                self.send_json(403, {"error": "forbidden"})
                return
            ids = load_tracking_ids()
            self.send_json(
                200,
                {
                    "usage": usage_summary(),
                    "tracking_ids": ids,
                    "rate_limit": {
                        "requests": RATE_LIMIT,
                        "window_seconds": RATE_WINDOW_SECONDS,
                    },
                },
            )
            return

        if path == "/":
            path = "/index.html"

        target = (BASE_DIR / path.lstrip("/")).resolve()
        if not str(target).startswith(str(BASE_DIR)) or not target.is_file():
            self.send_json(404, {"error": "not found"})
            return

        data = target.read_bytes()
        self.send_response(200)
        self.send_header(
            "Content-Type", MIME_TYPES.get(target.suffix.lower(), "application/octet-stream")
        )
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path

        if path == "/api/session":
            try:
                length = int(self.headers.get("Content-Length", "0"))
                payload = json.loads(self.rfile.read(length).decode("utf-8"))
            except Exception:
                self.send_json(400, {"error": "invalid json"})
                return

            tracking_id = str(payload.get("tracking_id", "")).strip()
            ids = load_tracking_ids()
            if not ids:
                self.send_json(
                    200, {"ok": True, "name": "", "tracking_required": False}
                )
                return
            if tracking_id not in ids:
                self.send_json(403, {"error": "Tracking ID 无效或已被停用"})
                return
            self.send_json(
                200,
                {
                    "ok": True,
                    "name": ids[tracking_id],
                    "tracking_required": True,
                },
            )
            return

        if path != "/api/chat":
            self.send_json(404, {"error": "not found"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            self.send_json(400, {"error": "invalid json"})
            return

        tracking_id = ""
        if tracking_required():
            tracking_id = str(payload.get("tracking_id", "")).strip()
            ids = load_tracking_ids()
            if tracking_id not in ids:
                self.send_json(403, {"error": "Tracking ID 无效或已被停用"})
                return
            if not rate_ok(tracking_id):
                minutes = max(1, RATE_WINDOW_SECONDS // 60)
                self.send_json(
                    429,
                    {"error": f"请求太频繁，请约 {minutes} 分钟后再试"},
                )
                return

        key = load_api_key()
        if not key and tracking_required():
            self.send_json(503, {"error": "服务器尚未配置 DEEPSEEK_API_KEY"})
            return
        stream = api_stream(payload, key) if key else demo_stream(payload)
        if tracking_id:
            stream = tracked_stream(stream, tracking_id, payload)

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Accel-Buffering", "no")
        self.send_header("Connection", "close")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

        for event in stream:
            frame = f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
            try:
                self.wfile.write(frame.encode("utf-8"))
                self.wfile.flush()
            except (BrokenPipeError, ConnectionResetError):
                break


def main():
    url = f"http://{HOST}:{PORT}"
    print(f"FREE! 同人对话剧场：{url}")
    print(
        "Tracking 模式："
        + ("开启" if tracking_required() else "关闭（本地开发）")
    )
    print("按 Ctrl+C 停止。")
    if HOST in {"127.0.0.1", "localhost"} and os.environ.get("NO_BROWSER") != "1":
        try:
            webbrowser.open(url)
        except Exception:
            pass
    try:
        with ThreadingHTTPServer((HOST, PORT), Handler) as server:
            server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止。")
    except OSError as error:
        print(f"启动失败：{error}")
        print(f"端口 {PORT} 可能被占用，可以设置环境变量 PORT 换一个端口。")


if __name__ == "__main__":
    main()
