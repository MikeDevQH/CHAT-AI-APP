import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const message = formData.get('message')?.toString() || '';
  const image = formData.get('image') as File | null;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return NextResponse.json({ text: 'Falta la clave de API.' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      maxOutputTokens: 10000, 
      temperature: 0.7,      
    },
  });

  let result;
  try {
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const imagePart = {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: image.type,
        },
      };

      result = await model.generateContentStream([message, imagePart]);
    } else {
      result = await model.generateContentStream(message);
    }

    let generatedText = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      generatedText += chunkText; 
    }

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error('Error al llamar a la API de Gemini:', error);
    return NextResponse.json({ text: 'Error al llamar a la API de Gemini.' }, { status: 500 });
  }
}
