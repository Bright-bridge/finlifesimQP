import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/currency.js';

const COLORS = ['#F59E0B', '#6D28D9', '#10B981', '#EF4444', '#3B82F6'];

export function BalanceTrend({ data }) {
  const { t } = useTranslation();
  return (
    <div className="glass rounded-2xl p-4">
      <div className="font-semibold mb-2">{t('result.balanceTrend')}</div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="#E6E6E6" />
          <YAxis stroke="#E6E6E6" />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Line type="monotone" dataKey="balanceAfter" name={t('bubble.balance')} stroke="#F59E0B" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IncomeExpenseBars({ data }) {
  const { t } = useTranslation();
  return (
    <div className="glass rounded-2xl p-4">
      <div className="font-semibold mb-2">{t('result.incomeExpense')}</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="#E6E6E6" />
          <YAxis stroke="#E6E6E6" />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="passiveIncome" name={t('bubble.passiveIncome')} fill="#10B981" />
          <Bar dataKey="fixedExpenses" name={t('bubble.fixedExpense')} fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExpenseStructurePie({ breakdown }) {
  const { t } = useTranslation();
  const entries = Object.entries(breakdown || {}).map(([name, value]) => ({ name, value }));
  const total = entries.reduce((sum, item) => sum + (item.value || 0), 0);
  return (
    <div className="glass rounded-2xl p-4 overflow-hidden">
      <div className="font-semibold mb-2">{t('result.expenseStructure')}</div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={entries}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={3}
            label
          >
            {entries.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
      {entries.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
          {entries.map((entry, index) => {
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0.0';
            return (
              <div key={entry.name} className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  aria-hidden="true"
                />
                <span className="truncate">{entry.name}</span>
                <span className="ml-auto text-white">
                  {formatCurrency(entry.value)} <span className="text-slate-400">({percentage}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CashflowTrend({ data }) {
  const { t } = useTranslation();
  const formatted = (data || []).map((item) => ({
    month: item.month,
    netCashflow: Number(item.monthNet?.toFixed?.(2) ?? item.monthNet ?? 0),
    cumulative: Number(item.balanceAfter?.toFixed?.(2) ?? item.balanceAfter ?? 0)
  }));

  return (
    <div className="glass rounded-2xl p-4">
      <div className="font-semibold mb-2">{t('result.cashflowTrend')}</div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted}>
          <defs>
            <linearGradient id="netFlowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="#E6E6E6" />
          <YAxis stroke="#E6E6E6" />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Area
            type="monotone"
            dataKey="netCashflow"
            name={t('result.monthNetCashflow')}
            stroke="#10B981"
            fill="url(#netFlowGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            name={t('result.endBalance')}
            stroke="#3B82F6"
            fill="url(#cumulativeGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

