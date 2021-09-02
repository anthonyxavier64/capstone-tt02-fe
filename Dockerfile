FROM node:12-alpine
RUN apk update && apk add python make g++ && rm -rf /var/cache/apk/

WORKDIR /src/app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install

COPY . ./

EXPOSE 4200

RUN apk del python make g++

CMD ["ng","serve","--host", "0.0.0.0", "--disable-host-check"]