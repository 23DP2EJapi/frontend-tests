import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import CategoriesSection from "@/components/home/CategoriesSection";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedListings />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
