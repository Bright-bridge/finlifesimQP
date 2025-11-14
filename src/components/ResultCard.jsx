import AdPlaceholder from './AdPlaceholder.jsx';

export default function ResultCard({ stats }) {
  if (!stats) return null;
  const { daysSupported, expectedDepletionDate, score, suggestions = [] } = stats;
  const displayDays = Number.isFinite(daysSupported)
    ? `${daysSupported} 天`
    : '暂无耗尽风险';
  const displayDepletion = Number.isFinite(daysSupported)
    ? expectedDepletionDate
    : '暂无耗尽风险';
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="glass rounded-2xl p-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-slate-300">可支撑天数</div>
            <div className="text-3xl font-semibold">{displayDays}</div>
          </div>
          <div>
            <div className="text-sm text-slate-300">预计耗尽日期</div>
            <div className="text-3xl font-semibold">{displayDepletion}</div>
          </div>
          <div>
            <div className="text-sm text-slate-300">理财健康评分</div>
            <div className="text-3xl font-semibold">{score}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm text-slate-300 mb-1">建议：</div>
          <ul className="list-disc list-inside space-y-1">
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
      <AdPlaceholder id="ads-placeholder-result" />
    </div>
  );
}

