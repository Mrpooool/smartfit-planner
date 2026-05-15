# SmartFit Planner 项目结构与核心架构解析

本文档将详细介绍 SmartFit Planner 项目的整体架构、目录结构以及核心功能是如何通过各个模块协同实现的。

## 1. 技术栈与整体架构

本项目是一个基于 **React Native** 和 **Expo** 开发的跨平台移动应用。
在架构设计上，项目采用了 **MVP (Model-View-Presenter)** 的设计模式，并结合了响应式状态管理，将 UI 渲染、业务逻辑和数据存储进行了有效的解耦。

*   **前端框架**: React Native + Expo (采用 Expo Router 进行基于文件的路由管理)
*   **架构模式**: MVP (Model-View-Presenter)
*   **状态管理**: Zustand (`src/model` 目录)
*   **后端/云服务**: Firebase (Authentication 负责登录注册, Firestore 负责数据存储)
*   **外部 API**: ExerciseDB (获取运动数据), GLM / Zhipu AI (大模型智能生成训练计划)

## 2. 核心目录结构

项目的主要代码集中在 `app/` 和 `src/` 两个目录下：

```text
smartfit-planner/
├── app/                  # 路由目录 (基于 Expo Router 的文件路由)
│   ├── (tabs)/           # 底部导航栏页面 (Explore, Plan, Timer, Profile 等)
│   ├── _layout.jsx       # 全局路由布局与导航容器
│   ├── login.jsx         # 登录页路由入口
│   └── ...               
├── src/                  # 源代码目录 (核心业务与UI，解耦路由)
│   ├── api/              # 外部 API 接口封装 (大模型GLM、第三方运动数据ExerciseDB)
│   ├── model/            # 状态管理 (Zustand Stores，在内存中管理全局状态)
│   ├── persistence/      # 数据持久化层 (Firebase 数据库读写与认证)
│   ├── presenters/       # 业务逻辑层 (MVP中的Presenter，连接视图与数据)
│   ├── views/            # UI 视图层 (MVP中的View，纯 React 组件，不含复杂业务)
│   ├── utils/            # 工具函数
│   ├── types/            # 类型定义
│   └── theme.js          # 全局主题配置 (颜色、字体等)
├── eas.json              # Expo Application Services 配置文件 (打包、发布)
├── firebase.json         # Firebase 配置文件
└── package.json          # 项目依赖与运行脚本
```

## 3. 核心功能与对应文件实现

根据 MVP 架构，应用的核心功能都是由 **View (视图) -> Presenter (逻辑) -> Model / Persistence / API (数据)** 这条链路串联起来的。

### 3.1 浏览与搜索动作库 (Explore 功能)
*   **视图层 (`src/views/ExplorerView.jsx`)**: 负责渲染搜索框、分类标签（部位、器械）和动作列表瀑布流/卡片。
*   **逻辑层 (`src/presenters/ExplorerPresenter.jsx`)**: 处理用户的搜索输入、分类点击事件，调用 API 获取数据，并把数据处理后传递给 View。
*   **数据层 (`src/api/exerciseDbApi.js`)**: 封装了请求 ExerciseDB 的网络请求，拉取真实的健身动作数据。

### 3.2 智能生成/管理训练计划 (Plan 功能)
这是应用的核心业务之一。
*   **视图层 (`src/views/PlanView.jsx` & `src/views/GeneratorView.jsx`)**: `PlanView` 展示当前的训练计划列表和详情；`GeneratorView` 是通过大模型生成计划的交互界面。
*   **逻辑层 (`src/presenters/PlanPresenter.jsx` & `src/presenters/GeneratorPresenter.jsx`)**: 
    *   `GeneratorPresenter` 收集用户的身体数据和目标，调用大模型 API 生成计划。
    *   `PlanPresenter` 处理计划的增删改查、标记完成等逻辑。
*   **状态层 (`src/model/planStore.js`)**: 使用 Zustand 在内存中全局管理用户的训练计划数据，确保各个页面（如首页概览和计划列表）数据同步。
*   **云端同步 (`src/persistence/planRepo.js`)**: 将生成的计划保存到 Firebase Firestore，或从云端拉取历史计划，实现多设备数据同步。
*   **大模型接口 (`src/api/glmApi.js`)**: 封装对接 Zhipu/GLM 大模型的 prompt 构建和网络请求。

### 3.3 训练计时与执行 (Timer 功能)
*   **视图层 (`src/views/TimerView.jsx`)**: 渲染倒计时表盘、组数记录、开始/暂停/休息等控制按钮。
*   **逻辑层 (`src/presenters/TimerPresenter.jsx`)**: 核心计时逻辑的实现。管理倒计时的生命周期（活跃、暂停、休息），处理毫秒级的时间计算，并在训练完成时更新计划的进度。

### 3.4 用户系统与个人主页 (Auth & Profile)
*   **视图层 (`src/views/LoginView.jsx`, `RegisterView.jsx`, `ProfileView.jsx`)**: 登录/注册表单和用户个人信息展示、设置界面。
*   **逻辑层 (`src/presenters/LoginPresenter.jsx`, `ProfilePresenter.jsx`)**: 处理表单验证、登录流程控制以及退出登录逻辑。
*   **状态与存储 (`src/model/userStore.js` & `src/persistence/authRepo.js`)**: `authRepo.js` 负责与 Firebase Auth 交互验证身份；`userStore.js` 负责在 App 运行期间缓存当前用户的基本信息、偏好设置。

## 4. 数据流转示例 (以"生成训练计划"为例)

1.  **用户交互**: 用户在 `app/(tabs)/plan.jsx` 进入计划页面，点击生成计划按钮，进入 `GeneratorView.jsx` 界面。
2.  **触发逻辑**: 用户填好身体参数和目标点击提交，`GeneratorView` 调用 `GeneratorPresenter` 暴露的方法。
3.  **请求 API**: `GeneratorPresenter` 将参数组装，调用 `src/api/glmApi.js` 向大模型发送请求。
4.  **更新状态**: 拿到大模型返回的 JSON 格式计划后，`GeneratorPresenter` 将其进行数据清洗和格式化，并调用 `src/model/planStore.js` 的 `addPlan` 方法更新全局状态。
5.  **云端持久化**: 同时调用 `src/persistence/planRepo.js` 将这个新计划异步存入 Firebase 数据库。
6.  **UI 响应**: 由于 View 层（如 `PlanView`）订阅了 `planStore` 的状态变化，一旦状态更新，界面会自动重新渲染，展示出最新生成的训练计划。
