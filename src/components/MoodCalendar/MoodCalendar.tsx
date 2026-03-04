'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getMoodEmoji } from '@/components/ui/TagSelector';
import { Button } from '@/components/ui/Button';

interface Diary {
  id: string;
  date: string;
  mood?: string;
  title?: string;
}

interface MoodCalendarProps {
  diaries: Diary[];
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTHS = [
  '1 月', '2 月', '3 月', '4 月', '5 月', '6 月',
  '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'
];

// 格式化本地日期为 YYYY-MM-DD
function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function MoodCalendar({ diaries }: MoodCalendarProps) {
  const router = useRouter();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // 创建日记查找表（按日期）
  const diaryMap = useMemo(() => {
    const map = new Map<string, Diary>();
    diaries.forEach((diary) => {
      map.set(diary.date, diary);
    });
    return map;
  }, [diaries]);

  // 生成日历数据
  const calendarData = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay(); // 当月第一天是周几
    const daysInMonth = lastDay.getDate(); // 当月天数

    const days: Array<{
      date: string;
      day: number;
      isCurrentMonth: boolean;
      diary?: Diary;
    }> = [];

    // 填充上月末尾
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      const dateStr = formatDateLocal(date);
      days.push({
        date: dateStr,
        day,
        isCurrentMonth: false,
        diary: diaryMap.get(dateStr),
      });
    }

    // 填充当月
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = formatDateLocal(date);
      days.push({
        date: dateStr,
        day,
        isCurrentMonth: true,
        diary: diaryMap.get(dateStr),
      });
    }

    // 填充下月开头（补齐 6 行 x 7 列 = 42 天）
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      const dateStr = formatDateLocal(date);
      days.push({
        date: dateStr,
        day,
        isCurrentMonth: false,
        diary: diaryMap.get(dateStr),
      });
    }

    return days;
  }, [currentYear, currentMonth, diaryMap]);

  // 切换月份
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // 统计当月日记数
  const currentMonthDiaries = calendarData.filter(
    (d) => d.isCurrentMonth && d.diary
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-amber-900">情绪日历</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
          >
            今天
          </button>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 年月标题 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-amber-900">{currentYear}年</span>
          <span className="text-xl text-amber-600">{MONTHS[currentMonth]}</span>
        </div>
        <div className="text-sm text-amber-600">
          本月写了 <span className="font-medium text-amber-900">{currentMonthDiaries}</span> 篇日记
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.map((item, index) => {
          const isToday = item.date === formatDateLocal(today);
          const hasDiary = !!item.diary;

          const handleClick = () => {
            if (hasDiary && item.diary) {
              // 有日记：跳转到详情页
              router.push(`/diary/${item.diary.id}`);
            } else {
              // 无日记：跳转到新建页面，日期预设为该天
              router.push(`/new?date=${item.date}`);
            }
          };

          return (
            <div
              key={item.date}
              onClick={handleClick}
              className={`
                relative aspect-square rounded-lg border p-1 flex flex-col
                transition-all duration-150
                ${hasDiary
                  ? 'cursor-pointer hover:shadow-md hover:scale-105'
                  : 'cursor-pointer hover:bg-amber-50/50'
                }
                ${item.isCurrentMonth
                  ? 'bg-white border-amber-100'
                  : 'bg-gray-50/50 border-gray-100'
                }
                ${isToday ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
              `}
            >
              {/* 日期数字 */}
              <div
                className={`
                  text-sm font-medium
                  ${item.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
                  ${isToday ? 'text-amber-600' : ''}
                `}
              >
                {item.day}
              </div>

              {/* 情绪 emoji */}
              {hasDiary && item.diary?.mood && (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-2xl">
                    {getMoodEmoji(item.diary.mood)}
                  </span>
                </div>
              )}

              {/* 日记标题（截断） */}
              {hasDiary && item.diary?.title && (
                <div className="text-xs text-gray-500 truncate mt-0.5 px-0.5">
                  {item.diary.title}
                </div>
              )}

              {/* 无日记提示 */}
              {!hasDiary && item.isCurrentMonth && (
                <div className="flex-1 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-lg text-amber-400">+</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>情绪：</span>
          <div className="flex space-x-2">
            <span className="flex items-center space-x-1">
              <span>😊</span>
              <span>开心</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>😌</span>
              <span>放松</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>😐</span>
              <span>平静</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-gray-50 border border-gray-200" />
          <span>无日记</span>
        </div>
      </div>
    </div>
  );
}
