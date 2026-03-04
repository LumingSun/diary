'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TimelineItem } from './TimelineItem';

interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  weather?: string;
}

interface MonthGroupProps {
  month: number;
  monthLabel: string;
  count: number;
  diaries: Diary[];
  isFirstMonth?: boolean;
}

export function MonthGroup({ month, monthLabel, count, diaries, isFirstMonth }: MonthGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="relative">
      {/* 月份标题 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 py-2 hover:text-amber-600 transition-colors sticky top-0 bg-white/95 backdrop-blur-sm z-10"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-amber-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-amber-500" />
        )}
        <span className="font-medium text-amber-900">{monthLabel}</span>
        <span className="text-xs text-amber-500 bg-amber-100 px-2 py-0.5 rounded-full">
          {count}篇
        </span>
      </button>

      {/* 日记列表 */}
      {isExpanded && (
        <div className="space-y-1">
          {diaries.map((diary, index) => (
            <TimelineItem
              key={diary.id}
              diary={diary}
              isFirst={isFirstMonth && index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
