"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award } from "lucide-react";

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedCert ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedCert]);

  const certs = [
    {
      name: "AWS Cloud Practitioner Essentials",
      provider: "AWS Skill Builder • 2026",
      img: "/images/aws-certificate.png",
    },
    {
      name: "Python Essentials 1",
      provider: "CISCO • 2026",
      img: "/images/python-essentials-1-certificate.png",
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <Award size={20} className="card-header-icon" />
        Certifications
        <Link href="/certifications" className="view-all">
          View All &gt;
        </Link>
      </div>

      <div className="cert-grid">
        {certs.map((cert, idx) => (
          <div
            key={idx}
            className="cert-item"
            onClick={() => setSelectedCert(cert.img)}
          >
            <h4>{cert.name}</h4>
            <p className="cert-provider">{cert.provider}</p>
          </div>
        ))}
      </div>

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
    </div>
  );
}
