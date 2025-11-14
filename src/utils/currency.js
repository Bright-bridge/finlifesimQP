import i18n from '../i18n/config.js';

/**
 * 格式化货币显示
 * @param {number} amount - 金额
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(amount) {
  const locale = i18n.language;
  if (locale === 'en') {
    // 英文使用美元
    return `$${amount.toFixed(2)}`;
  } else {
    // 中文使用人民币
    return `¥${amount.toFixed(2)}`;
  }
}

/**
 * 获取货币符号
 * @returns {string} 货币符号
 */
export function getCurrencySymbol() {
  const locale = i18n.language;
  return locale === 'en' ? '$' : '¥';
}

/**
 * 获取货币单位文本
 * @returns {string} 货币单位
 */
export function getCurrencyUnit() {
  const locale = i18n.language;
  return locale === 'en' ? 'USD' : '元';
}

