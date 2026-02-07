"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Check, Calendar, Mail, MapPin, FileText, Users } from "lucide-react";

export default function Header() {
  const [hovered, setHovered] = useState(false);

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
                className="btn flex items-center gap-1"
              >
                <Users className="w-4 h-4" />
                Community Hub
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

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=your.email@example.com&su=CV Request&body=Hi Emmanuel,"
                className="btn flex items-center gap-1"
                target="_blank"
              >
                <FileText className="w-4 h-4" />
                View my CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}