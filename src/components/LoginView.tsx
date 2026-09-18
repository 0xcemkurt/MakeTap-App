import React, { useState } from 'react';
import { AuthUser } from '../types';
import { MakeTabLogo } from './MakeTabLogo';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { TextInput } from './ui/TextInput';
import { DEMO_PRINCIPAL } from '../data/principalData';
import {
  LogIn,
  KeyRound,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Building2,
  ChevronLeft,
  Award,
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: AuthUser) => void;
}

// Demo Teacher Account
export const DEMO_TEACHER: AuthUser = {
  id: 'teacher-hakan',
  name: 'Hakan KAVUZKOZ',
  username: 'Hakan KAVUZKOZ',
  role: 'teacher',
  title: 'Uzman Sınıf Öğretmeni',
  schoolName: 'Atatürk İlkokulu',
  className: '4-A Bilim ve Keşif Sınıfı',
  email: 'hakan.kavuzkoz@maketab.edu.tr',
  avatar: '/hakan_kavuzkoz.jpg',
};

// Takım Elbise İkonu (Suit and Tie Icon)
export const SuitTieIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Left Shoulder & Lapel */}
    <path
      d="M3 4C3 3.44772 3.44772 3 4 3H8L10.5 10.5L6.5 13L3 18V4Z"
      fill="currentColor"
      opacity="0.92"
    />
    {/* Right Shoulder & Lapel */}
    <path
      d="M21 4C21 3.44772 20.5523 3 20 3H16L13.5 10.5L17.5 13L21 18V4Z"
      fill="currentColor"
      opacity="0.92"
    />
    {/* Tie Knot */}
    <polygon points="10.8,4.2 13.2,4.2 12.6,6.5 11.4,6.5" fill="#F59E0B" />
    {/* Tie Body */}
    <polygon points="11.4,6.5 12.6,6.5 13.6,14.5 12,16.5 10.4,14.5" fill="#F59E0B" />
    {/* Crisp White Shirt Collar */}
    <polygon points="10.5,3 13.5,3 12,5.2" fill="#FFFFFF" opacity="0.98" />
    {/* Formal Suit Buttons */}
    <circle cx="12" cy="18.5" r="0.9" fill="#F59E0B" />
    <circle cx="12" cy="21" r="0.9" fill="#F59E0B" />
  </svg>
);

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  // Mode: 'teacher' or 'principal' (distinct login screens)
  const [loginMode, setLoginMode] = useState<'teacher' | 'principal'>('teacher');

  // Teacher Form State
  const [username, setUsername] = useState('Hakan KAVUZKOZ');
  const [password, setPassword] = useState('');

  // Principal Form State
  const [principalUsername, setPrincipalUsername] = useState('Dr. Mehmet YILMAZ');
  const [principalPassword, setPrincipalPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Handle Teacher Login
  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();

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
        setError('Kullanıcı adı veya şifre hatalı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.');
      }
    }, 350);
  };

  // Handle Principal Login
  const handlePrincipalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = principalUsername.trim().toLowerCase();
      const trimmedPass = principalPassword.trim();

      const isPrincipalMatch =
        (trimmedUser.includes('mehmet') ||
          trimmedUser.includes('yilmaz') ||
          trimmedUser.includes('müdür') ||
          trimmedUser === 'dr. mehmet yilmaz' ||
          trimmedUser === 'mehmet.yilmaz@meb.k12.tr') &&
        trimmedPass === '123456789';

      if (isPrincipalMatch) {
        setIsLoading(false);
        onLogin(DEMO_PRINCIPAL);
      } else {
        setIsLoading(false);
        setError('Yönetici kullanıcı adı veya şifresi hatalı. Lütfen tekrar deneyin.');
      }
    }, 350);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden transition-colors duration-500 ${
        loginMode === 'principal'
          ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white selection:bg-amber-400 selection:text-slate-950'
          : 'bg-linear-to-b from-blue-50 via-slate-50 to-indigo-50/40 selection:bg-blue-500 selection:text-white'
      }`}
    >
      {/* Decorative subtle background elements */}
      {loginMode === 'principal' ? (
        <>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Help Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-pop border border-slate-200 text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4 mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 text-center mb-2">
              Giriş Yardımı
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 text-center mb-4 leading-relaxed">
              Öğretmen hesabınızla sınıfınıza, müdür hesabınızla yönetim masasına erişebilirsiniz.
              Şifrenizi unuttuysanız lütfen okul yönetiminiz ile iletişime geçin.
            </p>

            <div className="space-y-3 mb-5 text-xs">
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                <span className="font-black text-blue-900 block mb-1">Öğretmen Girişi:</span>
                <div className="text-slate-700">Kurumsal kullanıcı adınız ve şifreniz ile giriş yapın.</div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200">
                <span className="font-black text-amber-900 block mb-1">Okul Müdürü Girişi:</span>
                <div className="text-slate-700">MEB yönetici hesabınız ile üst yönetim masasını açın.</div>
              </div>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Anladım, Kapat</span>
            </button>
          </div>
        </div>
      )}

      {/* Header with MakeTab Logo */}
      <div className="max-w-md w-full mx-auto flex flex-col items-center justify-center pt-2 sm:pt-4">
        <div className="mb-2">
          <MakeTabLogo size="lg" showText={true} />
        </div>
        <p className={`text-xs sm:text-sm font-bold text-center mt-1 ${loginMode === 'principal' ? 'text-slate-400' : 'text-slate-500'}`}>
          {loginMode === 'principal'
            ? 'T.C. Millî Eğitim Bakanlığı • Okul Yönetim & Karar Destek Portalı'
            : 'Yapay Zeka Destekli Akıllı Okul ve Sınıf Yönetim Platformu'}
        </p>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: OKUL MÜDÜRÜ GİRİŞ EKRANI (EXECUTIVE PRINCIPAL PORTAL) */}
      {/* ============================================================== */}
      {loginMode === 'principal' ? (
        <div className="max-w-md w-full mx-auto my-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-pop border-2 border-amber-500/50 relative overflow-hidden">
            {/* Top Amber Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

            {/* Switch back to Teacher/Parent */}
            <button
              type="button"
              onClick={() => {
                setLoginMode('teacher');
                setError(null);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-4 font-bold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Öğretmen & Veli Girişine Dön</span>
            </button>

            {/* Suit Icon and Title */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-slate-800 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20 mb-3">
                <SuitTieIcon className="w-9 h-9" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-black text-amber-300 uppercase tracking-widest mb-1.5">
                Makam Yetkili Girişi
              </div>

              <h2 className="text-xl font-black text-white tracking-tight">
                Okul Müdürü Girişi
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Atatürk İlkokulu • 712048 Kurum Kodlu Üst Yönetim Masası
              </p>
            </div>

            {/* Quick Principal Login Banner */}
            <div className="mb-5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-800/80 border border-amber-500/40 p-4 text-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 font-black text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Kayıtlı Yönetici Hesabı</span>
                </div>
                <Badge tone="amber">Resmi Makam</Badge>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-2.5 border border-amber-500/20 mb-3 space-y-1 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Müdür:</span>
                  <span className="font-black text-amber-200">Dr. Mehmet YILMAZ</span>
                </div>
                <div className="flex items-center justify-between pt-0.5 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">Yetki:</span>
                  <span className="text-emerald-400 font-bold">Tüm Sınıflar, Öğretmenler, Bütçe & AI</span>
                </div>
              </div>

              <Button
                variant="amber"
                size="md"
                className="w-full"
                onClick={() => onLogin(DEMO_PRINCIPAL)}
              >
                <SuitTieIcon className="w-4 h-4 text-slate-950" />
                <span>Yönetici Olarak Devam Et</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 font-semibold">{error}</div>
              </div>
            )}

            {/* Principal Form */}
            <form onSubmit={handlePrincipalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  MEB Yönetici Kullanıcı Adı
                </label>
                <TextInput
                  tone="dark"
                  radius="xl"
                  type="text"
                  required
                  value={principalUsername}
                  onChange={(e) => setPrincipalUsername(e.target.value)}
                  leftIcon={<User />}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Yönetici Şifresi
                </label>
                <TextInput
                  tone="dark"
                  radius="xl"
                  type={showPassword ? 'text' : 'password'}
                  required
                  mono
                  value={principalPassword}
                  onChange={(e) => setPrincipalPassword(e.target.value)}
                  leftIcon={<KeyRound />}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              <Button
                type="submit"
                variant="amber"
                size="lg"
                disabled={isLoading}
                className="w-full rounded-xl"
              >
                {isLoading ? (
                  <span>Giriş Doğrulanıyor...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Okul Müdürü Yönetim Masasını Aç</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* MODE 2: STANDART ÖĞRETMEN & VELİ GİRİŞİ                        */
        /* ============================================================== */
        <div className="max-w-md w-full mx-auto my-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200/80">
            {/* Friendly Greeting & Monster Banner */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>Üye Girişi</span>
                  <Badge tone="brand">MEB Uyumlu</Badge>
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Sınıfınıza veya veli portalınıza erişin
                </p>
              </div>
              <div className="flex -space-x-1.5">
                <span
                  className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center text-xs font-black shadow-xs border border-white"
                  title="MakeTab Akıllı Sınıf"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </span>
                <span
                  className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs border border-white"
                  title="Erdem Puanları"
                >
                  <Award className="w-4 h-4 text-white" />
                </span>
              </div>
            </div>

            {/* Quick Teacher Login Banner */}
            <div className="mb-5 rounded-2xl bg-brand-50 border border-brand-100 p-3.5 sm:p-4 text-xs">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 font-black text-brand-800 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Kayıtlı Öğretmen Hesabı</span>
                </div>
                <Badge tone="brand">4-A Sınıfı</Badge>
              </div>

              <div className="bg-white/95 rounded-2xl p-3 border border-brand-100 mb-3 space-y-2 text-slate-700">
                <div className="flex items-center gap-3">
                  <img
                    src="/hakan_kavuzkoz.jpg"
                    alt="Hakan KAVUZKOZ"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-brand-500 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-sm truncate">Hakan KAVUZKOZ</span>
                      <Badge tone="brand">4-A Sınıfı</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold truncate">Uzman Sınıf Öğretmeni & STEM Koordinatörü</p>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setUsername('Hakan KAVUZKOZ');
                  setPassword('123456789');
                  onLogin(DEMO_TEACHER);
                }}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Öğretmen Olarak Devam Et</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-semibold">{error}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kullanıcı Adı veya E-Posta
                </label>
                <TextInput
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Örn: Hakan KAVUZKOZ"
                  leftIcon={<User />}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Şifre</label>
                <TextInput
                  type={showPassword ? 'text' : 'password'}
                  required
                  mono
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  leftIcon={<KeyRound />}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs font-bold text-slate-600">Beni Hatırla</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Giriş Yardımı</span>
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full mt-2"
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
              </Button>
            </form>

            {/* Müdür girişi: küçük alternatif bağlantı */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
              <button
                type="button"
                id="btn-principal-mode-login"
                onClick={() => {
                  setLoginMode('principal');
                  setError(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-500 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all cursor-pointer"
                title="Okul yönetimi hesabıyla giriş"
              >
                <SuitTieIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>Okul Müdürü Girişi</span>
                <ChevronLeft className="w-3 h-3 rotate-180" />
              </button>
            </div>
          </div>

          {/* Security info */}
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
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-3">
        <p>© 2026 MakeTab • İlkokul ve Ortaokul Akıllı Sınıf & Pozitif Davranış Yönetimi</p>
      </footer>
    </div>
  );
};
