FROM node

RUN npm install -g gulp 
RUN npm install -g typings

ENTRYPOINT bash -c "cd /app && npm install && gulp watch"