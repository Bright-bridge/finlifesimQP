import { DEFAULT_ANNUAL_RETURN, DAYS_PER_MONTH, clamp } from './constants.js';
import i18n from '../i18n/config.js';

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
  const annualReturn = Number(annualReturnInput ?? 0);
  const months = Math.min(1200, Math.max(1, Number(monthsInput) || 1200)); // 最多1200个月
  const rng = createRNG(seed);

  // 如果年化收益率为0，则不进行投资计算
  const hasInvestment = annualReturn > 0;
  const baselineMonthlyMean = hasInvestment ? annualReturn / 12 : 0;
  const monthlySigma = hasInvestment ? config.annualVolatility / Math.sqrt(12) : 0;

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

    // 如果年化收益率为0，投资收入严格为0
    let investmentReturn = 0;
    let sampledReturnRate = 0;
    if (hasInvestment) {
    const monthlyMean = baselineMonthlyMean + effectAggregate.returnDelta;
      sampledReturnRate = clamp(rng.normal(monthlyMean, monthlySigma), -0.99, 1.2);
      investmentReturn = currentBalance * sampledReturnRate;
    }

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

/**
 * 生成精准的财务分析建议
 * 基于多维度指标组合分析，提供详细且针对性的建议
 */
function generateAdvancedSuggestions(metrics) {
  const {
    normDays,
    passiveScore,
    riskScore,
    bufferScore,
    shockResilience,
    score,
    daysSupported,
    monthsToDepletion,
    months,
    avgMonthlyNet,
    avgFixedExpenses,
    monthlyPassive,
    lastBalance,
    initialBalance,
    balanceTrend,
    isDepleting,
    isGrowing,
    negativeMonthRatio,
    cashFlowQuality,
    hasInvestment,
    annualReturn,
    investmentContribution,
    investmentEfficiency,
    avgMonthlyReturn,
    expectedMonthlyReturn,
    actualVol,
    expectedVol,
    returnScore,
    volatilityScore,
    expenseStability,
    maxShock,
    shockBaseline,
    riskProfile
  } = metrics;

  const locale = (i18n.language || 'zh').toLowerCase();
  const isEn = locale.startsWith('en');
  const formatDays = (days) => {
    const value = Math.round(days ?? 0);
    return isEn ? `${value} days` : `${value} 天`;
  };
  const formatMonths = (months) => {
    const value = Math.round(months ?? 0);
    return isEn ? `${value} months` : `${value} 个月`;
  };
  const formatMoney = (amount, decimals = 0) => {
    const symbol = isEn ? '$' : '¥';
    const value = Number(amount ?? 0).toFixed(decimals);
    return `${symbol}${value}`;
  };
  const formatPercent = (value, decimals = 1) =>
    `${(Number(value ?? 0) * 100).toFixed(decimals)}%`;
  const translate = (zh, en) => (isEn ? en : zh);
  const riskLabel = (profile) => {
    const zh = profile === 'conservative' ? '保守' : profile === 'aggressive' ? '激进' : '中性';
    const en = profile === 'conservative' ? 'conservative' : profile === 'aggressive' ? 'aggressive' : 'neutral';
    return translate(zh, en);
  };

  const suggestions = [];
  const priority = []; // 高优先级建议
  const warnings = []; // 警告类建议
  const improvements = []; // 改进建议
  const positives = []; // 积极反馈
  const pushPriority = (zh, en) => priority.push(translate(zh, en));
  const pushWarning = (zh, en) => warnings.push(translate(zh, en));
  const pushImprovement = (zh, en) => improvements.push(translate(zh, en));
  const pushPositive = (zh, en) => positives.push(translate(zh, en));

  // ========== 紧急情况分析 ==========
  if (Number.isFinite(daysSupported) && daysSupported < 90) {
    const urgencyZh = daysSupported < 30 ? '紧急' : daysSupported < 60 ? '严重' : '警告';
    const urgencyEn = daysSupported < 30 ? 'Urgent' : daysSupported < 60 ? 'Severe' : 'Warning';
    const actionZh = daysSupported < 30 ? '寻找额外收入来源或大幅削减支出' : '优化支出结构或增加收入';
    const actionEn =
      daysSupported < 30
        ? 'find additional income or make deep spending cuts'
        : 'optimize expenses or grow income';
    pushPriority(
      `${urgencyZh}：预计仅能支撑 ${formatDays(daysSupported)}（约 ${formatMonths(monthsToDepletion)}）。建议立即采取行动：${actionZh}。`,
      `${urgencyEn}: runway is only ${formatDays(daysSupported)} (~${formatMonths(monthsToDepletion)}). Take action now: ${actionEn}.`
    );
  }

  if (lastBalance <= 0) {
    // 已删除：资产已耗尽建议
  }

  // ========== 可支撑天数深度分析 ==========
  if (normDays < 0.2) {
    pushWarning(
      `可支撑时间极短（${formatMonths(monthsToDepletion)}），远低于 18 个月安全标准。当前月均支出 ${formatMoney(avgFixedExpenses)}，建议：1) 建立至少 6 个月应急基金（约 ${formatMoney(avgFixedExpenses * 6)}）；2) 将月支出降低约 ${formatMoney(avgFixedExpenses * 0.2)}；3) 寻找稳定收入来源。`,
      `Runway is extremely short (${formatMonths(monthsToDepletion)}), far below the 18‑month safety target. Monthly expenses are about ${formatMoney(avgFixedExpenses)}. Recommended: 1) build at least six months of reserves (~${formatMoney(avgFixedExpenses * 6)}); 2) trim expenses by roughly ${formatMoney(avgFixedExpenses * 0.2)}; 3) add stable income streams.`
    );
  } else if (normDays < 0.4) {
    pushWarning(
      `可支撑时间不足（${formatMonths(monthsToDepletion)}），建议优先建立 3-6 个月应急基金，并逐步延长到 12 个月以上。`,
      `Runway is limited (${formatMonths(monthsToDepletion)}). Build a 3–6 month emergency fund first, then extend runway to 12+ months.`
    );
  } else if (normDays < 0.6) {
    pushImprovement(
      `可支撑时间 ${formatMonths(monthsToDepletion)}，接近安全标准。继续积累储备，目标 18 个月（约 ${formatMoney(avgFixedExpenses * 18)}）。`,
      `Runway is ${formatMonths(monthsToDepletion)}, close to the safety target. Keep saving toward 18 months (~${formatMoney(avgFixedExpenses * 18)}).`
    );
  } else if (normDays >= 0.8) {
    pushPositive(
      `可支撑时间充足（${formatMonths(monthsToDepletion)}），财务缓冲良好。`,
      `Runway is healthy (${formatMonths(monthsToDepletion)}); cash buffer looks strong.`
    );
  }

  // ========== 被动收入深度分析 ==========
  if (passiveScore < 0.1) {
    pushWarning(
      `被动收入严重不足（每月约 ${formatMoney(monthlyPassive)}，仅覆盖 ${formatPercent(passiveScore)} 固定支出）。建议：1) 探索副业或兼职（目标月增 ${formatMoney(avgFixedExpenses * 0.3)}）；2) 寻找股息、租金等被动收入；3) 打磨技能建立变现渠道。`,
      `Passive income is very low (~${formatMoney(monthlyPassive)} per month, covering only ${formatPercent(passiveScore)} of fixed costs). Suggested steps: 1) add side gigs/part‑time work (target +${formatMoney(avgFixedExpenses * 0.3)} per month); 2) develop dividend, rental, or royalty income; 3) build monetizable skills.`
    );
  } else if (passiveScore < 0.3) {
    pushImprovement(
      `被动收入占比偏低（${formatPercent(passiveScore)}），当前每月 ${formatMoney(monthlyPassive)}，目标至少 ${formatMoney(avgFixedExpenses * 0.5)}。逐步建立多元化被动收入来源。`,
      `Passive income covers only ${formatPercent(passiveScore)} of spending (~${formatMoney(monthlyPassive)} per month). Aim for at least ${formatMoney(avgFixedExpenses * 0.5)} by diversifying income streams.`
    );
  } else if (passiveScore < 0.6) {
    pushImprovement(
      `被动收入占比中等（${formatPercent(passiveScore)}），可继续提升至覆盖 60% 以上固定支出，增强稳定性。`,
      `Passive income coverage is moderate (${formatPercent(passiveScore)}). Continue growing it toward 60%+ of fixed expenses to strengthen stability.`
    );
  } else if (passiveScore >= 0.8) {
    pushPositive(
      `被动收入表现优秀（覆盖 ${formatPercent(passiveScore)} 支出），财务自由度高。`,
      `Passive income is excellent (${formatPercent(passiveScore)} of expenses); flexibility is strong.`
    );
  }

  // ========== 投资分析（仅当有投资时） ==========
  if (hasInvestment) {
    // 收益率分析
    if (returnScore < 0.3) {
      const deviation = Math.abs(avgMonthlyReturn - expectedMonthlyReturn) / Math.max(Math.abs(expectedMonthlyReturn), 0.001);
      pushWarning(
        `投资收益率严重偏离预期：实际月均 ${formatPercent(avgMonthlyReturn, 2)}，预期 ${formatPercent(expectedMonthlyReturn, 2)}，偏差约 ${formatPercent(deviation, 0)}。可能原因：1) 资产配置不当；2) 市场波动异常；3) 风险偏好设置不合理。建议重新评估投资策略，调整资产配置或风险偏好。`,
        `Investment returns deviate sharply: actual ${formatPercent(avgMonthlyReturn, 2)} vs expected ${formatPercent(expectedMonthlyReturn, 2)} (gap ~${formatPercent(deviation, 0)}). Possible causes: poor allocation, abnormal volatility, or mismatched risk profile. Reassess strategy and asset mix.`
      );
    } else if (returnScore < 0.6) {
      pushImprovement(
        `投资收益率略低（实际 ${formatPercent(avgMonthlyReturn, 2)} vs 预期 ${formatPercent(expectedMonthlyReturn, 2)}）。建议优化组合、提高低风险资产占比，并定期复盘表现。`,
        `Investment returns are slightly below target (actual ${formatPercent(avgMonthlyReturn, 2)} vs expected ${formatPercent(expectedMonthlyReturn, 2)}). Optimize allocation, add lower-risk assets, and review performance regularly.`
      );
    } else if (returnScore >= 0.8) {
      pushPositive(
        `投资收益率表现良好，接近或超过预期目标。`,
        `Investment returns are on track or better than expected.`
      );
    }

    // 波动率分析
    if (volatilityScore < 0.4) {
      const volRatio = actualVol / Math.max(expectedVol, 0.001);
      pushWarning(
        `投资波动率异常偏高：实际 ${formatPercent(actualVol, 2)}，预期 ${formatPercent(expectedVol, 2)}，为预期的 ${volRatio.toFixed(2)} 倍。建议降低高风险资产占比，增加债券/稳健资产，并用定投平滑波动。`,
        `Investment volatility is excessive: actual ${formatPercent(actualVol, 2)} vs expected ${formatPercent(expectedVol, 2)} (${volRatio.toFixed(2)}× higher). Reduce high‑risk exposure, add bonds or stable assets, and consider dollar-cost averaging.`
      );
    } else if (volatilityScore < 0.7) {
      pushImprovement(
        `投资波动率略高，适度降低风险资产配置以提升稳定性。`,
        `Volatility is slightly elevated. Trim risky positions to improve stability.`
      );
    }

    // 投资效率分析
    if (investmentEfficiency > 0 && investmentEfficiency < 0.5) {
      pushWarning(
        `投资效率偏低：投资贡献度 ${formatPercent(investmentContribution, 2)}，实际收益率仅为预期的 ${(investmentEfficiency * 100).toFixed(0)}%。建议分散投资并调整风险配置。`,
        `Investment efficiency is weak: contribution ${formatPercent(investmentContribution, 2)}, actual returns only ${(investmentEfficiency * 100).toFixed(0)}% of target. Diversify holdings and recalibrate risk.`
      );
    } else if (investmentEfficiency >= 1.2) {
      pushPositive(
        `投资效率优秀，实际收益率超过预期 ${((investmentEfficiency - 1) * 100).toFixed(0)}%。`,
        `Investment efficiency is excellent, exceeding expectations by ${((investmentEfficiency - 1) * 100).toFixed(0)}%.`
      );
    }

    // 风险匹配分析
    if (riskScore < 0.4) {
      pushWarning(
        `投资风险匹配度低（${formatPercent(riskScore, 0)}），当前风险偏好为“${riskLabel(riskProfile)}”，但实际表现不匹配。请重新评估风险承受力，调整资产配置，并在需要时咨询专业顾问。`,
        `Risk alignment is weak (${formatPercent(riskScore, 0)}). Declared profile is "${riskLabel(riskProfile)}", but performance doesn’t match. Reassess risk tolerance, realign allocation, and seek professional advice if needed.`
      );
    }
  } else {
    // 无投资情况分析
    if (normDays < 0.6 && monthlyPassive < avgFixedExpenses * 0.5) {
      pushImprovement(
        `当前未投资且可支撑时间有限。建议先建立 3-6 个月应急基金，再从低风险产品（货币基金、债券基金）起步，目标年化 3-5%，并持续学习投资知识。`,
        `No investments yet and runway is limited. Build a 3–6 month emergency fund first, then start with low-risk products (cash funds, bond funds) aiming for 3–5% annual return while learning investing basics.`
      );
    } else if (normDays >= 0.8 && monthlyPassive >= avgFixedExpenses * 0.5) {
      pushImprovement(
        `财务状况良好但尚未投资。可考虑适度配置保守型资产，对抗通胀，目标年化 3-6%。`,
        `Financial position is solid but no investments yet. Consider moderate, conservative allocations (3–6% target) to offset inflation.`
      );
    }
  }

  // ========== 缓冲资金分析 ==========
  if (bufferScore < 0.2) {
    // 已删除具体提示
  } else if (bufferScore < 0.5) {
    pushImprovement(
      `应急缓冲资金不足：目前仅约 ${(bufferScore * 3).toFixed(1)} 个月支出，建议提升至 3 个月以上（约 ${formatMoney(avgFixedExpenses * 3)}）。`,
      `Emergency reserves are light—only ${(bufferScore * 3).toFixed(1)} months of expenses. Build at least a three‑month buffer (~${formatMoney(avgFixedExpenses * 3)}).`
    );
  } else if (bufferScore >= 0.8) {
    pushPositive(
      `应急缓冲资金充足（约 ${(bufferScore * 3).toFixed(1)} 个月支出），抗风险能力强。`,
      `Emergency savings look strong (~${(bufferScore * 3).toFixed(1)} months of expenses).`
    );
  }

  // ========== 抗冲击能力分析 ==========
  if (shockResilience < 0.3) {
    pushWarning(
      `抗冲击能力极弱：最大负面事件约 ${formatMoney(maxShock)}，占缓冲基准的 ${formatPercent(maxShock / shockBaseline, 1)}。建议：1) 建立更大应急基金（目标 ${formatMoney(avgFixedExpenses * 6)}）；2) 配置必要保险；3) 避免高风险支出。`,
      `Shock resilience is very weak: worst event ≈ ${formatMoney(maxShock)}, equal to ${formatPercent(maxShock / shockBaseline, 1)} of your buffer. Build larger reserves (~${formatMoney(avgFixedExpenses * 6)}), add insurance, and avoid high-risk outlays.`
    );
  } else if (shockResilience < 0.5) {
    pushImprovement(
      `抗冲击能力偏低，可将应急基金提升至 6 个月支出（约 ${formatMoney(avgFixedExpenses * 6)}）应对大额支出。`,
      `Shock resilience is modest. Grow your emergency fund to roughly six months of expenses (~${formatMoney(avgFixedExpenses * 6)}) to handle major events.`
    );
  } else if (shockResilience >= 0.7) {
    pushPositive(
      `抗冲击能力良好，能够应对大部分突发事件。`,
      `Shock resilience is solid; you can handle most unexpected events.`
    );
  }

  // ========== 资产趋势分析 ==========
  if (isDepleting && balanceTrend < -0.3) {
    // 已删除：资产快速消耗建议
  } else if (isDepleting) {
    pushImprovement(
      `资产呈下降趋势（下降 ${(Math.abs(balanceTrend) * 100).toFixed(1)}%），请优化收支结构，目标实现月度收支平衡或小幅盈余。`,
      `Assets are trending down (${(Math.abs(balanceTrend) * 100).toFixed(1)}% drop). Tighten the budget and aim for at least break-even cash flow.`
    );
  } else if (isGrowing && balanceTrend > 0.2) {
    pushPositive(
      `资产稳步增长（增长 ${(balanceTrend * 100).toFixed(1)}%），财务状况良好。`,
      `Assets are growing steadily (${(balanceTrend * 100).toFixed(1)}%); great momentum.`
    );
  }

  // ========== 现金流质量分析 ==========
  if (cashFlowQuality < 0.3) {
    // 已删除：现金流质量差建议
  } else if (cashFlowQuality < 0.6) {
    pushImprovement(
      `现金流稳定性待提升：${(negativeMonthRatio * 100).toFixed(0)}% 的月份为负值，建议优化收入结构并提升正现金流比例。`,
      `Cash flow stability needs work—${(negativeMonthRatio * 100).toFixed(0)}% of months show negative cash flow. Improve income mix and lift the share of positive months.`
    );
  } else if (cashFlowQuality >= 0.8) {
    pushPositive(
      `现金流质量优秀，大部分月份保持正现金流。`,
      `Cash flow quality is excellent; most months stay positive.`
    );
  }

  // ========== 支出稳定性分析 ==========
  if (expenseStability < 0.5) {
    pushImprovement(
      `支出波动较大，建议建立预算制度，将月度波动控制在 20% 以内。`,
      `Spending is volatile. Build a budget system and target <20% month-to-month swings.`
    );
  } else if (expenseStability >= 0.8) {
    pushPositive(
      `支出稳定性良好，预算控制有效。`,
      `Spending stability is solid; budgeting looks effective.`
    );
  }

  // ========== 综合评分建议 ==========
  if (score < 40) {
    pushPriority(
      `综合评分 ${score} 分，财务状况处于危险区。请立即建立应急基金、优化收支结构，并考虑寻求专业建议。`,
      `Overall score ${score} indicates high financial risk. Build emergency savings, fix cash flow, and consider professional guidance immediately.`
    );
  } else if (score < 60) {
    pushWarning(
      `综合评分 ${score} 分，需要优先解决高风险问题并逐步提升指标。`,
      `Score ${score} needs improvement—tackle the highest-risk areas first and lift each metric gradually.`
    );
  } else if (score < 80) {
    pushImprovement(
      `综合评分 ${score} 分，表现良好但仍有提升空间，继续优化以冲刺 80 分以上。`,
      `Score ${score} is good but not yet top-tier. Keep optimizing toward 80+.`
    );
  } else {
    pushPositive(
      `综合评分 ${score} 分，财务状况优秀，继续保持良好习惯。`,
      `Score ${score} is excellent. Keep up the good habits.`
    );
  }

  // ========== 组合建议（基于多指标交叉分析） ==========
  
  // 高风险组合：低可支撑天数 + 低被动收入 + 资产下降
  if (normDays < 0.4 && passiveScore < 0.3 && isDepleting) {
    pushPriority(
      `⚠️ 高风险组合：可支撑时间短、被动收入不足且资产下降。请立即削减非必要支出、寻找额外收入（兼职/副业）、考虑出售非必要资产，并寻求专业规划建议。`,
      `⚠️ High-risk combo: short runway, weak passive income, and declining assets. Slash discretionary spending, add side income, consider selling non-essential assets, and get professional planning help.`
    );
  }

  // 投资优化组合：有投资但表现不佳 + 可支撑时间有限
  if (hasInvestment && riskScore < 0.5 && normDays < 0.6) {
    pushWarning(
      `投资表现不佳且可支撑时间有限。建议：1) 降低投资风险，优先保证本金；2) 将部分资金转为应急基金；3) 采用更保守策略。`,
      `Investments underperform while runway is short. Lower risk to protect capital, redirect some funds to emergency reserves, and use more conservative strategies.`
    );
  }

  // 良好基础但需优化：可支撑时间充足但被动收入不足
  if (normDays >= 0.6 && passiveScore < 0.4) {
    pushImprovement(
      `基础良好但被动收入偏低。保持储备的同时，重点发展新的被动收入渠道，提升自由度。`,
      `Runway is solid but passive income is light. Keep savings intact and focus on building additional passive income streams.`
    );
  }

  // ========== 按优先级排序并返回 ==========
  const allSuggestions = [
    ...priority.map(s => `🔴 ${s}`),
    ...warnings.map(s => `🟠 ${s}`),
    ...improvements.map(s => `🟡 ${s}`),
    ...positives.map(s => `🟢 ${s}`)
  ];

  // 如果没有建议，提供通用建议
  if (allSuggestions.length === 0) {
    allSuggestions.push(
      translate(
        '财务结构稳健，建议继续保持良好的财务习惯，定期复盘和优化。',
        'Financial structure looks healthy. Keep your current habits and review them regularly.'
      )
    );
  }

  // 限制建议数量，优先显示最重要的
  return allSuggestions.slice(0, 12); // 最多返回12条建议
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

  // 计算额外分析指标
  const hasInvestment = annualReturn > 0;
  const totalNegativeMonths = monthlyNetValues.filter((v) => v < 0).length;
  const negativeMonthRatio = totalNegativeMonths / months;
  const balanceTrend = months > 1 ? (last.balanceAfter - summaries[0].balanceBefore) / summaries[0].balanceBefore : 0;
  const avgMonthlyExpenseRatio = avgFixedExpenses / (summaries[0]?.balanceBefore || 1);
  const monthsToDepletion = Number.isFinite(daysSupported) ? daysSupported / DAYS_PER_MONTH : Infinity;
  const isDepleting = balanceTrend < -0.1; // 资产下降超过10%
  const isGrowing = balanceTrend > 0.1; // 资产增长超过10%
  
  // 计算投资相关指标
  const totalInvestmentReturn = summaries.reduce((sum, s) => sum + (s.investmentReturn || 0), 0);
  const investmentContribution = summaries[0]?.balanceBefore > 0 
    ? totalInvestmentReturn / summaries[0].balanceBefore 
    : 0;
  const investmentEfficiency = hasInvestment && avgMonthlyReturn > 0 
    ? (avgMonthlyReturn / expectedMonthlyReturn) 
    : 0;

  // 计算支出稳定性
  const expenseVolatility = standardDeviation(summaries.map((s) => s.fixedExpenses));
  const expenseStability = avgFixedExpenses > 0 
    ? 1 - clamp(expenseVolatility / avgFixedExpenses, 0, 1) 
    : 1;

  // 计算现金流质量
  const positiveMonths = monthlyNetValues.filter((v) => v > 0).length;
  const cashFlowQuality = positiveMonths / months;

  // 生成精准建议
  const suggestions = generateAdvancedSuggestions({
    // 核心指标
    normDays,
    passiveScore,
    riskScore,
    bufferScore,
    shockResilience,
    score,
    
    // 详细指标
    daysSupported,
    monthsToDepletion,
    months,
    avgMonthlyNet,
    avgFixedExpenses,
    monthlyPassive,
    lastBalance: last.balanceAfter,
    initialBalance: summaries[0].balanceBefore,
    
    // 趋势指标
    balanceTrend,
    isDepleting,
    isGrowing,
    negativeMonthRatio,
    cashFlowQuality,
    
    // 投资指标
    hasInvestment,
    annualReturn,
    investmentContribution,
    investmentEfficiency,
    avgMonthlyReturn,
    expectedMonthlyReturn,
    actualVol,
    expectedVol,
    returnScore,
    volatilityScore,
    
    // 其他指标
    expenseStability,
    maxShock,
    shockBaseline,
    riskProfile
  });

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


