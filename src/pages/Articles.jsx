import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { articles } from '../utils/articles.js';
import Section from '../components/Section.jsx';

export default function Articles() {
  return (
    <div className="space-y-5">
      <Helmet>
        <title>理财文章 | Financial Life Simulator</title>
        <meta name="description" content="预算、被动收入、复利与储蓄策略等原创理财内容，用于教育用途。" />
      </Helmet>
      <Section><h1 className="text-3xl font-bold">理财文章</h1></Section>
      <Section delay={0.06}>
        <div className="grid md:grid-cols-2 gap-5">
        {articles.map((a) => {
          const excerpt = a.content.length > 120 ? a.content.slice(0, 120) + '…' : a.content;
          return (
              <article key={a.id} className="glass rounded-2xl p-4">
              <h2 className="text-xl font-semibold mb-2">
                <Link className="hover:underline" to={`/articles/${a.id}`} aria-label={`查看 ${a.title}`}>
                  {a.title}
                </Link>
              </h2>
              <p className="text-slate-300 leading-7 mb-3">{excerpt}</p>
              <Link
                to={`/articles/${a.id}`}
                className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg"
                aria-label={`阅读 ${a.title} 详情`}
              >
                阅读详情
              </Link>
            </article>
          );
        })}
        </div>
      </Section>
    </div>
  );
}

