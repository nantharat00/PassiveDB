import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { PieChart as PieIcon, BarChart3, LineChart as TrendIcon, TrendingDown } from 'lucide-react';
import { CategoryBreakdown, DailyComparison, MonthlyTrendData } from '../types';
import { formatCurrency, formatThaiDate } from '../constants';
import { CategoryIcon } from './CategoryIcon';

interface AnalyticsViewProps {
  categoryBreakdown: CategoryBreakdown[];
  dailyData: DailyComparison[];
  monthlyTrend: MonthlyTrendData[];
  totalExpense: number;
  totalIncome: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  categoryBreakdown,
  dailyData,
  monthlyTrend,
  totalExpense,
  totalIncome,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'category' | 'comparison' | 'daily'>('category');

  // Custom Tooltip for Recharts
  const CustomCurrencyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900/95 text-white text-xs rounded-2xl p-3 shadow-xl border border-stone-800">
          <p className="font-semibold text-stone-200 mb-1">{label || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="text-stone-300">{entry.name}:</span>
              <span className="font-semibold text-white">฿{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="analytics-view-container" className="bg-white/95 backdrop-blur-xs border border-stone-200/70 rounded-3xl p-4 sm:p-6 shadow-[0_2px_14px_rgba(0,0,0,0.02)] space-y-6">
      {/* Header & Chart Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-stone-800 tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            กราฟวิเคราะห์ข้อมูลการเงิน
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            สรุปสัดส่วนค่าใช้จ่าย แนวโน้มรายรับ-รายจ่าย และความเคลื่อนไหว
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-stone-100/90 p-1 rounded-2xl border border-stone-200/60 self-start sm:self-auto">
          <button
            id="tab-chart-category"
            onClick={() => setActiveChartTab('category')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
              activeChartTab === 'category'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>สัดส่วนรายจ่าย</span>
          </button>
          <button
            id="tab-chart-comparison"
            onClick={() => setActiveChartTab('comparison')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
              activeChartTab === 'comparison'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            <span>เปรียบเทียบรายเดือน</span>
          </button>
          <button
            id="tab-chart-daily"
            onClick={() => setActiveChartTab('daily')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
              activeChartTab === 'daily'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <TrendIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>แนวโน้มรายวัน</span>
          </button>
        </div>
      </div>

      {/* Chart Display Area */}
      {activeChartTab === 'category' && (
        <div id="category-chart-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Pie/Donut Chart */}
          <div className="lg:col-span-5 h-[260px] sm:h-[290px] relative flex items-center justify-center">
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomCurrencyTooltip />} />
                  <Pie
                    data={categoryBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400 text-xs py-10">
                ยังไม่มีข้อมูลรายจ่ายในรอบเดือนนี้
              </div>
            )}
            {categoryBreakdown.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-medium text-slate-400">รายจ่ายรวม</span>
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  ฿{formatCurrency(totalExpense)}
                </span>
              </div>
            )}
          </div>

          {/* Category Breakdown Progress Bars & List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              หมวดหมู่รายจ่ายยอดนิยม
            </h3>
            {categoryBreakdown.length > 0 ? (
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                      <div className="flex items-center space-x-2">
                        <CategoryIcon categoryName={cat.category} size={14} />
                        <span className="font-semibold text-slate-800">{cat.category}</span>
                        <span className="text-[10px] text-slate-400">({cat.count} รายการ)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">฿{formatCurrency(cat.amount)}</span>
                        <span className="text-xs text-slate-400 ml-1.5">({cat.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    {/* Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                ไม่มีรายการรายจ่ายสำหรับคำนวณสัดส่วน
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monthly Comparison Bar Chart */}
      {activeChartTab === 'comparison' && (
        <div id="monthly-comparison-chart" className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>เปรียบเทียบรายรับ รายจ่าย และเงินคงเหลือสะสมย้อนหลัง</span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span>รายรับ</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-rose-500"></span>รายจ่าย</span>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="monthLabel" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `฿${val > 999 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomCurrencyTooltip />} />
                <Bar dataKey="income" name="รายรับ" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={36} />
                <Bar dataKey="expense" name="รายจ่าย" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Daily Spending Trend Area/Line Chart */}
      {activeChartTab === 'daily' && (
        <div id="daily-trend-chart" className="space-y-3">
          <div className="text-xs text-slate-500 px-1">
            ความเคลื่อนไหวการใช้จ่ายในแต่ละวันของรอบเดือนที่เลือก
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tickFormatter={(val) => `วันที่ ${val}`}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `฿${val > 999 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomCurrencyTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  name="รายรับ" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name="รายจ่าย" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
