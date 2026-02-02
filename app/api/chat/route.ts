import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.APIKEY!);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Use a valid model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-turbo' });

    // Generate content (TypeScript-safe)
    const result = await model.generateContent(message);

    // Extract text safely
    const text = result.response?.text ?? "No response";

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
}
