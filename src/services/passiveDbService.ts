import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Transaction, MonthlyBudget } from '../types';

// The user requested to store data in Firebase at PassiveDB
export const PASSIVE_DB_COLLECTION = 'passivedb';
export const BUDGETS_COLLECTION = 'budgets';

/**
 * Subscribe to all transactions for a specific user from PassiveDB in real-time
 */
export const subscribeToUserTransactions = (
  userId: string, 
  callback: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void
) => {
  const colRef = collection(db, PASSIVE_DB_COLLECTION);
  const q = query(
    colRef,
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const transactions: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        transactions.push({
          id: docSnap.id,
          userId: data.userId,
          userEmail: data.userEmail || '',
          type: data.type,
          amount: Number(data.amount) || 0,
          category: data.category,
          date: data.date,
          note: data.note || '',
          paymentMethod: data.paymentMethod || 'transfer',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt,
        });
      });
      callback(transactions);
    },
    (err) => {
      console.error('PassiveDB Firestore snapshot error:', err);
      // Fallback: If ordering requires index or failed, try querying without orderBy and sort client-side
      const fallbackQuery = query(colRef, where('userId', '==', userId));
      onSnapshot(fallbackQuery, (fallbackSnapshot) => {
        const transactions: Transaction[] = [];
        fallbackSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          transactions.push({
            id: docSnap.id,
            userId: data.userId,
            userEmail: data.userEmail || '',
            type: data.type,
            amount: Number(data.amount) || 0,
            category: data.category,
            date: data.date,
            note: data.note || '',
            paymentMethod: data.paymentMethod || 'transfer',
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt,
          });
        });
        // Sort in memory by date descending
        transactions.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
        callback(transactions);
      }, (fallbackErr) => {
        if (onError) onError(fallbackErr);
      });
    }
  );
};

/**
 * Add a new income/expense record to PassiveDB
 */
export const addTransactionToPassiveDb = async (
  userId: string,
  userEmail: string | undefined,
  transactionData: Omit<Transaction, 'id' | 'userId' | 'userEmail' | 'createdAt'>
): Promise<string> => {
  const colRef = collection(db, PASSIVE_DB_COLLECTION);
  const now = new Date().toISOString();
  
  const docRef = await addDoc(colRef, {
    userId,
    userEmail: userEmail || '',
    type: transactionData.type,
    amount: Number(transactionData.amount),
    category: transactionData.category,
    date: transactionData.date,
    note: transactionData.note || '',
    paymentMethod: transactionData.paymentMethod || 'transfer',
    createdAt: now,
  });

  return docRef.id;
};

/**
 * Update an existing transaction in PassiveDB
 */
export const updateTransactionInPassiveDb = async (
  id: string,
  userId: string,
  updates: Partial<Omit<Transaction, 'id' | 'userId'>>
): Promise<void> => {
  const docRef = doc(db, PASSIVE_DB_COLLECTION, id);
  const cleanUpdates: Record<string, any> = {
    ...updates,
    userId,
    updatedAt: new Date().toISOString()
  };
  if (updates.amount !== undefined) {
    cleanUpdates.amount = Number(updates.amount);
  }
  await updateDoc(docRef, cleanUpdates);
};

/**
 * Delete a transaction from PassiveDB
 */
export const deleteTransactionFromPassiveDb = async (id: string): Promise<void> => {
  const docRef = doc(db, PASSIVE_DB_COLLECTION, id);
  await deleteDoc(docRef);
};

/**
 * Save monthly budget in Firestore
 */
export const saveMonthlyBudget = async (
  userId: string,
  monthKey: string, // YYYY-MM
  budgetAmount: number
): Promise<void> => {
  const budgetDocId = `${userId}_${monthKey}`;
  const docRef = doc(db, BUDGETS_COLLECTION, budgetDocId);
  await setDoc(docRef, {
    userId,
    month: monthKey,
    budgetAmount: Number(budgetAmount),
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

/**
 * Subscribe to monthly budget
 */
export const subscribeToMonthlyBudget = (
  userId: string,
  monthKey: string,
  callback: (budget: number | null) => void
) => {
  const budgetDocId = `${userId}_${monthKey}`;
  const docRef = doc(db, BUDGETS_COLLECTION, budgetDocId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(Number(docSnap.data().budgetAmount) || 0);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn('Could not fetch budget:', err);
    callback(null);
  });
};

/**
 * Seed initial starter transactions in PassiveDB for an empty account so the user can immediately see graphs
 */
export const seedSampleTransactionsToPassiveDb = async (userId: string, userEmail: string): Promise<void> => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  
  const sampleItems: Array<Omit<Transaction, 'id' | 'userId' | 'userEmail' | 'createdAt'>> = [
    {
      type: 'income',
      amount: 45000,
      category: 'เงินเดือนประจำ',
      date: `${year}-${month}-01`,
      note: 'เงินเดือนโอนเข้าบัญชี',
      paymentMethod: 'transfer',
    },
    {
      type: 'income',
      amount: 6500,
      category: 'งานเสริม / ฟรีแลนซ์',
      date: `${year}-${month}-05`,
      note: 'โปรเจกต์งานดีไซน์เสริม',
      paymentMethod: 'transfer',
    },
    {
      type: 'expense',
      amount: 9500,
      category: 'ที่พักอาศัย / ค่าเช่า',
      date: `${year}-${month}-02`,
      note: 'ค่าเช่าคอนโดมิเนียม',
      paymentMethod: 'transfer',
    },
    {
      type: 'expense',
      amount: 2450,
      category: 'บิล / ค่าน้ำ ค่าไฟ เน็ต',
      date: `${year}-${month}-04`,
      note: 'ค่าไฟและอินเทอร์เน็ตบ้าน',
      paymentMethod: 'transfer',
    },
    {
      type: 'expense',
      amount: 450,
      category: 'อาหาร & เครื่องดื่ม',
      date: `${year}-${month}-06`,
      note: 'ทานอาหารกลางวันและกาแฟ',
      paymentMethod: 'cash',
    },
    {
      type: 'expense',
      amount: 1200,
      category: 'การเดินทาง / ค่าน้ำมัน',
      date: `${year}-${month}-08`,
      note: 'เติมน้ำมันรถยนต์',
      paymentMethod: 'credit_card',
    },
    {
      type: 'expense',
      amount: 1890,
      category: 'ช้อปปิ้ง & ของใช้',
      date: `${year}-${month}-09`,
      note: 'ของใช้เข้าบ้าน ซูเปอร์มาร์เก็ต',
      paymentMethod: 'credit_card',
    },
    {
      type: 'expense',
      amount: 600,
      category: 'บันเทิง / ท่องเที่ยว',
      date: `${year}-${month}-10`,
      note: 'ตั๋วชมภาพยนตร์ & ป๊อปคอร์น',
      paymentMethod: 'transfer',
    },
  ];

  for (const item of sampleItems) {
    await addTransactionToPassiveDb(userId, userEmail, item);
  }

  // Also set a default budget
  await saveMonthlyBudget(userId, `${year}-${month}`, 25000);
};
