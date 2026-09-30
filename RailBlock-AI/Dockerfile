FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . /app/

RUN if [ -f "/app/backend/requirements.txt" ]; then \
        pip install --no-cache-dir -r /app/backend/requirements.txt; \
    elif [ -f "/app/requirements.txt" ]; then \
        pip install --no-cache-dir -r /app/requirements.txt; \
    fi

EXPOSE 8000

CMD ["sh", "-c", "if [ -d '/app/backend/app' ]; then cd /app/backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000; else cd /app && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000; fi"]
