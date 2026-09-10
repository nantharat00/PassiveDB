import { CategoryInfo } from './types';

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { id: 'food', label: 'อาหาร & เครื่องดื่ม', type: 'expense', iconName: 'Utensils', color: '#EF4444', bgColor: '#FEE2E2' },
  { id: 'transport', label: 'การเดินทาง / ค่าน้ำมัน', type: 'expense', iconName: 'Car', color: '#F97316', bgColor: '#FFEDD5' },
  { id: 'shopping', label: 'ช้อปปิ้ง & ของใช้', type: 'expense', iconName: 'ShoppingBag', color: '#EC4899', bgColor: '#FCE7F3' },
  { id: 'bills', label: 'บิล / ค่าน้ำ ค่าไฟ เน็ต', type: 'expense', iconName: 'Receipt', color: '#8B5CF6', bgColor: '#EDE9FE' },
  { id: 'housing', label: 'ที่พักอาศัย / ค่าเช่า', type: 'expense', iconName: 'Home', color: '#6366F1', bgColor: '#EEF2FF' },
  { id: 'entertainment', label: 'บันเทิง / ท่องเที่ยว', type: 'expense', iconName: 'Film', color: '#06B6D4', bgColor: '#CFFAFE' },
  { id: 'health', label: 'สุขภาพ & ยารักษาโรค', type: 'expense', iconName: 'HeartPulse', color: '#10B981', bgColor: '#D1FAE5' },
  { id: 'education', label: 'การศึกษา & พัฒนาตนเอง', type: 'expense', iconName: 'BookOpen', color: '#3B82F6', bgColor: '#DBEAFE' },
  { id: 'investment', label: 'การออม & ลงทุน', type: 'expense', iconName: 'TrendingUp', color: '#14B8A6', bgColor: '#CCFBF1' },
  { id: 'other_expense', label: 'ค่าใช้จ่ายอื่นๆ', type: 'expense', iconName: 'MoreHorizontal', color: '#64748B', bgColor: '#F1F5F9' },
];

export const INCOME_CATEGORIES: CategoryInfo[] = [
  { id: 'salary', label: 'เงินเดือนประจำ', type: 'income', iconName: 'Briefcase', color: '#10B981', bgColor: '#D1FAE5' },
  { id: 'business', label: 'ธุรกิจ / ค้าขาย', type: 'income', iconName: 'Store', color: '#059669', bgColor: '#A7F3D0' },
  { id: 'freelance', label: 'งานเสริม / ฟรีแลนซ์', type: 'income', iconName: 'Laptop', color: '#0284C7', bgColor: '#BAE6FD' },
  { id: 'investment_return', label: 'ผลตอบแทน / เงินปันผล', type: 'income', iconName: 'BadgeDollarSign', color: '#8B5CF6', bgColor: '#EDE9FE' },
  { id: 'bonus', label: 'โบนัส & เบี้ยเลี้ยง', type: 'income', iconName: 'Gift', color: '#F59E0B', bgColor: '#FEF3C7' },
  { id: 'other_income', label: 'รายรับอื่นๆ', type: 'income', iconName: 'PlusCircle', color: '#64748B', bgColor: '#F1F5F9' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoryInfo = (categoryIdOrLabel: string, type: 'income' | 'expense' = 'expense'): CategoryInfo => {
  const found = ALL_CATEGORIES.find(c => c.id === categoryIdOrLabel || c.label === categoryIdOrLabel);
  if (found) return found;

  return {
    id: categoryIdOrLabel,
    label: categoryIdOrLabel || (type === 'income' ? 'รายรับอื่นๆ' : 'ค่าใช้จ่ายอื่นๆ'),
    type,
    iconName: type === 'income' ? 'PlusCircle' : 'MoreHorizontal',
    color: type === 'income' ? '#10B981' : '#64748B',
    bgColor: type === 'income' ? '#D1FAE5' : '#F1F5F9',
  };
};

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const formatThaiMonthYear = (monthKey: string): string => {
  // monthKey is YYYY-MM
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;
  const thaiYear = year + 543;
  return `${THAI_MONTHS[monthIdx] || ''} ${thaiYear}`;
};

export const formatThaiDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  const thaiYear = year + 543;
  return `${day} ${THAI_MONTHS[monthIdx] || ''} ${thaiYear}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
