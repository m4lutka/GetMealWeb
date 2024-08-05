FROM python:3.11.9

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt
COPY ./getmeal /app


WORKDIR /app
EXPOSE 8000

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r /requirements.txt && \
    adduser --disabled-password --no-create-home app && \
    mkdir -p /vol/web/static && \
    mkdir -p /vol/web/media && \
    chown -R app:app /vol && \
    chmod -R 755 /vol 

ENV PATH="/scripts:/py/bin:$PATH"

USER app

