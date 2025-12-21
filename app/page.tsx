
import BackToTop from "@/components/elements/BackToTop";
import  Footer  from "@/components/elements/footer";
import FAQSection from "@/components/landing/FAQ";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection  from "@/components/landing/hero-section";
import {  Navbar } from "@/components/landing/navbar";
import PricingSection from "@/components/landing/pricing";
import SecuritySection from "@/components/landing/SecuritySection";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <SecuritySection />
        <PricingSection />
        <FAQSection />
        <BackToTop />
        {/* You can add a Pricing Section here later */}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
