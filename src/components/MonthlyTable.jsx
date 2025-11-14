export default function MonthlyTable({ summaries, className = '' }) {
  return (
    <div className={`glass rounded-2xl p-4 overflow-x-auto ${className}`}>
      <div className="font-semibold mb-2">财务报表</div>
      <table className="min-w-full text-sm">
        <thead className="text-slate-300">
          <tr>
            <th className="text-left py-2 pr-4">月份</th>
            <th className="text-left py-2 pr-4">收入</th>
            <th className="text-left py-2 pr-4">支出</th>
            <th className="text-left py-2 pr-4">事件变动</th>
            <th className="text-left py-2 pr-4">本月结余</th>
            <th className="text-left py-2 pr-4">剩余余额</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((m) => {
            const eventsTotal = (m.events || []).reduce((acc, e) => acc + (e.amount || 0), 0);
            const income = m.passiveIncome + m.investmentReturn + (eventsTotal > 0 ? eventsTotal : 0);
            const expense = m.fixedExpenses + (eventsTotal < 0 ? Math.abs(eventsTotal) : 0);
            return (
              <tr key={m.month} className="border-t border-white/10">
                <td className="py-2 pr-4">第 {m.month} 月</td>
                <td className="py-2 pr-4">¥{income.toFixed(2)}</td>
                <td className="py-2 pr-4">¥{expense.toFixed(2)}</td>
                <td className="py-2 pr-4">{eventsTotal >= 0 ? '+' : ''}¥{eventsTotal.toFixed(2)}</td>
                <td className="py-2 pr-4">{m.monthNet >= 0 ? '+' : ''}¥{m.monthNet.toFixed(2)}</td>
                <td className="py-2 pr-4">¥{m.balanceAfter.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

