import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import InputForm from '../components/InputForm.jsx';
import { getSimulation } from '../utils/api.js';
import { API_STATUS } from '../utils/constants.js';
import Section from '../components/Section.jsx';

export default function Calculator() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { currentSavings, dailyExpense, monthlyPassive, annualReturn, months, risk, enableEvents, resignDate } =
      values;
    const params = {
      currentSavings: Number(currentSavings),
      dailyExpense: Number(dailyExpense),
      monthlyPassive: Number(monthlyPassive || 0),
      annualReturn: Number(annualReturn),
      months: Number(months),
      risk,
      enableEvents
    };
    const { source, data } = await getSimulation(params);
    const status = source === 'remote' ? API_STATUS.REMOTE : API_STATUS.LOCAL;
    navigate('/result', { state: { simulation: data, apiStatus: status, resignDate } });
  };

  return (
    <div className="space-y-5">
      <Helmet>
        <title>预算计算器 | Financial Life Simulator</title>
        <meta name="description" content="输入储蓄、每日开销与被动收入，生成月度模拟与聊天式总结。" />
      </Helmet>
      <Section>
        <h1 className="text-3xl font-bold">预算计算器</h1>
      </Section>
      <Section delay={0.06}>
        <InputForm onSubmit={handleSubmit} />
      </Section>
      <Section delay={0.1}>
        <div className="text-xs text-slate-300">
          提示：勾选“启用随机事件”后，系统会在每月生成 0–3 条收入/支出/通胀事件用于模拟。
        </div>
      </Section>
    </div>
  );
}

