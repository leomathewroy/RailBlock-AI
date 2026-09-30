import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RailwayTrack from '../components/landing/RailwayTrack';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import SolutionSection from '../components/landing/SolutionSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import DashboardPreview from '../components/landing/DashboardPreview';
import AssetSection from '../components/landing/AssetSection';
import ImpactSection from '../components/landing/ImpactSection';
import CTASection from '../components/landing/CTASection';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <Navbar />
      <RailwayTrack />
      
      <div style={{ paddingLeft: '80px', position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
        <AssetSection />
        <DashboardPreview />
        <ImpactSection />
        <CTASection />
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
