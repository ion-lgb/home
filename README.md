# Guobin Li · Personal Home

一个前端可直接部署的个人主页 + 管理后台组合，聚焦展示创意开发者的作品、能力矩阵以及内容沉淀。当前项目包含两套实现：

- `cms-portal/` —— **Next.js 14 + Prisma + MySQL** 的全栈应用，带登录后台、数据库持久化、API，可扩展为生产级 CMS。
- 根目录旧版 `index.html` + `admin.html` —— 原生静态版，可继续作为 Demo 使用。

## ✨ 亮点功能
- **Next.js CMS**：`cms-portal/` 提供完整的前后台，使用 Next.js App Router、Prisma、MySQL，带登录 + JWT 会话、API、数据库模式，逻辑上类似现代版 WordPress。
- **沉浸式展示**：Apple 风格的主页布局，主视觉图集 + 渐变面板 + 滚动区块，SSR 渲染，部署后首屏可直接读取数据库内容。
- **内容管理**：React 后台支持 Hero/指标/能力/项目/文章/社交等模块的增删改、动态表单、表单验证，一次保存即可写入数据库并更新前台。
- **传统静态版**：保留 `index.html` + `admin.html` 版本，可当作纯静态备份或离线体验。

## 🧱 技术栈
- 原生 HTML5 + ES Modules
- Tailwind CSS CDN 配置（light/dark theme + 自定义 brand/accent palette）
- Intersection Observer、Canvas 粒子背景、表单 mailto 集成

## 📁 项目结构
```
.
├── cms-portal             # Next.js 14 全栈 CMS
│   ├── package.json
│   ├── prisma/            # Prisma schema + seed 脚本
│   ├── src/app            # App Router：前台、后台、API
│   └── src/lib|types      # Prisma helper、默认内容、类型
├── server/                # 旧版 Express + SQLite API（可选）
├── index.html/admin.html  # 原生静态版
└── assets/js              # 静态版脚本
```

## 🚀 快速开始
### Next.js CMS（推荐）
1. 准备环境变量：复制 `cms-portal/.env.example` 为 `.env`，把 `DATABASE_URL` 换成你的 MySQL 连接串（如 `mysql://user:pass@host:3306/dbname`），并配置 `AUTH_SECRET`、默认管理员账号。
   > **注意**：先在 MySQL 中创建好数据库（空库即可），并保证具备建表权限。
2. 安装依赖并初始化数据库（首次执行）：
   ```bash
   cd cms-portal
   npm install
   npx prisma migrate dev --name init
   npm run seed
   ```
3. 启动开发模式：
   ```bash
   npm run dev
   ```
   - 前台访问：`http://localhost:3000`
   - 后台访问：`http://localhost:3000/admin`，使用 `.env` 中的管理员账号登录。

### 旧版静态站（可选）
1. （可选）启用 `server/` 下的 Express + SQLite API（用于静态版远程同步）：
   ```bash
   cd server
   npm install
   npm run start # 默认监听 http://localhost:4000
   ```
   然后在 `assets/js/syncConfig.js` 中开启 `enabled` 即可让静态版共享内容。
2. 启动静态站点：
   ```bash
   cd /path/to/home
   python3 -m http.server 4173
   ```
3. 前台 `http://localhost:4173/index.html`，后台 `http://localhost:4173/admin.html`。

> 如果需要默认值与自定义内容在多设备同步，可将 `localStorage` 替换为简单后端 API 或远程 KV。

## 🛠 自定义建议
- **Next.js CMS**：在 `cms-portal/src/app` 中调整页面布局即可更新前台，后台表单可根据业务扩展 React 组件或拆分为多页；`prisma/schema.prisma` 可继续扩表以支持更多模型。
- **文案/数据**：可在后台直接编辑，或修改 `assets/js/contentStore.js` 里的 `defaultContent` 默认数据。
- **样式**：Tailwind 通过 CDN 注入，可直接在 `index.html` / `admin.html` 的 `tailwind.config` 或 `<style>` 中修改品牌色、组件圆角等。
- **表单**：目前使用 `mailto:`，可接入 Formspree/Supabase/自建服务来记录投递。
- **远程同步**：想让所有访客看到同一份配置，可编辑 `assets/js/syncConfig.js`（填写你自建的 REST 接口 / JSON 存储地址，并设置 `enabled: true`）。主站会在加载后拉取该接口，后台保存也会自动推送最新数据。
- **动效**：`particles.js`、`reveal.js` 都是独立模块，可替换为更复杂的 WebGL/Lottie 动画。

### 同步服务说明
- 目录 `server/` 提供了 Express + better-sqlite3 实现的轻量 API，仅有两个端点：`GET /api/content` 和 `PUT /api/content`。
- 数据会持久化在 `server/content.db`（SQLite），部署到正式服务器时同样只需 `npm install && npm run start` 即可。
- 若你有更成熟的栈（如 NestJS、Next API routes、Supabase Edge Function 等），可沿用 `remoteSync.js` 的调用方式自定义后端。

## 📦 部署
将整个目录部署到任意静态托管即可，例如：
- Vercel / Netlify 直接 import 仓库，一键部署
- 云厂商对象存储 + CDN
- GitHub Pages（启用 `main` 分支静态发布）

Enjoy building your personal brand ✦
