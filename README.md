# DiaryAI - AI 赋能的日记应用

一个极简温暖的 AI 日记应用，帮助你记录生活、获得鼓励和灵感。

## ✨ 功能特性

- 📝 **日记记录** - 简洁的编辑器，随时记录生活点滴
- 🤖 **AI 总结** - 自动生成日记内容摘要
- 💝 **暖心鼓励** - 根据内容给予正向反馈
- 💡 **灵感提问** - 不知道写什么时，AI 为你生成引导性问题
- 🔐 **安全私密** - Firebase 认证，数据隔离

## 🚀 快速开始

### 1. 环境变量配置

复制环境变量模板并填入你的配置：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件：

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

### 2. Firebase 设置

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目
3. 启用 **Authentication**（邮箱/密码登录）
4. 启用 **Firestore Database**
5. 复制配置到 `.env.local`

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📦 部署到 Vercel

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 部署：
```bash
vercel
```

3. 设置环境变量（在 Vercel 控制台）：
   - 所有 `.env.local` 中的变量

4. 重新部署：
```bash
vercel --prod
```

## 🛠 技术栈

- **前端**: Next.js 14 + TypeScript + TailwindCSS
- **UI**: 自研组件 + Lucide 图标
- **后端**: Next.js API Routes
- **数据库**: Firebase Firestore
- **认证**: Firebase Authentication
- **AI**: DeepSeek API

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证页面
│   │   └── login/         # 登录/注册页
│   ├── (dashboard)/       # 主应用页面
│   │   ├── diary/[id]/    # 日记详情页
│   │   ├── edit/[id]/     # 编辑日记页
│   │   ├── new/           # 新建日记页
│   │   └── page.tsx       # 首页（日记列表）
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/
│   ├── ui/                # UI 组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Textarea.tsx
│   └── DashboardLayout.tsx
├── contexts/
│   └── AuthContext.tsx    # 认证上下文
└── lib/
    ├── ai/                # AI 服务
    │   └── deepseek.ts
    ├── firebase/          # Firebase 配置
    │   ├── auth.ts
    │   ├── config.ts
    │   └── firestore.ts
    └── utils.ts
```

## 📝 API 说明

### AI 功能

- **总结日记**: 调用 DeepSeek API 生成 100 字以内的摘要
- **鼓励话语**: 根据日记内容给予温暖鼓励
- **灵感问题**: 生成 5 个引导性问题帮助记录

## 🔒 安全说明

- 所有日记数据存储在 Firebase Firestore，与用户 UID 绑定
- 建议在生产环境配置 Firestore 安全规则
- API Key 应妥善保管，不要提交到版本控制

## 📄 License

MIT
