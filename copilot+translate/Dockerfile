#syntax=docker/dockerfile:1.3

##############################
# 全域變數
##############################
ARG NODE_VERSION=23 \
    PNPM_VERSION=9 \
    PNPM_HOME="/usr/local/lib/node_modules/pnpm"

##############################
# 初始化環境
##############################
FROM node:${NODE_VERSION}-slim AS init
ARG PNPM_VERSION \
    PNPM_HOME

WORKDIR /app

# 安裝 pnpm
RUN set -xe; \
    npm install -g pnpm@${PNPM_VERSION}; \
    # 設定全域安裝路徑
    pnpm config set global-bin-dir ${PNPM_HOME}; \
    # 設定 cache 路徑
    pnpm config set store-dir "/usr/local/lib/cache/.pnpm-store" --global

CMD ["tail", "-f", "/dev/null"]

