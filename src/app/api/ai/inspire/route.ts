import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
});

export async function POST() {
  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个善于启发思考的日记助手。生成 5 个温暖、有深度的问题，帮助用户记录日记。问题要开放、能引发思考，但不要太沉重。用中文回复，只返回问题列表，用换行分隔。',
        },
        {
          role: 'user',
          content: '请给我一些写日记的灵感问题',
        },
      ],
      temperature: 0.9,
    });

    const content = response.choices[0]?.message?.content || '';
    const questions = content
      .split('\n')
      .filter((q) => q.trim().length > 0)
      .slice(0, 5);

    const result = questions.length > 0 
      ? questions 
      : ['今天发生了什么让你开心的小事？', '今天遇到了什么挑战？你是如何面对的？'];

    return NextResponse.json({ questions: result });
  } catch (error) {
    console.error('Inspiration error:', error);
    return NextResponse.json(
      { error: 'Failed to generate inspiration questions' },
      { status: 500 }
    );
  }
}
