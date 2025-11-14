// import AdPlaceholder from './AdPlaceholder.jsx';
import { useTranslation } from 'react-i18next';

export default function ResultCard({ stats }) {
  const { t } = useTranslation();
  if (!stats) return null;
  const { daysSupported, expectedDepletionDate, score, suggestions = [] } = stats;
  const displayDays = Number.isFinite(daysSupported)
    ? `${daysSupported} ${t('common.days')}`
    : t('common.noRisk');
  const displayDepletion = Number.isFinite(daysSupported)
    ? expectedDepletionDate
    : t('common.noRisk');
  return (
    <div className="grid gap-6">
      {/* <div className="grid lg:grid-cols-[1fr_320px] gap-6"> */}
      <div className="glass rounded-2xl p-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-slate-300">{t('result.daysSupported')}</div>
            <div className="text-3xl font-semibold">{displayDays}</div>
          </div>
          <div>
            <div className="text-sm text-slate-300">{t('result.expectedDepletionDate')}</div>
            <div className="text-3xl font-semibold">{displayDepletion}</div>
          </div>
          <div>
            <div className="text-sm text-slate-300">{t('result.healthScore')}</div>
            <div className="text-3xl font-semibold">{score}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm text-slate-300 mb-1">{t('common.suggestions')}</div>
          <ul className="list-disc list-inside space-y-1">
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* <AdPlaceholder id="ads-placeholder-result" /> */}
    </div>
  );
}

