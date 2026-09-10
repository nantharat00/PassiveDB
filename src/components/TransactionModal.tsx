import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, CreditCard, FileText } from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: Omit<Transaction, 'id' | 'userId' | 'userEmail' | 'createdAt'>, existingId?: string) => Promise<void>;
  editingTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('อาหาร & เครื่องดื่ม');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setNote(editingTransaction.note || '');
      setPaymentMethod(editingTransaction.paymentMethod || 'transfer');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setType('expense');
      setAmount('');
      setCategory('อาหาร & เครื่องดื่ม');
      setDate(today);
      setNote('');
      setPaymentMethod('transfer');
    }
    setErrorMessage('');
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0].label);
    } else {
      setCategory(EXPENSE_CATEGORIES[0].label);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('กรุณาระบุจำนวนเงินที่ถูกต้อง (มากกว่า 0)');
      return;
    }
    if (!date) {
      setErrorMessage('กรุณาเลือกวันที่');
      return;
    }
    if (!category) {
      setErrorMessage('กรุณาเลือกหมวดหมู่');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await onSave({
        type,
        amount: numAmount,
        category,
        date,
        note: note.trim(),
        paymentMethod,
      }, editingTransaction ? editingTransaction.id : undefined);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="transaction-modal-backdrop" 
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        id="transaction-modal-container"
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <h3 className="text-base sm:text-lg font-semibold text-stone-800">
            {editingTransaction ? 'แก้ไขรายการ' : 'จดบันทึกรายการ'}
          </h3>
          <button
            id="btn-close-transaction-modal"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle: Income vs Expense */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200/60">
            <button
              type="button"
              id="btn-type-expense"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              รายจ่าย (Expense)
            </button>
            <button
              type="button"
              id="btn-type-income"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              รายรับ (Income)
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              จำนวนเงิน (บาท) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-lg">
                ฿
              </span>
              <input
                id="input-transaction-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                required
                className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xl sm:text-2xl font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              วันที่ทำรายการ *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="input-transaction-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              เลือกหมวดหมู่ *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1.5 border border-stone-200 rounded-2xl bg-stone-50/60">
              {currentCategories.map((cat) => {
                const isSelected = category === cat.label;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.label)}
                    className={`flex items-center space-x-2 p-2 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-white border-emerald-500 text-emerald-900 shadow-xs font-semibold'
                        : 'bg-transparent border-transparent hover:bg-white text-stone-700'
                    }`}
                  >
                    <CategoryIcon categoryName={cat.label} type={type} size={14} />
                    <span className="text-xs truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              ช่องทางการชำระ
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`py-2 px-2 text-xs rounded-2xl font-medium border text-center transition-all ${
                  paymentMethod === 'transfer'
                    ? 'bg-sky-50 border-sky-300 text-sky-700 font-semibold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                โอนเงิน / QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-2 text-xs rounded-2xl font-medium border text-center transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                เงินสด
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`py-2 px-2 text-xs rounded-2xl font-medium border text-center transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                บัตรเครดิต
              </button>
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              บันทึกช่วยจำ (ถ้ามี)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                id="input-transaction-note"
                type="text"
                maxLength={100}
                placeholder="เช่น ข้าวกลางวัน, กาแฟส้ม, เติมน้ำมัน..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl">
              {errorMessage}
            </div>
          )}

          {/* Submit and Cancel */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-2xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              id="btn-submit-transaction"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-2xl shadow-sm transition-all disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? 'กำลังบันทึกลง PassiveDB...' : editingTransaction ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
