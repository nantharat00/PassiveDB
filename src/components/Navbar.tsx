import React from 'react';
import { 
  Wallet, 
  Database, 
  LogOut, 
  Plus, 
  Target, 
  User as UserIcon,
  Download,
  Sparkles
} from 'lucide-react';
import { User } from '../firebase';

interface NavbarProps {
  user: User | null;
  onOpenAddModal: () => void;
  onOpenBudgetModal: () => void;
  onLogout: () => void;
  onExportCsv: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAddModal,
  onOpenBudgetModal,
  onLogout,
  onExportCsv,
}) => {
  return (
    <header 
      id="app-navbar"
      className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-stone-200/70 shadow-[0_2px_16px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Database Badge */}
          <div className="flex items-center space-x-3">
            <div 
              id="brand-logo-container"
              className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <img 
                src="/logo.png" 
                alt="ตราประจำวิทยาลัยอาชีวศึกษาแพร่" 
                className="w-full h-full object-contain drop-shadow-xs"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-semibold text-stone-800 tracking-tight leading-snug">
                  ระบบจัดการรายรับรายจ่าย
                </h1>
                <span 
                  id="passivedb-badge" 
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs"
                  title="ข้อมูลถูกบันทึกและซิงค์ผ่าน Firebase PassiveDB แบบเรียลไทม์"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <Database className="w-3 h-3 text-emerald-600" />
                  PassiveDB
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 hidden sm:block mt-0.5 font-medium">
                วิทยาลัยอาชีวศึกษาแพร่ (Phrae Vocational College)
              </p>
            </div>
          </div>

          {/* Action Buttons & User Info */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Quick Export Button */}
            <button
              id="btn-export-csv"
              onClick={onExportCsv}
              title="ดาวน์โหลดสรุปข้อมูล (CSV)"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200/80 hover:text-stone-800 rounded-2xl transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>ส่งออก CSV</span>
            </button>

            {/* Set Budget Button */}
            <button
              id="btn-open-budget-modal"
              onClick={onOpenBudgetModal}
              title="ตั้งค่างบประมาณรายเดือน"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 rounded-2xl transition-all active:scale-95"
            >
              <Target className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">ตั้งงบเดือนนี้</span>
            </button>

            {/* Add Transaction Button */}
            <button
              id="btn-open-add-transaction"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-2xl shadow-sm shadow-emerald-500/20 transition-all hover:shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>จดบันทึก</span>
            </button>

            {/* User Profile / Gmail */}
            {user && (
              <div 
                id="user-profile-widget" 
                className="flex items-center pl-1 sm:pl-2 border-l border-stone-200/80 space-x-2"
              >
                <div className="flex items-center space-x-2 bg-stone-50 py-1 px-1.5 sm:px-2 rounded-2xl border border-stone-200/60">
                  {user.photoURL ? (
                    <img
                      id="user-avatar-img"
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-emerald-200 object-cover shadow-xs"
                    />
                  ) : (
                    <div 
                      id="user-avatar-placeholder"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold text-xs"
                    >
                      {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon size={14} />}
                    </div>
                  )}
                  <div className="hidden lg:block text-left max-w-[140px]">
                    <div className="text-xs font-semibold text-stone-800 truncate">
                      {user.displayName || 'ผู้ใช้งาน'}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate" title={user.email || ''}>
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="ออกจากระบบ"
                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
