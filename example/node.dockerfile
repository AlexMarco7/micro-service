FROM node

ARG INDEX

VOLUME /app
WORKDIR /app

RUN apt-get install -y git

RUN npm install supervisor -g

EXPOSE 8080
EXPOSE 5858

RUN npm install;

ENTRYPOINT supervisor /app/app.js