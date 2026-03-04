'use client';

import { useState } from 'react';

export type MoodType = 'happy' | 'calm' | 'sad' | 'anxious' | 'angry' | 'tired' | 'excited' | 'neutral';
export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy' | 'windy';

export interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
}

export interface WeatherOption {
  id: WeatherType;
  label: string;
  emoji: string;
  color: string;
}

export const MOODS: MoodOption[] = [
  { id: 'happy', label: '开心', emoji: '😊', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { id: 'excited', label: '兴奋', emoji: '🤩', color: 'bg-orange-100 border-orange-300 text-orange-700' },
  { id: 'neutral', label: '平静', emoji: '😐', color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { id: 'calm', label: '放松', emoji: '😌', color: 'bg-green-100 border-green-300 text-green-700' },
  { id: 'tired', label: '疲惫', emoji: '😴', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { id: 'sad', label: '难过', emoji: '😢', color: 'bg-indigo-100 border-indigo-300 text-indigo-700' },
  { id: 'anxious', label: '焦虑', emoji: '😰', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { id: 'angry', label: '生气', emoji: '😠', color: 'bg-red-100 border-red-300 text-red-700' },
];

export const WEATHERS: WeatherOption[] = [
  { id: 'sunny', label: '晴朗', emoji: '☀️', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { id: 'cloudy', label: '多云', emoji: '☁️', color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { id: 'rainy', label: '下雨', emoji: '🌧️', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { id: 'stormy', label: '暴雨', emoji: '⛈️', color: 'bg-indigo-100 border-indigo-300 text-indigo-700' },
  { id: 'snowy', label: '下雪', emoji: '❄️', color: 'bg-cyan-100 border-cyan-300 text-cyan-700' },
  { id: 'foggy', label: '有雾', emoji: '🌫️', color: 'bg-slate-100 border-slate-300 text-slate-700' },
  { id: 'windy', label: '大风', emoji: '💨', color: 'bg-teal-100 border-teal-300 text-teal-700' },
];

interface TagSelectorProps {
  selectedMood?: MoodType;
  selectedWeather?: WeatherType;
  onMoodChange?: (mood: MoodType | undefined) => void;
  onWeatherChange?: (weather: WeatherType | undefined) => void;
}

export function TagSelector({ 
  selectedMood, 
  selectedWeather, 
  onMoodChange, 
  onWeatherChange 
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedMoodData = MOODS.find(m => m.id === selectedMood);
  const selectedWeatherData = WEATHERS.find(w => w.id === selectedWeather);

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors"
      >
        <span className="text-lg">
          {selectedMoodData?.emoji || '📝'}
        </span>
        {selectedWeatherData?.emoji && (
          <span className="text-lg">{selectedWeatherData.emoji}</span>
        )}
        <span className="text-sm text-amber-600">
          {selectedMoodData ? selectedMoodData.label : '添加标签'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-amber-100 p-4 w-72">
            {/* 情绪选择 */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-amber-900 mb-2">心情</h4>
              <div className="grid grid-cols-4 gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => {
                      onMoodChange?.(selectedMood === mood.id ? undefined : mood.id);
                    }}
                    className={`
                      flex flex-col items-center p-2 rounded-lg border-2 transition-all
                      ${selectedMood === mood.id 
                        ? mood.color + ' border-current shadow-sm' 
                        : 'bg-white border-transparent hover:bg-amber-50'
                      }
                    `}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 天气选择 */}
            <div>
              <h4 className="text-sm font-medium text-amber-900 mb-2">天气</h4>
              <div className="grid grid-cols-4 gap-2">
                {WEATHERS.map((weather) => (
                  <button
                    key={weather.id}
                    type="button"
                    onClick={() => {
                      onWeatherChange?.(selectedWeather === weather.id ? undefined : weather.id);
                    }}
                    className={`
                      flex flex-col items-center p-2 rounded-lg border-2 transition-all
                      ${selectedWeather === weather.id 
                        ? weather.color + ' border-current shadow-sm' 
                        : 'bg-white border-transparent hover:bg-amber-50'
                      }
                    `}
                  >
                    <span className="text-2xl mb-1">{weather.emoji}</span>
                    <span className="text-xs">{weather.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 清除按钮 */}
            {(selectedMood || selectedWeather) && (
              <div className="mt-4 pt-3 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => {
                    onMoodChange?.(undefined);
                    onWeatherChange?.(undefined);
                  }}
                  className="w-full text-sm text-amber-600 hover:text-amber-800"
                >
                  清除所有标签
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// 获取情绪的样式
export function getMoodStyle(mood?: MoodType) {
  return MOODS.find(m => m.id === mood) || MOODS[6]; // 默认返回 neutral
}

// 获取天气的样式
export function getWeatherStyle(weather?: WeatherType) {
  return WEATHERS.find(w => w.id === weather) || WEATHERS[0]; // 默认返回 sunny
}
