import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingStats from '@/components/landing/LandingStats';
import LandingModulesShowcase from '@/components/landing/LandingModulesShowcase';
import LandingCoursesPreview from '@/components/landing/LandingCoursesPreview';
import LandingExperience from '@/components/landing/LandingExperience';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import LandingPricing from '@/components/landing/LandingPricing';
import LandingFinalCTA from '@/components/landing/LandingFinalCTA';
import LandingFooter from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full max-w-[100vw] overflow-x-hidden scroll-smooth bg-slate-50 text-slate-950 dark:bg-[#0B0F1A] dark:text-white">
      <div className="relative overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(99,102,241,0.08),transparent_24%),radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.08),transparent_24%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(99,102,241,0.14),transparent_24%),radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.1),transparent_24%)]" />
        <LandingNavbar />
        <LandingHero />
        <LandingStats />
        <LandingFeatures />
        <LandingModulesShowcase />
        <LandingCoursesPreview />
        <LandingExperience />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFinalCTA />
        <LandingFooter />
      </div>
    </main>
  );
}
