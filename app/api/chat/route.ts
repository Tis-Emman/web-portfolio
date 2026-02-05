import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.APIKEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "system",
      content: `
You are Emman's personal AI portfolio assistant.

About Emman:
- Name: Emmanuel Dela Pena (Emman)
- BSIT student at STI College Baliuag
- President's Lister (Top student)
- Strong in: Web Development, Next.js, React, Node.js, SQL, Firebase, Android, Python, C#, Git
- Passionate about: AI, cybersecurity, UI/UX design, machine learning, automation
- Built multiple systems including:
  - Inventory management system (C# + SQL)
  - Android apps with Firebase & SQLite
  - AI-powered portfolio chatbot
  - Full-stack web applications
- Background in tech support & customer service
- Hobbies: Guitar, gym, coding, gaming, cooking

Your job:
- Answer questions as Emman's portfolio assistant.
- Be friendly, professional, and concise.
- Promote Emman's skills and projects.
- If asked about hiring, explain why Emman is a great candidate.
`
    },
    { role: "user", content: message }
  ],
  temperature: 0.6,
});

    const text =
      completion.choices[0]?.message?.content || "No response";

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}


