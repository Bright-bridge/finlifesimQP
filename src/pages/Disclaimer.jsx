import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Section from '../components/Section.jsx';

export default function Disclaimer() {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <Helmet>
        <title>{t('disclaimer.title')} | {t('common.appName')}</title>
        <meta name="description" content={t('disclaimer.title')} />
      </Helmet>
      <Section><h1 className="text-3xl font-bold">{t('disclaimer.title')}</h1></Section>
      <Section delay={0.06}>
        <div className="glass rounded-2xl p-4 space-y-4 whitespace-pre-line">
          <p className="text-slate-300">{t('disclaimer.content')}</p>
        </div>
      </Section>
    </div>
  );
}

