# 成员D 职责分析 - Plan Management + Persistence Owner

> **文档更新：2026-03-27** — 已根据实际代码状态同步所有任务进度

## 📋 核心职责概览

**主模块：** Plan Preview 页 + Plan 管理页 + Firestore 持久化封装
**优先级：** 中等（依赖成员B的Store框架）
**当前状态：** 核心持久化层 ✅ 完成；Plan Preview 页 ✅ 完成；Plan 页 ✅ 完成；Profile 可视化模块 ⏳ 进行中

---

## 1. 功能职责清单

### 1.1 Plan 页完整流程 ✅ 已完成
- **计划编辑**：✅ 编辑计划名称（`renamePlan`）、组数/次数（`updateExerciseField`）
- **计划保存**：✅ 新计划保存到 Firestore（`addSavedPlan` → reaction → `setDoc`）
- **完成打卡**：✅ `markCompleted(planId, date)` 记录 ISO 日期到 `completedDates[]`
- **删除计划**：✅ 二次确认弹窗 + `removeSavedPlan`
- **跳转动作详情**：✅ `router.push('/action/[id]')` 跳转 Stack 页
- **错误处理**：✅ 全局 Toast（`uiStore.showToast`）提示操作结果

> **实现说明**：该模块落地为 `PlanPresenter.jsx` + `PlanView.jsx`（非原计划的 `DetailsPresenter` + `PlanDetailView`），功能完整覆盖原规划。

### 1.2 Firebase 持久化层设计与实现 ✅ 已完成
- **`firebaseConfig.js`**：✅ Firebase 初始化配置，读取 `.env.local` 中的 8 个环境变量
- **`authRepo.js`**：✅ `connectAuth` / `loginUser` / `registerUser` / `logoutUser` 全部实现
- **`planRepo.js`**：✅ 以 `connectToPersistence(uid, reactionFn)` 单函数封装全部持久化逻辑
  - 首次连接：`getDoc()` 加载 `savedPlans`
  - 后续同步：`onSnapshot()` 监听 Firestore 实时变更
  - 写回：MobX `reaction` 监听 `savedPlans` JSON，变化时 `setDoc()` 写入
  - 防循环：`applyRemote` 标志防止远程数据应用时触发新写入
  - 返回 `disconnectFn`，由 `_layout.jsx` 在登出/uid 变更时调用

> **与原规划的差异**：`integration.js` 未作为独立文件创建，持久化逻辑全部内聚在 `planRepo.js` 中，更简洁。

### 1.3 Store 接线 ✅ 已完成
- ✅ 在 `app/_layout.jsx` 中通过 `useEffect` + `reaction(() => userStore.uid, ...)` 监听 uid 变化
- ✅ uid 存在时调用 `connectToPersistence(uid, reaction)`，登出时调用返回的 `disconnectFn`
- ✅ 所有变更均通过成员B定义的 action（`addSavedPlan` / `updateSavedPlan` / `removeSavedPlan` / `markCompleted`）

---

## 2. 文件清单与交付状态

### 核心文件（D责任）

| 文件路径 | 状态 | 落地说明 |
|---------|------|---------|
| `src/persistence/firebaseConfig.js` | ✅ 完成 | Firebase 初始化，读取 .env.local |
| `src/persistence/authRepo.js` | ✅ 完成 | 含登录/注册/登出/Auth 监听 |
| `src/persistence/planRepo.js` | ✅ 完成 | `connectToPersistence` + `onSnapshot` + `reaction` 写回 |
| `src/presenters/PlanPresenter.jsx` | ✅ 完成 | 原名 `DetailsPresenter`，已实现全部计划管理逻辑 |
| `src/views/PlanView.jsx` | ✅ 完成 | 原名 `PlanDetailView`，含编辑表单和操作按钮 |
| `app/_layout.jsx` | ✅ 完成 | `connectToPersistence` 已在此接线 |
| `app/details.jsx` | ⏳ 桩文件 | 路由文件已创建，内容待完善（Profile → 计划详情跳转路径） |

### 协作涉及的文件（已对齐 ✅）

| 文件路径 | 当前Owner | 对齐状态 |
|---------|----------|---------|
| `src/model/planStore.js` | 成员B | ✅ 已对齐：`updateSavedPlan`/`renamePlan`/`updateExerciseField` 均已实现 |
| `src/model/userStore.js` | 成员B | ✅ 已对齐：`uid`/`email`/`ready` |
| `src/model/uiStore.js` | 新增（D/共享） | ✅ `showToast(message, type, duration)` 供全局 Toast 使用 |
| `src/views/common/GlobalToast.jsx` | 新增（D/共享） | ✅ 全局 Toast 组件，自动订阅 `uiStore` |

---

## 3. 与其他成员对齐要点

### 🔗 与成员B（Store Owner）的对齐

**最关键！** 这是D能否按时推进的决定性卡点。

**需确认的内容：**
1. **Store 数据结构**
   - `savedPlans` 数组的元素结构（id、name、exercises、completedDates...）
   - `currentPlan` 的数据格式
   
2. **Action 签名**（D 在 DetailsPresenter 中调用）
   ```javascript
   // B提供这些 action
   planStore.setCurrentPlan(plan)           // 选择要编辑的计划
   planStore.addSavedPlan(plan)             // 保存新计划
   planStore.updateSavedPlan(planId, updates) // 更新现有计划（重要！）
   planStore.removeSavedPlan(planId)        // 删除计划
   planStore.markCompleted(planId, date)    // 标记完成
   ```

3. **reaction 接线点**
   - B 需说明在 `connectToPersistence()` 中如何监听 `savedPlans` 变化
   - 是否需要做防抖处理（避免频繁写 Firestore）

**对齐时间：** Day 1 末 / Day 2 初（冲关键路径）

---

### 🔗 与成员A（Auth + Profile）的对齐

**低依赖，但需同步登出和用户状态。**

**需确认的内容：**
1. **登出流程**
   - A 负责 UI（logout 按钮），D 负责后端逻辑（`authRepo.logout()`）
   - 登出后需清空 `auth` 状态、停止 Firestore 监听
   
2. **用户状态信息**
   - `userStore.user.uid` / `userStore.user.email`
   - D 用 `uid` 调用 Firestore API

**对齐时间：** Day 3（集成阶段）

---

### 🔗 与成员C（Explorer）的对齐

**中等依赖，主要是"添加到自定义计划"的流程。**

**需确认的内容：**
1. **自定义计划的数据结构**
   - C 从 Explorer 添加动作时，是否存储在 `planStore.currentPlan` 还是临时变量？
   - D 在 Details 页需要接收同一份计划数据

2. **底部 "View / Save" 按钮**
   - C 的 Explorer 页底部计数器更新时，是否同时更新 Store？
   - D 的 Details 页 应使用 Store 中的计划而不是本地状态

**对齐时间：** Day 2（确保数据流向一致）

---

## 4. 关键技术实现要点

### 4.1 MobX + Firestore 接线模式

```javascript
// src/persistence/integration.js（由D创建）
export function connectToPersistence(userStore, planStore) {
  // 当 planStore.savedPlans 变化时，自动同步到 Firestore
  reaction(
    () => JSON.stringify(planStore.savedPlans), // 监听序列化后的计划列表
    async (newStr) => {
      if (userStore.user?.uid) {
        try {
          await planRepo.savePlan(userStore.user.uid, planStore.savedPlans);
        } catch (err) {
          console.error("Firestore sync failed:", err);
          // 显示 Toast 或重试逻辑
        }
      }
    },
    { delay: 1000 } // 防抖，避免频繁写 Firestore
  );

  // 应用启动时，从 Firestore 加载计划
  if (userStore.user?.uid) {
    planRepo.subscribeToPlans(userStore.user.uid, (plans) => {
      planStore.setSavedPlans(plans); // 由成员B定义的 action
    });
  }
}
```

**在 `app/_layout.jsx` 中调用：**
```javascript
useEffect(() => {
  connectToPersistence(userStore, planStore);
}, [userStore.user?.uid]);
```

### 4.2 Details Presenter 结构

```javascript
// src/presenters/DetailsPresenter.jsx
export default observer(function DetailsPresenter({ route }) {
  const planId = route.params?.planId;
  const plan = planStore.savedPlans.find(p => p.id === planId);

  const handleSave = (updatedPlan) => {
    planStore.updateSavedPlan(planId, updatedPlan); // 调用B的action
    // reaction 自动触发 Firestore 写入
  };

  const handleDelete = async () => {
    planStore.removeSavedPlan(planId);
    navigation.goBack();
  };

  const handleMarkCompleted = () => {
    planStore.markCompleted(planId, new Date());
    // reaction 自动触发 completedDates 写入 Firestore
  };

  return <PlanDetailView plan={plan} onSave={handleSave} ... />;
});
```

### 4.3 错误处理与降级

- **Firestore 写入失败：** Toast 提示 + 本地暂存，网络恢复后重试
- **Firestore 读取失败：** 显示"加载失败"+ 重试按钮
- **网络断开：** 全局 Banner 提示（但不阻断本地编辑）

---

## 5. 开发进度记录

### 已完成阶段

| 阶段 | 完成内容 |
|------|---------|
| ✅ 阶段1：Store 对齐 | 与成员B确认 planStore/userStore 数据结构与 action 签名 |
| ✅ 阶段2：持久化层 | `firebaseConfig.js` + `authRepo.js` + `planRepo.js` 全部实现，含 `onSnapshot` 实时同步 |
| ✅ 阶段3：Plan 页 | `PlanPresenter.jsx` + `PlanView.jsx` 完整实现（编辑/保存/打卡/删除） |
| ✅ 阶段4：全局 Toast | `uiStore.js` + `GlobalToast.jsx` 新增，统一全应用操作反馈 |
| ✅ 阶段5：根布局接线 | `app/_layout.jsx` 完整接线 Auth 监听 + Persistence 连接/断开 |

### 待完成任务 ⏳

- [ ] **Profile 打卡日历**：安装 `react-native-calendars`，实现 `CalendarView.jsx`（读取 `completedDates`）
- [ ] **Profile 周训练量图表**：安装 `react-native-chart-kit`，实现 `ChartView.jsx`（按周统计 `completedDates`）
- [ ] **Explorer 自定义计划保存**：与成员C协作，完成 "View / Save" 按钮 → `addSavedPlan` 持久化流程
- [ ] **`app/details.jsx` 路由完善**：Profile → 计划详情 Stack 跳转（`onStartPlan` 回调接线）
- [ ] **端到端联调**：登录 → 生成计划 → 保存 → 打卡 → Profile 可视化完整走查

---

## 6. 成员D的交付物清单

### 代码
- ✅ `src/persistence/firebaseConfig.js`
- ✅ `src/persistence/authRepo.js`（含 connectAuth / loginUser / registerUser / logoutUser）
- ✅ `src/persistence/planRepo.js`（含 onSnapshot + reaction 双向同步，`connectToPersistence` 内聚）
- ✅ `src/model/uiStore.js`（全局 Toast 状态，新增）
- ✅ `src/presenters/PlanPresenter.jsx`（原规划 `DetailsPresenter`，已完整实现）
- ✅ `src/views/PlanView.jsx`（原规划 `PlanDetailView`，已完整实现）
- ✅ `src/views/common/GlobalToast.jsx`（全局 Toast 组件，新增）
- ⏳ `src/views/CalendarView.jsx`（占位，待集成 react-native-calendars）
- ⏳ `src/views/ChartView.jsx`（占位，待集成 react-native-chart-kit）
- ⏳ `app/details.jsx`（桩文件，待完善 Profile → 详情路由）

### 文档
- ⏳ Firestore Security Rules（如何限制用户只能访问自己的计划）
- ⏳ API 错误处理方案文档

### 测试
- ⏳ `planRepo.js` 单元测试（mock Firestore）— 目录已创建：`src/persistence/__tests__/planRepo.test.js`
- ⏳ `PlanPresenter.jsx` 集成测试 — 目录已创建：`src/presenters/__tests__/DetailsPresenter.test.js`

---

## 7. 风险与缓解

| 风险 | 影响 | 缓解方案 |
|------|------|---------|
| 成员B的 Store 合同延迟发布 | **高** | Day 1 下午立即同步，B若延迟则D先用 mock Store 开发 |
| Firestore 规则复杂度 | 中 | 提前与 A 讨论 uid 隔离策略，确保安全 |
| onSnapshot 监听器泄漏 | 中 | 在 unmount 时显式关闭监听器 |
| 网络错误重试逻辑不一致 | 低 | 复用 `resolvePromise.js` 的重试机制 |

---

## 📌 审批清单

- [x] 与成员B确认 Store 数据结构与 action 签名（`planStore` + `userStore` 已稳定）
- [x] 与成员A确认登出流程交互（`logoutUser` 已实现，`_layout.jsx` 已接线断开监听）
- [ ] 与成员C确认自定义计划数据流（Explorer "View / Save" 保存路径待协商）
- [ ] PlanRepo API 文档通过审查
- [ ] Security Rules PR 通过 review
- [ ] react-native-calendars 安装 + CalendarView 完整实现
- [ ] react-native-chart-kit 安装 + ChartView 完整实现
