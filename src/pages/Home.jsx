import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Section from '../components/Section.jsx';
import { ShieldCheck, LineChart, Coins } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Financial Life Simulator',
    url: 'https://finlifesim.com',
    description:
      '输入储蓄与支出，模拟辞职后资金可支撑时间并生成理财建议（仅供参考）'
  };
  return (
    <div className="space-y-6">
      <Helmet>
        <title>{t('home.title')} | {t('common.appName')}</title>
        <meta
          name="description"
          content={t('home.subtitle')}
        />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>
      <Section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('common.appName')}</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            to="/calculator"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-3 rounded-lg transition transform hover:scale-[1.02]"
          >
            {t('home.startNow')}
          </Link>
          <Link
            to="/articles"
            className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            {t('home.readArticles')}
          </Link>
        </div>
      </Section>
      <Section className="max-w-5xl mx-auto" delay={0.08}>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-semibold text-xl md:text-2xl">{t('home.whyChoose')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {[
              {
                icon: ShieldCheck,
                title: t('home.compliance'),
                desc: t('home.complianceDesc')
              },
              {
                icon: LineChart,
                title: t('home.visualization'),
                desc: t('home.visualizationDesc')
              },
              {
                icon: Coins,
                title: t('home.realistic'),
                desc: t('home.realisticDesc')
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl p-[1.5px] bg-gradient-to-br from-brand.purple/60 via-amber-500/50 to-transparent"
                >
                  <div className="glass rounded-3xl p-6 w-[260px] h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-soft">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-white/10 grid place-items-center">
                        <Icon size={26} className="text-amber-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg mb-2">{f.title}</div>
                        <p className="text-sm text-slate-300 leading-6">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>
    </div>
  );
}

