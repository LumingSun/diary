'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDiaryById, updateDiary } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Save, Loader2, Calendar } from 'lucide-react';

export default function EditDiaryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && params.id) {
      loadDiary();
    }
  }, [user, params.id]);

  const loadDiary = async () => {
    try {
      const diary = await getDiaryById(params.id as string);
      if (diary) {
        setTitle(diary.title);
        setContent(diary.content);
        setDate(diary.date || new Date().toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error('Failed to load diary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !content.trim()) return;

    setSaving(true);
    try {
      await updateDiary(params.id as string, {
        title,
        content,
        date,
      });
      router.push(`/diary/${params.id}`);
    } catch (error) {
      console.error('Failed to save diary:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-amber-600">加载中...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <Link href={`/diary/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </Link>
        <Button onClick={handleSave} disabled={saving || !content.trim()}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          保存修改
        </Button>
      </div>

      {/* 编辑器 */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
        <div className="p-4 border-b border-amber-100 bg-amber-50/50 flex items-center space-x-4">
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
        <div className="p-6 border-b border-amber-100">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="日记标题"
            className="border-0 text-lg font-medium px-0 focus-visible:ring-0"
          />
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] border-0 rounded-none px-6 py-4 text-base leading-relaxed resize-none focus-visible:ring-0"
        />
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 text-sm text-amber-600">
          {content.length} 字
        </div>
      </div>
    </div>
  );
}
