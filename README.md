# Guobin Li · Personal Home

一个前端可直接部署的个人主页 + 管理后台组合，聚焦展示创意开发者的作品、能力矩阵以及内容沉淀。静态 HTML/CSS/JS 架构，开箱即用。

## ✨ 亮点功能
- **沉浸式展示**：主视觉动态粒子 + Glassmorphism UI + 滚动 reveal 动画，让页面更具科技感。
- **数据驱动内容区块**：核心指标、技能矩阵、职业时间线、项目/文章卡片统一由 JS 渲染，易于扩展。
- **管理后台**：`admin.html` 提供可视化配置面板，支持所有模块的增删改、排序、折叠查看，并内置 JSON 导入/导出与一键恢复功能，内容实时写入 `localStorage` 并同步到主页。
- **主题切换**：Dark/Light 主题记忆用户偏好。
- **零依赖部署**：纯静态资源，可直接丢到任何静态托管（Vercel、Netlify、OSS、GitHub Pages）。

## 🧱 技术栈
- 原生 HTML5 + ES Modules
- Tailwind CSS CDN 配置（light/dark theme + 自定义 brand/accent palette）
- Intersection Observer、Canvas 粒子背景、表单 mailto 集成

## 📁 项目结构
```
.
├── index.html              # 主页，内置 Tailwind config / 自定义动效样式
├── admin.html              # 管理后台，同样以 Tailwind Utility 编排
└── assets
    └── js
        ├── main.js         # 主页渲染与交互
        ├── admin.js        # 后台逻辑
        ├── contentStore.js # 默认数据 & 本地存储
        ├── particles.js    # 背景粒子
        └── reveal.js       # 滚动动画
```

## 🚀 快速开始
1. 任意静态服务器启动（以下示例使用 Python）：
   ```bash
   cd /path/to/home
   python3 -m http.server 4173
   ```
2. 浏览器访问 `http://localhost:4173/index.html` 查看主页。
3. 打开 `http://localhost:4173/admin.html`，在后台直接修改各模块内容，刷新主页即可看到更新（保存在浏览器 `localStorage`）。

> 如果需要默认值与自定义内容在多设备同步，可将 `localStorage` 替换为简单后端 API 或远程 KV。

## 🛠 自定义建议
- **文案/数据**：可在后台直接编辑，或修改 `assets/js/contentStore.js` 里的 `defaultContent` 默认数据。
- **样式**：Tailwind 通过 CDN 注入，可直接在 `index.html` / `admin.html` 的 `tailwind.config` 或 `<style>` 中修改品牌色、组件圆角等。
- **表单**：目前使用 `mailto:`，可接入 Formspree/Supabase/自建服务来记录投递。
- **动效**：`particles.js`、`reveal.js` 都是独立模块，可替换为更复杂的 WebGL/Lottie 动画。

## 📦 部署
将整个目录部署到任意静态托管即可，例如：
- Vercel / Netlify 直接 import 仓库，一键部署
- 云厂商对象存储 + CDN
- GitHub Pages（启用 `main` 分支静态发布）

Enjoy building your personal brand ✦
