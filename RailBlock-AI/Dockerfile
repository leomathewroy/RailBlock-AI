FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PATH="/usr/local/bin:${PATH}"

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN if [ -f "requirements.txt" ]; then \
        pip install --no-cache-dir -r requirements.txt; \
    elif [ -f "backend/requirements.txt" ]; then \
        pip install --no-cache-dir -r backend/requirements.txt; \
    fi

EXPOSE 8000

CMD ["sh", "-c", "if [ -d 'backend/app' ]; then cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000; else python -m uvicorn app.main:app --host 0.0.0.0 --port 8000; fi"]
