'use client';

import { YearGroup } from './YearGroup';
import { groupDiariesByYearMonth } from '@/lib/utils/dateUtils';

interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  weather?: string;
}

interface TimelineViewProps {
  diaries: Diary[];
}

export function TimelineView({ diaries }: TimelineViewProps) {
  if (diaries.length === 0) {
    return (
      <div className="text-center py-12 text-amber-600">
        <p>还没有日记，开始记录你的生活吧</p>
      </div>
    );
  }

  const groupedData = groupDiariesByYearMonth(diaries);

  return (
    <div className="relative">
      {groupedData.map((yearGroup, index) => (
        <div key={yearGroup.year} className="mb-8 last:mb-0">
          <YearGroup
            year={yearGroup.year}
            months={yearGroup.months}
            isFirstYear={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
