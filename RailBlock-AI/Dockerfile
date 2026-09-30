FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy entire build context unconditionally
COPY . /app/

# Find and install requirements.txt dynamically
RUN find /app -name "requirements.txt" -exec pip install --no-cache-dir -r {} +

EXPOSE 8000

CMD ["sh", "-c", "if [ -f /app/app/main.py ]; then cd /app && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000; else cd /app/backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000; fi"]
