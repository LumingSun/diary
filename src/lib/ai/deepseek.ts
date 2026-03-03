import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
});

// AI 总结日记
export async function summarizeDiary(content: string): Promise<string> {
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
  return response.choices[0]?.message?.content || '无法生成总结';
}

// AI 生成鼓励话语
export async function generateEncouragement(content: string): Promise<string> {
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
  return response.choices[0]?.message?.content || '每一天都是新的开始，你已经很棒了！';
}

// AI 生成灵感问题
export async function generateInspirationQuestions(): Promise<string[]> {
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
  
  return questions.length > 0 ? questions : ['今天发生了什么让你开心的小事？', '今天遇到了什么挑战？你是如何面对的？'];
}
