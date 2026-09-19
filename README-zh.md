# SmartFit Planner

**基于 React Native 与 Expo 构建的 AI 健身计划与训练追踪应用。**

[English](README.md) | 简体中文

SmartFit Planner 是一款面向健身初学者的跨平台移动应用，帮助用户根据自己的训练条件快速生成结构化训练计划，并完成从计划生成到训练记录的完整流程。

用户可以根据**训练时长、可用器械、训练水平和目标肌群**生成个性化训练计划。AI 生成的动作会进一步与 ExerciseDB 中的真实动作数据匹配，以补充动作信息和演示内容；Firebase Authentication 与 Cloud Firestore 用于账号管理和用户数据持久化。

应用覆盖完整训练链路：**生成 → 预览 → 调整 → 保存 → 训练 → 记录**。

## 主要功能

### AI 训练计划生成

用户可以根据以下条件生成训练计划：

- 训练时长：15 / 30 / 60 分钟
- 可用训练器械
- 训练水平
- 目标肌群

生成流程调用 **GLM API**，并通过结构化 JSON 输出约束与字段校验，提高训练计划输出的一致性。

生成后的动作名称会进行规范化处理，并与 **ExerciseDB** 匹配，从真实动作库中补充动作信息和演示数据。

### 动作浏览

通过 ExerciseDB 浏览和搜索训练动作：

- 按名称搜索动作
- 按身体部位筛选
- 查看动作详情和演示
- 将动作加入已有训练计划
- 从动作库直接创建自定义训练计划

### 训练计划管理

用户可以：

- 在保存前预览 AI 生成的计划
- 修改计划名称
- 调整组数和次数
- 添加或删除动作
- 创建自定义训练计划
- 保存和删除计划
- 重复使用历史训练计划

### 训练计时与执行

内置训练计时流程支持实际训练：

- 选择已保存的训练计划
- 按动作和组数逐步完成训练
- 记录训练时长
- 在完成最后一组后记录训练完成状态
- 保存训练时长与训练历史

### 训练进度记录

Profile 页面提供训练数据概览：

- 总训练次数
- 最近一周训练次数
- 已保存计划数量
- 当日训练时长
- 累计训练时长
- 日历形式的训练记录
- 查看指定日期的训练详情

### 用户认证与云端同步

SmartFit Planner 使用 **Firebase Authentication** 和 **Cloud Firestore** 实现：

- 用户注册与登录
- 密码找回
- 用户级训练数据隔离
- 训练计划持久化
- 训练历史持久化
- 训练时长记录
- Firestore 实时数据同步

不同用户的数据通过 Firebase UID 分离存储。

## AI 生成流程

训练计划生成由多个步骤组成：

1. 用户选择训练时长、器械、训练水平和目标肌群。
2. 应用向 GLM 模型发送结构化请求。
3. 模型返回经过字段约束的 JSON 训练计划。
4. 系统规范化 AI 生成的动作名称。
5. 从 ExerciseDB 查询多个候选动作。
6. 根据动作名称、目标肌群和器械信息对候选结果进行匹配。
7. 将匹配到的 ExerciseDB 数据合并到训练计划。
8. 用户预览、编辑并保存最终计划。

如果某个 AI 生成动作无法成功匹配 ExerciseDB，应用会保留原始动作信息继续生成计划，避免单个动作匹配失败导致整个流程失败。

## 架构

项目采用 **MVP 风格架构 + MobX 状态管理**：

- **Views**：负责 React Native UI 渲染和用户交互
- **Presenters**：负责用户操作、路由、异步流程与业务逻辑协调
- **MobX Stores**：维护训练计划、用户状态、UI 状态和训练历史
- **API Layer**：封装 GLM API 与 ExerciseDB
- **Persistence Layer**：封装 Firebase Authentication 与 Firestore 数据同步
- **Expo Router**：负责文件路由与页面导航

这一结构将 UI、业务逻辑、外部 API 和数据持久化职责进行拆分，便于维护和扩展。

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 移动端 | React Native |
| 框架 | Expo |
| 路由 | Expo Router |
| 状态管理 | MobX / mobx-react-lite |
| AI | GLM API |
| 动作数据 | ExerciseDB via RapidAPI |
| 用户认证 | Firebase Authentication |
| 数据库 | Cloud Firestore |
| 测试 | Jest |
| 开发语言 | JavaScript / JSX |

## 项目结构

- `app/` — Expo Router 页面与路由入口
- `src/presenters/` — Presenter 与业务流程
- `src/views/` — React Native UI 组件
- `src/model/` — MobX Store
- `src/api/` — GLM 与 ExerciseDB API 封装
- `src/persistence/` — Firebase 认证与 Firestore 持久化
- `src/utils/` — AI 训练计划处理与通用工具
- `assets/` — 图片、图标等静态资源

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写 Firebase 配置。

同时需要配置：

```text
EXPO_PUBLIC_GLM_API_KEY=...
EXPO_PUBLIC_RAPIDAPI_KEY=...
```

### 3. 启动项目

```bash
npm run expo
```

可以使用 Expo Go 扫描终端中的二维码，也可以通过 Android / iOS 开发环境运行。

## 常用命令

运行测试：

```bash
npm test
```

运行 lint：

```bash
npm run lint
```

启动 Expo：

```bash
npm run expo
```

## 项目目标

很多健身初学者知道自己需要运动，但很难确定**应该练什么、练多少，以及如何根据时间和现有器械安排训练**。

SmartFit Planner 探索了如何将 LLM 集成到完整的移动应用工作流中，同时结合结构化输出、字段校验、真实动作数据库、用户状态持久化和常规软件架构，使 AI 生成能力能够真正进入可执行的产品流程。
