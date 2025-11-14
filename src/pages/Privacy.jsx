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
        <div className="glass rounded-2xl p-5 space-y-4 leading-7 text-slate-200">
          <p className="text-sm text-slate-400">生效日期：2025年11月13日</p>
          <p>
            感谢您使用本网站（以下简称“本网站”或“我们”）。我们非常重视您的隐私与数据安全。本隐私政策旨在说明我们如何收集、使用、存储和保护您的信息。
          </p>

          <h2 className="text-xl font-semibold mt-4">一、我们收集的信息</h2>
          <p>在您使用本网站的过程中，我们不会收集任何可识别您个人身份的信息（如姓名、身份证号、联系方式等）。</p>
          <p>我们仅在您自愿填写时，收集以下非个人信息，用于计算和模拟您的财务状况：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>当前储蓄金额</li>
            <li>每月或每日支出金额</li>
            <li>每月收入或被动收入（可选）</li>
            <li>投资收益率（可选）</li>
          </ul>
          <p>所有数据仅用于在您当前浏览会话中进行理财模拟与展示结果，不会被永久保存或传输至任何第三方服务器。</p>

          <h2 className="text-xl font-semibold mt-4">二、信息的使用方式</h2>
          <p>您提供的数据仅用于以下目的：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>在浏览器端（本地）计算理财模拟结果；</li>
            <li>向您展示可视化结果和财务趋势预测；</li>
            <li>改进网站功能与用户体验（仅使用匿名的统计数据）。</li>
          </ul>
          <p>我们不会基于您的输入进行广告推送、用户画像分析，或与第三方共享数据。</p>

          <h2 className="text-xl font-semibold mt-4">三、信息的存储与安全</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>您输入的数据仅暂存在浏览器内存中（或本地缓存中），不会被上传至服务器。</li>
            <li>一旦您刷新或关闭页面，数据将自动清除。</li>
            <li>我们不会建立任何用户账户或数据档案。</li>
          </ul>

          <h2 className="text-xl font-semibold mt-4">四、第三方服务</h2>
          <p>本网站可能使用以下第三方服务来改进性能或统计访问情况：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>网站托管服务（如 Vercel、Netlify 或 GitHub Pages）；</li>
            <li>匿名访问分析（如 Google Analytics，仅记录访问次数和页面浏览量，不关联个人数据）。</li>
          </ul>
          <p>我们仅选择符合数据保护要求的第三方服务，并确保其不会访问您的输入数据。</p>

          <h2 className="text-xl font-semibold mt-4">五、您的权利</h2>
          <p>由于我们不收集或保存可识别个人身份的数据，因此您无需执行数据删除或导出操作。若您有任何关于隐私或数据安全的问题，可通过以下方式联系我们。</p>

          <h2 className="text-xl font-semibold mt-4">六、联系我们</h2>
          <p>如您对本隐私政策有任何疑问、建议或投诉，请联系我们：</p>
          <p>
            📧 联系邮箱：<span className="text-amber-300">support@yourdomain.com</span>
          </p>
          <p>
            🌐 网站地址：<span className="text-amber-300">https://finlifesim.com</span>
          </p>

          <h2 className="text-xl font-semibold mt-4">七、政策更新</h2>
          <p>我们可能会不时更新本隐私政策。更新后的版本将在本页面上发布，并立即生效。</p>
        </div>
      </Section>
    </div>
  );
}

