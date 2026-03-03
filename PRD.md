# AI 日记 App - 产品需求文档

## 产品概述
**产品名称**: DiaryAI (暂定)
**定位**: 极简温暖的 AI 赋能个人日记应用
**部署**: Vercel
**用户**: 单人使用（可扩展）

## 技术栈
- **前端**: Next.js 14 + TypeScript + TailwindCSS
- **UI 组件**: shadcn/ui + Lucide 图标
- **后端**: Next.js API Routes
- **数据库**: Firebase Firestore
- **认证**: Firebase Authentication
- **AI**: DeepSeek API

## 功能需求

### 1. 用户认证
- [ ] Firebase 邮箱密码登录
- [ ] 登出功能
- [ ] 登录态持久化

### 2. 日记管理
- [ ] 创建/编辑日记
- [ ] 自动保存草稿
- [ ] 按日期列表展示
- [ ] 查看历史日记
- [ ] 删除日记
- [ ] 搜索日记（标题/内容）

### 3. AI 功能
- [ ] **智能总结**: 写完日记后自动生成内容摘要
- [ ] **暖心鼓励**: 根据内容情绪给予正向反馈
- [ ] **灵感提问**: 提供 3-5 个引导性问题帮助记录
- [ ] **情绪识别**: 自动识别当日情绪（可选标签）

### 4. 界面设计
- **风格**: 极简 + 温暖
- **配色**: 暖色调（米白/浅黄/柔和橙）
- **字体**: 清晰易读的无衬线字体
- **交互**: 流畅、简洁、无干扰

## 数据模型

### User (Firebase Auth)
```
uid: string
email: string
createdAt: timestamp
```

### Diary (Firestore)
```
id: string
userId: string
title: string
content: string
mood?: string  // happy, calm, sad, anxious, etc.
weather?: string
aiSummary?: string
aiEncouragement?: string
createdAt: timestamp
updatedAt: timestamp
```

## API 设计

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/diaries` | GET | 获取用户日记列表 |
| `/api/diaries` | POST | 创建日记 |
| `/api/diaries/:id` | GET | 获取单篇日记 |
| `/api/diaries/:id` | PUT | 更新日记 |
| `/api/diaries/:id` | DELETE | 删除日记 |
| `/api/ai/summarize` | POST | AI 总结日记 |
| `/api/ai/encourage` | POST | AI 生成鼓励 |
| `/api/ai/questions` | POST | AI 生成灵感问题 |

## 环境变量 (.env.local)

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# DeepSeek
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 开发计划

### Phase 1 - 基础框架 (Day 1)
- [x] 项目初始化
- [ ] Firebase 配置
- [ ] 认证系统
- [ ] 基础布局

### Phase 2 - 日记 CRUD (Day 2)
- [ ] 日记列表页
- [ ] 编辑器页面
- [ ] Firestore 集成

### Phase 3 - AI 功能 (Day 3)
- [ ] AI 总结
- [ ] AI 鼓励
- [ ] AI 灵感问题

### Phase 4 - 优化部署 (Day 4)
- [ ] UI 细节优化
- [ ] 响应式适配
- [ ] Vercel 部署
