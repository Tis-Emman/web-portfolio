'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = selectedCert ? "hidden" : "auto"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [selectedCert])

  const certifications = [

    {
      name: "Data Analyst Associate",
      provider: "DataCamp",
      year: "2026",
      img: "/images/certifications/associate-data-analyst-certificate.png"
    },

    {
      name: "AWS Cloud Practitioner Essentials",
      provider: "AWS Skill Builder",
      year: "2026",
      img: "/images/certifications/aws-certificate.png"
    },
    {
      name: "Python Essentials 1",
      provider: "CISCO",
      year: "2026",
      img: "/images/certifications/python-essentials-1-certificate.png"
    },

    {
      name: "Introduction to SQL",
      provider: "DataCamp",
      year: "2026",
      img: "/images/certifications/introduction-to-SQL-certificate.png"
    }
    
  ]

  return (
    <div className="certifications-page">
      {/* Main content area */}
      <div className="certifications-content">
        {/* Header */}
        <div className="certifications-header">
          <div className="container">
            <Link href="/" className="back-button">
              ← Back to Home
            </Link>
            
            <div className="header-content-certs">
              <div>
                <h1>Certifications</h1>
                <p className="subtitle">This shows my certifications, training, and achievements.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="container">
          <div className="certifications-grid">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="certification-card"
                onClick={() => setSelectedCert(cert.img)}
              >
                <div className="cert-image-wrapper">
                  <img src={cert.img} alt={cert.name} className="cert-image" />
                </div>
                <div className="cert-info">
                  <h3>{cert.name}</h3>
                  <p className="cert-provider-year">{cert.provider} • {cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedCert && (
        <div className="modal active" onClick={() => setSelectedCert(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close-modal" onClick={() => setSelectedCert(null)}>
              &times;
            </span>
            <img src={selectedCert} alt="Certificate" />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <p>&copy; 2026 Emmanuel Dela Pena. All Rights Reserved.</p>
        <p>Developed in Baliuag City, Bulacan, Philippines</p>
      </footer>
    </div>
  )
}