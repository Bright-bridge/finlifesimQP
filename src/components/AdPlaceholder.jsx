export default function AdPlaceholder({ id = 'ads-placeholder', className = '' }) {
  return (
    <div
      id={id}
      aria-label="广告占位容器"
      className={`glass rounded-xl p-4 border border-dashed border-amber-500/60 text-amber-300 ${className}`}
    >
      <div className="text-sm">
        广告占位（审核阶段请勿放真实广告脚本）。此处将来可替换为 Google AdSense 代码。
      </div>
    </div>
  );
}

