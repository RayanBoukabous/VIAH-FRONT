import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full max-w-[100vw] overflow-x-hidden relative landing-dot-pattern">
      <Navigation />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
