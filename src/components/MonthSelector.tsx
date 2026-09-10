import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from 'lucide-react';
import { formatThaiMonthYear, THAI_MONTHS } from '../constants';

interface MonthSelectorProps {
  selectedMonth: string; // YYYY-MM
  onChangeMonth: (month: string) => void;
  isAllTime: boolean;
  onToggleAllTime: (allTime: boolean) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onChangeMonth,
  isAllTime,
  onToggleAllTime,
}) => {
  const [currentYear, currentMonthStr] = selectedMonth.split('-');
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const handlePrevMonth = () => {
    onToggleAllTime(false);
    const date = new Date(parseInt(currentYear, 10), parseInt(currentMonthStr, 10) - 1, 1);
    date.setMonth(date.getMonth() - 1);
    const newMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    onChangeMonth(newMonthKey);
  };

  const handleNextMonth = () => {
    onToggleAllTime(false);
    const date = new Date(parseInt(currentYear, 10), parseInt(currentMonthStr, 10) - 1, 1);
    date.setMonth(date.getMonth() + 1);
    const newMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    onChangeMonth(newMonthKey);
  };

  const handleResetToCurrentMonth = () => {
    onToggleAllTime(false);
    onChangeMonth(currentMonthKey);
  };

  return (
    <div 
      id="month-selector-container"
      className="bg-white/90 backdrop-blur-xs border border-stone-200/70 rounded-3xl p-3.5 sm:p-4 shadow-[0_2px_14px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-3"
    >
      {/* Month Navigation */}
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
        <button
          id="btn-prev-month"
          onClick={handlePrevMonth}
          disabled={isAllTime}
          className="p-2.5 rounded-2xl border border-stone-200/80 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-stone-600 active:scale-95"
          title="เดือนก่อนหน้า"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5 px-4 py-2 bg-gradient-to-r from-emerald-50/60 to-teal-50/40 border border-emerald-100 rounded-2xl">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span 
            id="display-selected-month"
            className="text-sm sm:text-base font-semibold text-stone-800 tracking-tight select-none"
          >
            {isAllTime ? 'สรุปข้อมูลทั้งหมด (ทุกเดือน)' : formatThaiMonthYear(selectedMonth)}
          </span>
        </div>

        <button
          id="btn-next-month"
          onClick={handleNextMonth}
          disabled={isAllTime}
          className="p-2.5 rounded-2xl border border-stone-200/80 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-stone-600 active:scale-95"
          title="เดือนถัดไป"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Selectors */}
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        {selectedMonth !== currentMonthKey && !isAllTime && (
          <button
            id="btn-jump-current-month"
            onClick={handleResetToCurrentMonth}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-emerald-700 px-3 py-1.5 bg-stone-100/90 hover:bg-emerald-50 rounded-2xl transition-all active:scale-95"
          >
            <RotateCcw className="w-3 h-3 text-emerald-600" />
            <span>เดือนปัจจุบัน</span>
          </button>
        )}

        <div className="flex bg-stone-100/90 p-1 rounded-2xl border border-stone-200/60">
          <button
            id="tab-view-month"
            onClick={() => onToggleAllTime(false)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
              !isAllTime
                ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            รายเดือน
          </button>
          <button
            id="tab-view-all"
            onClick={() => onToggleAllTime(true)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
              isAllTime
                ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            ข้อมูลทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
};
