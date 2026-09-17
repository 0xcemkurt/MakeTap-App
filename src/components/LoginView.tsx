import React, { useState } from 'react';
import { MakeTabLogo } from './MakeTabLogo';
import { AuthUser, Role } from '../types';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Heart,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: AuthUser) => void;
}

export const DEMO_TEACHER: AuthUser = {
  id: 'teacher-hakan',
  name: 'Hakan KAVUZKOZ',
  username: 'Hakan KAVUZKOZ',
  role: 'teacher',
  title: 'Sınıf Öğretmeni',
  schoolName: 'Atatürk İlkokulu',
  className: '4-A Bilim ve Keşif Sınıfı',
  email: 'hakan.kavuzkoz@maketab.edu.tr',
};

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('Hakan KAVUZKOZ');
  const [password, setPassword] = useState('123456789');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleQuickFill = () => {
    setUsername('Hakan KAVUZKOZ');
    setPassword('123456789');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();

      // Teacher Demo Account validation: Hakan KAVUZKOZ / 123456789
      const isTeacherMatch =
        (trimmedUser.includes('hakan') ||
          trimmedUser === 'hakan kavuzkoz' ||
          trimmedUser === 'hakankavuzkoz' ||
          trimmedUser === 'hakan.kavuzkoz@maketab.edu.tr') &&
        trimmedPass === '123456789';

      if (isTeacherMatch) {
        setIsLoading(false);
        onLogin(DEMO_TEACHER);
      } else {
        setIsLoading(false);
        setError(
          'Kullanıcı adı veya şifre hatalı! Lütfen demo hesabını kullanınız (Kullanıcı Adı: Hakan KAVUZKOZ, Şifre: 123456789).'
        );
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-slate-50 to-indigo-50/40 flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Decorative subtle background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 text-center mb-2">
              Demo Hesap Bilgileri
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 text-center mb-5 leading-relaxed">
              MakeTab demo sisteminde doğrudan tanımlanmış öğretmen hesabı ile giriş yapabilirsiniz:
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Kullanıcı Adı:</span>
                <span className="font-black text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                  Hakan KAVUZKOZ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Şifre:</span>
                <span className="font-black text-blue-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                  123456789
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Rol:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  4-A Sınıf Öğretmeni
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                handleQuickFill();
                setShowForgotModal(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Bilgileri Forma Doldur ve Kapat</span>
            </button>
          </div>
        </div>
      )}

      {/* Header with MakeTab Logo */}
      <div className="max-w-md w-full mx-auto flex flex-col items-center justify-center pt-2 sm:pt-6">
        <div className="mb-2">
          <MakeTabLogo size="lg" showText={true} />
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-bold text-center mt-1">
          Yapay Zeka Destekli Akıllı Okul ve Sınıf Yönetim Platformu
        </p>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80">
          {/* Friendly Greeting & Monster Banner */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Üye Girişi</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                  MEB Uyumlu
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Sınıfınıza veya veli portalınıza erişin
              </p>
            </div>
            <div className="flex -space-x-2">
              <span
                className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-black border-2 border-white shadow-xs"
                title="MakeTab Canavarları"
              >
                👾
              </span>
              <span
                className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-black border-2 border-white shadow-xs"
                title="Pozitif Puanlar"
              >
                ⭐
              </span>
            </div>
          </div>

          {/* Quick Demo Login Banner */}
          <div className="mb-5 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/90 p-3.5 sm:p-4 text-xs">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 font-black text-blue-900 text-xs">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Tanımlı Demo Giriş Hesabı</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-blue-600 text-white rounded-full font-black">
                Aktif Demo
              </span>
            </div>

            <div className="bg-white/90 rounded-xl p-2.5 border border-blue-200/60 mb-3 space-y-1 text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Kullanıcı Adı:</span>
                <button
                  type="button"
                  onClick={() => setUsername('Hakan KAVUZKOZ')}
                  className="font-black text-slate-900 hover:text-blue-600 font-mono tracking-wide"
                  title="Tıkla ve forma aktar"
                >
                  Hakan KAVUZKOZ
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Şifre:</span>
                <span className="font-mono font-black text-blue-700">123456789</span>
              </div>
              <div className="flex items-center justify-between pt-0.5 border-t border-slate-100">
                <span className="text-slate-500 font-semibold">Rol / Sınıf:</span>
                <span className="font-bold text-slate-800 text-[11px]">
                  4-A Sınıf Öğretmeni
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleQuickFill();
                // Instant auto-submit
                onLogin(DEMO_TEACHER);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-xs font-black transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Hakan KAVUZKOZ Hesabıyla Tek Tıkla Giriş Yap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kullanıcı Adı veya E-Posta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Örn: Hakan KAVUZKOZ"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Şifre</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Şifremi Unuttum?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi giriniz"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-600">Beni Hatırla</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Demo İpuçları</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Giriş Yapılıyor...</span>
                </div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sisteme Giriş Yap</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security & Support info footer */}
        <div className="mt-5 flex items-center justify-center gap-4 text-slate-400 text-xs">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">SSL 256-bit Güvenli Bağlantı</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold">Bulut Sunucuları Aktif</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-3">
        <p>© 2026 MakeTab • İlkokul ve Ortaokul Akıllı Sınıf & Pozitif Davranış Yönetimi</p>
      </footer>
    </div>
  );
};
