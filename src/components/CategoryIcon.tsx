import React from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Receipt, 
  Home, 
  Film, 
  HeartPulse, 
  BookOpen, 
  TrendingUp, 
  Briefcase, 
  Store, 
  Laptop, 
  BadgeDollarSign, 
  Gift, 
  MoreHorizontal, 
  PlusCircle,
  LucideIcon 
} from 'lucide-react';
import { getCategoryInfo } from '../constants';

interface CategoryIconProps {
  categoryName: string;
  type?: 'income' | 'expense';
  size?: number;
  className?: string;
  showBackground?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Home,
  Film,
  HeartPulse,
  BookOpen,
  TrendingUp,
  Briefcase,
  Store,
  Laptop,
  BadgeDollarSign,
  Gift,
  MoreHorizontal,
  PlusCircle,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryName,
  type = 'expense',
  size = 18,
  className = '',
  showBackground = true,
}) => {
  const safeType: 'income' | 'expense' = type === 'income' ? 'income' : 'expense';
  const info = getCategoryInfo(categoryName, safeType);
  const IconComponent = ICON_MAP[info.iconName] || (safeType === 'income' ? PlusCircle : MoreHorizontal);

  if (!showBackground) {
    return (
      <span style={{ color: info.color }} className={className}>
        <IconComponent size={size} />
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl transition-all ${className}`}
      style={{
        backgroundColor: info.bgColor,
        color: info.color,
        width: `${size + 16}px`,
        height: `${size + 16}px`,
      }}
    >
      <IconComponent size={size} />
    </div>
  );
};
