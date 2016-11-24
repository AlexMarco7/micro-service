FROM node

VOLUME /app
WORKDIR /app

RUN apt-get install -y git

RUN npm install supervisor -g

EXPOSE 8080
EXPOSE 5858
EXPOSE 9229

ENTRYPOINT bash -c "supervisor --debug --inspect app.js "  