import {
  BalanceTrend,
  IncomeExpenseBars,
  ExpenseStructurePie,
  CashflowTrend
} from './TrendChart.jsx';

export default function AnalyticsPanel({ summaries = [], breakdown = {}, className = '' }) {
  return (
    <div className={`space-y-5 ${className}`}>
      <div className="grid lg:grid-cols-2 gap-5">
        <BalanceTrend data={summaries} />
        <IncomeExpenseBars data={summaries} />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <ExpenseStructurePie breakdown={breakdown} />
        <CashflowTrend data={summaries} />
      </div>
    </div>
  );
}

