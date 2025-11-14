export const DEFAULT_ANNUAL_RETURN = 0.03;
export const DAYS_PER_MONTH = 30;

export const API_ENDPOINTS = {
  simulate: '/api/simulate'
};

export const API_STATUS = {
  REMOTE: '使用后端数据',
  LOCAL: '使用本地模拟'
};

// 事件金额分档（元）
export const EVENT_BRACKETS = {
  small: [50, 500],
  medium: [500, 3000],
  large: [3000, 8000]
};

export function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

