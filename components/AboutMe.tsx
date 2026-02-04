import { User } from 'lucide-react'

export default function AboutMe() {
  return (
    <div className="card">
      <div className="card-header">
        <User className="card-header-icon" size={20} />
        About Me
      </div>
      <p className="about-text">
        I am a highly motivated BSIT student who thrives on learning, building,
        and solving complex problems through code. From desktop applications to
        mobile and database-driven systems, I focus on creating efficient,
        user-centered solutions while continuously pushing myself to grow both
        technically and personally.
      </p>
    </div>
  );
}
