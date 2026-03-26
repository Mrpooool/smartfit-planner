# 成员D 职责分析 - Plan Management + Persistence Owner

## 📋 核心职责概览

**主模块：** Details 页 + Firestore 持久化封装
**优先级：** 中等（依赖成员B的Store框架）

---

## 1. 功能职责清单

### 1.1 Details 页面完整流程
- **计划编辑**：编辑计划名称、组数/次数、删除动作
- **计划保存**：将编辑后的计划保存到 Firebase Firestore
- **完成打卡**：标记计划为"已完成"，触发 Firebase 更新（日期记录）
- **错误处理**：网络错误时显示重试逻辑、Toast 提示

### 1.2 Firebase 持久化层设计与实现
- **`firebaseConfig.js`**：Firebase 初始化配置
- **`authRepo.js`**：编写登出逻辑（登录由成员A负责）
- **`planRepo.js`**：
  - `savePlan(uid, plan)` - 保存计划到 Firestore
  - `deletePlan(uid, planId)` - 删除计划
  - `markCompleted(uid, planId, date)` - 记录完成日期
  - `subscribeToPlans(uid, callback)` - **使用 `onSnapshot` 实现实时同步**

### 1.3 Store 接线（关键！）
- 在应用根入口（`app/_layout.jsx`）调用 `connectToPersistence(uid, reaction)`
- 实现 **MobX `reaction`**，监听 `planStore.savedPlans` 的变化
- 当变化时，自动触发 `planRepo.savePlan()` 写入 Firestore
- **注意：** 不直接修改 Store，所有变更必须通过成员B定义的 action

---

## 2. 需要修改/创建的文件清单

### 核心文件（D责任）

| 文件路径 | 类型 | 职责 |
|---------|------|------|
| `src/persistence/firebaseConfig.js` | 创建 | Firebase 初始化 |
| `src/persistence/authRepo.js` | 创建 | 登出逻辑（登录由成员A完成） |
| `src/persistence/planRepo.js` | 创建 | Firestore CRUD + `onSnapshot` |
| `src/presenters/DetailsPresenter.jsx` | 创建 | 连接 planStore + 视图逻辑 |
| `src/views/PlanDetailView.jsx` | 创建 | UI 渲染（只接收 props） |
| `app/details.jsx` | 创建 | 路由入口（`export default DetailsPresenter`） |

### 协作涉及的文件（需对齐）

| 文件路径 | 当前Owner | 对齐内容 |
|---------|----------|---------|
| `src/model/planStore.js` | 成员B | 确认 Store 数据结构、action 签名 |
| `src/model/userStore.js` | 成员B | 确认 `uid` / `isAuthenticated` 字段 |
| `app/_layout.jsx` | *需协商* | 在此接线 `connectToPersistence()` |
| `src/views/common/AsyncStateView.jsx` | *共享* | Details 页应用此组件显示加载/错误状态 |

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

## 5. 开发顺序建议

### Day 1
- [ ] 与成员B同步 Store 合同（数据结构 + action 签名）
- [ ] 创建 `firebaseConfig.js`（Firebase SDK 初始化）
- [ ] 创建 `planRepo.js` 骨架（函数签名）

### Day 2
- [ ] 实现 `planRepo.js` 的 CRUD 方法
- [ ] 实现 `authRepo.js`（登出逻辑）
- [ ] 实现 `connectToPersistence()` 和 reaction
- [ ] 与成员C对齐自定义计划流程

### Day 3
- [ ] 创建 `DetailsPresenter.jsx`
- [ ] 创建 `PlanDetailView.jsx`（UI 组件）
- [ ] 创建 `app/details.jsx` 路由入口
- [ ] 集成测试：端到端走查 Details 页流程

### Day 4-5
- [ ] 错误处理与边界情况测试
- [ ] 性能优化（防抖、缓存）
- [ ] 与 A/B/C 联调

---

## 6. 成员D的交付物清单

✅ 代码
- `src/persistence/firebaseConfig.js`
- `src/persistence/authRepo.js`
- `src/persistence/planRepo.js`（含 onSnapshot）
- `src/persistence/integration.js`（connectToPersistence）
- `src/presenters/DetailsPresenter.jsx`
- `src/views/PlanDetailView.jsx`
- `app/details.jsx`

✅ 文档
- Firestore Security Rules（如何限制用户只能访问自己的计划）
- API 错误处理方案文档

✅ 测试
- `planRepo.js` 单元测试（mock Firestore）
- `DetailsPresenter.jsx` 集成测试

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

- [ ] 与成员B确认 Store 数据结构与 action 签名
- [ ] 与成员A确认登出流程交互
- [ ] 与成员C确认自定义计划数据流
- [ ] PlanRepo API 文档通过审查
- [ ] Security Rules PR 通过 review
