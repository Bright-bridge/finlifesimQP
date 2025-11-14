import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Section from '../components/Section.jsx';
import { ShieldCheck, LineChart, Coins } from 'lucide-react';

export default function Home() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Financial Life Simulator',
    url: 'https://yourdomain.example',
    description:
      '输入储蓄与支出，模拟辞职后资金可支撑时间并生成理财建议（仅供参考）'
  };
  return (
    <div className="space-y-6">
      <Helmet>
        <title>首页 | Financial Life Simulator - 理财教育与预算规划</title>
        <meta
          name="description"
          content="个人财务生存与理财模拟器：输入储蓄、支出、被动收入与年化收益率，生成未来月度资金变化与理财建议，适用于预算规划与风险教育。"
        />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>
      <Section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Financial Life Simulator</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Financial Life Simulator 是一款面向个人用户的财务模拟工具。输入你的储蓄、每月支出与被动收入，
          系统将基于可配置的年化收益与随机生活事件，模拟未来数月资金变化并提供量化的理财建议。
          该工具仅用于教育与规划参考，不构成投资建议。
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            to="/calculator"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-3 rounded-lg transition transform hover:scale-[1.02]"
          >
            立即开始
          </Link>
          <Link
            to="/articles"
            className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            阅读理财文章
          </Link>
        </div>
      </Section>
      <Section className="max-w-5xl mx-auto" delay={0.08}>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-semibold text-xl md:text-2xl">为什么选择本工具</h2>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {[
              {
                icon: ShieldCheck,
                title: '合规与透明',
                desc: '清晰的数据来源标记、隐私与免责声明页面，更适用于审核与教育用途。'
              },
              {
                icon: LineChart,
                title: '量化可视化',
                desc: '月度结余、趋势与结构图一体展示，帮助建立现金流与风险的直观认知。'
              },
              {
                icon: Coins,
                title: '贴近现实',
                desc: '固定支出、投资收益与随机事件并行模拟，支持不同风险偏好配置。'
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

