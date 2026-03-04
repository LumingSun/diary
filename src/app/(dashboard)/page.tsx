'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserDiaries, type Diary } from '@/lib/firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Edit, Plus, Calendar, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDiaries();
    }
  }, [user]);

  const loadDiaries = async () => {
    if (!user) return;
    try {
      const data = await getUserDiaries(user.uid);
      setDiaries(data);
    } catch (error) {
      console.error('Failed to load diaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '未知日期';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">
          你好，今天过得怎么样？
        </h1>
        <p className="text-amber-700 mb-6">
          记录生活中的每一个美好瞬间
        </p>
        <Link href="/new">
          <Button className="h-12 px-6 text-base">
            <Plus className="w-5 h-5 mr-2" />
            写一篇新日记
          </Button>
        </Link>
      </div>

      {/* 灵感提示 */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900 mb-2">不知道写什么？</h3>
            <p className="text-amber-700 text-sm mb-4">
              试试回答这些问题，开启你的日记之旅：
            </p>
            <ul className="space-y-2 text-sm text-amber-600">
              <li>• 今天发生了什么让你微笑的小事？</li>
              <li>• 最近有什么让你感到骄傲的时刻？</li>
              <li>• 如果给今天一个颜色，会是什么颜色？为什么？</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 日记列表 */}
      <div>
        <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          我的日记
        </h2>

        {loading ? (
          <div className="text-center py-12 text-amber-600">加载中...</div>
        ) : diaries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-12 text-center">
            <Edit className="w-12 h-12 text-amber-300 mx-auto mb-4" />
            <p className="text-amber-700 mb-4">还没有日记</p>
            <Link href="/new">
              <Button variant="secondary">开始写第一篇吧</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {diaries.map((diary) => (
              <Link
                key={diary.id}
                href={`/diary/${diary.id}`}
                className="block bg-white rounded-xl shadow-sm border border-amber-100 p-5 hover:shadow-md hover:border-amber-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-amber-900 mb-2 truncate">
                      {diary.title || '无题'}
                    </h3>
                    <p className="text-amber-600 text-sm line-clamp-2">
                      {diary.content.replace(/[#*_~`]/g, '')}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="text-xs text-amber-500 whitespace-nowrap">
                      {formatDate(diary.date)}
                    </span>
                  </div>
                </div>
                {diary.aiSummary && (
                  <div className="mt-3 pt-3 border-t border-amber-50">
                    <p className="text-xs text-amber-500 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI 已总结
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
