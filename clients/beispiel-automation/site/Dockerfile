# Demo client image — build from repo root:
# docker build -f clients/beispiel-automation/site/Dockerfile -t sbl-web/beispiel-automation .

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/anti-slop/package.json packages/anti-slop/
COPY archetypes/service-local-b2b/package.json archetypes/service-local-b2b/
COPY clients/beispiel-automation/site/package.json clients/beispiel-automation/site/
RUN pnpm install --filter @sbl-web/beispiel-automation...
COPY packages/anti-slop packages/anti-slop
COPY archetypes/service-local-b2b archetypes/service-local-b2b
COPY clients/beispiel-automation clients/beispiel-automation
RUN pnpm --filter @sbl-web/anti-slop start -- ../../clients/beispiel-automation \
  && pnpm --filter @sbl-web/beispiel-automation build

FROM nginx:1.27-alpine
COPY infra/docker-sketch/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/clients/beispiel-automation/site/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
