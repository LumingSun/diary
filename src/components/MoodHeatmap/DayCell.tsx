'use client';

import { useState } from 'react';
import { MOODS } from '@/components/ui/TagSelector';

interface DayCellProps {
  date: string;
  mood?: string;
  hasDiary: boolean;
  showTooltip?: boolean;
  cellSize?: number;
}

export function DayCell({ date, mood, hasDiary, showTooltip = true, cellSize = 32 }: DayCellProps) {
  const [showTooltipState, setShowTooltipState] = useState(false);
  const moodData = MOODS.find((m) => m.id === mood);

  // 根据是否有日记和情绪获取颜色
  const getBackgroundColor = () => {
    if (!hasDiary) return 'bg-gray-100';
    if (moodData) return moodData.color.split(' ')[0]; // 获取 bg-* 类
    return 'bg-amber-200';
  };

  const getBorderColor = () => {
    if (!hasDiary) return 'border-gray-200';
    if (moodData) return moodData.color.split(' ')[1]; // 获取 border-* 类
    return 'border-amber-300';
  };

  // 格式化日期显示
  const formatDate = () => {
    const d = new Date(date);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <div
      style={{ width: cellSize, height: cellSize }}
      onMouseEnter={() => setShowTooltipState(true)}
      onMouseLeave={() => setShowTooltipState(false)}
      className={`
        rounded-md border ${getBackgroundColor()} ${getBorderColor()}
        transition-all duration-150 hover:scale-110 hover:shadow-md
        cursor-pointer relative flex items-center justify-center
      `}
      data-date={date}
      data-mood={mood || 'none'}
    >
      {hasDiary && moodData && (
        <span className="text-lg leading-none">{moodData.emoji}</span>
      )}
      
      {(showTooltip || showTooltipState) && hasDiary && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-50">
          <div className="font-medium mb-1">{formatDate()}</div>
          {moodData && <div>{moodData.label}</div>}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
}
