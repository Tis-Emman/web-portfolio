import Header from '@/components/Header'
import AboutMe from '@/components/AboutMe'
import Education from '@/components/Education'
import TechStack from '@/components/TechStack'
import Certifications from '@/components/Certifications'
import BeyondScreen from '@/components/BeyondScreen'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Recommendations from '@/components/Recommendations'
import Contact from '@/components/Contact'
import ScrollIndicator from '@/components/ScrollIndicator'
import ChatButton from '@/components/ChatButton'
import ThemeToggle from '@/components/ThemeToggle'  // Add this import

export default function Home() {
  return (
    <>
      <ScrollIndicator />

      <Header />
      
      <div className="container">
        <div className="main-grid">
          {/* Left Column */}
          <div className="left-column">
            <AboutMe />
            <Education />
            <TechStack />
            <Certifications />
            <BeyondScreen></BeyondScreen>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <Experience />
            <Projects />
            <Contact />
          </div>
        </div>
      </div>

      <footer style={{marginTop: 50}}>
        <p>&copy; 2026 Emmanuel P. Dela Pena. All Rights Reserved.</p>
        <p>Developed in Baliuag City, Bulacan, Philippines</p>
      </footer>

      <ChatButton />
      
    </>
  )
  
}

