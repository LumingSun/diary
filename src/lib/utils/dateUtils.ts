/**
 * 日期工具函数
 */

/**
 * 格式化本地日期为 YYYY-MM-DD（避免时区问题）
 */
export function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期为中文显示
 */
export function formatDateChinese(dateStr: string): string {
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
}

/**
 * 获取简短日期格式
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 获取年份和月份
 */
export function getYearMonth(dateStr: string): { year: number; month: number } {
  const date = new Date(dateStr);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

/**
 * 获取月份标签
 */
export function getMonthLabel(month: number): string {
  return `${month}月`;
}

/**
 * 按年月分组日记
 */
export function groupDiariesByYearMonth<T extends { date: string }>(diaries: T[]) {
  const groups: Record<number, Record<number, T[]>> = {};

  diaries.forEach((diary) => {
    const { year, month } = getYearMonth(diary.date);
    if (!groups[year]) {
      groups[year] = {};
    }
    if (!groups[year][month]) {
      groups[year][month] = [];
    }
    groups[year][month].push(diary);
  });

  // 按年份降序排序
  const sortedYears = Object.keys(groups).map(Number).sort((a, b) => b - a);

  return sortedYears.map((year) => {
    const months = Object.keys(groups[year])
      .map(Number)
      .sort((a, b) => b - a)
      .map((month) => ({
        month,
        monthLabel: getMonthLabel(month),
        count: groups[year][month].length,
        diaries: groups[year][month],
      }));

    return { year, months };
  });
}

/**
 * 获取那年今日的日记
 */
export function getOnThisDayDiaries<T extends { date: string }>(
  diaries: T[],
  currentYear: number = new Date().getFullYear()
) {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  return diaries.filter((diary) => {
    const diaryDate = new Date(diary.date);
    const diaryMonth = diaryDate.getMonth() + 1;
    const diaryDay = diaryDate.getDate();
    const diaryYear = diaryDate.getFullYear();

    // 排除今年的日记
    if (diaryYear >= currentYear) return false;

    // 匹配月和日
    return diaryMonth === todayMonth && diaryDay === todayDay;
  });
}

/**
 * 计算连续写作天数
 */
export function calculateStreak(diaries: { date: string }[]): number {
  if (diaries.length === 0) return 0;

  const today = new Date();
  const dates = diaries
    .map((d) => new Date(d.date).getTime())
    .sort((a, b) => b - a);

  let streak = 0;
  let currentDate = today.getTime();

  // 检查今天是否写了日记
  const hasToday = dates.some(
    (date) => new Date(date).toDateString() === today.toDateString()
  );

  if (!hasToday) {
    // 如果今天没写，检查昨天
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const hasYesterday = dates.some(
      (date) => new Date(date).toDateString() === yesterday.toDateString()
    );

    if (!hasYesterday) {
      return 0;
    }

    currentDate = yesterday.getTime();
  }

  // 计算连续天数
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() - i);

    // 格式化日期进行比较（使用本地时间）
    const checkDateStr = formatDateLocal(checkDate);
    const hasDiary = dates.some(
      (date) => formatDateLocal(new Date(date)) === checkDateStr
    );

    if (hasDiary) {
      streak++;
    } else if (i > 0) {
      // 除了第一天，其他天如果没有日记就中断
      break;
    }
  }

  return streak;
}

/**
 * 生成热力图数据
 * 返回过去 30 天每天的数据（一个月）
 */
export function generateHeatmapData<T extends { date: string; mood?: string }>(
  diaries: T[],
  daysCount: number = 30
) {
  const today = new Date();
  const days: Array<{
    date: string;
    mood?: string;
    hasDiary: boolean;
  }> = [];

  // 创建日记查找表
  const diaryMap = new Map<string, T>();
  diaries.forEach((diary) => {
    diaryMap.set(diary.date, diary);
  });

  // 生成过去 N 天的数据
  for (let i = daysCount - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDateLocal(date);

    const diary = diaryMap.get(dateStr);
    days.push({
      date: dateStr,
      mood: diary?.mood,
      hasDiary: !!diary,
    });
  }

  return days;
}

/**
 * 获取热力图的周数
 * 按列显示：每一列是一周，从上到下是周日到周六
 */
export function getHeatmapWeeks(days: Array<{ date: string; mood?: string; hasDiary: boolean }>) {
  const weeks: Array<Array<{ date: string; mood?: string; hasDiary: boolean } | null>> = [];
  let currentWeek: Array<{ date: string; mood?: string; hasDiary: boolean } | null> = [];

  // 获取起始日期是周几
  const startDate = new Date(days[0]?.date || Date.now());
  const startDayOfWeek = startDate.getDay(); // 0 = 周日

  // 填充第一周的空缺（周日之前的日子）
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }

  // 按周分组
  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // 最后一周补齐
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * 统计情绪分布
 */
export function getMoodDistribution<T extends { mood?: string }>(diaries: T[]) {
  const distribution: Record<string, number> = {};

  diaries.forEach((diary) => {
    if (diary.mood) {
      distribution[diary.mood] = (distribution[diary.mood] || 0) + 1;
    }
  });

  return distribution;
}
