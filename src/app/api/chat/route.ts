import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return NextResponse.json({ text: 'Falta la clave de API.' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await model.generateContent(message);

    const generatedText = typeof result.response?.text === 'function'
      ? result.response?.text()
      : result.response?.text || 'Lo siento, no pude generar una respuesta.';

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error('Error al llamar a la API de Gemini:', error);
    return NextResponse.json({ text: 'Error al llamar a la API de Gemini.' }, { status: 500 });
  }
}
