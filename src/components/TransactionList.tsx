import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  Edit3, 
  Sparkles,
  CreditCard,
  Banknote,
  Smartphone,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, formatThaiDate, ALL_CATEGORIES } from '../constants';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
  onSeedSampleData: () => void;
  isLoading: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  onOpenAddModal,
  onSeedSampleData,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtering & Sorting
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type match
      if (filterType !== 'all' && tx.type !== filterType) return false;

      // Category match
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;

      // Search match
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesCategory = tx.category.toLowerCase().includes(term);
        const matchesNote = (tx.note || '').toLowerCase().includes(term);
        const matchesAmount = tx.amount.toString().includes(term);
        const matchesDate = tx.date.includes(term);
        if (!matchesCategory && !matchesNote && !matchesAmount && !matchesDate) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
      if (sortBy === 'date_asc') return a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, filterType, selectedCategory, searchTerm, sortBy]);

  const getPaymentBadge = (method?: string) => {
    switch (method) {
      case 'cash':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-medium">
            <Banknote className="w-2.5 h-2.5" /> เงินสด
          </span>
        );
      case 'credit_card':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 font-medium">
            <CreditCard className="w-2.5 h-2.5" /> บัตรเครดิต
          </span>
        );
      case 'transfer':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/70 font-medium">
            <Smartphone className="w-2.5 h-2.5" /> โอน/QR
          </span>
        );
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้ออกจาก PassiveDB?')) {
      onDelete(id);
    }
  };

  return (
    <div id="transaction-list-container" className="bg-white/95 backdrop-blur-xs border border-stone-200/70 rounded-3xl p-4 sm:p-6 shadow-[0_2px_14px_rgba(0,0,0,0.02)] space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-stone-800 tracking-tight flex items-center gap-2">
            รายการบันทึก
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
              {filteredTransactions.length} รายการ
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            บันทึกการเงินทั้งหมดจัดเก็บบนคลาวด์ Firebase PassiveDB
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-50 border border-stone-200/80 rounded-2xl text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="text-xs py-2 px-3 bg-stone-50 border border-stone-200/80 rounded-2xl text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">ทุกประเภท</option>
            <option value="income">เฉพาะรายรับ</option>
            <option value="expense">เฉพาะรายจ่าย</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs py-2 px-3 bg-stone-50 border border-stone-200/80 rounded-2xl text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="date_desc">วันที่: ล่าสุด</option>
            <option value="date_asc">วันที่: เก่าสุด</option>
            <option value="amount_desc">จำนวน: มากไปน้อย</option>
            <option value="amount_asc">จำนวน: น้อยไปมาก</option>
          </select>
        </div>
      </div>

      {/* Transaction Records List */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span>กำลังโหลดข้อมูลจาก Firebase PassiveDB...</span>
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto pr-1">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div
                key={tx.id}
                id={`tx-row-${tx.id}`}
                className="py-3.5 px-3 sm:px-4 hover:bg-emerald-50/30 rounded-2xl transition-all flex items-center justify-between group"
              >
                {/* Left: Category Icon & Title & Note & Date */}
                <div className="flex items-center space-x-3.5 min-w-0">
                  <CategoryIcon categoryName={tx.category} type={tx.type} size={20} />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm font-semibold text-stone-800 truncate">
                        {tx.category}
                      </span>
                      {getPaymentBadge(tx.paymentMethod)}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-stone-400 mt-0.5">
                      <span className="flex items-center gap-1 text-stone-400">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        {formatThaiDate(tx.date)}
                      </span>
                      {tx.note && (
                        <>
                          <span>•</span>
                          <span className="text-stone-600 truncate max-w-[150px] sm:max-w-[280px]" title={tx.note}>
                            {tx.note}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center space-x-2 sm:space-x-3 pl-2">
                  <div className="text-right">
                    <div className={`text-xs sm:text-sm font-bold tracking-tight ${
                      isIncome ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                      {isIncome ? '+' : '-'}฿{formatCurrency(tx.amount)}
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {isIncome ? 'รายรับ' : 'รายจ่าย'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      id={`btn-edit-${tx.id}`}
                      onClick={() => onEdit(tx)}
                      title="แก้ไขรายการ"
                      className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-delete-${tx.id}`}
                      onClick={(e) => handleDeleteClick(tx.id, e)}
                      title="ลบรายการ"
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 px-4 text-center border-2 border-dashed border-stone-200/80 rounded-3xl bg-stone-50/50">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-stone-800">
            ยังไม่มีรายการในรอบนี้
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            เริ่มต้นจดบันทึกรายรับหรือรายจ่ายแรกของคุณ หรือกดโหลดข้อมูลตัวอย่างเพื่อทดลองระบบได้เลย
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-2xl shadow-sm transition-all active:scale-95"
            >
              + จดบันทึกรายการ
            </button>
            <button
              onClick={onSeedSampleData}
              className="px-4 py-2.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-2xl transition-colors inline-flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              โหลดข้อมูลตัวอย่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
