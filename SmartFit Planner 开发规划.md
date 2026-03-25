# **SmartFit Planner: 产品概念与技术规划**

## **1. 项目概述 (Project Overview)**

**SmartFit Planner** 是一款为健身新手和居家训练爱好者打造的 React Native 移动端应用。

市面上的大多数应用只是提供庞大的动作库，让用户自己去拼凑计划。我们改变了这种模式。用户只需告诉应用他们有多少时间、什么器械以及想练哪个部位，我们的系统就会调用大模型 (GLM-5)，结合第三方动作库 (ExerciseDB)，直接生成一份带有 GIF 演示的定制训练计划。

应用的核心用户流是：**条件输入 \-\> 智能生成 \-\> 计划保存 \-\> 日志服务。**

---

## **2. 目标用户与 UX 策略**

### **2.1 目标用户 (Target Group)**

18–30 岁健身新手，主要在家、宿舍或仅有基础器械的环境中训练，没有私教指导经验。

### **2.2 用户痛点与产品价值**

| 痛点 | SmartFit 的解决方案 |
|------|-------------------|
| 不知道该做什么动作 | AI 根据条件自动生成结构化计划 |
| 不会根据现有器材规划训练 | 用户选择可用器械，系统自动匹配可行动作 |
| 动作不标准、怕受伤 | 每个动作附带 GIF 动画演示和文字指导 |
| 无法坚持（缺乏记录和反馈） | 日历打卡 + 周训练量柱状图提供可视化反馈 |

### **2.3 可用性测试计划**

| 阶段 | 时间节点 | 内容 | 产出 |
|------|---------|------|------|
| Low-fi 原型测试 | 第 3 周 | Figma 原型 + 30 min 用户访谈（3 人） | 发现的问题清单 + 改进方案文档 |
| Formative Evaluation | 第 5 周 | 功能原型可用性测试 30 min（3 人） | 可用性问题 + 创意改进文档 |

每次测试后产出文档化报告，包含：发现的问题、严重程度评级、对应的改进措施及实施情况。

---

## **3. 技术选型 (Tech Stack)**

我们完全沿用课程 Lab 中经过验证的架构方案，确保符合 A 级评分标准中的 Separation of Concerns（关注点分离）。

* **核心框架:** React Native (基于 Expo 搭建)
* **状态管理 (State Manager):** MobX。我们将构建一个纯粹的 POJO (Plain Old JavaScript Object) 模型，用 `observable` 追踪状态，**所有状态变更必须通过 `action` 进行**，异步操作使用 `flow`。
* **架构模式:** MVP (Model-View-Presenter)。使用 mobx-react-lite 的 `observer` 封装 Presenters，确保所有 Views 都是只负责渲染的"笨组件"（仅接收 props，不访问 store）。
* **路由导航:** Expo Router。利用基于文件系统的路由，处理页面跳转和底部导航栏。
* **数据持久化与鉴权:** Firebase。强制使用 Email/Password 登录获取唯一的 uid，并将用户的自定义计划存入 Firestore。**使用 Firestore `onSnapshot` 实现实时同步**，用户在多设备/多实例上看到相同数据（live update）。所有 Firebase 读写由 MobX 的 `reaction` / `flow` 触发，Presenter 和 View 绝不直接调用 Firebase API。
* **核心 API (Mash-up 策略):**
  * **GLM-5 (智谱 AI):** 负责处理用户输入的条件，生成结构化的 JSON 训练计划。
  * **ExerciseDB (RapidAPI):** 根据 AI 生成的动作名称，匹配具体的肌群数据和教学 GIF。
* **用户可见第三方组件 (User-visible Third-party Components):**
  * **图表:** `react-native-chart-kit` — 用于 Profile 页的周训练量柱状图
  * **日历:** `react-native-calendars` — 用于 Profile 页的训练打卡日历视图

---

## **4. 架构与目录结构**

### **4.1 四层关注点分离**

| 层 | 职责 | 规则 |
|----|------|------|
| **Model** (Application State) | 纯 POJO + MobX observable/action/flow | 不导入任何 UI 库或 Firebase API |
| **Persistence** | Firebase Auth + Firestore 读写 | 仅被 Model 层的 reaction/flow 调用 |
| **Presenter** | 用 `observer` 连接 Model 和 View，处理交互逻辑 | 不包含 JSX 渲染细节，不直接调用 Persistence |
| **View** | 纯渲染组件，只接收 props | 不访问 store、不调用 action、不导入 Firebase |

### **4.2 目录结构**

```
smartfit-planner/
├── app/                        # Expo Router 路由层（保持在项目根目录，不迁移到 src）
│   ├── _layout.jsx
│   ├── (tabs)/
│   │   ├── _layout.jsx
│   │   ├── index.jsx           # 仅做路由入口，直接 export default GeneratorPresenter
│   │   ├── explore.jsx         # 仅做路由入口，直接 export default ExplorerPresenter
│   │   └── profile.jsx         # 仅做路由入口，直接 export default ProfilePresenter
│   ├── details.jsx             # 仅做路由入口，直接 export default DetailsPresenter
│   └── login.jsx               # 仅做路由入口，直接 export default LoginPresenter
└── src/
    ├── types/                  # 共享数据结构定义（Day 1 最小合同）
    │   └── workout.js          # WorkoutPlan、Exercise 对象结构（JSDoc 注释说明字段）
    ├── model/                  # POJO + MobX store（仅状态与 action/flow）
    │   ├── planStore.js
    │   └── userStore.js
    ├── persistence/            # Firebase 持久化（仅供 model 调用）
    │   ├── firebaseConfig.js
    │   ├── authRepo.js
    │   └── planRepo.js
    ├── api/                    # 外部 API 封装
    │   ├── glmApi.js
    │   └── exerciseDbApi.js
    ├── presenters/             # observer 连接 model 和 view
    │   ├── GeneratorPresenter.jsx
    │   ├── ExplorerPresenter.jsx
    │   ├── DetailsPresenter.jsx
    │   ├── ProfilePresenter.jsx
    │   └── LoginPresenter.jsx
    └── views/                  # 纯渲染组件（只收 props）
        ├── common/
        │   └── AsyncStateView.jsx   # 通用 loading/error/empty（替代多份 suspenseView）
        ├── GeneratorView.jsx
        ├── ExplorerView.jsx
        ├── ExerciseCardView.jsx
        ├── PlanDetailView.jsx
        ├── ProfileView.jsx
        ├── LoginView.jsx
        ├── CalendarView.jsx
        └── ChartView.jsx
```

最小化原则（避免过度设计）：
- 不新增 `src/app`，继续使用 Expo 默认根目录 `app/`。
- `app/` 下的路由文件只做一件事：`export default XxxPresenter`，不含任何业务逻辑。
- 不引入 lab 的 `"/src/views"` alias 机制，直接使用常规相对路径或 `@/*`。
- 只保留一个通用异步状态组件 `AsyncStateView.jsx`，不为每个页面重复造 `SuspenseView`。

---

## **5. UX 反馈与状态可见性设计**

### **5.1 用户操作反馈 (Feedback on User Actions)**

| 场景 | 反馈方式 |
|------|---------|
| 点击 "GENERATE SMART PLAN" | 按钮变为 disabled + Skeleton UI 占位动画 |
| AI 计划生成完成 | Skeleton 替换为实际内容 + 轻微动画过渡 |
| AI 生成失败 / 网络错误 | Toast 提示错误信息 + "重试"按钮 |
| 保存计划到 Firebase | Toast 提示 "保存成功" / "保存失败" |
| 从 Explorer 添加动作到自定义计划 | 按钮变为已添加状态（视觉切换） + 底部计数器更新 |
| 删除已保存的计划 | 确认对话框 → 删除成功 Toast |
| 表单输入缺少必填项 | 实时 inline 验证提示 |

### **5.2 系统状态可见性 (Visibility of System Status)**

| 状态 | 展示方式 |
|------|---------|
| API 请求加载中 | Skeleton UI / Spinner + 文字提示（如"AI 正在为你生成计划..."） |
| 网络断开 | 全局 Banner 提示离线状态 |
| 无已保存的计划 | 空状态插画 + 引导文案（如"还没有计划，去生成一个吧！"） |
| 登录状态 | 顶部显示用户名，Profile 页显示登录信息 |
| 训练完成打卡 | 日历上对应日期高亮 + 柱状图实时更新 |

### **5.3 用户控制权 (User in Control)**

- AI 生成过程中用户可以切换到 Explore 等其他页面，不阻塞整个 UI
- 用户可以编辑 AI 生成计划中的组数/次数
- 用户可以自定义计划名称
- 删除操作需二次确认

---

## **6. API 错误处理与降级策略**

| API | 错误场景 | 降级策略 |
|-----|---------|---------|
| GLM-5 | 超时 / 服务不可用 | 显示错误提示 + 重试按钮；引导用户使用 Explorer 手动组建计划 |
| GLM-5 | 返回格式异常 | 捕获解析错误，提示用户重新生成 |
| ExerciseDB | 超时 / 服务不可用 | 显示动作名称和文字说明，GIF 位置显示占位图 + "加载失败" |
| ExerciseDB | 未匹配到动作 | 显示 "未找到对应动作演示"，不阻断计划展示 |
| Firebase | 写入失败 | Toast 提示 + 本地暂存，网络恢复后重试 |

---

## **7. 核心界面线框图 (Screen Wireframes)**

### **7.1. Smart Generator (Home)**

This is the main landing page where users generate AI fitness plans.

```
+---------------------------------------+
| 👤 Hi, Alex!                          |
|                                       |
| ⚡ SMART PLAN GENERATOR                |
|                                       |
| 1. Time Available:                    |
| 🔘 15 mins   ⚪ 30 mins   ⚪ 60 mins   |
|                                       |
| 2. Equipment:                         |
| ✅ None     ⬜ Dumbbells              |
| ⬜ Bands    ⬜ Full Gym               |
|                                       |
| 3. Target Muscle Group:               |
| 🔽 [ Full Body ]                      |
|                                       |
| 🟩 [ GENERATE SMART PLAN ]            |
|                                       |
| * Interaction Note:                   |
|   Button becomes disabled on click.   |
|   Skeleton UI displays while waiting  |
|   for GLM-5 API response.             |
|   User can navigate to other tabs     |
|   while generation is in progress.    |
|                                       |
| ------------------------------------- |
| 🏠 Home | 🔍 Explore | 👤 Profile       |
+---------------------------------------+
```

### **7.2. Exercise Explorer (Search)**

Page to browse the ExerciseDB database, with an option to add exercises to a custom plan.

```
+---------------------------------------+
| Explore Exercises                     |
|                                       |
| 🔍 [ Search (e.g., Squat)... ]        |
|                                       |
| Filters:                              |
| [ All ] [ Chest ] [ Legs ] [ Back ]   |
|                                       |
| 🖼️ [GIF Placeholder]                   |
| Push-up (Target: Chest)     [➕ Add]  |
|                                       |
| 🖼️ [GIF Placeholder]                   |
| Squat (Target: Legs)        [➕ Add]  |
|                                       |
| 🖼️ [GIF Placeholder]                   |
| Pull-up (Target: Back)      [➕ Add]  |
|                                       |
| ------------------------------------- |
| 📋 Custom Plan: 2 Exercises           |
| 📦 [ View / Save ]                    |
|                                       |
| * Interaction Note:                   |
|   'Add' toggles to '✓ Added' state   |
|   and updates bottom counter.         |
|   'View' opens the Details modal.     |
|                                       |
| ------------------------------------- |
| 🏠 Home | 🔍 Explore | 👤 Profile       |
+---------------------------------------+
```

### **7.3. Workout Details (Modal/Overlay)**

Displays the generated plan or the user's manually assembled plan. Includes custom naming.

```
+---------------------------------------+
| ⬅️ Back                                |
|                                       |
| ✏️ [ Plan Name: Enter custom name... ] |
|                                       |
| 1. Push-ups                           |
| 🖼️ [==== Exercise GIF Animation ====]  |
| 🔢 Sets: 3  |  Reps: 12 (Editable)    |
| 📝 Instructions: Keep core tight...   |
|                                       |
| 2. Bodyweight Squats                  |
| 🖼️ [==== Exercise GIF Animation ====]  |
| 🔢 Sets: 3  |  Reps: 15 (Editable)    |
| 📝 Instructions: Go below parallel... |
|                                       |
| ------------------------------------- |
| ⭐ [ SAVE PLAN TO LIBRARY ]             |
| 📦 [ MARK AS COMPLETED ]                |
|                                       |
| * Interaction Note:                   |
|   Users can edit sets/reps inline.    |
|   Save writes to Firebase via MobX    |
|   action → reaction → Firestore.     |
|   Success/failure shown via Toast.    |
+---------------------------------------+
```

### **7.4. Profile & Saved Plans**

Data persistence showcase. Lists saved plans and visualizes workout progress.

```
+---------------------------------------+
| Profile & Progress                    |
|                                       |
| 📋 My Saved Plans:                    |
| 💪 15-Min Core Crusher    [ ▶️ START ] |
| 💪 My Push Day (Custom)   [ ▶️ START ] |
|                                       |
| * Empty State:                        |
|   If no saved plans, show:            |
|   illustration + "还没有计划，        |
|   去生成一个吧！"                      |
|                                       |
| 📅 Workout Consistency:               |
| [ react-native-calendars Component ]  |
| * Highlights completed workout dates. |
|                                       |
| 📊 Workouts per week:                 |
| [ react-native-chart-kit Component ]  |
| ⬆️ 5 |                                |
| ⬆️ 4 |       🟩       🟩              |
| ⬆️ 3 |       🟩       🟩       🟩     |
| ➡ 0 +------------------------------  |
|       Week 1   Week 2   Week 3        |
|                                       |
| 🔥 [ LOGOUT ]                           |
|                                       |
| ------------------------------------- |
| 🏠 Home | 🔍 Explore | 👤 Profile       |
+---------------------------------------+
```

### **7.5. Login / Register**

```
+---------------------------------------+
| SmartFit Planner                      |
|                                       |
| 📧 [ Email ]                          |
| 🔒 [ Password ]                       |
|                                       |
| 🟩 [ LOGIN ]                          |
| 🔗 Don't have an account? Register    |
|                                       |
| * Interaction Note:                   |
|   Inline validation for email format  |
|   and password length.                |
|   Loading spinner on submit.          |
|   Error toast for wrong credentials.  |
+---------------------------------------+
```

---

## **8. 4人分工与协作方案（Group Cooperation）**

采用 **“页面模块主责 + 横向 Owner”** 的分工方式：每人有明确主模块，同时指定关键横向责任，避免联调时接口不一致或工作量失衡。

### **8.1 功能模块分工**

| 成员 | 功能模块 | 职责范围 |
|------|---------|---------|
| 成员 A | **Auth + Profile** | 登录/注册完整流程、Profile 页（已保存计划列表、日历打卡、周图表、登出） |
| 成员 B | **Smart Generator + Store Owner** | Home 页完整流程：条件输入 → GLM-5 API 调用 → Skeleton UI → 计划结果展示；主导 MobX Store 结构定义与演进 |
| 成员 C | **Exercise Explorer** | Explore 页完整流程：ExerciseDB 搜索/筛选 → 动作列表渲染 → 添加到自定义计划 |
| 成员 D | **Plan Management + Persistence** | Details 页（计划编辑/保存/完成打卡）+ Firestore 持久化封装（Auth/Firestore 读写、`onSnapshot` 同步、Security Rules） |

### **8.2 关键依赖与协作约定**

- **成员 B（Store Owner）优先级最高**，Day 1 先提交最小可用 Store 合同，供 A / C / D 并行开发。
- Day 1 最小合同至少包含：`currentPlan`、`savedPlans`、`user(uid/email/ready)`、`setCurrentPlan()`、`addSavedPlan()`（保存入口）、`removeSavedPlan()`、`markCompleted()`。
- B 和 C 都会向 Store 写入“当前计划”数据，必须统一使用 B 定义的 action（如 `planStore.setCurrentPlan()` / `planStore.addSavedPlan()`），不得绕过 Store 直接改状态。
- 当前持久化策略采用：**修改 `savedPlans` -> MobX `reaction` 自动触发 Firestore 写入**；`connectToPersistence(uid, reaction)` 由 D 在根入口接线，B 负责保证 `savedPlans` 数据结构稳定。
- 任何 Store 结构变更（字段或 action 签名变化）必须走 PR，并至少 1 名非 B 成员 review 后合并。

### **8.3 协作机制**

- 每周一次同步会，记录：完成项、阻塞项、下周计划（作为协作证据）。
- 每个模块的 PR 必须经过至少一名其他成员 review 后才能合并。
- 联调阶段按用户主流程端到端走查：登录 → 生成计划 → 保存 → 打卡 → Profile 可视化。
- 每人维护个人贡献日志（commits / PR / 文档 / 测试），用于最终 individual self-reflection。
