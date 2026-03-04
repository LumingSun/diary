'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { getMoodEmoji, getWeatherEmoji } from '@/components/ui/TagSelector';

interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  weather?: string;
}

interface TimelineItemProps {
  diary: Diary;
  isFirst?: boolean;
}

export function TimelineItem({ diary, isFirst }: TimelineItemProps) {
  return (
    <Link
      href={`/diary/${diary.id}`}
      className="group relative flex items-start space-x-4 py-3 hover:bg-amber-50/50 rounded-lg -mx-3 px-3 transition-colors"
    >
      {/* 时间线圆点 */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-3 h-3 rounded-full border-2 border-amber-400 bg-white ${
            isFirst ? 'ring-2 ring-amber-200' : ''
          }`}
        />
        {isFirst && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        )}
      </div>

      {/* 日期 */}
      <div className="flex-shrink-0 w-24 pt-0.5">
        <span className="text-sm font-medium text-amber-700">
          {new Date(diary.date).toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium text-amber-900 truncate group-hover:text-amber-600 transition-colors">
            {diary.title || '无题'}
          </h4>
          {diary.mood && (
            <span className="flex-shrink-0 text-sm">{getMoodEmoji(diary.mood)}</span>
          )}
          {diary.weather && (
            <span className="flex-shrink-0 text-sm">{getWeatherEmoji(diary.weather)}</span>
          )}
        </div>
        <p className="text-sm text-amber-600 line-clamp-1 mt-0.5">
          {diary.content.replace(/[#*_~`!\[\]\(.+\)]/g, '').slice(0, 60)}
          {diary.content.length > 60 ? '...' : ''}
        </p>
      </div>

      {/* 箭头 */}
      <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-5 h-5 text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
