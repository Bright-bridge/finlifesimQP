import { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { motion } from 'framer-motion';

function formatYMD(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export default function DateField({ value, onChange, id = 'resignDate', label = '日期' }) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }, [value]);

  const handleSelect = (day) => {
    if (!day) return;
    onChange?.(formatYMD(day));
    setOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm mb-1">{label}</label>
      <button
        id={id}
        type="button"
        className="w-full text-left px-3 py-2 rounded-lg bg-slate-900 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {value || '选择日期'}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18 }}
          className="absolute z-40 mt-2"
        >
          <div className="rounded-xl p-2 shadow-soft bg-slate-900 border border-white/10">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              weekStartsOn={1}
              styles={{
                caption_label: { fontWeight: 600 }
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

