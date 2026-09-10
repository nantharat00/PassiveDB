import React, { useState, useEffect, useMemo } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  logoutUser, 
  User 
} from './firebase';
import { 
  Transaction, 
  MonthlySummary, 
  CategoryBreakdown, 
  DailyComparison, 
  MonthlyTrendData 
} from './types';
import { 
  subscribeToUserTransactions, 
  addTransactionToPassiveDb, 
  updateTransactionInPassiveDb, 
  deleteTransactionFromPassiveDb,
  saveMonthlyBudget,
  subscribeToMonthlyBudget,
  seedSampleTransactionsToPassiveDb 
} from './services/passiveDbService';
import { Navbar } from './components/Navbar';
import { MonthSelector } from './components/MonthSelector';
import { SummaryCards } from './components/SummaryCards';
import { AnalyticsView } from './components/AnalyticsView';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { AuthScreen } from './components/AuthScreen';
import { getCategoryInfo, THAI_MONTHS } from './constants';

export default function App() {
  // Current user state from Firebase Auth
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Selected Month: YYYY-MM
  const today = new Date();
  const initialMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [isAllTime, setIsAllTime] = useState<boolean>(false);

  // Transactions list from PassiveDB
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(true);

  // Monthly Budget from Firestore
  const [currentBudget, setCurrentBudget] = useState<number | null>(null);

  // Modals state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);

  // 1. Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to real-time transactions in PassiveDB when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setIsLoadingTransactions(false);
      return;
    }

    setIsLoadingTransactions(true);
    const unsubscribe = subscribeToUserTransactions(
      currentUser.uid,
      (txs) => {
        setTransactions(txs);
        setIsLoadingTransactions(false);
      },
      (err) => {
        console.error('Failed to subscribe to PassiveDB:', err);
        setIsLoadingTransactions(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Subscribe to budget for the selected month
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToMonthlyBudget(
      currentUser.uid,
      selectedMonth,
      (budget) => {
        setCurrentBudget(budget);
      }
    );
    return () => unsubscribe();
  }, [currentUser, selectedMonth]);

  // 4. Filtered transactions for the selected month (or all)
  const currentPeriodTransactions = useMemo(() => {
    if (isAllTime) {
      return transactions;
    }
    return transactions.filter((tx) => tx.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth, isAllTime]);

  // 5. Compute Monthly Summary
  const monthlySummary = useMemo<MonthlySummary>(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const expenseCategoryMap: Record<string, number> = {};

    currentPeriodTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        expenseCategoryMap[tx.category] = (expenseCategoryMap[tx.category] || 0) + tx.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netBalance > 0 ? netBalance : 0) / totalIncome) * 100 : 0;

    // Calculate days for daily average
    const [yearStr, monthStr] = selectedMonth.split('-');
    const daysInMonth = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate();
    const averageDailyExpense = daysInMonth > 0 ? totalExpense / daysInMonth : 0;

    // Find highest expense category
    let highestCat: { category: string; amount: number } | null = null;
    Object.entries(expenseCategoryMap).forEach(([cat, amount]) => {
      if (!highestCat || amount > highestCat.amount) {
        highestCat = { category: cat, amount };
      }
    });

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      transactionCount: currentPeriodTransactions.length,
      averageDailyExpense,
      highestExpenseCategory: highestCat,
    };
  }, [currentPeriodTransactions, selectedMonth]);

  // 6. Compute Category Breakdown (Pie / Donut chart)
  const categoryBreakdown = useMemo<CategoryBreakdown[]>(() => {
    const expenses = currentPeriodTransactions.filter((tx) => tx.type === 'expense');
    const totalExp = expenses.reduce((sum, tx) => sum + tx.amount, 0);
    if (totalExp === 0) return [];

    const map: Record<string, { amount: number; count: number }> = {};
    expenses.forEach((tx) => {
      if (!map[tx.category]) {
        map[tx.category] = { amount: 0, count: 0 };
      }
      map[tx.category].amount += tx.amount;
      map[tx.category].count += 1;
    });

    return Object.entries(map)
      .map(([cat, data]) => {
        const catInfo = getCategoryInfo(cat, 'expense');
        return {
          category: cat,
          amount: data.amount,
          percentage: (data.amount / totalExp) * 100,
          color: catInfo.color,
          count: data.count,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [currentPeriodTransactions]);

  // 7. Compute Daily Comparison data
  const dailyData = useMemo<DailyComparison[]>(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    const dailyMap: Record<number, { income: number; expense: number }> = {};
    for (let i = 1; i <= daysInMonth; i++) {
      dailyMap[i] = { income: 0, expense: 0 };
    }

    currentPeriodTransactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const day = txDate.getDate();
      if (dailyMap[day]) {
        if (tx.type === 'income') {
          dailyMap[day].income += tx.amount;
        } else {
          dailyMap[day].expense += tx.amount;
        }
      }
    });

    return Object.entries(dailyMap).map(([dayStr, val]) => ({
      day: parseInt(dayStr, 10),
      dateString: `${selectedMonth}-${dayStr.padStart(2, '0')}`,
      income: val.income,
      expense: val.expense,
    }));
  }, [currentPeriodTransactions, selectedMonth]);

  // 8. Compute Monthly Trend Data (Last 6 months)
  const monthlyTrend = useMemo<MonthlyTrendData[]>(() => {
    const result: MonthlyTrendData[] = [];
    const [currY, currM] = selectedMonth.split('-');
    const baseDate = new Date(parseInt(currY, 10), parseInt(currM, 10) - 1, 1);

    for (let i = 5; i >= 0; i--) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${y}-${m}`;
      const thaiMonthName = THAI_MONTHS[d.getMonth()];
      const label = `${thaiMonthName.slice(0, 3)} ${(y + 543).toString().slice(-2)}`;

      // Filter transactions in this month
      let inc = 0;
      let exp = 0;
      transactions.forEach((tx) => {
        if (tx.date.startsWith(key)) {
          if (tx.type === 'income') inc += tx.amount;
          else exp += tx.amount;
        }
      });

      result.push({
        monthKey: key,
        monthLabel: label,
        income: inc,
        expense: exp,
        savings: inc - exp,
      });
    }

    return result;
  }, [transactions, selectedMonth]);

  // Handler: Add or update transaction
  const handleSaveTransaction = async (
    data: Omit<Transaction, 'id' | 'userId' | 'userEmail' | 'createdAt'>,
    existingId?: string
  ) => {
    if (!currentUser) return;
    if (existingId) {
      await updateTransactionInPassiveDb(existingId, currentUser.uid, data);
    } else {
      await addTransactionToPassiveDb(currentUser.uid, currentUser.email || undefined, data);
    }
  };

  // Handler: Delete transaction
  const handleDeleteTransaction = async (id: string) => {
    await deleteTransactionFromPassiveDb(id);
  };

  // Handler: Save budget
  const handleSaveBudget = async (amount: number) => {
    if (!currentUser) return;
    await saveMonthlyBudget(currentUser.uid, selectedMonth, amount);
  };

  // Handler: Seed sample data
  const handleSeedSampleData = async () => {
    if (!currentUser) return;
    try {
      await seedSampleTransactionsToPassiveDb(currentUser.uid, currentUser.email || '');
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  // Handler: Export CSV
  const handleExportCsv = () => {
    if (currentPeriodTransactions.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const headers = ['วันที่', 'ประเภท', 'หมวดหมู่', 'จำนวนเงิน(บาท)', 'ช่องทางชำระ', 'บันทึกช่วยจำ'];
    const rows = currentPeriodTransactions.map((tx) => [
      `"${tx.date}"`,
      `"${tx.type === 'income' ? 'รายรับ' : 'รายจ่าย'}"`,
      `"${tx.category}"`,
      tx.amount.toFixed(2),
      `"${tx.paymentMethod === 'cash' ? 'เงินสด' : tx.paymentMethod === 'credit_card' ? 'บัตรเครดิต' : 'โอน/QR'}"`,
      `"${(tx.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_report_${isAllTime ? 'all' : selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading indicator for Firebase Auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#fbfbf9] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-stone-500 font-medium">กำลังเชื่อมต่อ Firebase PassiveDB...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show AuthScreen
  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div id="main-app-wrapper" className="min-h-screen bg-[#fbfbf9] text-stone-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsTransactionModalOpen(true);
        }}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onLogout={logoutUser}
        onExportCsv={handleExportCsv}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Month Selector Bar */}
        <MonthSelector
          selectedMonth={selectedMonth}
          onChangeMonth={setSelectedMonth}
          isAllTime={isAllTime}
          onToggleAllTime={setIsAllTime}
        />

        {/* 4 Summary Cards & Monthly Budget */}
        <SummaryCards
          summary={monthlySummary}
          budgetAmount={currentBudget}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        />

        {/* Analytical Graphs & Charts Section */}
        <AnalyticsView
          categoryBreakdown={categoryBreakdown}
          dailyData={dailyData}
          monthlyTrend={monthlyTrend}
          totalExpense={monthlySummary.totalExpense}
          totalIncome={monthlySummary.totalIncome}
        />

        {/* Transactions Records List & Operations */}
        <TransactionList
          transactions={currentPeriodTransactions}
          onEdit={(tx) => {
            setEditingTransaction(tx);
            setIsTransactionModalOpen(true);
          }}
          onDelete={handleDeleteTransaction}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsTransactionModalOpen(true);
          }}
          onSeedSampleData={handleSeedSampleData}
          isLoading={isLoadingTransactions}
        />
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-stone-200/60 py-5 text-center text-xs text-stone-400 space-y-1">
        <p className="font-medium text-stone-500">วิทยาลัยอาชีวศึกษาแพร่ • Phrae Vocational College</p>
        <p>บันทึกรายรับรายจ่าย • ซิงค์อัตโนมัติบน Google Cloud Firebase (PassiveDB)</p>
      </footer>

      {/* Modals */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentBudget={currentBudget}
        selectedMonth={selectedMonth}
        onSaveBudget={handleSaveBudget}
      />
    </div>
  );
}
