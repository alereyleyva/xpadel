FROM node:20.17.0-bullseye-slim AS base

WORKDIR /home/node/app

EXPOSE 3000

FROM base AS dev

ENV NODE_ENV=development

USER node

CMD ["yarn", "run" ,"dev"]

FROM base AS prod

COPY ./frontend/package.json ./frontend/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node ./frontend .

RUN yarn run build

RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile

ENV NODE_ENV=production

USER node

CMD ["yarn", "run" ,"start"]
