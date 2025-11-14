import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const navItems = [
    { to: '/', labelKey: 'nav.home' },
    { to: '/calculator', labelKey: 'nav.calculator' },
    { to: '/articles', labelKey: 'nav.articles' },
    { to: '/about', labelKey: 'nav.about' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" aria-label={t('nav.backToHome')} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500"></div>
          <span className="font-semibold tracking-wide">{t('common.appName')}</span>
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
              {t(n.labelKey)}
            </NavLink>
          ))}
          {/*<div className="flex items-center gap-2">*/}
          {/*  <button*/}
          {/*    onClick={() => changeLanguage('zh')}*/}
          {/*    className={`px-2 py-1 rounded text-sm transition ${*/}
          {/*      i18n.language === 'zh'*/}
          {/*        ? 'bg-amber-500 text-black font-semibold'*/}
          {/*        : 'text-slate-300 hover:text-white'*/}
          {/*    }`}*/}
          {/*  >*/}
          {/*    中文*/}
          {/*  </button>*/}
          {/*  <button*/}
          {/*    onClick={() => changeLanguage('en')}*/}
          {/*    className={`px-2 py-1 rounded text-sm transition ${*/}
          {/*      i18n.language === 'en'*/}
          {/*        ? 'bg-amber-500 text-black font-semibold'*/}
          {/*        : 'text-slate-300 hover:text-white'*/}
          {/*    }`}*/}
          {/*  >*/}
          {/*    EN*/}
          {/*  </button>*/}
          {/*</div>*/}
          <Link
            to="/calculator"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition transform hover:scale-[1.02]"
          >
            {t('common.startSimulation')}
          </Link>
        </nav>
      </div>
    </header>
  );
}

