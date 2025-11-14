import { useForm, Controller } from 'react-hook-form';
import DateField from './DateField.jsx';

const riskOptions = [
  { value: 'conservative', label: '保守' },
  { value: 'neutral', label: '中性' },
  { value: 'aggressive', label: '激进' }
];

const countryOptions = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'Japan',
  'Singapore',
  'China',
  'Hong Kong'
];

export default function InputForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      resignDate: new Date().toISOString().slice(0, 10),
      currentSavings: 100000,
      dailyExpense: 200,
      monthlyPassive: 2000,
      annualReturn: 0.03,
      months: 36,
      risk: 'neutral',
      enableEvents: true,
      country: ''
    }
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass rounded-2xl p-4 grid sm:grid-cols-2 gap-4"
      aria-label="预算计算表单"
    >
      <Controller
        control={control}
        name="resignDate"
        rules={{ required: '必填' }}
        render={({ field }) => (
          <div>
            <DateField value={field.value} onChange={field.onChange} label="辞职时间" />
            {errors.resignDate && <div className="text-xs text-rose-300 mt-1">{errors.resignDate.message}</div>}
          </div>
        )}
      />
      <div>
        <label className="block text-sm mb-1">当前储蓄（元）</label>
        <input
          type="number"
          step="0.01"
          {...register('currentSavings', { required: '必填', min: { value: 1, message: '> 0' } })}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        />
        {errors.currentSavings && <div className="text-xs text-rose-300 mt-1">{errors.currentSavings.message}</div>}
      </div>
      <div>
        <label className="block text-sm mb-1">每日开销（元）</label>
        <input
          type="number"
          step="0.01"
          {...register('dailyExpense', { required: '必填', min: { value: 1, message: '> 0' } })}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        />
        {errors.dailyExpense && <div className="text-xs text-rose-300 mt-1">{errors.dailyExpense.message}</div>}
      </div>
      <div>
        <label className="block text-sm mb-1">被动收入（每月）</label>
        <input
          type="number"
          step="0.01"
          {...register('monthlyPassive', { min: { value: 0, message: '>= 0' } })}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        />
        {errors.monthlyPassive && <div className="text-xs text-rose-300 mt-1">{errors.monthlyPassive.message}</div>}
      </div>
      <div>
        <label className="block text-sm mb-1">年化收益率（0–1）</label>
        <input
          type="number"
          step="0.001"
          {...register('annualReturn', { min: { value: 0, message: '>= 0' } })}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">模拟月份</label>
        <input
          type="number"
          {...register('months', { min: { value: 1, message: '>= 1' } })}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">风险偏好</label>
        <select
          {...register('risk')}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        >
          {riskOptions.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">国家/地区（示例化地理定位）</label>
        <select
          {...register('country')}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        >
          <option value="">不选择</option>
          {countryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input id="enableEvents" type="checkbox" {...register('enableEvents')} />
        <label htmlFor="enableEvents" className="text-sm">启用随机事件</label>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition transform hover:scale-[1.02]"
          aria-label="开始模拟"
        >
          开始模拟
        </button>
      </div>
    </form>
  );
}

