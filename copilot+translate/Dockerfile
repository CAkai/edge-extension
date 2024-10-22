#syntax=docker/dockerfile:1.3

##############################
# 全域變數
##############################
ARG NODE_VERSION=23 \
    PNPM_VERSION=9

FROM node:${NODE_VERSION}-slim
ARG PNPM_VERSION

WORKDIR /app

# 安裝 PNPM
RUN --mount=type=cache,target=/usr/local/cache/.pnpm-store,id=pnpm_store,sharing=locked \
    set -xe; \
    npm i -g pnpm@${PNPM_VERSION};

# 怕每次都要複製，所以放在最後面
# 使用 .dockerignore 排除不需要的檔案
COPY --chmod=755 . .

CMD ["tail", "-f", "/dev/null"]

