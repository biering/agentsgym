FROM node:22-alpine AS build
WORKDIR /app

COPY server/package.json ./server/package.json
WORKDIR /app/server
RUN npm install

COPY server/ ./
COPY skills/ /app/skills/
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app/server
ENV NODE_ENV=production

COPY --from=build /app/server/.output ./.output
COPY --from=build /app/skills /app/skills

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

