import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/currency.js';
import MonthlyBubble from './MonthlyBubble.jsx';

export default function ChatSimulation({ summaries = [], onFinish, className = '' }) {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef(null);

  const visible = useMemo(() => summaries.slice(0, visibleCount), [summaries, visibleCount]);

  useEffect(() => {
    setVisibleCount(summaries.length);
  }, [summaries]);

  useEffect(() => {
    if (visibleCount >= summaries.length && summaries.length > 0) {
      onFinish?.();
    }
  }, [visibleCount, summaries, onFinish]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleCount]);

  const lastBalance = visible.length
    ? visible[visible.length - 1].balanceAfter
    : summaries[0]?.balanceAfter || 0;

  return (
    <div className={`grid lg:grid-cols-[1fr_320px] gap-5 relative ${className}`}>
      <div ref={containerRef} className="scrollbar-themed h-full overflow-y-auto pr-2">
        {visible.map((s) => (
          <MonthlyBubble key={s.month} summary={s} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 h-fit border border-amber-400/20 bg-slate-900/70"
      >
        <div className="font-semibold text-amber-300 mb-2">{t('chat.remainingBalance')}</div>
        <div className="text-3xl">
          {formatCurrency(lastBalance)}
        </div>
        <div className="text-xs text-slate-300 mt-2">
          {t('chat.description')}
        </div>
      </motion.div>
    </div>
  );
}

