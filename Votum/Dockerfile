FROM node:16

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y build-essential netcat libpq-dev
RUN npm install -g nodemon
RUN npm install

EXPOSE 3000