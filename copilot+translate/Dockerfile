#syntax=docker/dockerfile:1.3

##############################
# 全域變數
##############################
ARG NODE_VERSION=23 \
    PNPM_VERSION=9 \
    PNPM_DIR="/usr/local/lib/node_modules/pnpm"

##############################
# 初始化環境
##############################
FROM node:${NODE_VERSION}-slim AS init
ARG PNPM_VERSION \
    PNPM_DIR

ENV PNPM_HOME=${PNPM_DIR} \
    PATH="${PNPM_DIR}:$PATH"

WORKDIR /app

# 安裝 PNPM
RUN --mount=type=cache,target=/usr/local/cache/.pnpm-store,id=pnpm_store,sharing=locked \
    set -xe; \
    npm i -g pnpm@${PNPM_VERSION}; \
    # 設定全域安裝路徑
    pnpm config set global-bin-dir ${PNPM_HOME}; \
    # 設定快取路徑，一定要指定為全域，不然 PlayWright 會報錯
    pnpm config set store-dir "/usr/local/cache/.pnpm-store" --global;

CMD ["tail", "-f", "/dev/null"]


#######################################################
# 開發環境
#######################################################
FROM node:${NODE_VERSION}-slim AS dev
ARG PNPM_VERSION \
    PNPM_DIR

ENV PNPM_HOME=${PNPM_DIR} \
    PATH="${PNPM_DIR}:$PATH"

WORKDIR /app

# 安裝 PNPM
RUN --mount=type=cache,target=/usr/local/cache/.pnpm-store,id=pnpm_store,sharing=locked \
    set -xe; \
    npm i -g pnpm@${PNPM_VERSION}; \
    # 設定全域安裝路徑
    pnpm config set global-bin-dir ${PNPM_HOME}; \
    # 設定快取路徑，一定要指定為全域，不然 PlayWright 會報錯
    pnpm config set store-dir "/usr/local/cache/.pnpm-store" --global;

# 因為依賴包可能會變動，所以從上面拆出來
RUN --mount=type=cache,target=/usr/local/cache/.pnpm-store,id=pnpm_store,sharing=locked \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    set -xe; \
    pnpm install --frozen-lockfile

# 怕每次都要複製，所以放在最後面
# 使用 .dockerignore 排除不需要的檔案
COPY --chmod=755 . .

CMD ["tail", "-f", "/dev/null"]

