'use client';

import { MonthGroup } from './MonthGroup';

interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  weather?: string;
}

interface MonthData {
  month: number;
  monthLabel: string;
  count: number;
  diaries: Diary[];
}

interface YearGroupProps {
  year: number;
  months: MonthData[];
  isFirstYear?: boolean;
}

export function YearGroup({ year, months, isFirstYear }: YearGroupProps) {
  return (
    <div className="relative">
      {/* 年份标题 */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 py-4 border-b-2 border-amber-200 mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-amber-400 border-4 border-amber-100" />
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-amber-400 animate-ping opacity-20" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900">{year}年</h2>
        </div>
      </div>

      {/* 时间轴线 */}
      <div className="absolute left-[9px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-amber-100 to-transparent" />

      {/* 月份分组 */}
      <div className="space-y-4 pl-8">
        {months.map((monthData, index) => (
          <MonthGroup
            key={monthData.month}
            month={monthData.month}
            monthLabel={monthData.monthLabel}
            count={monthData.count}
            diaries={monthData.diaries}
            isFirstMonth={isFirstYear && index === 0}
          />
        ))}
      </div>
    </div>
  );
}
