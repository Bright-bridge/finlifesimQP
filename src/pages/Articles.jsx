import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { articles } from '../utils/articles.js';
import Section from '../components/Section.jsx';

export default function Articles() {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <Helmet>
        <title>{t('articles.title')} | {t('common.appName')}</title>
        <meta name="description" content={t('articles.description')} />
      </Helmet>
      <Section><h1 className="text-3xl font-bold">{t('articles.title')}</h1></Section>
      <Section delay={0.06}>
        <div className="grid md:grid-cols-2 gap-5">
          {articles.map((a) => {
            const excerpt = a.content.length > 120 ? `${a.content.slice(0, 120)}…` : a.content;
            return (
              <article key={a.id} className="glass rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-2">
                  <Link className="hover:underline" to={`/articles/${a.id}`} aria-label={`${t('articles.readMore')} ${a.title}`}>
                    {a.title}
                  </Link>
                </h2>
                <p className="text-slate-300 leading-7 mb-3">{excerpt}</p>
                <Link
                  to={`/articles/${a.id}`}
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg"
                  aria-label={`${t('articles.readMore')} ${a.title}`}
                >
                  {t('articles.readMore')}
                </Link>
              </article>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

