FROM node:lts AS build

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/pnpm/store \
    pnpm fetch

COPY package.json ./
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm build


FROM node:lts

WORKDIR /app

RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Needed for Drizzle migrations
COPY --from=build /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/src ./src

EXPOSE 8080

CMD ["sh", "-c", "pnpm db:push && node dist/index.js"]
# CMD [ "node", "dist/index.js" ]
