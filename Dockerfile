FROM alpine
RUN apk update && apk upgrade
RUN apk add nodejs
RUN apk add --update npm

WORKDIR /user/src/app

ENV PORT 3000

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
