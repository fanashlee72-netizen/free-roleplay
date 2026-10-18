"""把当前代码打包成阿里云部署包。

用法：
    python build_package.py

输出：
    ../dist/free-roleplay-aliyun.zip

不会包含：
    .env / .env.server / .secrets / tracking_ids.txt / usage.jsonl / server.log
"""

from __future__ import annotations

import shutil
import zipfile
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR.parent / "dist"
STAGE_DIR = DIST_DIR / "aliyun-deploy" / "free-roleplay"
ZIP_PATH = DIST_DIR / "free-roleplay-aliyun.zip"

FILES = [
    "app.py",
    "index.html",
    "style.css",
    "app.js",
    "Dockerfile",
    "docker-compose.yml",
    ".env.server.example",
    "deploy-vps.sh",
    "deploy-aliyun-linux.sh",
    "DEPLOY.md",
    "DOMESTIC_DEPLOY.md",
    "ALIYUN_DEPLOY.md",
    "ALIYUN_LINUX_DEPLOY.md",
    "README.md",
    "LOCAL_TEST.md",
    "tracking_ids.example.txt",
    ".dockerignore",
    "audio/README.md",
]


def main() -> None:
    missing = [name for name in FILES if not (BASE_DIR / name).exists()]
    if missing:
        raise SystemExit("缺少文件：" + ", ".join(missing))

    # 只清理本脚本自己的暂存目录，避免误删其他 dist 内容
    if STAGE_DIR.exists():
        shutil.rmtree(STAGE_DIR)
    STAGE_DIR.mkdir(parents=True)

    for name in FILES:
        destination = STAGE_DIR / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(BASE_DIR / name, destination)

    if ZIP_PATH.exists():
        ZIP_PATH.unlink()

    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as archive:
        for name in FILES:
            archive.write(STAGE_DIR / name, f"free-roleplay/{name}")

    print(f"已生成：{ZIP_PATH}")
    print(f"大小：{ZIP_PATH.stat().st_size / 1024:.1f} KB")
    print("提醒：云端 Tracking ID 在服务器的 .env.server 里配置；")
    print("本地的 tracking_ids.txt 和任何 .env / .secrets 都不会被打包。")


if __name__ == "__main__":
    main()
