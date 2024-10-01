FROM node:20.17.0-bullseye-slim AS base

WORKDIR /app

COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./frontend .

FROM base AS dev

ENV NODE_ENV=development

CMD ["yarn", "run" ,"dev"]

FROM base AS prod

ENV NODE_ENV=production

RUN yarn run build

RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile

CMD ["yarn", "run" ,"start"]