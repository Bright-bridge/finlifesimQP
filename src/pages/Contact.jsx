import { Helmet } from 'react-helmet-async';
import Section from '../components/Section.jsx';

export default function Contact() {
  return (
    <div className="space-y-5">
      <Helmet>
        <title>联系我们 | Financial Life Simulator</title>
        <meta name="description" content="联系与反馈渠道。" />
      </Helmet>
      <Section><h1 className="text-3xl font-bold">联系我们</h1></Section>
      <Section delay={0.06}>
        <div className="glass rounded-2xl p-4 space-y-3">
          <p className="text-slate-300">如需反馈或合作，请发送邮件至：contact@example.com（示例）。</p>
          <p className="text-slate-300">我们欢迎关于可访问性、合规与性能方面的建议。</p>
        </div>
      </Section>
    </div>
  );
}

