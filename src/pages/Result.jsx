import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ResultCard from '../components/ResultCard.jsx';
import AnalyticsPanel from '../components/AnalyticsPanel.jsx';
import MonthlyTable from '../components/MonthlyTable.jsx';
import { buildStatsFromSummaries } from '../utils/financeCalc.js';
import ChatSimulation from '../components/ChatSimulation.jsx';
import Section from '../components/Section.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { formatCurrency } from '../utils/currency.js';

export default function Result() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const simulation = state?.simulation;
  const apiStatus = state?.apiStatus;
  const resignDate = state?.resignDate;

  useEffect(() => {
    if (!simulation) navigate('/calculator', { replace: true });
  }, [simulation, navigate]);

  if (!simulation) return null;

  const summaries = simulation.monthlySummaries || [];
  const metadata = simulation.metadata || {};
  const stats = buildStatsFromSummaries(summaries, resignDate, { metadata });

  const breakdown = {
    [t('result.living')]: summaries.reduce((acc, s) => acc + s.fixedExpenses, 0),
    [t('result.investment')]: summaries.reduce((acc, s) => acc + (s.investmentReturn < 0 ? Math.abs(s.investmentReturn) : 0), 0),
    [t('result.events')]: summaries.reduce(
      (acc, s) =>
        acc +
        (s.events || []).reduce((acc2, e) => (e.amount < 0 ? acc2 + Math.abs(e.amount) : acc2), 0),
      0
    )
  };

  const jsonExport = () => {
    const blob = new Blob([JSON.stringify(simulation, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'financial-simulation.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const csvExport = () => {
    const header = ['month,fixedExpenses,passiveIncome,investmentReturn,eventsTotal,monthNet,balanceAfter'];
    const rows = summaries.map((s) => {
      const eventsTotal = (s.events || []).reduce((acc, e) => acc + e.amount, 0);
      return [
        s.month,
        s.fixedExpenses,
        s.passiveIncome,
        s.investmentReturn,
        eventsTotal,
        s.monthNet,
        s.balanceAfter
      ].join(',');
    });
    const blob = new Blob([header.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'financial-simulation.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // ✅ 放大三个 tab 的容器高度，仍保持不穿透底部
  const moduleHeight = 'clamp(400px, 85vh, 720px)';

  return (
    <div className="space-y-5 px-1 sm:px-2">
      <Helmet>
        <title>{t('result.title')} | {t('common.appName')}</title>
        <meta name="description" content={t('result.title')} />
      </Helmet>

      <Section>
        <div className="text-sm text-slate-300">
          {t('common.dataSource')}：{apiStatus}
          {metadata.usedBackend != null && (
            <span className="ml-2 text-xs text-slate-400">
              （{t('common.algorithmVersion')} {metadata.algorithmVersion || 'v2.0'} · {t('common.eventPoolVersion')} {metadata.eventPoolVersion || '2025-02'}）
            </span>
          )}
        </div>
      </Section>

      <Section delay={0.04}>
        <ResultCard stats={stats} />
      </Section>

      <Section delay={0.05}>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4 shadow-inner shadow-black/30">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-white">{t('result.simulationAssumptions')}</div>
            <div className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
              {t('result.riskProfile')} · {metadata.riskProfile || 'neutral'}
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: t('result.expectedAnnualReturn'),
                value: `${(Number(metadata.annualReturn ?? 0) * 100).toFixed(2)}%`
              },
              {
                label: t('result.monthlyPassiveIncome'),
                value: formatCurrency(Number(metadata.monthlyPassive ?? summaries[0]?.passiveIncome ?? 0))
              },
              {
                label: t('result.dailyExpense'),
                value: formatCurrency(Number(metadata.dailyExpense ?? 0))
              },
              {
                label: t('result.randomEvents'),
                value: metadata.enableRandomEvents === false ? t('result.disabled') : t('result.enabled')
              }
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 shadow-[0_10px_28px_-18px_rgba(245,158,11,0.45)]"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                <div className="mt-1.5 text-lg font-semibold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {summaries.length > 0 && (
        <Section delay={0.06}>
          <Tabs defaultValue="timeline">
            <TabsList className="grid gap-2 sm:grid-cols-3 w-full">
              <TabsTrigger value="timeline">{t('result.timeline')}</TabsTrigger>
              <TabsTrigger value="charts">{t('result.charts')}</TabsTrigger>
              <TabsTrigger value="table">{t('result.table')}</TabsTrigger>
            </TabsList>

            {['timeline', 'charts', 'table'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div
                  className="module-scroll scrollbar-themed mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 overflow-y-auto"
                  style={{ '--module-height': moduleHeight }}
                >
                  {tab === 'timeline' && <ChatSimulation summaries={summaries} className="h-full" />}
                  {tab === 'charts' && (
                    <AnalyticsPanel summaries={summaries} breakdown={breakdown} className="min-h-full" />
                  )}
                  {tab === 'table' && <MonthlyTable summaries={summaries} className="min-h-full" />}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Section>
      )}

      <Section delay={0.12}>
        <div className="flex gap-3">
          <button
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg"
            onClick={jsonExport}
            aria-label={t('common.exportJSON')}
          >
            {t('common.exportJSON')}
          </button>
          <button
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg"
            onClick={csvExport}
            aria-label={t('common.exportCSV')}
          >
            {t('common.exportCSV')}
          </button>
        </div>
      </Section>
    </div>
  );
}
