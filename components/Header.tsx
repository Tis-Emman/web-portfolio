"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Check, Calendar, Mail, MapPin, FileText, Users, X, AlertCircle } from "lucide-react";

export default function Header() {
  const [hovered, setHovered] = useState(false);
  const [showCvPopup, setShowCvPopup] = useState(false);

  return (
    <header>
      <div className="container">
        <div className="header-content">
          {/* Profile Images */}
          <div
            className="profile-pic-wrapper"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
                          
            <Image
              src="/images/profile_new.jpg"
              alt="Profile"
              width={175}
              height={175}
              className={`profile-pic main ${hovered ? "hidden" : "visible"}`}
            />
            <Image
              src="/images/profile_back.jpg"
              alt="Profile Hover"
              width={175}
              height={175}
              className={`profile-pic hover ${hovered ? "visible" : "hidden"}`}
            />
          </div>

          {/* Info Section */}
          <div className="header-info">
            <h1>
              Emmanuel Dela Pena

            </h1>

            <p className="location">
              <MapPin className="location-icon" />
              Baliuag City, Bulacan, Philippines
            </p>

            <p className="tagline">
              Aspiring Full Stack Developer | Backend Developer
            </p>
            <ThemeToggle />
            {/* Buttons */}
            <div className="header-buttons flex gap-3 mt-4">
              <Link
                href="/community"
                className="btn btn-join-community flex"
              >
                <Users className="w-4 h-4" />
                Join My Community
              </Link>

              <a
                href="https://calendly.com/emmandelapena755"
                className="btn flex items-center gap-1"
                target="_blank"
              >
                <Calendar className="w-4 h-4" />
                Schedule a Call
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=emmandelapena755@gmail.com"
                className="btn flex items-center gap-1"
                target="_blank"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>

              <button
                onClick={() => setShowCvPopup(true)}
                className="btn flex items-center gap-1"
              >
                <FileText className="w-4 h-4" />
                View my CV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CV Not Available Popup */}
      <div className={`cv-popup-modal ${showCvPopup ? 'active' : ''}`}>
        <div className="modal-backdrop" onClick={() => setShowCvPopup(false)} />
        <div className="cv-popup-content">
          <button
            className="close-popup-btn"
            onClick={() => setShowCvPopup(false)}
          >
            <X size={20} />
          </button>
          <div className="cv-popup-icon">
            <AlertCircle size={48} />
          </div>
          <h3>CV Not Available Yet</h3>
          <p>My CV is currently being updated and will be available soon. Please check back later or feel free to contact me directly.</p>
          <div className="cv-popup-actions">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=emmandelapena755@gmail.com&su=CV Request&body=Hi Emmanuel, I would like to request your CV."
              className="btn-request-cv"
              target="_blank"
              onClick={() => setShowCvPopup(false)}
            >
              <Mail size={16} />
              Request CV via Email
            </a>
            <button
              className="btn-close-popup"
              onClick={() => setShowCvPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}