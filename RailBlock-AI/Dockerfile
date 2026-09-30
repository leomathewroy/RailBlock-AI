FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy entire build context
COPY . /app/

# Iterate and install requirements files individually with -r
RUN for f in $(find /app -name "requirements.txt"); do pip install --no-cache-dir -r "$f"; done

EXPOSE 8000

# Dynamically locate app/main.py directory and start uvicorn
CMD ["sh", "-c", "MAIN=$(find /app -name main.py | head -n 1); APP_DIR=$(dirname $(dirname $MAIN)); cd $APP_DIR && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"]
