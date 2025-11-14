import { DEFAULT_ANNUAL_RETURN, DAYS_PER_MONTH, clamp } from './constants.js';

const ALGORITHM_VERSION = 'v2.0';

const RISK_PROFILE_CONFIG = {
  conservative: {
    annualVolatility: 0.02,
    eventFreqFactor: 0.6,
    investmentEventBias: -0.6,
    investmentAmplitude: 0.6
  },
  neutral: {
    annualVolatility: 0.05,
    eventFreqFactor: 1.0,
    investmentEventBias: 0,
    investmentAmplitude: 1
  },
  aggressive: {
    annualVolatility: 0.12,
    eventFreqFactor: 1.2,
    investmentEventBias: 0.6,
    investmentAmplitude: 1.5
  }
};

const SEVERITY_AMOUNT_RANGES = {
  small: { min: 50, max: 500 },
  medium: { min: 500, max: 3000 },
  large: { min: 3000, max: 50000 }
};

const BASE_EVENT_COUNT_PROB = [0.45, 0.35, 0.15, 0.05]; // 对应 0/1/2/3 条

const BASE_EVENT_TYPE_PROB = {
  expense: 0.55,
  income: 0.15,
  inflation: 0.1,
  investment: 0.15,
  windfall: 0.05
};

const EVENT_POOL_VERSION = '2025-02';

const EVENT_TEMPLATES = [
  { id: 'E_pet_1', type: 'expense', title: '宠物医疗费用', tags: ['health', 'pet'], severity: 'medium' },
  { id: 'E_med_1', type: 'expense', title: '紧急医疗支出', tags: ['health'], severity: 'large' },
  { id: 'E_car_1', type: 'expense', title: '汽车维修', tags: ['transport'], severity: 'medium' },
  { id: 'E_rent_raise', type: 'inflation', title: '房租上调', tags: ['housing', 'inflation'], severity: 'medium', persistence: 3, monthlyPct: 0.06 },
  { id: 'E_job_loss', type: 'expense', title: '短期失业导致收入下降', tags: ['income'], severity: 'large', persistence: 2, monthlyImpact: -2000 },
  { id: 'E_refund', type: 'income', title: '退款/退保', tags: ['income'], severity: 'small' },
  { id: 'E_bonus', type: 'income', title: '意外奖金', tags: ['income'], severity: 'medium' },
  { id: 'E_tax_rebate', type: 'income', title: '税务退款', tags: ['income'], severity: 'medium' },
  { id: 'E_inflation_food', type: 'inflation', title: '食品价格上涨', tags: ['inflation'], severity: 'small', persistence: 4, monthlyPct: 0.03 },
  { id: 'E_invest_loss_1', type: 'investment', title: '股票市场短期回调', tags: ['investment'], severity: 'medium' },
  { id: 'E_invest_gain_1', type: 'investment', title: '投资组合出现短期收益', tags: ['investment'], severity: 'medium' },
  { id: 'E_windfall_1', type: 'windfall', title: '收到遗产或大型赠与', tags: ['windfall'], severity: 'large' },
  { id: 'E_home_repair', type: 'expense', title: '房屋修缮', tags: ['housing'], severity: 'large' },
  { id: 'E_travel_refund', type: 'income', title: '旅行取消退款', tags: ['income'], severity: 'small' },
  { id: 'E_child_expense', type: 'expense', title: '子女教育支出', tags: ['family'], severity: 'medium' },
  { id: 'E_legal_fee', type: 'expense', title: '法律费用', tags: ['legal'], severity: 'medium' },
  { id: 'E_business_loss', type: 'expense', title: '副业亏损', tags: ['business', 'investment'], severity: 'medium' },
  { id: 'E_insurance_payout', type: 'income', title: '保险赔付', tags: ['insurance'], severity: 'medium' },
  { id: 'E_big_purchase', type: 'expense', title: '大型消费（家电/家具）', tags: ['consumption'], severity: 'medium' },
  { id: 'E_illness_long', type: 'expense', title: '长期疾病造成的连续支出', tags: ['health'], severity: 'large', persistence: 6, monthlyImpact: -2500 },
  { id: 'E_interest_change', type: 'investment', title: '利率或通胀变化影响收益', tags: ['macro'], severity: 'medium', persistence: 4, effectOnReturnPct: -0.005 },
  { id: 'E_startup_gain', type: 'investment', title: '创业投资获得回报', tags: ['investment', 'business'], severity: 'large' },
  { id: 'E_education_grant', type: 'income', title: '教育补助/奖学金', tags: ['education'], severity: 'small' },
  { id: 'E_tax_penalty', type: 'expense', title: '税务罚款', tags: ['tax'], severity: 'medium' },
  { id: 'E_routine_health', type: 'expense', title: '常规体检/保健花费', tags: ['health'], severity: 'small' },
  { id: 'E_electronics_break', type: 'expense', title: '电子设备损坏', tags: ['consumption'], severity: 'small' },
  { id: 'E_gift', type: 'income', title: '朋友馈赠 / 礼金', tags: ['windfall'], severity: 'small' },
  { id: 'E_property_tax', type: 'expense', title: '房产税/车船税', tags: ['tax'], severity: 'medium' },
  { id: 'E_currency_loss', type: 'investment', title: '外汇波动导致损失', tags: ['investment'], severity: 'medium' },
  { id: 'E_invest_fee', type: 'expense', title: '投资平台手续费', tags: ['investment'], severity: 'small' },
  { id: 'E_energy_bill', type: 'expense', title: '能源/水电费用上涨', tags: ['housing'], severity: 'small', persistence: 3, monthlyImpact: -300 },
  { id: 'E_transport_pass', type: 'expense', title: '年度交通卡续费', tags: ['transport'], severity: 'small' },
  { id: 'E_market_rally', type: 'investment', title: '市场反弹带来收益', tags: ['investment'], severity: 'medium' },
  { id: 'E_market_crash', type: 'investment', title: '市场大幅下跌', tags: ['investment'], severity: 'large' },
  { id: 'E_rent_deposit', type: 'expense', title: '房屋押金更新', tags: ['housing'], severity: 'large' },
  { id: 'E_insurance_premium', type: 'expense', title: '保险保费续交', tags: ['insurance'], severity: 'medium' },
  { id: 'E_med_reimbursement', type: 'income', title: '医疗报销到账', tags: ['health', 'income'], severity: 'small' },
  { id: 'E_gadget_sale', type: 'income', title: '二手设备出售', tags: ['consumption'], severity: 'small' },
  { id: 'E_subscription_fee', type: 'expense', title: '年度订阅费用', tags: ['consumption'], severity: 'small' },
  { id: 'E_relatives_support', type: 'windfall', title: '家人经济支持', tags: ['family'], severity: 'medium' },
  { id: 'E_inflation_transport', type: 'inflation', title: '交通费用上涨', tags: ['transport', 'inflation'], severity: 'small', persistence: 3, monthlyPct: 0.02 },
  { id: 'E_inflation_utilities', type: 'inflation', title: '水电气价格上涨', tags: ['utilities', 'inflation'], severity: 'medium', persistence: 4, monthlyPct: 0.04 },
  { id: 'E_device_upgrade', type: 'expense', title: '工作设备升级', tags: ['career'], severity: 'medium' },
  { id: 'E_course_purchase', type: 'expense', title: '职业课程购置', tags: ['career', 'education'], severity: 'small' },
  { id: 'E_small_windfall', type: 'windfall', title: '抽奖小额中奖', tags: ['windfall'], severity: 'small' },
  { id: 'E_invest_dividend', type: 'income', title: '股息/分红收入', tags: ['investment'], severity: 'small' },
  { id: 'E_invest_dividend_cut', type: 'investment', title: '股息削减', tags: ['investment'], severity: 'small', effectOnReturnPct: -0.002, persistence: 6 },
  { id: 'E_renter_moveout', type: 'income', title: '房客迁出导致空置', tags: ['housing'], severity: 'medium', monthlyImpact: -1800, persistence: 3 },
  { id: 'E_fundraising', type: 'income', title: '众筹/家族筹款支持', tags: ['family'], severity: 'medium' },
  { id: 'E_holiday_spending', type: 'expense', title: '节假日家庭支出', tags: ['family'], severity: 'medium' },
  { id: 'E_vehicle_upgrade', type: 'expense', title: '车辆升级置换', tags: ['transport'], severity: 'large' },
  { id: 'E_health_insurance_change', type: 'inflation', title: '医疗保险自付比例提高', tags: ['health', 'inflation'], severity: 'medium', persistence: 5, monthlyPct: 0.035 },
  { id: 'E_inflation_education', type: 'inflation', title: '教育支出上升', tags: ['education'], severity: 'medium', persistence: 4, monthlyImpact: -800 },
  { id: 'E_emergency_travel', type: 'expense', title: '紧急旅行安排', tags: ['family'], severity: 'medium' },
  { id: 'E_microloan_interest', type: 'expense', title: '短期借款利息支出', tags: ['debt'], severity: 'small' },
  { id: 'E_debt_repayment', type: 'expense', title: '提前偿还贷款', tags: ['debt'], severity: 'large' },
  { id: 'E_charity_donation', type: 'expense', title: '慈善捐赠', tags: ['consumption'], severity: 'small' },
  { id: 'E_energy_rebate', type: 'income', title: '节能补贴', tags: ['utilities'], severity: 'small' },
  { id: 'E_invest_fraud', type: 'investment', title: '投资诈骗损失', tags: ['investment'], severity: 'large' },
  { id: 'E_security_upgrade', type: 'expense', title: '家庭安防升级', tags: ['housing'], severity: 'medium' },
  { id: 'E_low_yield', type: 'investment', title: '投资收益不及预期', tags: ['investment'], severity: 'small', effectOnReturnPct: -0.003, persistence: 3 }
];

function hashSeed(input) {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

function createRNG(seedInput) {
  const seedNumber =
    typeof seedInput === 'number' && Number.isFinite(seedInput)
      ? seedInput
      : hashSeed(String(seedInput ?? Date.now()));
  let state = seedNumber >>> 0;
  let spare = null;

  const random = () => {
    state |= 0;
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    seed: seedNumber,
    float() {
      return random();
    },
    floatIn(min, max) {
      return min + (max - min) * random();
    },
    int(min, max) {
      return Math.floor(this.floatIn(min, max + 1));
    },
    normal(mean = 0, std = 1) {
      if (spare !== null) {
        const value = spare;
        spare = null;
        return mean + std * value;
      }
      let u, v, s;
      do {
        u = this.float() * 2 - 1;
        v = this.float() * 2 - 1;
        s = u * u + v * v;
      } while (!s || s >= 1);
      const mul = Math.sqrt((-2 * Math.log(s)) / s);
      spare = v * mul;
      return mean + std * (u * mul);
    },
    pickWeighted(options, weights) {
      const total = weights.reduce((acc, w) => acc + Math.max(w, 0), 0);
      if (total <= 0) {
        const idx = this.int(0, options.length - 1);
        return options[idx];
      }
      let threshold = this.float() * total;
      for (let i = 0; i < options.length; i++) {
        threshold -= Math.max(weights[i], 0);
        if (threshold <= 0) return options[i];
      }
      return options[options.length - 1];
    }
  };
}

function rescaleProbabilities(probabilities) {
  const sum = probabilities.reduce((acc, p) => acc + Math.max(p, 0), 0);
  if (sum <= 0) {
    const uniform = 1 / probabilities.length;
    return probabilities.map(() => uniform);
  }
  return probabilities.map((p) => Math.max(p, 0) / sum);
}

export function sampleEventCount(rng, riskProfile = 'neutral') {
  const config = RISK_PROFILE_CONFIG[riskProfile] || RISK_PROFILE_CONFIG.neutral;
  const factor = config.eventFreqFactor;
  const adjusted = BASE_EVENT_COUNT_PROB.map((p, idx, arr) => {
    const weight = idx / Math.max(arr.length - 1, 1);
    return p * (1 + (factor - 1) * (0.4 + 0.6 * weight));
  });
  const probs = rescaleProbabilities(adjusted);
  const counts = [0, 1, 2, 3];
  return rng.pickWeighted(counts, probs);
}

export function sampleEventTemplate(rng, riskProfile = 'neutral') {
  const config = RISK_PROFILE_CONFIG[riskProfile] || RISK_PROFILE_CONFIG.neutral;
  const bias = config.investmentEventBias;
  const adjustedTypeProb = {
    expense: BASE_EVENT_TYPE_PROB.expense - 0.05 * bias,
    income: BASE_EVENT_TYPE_PROB.income + 0.02 * bias,
    inflation: BASE_EVENT_TYPE_PROB.inflation,
    investment: BASE_EVENT_TYPE_PROB.investment + 0.15 * bias,
    windfall: BASE_EVENT_TYPE_PROB.windfall + 0.05 * bias
  };
  const typeKeys = Object.keys(adjustedTypeProb);
  const typeProbs = rescaleProbabilities(typeKeys.map((key) => adjustedTypeProb[key]));
  const pickedType = rng.pickWeighted(typeKeys, typeProbs);

  const candidates = EVENT_TEMPLATES.filter((tpl) => tpl.type === pickedType);
  if (!candidates.length) {
    return EVENT_TEMPLATES[rng.int(0, EVENT_TEMPLATES.length - 1)];
  }
  const weights = candidates.map((tpl) => tpl.probabilityWeight ?? 1);
  return rng.pickWeighted(candidates, weights);
}

export function sampleAmountForSeverity(rng, severity, currentBalance, type, riskProfile = 'neutral') {
  const range = SEVERITY_AMOUNT_RANGES[severity] || SEVERITY_AMOUNT_RANGES.medium;
  let base = rng.floatIn(range.min, range.max);
  if (type === 'investment') {
    const config = RISK_PROFILE_CONFIG[riskProfile] || RISK_PROFILE_CONFIG.neutral;
    const pct = rng.floatIn(0.005, 0.08) * config.investmentAmplitude;
    base = Math.max(currentBalance * pct, range.min);
    if (severity === 'small') base *= 0.4;
    if (severity === 'large') base *= 2;
  }
  if (type === 'windfall') {
    if (severity === 'small') base = rng.floatIn(500, 3000);
    if (severity === 'medium') base = rng.floatIn(3000, 15000);
    if (severity === 'large') base = rng.floatIn(15000, 60000);
  }
  if (type === 'inflation' && range) {
    base = rng.floatIn(range.min, range.max);
  }

  switch (type) {
    case 'expense':
    case 'inflation':
      return -Math.abs(base);
    case 'income':
    case 'windfall':
      return Math.abs(base);
    case 'investment': {
      const riskScore = riskProfile === 'conservative' ? 1 : riskProfile === 'neutral' ? 0.5 : 0;
      const pGain = clamp(0.3 + 0.3 * riskScore, 0.1, 0.75);
      const sign = rng.float() < pGain ? 1 : -1;
      return sign * Math.abs(base);
    }
    default:
      return -Math.abs(base);
  }
}

function buildEvent(template, amount, month, index, rng) {
  return {
    id: `${template.id}_${month}_${index}_${Math.round(rng.floatIn(1000, 9999))}`,
    type: template.type,
    desc: template.title,
    amount: Math.round(amount * 100) / 100,
    severity: template.severity,
    tags: template.tags
  };
}

function buildEffectFromTemplate(template, currentBalance) {
  if (!template.persistence) return null;
  const monthlyImpact = template.monthlyImpact ?? 0;
  const monthlyPct = template.monthlyPct ?? 0;
  const returnDelta = template.effectOnReturnPct ?? 0;
  return {
    remainingMonths: template.persistence,
    monthlyImpact,
    monthlyPct,
    returnDelta,
    referenceBalance: currentBalance
  };
}

function applyActiveEffects(effects) {
  return effects.reduce(
    (acc, effect) => {
      acc.monthlyImpact += effect.monthlyImpact ?? 0;
      acc.monthlyPct += effect.monthlyPct ?? 0;
      acc.returnDelta += effect.returnDelta ?? 0;
      return acc;
    },
    { monthlyImpact: 0, monthlyPct: 0, returnDelta: 0 }
  );
}

function advanceEffects(effects) {
  return effects
    .map((effect) => ({ ...effect, remainingMonths: effect.remainingMonths - 1 }))
    .filter((effect) => effect.remainingMonths > 0);
}

function calculateTerminatedDate(startDate, month) {
  if (!startDate) return null;
  const base = new Date(startDate);
  if (Number.isNaN(base.getTime())) return null;
  const result = new Date(base.getTime());
  result.setDate(result.getDate() + month * DAYS_PER_MONTH);
  return result.toISOString().slice(0, 10);
}

function average(list) {
  if (!list.length) return 0;
  return list.reduce((acc, value) => acc + value, 0) / list.length;
}

function standardDeviation(list) {
  if (list.length <= 1) return 0;
  const avgValue = average(list);
  const variance =
    list.reduce((acc, value) => acc + (value - avgValue) ** 2, 0) / (list.length - 1);
  return Math.sqrt(Math.max(variance, 0));
}

export function simulateLocally(rawParams = {}) {
  const {
    initialBalance: initialBalanceInput,
    currentSavings,
    dailyExpense = 0,
    monthlyPassive: monthlyPassiveInput,
    monthlyPassiveIncome,
    annualReturn: annualReturnInput = DEFAULT_ANNUAL_RETURN,
    months: monthsInput = 36,
    riskProfile: riskProfileInput,
    risk: riskAlias,
    enableRandomEvents = true,
    enableEvents,
    seed,
    startDate,
    resignDate
  } = rawParams;

  const riskProfile = riskProfileInput || riskAlias || 'neutral';
  const config = RISK_PROFILE_CONFIG[riskProfile] || RISK_PROFILE_CONFIG.neutral;

  const initialBalance = Number(
    initialBalanceInput ?? currentSavings ?? rawParams.balance ?? 0
  );
  const monthlyPassive =
    Number(monthlyPassiveInput ?? monthlyPassiveIncome ?? rawParams.passiveIncome ?? 0) || 0;
  const dailyExpenseValue = Number(dailyExpense);
  const annualReturn = Number(annualReturnInput ?? DEFAULT_ANNUAL_RETURN);
  const months = Math.max(1, Number(monthsInput) || 1);
  const rng = createRNG(seed);

  const baselineMonthlyMean = annualReturn / 12;
  const monthlySigma = config.annualVolatility / Math.sqrt(12);

  let currentBalance = initialBalance;
  const baseFixedExpense = dailyExpenseValue * DAYS_PER_MONTH;
  let activeEffects = [];
  let pendingEffects = [];

  const monthlySummaries = [];
  let terminatedAtMonth = null;

  for (let month = 1; month <= months; month++) {
    const effectAggregate = applyActiveEffects(activeEffects);
    const pctIncrease = clamp(effectAggregate.monthlyPct, -0.4, 1.5);
    let monthlyFixedExpense =
      baseFixedExpense * (1 + pctIncrease) + effectAggregate.monthlyImpact;
    monthlyFixedExpense = Math.max(monthlyFixedExpense, 0);

    const monthlyMean = baselineMonthlyMean + effectAggregate.returnDelta;
    const sampledReturnRate = clamp(rng.normal(monthlyMean, monthlySigma), -0.99, 1.2);
    const investmentReturn = currentBalance * sampledReturnRate;

    const events = [];
    let eventsSum = 0;
    if ((enableEvents ?? enableRandomEvents) && enableRandomEvents !== false) {
      const eventCount = sampleEventCount(rng, riskProfile);
      for (let i = 0; i < eventCount; i++) {
        const template = sampleEventTemplate(rng, riskProfile);
        let amount = sampleAmountForSeverity(
          rng,
          template.severity,
          Math.max(currentBalance, 1),
          template.type,
          riskProfile
        );

        if (template.type === 'inflation') {
          const estimated =
            (template.monthlyImpact ?? 0) +
            baseFixedExpense * (template.monthlyPct ?? 0);
          amount = -Math.abs(estimated || amount);
        }

        const event = buildEvent(template, amount, month, i, rng);

        if (template.persistence) {
          pendingEffects.push({
            remainingMonths: template.persistence,
            monthlyImpact: template.monthlyImpact ?? 0,
            monthlyPct: template.monthlyPct ?? 0,
            returnDelta: template.effectOnReturnPct ?? 0
          });
          event.meta = {
            persistenceMonths: template.persistence,
            monthlyImpact: template.monthlyImpact ?? 0,
            monthlyPct: template.monthlyPct ?? 0,
            returnDelta: template.effectOnReturnPct ?? 0
          };
        }

        if (template.effectOnReturnPct && !template.persistence) {
          // 即刻影响未来收益率（单次）
          pendingEffects.push({
            remainingMonths: 1,
            monthlyImpact: 0,
            monthlyPct: 0,
            returnDelta: template.effectOnReturnPct
          });
        }

        events.push(event);
        eventsSum += event.amount;
      }
    }

    const monthNet =
      monthlyPassive + investmentReturn - monthlyFixedExpense + eventsSum;
    const balanceAfter = currentBalance + monthNet;

    monthlySummaries.push({
      month,
      balanceBefore: Math.round(currentBalance * 100) / 100,
      fixedExpenses: Math.round(monthlyFixedExpense * 100) / 100,
      passiveIncome: Math.round(monthlyPassive * 100) / 100,
      investmentReturn: Math.round(investmentReturn * 100) / 100,
      investmentRate: Math.round(sampledReturnRate * 10000) / 10000,
      events,
      monthNet: Math.round(monthNet * 100) / 100,
      balanceAfter: Math.round(balanceAfter * 100) / 100
    });

    currentBalance = balanceAfter;

    activeEffects = advanceEffects(activeEffects);
    if (pendingEffects.length) {
      activeEffects = activeEffects.concat(pendingEffects);
      pendingEffects = [];
    }

    if (balanceAfter <= 0) {
      terminatedAtMonth = month;
      break;
    }
  }

  const terminatedAtDate =
    terminatedAtMonth != null
      ? calculateTerminatedDate(startDate ?? resignDate, terminatedAtMonth)
      : null;

  return {
    initialBalance,
    months,
    monthlySummaries,
    terminatedAtMonth,
    terminatedAtDate,
    metadata: {
      usedBackend: false,
      seed: rng.seed,
      riskProfile,
      annualReturn,
      monthlyPassive,
      dailyExpense: dailyExpenseValue,
      enableRandomEvents: enableEvents ?? enableRandomEvents ?? true,
      algorithmVersion: ALGORITHM_VERSION,
      eventPoolVersion: EVENT_POOL_VERSION
    }
  };
}

export function buildStatsFromSummaries(
  summaries,
  resignDateStr,
  options = {}
) {
  if (!summaries?.length) return null;
  const metadata = options.metadata || {};
  const riskProfile = metadata.riskProfile || 'neutral';
  const annualReturn = metadata.annualReturn ?? DEFAULT_ANNUAL_RETURN;
  const monthlyPassive = metadata.monthlyPassive ?? summaries[0]?.passiveIncome ?? 0;

  const months = summaries.length;
  const last = summaries[months - 1];
  const monthlyNetValues = summaries.map((s) => s.monthNet);
  const avgMonthlyNet = average(monthlyNetValues);
  const avgFixedExpenses = average(summaries.map((s) => s.fixedExpenses));

  const negativeMonths = monthlyNetValues
    .filter((value) => value < 0)
    .map((value) => Math.abs(value));
  const fallbackBurn = avgMonthlyNet < 0 ? Math.abs(avgMonthlyNet) : 0;
  const monthlyBurn =
    negativeMonths.length > 0 ? average(negativeMonths) : fallbackBurn;
  const dailyBurn = monthlyBurn > 0 ? monthlyBurn / DAYS_PER_MONTH : 0;

  let daysSupported;
  if (dailyBurn > 0) {
    daysSupported = Math.max(0, Math.floor(last.balanceAfter / dailyBurn));
    if (daysSupported <= 0) {
      let accumulatedDays = 0;
      for (const summary of summaries) {
        const balanceBefore = summary.balanceBefore ?? 0;
        const inferredAfter =
          summary.balanceAfter ??
          (summary.monthNet != null ? balanceBefore + summary.monthNet : balanceBefore);
        const balanceAfter = inferredAfter ?? balanceBefore;
        if (balanceBefore <= 0) break;
        if (balanceAfter > 0) {
          accumulatedDays += DAYS_PER_MONTH;
          continue;
        }
        const monthNet = summary.monthNet ?? balanceAfter - balanceBefore;
        if (monthNet < 0) {
          const monthLoss = Math.abs(monthNet);
          if (monthLoss > 0) {
            const fraction = clamp(balanceBefore / monthLoss, 0, 1);
            const partialRaw = fraction * DAYS_PER_MONTH;
            const partialDays = partialRaw > 0 ? Math.max(1, Math.floor(partialRaw)) : 0;
            accumulatedDays += partialDays;
          }
        }
        break;
      }
      if (accumulatedDays > 0) {
        daysSupported = accumulatedDays;
      }
    }
  } else {
    daysSupported = Infinity;
  }

  const start = resignDateStr ? new Date(resignDateStr) : new Date();
  let expectedDepletionDate = '暂无耗尽风险';
  if (Number.isFinite(daysSupported) && daysSupported > 0) {
    const depletionDate = new Date(start.getTime() + daysSupported * 24 * 60 * 60 * 1000);
    if (Number.isFinite(depletionDate.getTime())) {
      expectedDepletionDate = depletionDate.toISOString().slice(0, 10);
    }
  }

  const monthlyReturns = summaries.map((s) =>
    s.balanceBefore > 0 ? s.investmentReturn / s.balanceBefore : 0
  );
  const avgMonthlyReturn = average(monthlyReturns);
  const actualVol = standardDeviation(monthlyReturns);
  const expectedMonthlyReturn = annualReturn / 12;
  const expectedVol =
    (RISK_PROFILE_CONFIG[riskProfile]?.annualVolatility ?? 0.05) / Math.sqrt(12);

  const normDays = Number.isFinite(daysSupported)
    ? clamp(daysSupported / (DAYS_PER_MONTH * 18), 0, 1)
    : 1;
  const passiveScore = clamp(
    monthlyPassive / (Math.max(avgFixedExpenses, 1)),
    0,
    1
  );

  const returnScore = clamp(
    1 - Math.abs(avgMonthlyReturn - expectedMonthlyReturn) / (Math.abs(expectedMonthlyReturn) + 0.005),
    0,
    1
  );
  const volatilityScore = clamp(
    1 - Math.abs(actualVol - expectedVol) / (expectedVol + 0.005),
    0,
    1
  );
  const riskScore = 0.6 * volatilityScore + 0.4 * returnScore;

  const bufferScore = clamp(
    last.balanceAfter / (Math.max(avgFixedExpenses * 3, 1)),
    0,
    1
  );

  const negativeEvents = summaries
    .flatMap((s) => s.events)
    .filter((e) => e.amount < 0)
    .map((e) => Math.abs(e.amount));
  const maxShock = negativeEvents.length ? Math.max(...negativeEvents) : 0;
  const shockBaseline = Math.max(last.balanceAfter, avgFixedExpenses * 6, 1);
  const shockResilience = clamp(1 - maxShock / shockBaseline, 0, 1);

  const score = Math.round(
    clamp(
      30 * normDays +
        20 * passiveScore +
        20 * riskScore +
        10 * bufferScore +
        20 * shockResilience,
      0,
      100
    )
  );

  const suggestions = [];
  if (normDays < 0.4) {
    suggestions.push('提升可支撑天数：优化支出或增加储备。');
  }
  if (passiveScore < 0.4) {
    suggestions.push('被动收入占比偏低，可探索稳定现金流来源。');
  }
  if (riskScore < 0.5) {
    suggestions.push('投资回报与风险偏好不匹配，建议重新评估资产配置。');
  }
  if (shockResilience < 0.5) {
    suggestions.push('近期负面事件冲击较大，可建立应急金。');
  }
  if (!suggestions.length) {
    suggestions.push('财务结构较稳健，保持定期复盘与纪律性投入。');
  }

  return {
    daysSupported: Number.isFinite(daysSupported) ? daysSupported : Number.POSITIVE_INFINITY,
    expectedDepletionDate,
    score,
    suggestions,
    breakdown: {
      normDays,
      passiveScore,
      riskScore,
      bufferScore,
      shockResilience
    }
  };
}

export const SimulationConfig = {
  ALGORITHM_VERSION,
  EVENT_POOL_VERSION,
  RISK_PROFILE_CONFIG,
  SEVERITY_AMOUNT_RANGES,
  EVENT_TEMPLATES
};


