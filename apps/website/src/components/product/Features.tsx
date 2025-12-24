const features = [
  {
    title: '簡単な打刻',
    description: 'ワンクリックで出勤・退勤を記録。スマートフォンからでも簡単に打刻できます。',
    icon: '⏱️',
  },
  {
    title: '管理者ダッシュボード',
    description: '全従業員の勤怠状況を一目で確認。リアルタイムで勤務状況を把握できます。',
    icon: '📊',
  },
  {
    title: 'クラウドベース',
    description: 'どこからでもアクセス可能。データは安全にクラウドに保存されます。',
    icon: '☁️',
  },
  {
    title: '多言語対応',
    description: '日本語と英語に対応。グローバルチームでも安心して利用できます。',
    icon: '🌏',
  },
  {
    title: 'セキュア',
    description: 'AWS基盤で安全性を確保。データの暗号化と定期バックアップを実施。',
    icon: '🔒',
  },
  {
    title: 'レスポンシブデザイン',
    description: 'PC、タブレット、スマートフォンなど、あらゆるデバイスで最適な表示。',
    icon: '📱',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">主な機能</h2>
          <p className="text-xl text-gray-600">
            勤怠管理に必要な全ての機能を提供
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
