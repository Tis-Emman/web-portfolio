'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: "Cozy Crate E-Commerce",
      description: "A Java GUI Swing Program that uses SQLITE database for CRUD operations. Full-featured e-commerce application with inventory management, shopping cart, and order processing.",
      image: "/images/projects/cozy-crate.png",
      technologies: ["Java", "Swing", "SQLite", "JDBC"],
      liveLink: "", // Add your live link if available
      githubLink: "" // Add your GitHub link if available
    },
    {
      id: 2,
      title: "E Tour Travels",
      description: "A static website for our first year, first sem project. Beautiful travel booking website showcasing various destinations and tour packages with responsive design.",
      image: "/images/projects/e-tour-travels.png",
      technologies: ["HTML", "CSS", "JavaScript"],
      liveLink: "", // Add your live link
      githubLink: "" // Add your GitHub link
    },
    {
      id: 3,
      title: "Sinervet VetHub",
      description: "A comprehensive website for veterinary services at local town. Features appointment booking, pet records management, and service information for pet owners.",
      image: "/images/projects/sinervet.png",
      technologies: ["React", "Node.js", "MongoDB"],
      liveLink: "", // Add your live link
      githubLink: "" // Add your GitHub link
    },

    {
      id: 4,
      title: "Korean Express",
      description: "                  A modern Korean grocery delivery platform offering authentic ingredients and fast, reliable service.",
      image: "/images/projects/korean_express.png",
      technologies: ["React", "Node.js", "MongoDB"],
      liveLink: "", // Add your live link
      githubLink: "" // Add your GitHub link
    }
  ]

  return (
    <div className="projects-page">
      {/* Main content area */}
      <div className="projects-content">
        {/* Header */}
        <div className="projects-header">
          <div className="container">
            <Link href="/" className="back-button">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            
            <div className="header-content-projects">
              <div>
                <h1>All Projects</h1>
                <p className="subtitle">
                  A comprehensive collection of my work spanning web development, 
                  desktop applications, and full-stack solutions.
                </p>
              </div>
              <div className="projects-stats">
                <div className="stat-item">
                  <span className="stat-number">{projects.length}</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">12+</span>
                  <span className="stat-label">Technologies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="container">
          <div className="all-projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card-full">
                <div className="project-image-wrapper">
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    width={600}
                    height={400}
                    className="project-image-full"
                  />
                  <div className="project-overlay">
                    <div className="project-links">
                      {project.liveLink && (
                        <a 
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn"
                          aria-label="View live project"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                      {project.githubLink && (
                        <a 
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn"
                          aria-label="View GitHub repository"
                        >
                          <Github size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="project-info-full">
                  <h3>{project.title}</h3>
                  <p className="project-description-full">{project.description}</p>
                  
                  <div className="project-technologies">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p>&copy; 2026 Emmanuel Dela Pena. All Rights Reserved.</p>
        <p>Developed in Baliuag City, Bulacan, Philippines</p>
      </footer>
    </div>
  )
}