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
          content: '你是一个温暖、善解人意的日记助手。根据用户的日记内容，给予真诚、正向的鼓励和打气。语气要温暖、不油腻。用中文回复。',
        },
        {
          role: 'user',
          content: `请根据这篇日记给我一些鼓励：\n\n${content}`,
        },
      ],
      temperature: 0.8,
    });

    const encouragement = response.choices[0]?.message?.content || '每一天都是新的开始，你已经很棒了！';
    return NextResponse.json({ encouragement });
  } catch (error) {
    console.error('Encouragement error:', error);
    return NextResponse.json(
      { error: 'Failed to generate encouragement' },
      { status: 500 }
    );
  }
}
