'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDiaryById, updateDiary, deleteDiary, type Diary } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/Button';
import { MOODS, WEATHERS, type MoodType, type WeatherType } from '@/components/ui/TagSelector';
import { ArrowLeft, Edit, Trash2, Sparkles, Heart, Lightbulb, Loader2, RotateCcw, Image as ImageIcon } from 'lucide-react';

function getMoodEmoji(mood: string): string {
  const m = MOODS.find(item => item.id === mood);
  return m?.emoji || '😊';
}

function getWeatherEmoji(weather: string): string {
  const w = WEATHERS.find(item => item.id === weather);
  return w?.emoji || '☀️';
}

export default function DiaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (user && params.id) {
      loadDiary();
    }
  }, [user, params.id]);

  const loadDiary = async () => {
    try {
      const data = await getDiaryById(params.id as string);
      setDiary(data);
    } catch (error) {
      console.error('Failed to load diary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIProcess = async () => {
    if (!diary) return;

    setProcessing(true);
    try {
      const [summaryRes, encouragementRes] = await Promise.all([
        fetch('/api/ai/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: diary.content }),
        }),
        fetch('/api/ai/encourage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: diary.content }),
        }),
      ]);

      if (!summaryRes.ok || !encouragementRes.ok) {
        throw new Error('AI 服务请求失败');
      }

      const [{ summary }, { encouragement }] = await Promise.all([
        summaryRes.json(),
        encouragementRes.json(),
      ]);

      await updateDiary(diary.id, {
        aiSummary: summary,
        aiEncouragement: encouragement,
      });

      setDiary({
        ...diary,
        aiSummary: summary,
        aiEncouragement: encouragement,
      });
    } catch (error) {
      console.error('AI processing failed:', error);
      alert('AI 处理失败，请稍后重试');
    } finally {
      setProcessing(false);
    }
  };

  const handleLoadQuestions = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/ai/inspire', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('获取灵感问题失败');
      const { questions: qs } = await res.json();
      setQuestions(qs);
      setShowQuestions(true);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇日记吗？此操作不可恢复。')) return;
    
    try {
      await deleteDiary(diary!.id);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete diary:', error);
      alert('删除失败，请重试');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return '未知日期';
    return timestamp.toDate().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-amber-600">加载中...</div>
    );
  }

  if (!diary) {
    return (
      <div className="text-center py-12">
        <p className="text-amber-700 mb-4">日记不存在</p>
        <Link href="/">
          <Button>返回首页</Button>
        </Link>
      </div>
    );
  }

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
            disabled={processing}
          >
            {processing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {diary.aiSummary ? '重新分析' : 'AI 分析'}
          </Button>
          <Button
            variant="outline"
            onClick={handleLoadQuestions}
            disabled={processing}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            灵感问题
          </Button>
          <Link href={`/edit/${diary.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* 日记内容 */}
      <article className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
        <div className="p-8">
          {/* 元信息 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <time className="text-lg font-medium text-amber-700">
                {diary.date}
              </time>
              {diary.mood && (
                <span className="px-2 py-1 bg-amber-100 rounded-md text-sm">
                  {getMoodEmoji(diary.mood)}
                </span>
              )}
              {diary.weather && (
                <span className="px-2 py-1 bg-blue-100 rounded-md text-sm">
                  {getWeatherEmoji(diary.weather)}
                </span>
              )}
            </div>
            {diary.updatedAt && diary.updatedAt !== diary.createdAt && (
              <span className="text-xs text-amber-400">
                最后编辑：{formatDate(diary.updatedAt)}
              </span>
            )}
          </div>

          {/* 标题 */}
          {diary.title && (
            <h1 className="text-2xl font-bold text-amber-900 mb-6">
              {diary.title}
            </h1>
          )}

          {/* 内容 */}
          <div className="prose prose-amber max-w-none">
            {diary.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-amber-800 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* 图片 */}
          {diary.images && diary.images.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-3">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">日记图片</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {diary.images.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden border border-amber-100 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={url}
                      alt={`日记图片 ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* AI 分析结果 */}
      {(diary.aiSummary || diary.aiEncouragement) && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {diary.aiSummary && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-2">AI 总结</h3>
                  <p className="text-amber-700 leading-relaxed">{diary.aiSummary}</p>
                </div>
              </div>
            </div>
          )}

          {diary.aiEncouragement && (
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-pink-500 mt-0.5" fill="currentColor" />
                <div className="flex-1">
                  <h3 className="font-semibold text-pink-900 mb-2">写给你的话</h3>
                  <p className="text-pink-700 leading-relaxed">{diary.aiEncouragement}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 灵感问题 */}
      {showQuestions && questions.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-100">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-amber-900">灵感问题</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadQuestions}
                  disabled={processing}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  换一批
                </Button>
              </div>
              <ul className="space-y-2">
                {questions.map((q, index) => (
                  <li key={index} className="text-amber-700 text-sm leading-relaxed">
                    {q.replace(/^\d+[\.\s]*/, '')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
