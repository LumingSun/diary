'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserDiaries, type Diary } from '@/lib/firebase/firestore';
import { TimelineView } from '@/components/Timeline';
import { MoodCalendar } from '@/components/MoodCalendar';
import { OnThisDayCard } from '@/components/OnThisDay';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, List } from 'lucide-react';
import Link from 'next/link';

export default function TimelinePage() {
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

  if (loading) {
    return (
      <div className="text-center py-12 text-amber-600">加载中...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="sm">
            <List className="w-4 h-4 mr-2" />
            列表视图
          </Button>
        </Link>
      </div>

      {/* 那年今日 */}
      <OnThisDayCard diaries={diaries} />

      {/* 情绪日历 */}
      <MoodCalendar diaries={diaries} />

      {/* 时间轴 */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
        <h2 className="text-lg font-semibold text-amber-900 mb-4">时间轴</h2>
        <TimelineView diaries={diaries} />
      </div>
    </div>
  );
}
