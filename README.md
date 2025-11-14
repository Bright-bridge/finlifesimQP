# Financial Life Simulator（个人财务生存与理财模拟器）

React 18 + Vite + TailwindCSS 前端项目。用于 AdSense 审核取向的“金融/理财/个人财务工具”站点示例。

## 快速开始

```bash
npm install
npm run dev
```

本地开发默认端口：5173。开发代理将 `/api` 转发到 `http://localhost:3000`，可在 `vite.config.js` 中修改。

## 功能

- 预算计算器（React Hook Form 校验）
- 随机事件模拟（后端 `/api/simulate`，失败时本地 fallback）
- 聊天式月度总结（Framer Motion 动画，可跳过）
- 结果页图表（Recharts）：余额趋势、收入/支出、支出结构
- 导出 JSON/CSV 报告
- SEO/结构化数据（react-helmet-async + JSON-LD）
- 本地模拟算法支持风险偏好、年化收益、随机事件联动，可通过 `seed` 复现
- 隐私、免责声明、关于、文章页
- AdSense 占位容器（不要放真实广告脚本）

## 目录结构

见 `src/`，其中：
- `utils/api.js`：后端调用与本地 fallback
- `utils/financeCalc.js`：模拟与计算核心
- `components/`：UI 组件
- `pages/`：页面

## 模拟算法说明

- `utils/financeCalc.js` 使用纯前端算法，基于风险偏好映射年化波动率，按正态分布抽样月度收益。
- 随机事件池覆盖 50+ 条金融相关情境（支出/收入/通胀/投资/意外），支持持续影响（如通胀提高支出）。
- 所有随机行为支持 `seed`（可通过表单或 API 参数传入），可在结果页查看 `metadata.seed` 实现复现。
- 结果页展示算法版本、事件池版本、风险偏好、年化收益等“模拟假设”摘要，满足透明度要求。
- `buildStatsFromSummaries` 依据可支撑天数、被动收入占比、风险匹配度、缓冲与冲击抵御力综合评分。

### 元数据字段

本地或后端返回的 `metadata` 建议包含：

- `usedBackend`: 是否使用后端数据；
- `seed`: 随机种子（数值或字符串哈希）；
- `riskProfile`, `annualReturn`, `monthlyPassive`, `dailyExpense`, `enableRandomEvents`;
- `algorithmVersion`, `eventPoolVersion`（用于审计追踪）。

## 合规与说明

- 本项目仅用于教育与规划参考，不构成任何投资建议。
- 广告位使用 `AdPlaceholder` 作为占位；审核阶段请勿插入真实广告脚本。
- 生产环境请替换：
  - `API_ENDPOINTS.simulate` 为真实后端地址
  - `index.html`、各页面的标题与描述
  - `schema.org` JSON-LD 中的 url

## 后端接口（约定）

GET `/api/simulate?balance=100000&dailyExpense=200&monthlyPassive=2000&annualReturn=0.03&months=36`

成功响应需包含 `monthlySummaries`，参考 `src/utils/financeCalc.js` 结构；否则前端将使用本地模拟。建议同时返回 `metadata` 字段。

### Seed 用法

```js
import { simulateLocally } from './src/utils/financeCalc';

const result = simulateLocally({
  currentSavings: 120000,
  dailyExpense: 260,
  monthlyPassive: 4500,
  annualReturn: 0.05,
  months: 36,
  riskProfile: 'neutral',
  enableRandomEvents: true,
  seed: 42 // 指定种子以复现结果
});
```


