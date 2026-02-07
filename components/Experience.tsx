"use client";

import { Briefcase } from "lucide-react";

export default function Experience() {
  return (
    <div className="card">
      <div className="card-header">
        <Briefcase size={20} />
        Experience
      </div>

      <div className="experience-item">
        <span className="period">2022 - Present</span>
        <h4> ● Practice Owner</h4>
        <p className="company"> Emeren Refrigeration and Airconditioning Services</p>
      </div>

      <div className="experience-item">
        <span className="period">January 2024</span>
        <h4> ○ IT Helpdesk</h4>
        <p className="company">Billy Booms Computer</p>
      </div>
    </div>
  );
}
