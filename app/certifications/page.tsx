"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const CERTS_PER_PAGE = 4;
const FADE_OUT_DURATION = 250;

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedCert ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedCert]);

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  const certifications = [
    {
      name: "Data Analyst Associate",
      provider: "DataCamp",
      year: "2026",
      img: "/images/certifications/associate-data-analyst-certificate.png",
    },
    {
      name: "SQL Associate",
      provider: "DataCamp",
      year: "2026",
      img: "/images/certifications/associate-sql-certificate.png",
    },
    {
      name: "Intermediate Java",
      provider: "DataCamp",
      year: "2026",
      img: "/images/certifications/intermediate-java-certificate.png",
    },
    {
      name: "Introduction to SQL",
      provider: "DataCamp",
      year: "2026",
      img: "/images/certifications/introduction-to-SQL-certificate.png",
    },
    {
      name: "Introduction to Java",
      provider: "DataCamp",
      year: "2026",
      img: "/images/certifications/introduction-to-java-certificate.png",
    },

    {
      name: "Introduction to Git",
      provider: "DataCamp",
      year: "2026",
      img: "/images/certifications/introduction-to-git-certificate.png",
    },

    {
      name: "AWS Cloud Practitioner Essentials",
      provider: "AWS Skill Builder",
      year: "2026",
      img: "/images/certifications/aws-certificate.png",
    },
    {
      name: "Python Essentials 1",
      provider: "CISCO",
      year: "2026",
      img: "/images/certifications/python-essentials-1-certificate.png",
    },
  ];

  const usePagination = certifications.length > 4;
  const totalPages = usePagination ? Math.ceil(certifications.length / CERTS_PER_PAGE) : 1;

  const displayedCerts = usePagination
    ? certifications.slice((currentPage - 1) * CERTS_PER_PAGE, currentPage * CERTS_PER_PAGE)
    : certifications;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || isAnimating) return;

    setIsAnimating(true);
    setIsFadingIn(false);

    animTimeoutRef.current = setTimeout(() => {
      setCurrentPage(page);
      setIsAnimating(false);
      setIsFadingIn(true);
      animTimeoutRef.current = setTimeout(() => {
        setIsFadingIn(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, FADE_OUT_DURATION);
    }, FADE_OUT_DURATION);
  };

  return (
    <div className="certifications-page">
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
                <p className="subtitle">
                  This shows my certifications, training, and achievements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="container">
          <div
            className={`certifications-grid ${
              isAnimating ? "grid-fade-out" : isFadingIn ? "grid-fade-in" : ""
            }`}
          >
            {displayedCerts.map((cert, idx) => (
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
                  <p className="cert-provider-year">
                    {cert.provider} • {cert.year}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {usePagination && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <span className="nav-arrow">‹</span> Prev
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next <span className="nav-arrow">›</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedCert && (
        <div className="modal active" onClick={() => setSelectedCert(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
  );
}