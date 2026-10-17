FROM python:3.12-slim

WORKDIR /app

COPY app.py index.html style.css app.js ./

ENV HOST=0.0.0.0 \
    PORT=8010 \
    PYTHONUNBUFFERED=1

EXPOSE 8010

CMD ["python", "app.py"]
