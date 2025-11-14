import { Helmet } from 'react-helmet-async';
import Section from '../components/Section.jsx';

export default function Disclaimer() {
  return (
    <div className="space-y-5">
      <Helmet>
        <title>免责声明 | Financial Life Simulator</title>
        <meta name="description" content="免责声明：仅为模拟与教育参考，不构成投资建议。" />
      </Helmet>
      <Section><h1 className="text-3xl font-bold">免责声明</h1></Section>
      <Section delay={0.06}>
        <div className="glass rounded-2xl p-4 space-y-3">
          <p>本工具仅为模拟器，不构成任何投资或法律建议。请在做出重要财务决策前咨询专业人士。</p>
          <p>所有内容均基于公开常识与简化模型，可能与实际情况存在差异。</p>
        </div>
      </Section>
    </div>
  );
}

