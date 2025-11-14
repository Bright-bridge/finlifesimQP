import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/currency.js';

export default function MonthlyTable({ summaries, className = '' }) {
  const { t } = useTranslation();
  return (
    <div className={`glass rounded-2xl p-4 overflow-x-auto ${className}`}>
      <div className="font-semibold mb-2">{t('table.title')}</div>
      <table className="min-w-full text-sm">
        <thead className="text-slate-300">
          <tr>
            <th className="text-left py-2 pr-4">{t('table.month')}</th>
            <th className="text-left py-2 pr-4">{t('table.income')}</th>
            <th className="text-left py-2 pr-4">{t('table.expense')}</th>
            <th className="text-left py-2 pr-4">{t('table.eventChange')}</th>
            <th className="text-left py-2 pr-4">{t('table.monthNet')}</th>
            <th className="text-left py-2 pr-4">{t('table.balanceAfter')}</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((m) => {
            const eventsTotal = (m.events || []).reduce((acc, e) => acc + (e.amount || 0), 0);
            const income = m.passiveIncome + m.investmentReturn + (eventsTotal > 0 ? eventsTotal : 0);
            const expense = m.fixedExpenses + (eventsTotal < 0 ? Math.abs(eventsTotal) : 0);
            return (
              <tr key={m.month} className="border-t border-white/10">
                <td className="py-2 pr-4">{t('table.monthLabel', { month: m.month })}</td>
                <td className="py-2 pr-4">{formatCurrency(income)}</td>
                <td className="py-2 pr-4">{formatCurrency(expense)}</td>
                <td className="py-2 pr-4">{eventsTotal >= 0 ? '+' : ''}{formatCurrency(eventsTotal)}</td>
                <td className="py-2 pr-4">{m.monthNet >= 0 ? '+' : ''}{formatCurrency(m.monthNet)}</td>
                <td className="py-2 pr-4">{formatCurrency(m.balanceAfter)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

