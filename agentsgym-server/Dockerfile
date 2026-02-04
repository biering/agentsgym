FROM node:20-alpine AS build

WORKDIR /app

# Copy server package first for better layer caching
COPY agentsgym-server/package.json agentsgym-server/package-lock.json* ./agentsgym-server/

WORKDIR /app/agentsgym-server
RUN npm install

# Copy server source
COPY agentsgym-server/ ./

# Copy skills content into the image (default config expects ../content and ../categories.yaml)
COPY skills/ /app/skills/
COPY categories.yaml /app/categories.yaml

RUN npm run build

# Install production deps for the built output (so runtime stage is self-contained)
RUN cd /app/agentsgym-server/.output/server && npm install --omit=dev


FROM node:20-alpine AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8787

WORKDIR /app/agentsgym-server

COPY --from=build /app/agentsgym-server/.output ./.output
COPY --from=build /app/content /app/content
COPY --from=build /app/categories.yaml /app/categories.yaml

EXPOSE 8787

CMD ["node", ".output/server/index.mjs"]

