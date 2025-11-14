import { API_ENDPOINTS } from './constants.js';
import { simulateLocally } from './financeCalc.js';

export async function simulateViaApi(params) {
  const {
    currentSavings,
    initialBalance,
    dailyExpense,
    monthlyPassive,
    monthlyPassiveIncome,
    annualReturn,
    months,
    riskProfile,
    risk,
    enableRandomEvents,
    seed
  } = params;

  const query = new URLSearchParams({
    balance: String(initialBalance ?? currentSavings ?? 0),
    dailyExpense: String(dailyExpense),
    monthlyPassive: String(monthlyPassive ?? monthlyPassiveIncome ?? 0),
    annualReturn: String(annualReturn),
    months: String(months),
    riskProfile: String(riskProfile ?? risk ?? 'neutral'),
    enableRandomEvents: String(enableRandomEvents ?? true),
    seed: seed != null ? String(seed) : ''
  }).toString();

  const url = `${API_ENDPOINTS.simulate}?${query}`;

  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`API 响应失败：${res.status}`);
  }
  const data = await res.json();
  return data;
}

export async function getSimulation(params) {
  try {
    const remote = await simulateViaApi(params);
    if (!remote.metadata) {
      remote.metadata = {
        usedBackend: true,
        seed: params.seed ?? null,
        riskProfile: params.riskProfile ?? params.risk ?? 'neutral',
        annualReturn: params.annualReturn,
        monthlyPassive: params.monthlyPassive ?? params.monthlyPassiveIncome ?? 0,
        dailyExpense: params.dailyExpense,
        enableRandomEvents: params.enableRandomEvents ?? true
      };
    } else {
      remote.metadata.usedBackend = true;
    }
    return { source: 'remote', data: remote };
  } catch (e) {
    const local = simulateLocally(params);
    return { source: 'local', data: local };
  }
}

