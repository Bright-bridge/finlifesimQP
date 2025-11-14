import { Helmet } from 'react-helmet-async';
import Section from '../components/Section.jsx';

export default function Privacy() {
  return (
    <div className="space-y-5">
      <Helmet>
        <title>隐私政策 | Financial Life Simulator</title>
        <meta name="description" content="隐私政策与数据使用说明。" />
      </Helmet>
      <Section><h1 className="text-3xl font-bold">隐私政策</h1></Section>
      <Section delay={0.06}>
        <div className="glass rounded-2xl p-4 space-y-3">
          <p>我们不会出售您的个人数据。本网站使用本地存储与基本分析用于改善产品体验。生成报告仅保存在用户设备或按用户授权上传。</p>
          <p>我们可能收集匿名化访问数据用于改进产品，但不会用于个性化广告定向。</p>
          <p>如对隐私有疑问，请通过“联系我们”页面与我们沟通。</p>
        </div>
      </Section>
    </div>
  );
}

