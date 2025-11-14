import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-8 border-t border-white/10 bg-slate-900/60">
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-6 text-sm text-slate-300">
        <div>
          <div className="font-semibold mb-2 text-white">{t('common.appName')}</div>
          <p className="opacity-80">
            {t('footer.description')}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/articles">{t('nav.articles')}</Link>
          <Link to="/privacy">{t('about.privacy')}</Link>
          <Link to="/disclaimer">{t('about.disclaimer')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
        </div>
        {/* <div>
          <div className="mb-2 text-white">广告位</div>
          <div className="glass rounded-xl p-3 border border-dashed border-amber-500/60 text-amber-300">
            审核阶段请勿放真实广告脚本
          </div>
        </div> */}
      </div>
      <div className="border-t border-white/10 text-center py-3 text-xs text-slate-400">
        © {new Date().getFullYear()} Financial Life Simulator. All rights reserved.
      </div>
    </footer>
  );
}

