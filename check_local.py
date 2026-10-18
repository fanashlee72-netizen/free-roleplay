"""本地自检：健康检查、Tracking ID 校验、一次流式对话。

用法：
    python check_local.py
    python check_local.py friend-001

先确保本地 app.py 正在运行（默认 http://127.0.0.1:8010）。
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

BASE_URL = "http://127.0.0.1:8010"
TRACKING_ID = sys.argv[1] if len(sys.argv) > 1 else "friend-001"


def request(method: str, path: str, payload: dict | None = None):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        BASE_URL + path,
        data=data,
        headers={"Content-Type": "application/json"},
        method=method,
    )
    return urllib.request.urlopen(req, timeout=60)


def main() -> None:
    print(f"检查 {BASE_URL}，Tracking ID：{TRACKING_ID}")

    try:
        with request("GET", "/api/health") as response:
            print("health:", response.status, response.read().decode("utf-8"))
    except Exception as error:  # noqa: BLE001
        print("health 失败：", type(error).__name__, error)
        print("请先运行：python app.py")
        return

    try:
        with request(
            "POST", "/api/session", {"tracking_id": TRACKING_ID}
        ) as response:
            print("session:", response.status, response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        print(
            "session 失败：",
            error.code,
            error.read().decode("utf-8", "replace"),
        )
        return

    payload = {
        "tracking_id": TRACKING_ID,
        "user_role": "rin",
        "era": "high_school",
        "scene": "festival",
        "scene_name": "鲛柄校园祭",
        "scene_description": "校园祭的夜晚，摊位和灯光挤满走廊，远处传来太鼓和笑声。",
        "intensity": 40,
        "stats": {"rapport": 42, "awkward": 58},
        "history": [],
        "message": "宗介，校园祭要不要一起去逛逛？",
    }

    print("chat:")
    try:
        with request("POST", "/api/chat", payload) as response:
            for index, raw in enumerate(response):
                print(" ", raw.decode("utf-8", "replace").strip())
                if index >= 16:
                    break
    except urllib.error.HTTPError as error:
        print("chat 失败：", error.code, error.read().decode("utf-8", "replace"))
    except Exception as error:  # noqa: BLE001
        print("chat 失败：", type(error).__name__, error)


if __name__ == "__main__":
    main()
