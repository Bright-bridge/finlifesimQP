import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../utils/articles.js';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = getArticleById(id);

  if (!article) {
    navigate('/articles', { replace: true });
    return null;
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{article.title} | Financial Life Simulator</title>
        <meta name="description" content={`${article.title} - 理财教育内容`} />
      </Helmet>
      <nav className="text-sm">
        <Link className="underline text-slate-300" to="/articles" aria-label="返回文章列表">← 返回文章列表</Link>
      </nav>
      <article className="glass rounded-2xl p-5">
        <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
        <div className="text-slate-300 leading-7 whitespace-pre-line">{article.content}</div>
      </article>
    </div>
  );
}

