FROM node:current-alpine

WORKDIR /usr/local/app

RUN apk add --no-cache tini

RUN npm i -g webpack webpack-cli

COPY package.json package-lock.json* yarn.lock* ./

RUN yarn install && yarn cache clean --force

COPY . .

ENTRYPOINT [ "/sbin/tini", "--" ]

ENV NODE_ENV=production

RUN yarn build

CMD [ "yarn", "start" ]
