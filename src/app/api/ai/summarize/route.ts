import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
});

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个温暖的日记助手。请用简洁、温馨的语言总结用户的日记内容，控制在 100 字以内。用中文回复。',
        },
        {
          role: 'user',
          content: `请帮我总结这篇日记：\n\n${content}`,
        },
      ],
      temperature: 0.7,
    });

    const summary = response.choices[0]?.message?.content || '无法生成总结';
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
