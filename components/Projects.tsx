import Image from 'next/image'

export default function Projects() {
  return (
    <div>
      <div className="projects-header">
        <h2>Projects</h2>
        <a href="#" className="view-all">View All &gt;</a>
      </div>
      <div className="projects-grid">
        <div className="project-card">
          <Image
            src="/images/cozy-crate.png"
            alt="Project 1"
            width={600}
            height={400}
            className="project-image"
          />
          <div className="project-content">
            <h3>Cozy Crate E-Commerce</h3>
            <p className="project-description">A Java GUI Swing Program that uses SQLITE database for CRUD operations </p>
            <a href="#" className="project-link" target="_blank">View Project</a>
          </div>
        </div>
        <div className="project-card">
          <Image
            src="/images/e-tour-travels.png"
            alt="Project 2" 
            width={600}
            height={400}
            className="project-image"
          />
          <div className="project-content">
            <h3>E Tour Travels</h3>
            <p className="project-description">A static website for our first year, first sem project</p>
            <a href="#" className="project-link" target="_blank">View Project</a>
          </div>
        </div>
        <div className="project-card">
          <Image
            src="/images/sinervet.png"
            alt="Project 2" 
            width={600}
            height={400}
            className="project-image"
          />
          <div className="project-content">
            <h3>Sinervet VetHub</h3>
            <p className="project-description">A website for veterinary at local town</p>
            <a href="#" className="project-link" target="_blank">View Project</a>
          </div>
        </div>
      </div>
    </div>
  )
}
