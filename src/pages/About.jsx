import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Section from '../components/Section.jsx';

export default function About() {
  const { t } = useTranslation();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Financial Life Simulator',
    url: 'https://finlifesim.com'
  };
  return (
    <div className="space-y-5">
      <Helmet>
        <title>{t('about.title')} | {t('common.appName')}</title>
        <meta name="description" content={t('about.intro1')} />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>
      <Section><h1 className="text-3xl font-bold">{t('about.title')}</h1></Section>
      <Section delay={0.06}>
        <div className="glass rounded-2xl p-4 space-y-6">
          <p className="text-slate-300">
            {t('about.intro1')}
          </p>
          <p className="text-slate-300">
            {t('about.intro2')}
          </p>

          <div>
            <h2 className="text-xl font-semibold text-amber-300 mb-3">{t('about.philosophy')}</h2>
            <p className="text-slate-300 mb-3">
              {t('about.philosophy1')}
            </p>
            <p className="text-slate-300 mb-3">{t('about.philosophy2')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
              <li>{t('about.philosophy3')}</li>
              <li>{t('about.philosophy4')}</li>
              <li>{t('about.philosophy5')}</li>
              <li>{t('about.philosophy6')}</li>
            </ul>
            <p className="text-slate-300 mt-3">
              {t('about.philosophy7')}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-amber-300 mb-3">{t('about.features')}</h2>
            <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
              <li>{t('about.feature1')}</li>
              <li>{t('about.feature2')}</li>
              <li>{t('about.feature3')}</li>
              <li>{t('about.feature4')}</li>
              <li>{t('about.feature5')}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-amber-300 mb-3">{t('about.why')}</h2>
            <p className="text-slate-300 mb-3">
              {t('about.why1')}
            </p>
            <p className="text-slate-300 mb-3">{t('about.why2')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
              <li>{t('about.why3')}</li>
              <li>{t('about.why4')}</li>
              <li>{t('about.why5')}</li>
              <li>{t('about.why6')}</li>
            </ul>
            <p className="text-slate-300 mt-3">{t('about.why7')}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-amber-300 mb-3">{t('about.limitations')}</h2>
            <p className="text-slate-300">
              {t('about.limitation1')}
            </p>
            <p className="text-slate-300 mt-2">
              {t('about.limitation2')}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex gap-4 text-sm">
            <Link to="/privacy" className="text-amber-300 hover:text-amber-400 underline">{t('about.privacy')}</Link>
            <Link to="/disclaimer" className="text-amber-300 hover:text-amber-400 underline">{t('about.disclaimer')}</Link>
          </div>
        </div>
      </Section>
    </div>
  );
}

