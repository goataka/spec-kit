import { FAQ } from '../components/support/FAQ';
import { ContactForm } from '../components/support/ContactForm';
import { Documentation } from '../components/support/Documentation';

export function SupportPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#007CC0] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">サポート</h1>
          <p className="text-xl text-blue-100">
            お困りのことがあれば、お気軽にお問い合わせください
          </p>
        </div>
      </div>
      <Documentation />
      <FAQ />
      <ContactForm />
    </div>
  );
}
