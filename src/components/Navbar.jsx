import { Link, NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/calculator', label: '预算计算器' },
  { to: '/articles', label: '理财文章' },
  { to: '/about', label: '关于' }
];

export default function Navbar() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" aria-label="返回首页" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500"></div>
          <span className="font-semibold tracking-wide">Financial Life Simulator</span>
        </Link>
        <nav className="flex items-center gap-4">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition ${
                  isActive || location.pathname === n.to
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <Link
            to="/calculator"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition transform hover:scale-[1.02]"
          >
            开始模拟
          </Link>
        </nav>
      </div>
    </header>
  );
}

