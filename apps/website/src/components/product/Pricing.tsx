const plans = [
  {
    name: 'スターター',
    price: '¥0',
    period: '永久無料',
    features: [
      '最大10ユーザー',
      '基本的な打刻機能',
      '管理者ダッシュボード',
      'メールサポート',
    ],
    highlight: false,
  },
  {
    name: 'ビジネス',
    price: '¥500',
    period: 'ユーザー/月',
    features: [
      '無制限ユーザー',
      '全ての機能',
      '優先サポート',
      'カスタムレポート',
      'API アクセス',
    ],
    highlight: true,
  },
  {
    name: 'エンタープライズ',
    price: 'お問い合わせ',
    period: 'カスタム',
    features: [
      '専任アカウントマネージャー',
      'カスタム統合',
      'SLA保証',
      'オンプレミス対応',
      '24時間サポート',
    ],
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">料金プラン</h2>
          <p className="text-xl text-gray-600">
            あなたのチームに最適なプランを選択
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-lg ${
                plan.highlight
                  ? 'bg-[#007CC0] text-white shadow-2xl scale-105'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="mb-6">
                <div className="text-4xl font-bold">{plan.price}</div>
                <div
                  className={`text-sm ${
                    plan.highlight ? 'text-blue-100' : 'text-gray-600'
                  }`}
                >
                  {plan.period}
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.highlight
                    ? 'bg-white text-[#007CC0] hover:bg-gray-100'
                    : 'bg-[#007CC0] text-white hover:bg-[#005A8D]'
                }`}
              >
                {plan.name === 'エンタープライズ' ? 'お問い合わせ' : '始める'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
