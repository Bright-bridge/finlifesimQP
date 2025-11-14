import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InputForm from '../components/InputForm.jsx';
import { getSimulation } from '../utils/api.js';
import { API_STATUS } from '../utils/constants.js';
import Section from '../components/Section.jsx';

export default function Calculator() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { currentSavings, dailyExpense, monthlyPassive, annualReturn, risk, enableEvents, resignDate } =
      values;
    const params = {
      currentSavings: Number(currentSavings),
      dailyExpense: Number(dailyExpense),
      monthlyPassive: Number(monthlyPassive || 0),
      annualReturn: Number(annualReturn || 0),
      months: 1200, // 最大1200个月，模拟会自动在余额为0时终止
      risk,
      enableEvents,
      resignDate
    };
    const { source, data } = await getSimulation(params);
    const status = source === 'remote' ? API_STATUS.REMOTE : API_STATUS.LOCAL;
    navigate('/result', { state: { simulation: data, apiStatus: status, resignDate } });
  };

  return (
    <div className="space-y-5">
      <Helmet>
        <title>{t('calculator.title')} | {t('common.appName')}</title>
        <meta name="description" content={t('calculator.tip')} />
      </Helmet>
      <Section>
        <h1 className="text-3xl font-bold">{t('calculator.title')}</h1>
      </Section>
      <Section delay={0.06}>
        <InputForm onSubmit={handleSubmit} />
      </Section>
      <Section delay={0.1}>
        <div className="text-xs text-slate-300">
          {t('calculator.tip')}
        </div>
      </Section>
    </div>
  );
}

