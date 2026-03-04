'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createDiary, updateDiary, getDiaryById } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { TagSelector, type MoodType, type WeatherType } from '@/components/ui/TagSelector';
import { ArrowLeft, Save, Sparkles, Heart, Loader2, Calendar, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';

export default function NewDiaryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<MoodType | undefined>();
  const [weather, setWeather] = useState<WeatherType | undefined>();
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiEncouragement, setAiEncouragement] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = async () => {
    if (!user || !content.trim()) return;

    setSaving(true);
    try {
      const id = await createDiary(user.uid, title, content, date, mood, weather);
      router.push(`/diary/${id}`);
    } catch (error) {
      console.error('Failed to save diary:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleAIProcess = async () => {
    if (!content.trim()) return;

    setProcessing(true);
    try {
      // 并行调用 AI 接口
      const [summaryRes, encouragementRes] = await Promise.all([
        fetch('/api/ai/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: content }),
        }),
        fetch('/api/ai/encourage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: content }),
        }),
      ]);

      if (!summaryRes.ok || !encouragementRes.ok) {
        throw new Error('AI 服务请求失败');
      }

      const [{ summary }, { encouragement }] = await Promise.all([
        summaryRes.json(),
        encouragementRes.json(),
      ]);

      setAiSummary(summary);
      setAiEncouragement(encouragement);
    } catch (error) {
      console.error('AI processing failed:', error);
      alert('AI 处理失败，请稍后重试');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </Link>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={handleAIProcess}
            disabled={processing || !content.trim()}
          >
            {processing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            AI 分析
          </Button>
          <Button onClick={handleSave} disabled={saving || !content.trim()}>
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>
      </div>

      {/* 编辑器 */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
        <div className="p-4 border-b border-amber-100 bg-amber-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <label className="text-sm text-amber-700 font-medium">日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-sm border border-amber-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>
          <TagSelector
            selectedMood={mood}
            selectedWeather={weather}
            onMoodChange={setMood}
            onWeatherChange={setWeather}
          />
        </div>
        <div className="p-6 border-b border-amber-100">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给今天的日记起个标题吧（可选）"
            className="border-0 text-lg font-medium px-0 focus-visible:ring-0"
          />
        </div>
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天发生了什么？心情如何？有什么想记录的..."
          className="min-h-[400px] border-0 rounded-none px-6 py-4 text-base leading-relaxed resize-none focus-visible:ring-0"
        />
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 text-sm text-amber-600">
          {content.length} 字 • 自动保存草稿
        </div>
      </div>

      {/* AI 分析结果 */}
      {(aiSummary || aiEncouragement) && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* AI 总结 */}
          {aiSummary && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-2">AI 总结</h3>
                  <p className="text-amber-700 leading-relaxed">{aiSummary}</p>
                </div>
              </div>
            </div>
          )}

          {/* AI 鼓励 */}
          {aiEncouragement && (
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-pink-500 mt-0.5" fill="currentColor" />
                <div className="flex-1">
                  <h3 className="font-semibold text-pink-900 mb-2">写给你的话</h3>
                  <p className="text-pink-700 leading-relaxed">{aiEncouragement}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
