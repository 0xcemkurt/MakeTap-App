import React, { useState } from 'react';
import { AuthUser } from '../types';
import { MakeTabLogo } from './MakeTabLogo';
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
  const [password, setPassword] = useState('123456789');

  // Principal Form State
  const [principalUsername, setPrincipalUsername] = useState('Dr. Mehmet YILMAZ');
  const [principalPassword, setPrincipalPassword] = useState('123456789');

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
        setError(
          'Kullanıcı adı veya şifre hatalı! Lütfen demo hesabını kullanınız (Kullanıcı Adı: Hakan KAVUZKOZ, Şifre: 123456789).'
        );
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
        setError(
          'Müdürlük kullanıcı adı veya şifresi hatalı! (Demo: Dr. Mehmet YILMAZ, Şifre: 123456789)'
        );
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

      {/* Demo Help Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 text-center mb-2">
              Demo Hesap Bilgileri
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 text-center mb-4 leading-relaxed">
              MakeTab sisteminde doğrudan tanımlanmış iki farklı yetkili hesabı bulunmaktadır:
            </p>

            <div className="space-y-3 mb-5 text-xs">
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                <span className="font-black text-blue-900 block mb-1">1. Öğretmen Girişi:</span>
                <div className="text-slate-700">Kullanıcı: <strong>Hakan KAVUZKOZ</strong></div>
                <div className="text-slate-700">Şifre: <strong>123456789</strong></div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200">
                <span className="font-black text-amber-900 block mb-1">2. Okul Müdürü Girişi (Üst Mod):</span>
                <div className="text-slate-700">Kullanıcı: <strong>Dr. Mehmet YILMAZ</strong></div>
                <div className="text-slate-700">Şifre: <strong>123456789</strong></div>
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
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-500/50 relative overflow-hidden">
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

            {/* Quick One-Click Principal Login Banner */}
            <div className="mb-5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-800/80 border border-amber-500/40 p-4 text-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 font-black text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Tanımlı Okul Müdürü Hesabı</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full font-black">
                  Resmi Makam
                </span>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-2.5 border border-amber-500/20 mb-3 space-y-1 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Müdür:</span>
                  <span className="font-black text-amber-200">Dr. Mehmet YILMAZ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Şifre:</span>
                  <span className="font-mono font-black text-amber-400">123456789</span>
                </div>
                <div className="flex items-center justify-between pt-0.5 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">Yetki:</span>
                  <span className="text-emerald-400 font-bold">Tüm Sınıflar, Öğretmenler, Bütçe & AI</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onLogin(DEMO_PRINCIPAL)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.98] text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <SuitTieIcon className="w-4 h-4 text-slate-950" />
                <span>Dr. Mehmet YILMAZ Olarak Tek Tıkla Giriş Yap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={principalUsername}
                    onChange={(e) => setPrincipalUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Yönetici Şifresi
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={principalPassword}
                    onChange={(e) => setPrincipalPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs focus:outline-hidden focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-70"
              >
                {isLoading ? (
                  <span>Giriş Doğrulanıyor...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Okul Müdürü Yönetim Masasını Aç</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* MODE 2: STANDART ÖĞRETMEN & VELİ GİRİŞİ                        */
        /* ============================================================== */
        <div className="max-w-md w-full mx-auto my-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80">
            {/* Friendly Greeting & Monster Banner */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
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
              <div className="flex -space-x-1.5">
                <span
                  className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-xs border border-white"
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

            {/* =============================================================== */}
            {/* THE USER REQUESTED BUTTON:                                      */}
            {/* "bir buton ekle ve takım elbise ikonu koy, altında Okul Müdürü Giriş yaz" */}
            {/* =============================================================== */}
            <div className="mb-4">
              <button
                type="button"
                id="btn-principal-mode-login"
                onClick={() => {
                  setLoginMode('principal');
                  setError(null);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border-2 border-amber-400 shadow-lg shadow-amber-500/15 hover:border-amber-300 hover:shadow-amber-500/25 active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 group cursor-pointer"
              >
                {/* Takım Elbise İkonu */}
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <SuitTieIcon className="w-6 h-6" />
                </div>

                {/* Altında "Okul Müdürü Giriş" yazısı */}
                <span className="text-sm sm:text-base font-black tracking-wide text-amber-300 mt-0.5">
                  Okul Müdürü Giriş
                </span>

                <span className="text-[10px] text-slate-300 font-medium">
                  Tüm Sınıflar, Öğretmen Puanlamaları, AI İçgörüler & Finans
                </span>
              </button>
            </div>

            {/* Quick Demo Login Banner for Teacher */}
            <div className="mb-5 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/90 p-3.5 sm:p-4 text-xs">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 font-black text-blue-900 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Tanımlı Demo Öğretmen Girişi</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-blue-600 text-white rounded-full font-black">
                  Aktif Demo
                </span>
              </div>

              <div className="bg-white/95 rounded-2xl p-3 border border-blue-200/60 mb-3 space-y-2 text-slate-700">
                <div className="flex items-center gap-3">
                  <img
                    src="/hakan_kavuzkoz.jpg"
                    alt="Hakan KAVUZKOZ"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-sm truncate">Hakan KAVUZKOZ</span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">4-A Sınıfı</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold truncate">Uzman Sınıf Öğretmeni & STEM Koordinatörü</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-medium block">Kullanıcı Adı:</span>
                    <strong className="text-slate-800 font-mono">Hakan KAVUZKOZ</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Şifre:</span>
                    <strong className="text-blue-700 font-mono">123456789</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUsername('Hakan KAVUZKOZ');
                  setPassword('123456789');
                  onLogin(DEMO_TEACHER);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-xs font-black transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Hakan KAVUZKOZ Hesabıyla Giriş Yap</span>
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
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kullanıcı Adı veya E-Posta
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Örn: Hakan KAVUZKOZ"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Şifre</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

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
