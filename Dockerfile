FROM node:lts-alpine AS builder

WORKDIR /usr/share/app

RUN corepack enable

COPY ./package*.json ./
COPY ./pnpm-lock.yaml ./

RUN pnpm i

COPY ./ ./

RUN pnpm prisma generate
RUN pnpm run build

FROM alpine:latest

RUN apk add --no-cache nodejs pnpm

WORKDIR /usr/share/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /usr/share/app/dist ./dist
COPY --from=builder /usr/share/app/generated ./generated
COPY --from=builder /usr/share/app/package*.json ./
COPY --from=builder /usr/share/app/pnpm-lock.yaml ./

RUN pnpm i --prod
RUN pnpm store prune

RUN apk del pnpm

RUN addgroup --system appgroup && adduser --system --ingroup appgroup urlshorter
USER urlshorter

EXPOSE 3000

CMD ["node", "./dist/main"]
