import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-white/10 bg-slate-900/60">
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm text-slate-300">
        <div>
          <div className="font-semibold mb-2 text-white">Financial Life Simulator</div>
          <p className="opacity-80">
            本工具仅用于教育与规划参考，不构成投资建议。请在做出重要财务决策前咨询专业人士。
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/about">关于</Link>
          <Link to="/articles">理财文章</Link>
          <Link to="/privacy">隐私政策</Link>
          <Link to="/disclaimer">免责声明</Link>
          <Link to="/contact">联系我们</Link>
        </div>
        <div>
          <div className="mb-2 text-white">广告位</div>
          <div className="glass rounded-xl p-3 border border-dashed border-amber-500/60 text-amber-300">
            审核阶段请勿放真实广告脚本
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-3 text-xs text-slate-400">
        © {new Date().getFullYear()} Financial Life Simulator. All rights reserved.
      </div>
    </footer>
  );
}

