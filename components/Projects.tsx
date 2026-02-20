import Image from 'next/image'
import Link from 'next/link'

export default function Projects() {
  return (
    <section className="projects-section">
      <div className="container">
        <div className="projects-container-wrapper">
          <div className="projects-header">
            <h2>Projects</h2>
            <Link href="/projects" className="view-all">
              View All
              <span> →</span>
            </Link>
          </div>
          
          <div className="projects-grid">
            {/* Project Card 1: Cozy Crate E-Commerce */}
            <div className="project-card">
              <Image
                src="/images/projects/cozy-crate.png"
                alt="Cozy Crate E-Commerce"
                width={600}
                height={400}
                className="project-image"
              />
              <div className="project-content">
                <h3>Cozy Crate E-Commerce</h3>
                <p className="project-description">
                  A Java GUI Swing Program that uses SQLITE database for CRUD operations
                </p>
                <a href="https://github.com/Tis-Emman/Cozy_Crave_Ecommerce" className="project-link" target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              </div>
            </div>

            {/* Project Card 2: E Tour Travels */}
            <div className="project-card">
              <Image
                src="/images/projects/emeren_inventory.png"
                alt="EMEREN Inventory System" 
                width={600}
                height={400}
                className="project-image"
              />
              <div className="project-content">
                <h3>EMEREN Inventory System</h3>
                <p className="project-description">
                  An inventory management system for a local business.
                </p>
                <a href="https://github.com/Tis-Emman/PetSineVet" className="project-link" target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              </div>
            </div>

            {/* Project Card 3: Sinervet VetHub */}
            <div className="project-card">
              <Image
                src="/images/projects/sinervet.png"
                alt="Sinervet VetHub" 
                width={600}
                height={400}
                className="project-image"
              />
              <div className="project-content">
                <h3>Sinervet VetHub</h3>
                <p className="project-description">
                  A comprehensive website for veterinary services at local town. Features appointment booking and pet records.
                </p>
                <a href="https://github.com/Tis-Emman/PetSineVet" className="project-link" target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              </div>
            </div>

             <div className="project-card">
              <Image
                src="/images/projects/korean_express.png"
                alt="E Tour Travels" 
                width={600}
                height={400}
                className="project-image"
              />
              <div className="project-content">
                <h3>Korean Express</h3>
                <p className="project-description">
                  A modern Korean grocery delivery platform offering authentic ingredients and fast, reliable service.
                </p>
                <a href="https://github.com/Tis-Emman/KoreanExpress" className="project-link" target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}