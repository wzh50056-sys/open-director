# OpenDirector 开发文档

> 本文档对应当前工作区代码，面向接手开发、联调和部署人员。本文不会记录真实 API Key、密码或生产密钥；所有敏感值均使用示例占位符。

## 快速开始

### 环境要求

| 依赖 | 要求 | 用途 |
| --- | --- | --- |
| Node.js | `>=20 <26` | 主站、画布前端和渲染 Worker |
| pnpm | `10.x` | Monorepo 包管理 |
| Go | 由 `services/infinite-canvas/go.mod` 决定 | 无限画布兼容 API |
| MySQL | 8.x | 主站业务数据库 |
| Redis | 7.x，渲染时需要 | BullMQ 任务队列 |
| MinIO 或 S3 | 渲染时需要 | 媒体文件存储 |
| FFmpeg | 渲染 Worker 需要 | 视频和音频处理 |

### 安装依赖

```bash
cd "/Users/xiakaijundepg/Desktop/open-director 2"
pnpm install
pnpm db:generate
```

复制本地环境变量模板，并填写自己的服务密钥：

```bash
cp .env.example .env
```

至少需要配置主站数据库和 LLM：

```env
DATABASE_URL="mysql://USER:PASSWORD@127.0.0.1:3307/opendirector"
DIRECT_URL="mysql://USER:PASSWORD@127.0.0.1:3307/opendirector"
SESSION_SECRET="replace-with-a-long-random-secret"

OPENAI_API_KEY="YOUR_API_KEY"
OPENAI_BASE_URL="https://your-openai-compatible-host.example/v1"
OPENAI_MODEL="YOUR_MODEL_NAME"
```

不要把真实密钥提交到 Git。此前在聊天或截图中暴露过的密钥应在提供商后台撤销并重新生成。

### 启动完整开发环境

```bash
pnpm dev
```

当前 `pnpm dev` 会执行 `scripts/dev-with-mysql.sh`，依次确保或启动：

| 服务 | 默认地址 | 说明 |
| --- | --- | --- |
| 主站 Web | `http://localhost:3002/zh-CN` | OpenDirector 主应用 |
| 无限画布前端 | `http://localhost:3003` | 画布、生图和视频工作台 |
| 无限画布 API | `http://localhost:8080/api/health` | Go + Gin 兼容服务 |
| MySQL | `127.0.0.1:3307` | 主站 Prisma 数据库 |

启动脚本依赖项目根目录现有的 `.mysql-data-runtime-80` 本地数据目录。如果该目录不存在，请自行启动 MySQL，再设置 `OPEN_DIRECTOR_MYSQL_PORT` 或直接分别启动各服务。

### 分别启动服务

```bash
# 终端 1：主站（3002）
pnpm dev:web

# 终端 2：无限画布前端（3003）
pnpm dev:canvas

# 终端 3：无限画布 Go API（8080）
cd services/infinite-canvas
go run .

# 终端 4：渲染 Worker（需要 Redis、S3/MinIO）
pnpm worker
```

## 系统架构

```mermaid
flowchart LR
    user["浏览器用户"]

    subgraph frontend["前端应用"]
        web["主站 Next.js\n:3002"]
        canvas["无限画布 Next.js\n:3003"]
    end

    subgraph backend["服务端"]
        web_api["主站 Route Handlers\nAI 导演 / 批量创作 / 认证"]
        canvas_api["Go + Gin API\n:8080"]
        worker["渲染 Worker\nBullMQ + FFCreator"]
    end

    mysql[("MySQL\nPrisma")]
    canvas_db[("SQLite / MySQL / PostgreSQL")]
    redis[("Redis")]
    s3[("MinIO / S3")]
    ai["OpenAI 兼容 API\nWaveSpeed 等媒体服务"]

    user --> web
    user --> canvas
    web --> web_api
    canvas -->|"/api/* 代理"| canvas_api
    web_api --> mysql
    web_api --> redis
    redis --> worker
    worker --> mysql
    worker --> s3
    canvas_api --> canvas_db
    web_api --> ai
    canvas_api --> ai
```

### 请求路径

1. 主站页面和主站 API 都由 `apps/web` 提供。
2. 主站侧栏中的“无限画布”和“生图工作台”目前直接跳转到 `localhost:3003`。
3. 无限画布前端请求自己的 `/api/*` Route Handler。
4. `apps/infinite-canvas/src/app/api/[...path]/route.ts` 将请求代理到 `API_BASE_URL`，默认是 `http://127.0.0.1:8080`。
5. Go API 负责画布项目、生成记录、素材、用户配置、工作流和 AI 请求。
6. 主站的视频渲染任务进入 Redis，`apps/render` 消费任务并将输出写入 S3/MinIO。

## 目录结构

```text
open-director 2/
├── apps/
│   ├── web/                  # 主站 Next.js 16 应用和 Route Handlers
│   ├── infinite-canvas/      # 无限画布 Next.js 16 应用
│   └── render/               # BullMQ 视频渲染 Worker
├── services/
│   └── infinite-canvas/      # Go + Gin 兼容 API
├── prisma/
│   ├── schema.prisma         # 主站 MySQL 数据模型
│   └── migrations/           # Prisma 迁移
├── scripts/
│   └── dev-with-mysql.sh     # 本地一键启动脚本
├── assets/                   # README 图片、渲染字体等资源
├── docs/                     # 项目开发和接口文档
├── docker-compose.yml        # MySQL、Redis、MinIO、Web、Worker
├── package.json              # 根工作区命令
└── pnpm-workspace.yaml       # pnpm workspace 定义
```

## 主要应用

### 主站 Web

位置：`apps/web`

技术栈：Next.js 16、React 19、TypeScript、Tailwind CSS 4、Prisma、LangChain、LangGraph、BullMQ。

常用页面：

| 路径 | 功能 |
| --- | --- |
| `/zh-CN` | 首页 |
| `/zh-CN/space` | 我的项目 |
| `/zh-CN/chat` | AI 导演台 |
| `/zh-CN/creation/:id` | 创作与分镜编辑 |
| `/zh-CN/batch` | 批量创作 |
| `/zh-CN/templates` | 模板页 |
| `/zh-CN/profile` | 个人中心 |
| `/zh-CN/signin`、`/zh-CN/signup` | 登录与注册 |

主站侧栏入口配置位于：

```text
apps/web/src/components/project-sidebar.tsx
```

### 无限画布前端

位置：`apps/infinite-canvas`

技术栈：Next.js 16、React 19、TypeScript、Tailwind CSS 4、Ant Design 6、Zustand、LocalForage。

| 路径 | 功能 |
| --- | --- |
| `/canvas` | 画布项目库 |
| `/canvas/:id` | 无限画布编辑器 |
| `/image` | 生图工作台 |
| `/video` | 视频创作台 |
| `/prompts` | 提示词库 |
| `/assets` | 我的素材 |
| `/workflows` | 工作流 |
| `/admin/*` | 管理后台 |

顶部导航位于：

```text
apps/infinite-canvas/src/components/layout/app-top-nav.tsx
apps/infinite-canvas/src/components/layout/mobile-nav-drawer.tsx
apps/infinite-canvas/src/constant/navigation-tools.ts
```

### 无限画布 Go API

位置：`services/infinite-canvas`

采用 Gin，默认监听 `8080`。路由入口位于 `services/infinite-canvas/router/router.go`，按 `handler → service → repository → model` 分层。

主要 API 分组：

| 前缀 | 鉴权 | 用途 |
| --- | --- | --- |
| `/api/health` | 无 | 健康检查 |
| `/api/auth/*` | 部分可匿名 | 注册、登录、当前用户 |
| `/api/v1/*` | 用户 JWT | AI、画布任务、文件、工作流、生成记录 |
| `/api/prompts` | 可选登录 | 提示词库 |
| `/api/assets` | 可选登录 | 公共素材 |
| `/api/admin/*` | 管理员 Token | 用户、积分、配置、提示词和素材管理 |

前端统一请求封装位于：

```text
apps/infinite-canvas/src/services/api/
```

### 渲染 Worker

位置：`apps/render`

Worker 从 `RENDER_QUEUE_NAME` 指定的 BullMQ 队列读取任务，使用 FFCreator、FFmpeg 和字体资源生成视频，再写入 S3/MinIO。生产容器通过 `xvfb-run` 提供无头图形环境。

## 数据库

### 主站 MySQL

主站使用 `prisma/schema.prisma`。核心模型包括：

- `User`、`Session`：账号与会话。
- `Thread`、`Message`、`AgentState`：导演对话及 Agent 状态。
- `Recipe`、`Block`：策划方案与分镜块。
- `Asset`、`Upload`、`RenderOutput`：素材和渲染输出。
- `Job`、`ToolCall`：异步任务和工具调用。
- `Batch`：批量创作任务。

常用命令：

```bash
# 生成 Prisma Client
pnpm db:generate

# 开发环境创建并应用迁移
pnpm db:migrate

# 查看当前类型是否正确
pnpm --filter @open-director/web typecheck
```

修改 Schema 后应生成有语义名称的迁移，不要直接修改生产数据库表结构。

### 无限画布数据源

Go 服务默认使用 SQLite：

```env
STORAGE_DRIVER=sqlite
DATABASE_DSN=data/infinite-canvas.db
```

也支持 MySQL 或 PostgreSQL：

```env
STORAGE_DRIVER=mysql
DATABASE_DSN="USER:PASSWORD@tcp(127.0.0.1:3306)/infinite_canvas?parseTime=true"
```

Go 服务的数据模型与主站 Prisma 数据库彼此独立。修改其中一套结构不会自动同步另一套。

## 环境变量

### 主站核心变量

| 变量 | 必需 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `DATABASE_URL` | 是 | 无 | Prisma MySQL 连接串 |
| `DIRECT_URL` | 建议 | 无 | 数据库直连地址 |
| `SESSION_SECRET` | 生产必需 | 示例值 | 会话签名密钥 |
| `OPENAI_API_KEY` | AI 功能必需 | 空 | OpenAI 兼容密钥 |
| `OPENAI_BASE_URL` | 否 | SDK 默认值 | OpenAI 兼容 `/v1` 地址 |
| `OPENAI_MODEL` | 否 | `gpt-4o-mini` | 文本模型 |
| `WAVESPEED_API_KEY` | 媒体生成必需 | 空 | WaveSpeed 密钥 |
| `WAVESPEED_IMAGE_MODEL` | 否 | `nano-banana` | 文生图模型 |
| `WAVESPEED_IMAGE_TO_IMAGE_MODEL` | 否 | 编辑模型默认值 | 参考图编辑模型 |
| `REDIS_HOST` | 渲染必需 | `127.0.0.1` | Redis 地址 |
| `REDIS_PORT` | 否 | `6379` | Redis 端口 |
| `S3_ENDPOINT` | 渲染必需 | `http://localhost:9000` | S3/MinIO 内部地址 |
| `S3_PUBLIC_ENDPOINT` | 渲染必需 | `S3_ENDPOINT` | 浏览器可访问地址 |
| `S3_BUCKET` | 否 | `open-director` | 存储桶 |
| `WORKER_CONCURRENCY` | 否 | `1` | Worker 并发数 |

### 无限画布变量

| 变量 | 必需 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `API_BASE_URL` | 前端可选 | `http://127.0.0.1:8080` | Next.js 到 Go API 的代理目标 |
| `PORT` | 否 | `8080` | Go API 端口 |
| `ADMIN_USERNAME` | 否 | `admin` | 首次创建的管理员账号 |
| `ADMIN_PASSWORD` | 生产必改 | `infinite-canvas` | 默认管理员密码 |
| `JWT_SECRET` | 生产必改 | 启动时可随机生成 | 用户 Token 密钥 |
| `JWT_EXPIRE_HOURS` | 否 | `168` | Token 有效期 |
| `STORAGE_DRIVER` | 否 | `sqlite` | `sqlite`、`mysql` 或 `postgres` |
| `DATABASE_DSN` | 否 | `data/infinite-canvas.db` | Go 服务数据库地址 |
| `PUBLIC_BASE_URL` | 外部媒体回调时必需 | 空 | 外部服务可访问的站点根地址 |

画布的模型与渠道配置还可以通过管理后台或用户配置接口保存，无需把用户密钥硬编码到前端源码。

## API 联调

### 检查 Go API

```bash
curl --fail http://127.0.0.1:8080/api/health
```

成功响应：

```text
ok
```

### 检查画布前端代理

```bash
curl --fail http://127.0.0.1:3003/api/health
```

如果直接访问 8080 正常而 3003 失败，检查 `API_BASE_URL` 和画布 Next.js 开发进程。

### OpenAI 兼容地址

主站的 `OPENAI_BASE_URL` 应填写到 `/v1` 层级，例如：

```env
OPENAI_BASE_URL="https://your-provider.example/v1"
```

密钥只放在服务端环境变量或画布的受控配置存储中，禁止写入客户端组件、截图、Git 提交或公开日志。

## 开发工作流

### 修改主站

```bash
pnpm --filter @open-director/web typecheck
pnpm --filter @open-director/web test
pnpm --filter @open-director/web lint
```

### 修改无限画布

```bash
pnpm --filter @open-director/infinite-canvas typecheck
pnpm --filter @open-director/infinite-canvas format:check
```

注意：`apps/infinite-canvas/next.config.ts` 当前设置了 `typescript.ignoreBuildErrors: true`。这只影响 Next.js 构建，不能替代独立的 `typecheck`。

### 修改渲染服务

```bash
pnpm --filter @open-director/render typecheck
pnpm --filter @open-director/render test
```

### 修改 Go API

```bash
cd services/infinite-canvas
go test ./...
```

提交前建议执行：

```bash
pnpm typecheck
pnpm --filter @open-director/web test
pnpm --filter @open-director/render test
cd services/infinite-canvas && go test ./...
```

## 部署

根目录 `docker-compose.yml` 当前提供：MySQL、Redis、MinIO、主站 Web 和渲染 Worker。它默认读取 `.env.prod`。

```bash
cp .env.example .env.prod
# 修改 .env.prod 中的数据库、会话、对象存储和 AI 密钥
docker compose up --build -d
```

Docker Compose 中主站对外端口为 `3000`，与本地开发的 `3002` 不同。无限画布前端和 Go API 当前不在根 `docker-compose.yml` 的服务清单中，部署时需要单独构建和反向代理。

生产环境至少应完成：

1. 替换 `SESSION_SECRET`、`JWT_SECRET`、管理员密码和所有默认存储凭据。
2. 使用 HTTPS，并让前端、API 和媒体公开地址使用同一受信任域名体系。
3. 将主站侧栏中的本地画布地址改为环境变量驱动，避免生产环境仍跳转 `localhost:3003`。
4. 限制 MySQL、Redis、MinIO 管理端口的公网访问。
5. 为 MySQL、画布数据库和对象存储设置备份策略。

## 常见问题

### 主站出现 PrismaClientInitializationError

检查 MySQL 是否监听 3307，以及 `.env` 中 `DATABASE_URL` 是否指向本机而不是 Docker 服务名 `mysql`：

```bash
nc -z 127.0.0.1 3307
pnpm db:generate
```

本地开发通常使用 `127.0.0.1:3307`；Docker 容器内部使用 `mysql:3306`。

### 画布页面请求一直等待

依次检查：

```bash
curl --fail http://127.0.0.1:8080/api/health
curl --fail http://127.0.0.1:3003/api/health
```

如果 8080 未启动，在 `services/infinite-canvas` 运行 `go run .`。如果 8080 正常而 3003 不正常，检查 `API_BASE_URL`。

### Next.js 出现 hydration mismatch

不要在组件首次渲染时直接使用 `window`、`localStorage`、`Date.now()` 或随机数生成会进入 HTML 的属性。服务端和浏览器首屏必须一致；浏览器专属状态应在 `useEffect` 中恢复。

### 生成任务很慢或没有后续

检查以下链路：

1. 文本模型地址、模型名和密钥是否可用。
2. 媒体提供商是否返回任务 ID。
3. 浏览器请求是否停在 3003 的代理层。
4. Go API 日志是否有上游超时或鉴权错误。
5. 主站渲染任务是否已进入 Redis，Worker 是否在线。

### 端口被占用

```bash
lsof -nP -iTCP:3002 -sTCP:LISTEN
lsof -nP -iTCP:3003 -sTCP:LISTEN
lsof -nP -iTCP:8080 -sTCP:LISTEN
lsof -nP -iTCP:3307 -sTCP:LISTEN
```

先确认进程归属，再停止对应开发服务；不要直接结束不明进程。

## 维护依据

本文档内容来自以下可复核代码路径：

| Evidence | Finding | Path |
| --- | --- | --- |
| 根脚本与 workspace 配置 | 开发环境由 pnpm Monorepo 编排 | `package.json`、`pnpm-workspace.yaml` |
| 本地启动脚本 | 默认启动 3002、3003、8080 和 3307 | `scripts/dev-with-mysql.sh` |
| 应用清单 | 三个 Node 应用及其真实命令 | `apps/*/package.json` |
| Prisma Schema | 主站使用 MySQL，核心业务实体由 Prisma 管理 | `prisma/schema.prisma` |
| Go 配置与路由 | 画布 API 默认 8080，支持多种数据库 | `services/infinite-canvas/config/config.go`、`router/router.go` |
| Next.js 代理 | 画布 `/api/*` 默认转发到 8080 | `apps/infinite-canvas/src/app/api/[...path]/route.ts` |
| Compose 配置 | 生产包含 MySQL、Redis、MinIO、Web 和 Worker | `docker-compose.yml` |

当启动命令、端口、环境变量或服务拓扑变化时，应同步更新本文档。
