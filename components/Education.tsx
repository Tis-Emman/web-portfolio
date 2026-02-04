"use client";

import { GraduationCap } from "lucide-react";

export default function Education() {
  return (
    <div className="card">
      <div className="card-header">
        <GraduationCap size={20} />
        Education
      </div>

      <div className="education-item">
        <h3>BS in Information Technology</h3>
        <p className="institution">STI College Baliuag</p>
        <p className="period">2024 - 2028</p>
      </div>
    </div>
  );
}
