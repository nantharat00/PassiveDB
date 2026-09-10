import React from 'react';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Wallet, 
  PiggyBank, 
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { MonthlySummary } from '../types';
import { formatCurrency } from '../constants';

interface SummaryCardsProps {
  summary: MonthlySummary;
  budgetAmount: number | null;
  onOpenBudgetModal: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  summary,
  budgetAmount,
  onOpenBudgetModal,
}) => {
  const isPositiveBalance = summary.netBalance >= 0;
  
  // Budget calculations
  const hasBudget = budgetAmount !== null && budgetAmount > 0;
  const budgetSpentPercent = hasBudget 
    ? Math.min(Math.round((summary.totalExpense / budgetAmount) * 100), 100)
    : 0;
  const budgetRemaining = hasBudget ? budgetAmount - summary.totalExpense : 0;
  const isBudgetExceeded = hasBudget && summary.totalExpense > budgetAmount;

  return (
    <div id="summary-cards-section" className="space-y-4">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Income */}
        <div 
          id="card-total-income" 
          className="bg-white/95 backdrop-blur-xs border border-stone-200/70 hover:border-emerald-200/80 rounded-3xl p-4 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.02)] transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 tracking-wide">
              รายรับรวม
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100/60 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight">
              ฿{formatCurrency(summary.totalIncome)}
            </div>
            <div className="mt-1 flex items-center text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              <span>รายรับทั้งหมดของรอบ</span>
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div 
          id="card-total-expense" 
          className="bg-white/95 backdrop-blur-xs border border-stone-200/70 hover:border-rose-200/80 rounded-3xl p-4 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.02)] transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 tracking-wide">
              รายจ่ายรวม
            </span>
            <div className="w-9 h-9 rounded-2xl bg-rose-100/60 text-rose-500 flex items-center justify-center transition-transform group-hover:scale-105">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight">
              ฿{formatCurrency(summary.totalExpense)}
            </div>
            <div className="mt-1 flex items-center text-xs text-stone-500">
              <span>เฉลี่ย ฿{formatCurrency(summary.averageDailyExpense)} / วัน</span>
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div 
          id="card-net-balance" 
          className="bg-white/95 backdrop-blur-xs border border-stone-200/70 hover:border-indigo-200/80 rounded-3xl p-4 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.02)] transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 tracking-wide">
              ยอดคงเหลือสุทธิ
            </span>
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isPositiveBalance ? 'bg-indigo-100/60 text-indigo-600' : 'bg-amber-100/60 text-amber-600'
            }`}>
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isPositiveBalance ? 'text-indigo-600' : 'text-rose-600'
            }`}>
              {isPositiveBalance ? '+' : ''}฿{formatCurrency(summary.netBalance)}
            </div>
            <div className="mt-1 flex items-center text-xs text-stone-500">
              {isPositiveBalance ? (
                <span className="text-emerald-600 font-medium">✨ กระแสเงินสดเป็นบวก</span>
              ) : (
                <span className="text-rose-600 font-medium">⚠️ รายจ่ายมากกว่ารายรับ</span>
              )}
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div 
          id="card-savings-rate" 
          className="bg-white/95 backdrop-blur-xs border border-stone-200/70 hover:border-teal-200/80 rounded-3xl p-4 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.02)] transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 tracking-wide">
              อัตราการออม
            </span>
            <div className="w-9 h-9 rounded-2xl bg-teal-100/60 text-teal-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight">
              {summary.totalIncome > 0 ? `${summary.savingsRate.toFixed(1)}%` : '0.0%'}
            </div>
            <div className="mt-1 text-xs text-stone-500">
              {summary.savingsRate >= 20 ? (
                <span className="text-teal-600 font-medium">🎯 ออมได้ดีมาก (20%+)</span>
              ) : summary.savingsRate > 0 ? (
                <span className="text-amber-600">ค่อยๆ เพิ่มการออมนะ</span>
              ) : (
                <span className="text-stone-400">ยังไม่มีเงินออมในรอบนี้</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Budget Bar Banner */}
      <div 
        id="card-monthly-budget-bar"
        className="bg-white/95 backdrop-blur-xs border border-stone-200/70 rounded-3xl p-4 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.02)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center flex-wrap gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-stone-800">
              งบประมาณรายจ่ายประจำเดือน
            </span>
            {hasBudget && isBudgetExceeded && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
                <AlertTriangle className="w-3 h-3" />
                เกินงบที่ตั้งไว้แล้ว
              </span>
            )}
            {hasBudget && !isBudgetExceeded && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3" />
                ยังอยู่ในเกณฑ์งบ
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {hasBudget ? (
              <div className="text-xs text-stone-600">
                ใช้ไป <span className="font-semibold text-stone-800">฿{formatCurrency(summary.totalExpense)}</span> / ฿{formatCurrency(budgetAmount)}
                <span className="ml-1 text-stone-400">({budgetSpentPercent}%)</span>
              </div>
            ) : (
              <span className="text-xs text-stone-400">ยังไม่ได้ตั้งงบประมาณของเดือนนี้</span>
            )}
            <button
              id="btn-edit-budget-target"
              onClick={onOpenBudgetModal}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-2 px-2.5 py-1 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              {hasBudget ? 'แก้ไขงบ' : '+ ตั้งงบประมาณ'}
            </button>
          </div>
        </div>

        {hasBudget ? (
          <div>
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBudgetExceeded 
                    ? 'bg-rose-500' 
                    : budgetSpentPercent > 80 
                    ? 'bg-amber-500' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${Math.min(budgetSpentPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-stone-500 mt-2">
              <span>0%</span>
              <span>
                {budgetRemaining >= 0 ? (
                  <>เหลืองบใช้จ่ายอีก <strong className="text-emerald-700">฿{formatCurrency(budgetRemaining)}</strong></>
                ) : (
                  <>เกินงบไปแล้ว <strong className="text-rose-600">฿{formatCurrency(Math.abs(budgetRemaining))}</strong></>
                )}
              </span>
              <span>100%</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-400 mt-1">
            ตั้งเป้างบประมาณรายเดือนเพื่อช่วยเตือนและคุมการใช้จ่ายให้อยู่ในแผน
          </p>
        )}
      </div>
    </div>
  );
};
