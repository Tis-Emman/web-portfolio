'use client'

import Image from 'next/image'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [hovered, setHovered] = useState(false)

  return (
    <header>
      <div className="container">
        <div className="header-content">
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
              className={`profile-pic main ${hovered ? 'hidden' : 'visible'}`}
            />
            <Image
              src="/images/profile_back.jpg"
              alt="Profile Hover"
              width={175}
              height={175}
              className={`profile-pic hover ${hovered ? 'visible' : 'hidden'}`}
            />
          </div>

          <div className="header-info">
            <h1>
              Emmanuel Dela Pena
              <span className="verified-badge">✓</span>
              <ThemeToggle />
            </h1>
            <p className="location">📍 Baliuag City, Bulacan, Philippines</p>
            <p className="tagline">Aspiring Full Stack Developer | Backend Developer</p>
            <div className="header-buttons">
              <a href="#" className="btn" target="_blank">📅 Schedule a Call</a>
              <a href="mailto:your.email@example.com" className="btn">✉️ Send Email</a>
              <a href="mailto:your.email@example.com" className="btn">✉ View my CV</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}