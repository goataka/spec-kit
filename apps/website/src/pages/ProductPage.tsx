import { Hero } from '../components/product/Hero';
import { Features } from '../components/product/Features';
import { Pricing } from '../components/product/Pricing';
import { CallToAction } from '../components/product/CallToAction';

export function ProductPage() {
  return (
    <div>
      <Hero />
      <Features />
      <Pricing />
      <CallToAction />
    </div>
  );
}
