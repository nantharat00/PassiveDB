import React, { useState } from 'react';
import { 
  Wallet, 
  Database, 
  BarChart3, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { signInWithGoogle } from '../firebase';

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('หน้าต่างเข้าสู่ระบบถูกปิด กรุณาลองใหม่อีกครั้ง');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('เบราว์เซอร์บล็อกหน้าต่างป๊อปอัป กรุณาอนุญาตป๊อปอัปสำหรับเว็บไซต์นี้');
      } else {
        setAuthError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      id="auth-screen-container"
      className="min-h-screen bg-[#fbfbf9] flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* College Emblem Logo */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 flex items-center justify-center filter drop-shadow-sm hover:scale-105 transition-transform">
          <img 
            src="/logo.png" 
            alt="ตราประจำวิทยาลัยอาชีวศึกษาแพร่" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
          ระบบจัดการรายรับรายจ่าย
        </h1>
        <p className="mt-1 text-sm font-semibold text-emerald-800">
          วิทยาลัยอาชีวศึกษาแพร่
        </p>
        <p className="text-xs text-stone-500 font-medium">
          Phrae Vocational College
        </p>

        {/* PassiveDB Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>เชื่อมต่อคลาวด์ Firebase PassiveDB</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-xs py-8 px-6 sm:px-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-stone-200/80 rounded-3xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-base font-semibold text-stone-800">
              เข้าสู่ระบบเพื่อเริ่มใช้งาน
            </h2>
            <p className="text-xs text-stone-500">
              บันทึกข้อมูลส่วนตัวของคุณอย่างปลอดภัยด้วยบัญชี Gmail
            </p>
          </div>

          {/* Error message */}
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            id="btn-google-login"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-stone-200 rounded-2xl bg-white hover:bg-stone-50 active:scale-98 text-stone-700 font-medium text-sm shadow-xs hover:border-stone-300 transition-all disabled:opacity-60"
          >
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'กำลังเชื่อมต่อ Gmail...' : 'เข้าสู่ระบบด้วย Gmail'}</span>
          </button>

          {/* App Highlights */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-start space-x-3 text-xs text-stone-600">
              <div className="w-6 h-6 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-stone-800 font-semibold">สรุปผลรายเดือนอัตโนมัติ:</strong> คำนวณรายรับ รายจ่าย ยอดคงเหลือ และอัตราการออม
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs text-stone-600">
              <div className="w-6 h-6 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-stone-800 font-semibold">กราฟวิเคราะห์แม่นยำ:</strong> แผนภูมิวงกลมและกราฟแท่งแสดงแนวโน้มการเงิน
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs text-stone-600">
              <div className="w-6 h-6 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-stone-800 font-semibold">จัดเก็บที่ PassiveDB:</strong> ความปลอดภัยสูง ซิงค์ข้อมูลข้ามอุปกรณ์ทันที
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-stone-400 mt-6">
          เชื่อมต่อกับ Firebase Authentication &amp; Firestore (PassiveDB)
        </p>
      </div>
    </div>
  );
};
