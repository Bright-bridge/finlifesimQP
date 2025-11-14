import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Section from '../components/Section.jsx';

export default function About() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Financial Life Simulator',
    url: 'https://yourdomain.example'
  };
  return (
    <div className="space-y-5">
      <Helmet>
        <title>关于 | Financial Life Simulator</title>
        <meta name="description" content="项目介绍、定位与合规说明。" />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>
      <Section><h1 className="text-3xl font-bold">关于</h1></Section>
      <Section delay={0.06}>
      <div className="glass rounded-2xl p-4">
        <p className="text-slate-300">
          本项目旨在提供教育与规划参考，帮助用户理解预算、现金流与风险管理的重要性。
          我们不提供投资建议或买卖推荐，所有模拟结果均基于输入参数与简化模型。
        </p>
        <div className="mt-4 flex gap-4 text-sm">
          <Link to="/privacy" className="underline">隐私政策</Link>
          <Link to="/disclaimer" className="underline">免责声明</Link>
        </div>
      </div>
      </Section>
    </div>
  );
}

