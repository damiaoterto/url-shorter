FROM node:lts-alpine AS builder

WORKDIR /usr/share/app

RUN corepack enable

COPY ./package*.json ./
COPY ./pnpm-lock.yaml ./

RUN pnpm i

COPY ./ ./

RUN pnpm run build

FROM node:lts-alpine

WORKDIR /usr/share/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /usr/share/app/dist ./dist
COPY --from=builder /usr/share/app/package*.json ./
COPY --from=builder /usr/share/app/pnpm-lock.yaml ./

RUN corepack enable
RUN pnpm i --prod
RUN pnpm store prune
RUN pnpm corepack disable

USER node
EXPOSE 3000

CMD ["node", "./dist/main"]