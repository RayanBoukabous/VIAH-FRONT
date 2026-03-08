import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
