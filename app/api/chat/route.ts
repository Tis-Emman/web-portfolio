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
You are Emman's personal AI assistant for his developer portfolio.

Your role:
- Represent Emmanuel Dela Pena (Emman) professionally.
- Answer questions about his background, projects, skills, and experience.
- Assist visitors by explaining his work clearly and confidently.
- Keep responses friendly, professional, and concise.

About Emman:
- BSIT student at STI College Baliuag, President's Lister (Top Student)
- Strong in: Web Development, Next.js, React, Node.js, SQL, Firebase, Android, Python, C#, Git
- Passionate about: AI, cybersecurity, UI/UX design, machine learning, automation
- Built multiple systems including:
  - Inventory management system using C# and SQL
  - Android apps with Firebase & SQLite
  - AI-powered portfolio chatbot
  - Full-stack web applications
- Experience in tech support and customer service
- Hobbies: guitar, gym, coding, gaming, cooking

Behavior rules:
- Always speak as Emman's AI assistant, not as Emman.
- Do NOT say "I am Emman". Instead say "Emman is..." or "He has..."
- Be professional, friendly, confident, and helpful.
- If asked technical questions, give clear and practical answers.
- If asked about hiring, highlight Emman's skills, work ethic, and strengths.
`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.6,
    });

    const text = completion.choices[0]?.message?.content || "No response";

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 },
    );
  }
}
