import { motion } from 'framer-motion';

export default function MonthlyBubble({ summary }) {
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
      aria-label={`第${month}个月摘要`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-amber-300">第 {month} 月</div>
        <div className="text-sm text-slate-300">余额：¥{balanceAfter.toFixed(2)}</div>
      </div>
      <div className="grid sm:grid-cols-3 gap-2 text-sm">
        <div>
          被动收入：
          <span className="text-emerald-300">+¥{passiveIncome.toFixed(2)}</span>
        </div>
        <div>
          投资收益：
          <span className={investmentReturn >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
            {investmentReturn >= 0 ? '+' : ''}¥{investmentReturn.toFixed(2)}
          </span>
        </div>
        <div>
          固定支出：
          <span className="text-rose-300">-¥{fixedExpenses.toFixed(2)}</span>
        </div>
        <div>
          事件合计：
          <span className={eventsTotal >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
            {eventsTotal >= 0 ? '+' : ''}¥{eventsTotal.toFixed(2)}
          </span>
        </div>
        <div>
          本月结余：
          <span className={monthNet >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
            {monthNet >= 0 ? '+' : ''}¥{monthNet.toFixed(2)}
          </span>
        </div>
      </div>
      {events.length > 0 && (
        <div className="mt-3 pl-3 border-l border-amber-400/30">
          <div className="text-xs uppercase tracking-widest text-amber-300 mb-1">事件</div>
          <ul className="text-sm list-disc list-inside marker:text-amber-400">
            {events.map((e) => (
              <li key={e.id}>
                {e.desc} {e.amount >= 0 ? '+' : ''}¥{e.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

