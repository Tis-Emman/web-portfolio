"use client";

import { FaLinkedin, FaGithub, FaFacebook, FaInstagram } from "react-icons/fa";
import { Mail, PhoneCall } from "lucide-react";

export default function Contact() {
  return (
    <div className="contact-section">
      <h2>Let's work together.</h2>
      <p className="contact-description">
        Describe your availability and the types of projects you're interested in. What services do you offer? How can people work with you?
      </p>

      {/* Get in Touch Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h4
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          GET IN TOUCH
        </h4>
        <div className="contact-grid">
          <div className="contact-method flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" /> {/* Lucide Mail Icon */}
            <div>
              <h4>Email</h4>
              <a href="mailto:emmandelapena755@gmail.com">emmandelapena755@gmail.com</a>
            </div>
          </div>
          <div className="contact-method flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-green-500" /> {/* Lucide Phone Icon */}
            <div>
              <h4>Let's Talk</h4>
              <a href="https://calendly.com/emmandelapena755" target="_blank">Schedule a Call</a>
            </div>
          </div>
        </div>
      </div>

      {/* Follow Me Section */}
      <div>
        <h4
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          FOLLOW ME
        </h4>
        <div className="social-links flex gap-4">
          <a href="https://www.linkedin.com/in/emmanuel-dela-pena-328433347/" className="social-icon text-blue-600 text-2xl" title="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://github.com/Tis-Emman" className="social-icon text-gray-800 text-2xl" title="GitHub">
            <FaGithub />
          </a>
          <a href="https://www.facebook.com/emman.delapena.144" className="social-icon text-blue-700 text-2xl" title="Facebook">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/emman.delapena.50" className="social-icon text-pink-500 text-2xl" title="Instagram">
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>
  );
}
