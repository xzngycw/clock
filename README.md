# 🕐 认识时间 - 儿童时钟学习应用

一个专为低年级学生设计的时间学习教育应用，帮助孩子们认识模拟时钟和数字时钟，理解时间概念。

![Version](https://img.shields.io/badge/version-0.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)

## ✨ 特性

- 🎨 **明亮活泼的卡通风格** - 色彩丰富，符合儿童审美
- 🕰️ **模拟时钟学习** - 可交互的时钟表盘，支持拖拽指针
- 🔢 **数字时钟学习** - 直观的数字显示，支持12/24小时制
- 🎮 **游戏化练习** - 四个难度等级，寓教于乐
- 🎵 **音效反馈** - Web Audio API 生成的音效和语音提示
- 🎉 **趣味动画** - GSAP 和 Framer Motion 实现的流畅动画
- 🌈 **主题切换** - 明亮主题和护眼主题
- 📱 **PWA 支持** - 可安装到桌面，支持离线使用
- 💾 **本地存储** - IndexedDB 保存学习进度

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 pnpm

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd clock

# 安装依赖
npm install
# 或
pnpm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 生成 PWA 图标

1. 在浏览器中打开 `public/icons/icon-generator.html`
2. 点击下载按钮，保存 `icon-192x192.png` 和 `icon-512x512.png` 到 `public/icons/` 目录

### 构建

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 📦 技术栈

### 核心框架
- **React 19.2** - UI 框架
- **TypeScript 5.9** - 类型安全
- **Vite 5.4** - 构建工具

### UI 与样式
- **Tailwind CSS 3.4** - CSS 框架
- **DaisyUI 4.12** - UI 组件库
- **Lucide React** - 图标库

### 动画
- **GSAP 3.14** - 时钟指针动画、SVG 动画
- **Framer Motion 12** - 页面过渡、组件动画

### 状态管理
- **Zustand 5.0** - 轻量级状态管理

### 数据存储
- **Dexie.js 4.3** - IndexedDB 封装
- **LocalStorage** - 应用设置

### 音频
- **Web Audio API** - 音效生成
- **Web Speech API** - 语音提示

### PWA
- **vite-plugin-pwa 1.2** - PWA 支持
- **Workbox 7.4** - Service Worker

## 📂 项目结构

```
clock/
├── public/
│   ├── icons/              # PWA 图标
│   └── sounds/             # 音效文件（可选）
├── src/
│   ├── components/         # 可复用组件
│   │   ├── clock/          # 时钟组件
│   │   ├── common/         # 通用组件
│   │   ├── game/           # 游戏组件
│   │   └── layout/         # 布局组件
│   ├── pages/              # 页面组件
│   │   ├── Home/           # 主页
│   │   ├── LearnTime/      # 认识时间
│   │   ├── AnalogClock/    # 认识模拟时钟
│   │   ├── DigitalClock/   # 认识数字时钟
│   │   └── Practice/       # 游戏练习
│   ├── hooks/              # 自定义 Hooks
│   ├── store/              # 状态管理
│   ├── services/           # 业务逻辑
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型
│   ├── constants/          # 常量
│   └── styles/             # 全局样式
├── spec.md                 # 完整技术规范
└── README.md               # 本文件
```

## 🎮 功能模块

### 1. 认识时间
- 时间概念介绍（秒、分、小时）
- 时钟种类介绍
- 引导式互动学习

### 2. 认识模拟时钟
- 时钟表盘组成部分
- 时针、分针、秒针运动规律
- 可拖拽指针学习时间

### 3. 认识数字时钟
- 数字时钟显示方式
- 12/24 小时制切换
- 与模拟时钟同步显示

### 4. 游戏练习

**难度等级：**
- 🌱 **入门** - 整点时间（12:00, 1:00...）
- 🌿 **初级** - 整点和半点（12:00, 12:30...）
- 🌳 **中级** - 5分钟间隔（12:05, 12:15...）
- 🏆 **高级** - 任意时间（包含秒针）

**题目类型：**
- 模拟时钟 → 数字时钟（选择题）
- 数字时钟 → 模拟时钟（选择题）
- 手动输入（高级难度）

## 🎨 主题

### 明亮主题（默认）
- 主色调：靛蓝色 (#6366F1)
- 背景：浅灰渐变
- 适合白天学习

### 护眼主题
- 主色调：紫色 (#7C3AED)
- 背景：暖黄色 (#FFFBEB)
- 降低蓝光，保护视力

## 📱 PWA 功能

- ✅ 可安装到桌面/主屏幕
- ✅ 离线可用
- ✅ 自动更新
- ✅ 字体和资源缓存

## 🔧 配置

### 环境变量

创建 `.env` 文件（可选）：

```env
# 应用基础路径（用于 GitHub Pages 等）
VITE_APP_BASE_URL=/
```

### 部署

本项目支持多种部署方式，推荐使用 **GitHub Pages** 或 **Cloudflare Pages**。

---

#### 方式一：GitHub Pages（推荐，自动部署）

**步骤：**

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yinchengwan/clock.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 推送代码后会自动触发部署

3. **访问应用**
   - 部署完成后访问：`https://yinchengwan.github.io/clock/`

**自动部署已配置**：每次推送到 `main` 或 `master` 分支，GitHub Actions 会自动构建并部署。

---

#### 方式二：Cloudflare Pages（推荐，更快速）

**步骤：**

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages → Create a project → Connect to Git
3. 选择你的 GitHub 仓库
4. 配置构建设置：
   - **构建命令**：`npm run build`
   - **构建输出目录**：`dist`
   - **Node.js 版本**：`20`（环境变量设置 `NODE_VERSION=20`）
5. 点击 "Save and Deploy"

**优点**：
- 全球 CDN 加速
- 自动 HTTPS
- 无限带宽
- 更快的构建速度

---

#### 方式三：Vercel

**步骤：**

1. 登录 [Vercel](https://vercel.com/)
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. Vercel 会自动检测 Vite 项目，使用默认配置
5. 点击 "Deploy"

**配置**：
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

---

#### 方式四：手动部署到任何服务器

```bash
# 1. 构建
npm run build

# 2. dist 目录就是静态文件，上传到任何静态服务器
# 例如：Nginx、Apache、对象存储等
```

**Nginx 配置示例**：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/clock/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

#### PWA 图标准备

部署前需要准备 PWA 图标：

1. 在浏览器中打开 `public/icons/icon-generator.html`
2. 点击下载按钮，保存 `icon-192x192.png` 和 `icon-512x512.png`
3. 将图标文件放到 `public/icons/` 目录

## 🐛 已知问题

- ~~Tailwind CSS 编译错误~~ ✅ 已修复
- ~~TypeScript 类型错误~~ ✅ 已修复
- ~~音频服务不完整~~ ✅ 已修复

## 📝 开发规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式写法
- 使用 Hooks 管理状态

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License

## 🙏 致谢

- React Team
- GSAP
- Framer Motion
- Tailwind CSS
- DaisyUI

---

**Made with ❤️ for kids learning to tell time**
