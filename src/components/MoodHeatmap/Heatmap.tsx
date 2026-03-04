'use client';

import { useMemo } from 'react';
import { DayCell } from './DayCell';
import {
  generateHeatmapData,
  calculateStreak,
} from '@/lib/utils/dateUtils';
import { Flame, Calendar } from 'lucide-react';

interface Diary {
  date: string;
  mood?: string;
}

interface MoodHeatmapProps {
  diaries: Diary[];
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function MoodHeatmap({ diaries }: MoodHeatmapProps) {
  const heatmapData = useMemo(() => generateHeatmapData(diaries, 30), [diaries]);
  const streak = useMemo(() => calculateStreak(diaries), [diaries]);

  // 计算总日记数
  const totalDiaries = diaries.length;

  // 按周分组（7 天一行）
  const weeks: Array<typeof heatmapData> = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  // 获取日期范围
  const startDate = heatmapData[0]?.date;
  const endDate = heatmapData[heatmapData.length - 1]?.date;
  const startLabel = startDate ? new Date(startDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : '';
  const endLabel = endDate ? new Date(endDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
      {/* 标题和统计 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-amber-900">情绪热力图</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-amber-600">
            共 <span className="font-medium text-amber-900">{totalDiaries}</span> 篇日记
          </span>
          {streak > 0 && (
            <span className="flex items-center text-amber-600">
              <Flame className="w-4 h-4 mr-1 text-orange-500" />
              连续 <span className="font-medium text-amber-900 ml-1">{streak}</span> 天
            </span>
          )}
        </div>
      </div>

      {/* 日期范围 */}
      <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
        <span>{startLabel}</span>
        <span className="text-amber-600 font-medium">过去 30 天</span>
        <span>{endLabel}（今天）</span>
      </div>

      {/* 热力图网格 */}
      <div className="flex gap-1">
        {/* 星期标签列 */}
        <div className="flex flex-col gap-1 w-6 flex-shrink-0">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs text-gray-400"
            >
              {index % 2 === 0 ? day : ''}
            </div>
          ))}
        </div>

        {/* 日期方块 */}
        <div className="flex gap-1 flex-wrap content-start">
          {heatmapData.map((day) => (
            <DayCell
              key={day.date}
              date={day.date}
              mood={day.mood}
              hasDiary={day.hasDiary}
              cellSize={32}
            />
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <span>情绪：</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 rounded-sm bg-gray-100 border border-gray-200" title="无日记" />
            <div className="w-4 h-4 rounded-sm bg-yellow-100 border border-yellow-200" title="开心" />
            <div className="w-4 h-4 rounded-sm bg-green-100 border border-green-200" title="放松" />
            <div className="w-4 h-4 rounded-sm bg-orange-100 border border-orange-200" title="兴奋" />
            <div className="w-4 h-4 rounded-sm bg-indigo-100 border border-indigo-200" title="难过" />
          </div>
        </div>
        <span>点击方块查看详情</span>
      </div>
    </div>
  );
}
