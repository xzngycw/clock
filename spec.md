## 认识时间 应用开发架构设计
### 项目目的
- 面向低年级学生的教育类应用
- 让学生认识模拟时钟和数字时钟，能够根据时钟显示理解对应的时间

### 功能支持
1. 有一个主界面
2. 主界面包含认识时间，认识模拟时钟，认识数字时钟，以及练习四个功能入口
3. 功能一：认识时间 - 分为以下几个功能(最好以动画形式展示): 
    1. 介绍时间的概念：举例说明一秒有多长，1分钟有多少秒，1分钟大约有多久，一小时有多久，一天有多少小时等等，举例尽量详细，尽量亿动画形式展示，并添加互动功能，而不是单纯的输出式介绍，可以采用渐进式逐步披露的方式，通过引导孩子互动一步步认识时间概念。
    2. 认识时钟的种类(图文并茂)：除了常见的挂钟，还有哪些种类的时钟，比如石英钟，沙漏，日晷等
    3. 介绍认识时间的最常见的两种方式：传统的模拟时钟和数字时钟，然后引导孩子可以点击进一步学习模拟时钟或者数字时钟，并跳转到相应界面
 
4. 功能二：认识模拟时钟：
    1. 教学部分(可选跳过)：动画展示模拟时钟的时针，分针，秒针及其运动规律，并教学如何读取时间
    2. 学习部分：展示一个可交互的模拟时钟，支持手动调整时间，并实时显示对应的时间，让孩子通过拖拽时针分针秒针来学习时间；期间还是时不时的加一些互动以及鼓励和赞美(比如音效，彩蛋动画等，可以参考一些教育类app)
5. 功能三：认识数字时钟：
    1. 教学部分(可选跳过)：动画展示数字时钟的显示方式，以及如何读取时间
    2. 学习部分：展示一个可交互的数字时钟，支持手动调整时间，并实时显示对应的时间，让孩子通过拖拽数字来学习时间，这里也可以加一个对应的模拟时钟，显示与数字时钟对应的时间；期间还是时不时的加一些互动以及鼓励和赞美(比如音效，彩蛋动画等，可以参考一些教育类app)
5. 功能四：游戏练习
    - 整体功能设计：游戏分入门、初级、中级和高级四个难度等级：
        1. 入门：模拟/数字时钟题目只会有整点时间，比如12:00, 01:00, 02:00...;并且只有选择题，给模型时钟，候选几个数字时钟，让孩子选择正确的时间；或者给数字时间，候选几个数字时钟，让孩子选择正确的时间；
        2. 初级：模拟/数字时钟题目会有整点和半点时间；并且只有选择题，给模型时钟，候选几个数字时钟，让孩子选择正确的时间；或者给数字时间，候选几个数字时钟，让孩子选择正确的时间；
        3. 中级：模拟/数字时钟题目会有整点，半点，15分，20分，25分，35分，40分，45分，50分，55分等时间；并且只有选择题，给模型时钟，候选几个数字时钟，让孩子选择正确的时间；或者给数字时间，候选几个数字时钟，让孩子选择正确的时间；
        4. 高级：所有时间都会出现，包括秒针；题目是手动输入，比如给任意数字时间，让孩子手动拨动模拟时钟的时针分针秒针来给出正确答案；或者随机给出模拟时钟时间，让孩子输入对应的数字时间；
    - 整体风格设计：
        1. 每种难度练习每次练习根据难度等级出3-10道题目，并有进度以及得分显示
        2. 做对题目有鼓励和赞美，做错题目有提示和讲解
        3. 题目每次都是随机生成的，避免孩子死记硬背
        4. 练习结果统计：练习完成之后，显示练习结果，包括做对的题目数，做错的题目数，得分，以及错误题目解析
        5. 模拟时钟表盘要足够大，清晰，指针要粗一点，便于孩子观察和操作，时针分针秒针要区分明显，颜色鲜明

### 整体风格
1. 整体设计简洁
2. 色彩明亮活泼，符合低年级学生审美，可以设计为卡通风格
3. 支持两个主题，明亮主题(默认)和护眼主题,在任意界面的右上角可以随时切换

### 应用要求
1. 支持pwa分发，跨平台使用，用户首次打开会进行缓存，后续离线也尽量可以使用
2. 最终会部署到github pages或者cloudflare，代码设计时需要考虑兼容性，以及代码路径问题
3. 应用需要有良好的可扩展性，方便后续增加新的功能模块
4. 应用需要有良好的用户体验，操作简单直观，符合低年级学生使用习惯
5. 【可选，后续可能需要，暂时先不做】后续可能需要采用用户付费一次性买断，获得注册码才能使用，并且需要考虑预留此功能兼容性。

---

## 技术架构设计

### 技术选型

#### 核心技术栈
- **前端框架**: React 18 + TypeScript
  - 理由：动画生态成熟（GSAP、Framer Motion），PWA 支持完善，社区活跃，适合长期维护
- **构建工具**: Vite 5.x
  - 理由：快速开发体验，优秀的打包性能，原生支持 TypeScript
- **路由管理**: React Router v6
- **状态管理**: Zustand
  - 理由：轻量级，API 简洁，适合中小型应用

#### UI 与样式
- **CSS 框架**: Tailwind CSS 3.x
- **UI 组件库**: DaisyUI 4.x
  - 理由：基于 Tailwind，提供丰富的预设主题，快速构建儿童友好界面
- **图标库**: Lucide React
- **字体**:
  - 显示字体：Fredoka One（卡通风格）
  - UI字体：Nunito（清晰易读）

#### 动画与交互
- **核心动画库**: GSAP 3.x
  - 用途：时钟指针动画、SVG 动画、复杂时间轴动画
  - 优势：性能优秀，SVG 支持完善，强大的缓动函数
- **React 集成**: @gsap/react
- **拖拽交互**: GSAP Draggable（与 GSAP 完美集成）
- **过渡动画**: Framer Motion（页面过渡、组件动画）
- **音效管理**: Howler.js（跨平台音频库）

#### 数据存储
- **本地存储**:
  - IndexedDB: Dexie.js 3.x（用户进度、练习成绩）
  - LocalStorage: 应用设置、主题偏好
- **PWA 缓存**: vite-plugin-pwa
  - 静态资源：CacheFirst 策略
  - 动态数据：NetworkFirst 策略

#### 开发工具
- **代码规范**: ESLint + Prettier + husky + lint-staged
- **测试**: Vitest + @testing-library/react + Playwright（E2E）
- **调试工具**: React DevTools

#### 部署
- **平台**: Cloudflare Pages（首选）/ GitHub Pages（备选）
- **CI/CD**: GitHub Actions

---

### 项目架构

#### 目录结构
```
clock-app/
├── public/
│   ├── icons/          # PWA 图标
│   └── sounds/         # 音效文件
├── src/
│   ├── components/     # 可复用组件
│   │   ├── common/     # 通用组件（Button, Card, Modal）
│   │   ├── clock/      # 时钟组件（AnalogClock, DigitalClock）
│   │   ├── game/       # 游戏组件（QuestionCard, ProgressBar）
│   │   └── layout/     # 布局组件（Header, Footer）
│   ├── pages/          # 页面组件
│   │   ├── Home/       # 主页
│   │   ├── LearnTime/  # 认识时间
│   │   ├── AnalogClock/ # 认识模拟时钟
│   │   ├── DigitalClock/ # 认识数字时钟
│   │   └── Practice/   # 游戏练习
│   ├── hooks/          # 自定义 Hooks（useClock, useAudio）
│   ├── store/          # Zustand 状态管理
│   ├── services/       # 业务逻辑（db, audio, analytics）
│   ├── utils/          # 工具函数（time, random, storage）
│   ├── types/          # TypeScript 类型定义
│   ├── constants/      # 常量（routes, colors, sounds）
│   └── styles/         # 全局样式
└── tests/              # 测试文件
```

#### 核心数据模型

```typescript
// 时钟时间
interface ClockTime {
  hours: number;
  minutes: number;
  seconds: number;
}

// 难度等级
type DifficultyLevel = 'beginner' | 'junior' | 'intermediate' | 'advanced';

// 题目
interface Question {
  id: string;
  type: 'analog-to-digital' | 'digital-to-analog' | 'manual-input';
  difficulty: DifficultyLevel;
  time: ClockTime;
  options?: ClockTime[];
}

// 游戏会话
interface GameSession {
  id: string;
  difficulty: DifficultyLevel;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  score: number;
  startedAt: number;
}

// 用户进度
interface UserProgress {
  id: string;
  completedLessons: string[];
  practiceHistory: GameSession[];
  totalPracticeTime: number;
  accuracy: number;
}

// 用户设置
interface UserSettings {
  theme: 'light' | 'dark' | 'eyecare';
  soundEnabled: boolean;
  difficulty: DifficultyLevel;
}
```

---

### 关键技术实现

#### 1. 模拟时钟实现
- **技术方案**: SVG + GSAP
- **实现要点**:
  - SVG 绘制时钟表盘，支持主题切换
  - GSAP rotation 实现指针旋转动画
  - GSAP Draggable 实现拖拽交互
  - requestAnimationFrame 同步时间

#### 2. 数字时钟实现
- **技术方案**: React 状态 + Framer Motion
- **实现要点**:
  - 分位数显示，支持前导零
  - Framer Motion 实现数字滚动动画
  - 数字滚动选择器（类似老虎机）
  - 与模拟时钟实时同步

#### 3. PWA 离线支持
- **缓存策略**:
  - 静态资源：CacheFirst，长期缓存
  - 字体文件：CacheFirst，1年缓存
  - 动态数据：NetworkFirst，离线降级
- **离线存储**:
  - IndexedDB 存储用户进度和成绩
  - LocalStorage 存储应用设置

#### 4. 题目生成系统
- **随机生成**: 根据难度等级生成随机时间
- **难度控制**:
  - 入门：整点（12:00, 1:00...）
  - 初级：整点和半点（12:00, 12:30...）
  - 中级：5分钟间隔（12:05, 12:15...）
  - 高级：任意时间，包含秒针

---

### 性能优化策略

#### 加载性能
- 代码分割：路由懒加载
- 资源压缩：Vite 自动压缩 + Gzip
- 图片优化：WebP 格式，响应式图片
- 字体优化：字体子集化，预加载关键字体

#### 运行性能
- 动画优化：使用 transform 和 opacity，触发 GPU 加速
- 避免重绘：虚拟化长列表
- 节流防抖：拖拽事件节流
- Web Worker：复杂计算（题目生成）放入 Worker

#### 缓存策略
- 静态资源：长期缓存，文件名带 hash
- API 数据：LocalStorage 缓存
- PWA 缓存：离线可用，后台更新

---

### 开发阶段规划

#### Phase 1: 基础架构（1-2周）
- 项目初始化和配置
- 基础组件库搭建
- 路由和状态管理
- PWA 配置

#### Phase 2: 核心功能（3-4周）
- 模拟时钟组件
- 数字时钟组件
- 时间概念教学模块
- 基础交互和动画

#### Phase 3: 游戏功能（2-3周）
- 题目生成系统
- 游戏界面开发
- 进度统计
- 音效和反馈

#### Phase 4: 优化和测试（1-2周）
- 性能优化
- 兼容性测试
- 用户体验优化
- 部署上线

---

### 风险与应对

#### 技术风险
- **动画兼容性**: GSAP 兼容性好，需测试老版本浏览器
- **PWA 支持**: iOS Safari 有部分限制，需要降级方案
- **离线功能**: 部分功能需要网络，提供友好提示

#### 性能风险
- **动画性能**: 低端设备可能卡顿，提供简化动画模式
- **内存占用**: 长时间使用可能内存泄漏，定期清理

#### 用户体验风险
- **操作复杂度**: 提供充分的引导和反馈
- **内容理解**: 概念抽象，增加可视化解释

---

## UI/UX 设计规范

### 设计原则

1. **儿童友好**: 界面设计适合 6-10 岁儿童，操作简单直观
2. **色彩明亮**: 使用明亮活泼的色彩，吸引儿童注意力
3. **反馈及时**: 所有操作都有明确的视觉和听觉反馈
4. **鼓励引导**: 通过正向激励增强学习兴趣
5. **安全护眼**: 提供护眼主题，保护儿童视力

---

### 色彩方案

#### 明亮主题（默认）

**主色调**:
```css
--primary: #6366F1;        /* 靛蓝色 - 主按钮、重要元素 */
--primary-light: #818CF8;  /* 浅靛蓝 - 悬停状态 */
--primary-dark: #4F46E5;   /* 深靛蓝 - 按下状态 */

--secondary: #F59E0B;      /* 橙色 - 次要按钮、强调 */
--accent: #10B981;         /* 绿色 - 正确答案、成功提示 */
--error: #EF4444;          /* 红色 - 错误提示 */
```

**时钟指针颜色**:
```css
--hour-hand: #1F2937;      /* 深灰色 - 时针 */
--minute-hand: #6366F1;    /* 靛蓝色 - 分针 */
--second-hand: #EF4444;    /* 红色 - 秒针 */
--clock-face: #FFFFFF;     /* 白色 - 表盘 */
--clock-border: #E5E7EB;   /* 浅灰 - 表盘边框 */
```

**背景色**:
```css
--bg-primary: #F3F4F6;     /* 浅灰 - 主背景 */
--bg-secondary: #FFFFFF;   /* 白色 - 卡片背景 */
--bg-accent: #EEF2FF;      /* 浅靛蓝 - 强调背景 */
```

**文字颜色**:
```css
--text-primary: #1F2937;   /* 深灰 - 主要文字 */
--text-secondary: #6B7280; /* 中灰 - 次要文字 */
--text-disabled: #9CA3AF;  /* 浅灰 - 禁用文字 */
```

#### 护眼主题

**主色调**:
```css
--primary: #7C3AED;        /* 紫色 - 降低蓝光 */
--primary-light: #8B5CF6;
--primary-dark: #6D28D9;

--secondary: #D97706;      /* 暖橙色 */
--accent: #059669;         /* 深绿色 */
--error: #DC2626;          /* 柔和红色 */
```

**背景色**:
```css
--bg-primary: #FEF3C7;     /* 暖黄色 - 护眼背景 */
--bg-secondary: #FFFBEB;   /* 浅暖黄 */
--bg-accent: #FDE68A;      /* 暖黄色强调 */
```

**时钟指针颜色**:
```css
--hour-hand: #78350F;      /* 深棕色 */
--minute-hand: #7C3AED;    /* 紫色 */
--second-hand: #DC2626;    /* 柔和红色 */
--clock-face: #FFFBEB;     /* 浅暖黄 */
```

---

### 字体规范

#### 字体家族
```css
/* 显示字体 - 用于标题、时钟数字 */
font-family: 'Fredoka One', cursive;

/* UI字体 - 用于正文、按钮、提示 */
font-family: 'Nunito', sans-serif;

/* 数字字体 - 用于时钟数字 */
font-family: 'Fredoka One', cursive;
```

#### 字体大小

**标题**:
```css
--text-h1: 2.5rem;    /* 40px - 主标题 */
--text-h2: 2rem;      /* 32px - 次标题 */
--text-h3: 1.5rem;    /* 24px - 小标题 */
--text-h4: 1.25rem;   /* 20px - 四级标题 */
```

**正文**:
```css
--text-lg: 1.125rem;  /* 18px - 大号正文 */
--text-base: 1rem;    /* 16px - 默认正文 */
--text-sm: 0.875rem;  /* 14px - 小号文字 */
--text-xs: 0.75rem;   /* 12px - 辅助文字 */
```

**时钟数字**:
```css
--clock-hour: 3rem;     /* 48px - 小时数字 */
--clock-minute: 2.5rem; /* 40px - 分钟数字 */
--clock-second: 2rem;   /* 32px - 秒数字 */
```

#### 行高与字重
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
```

---

### 组件设计规范

#### 1. 按钮（Button）

**尺寸规范**:
```css
/* 大按钮 - 主要操作 */
height: 56px;
padding: 0 32px;
font-size: 18px;
border-radius: 16px;

/* 中按钮 - 常规操作 */
height: 48px;
padding: 0 24px;
font-size: 16px;
border-radius: 12px;

/* 小按钮 - 辅助操作 */
height: 40px;
padding: 0 16px;
font-size: 14px;
border-radius: 8px;
```

**样式变体**:
- **主要按钮**: 靛蓝色背景，白色文字，悬停变亮
- **次要按钮**: 白色背景，靛蓝色边框和文字
- **成功按钮**: 绿色背景（正确答案）
- **危险按钮**: 红色背景（错误提示）
- **禁用状态**: 浅灰色背景，不可点击

**交互效果**:
- 悬停：背景色变亮，鼠标变手型
- 点击：轻微缩放（scale: 0.98）+ 阴影加深
- 禁用：透明度降低（opacity: 0.5）

#### 2. 卡片（Card）

**设计规范**:
```css
background: var(--bg-secondary);
border-radius: 20px;
padding: 24px;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
transition: transform 0.2s, box-shadow 0.2s;
```

**交互效果**:
- 悬停：轻微上浮（translateY: -4px）+ 阴影加深
- 点击：轻微缩放（scale: 0.98）

**变体**:
- **基础卡片**: 白色背景，阴影
- **强调卡片**: 浅色背景（如浅蓝、浅绿）
- **选中卡片**: 彩色边框，阴影增强

#### 3. 模拟时钟（Analog Clock）

**表盘设计**:
```css
/* 尺寸 */
width: 300px;  /* 手机 */
width: 400px;  /* 平板 */
width: 500px;  /* 桌面 */

/* 样式 */
background: var(--clock-face);
border: 8px solid var(--clock-border);
border-radius: 50%;
box-shadow: 
  0 10px 30px rgba(0, 0, 0, 0.15),
  inset 0 0 20px rgba(0, 0, 0, 0.05);
```

**刻度设计**:
```css
/* 小时刻度 */
height: 20px;
width: 4px;
background: var(--text-primary);
border-radius: 2px;

/* 分钟刻度 */
height: 10px;
width: 2px;
background: var(--text-secondary);
```

**指针设计**:
```css
/* 时针 */
width: 8px;
height: 80px;  /* 表盘半径的 40% */
background: var(--hour-hand);
border-radius: 4px;

/* 分针 */
width: 6px;
height: 120px;  /* 表盘半径的 60% */
background: var(--minute-hand);
border-radius: 3px;

/* 秒针 */
width: 2px;
height: 140px;  /* 表盘半径的 70% */
background: var(--second-hand);
border-radius: 1px;
```

**数字显示**:
```css
/* 表盘数字 */
font-family: 'Fredoka One', cursive;
font-size: 1.5rem;
color: var(--text-primary);
```

**拖拽交互**:
- 指针悬停：高亮显示，鼠标变手型
- 拖拽中：指针放大（scale: 1.1），添加光晕效果
- 拖拽结束：平滑动画过渡到最终位置

#### 4. 数字时钟（Digital Clock）

**设计规范**:
```css
/* 整体容器 */
display: inline-flex;
align-items: center;
gap: 8px;
background: var(--bg-secondary);
border-radius: 16px;
padding: 20px 32px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

**数字显示**:
```css
font-family: 'Fredoka One', cursive;
font-size: 3rem;
color: var(--text-primary);
min-width: 2ch;
text-align: center;
```

**分隔符**:
```css
font-size: 2.5rem;
color: var(--primary);
animation: blink 1s infinite;
```

**滚动选择器**:
- 上滑：数字增加
- 下滑：数字减少
- 滚动动画：平滑过渡（300ms）
- 边界处理：循环滚动（59 → 0）

#### 5. 进度条（Progress Bar）

**设计规范**:
```css
height: 12px;
background: var(--bg-accent);
border-radius: 6px;
overflow: hidden;
```

**进度填充**:
```css
height: 100%;
background: linear-gradient(90deg, var(--primary), var(--primary-light));
border-radius: 6px;
transition: width 0.3s ease;
```

**动画效果**:
- 进度更新：平滑过渡
- 完成：闪烁动画 + 绿色填充

#### 6. 模态框（Modal）

**设计规范**:
```css
/* 遮罩层 */
position: fixed;
inset: 0;
background: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(4px);
```

```css
/* 模态框 */
max-width: 400px;
background: var(--bg-secondary);
border-radius: 24px;
padding: 32px;
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
```

**动画效果**:
- 打开：淡入 + 缩放（scale: 0.9 → 1）
- 关闭：淡出 + 缩放（scale: 1 → 0.9）

#### 7. 鼓励动画

**正确答案动画**:
```typescript
// 彩带效果
confetti({
  particleCount: 100,
  spread: 70,
  colors: ['#6366F1', '#F59E0B', '#10B981', '#EF4444']
});

// 星星闪烁
starBurst({
  count: 5,
  colors: ['#FFD700', '#FFA500']
});
```

**错误提示动画**:
```typescript
// 轻微抖动
shake: {
  animation: 'shake 0.5s ease-in-out'
}

// 柔和边框高亮
highlight: {
  border: '2px solid var(--error)',
  animation: 'pulse 1s ease-in-out'
}
```

---

### 响应式设计

#### 断点设置
```css
--breakpoint-sm: 640px;   /* 手机 */
--breakpoint-md: 768px;   /* 平板竖屏 */
--breakpoint-lg: 1024px;  /* 平板横屏 / 小桌面 */
--breakpoint-xl: 1280px;  /* 桌面 */
```

#### 布局适配

**手机（< 768px）**:
```css
/* 单列布局 */
.container {
  max-width: 100%;
  padding: 16px;
}

/* 时钟大小 */
.analog-clock { width: 280px; }
.digital-clock { font-size: 2.5rem; }

/* 按钮 */
.button { width: 100%; }

/* 字体 */
.title { font-size: 1.75rem; }
```

**平板竖屏（768px - 1024px）**:
```css
/* 单列或双列 */
.container {
  max-width: 768px;
  padding: 24px;
}

/* 时钟大小 */
.analog-clock { width: 350px; }
.digital-clock { font-size: 3rem; }

/* 字体 */
.title { font-size: 2rem; }
```

**平板横屏 / 桌面（> 1024px）**:
```css
/* 多列布局 */
.container {
  max-width: 1024px;
  padding: 32px;
}

/* 时钟大小 */
.analog-clock { width: 450px; }
.digital-clock { font-size: 3.5rem; }

/* 字体 */
.title { font-size: 2.5rem; }
```

#### 触摸优化
- **最小触摸目标**: 44px × 44px（符合 iOS/Android 规范）
- **按钮间距**: 至少 8px
- **滑动手势**: 支持左滑返回、下拉刷新
- **长按操作**: 避免使用长按，儿童不易理解

---

### 页面布局设计

#### 1. 主页面（Home）

**布局结构**:
```
┌─────────────────────────────┐
│  Header (Logo + Theme Toggle)│
├─────────────────────────────┤
│                             │
│  Welcome Message            │
│  (大标题 + 可爱插图)         │
│                             │
├─────────────────────────────┤
│  ┌─────┐  ┌─────┐          │
│  │功能1│  │功能2│          │
│  └─────┘  └─────┘          │
│  ┌─────┐  ┌─────┐          │
│  │功能3│  │功能4│          │
│  └─────┘  └─────┘          │
│                             │
└─────────────────────────────┘
```

**功能卡片**:
- 图标（大而清晰）
- 标题（简洁明了）
- 简短描述
- 悬停动画

#### 2. 学习页面（Learning Pages）

**布局结构**:
```
┌─────────────────────────────┐
│  Header (Back Button + Title)│
├─────────────────────────────┤
│                             │
│  Content Area               │
│  (动画 / 时钟 / 教学)        │
│                             │
├─────────────────────────────┤
│  Controls / Interaction     │
│  (按钮 / 滑块 / 选项)        │
├─────────────────────────────┤
│  Progress Indicator         │
└─────────────────────────────┘
```

#### 3. 游戏练习页面（Practice）

**布局结构**:
```
┌─────────────────────────────┐
│  Header (Back + Score)      │
├─────────────────────────────┤
│  Progress Bar               │
├─────────────────────────────┤
│                             │
│  Question Area              │
│  (时钟 / 数字 / 问题)         │
│                             │
├─────────────────────────────┤
│  Answer Options             │
│  (选项卡片 / 输入区域)        │
├─────────────────────────────┤
│  Submit / Next Button       │
└─────────────────────────────┘
```

---

### 动画规范

#### 过渡动画
```css
/* 标准过渡 */
transition: all 0.3s ease;

/* 快速过渡 */
transition: all 0.15s ease;

/* 慢速过渡 */
transition: all 0.5s ease;
```

#### 缓动函数
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
```

#### 常用动画
```css
/* 淡入淡出 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 缩放 */
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* 弹跳 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 旋转 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 脉冲 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

### 无障碍设计

#### 对比度要求
- **正文文字**: 对比度至少 4.5:1
- **大标题**: 对比度至少 3:1
- **图标**: 对比度至少 3:1

#### 键盘导航
- Tab 键：在可交互元素间切换
- Enter / Space：激活按钮
- Esc：关闭模态框
- 方向键：调整数字时钟

#### 屏幕阅读器支持
```html
<!-- 时钟组件 -->
<div role="img" aria-label="模拟时钟，当前时间是 3 点 15 分">
  <!-- 时钟 SVG -->
</div>

<!-- 按钮组件 -->
<button aria-label="开始学习认识时间">
  开始学习
</button>

<!-- 进度条 -->
<div role="progressbar" aria-valuenow="3" aria-valuemin="0" aria-valuemax="10">
  <!-- 进度条 -->
</div>
```

---

### 图标与插图风格

#### 图标风格
- **风格**: 圆润、卡通、填充式
- **颜色**: 单色或双色，与主题色搭配
- **大小**: 24px / 32px / 48px
- **来源**: Lucide React / 自定义 SVG

#### 插图风格
- **风格**: 扁平化、卡通、可爱
- **颜色**: 明亮、多彩、与主题色搭配
- **用途**: 引导页、空状态、成功页面
- **来源**: 自定义设计 / 插画素材库

#### 动画角色（可选）
- **吉祥物**: 可爱的时钟小人
- **用途**: 引导、鼓励、错误提示
- **动画**: 跳舞、点头、摇手等简单动作

---

## 数据模型设计

### 核心数据模型

#### 1. 时钟时间（ClockTime）

```typescript
interface ClockTime {
  hours: number;      // 0-23
  minutes: number;    // 0-59
  seconds: number;    // 0-59
}

// 辅助方法
class ClockTimeUtils {
  // 验证时间是否有效
  static isValid(time: ClockTime): boolean;
  
  // 转换为 12 小时制
  static to12Hour(time: ClockTime): { hours: number; minutes: number; period: 'AM' | 'PM' };
  
  // 格式化为字符串
  static format(time: ClockTime, format: '12h' | '24h'): string;
  
  // 计算两个时间的差异（分钟）
  static difference(a: ClockTime, b: ClockTime): number;
  
  // 时间比较
  static compare(a: ClockTime, b: ClockTime): -1 | 0 | 1;
}
```

#### 2. 题目（Question）

```typescript
interface Question {
  id: string;                          // 唯一标识
  type: QuestionType;                  // 题目类型
  difficulty: DifficultyLevel;         // 难度等级
  time: ClockTime;                     // 题目时间
  options?: ClockTime[];               // 选择题选项
  hint?: string;                       // 提示文本
  explanation?: string;                // 答案解析
  createdAt: number;                   // 创建时间戳
}

type QuestionType = 
  | 'analog-to-digital'    // 模拟时钟 → 数字时钟
  | 'digital-to-analog'    // 数字时钟 → 模拟时钟
  | 'manual-input';        // 手动输入

type DifficultyLevel = 'beginner' | 'junior' | 'intermediate' | 'advanced';

// 题目生成配置
interface QuestionConfig {
  difficulty: DifficultyLevel;
  type: QuestionType;
  includeSeconds?: boolean;            // 是否包含秒针
  allowedMinutes?: number[];           // 允许的分钟数（如 [0, 15, 30, 45]）
}

// 题目生成器
class QuestionGenerator {
  // 生成单个题目
  static generate(config: QuestionConfig): Question;
  
  // 批量生成题目
  static generateBatch(config: QuestionConfig, count: number): Question[];
  
  // 根据难度生成随机时间
  static generateRandomTime(difficulty: DifficultyLevel): ClockTime;
}
```

#### 3. 答案（Answer）

```typescript
interface Answer {
  questionId: string;          // 题目 ID
  userAnswer: ClockTime;       // 用户答案
  correctAnswer: ClockTime;    // 正确答案
  isCorrect: boolean;          // 是否正确
  timeSpent: number;           // 答题耗时（秒）
  timestamp: number;           // 答题时间戳
}

// 答案评估器
class AnswerEvaluator {
  // 评估答案是否正确
  static evaluate(question: Question, userAnswer: ClockTime): boolean;
  
  // 计算相似度（用于部分正确的情况）
  static similarity(answer: ClockTime, correct: ClockTime): number;
}
```

#### 4. 游戏会话（GameSession）

```typescript
interface GameSession {
  id: string;                          // 会话 ID
  difficulty: DifficultyLevel;         // 难度等级
  questions: Question[];               // 题目列表
  currentQuestionIndex: number;        // 当前题目索引
  answers: Answer[];                   // 答案列表
  score: number;                       // 得分
  totalQuestions: number;              // 总题数
  correctAnswers: number;              // 正确题数
  startedAt: number;                   // 开始时间戳
  completedAt?: number;                // 完成时间戳
  duration: number;                    // 总耗时（秒）
}

// 会话管理器
class SessionManager {
  // 创建新会话
  static createSession(difficulty: DifficultyLevel, questionCount: number): GameSession;
  
  // 提交答案
  static submitAnswer(sessionId: string, answer: ClockTime): Answer;
  
  // 获取下一题
  static getNextQuestion(sessionId: string): Question | null;
  
  // 完成会话
  static completeSession(sessionId: string): GameSession;
  
  // 计算得分
  static calculateScore(session: GameSession): number;
}
```

#### 5. 用户进度（UserProgress）

```typescript
interface UserProgress {
  id: string;                          // 用户 ID
  completedLessons: LessonProgress[];  // 已完成的课程
  practiceHistory: GameSession[];      // 练习历史
  totalPracticeTime: number;           // 总练习时长（分钟）
  totalQuestions: number;              // 总答题数
  correctAnswers: number;              // 正确答题数
  accuracy: number;                    // 正确率（0-100）
  streakDays: number;                  // 连续学习天数
  lastActiveAt: number;                // 最后活跃时间戳
  achievements: Achievement[];         // 成就列表
  createdAt: number;                   // 创建时间戳
  updatedAt: number;                   // 更新时间戳
}

interface LessonProgress {
  lessonId: string;          // 课程 ID
  completed: boolean;        // 是否完成
  completedAt?: number;      // 完成时间戳
  score?: number;            // 得分
}

interface Achievement {
  id: string;                // 成就 ID
  type: AchievementType;     // 成就类型
  unlockedAt: number;        // 解锁时间戳
  description: string;       // 成就描述
}

type AchievementType = 
  | 'first-lesson'           // 完成第一课
  | 'streak-7'               // 连续学习 7 天
  | 'streak-30'              // 连续学习 30 天
  | 'accuracy-90'            // 正确率达到 90%
  | 'questions-100';         // 完成 100 道题目

// 进度管理器
class ProgressManager {
  // 获取用户进度
  static getProgress(userId: string): UserProgress;
  
  // 更新进度
  static updateProgress(userId: string, updates: Partial<UserProgress>): void;
  
  // 添加练习记录
  static addPracticeSession(userId: string, session: GameSession): void;
  
  // 计算统计数据
  static calculateStats(userId: string): UserStats;
}

interface UserStats {
  totalPracticeTime: number;
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  accuracy: number;
  mostPlayedDifficulty: DifficultyLevel;
}
```

#### 6. 用户设置（UserSettings）

```typescript
interface UserSettings {
  id: string;                          // 用户 ID
  theme: Theme;                        // 主题
  soundEnabled: boolean;               // 音效开关
  musicEnabled: boolean;               // 背景音乐开关
  volume: number;                      // 音量（0-100）
  difficulty: DifficultyLevel;         // 默认难度
  language: Language;                  // 语言
  animationsEnabled: boolean;          // 动画开关
  autoAdvance: boolean;                // 自动进入下一题
  showTimer: boolean;                  // 显示计时器
  createdAt: number;                   // 创建时间戳
  updatedAt: number;                   // 更新时间戳
}

type Theme = 'light' | 'dark' | 'eyecare';
type Language = 'zh-CN' | 'en-US';

// 设置管理器
class SettingsManager {
  // 获取设置
  static getSettings(userId: string): UserSettings;
  
  // 更新设置
  static updateSettings(userId: string, updates: Partial<UserSettings>): void;
  
  // 重置为默认设置
  static resetToDefaults(userId: string): void;
}
```

#### 7. 教学内容（Lesson）

```typescript
interface Lesson {
  id: string;                          // 课程 ID
  title: string;                       // 课程标题
  description: string;                 // 课程描述
  type: LessonType;                    // 课程类型
  difficulty: DifficultyLevel;         // 难度等级
  duration: number;                    // 预计时长（分钟）
  sections: LessonSection[];           // 课程章节
  prerequisites?: string[];            // 前置课程 ID
  order: number;                       // 课程顺序
}

type LessonType = 
  | 'concept'                 // 概念教学
  | 'interactive'             // 互动学习
  | 'practice';               // 练习巩固

interface LessonSection {
  id: string;                 // 章节 ID
  title: string;              // 章节标题
  type: SectionType;          // 章节类型
  content: SectionContent;    // 章节内容
  order: number;              // 章节顺序
}

type SectionType = 
  | 'text'                    // 文本内容
  | 'animation'               // 动画演示
  | 'interactive'             // 互动练习
  | 'quiz';                   // 小测验

interface SectionContent {
  text?: string;              // 文本内容
  animationId?: string;       // 动画 ID
  interactionId?: string;     // 互动 ID
  quizId?: string;            // 测验 ID
}
```

---

### 数据存储方案

#### IndexedDB 表结构

```typescript
// 数据库结构
class ClockDatabase extends Dexie {
  progress!: Table<UserProgress>;
  sessions!: Table<GameSession>;
  settings!: Table<UserSettings>;
  lessons!: Table<LessonProgress>;
  
  constructor() {
    super('ClockAppDB');
    this.version(1).stores({
      progress: 'id',
      sessions: 'id, difficulty, completedAt, startedAt',
      settings: 'id',
      lessons: 'id, userId, lessonId'
    });
  }
}

const db = new ClockDatabase();
```

#### LocalStorage 键值

```typescript
// 本地存储键
const STORAGE_KEYS = {
  THEME: 'clock-app-theme',
  SOUND_ENABLED: 'clock-app-sound',
  DIFFICULTY: 'clock-app-difficulty',
  LAST_ACTIVE: 'clock-app-last-active',
  ONBOARDING_COMPLETED: 'clock-app-onboarding',
};
```

---

### 数据流程图

```
用户操作
  ↓
组件状态更新 (React State)
  ↓
本地状态管理 (Zustand Store)
  ↓
持久化存储 (IndexedDB / LocalStorage)
  ↓
PWA 缓存 (Service Worker)
```

---

## 音频与动画资源

### 音频资源

#### 音效类型

**交互音效**:
```yaml
button-click:        # 按钮点击
  file: sounds/click.mp3
  duration: 0.2s
  volume: 0.5

button-hover:        # 按钮悬停
  file: sounds/hover.mp3
  duration: 0.1s
  volume: 0.3

success:             # 正确答案
  file: sounds/success.mp3
  duration: 0.5s
  volume: 0.7

error:               # 错误答案
  file: sounds/error.mp3
  duration: 0.3s
  volume: 0.6

complete:            # 完成任务
  file: sounds/complete.mp3
  duration: 1.0s
  volume: 0.8
```

**教学音效**:
```yaml
tick-tock:           # 时钟滴答声
  file: sounds/tick.mp3
  duration: 1.0s
  loop: true
  volume: 0.4

clock-chime:         # 时钟报时
  file: sounds/chime.mp3
  duration: 2.0s
  volume: 0.6

encourage:           # 鼓励音效
  file: sounds/encourage.mp3
  duration: 0.8s
  volume: 0.7
```

**背景音乐**:
```yaml
learning:            # 学习背景音乐
  file: music/learning.mp3
  duration: 180s
  loop: true
  volume: 0.2

practice:            # 练习背景音乐
  file: music/practice.mp3
  duration: 120s
  loop: true
  volume: 0.15
```

#### 音频资源获取

**免费音效资源库**:
- **Freesound**: https://freesound.org/（CC 协议）
- **Zapsplat**: https://www.zapsplat.com/（免费注册）
- **Mixkit**: https://mixkit.co/free-sound-effects/（完全免费）

**推荐音效包**:
- 儿童教育类音效包
- UI 交互音效包
- 游戏音效包

#### 音频管理

```typescript
// 音频管理器
class AudioManager {
  private sounds: Map<string, Howl>;
  private musicEnabled: boolean;
  private soundEnabled: boolean;
  private volume: number;
  
  // 初始化音频
  async init(): Promise<void>;
  
  // 播放音效
  play(soundId: string): void;
  
  // 播放背景音乐
  playMusic(musicId: string): void;
  
  // 停止音乐
  stopMusic(): void;
  
  // 设置音量
  setVolume(volume: number): void;
  
  // 切换音效开关
  toggleSound(enabled: boolean): void;
  
  // 切换音乐开关
  toggleMusic(enabled: boolean): void;
}
```

---

### 动画资源

#### 动画类型

**教学动画**:
```yaml
time-concept:        # 时间概念介绍
  type: svg-animation
  duration: 30s
  file: animations/time-concept.svg

clock-introduction:  # 时钟介绍
  type: lottie
  duration: 45s
  file: animations/clock-intro.json

hand-movement:       # 指针运动规律
  type: gsap-timeline
  duration: 20s
  script: animations/hand-movement.ts
```

**交互动画**:
```yaml
clock-drag:          # 时钟拖拽
  type: gsap
  duration: 0.3s
  easing: ease-out

number-scroll:       # 数字滚动
  type: framer-motion
  duration: 0.4s
  easing: ease-in-out

confetti:            # 彩带动画
  type: canvas
  duration: 2s
  library: canvas-confetti
```

**鼓励动画**:
```yaml
star-burst:          # 星星闪烁
  type: lottie
  duration: 1.5s
  file: animations/star-burst.json

trophy:              # 奖杯动画
  type: lottie
  duration: 3s
  file: animations/trophy.json

clap-hands:          # 鼓掌动画
  type: lottie
  duration: 2s
  file: animations/clap.json
```

#### 动画资源获取

**Lottie 动画库**:
- **LottieFiles**: https://lottiefiles.com/（免费 Lottie 动画）
- **IconScout**: https://iconscout.com/lottie-animations（部分免费）

**动画制作工具**:
- **After Effects + Bodymovin**: 专业级动画
- **Figma + Figmotion**: 简单 UI 动画
- **Synfig Studio**: 免费开源 2D 动画软件

#### 动画管理

```typescript
// 动画管理器
class AnimationManager {
  private animations: Map<string, AnimationItem>;
  
  // 加载动画
  async load(animationId: string): Promise<void>;
  
  // 播放动画
  play(animationId: string, container: HTMLElement): void;
  
  // 暂停动画
  pause(animationId: string): void;
  
  // 停止动画
  stop(animationId: string): void;
  
  // 销毁动画
  destroy(animationId: string): void;
}
```

---

### 资源文件组织

```
public/
├── sounds/
│   ├── ui/
│   │   ├── click.mp3
│   │   ├── hover.mp3
│   │   └── success.mp3
│   ├── game/
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   └── complete.mp3
│   ├── teaching/
│   │   ├── tick.mp3
│   │   ├── chime.mp3
│   │   └── encourage.mp3
│   └── music/
│       ├── learning.mp3
│       └── practice.mp3
├── animations/
│   ├── lottie/
│   │   ├── star-burst.json
│   │   ├── trophy.json
│   │   └── clap.json
│   ├── svg/
│   │   ├── time-concept.svg
│   │   └── clock-intro.svg
│   └── scripts/
│       └── hand-movement.ts
└── images/
    ├── icons/
    ├── illustrations/
    └── mascot/
```

---

## 用户体验细节

### 首次使用引导

#### 引导流程

```
步骤 1: 欢迎页面
  ↓
步骤 2: 应用介绍（3-5 页滑动卡片）
  ↓
步骤 3: 选择默认难度
  ↓
步骤 4: 音效和主题设置
  ↓
步骤 5: 开始第一个互动教程
  ↓
完成引导，进入主页
```

#### 引导内容

**欢迎页面**:
```yaml
标题: 欢迎来到认识时间！
插图: 可爱的时钟吉祥物
文字: 让我们一起学习认识时间吧！
按钮: 开始探索
```

**应用介绍**（滑动卡片）:
```yaml
卡片 1:
  标题: 认识时间
  内容: 了解时间的概念，学会看时钟
  插图: 时钟插图

卡片 2:
  标题: 互动学习
  内容: 通过有趣的游戏和动画学习
  插图: 互动界面

卡片 3:
  标题: 练习巩固
  内容: 完成练习，获得奖励
  插图: 奖杯插图
```

**难度选择**:
```yaml
标题: 选择你的起点
选项:
  - 图标: 🌱
    名称: 入门
    描述: 我刚开始学习认识时间
  - 图标: 🌿
    名称: 初级
    描述: 我已经认识整点和半点
  - 图标: 🌳
    名称: 中级
    描述: 我能读取大部分时间
  - 图标: 🏆
    名称: 高级
    描述: 我想挑战更难的内容
```

#### 引导实现

```typescript
// 引导状态
interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  skipped: boolean;
}

// 引导管理器
class OnboardingManager {
  // 开始引导
  startOnboarding(): void;
  
  // 下一步
  nextStep(): void;
  
  // 上一步
  previousStep(): void;
  
  // 跳过引导
  skipOnboarding(): void;
  
  // 完成引导
  completeOnboarding(): void;
  
  // 获取当前步骤
  getCurrentStep(): OnboardingStep;
}
```

---

### 错误提示

#### 错误类型

**操作错误**:
```yaml
invalid-time:        # 无效时间输入
  message: "这个时间好像不对哦，再试一次吧！"
  icon: "🤔"
  action: "重试"

no-selection:        # 未选择答案
  message: "记得选择一个答案哦！"
  icon: "👆"
  action: "去选择"

time-out:            # 超时
  message: "时间到啦！别担心，我们看下一题。"
  icon: "⏰"
  action: "下一题"
```

**系统错误**:
```yaml
network-error:       # 网络错误
  message: "网络好像不太稳定，请检查网络连接。"
  icon: "📡"
  action: "重试"

storage-full:        # 存储空间不足
  message: "存储空间不足，请清理一些空间。"
  icon: "💾"
  action: "知道了"
```

#### 错误提示设计

```typescript
// 错误提示配置
interface ErrorConfig {
  type: ErrorType;
  message: string;
  icon: string;
  action?: string;
  duration?: number;
  dismissible?: boolean;
}

// 错误提示管理器
class ErrorHandler {
  // 显示错误提示
  showError(config: ErrorConfig): void;
  
  // 隐藏错误提示
  hideError(): void;
  
  // 显示确认对话框
  showConfirm(message: string, onConfirm: () => void): void;
}
```

---

### 操作反馈

#### 视觉反馈

**按钮反馈**:
```css
/* 点击效果 */
.button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 加载状态 */
.button.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 成功状态 */
.button.success {
  background: var(--accent);
  animation: pulse 0.5s ease;
}
```

**拖拽反馈**:
```css
/* 拖拽开始 */
.draggable.dragging {
  opacity: 0.8;
  transform: scale(1.1);
  cursor: grabbing;
}

/* 放置目标高亮 */
.drop-zone.active {
  border: 2px dashed var(--primary);
  background: var(--bg-accent);
}
```

#### 触觉反馈（移动设备）

```typescript
// 触觉反馈管理器
class HapticManager {
  // 轻触反馈
  light(): void;
  
  // 中等反馈
  medium(): void;
  
  // 重度反馈
  heavy(): void;
  
  // 成功反馈
  success(): void;
  
  // 错误反馈
  error(): void;
}
```

#### 进度反馈

**加载状态**:
```yaml
skeleton:            # 骨架屏
  color: var(--bg-accent)
  animation: pulse 1.5s infinite

spinner:             # 加载动画
  type: rotating-clock
  color: var(--primary)
  size: 48px
```

**进度指示**:
```yaml
progress-bar:        # 进度条
  height: 12px
  animated: true
  show-percentage: true

step-indicator:      # 步骤指示器
  style: dots
  current-highlighted: true
```

---

### 加载状态

#### 骨架屏设计

```typescript
// 骨架屏组件
interface SkeletonProps {
  variant: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | false;
}

// 骨架屏示例
<Skeleton variant="circle" width={120} height={120} />
<Skeleton variant="rect" width="100%" height={20} />
<Skeleton variant="text" width="60%" />
```

#### 加载动画

```typescript
// 加载动画组件
const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <ClockIcon className="rotating" />
    <p>加载中...</p>
  </div>
);

// 页面加载
const PageLoader: React.FC = () => (
  <div className="page-loader">
    <AnalogClock time={{ hours: 0, minutes: 0, seconds: 0 }} animated />
    <p>准备中...</p>
  </div>
);
```

---

## 部署与发布

### 构建流程

#### 环境配置

```yaml
# .env.development
VITE_APP_TITLE=认识时间
VITE_APP_ENV=development
VITE_APP_BASE_URL=/

# .env.production
VITE_APP_TITLE=认识时间
VITE_APP_ENV=production
VITE_APP_BASE_URL=/clock-app/
```

#### 构建命令

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

#### 构建配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      manifest: {
        name: '认识时间',
        short_name: '时钟学习',
        description: '面向低年级学生的时间学习教育应用',
        theme_color: '#6366F1',
        background_color: '#F3F4F6',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: process.env.VITE_APP_BASE_URL || '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animation: ['gsap', 'framer-motion'],
          ui: ['tailwindcss']
        }
      }
    }
  }
});
```

---

### CI/CD 配置

#### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          VITE_APP_BASE_URL: /clock-app/
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### Cloudflare Pages

```yaml
# Cloudflare Pages 配置
# 在 Cloudflare Dashboard 中设置：
# Build command: npm run build
# Build output directory: dist
# Root directory: /
# Environment variables: VITE_APP_BASE_URL=/
```

---

### 版本管理

#### 版本号规范

```
主版本号.次版本号.修订号

例如：1.0.0
- 主版本号：重大功能更新或不兼容的 API 修改
- 次版本号：功能增加，向下兼容
- 修订号：Bug 修复，向下兼容
```

#### 更新日志

```markdown
# CHANGELOG.md

## [1.1.0] - 2024-03-15

### Added
- 新增加护眼主题
- 新增连续学习成就系统

### Changed
- 优化时钟拖拽交互体验
- 提升动画性能

### Fixed
- 修复数字时钟滚动选择器边界问题
- 修复 PWA 离线缓存问题
```

---

## 测试与质量保证

### 单元测试

#### 测试框架

```yaml
测试运行器: Vitest
测试库: @testing-library/react
断言库: Vitest (内置)
覆盖率工具: @vitest/coverage-v8
```

#### 测试示例

```typescript
// __tests__/utils/time.test.ts
import { describe, it, expect } from 'vitest';
import { ClockTimeUtils } from '@/utils/time';

describe('ClockTimeUtils', () => {
  describe('isValid', () => {
    it('should return true for valid time', () => {
      const time = { hours: 12, minutes: 30, seconds: 0 };
      expect(ClockTimeUtils.isValid(time)).toBe(true);
    });
    
    it('should return false for invalid time', () => {
      const time = { hours: 25, minutes: 70, seconds: 80 };
      expect(ClockTimeUtils.isValid(time)).toBe(false);
    });
  });
  
  describe('format', () => {
    it('should format time in 12-hour format', () => {
      const time = { hours: 14, minutes: 30, seconds: 0 };
      expect(ClockTimeUtils.format(time, '12h')).toBe('2:30 PM');
    });
  });
});
```

#### 组件测试

```typescript
// __tests__/components/AnalogClock.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnalogClock } from '@/components/clock/AnalogClock';

describe('AnalogClock', () => {
  it('should render correctly', () => {
    const time = { hours: 12, minutes: 0, seconds: 0 };
    render(<AnalogClock time={time} />);
    
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  
  it('should display correct time', () => {
    const time = { hours: 3, minutes: 15, seconds: 0 };
    render(<AnalogClock time={time} />);
    
    // 验证指针位置
  });
});
```

---

### 端到端测试

#### Playwright 配置

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
});
```

#### E2E 测试示例

```typescript
// e2e/game.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Game Practice', () => {
  test('should complete a beginner level game', async ({ page }) => {
    await page.goto('/');
    
    // 点击练习按钮
    await page.click('text=游戏练习');
    
    // 选择难度
    await page.click('text=入门');
    
    // 开始游戏
    await page.click('text=开始练习');
    
    // 完成所有题目
    for (let i = 0; i < 3; i++) {
      // 选择答案
      await page.click('[data-testid="answer-option-0"]');
      await page.click('text=提交');
      await page.click('text=下一题');
    }
    
    // 验证结果页面
    await expect(page.locator('text=练习完成')).toBeVisible();
  });
});
```

---

### 性能测试

#### 性能指标

```yaml
首屏加载时间: < 2s
交互时间: < 3s
动画帧率: > 60fps
Lighthouse 得分: > 90
```

#### 性能测试工具

```typescript
// 使用 Lighthouse CI
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:5173/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'interactive': ['warn', { maxNumericValue: 3000 }],
        'categories:performance': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

---

### 用户测试计划

#### 测试目标

```yaml
可用性测试:
  - 儿童是否能独立完成操作
  - 界面是否清晰易懂
  - 交互是否流畅自然

教育效果测试:
  - 学习前后时间认知能力对比
  - 知识掌握程度评估

用户体验测试:
  - 满意度调查
  - 使用时长统计
  - 功能使用频率
```

#### 测试方法

```yaml
方法 1: 观察法
  - 观察 5-10 名儿童使用应用
  - 记录操作流程和困难点
  - 收集即时反馈

方法 2: 问卷调查
  - 设计儿童友好的问卷
  - 收集使用体验和建议
  - 量化满意度

方法 3: 数据分析
  - 收集使用数据（匿名）
  - 分析功能使用情况
  - 识别优化点
```

---

## 总结

本设计文档涵盖了"认识时间"教育应用的完整设计规范，包括：

### 已完成的设计内容

1. ✅ **项目概述** - 项目目的、功能支持、整体风格、应用要求
2. ✅ **技术架构设计** - 技术选型、项目架构、关键技术实现、性能优化
3. ✅ **UI/UX 设计规范** - 色彩方案、字体规范、组件设计、响应式布局
4. ✅ **数据模型设计** - 核心数据模型、数据存储方案、数据流程
5. ✅ **音频与动画资源** - 音效资源、动画资源、资源文件组织
6. ✅ **用户体验细节** - 首次使用引导、错误提示、操作反馈、加载状态
7. ✅ **部署与发布** - 构建流程、CI/CD 配置、版本管理
8. ✅ **测试与质量保证** - 单元测试、端到端测试、性能测试、用户测试

### 设计亮点

- **儿童友好设计**: 明亮活泼的色彩、卡通风格、大尺寸交互元素
- **完善的教学体系**: 循序渐进的难度设置、丰富的互动形式
- **优秀的技术架构**: React + TypeScript + GSAP，性能优秀，易于维护
- **良好的用户体验**: 首次使用引导、及时反馈、离线可用
- **可扩展性强**: 模块化设计，便于后续功能扩展

### 后续工作建议

1. **原型设计**: 使用 Figma 制作高保真原型
2. **用户测试**: 邀请目标用户进行可用性测试
3. **迭代优化**: 根据测试反馈持续优化设计
4. **内容制作**: 准备教学动画、音效等资源
5. **开发实施**: 按照设计文档进行开发

---

本文档为应用开发提供了完整的设计指导，确保开发团队能够构建出一个高质量、用户友好的儿童教育应用。