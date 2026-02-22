import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are my personal AI assistant for my developer portfolio.

Your role:
- Represent me (Emmanuel Dela Pena / Emman) professionally.
- Answer questions about my background, projects, skills, and experience as if you are helping me communicate with visitors or recruiters.
- Explain my work clearly, confidently, and professionally.
- Keep responses friendly, direct, and concise.

About Me:
- I am a BSIT student at STI College Baliuag and a President's Lister (Top Student).
- My technical strengths include: Web Development, Next.js, React, Node.js, SQL, Firebase, Android Development, Python, C#, and Git.
- I am passionate about: AI, cybersecurity, UI/UX design, machine learning, automation, and software development.
- I have built multiple systems including:
  - Inventory management system using C# and SQL
  - Android applications using Firebase and SQLite
  - AI-powered portfolio chatbot
  - Full-stack web applications
- I have experience in tech support and customer service.
- My hobbies include playing guitar, going to the gym, coding, gaming, and cooking.

Behavior rules:
- Speak as if you are helping me communicate, not speaking as me.
- Use first-person perspective when describing my skills and experience.
- Be professional, friendly, confident, and helpful.
- If asked technical questions, provide clear and practical explanations.
- If asked about hiring, highlight my skills, work ethic, and strengths in a professional manner.
`;

export async function POST(request: Request) {
  try {
    const { message, sessionId, visitorId } = await request.json();

    if (!message || !sessionId || !visitorId) {
      return NextResponse.json(
        { error: "Missing required fields: message, sessionId, visitorId" },
        { status: 400 }
      );
    }

    // Check if session exists
    const { data: sessionData, error: sessionError } = await supabaseServer
      .from("chat_sessions")
      .select("id, admin_responded")
      .eq("id", sessionId)
      .single();

    // If session doesn't exist, create it
    if (sessionError?.code === "PGRST116") {
      console.log("Session not found, creating new session:", sessionId);
      const { error: createError } = await supabaseServer
        .from("chat_sessions")
        .insert({
          id: sessionId,
          visitor_id: visitorId,
          status: "active",
        });

      if (createError) {
        console.error("Error creating session:", createError);
        throw createError;
      }
    } else if (sessionError) {
      console.error("Error fetching session:", sessionError);
      throw sessionError;
    }

    const adminHasResponded = sessionData?.admin_responded || false;

    // Check if admin is currently logged in
    const { data: adminStatus } = await supabaseServer
      .from("admin_users")
      .select("is_online")
      .limit(1)
      .single();

    const isAdminOnline = adminStatus?.is_online || false;

    // Save user message to database
    const { error: userMsgError } = await supabaseServer
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        sender: "user",
        content: message,
      });

    if (userMsgError) {
      console.error("Error saving user message:", userMsgError);
      throw userMsgError;
    }

    // Always generate AI response - admin can override if they want to respond
    // This ensures users always get a response instead of just waiting

    // Get conversation history from database (last 10 messages)
    const { data: messageHistory, error: historyError } = await supabaseServer
      .from("chat_messages")
      .select("sender, content")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(10);

    if (historyError) {
      console.error("Error fetching message history:", historyError);
      throw historyError;
    }

    // Format messages for Groq API
    const groqMessages: any[] = messageHistory.map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    // Call Groq AI with conversation history
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system" as const,
          content: SYSTEM_PROMPT,
        },
        ...(groqMessages as any),
      ] as any,
      temperature: 0.6,
    });

    const reply = completion.choices[0]?.message?.content || "No response";

    // Save bot response to database
    const { error: botMsgError } = await supabaseServer
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        sender: "bot",
        content: reply,
        processed_by_ai: true,
      });

    if (botMsgError) {
      console.error("Error saving bot message:", botMsgError);
      throw botMsgError;
    }

    // Update last_message_time in session
    await supabaseServer
      .from("chat_sessions")
      .update({ last_message_time: new Date().toISOString() })
      .eq("id", sessionId);

    return NextResponse.json({ reply, sessionId });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
