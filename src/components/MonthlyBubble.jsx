import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/currency.js';

export default function MonthlyBubble({ summary }) {
  const { t } = useTranslation();
  const {
    month,
    fixedExpenses,
    passiveIncome,
    investmentReturn,
    events = [],
    monthNet,
    balanceAfter
  } = summary;

  const eventsTotal = events.reduce((acc, e) => acc + (e.amount || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl rounded-2xl p-4 mb-4 border border-amber-400/20 bg-slate-900/80 text-slate-100 shadow-[0_10px_30px_-12px_rgba(245,158,11,0.35)]"
      aria-label={t('bubble.monthLabel', { month })}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-amber-300">{t('bubble.monthLabel', { month })}</div>
        <div className="text-sm text-slate-300">{t('bubble.balance')}：{formatCurrency(balanceAfter)}</div>
      </div>
      <div className="grid sm:grid-cols-3 gap-2 text-sm">
        <div>
          {t('bubble.passiveIncome')}：
          <span className="text-emerald-300">+{formatCurrency(passiveIncome)}</span>
        </div>
        <div>
          {t('bubble.investmentReturn')}：
          <span className={investmentReturn >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
            {investmentReturn >= 0 ? '+' : ''}{formatCurrency(investmentReturn)}
          </span>
        </div>
        <div>
          {t('bubble.fixedExpense')}：
          <span className="text-rose-300">-{formatCurrency(fixedExpenses)}</span>
        </div>
        <div>
          {t('bubble.eventsTotal')}：
          <span className={eventsTotal >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
            {eventsTotal >= 0 ? '+' : ''}{formatCurrency(eventsTotal)}
          </span>
        </div>
        <div>
          {t('bubble.monthNet')}：
          <span className={monthNet >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
            {monthNet >= 0 ? '+' : ''}{formatCurrency(monthNet)}
          </span>
        </div>
      </div>
      {events.length > 0 && (
        <div className="mt-3 pl-3 border-l border-amber-400/30">
          <div className="text-xs uppercase tracking-widest text-amber-300 mb-1">{t('bubble.events')}</div>
          <ul className="text-sm list-disc list-inside marker:text-amber-400">
            {events.map((e) => (
              <li key={e.id}>
                {e.desc} {e.amount >= 0 ? '+' : ''}{formatCurrency(e.amount)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

