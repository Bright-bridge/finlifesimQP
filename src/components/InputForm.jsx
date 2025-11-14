import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DateField from './DateField.jsx';

export default function InputForm({ onSubmit }) {
  const { t } = useTranslation();
  
  const riskOptions = [
    { value: 'conservative', label: t('calculator.riskConservative') },
    { value: 'neutral', label: t('calculator.riskNeutral') },
    { value: 'aggressive', label: t('calculator.riskAggressive') }
  ];

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
      annualReturn: 0,
      risk: 'neutral',
      enableEvents: false
    }
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass rounded-2xl p-4 grid sm:grid-cols-2 gap-4"
      aria-label={t('calculator.title')}
    >
      <Controller
        control={control}
        name="resignDate"
        rules={{ required: t('calculator.required') }}
        render={({ field }) => (
          <div>
            <DateField value={field.value} onChange={field.onChange} label={t('calculator.resignDate')} />
            {errors.resignDate && <div className="text-xs text-rose-300 mt-1">{errors.resignDate.message}</div>}
          </div>
        )}
      />
      <div>
        <label className="block text-sm mb-1">{t('calculator.currentSavings')}（{t('calculator.currentSavingsUnit')}）</label>
        <input
          type="number"
          step="0.01"
          {...register('currentSavings', { required: t('calculator.required'), min: { value: 1, message: t('calculator.minValue') } })}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        />
        {errors.currentSavings && <div className="text-xs text-rose-300 mt-1">{errors.currentSavings.message}</div>}
      </div>
      <div>
        <label className="block text-sm mb-1">{t('calculator.dailyExpense')}（{t('calculator.dailyExpenseUnit')}）</label>
        <input
          type="number"
          step="0.01"
          {...register('dailyExpense', { required: t('calculator.required'), min: { value: 1, message: t('calculator.minValue') } })}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        />
        {errors.dailyExpense && <div className="text-xs text-rose-300 mt-1">{errors.dailyExpense.message}</div>}
      </div>
      <div>
        <label className="block text-sm mb-1">{t('calculator.monthlyPassive')}</label>
        <input
          type="number"
          step="0.01"
          {...register('monthlyPassive', { min: { value: 0, message: t('calculator.minValueZero') } })}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        />
        {errors.monthlyPassive && <div className="text-xs text-rose-300 mt-1">{errors.monthlyPassive.message}</div>}
      </div>
      <div>
        <label className="block text-sm mb-1">{t('calculator.annualReturn')}</label>
        <input
          type="number"
          step="0.001"
          {...register('annualReturn', { min: { value: 0, message: t('calculator.minValueZero') } })}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">{t('calculator.risk')}</label>
        <select
          {...register('risk')}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
        >
          {riskOptions.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input id="enableEvents" type="checkbox" {...register('enableEvents')} />
        <label htmlFor="enableEvents" className="text-sm">{t('calculator.enableEvents')}</label>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition transform hover:scale-[1.02]"
          aria-label={t('common.startSimulation')}
        >
          {t('common.startSimulation')}
        </button>
      </div>
    </form>
  );
}

