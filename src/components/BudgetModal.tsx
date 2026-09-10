import React, { useState, useEffect } from 'react';
import { X, Target, Check } from 'lucide-react';
import { formatThaiMonthYear } from '../constants';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number | null;
  selectedMonth: string;
  onSaveBudget: (amount: number) => Promise<void>;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  selectedMonth,
  onSaveBudget,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (currentBudget !== null && currentBudget > 0) {
      setAmount(currentBudget.toString());
    } else {
      setAmount('');
    }
    setError('');
  }, [currentBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('กรุณากรอกจำนวนเงินงบประมาณที่ถูกต้อง');
      return;
    }
    try {
      setIsSubmitting(true);
      setError('');
      await onSaveBudget(num);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = [10000, 15000, 20000, 30000, 50000];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-stone-800">
              ตั้งงบประมาณรายจ่าย
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-stone-500">
            กำหนดวงเงินงบประมาณการใช้จ่ายสำหรับ <span className="font-semibold text-stone-800">{formatThaiMonthYear(selectedMonth)}</span>
          </p>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              งบประมาณสูงสุด (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-lg">
                ฿
              </span>
              <input
                type="number"
                step="100"
                min="100"
                placeholder="เช่น 25000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                required
                className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xl font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          {/* Quick options */}
          <div className="space-y-1">
            <span className="text-[11px] text-stone-400 font-medium">ค่ายอดนิยม:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.toString())}
                  className="px-3 py-1.5 text-xs bg-stone-100/80 hover:bg-indigo-50 hover:text-indigo-600 text-stone-600 font-medium rounded-xl border border-stone-200/60 transition-all active:scale-95"
                >
                  ฿{q.toLocaleString('th-TH')}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-2xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-sm transition-all disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกงบประมาณ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
