# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt

RUN apt-get update && apt-get install -y build-essential netcat libpq-dev
RUN pip install --upgrade pip
RUN pip3 install -r requirements.txt

COPY . .

ENTRYPOINT ["/app/entrypoint.sh"]
