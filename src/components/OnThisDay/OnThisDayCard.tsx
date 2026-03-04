'use client';

import Link from 'next/link';
import { Sparkles, Clock } from 'lucide-react';
import { getMoodEmoji, getWeatherEmoji } from '@/components/ui/TagSelector';
import { getOnThisDayDiaries } from '@/lib/utils/dateUtils';

interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  weather?: string;
  aiSummary?: string;
}

interface OnThisDayCardProps {
  diaries: Diary[];
}

export function OnThisDayCard({ diaries }: OnThisDayCardProps) {
  const onThisDayDiaries = getOnThisDayDiaries(diaries);

  if (onThisDayDiaries.length === 0) {
    return null;
  }

  // 显示最早的那篇
  const earliestDiary = onThisDayDiaries[onThisDayDiaries.length - 1];
  const yearsAgo = new Date().getFullYear() - new Date(earliestDiary.date).getFullYear();

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl shadow-sm border border-amber-200 p-6 relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/30 to-transparent rounded-tr-full" />

      {/* 内容 */}
      <div className="relative">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-amber-900">那年今日</h3>
          </div>
          <span className="text-xs text-amber-600 bg-white/80 px-2 py-1 rounded-full">
            {onThisDayDiaries.length} 篇回忆
          </span>
        </div>

        {/* 主要展示 */}
        <Link
          href={`/diary/${earliestDiary.id}`}
          className="block bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:shadow-md transition-all border border-amber-100"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">
                {yearsAgo}年前的今天
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {earliestDiary.mood && (
                <span className="text-lg">{getMoodEmoji(earliestDiary.mood)}</span>
              )}
              {earliestDiary.weather && (
                <span className="text-lg">{getWeatherEmoji(earliestDiary.weather)}</span>
              )}
            </div>
          </div>

          <h4 className="font-semibold text-amber-900 mb-2">
            {earliestDiary.title || '无题'}
          </h4>

          <p className="text-sm text-amber-700 line-clamp-2">
            {earliestDiary.content.replace(/[#*_~`!\[\]\(.+\)]/g, '').slice(0, 80)}
            {earliestDiary.content.length > 80 ? '...' : ''}
          </p>

          {earliestDiary.aiSummary && (
            <div className="mt-3 pt-3 border-t border-amber-100">
              <p className="text-xs text-amber-600 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                {earliestDiary.aiSummary.slice(0, 40)}...
              </p>
            </div>
          )}
        </Link>

        {/* 更多回忆 */}
        {onThisDayDiaries.length > 1 && (
          <div className="mt-3 text-center">
            <span className="text-xs text-amber-600">
              还有{onThisDayDiaries.length - 1}篇回忆
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
