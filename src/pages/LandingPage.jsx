import Footer from '../components/shared/Footer'
import FeaturesSection from '../components/shared/FeaturesSection'
import HeroSection from '../components/shared/HeroSection'
import Navbar from '../components/shared/Navbar'
import PricingSection from '../components/shared/PricingSection'

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}