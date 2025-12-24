import { useState } from 'react';

const faqs = [
  {
    question: 'システムの導入にどのくらい時間がかかりますか？',
    answer:
      'アカウント登録後、すぐにご利用いただけます。従業員の登録と設定は約30分程度で完了します。',
  },
  {
    question: 'スマートフォンから打刻できますか？',
    answer:
      'はい、レスポンシブデザインを採用しており、スマートフォンやタブレットからも快適に打刻できます。',
  },
  {
    question: 'データのバックアップはどうなっていますか？',
    answer:
      'AWS DynamoDBを使用しており、データは自動的に複数のリージョンにバックアップされます。',
  },
  {
    question: '複数の拠点で利用できますか？',
    answer:
      'はい、クラウドベースなので世界中のどこからでもアクセス可能です。',
  },
  {
    question: 'サポート体制はどうなっていますか？',
    answer:
      'メールサポートを標準で提供しています。ビジネスプラン以上では優先サポートをご利用いただけます。',
  },
  {
    question: '無料プランの制限は何ですか？',
    answer:
      '無料プランは最大10ユーザーまでご利用いただけます。基本的な打刻機能と管理機能は全てご利用可能です。',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          よくある質問
        </h2>
        <div className="space-y-4 max-w-3xl">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900">
                  {faq.question}
                </span>
                <span className="text-2xl text-[#007CC0]">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
