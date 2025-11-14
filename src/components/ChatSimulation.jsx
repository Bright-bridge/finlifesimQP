import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MonthlyBubble from './MonthlyBubble.jsx';

export default function ChatSimulation({ summaries = [], onFinish, className = '' }) {
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
        <div className="font-semibold text-amber-300 mb-2">剩余余额</div>
        <div className="text-3xl">
          ¥
          {visible.length
            ? visible[visible.length - 1].balanceAfter.toFixed(2)
            : summaries[0]?.balanceAfter?.toFixed(2) || '0.00'}
        </div>
        <div className="text-xs text-slate-300 mt-2">
          显示基于每月的被动收入、固定支出、投资收益与随机事件的累计结果。
        </div>
      </motion.div>
    </div>
  );
}

