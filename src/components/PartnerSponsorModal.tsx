import React, { useState } from 'react';
import {
  X,
  Megaphone,
  Sparkles,
  Building,
  CheckCircle2,
  Send,
  Award,
  TrendingUp,
  ShieldCheck,
  Bot,
  Package,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PartnerSponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerSponsorModal: React.FC<PartnerSponsorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'robotics' | 'science' | 'book' | 'museum' | 'workshop'>('robotics');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !phone.trim()) return;

    setIsSubmitted(true);
    confetti({ particleCount: 50, spread: 70 });
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Eğitim Şirketleri & Tedarikçiler İçin
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                "Ayın Etkinliği" Vitrininde Satış & Reklam Başvurusu
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Başvurunuz Başarıyla Alındı!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Sayın <strong>{contactName}</strong>, <strong>{companyName}</strong> adına yaptığınız vitrin ve satış ortaklığı başvurusu MakeTab İş Ortaklıkları ekibimize iletilmiştir. Yetkilimiz 24 saat içinde tarafınızla iletişime geçecektir.
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                MEB Akreditasyon & Kurumsal Tanıtım Süreci Başlatıldı
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Informational Intro Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-black text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>MakeTab Bağımsız Eğitim & Teknoloji Vitrini Hakkında</span>
              </div>
              <p className="leading-relaxed text-amber-900/90 font-medium">
                MakeTab, okulların sınıf içi yönetim ve pedagoji altyapısıdır. <strong>STEM-X</strong> gibi atölyeler sistemin kendi ürünü olmayıp, her ay MEB onaylı bağımsız eğitim firmalarına, bilim atölyelerine, yayınevlerine ve müzelere ayrılan <strong>"Ayın Etkinliği & Sponsorlu Vitrin"</strong> alanıdır.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800">Robotik & Kodlama Kitleri</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800">Canlı Bilim & Sanat Atölyeleri</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800">Toplu Sınıf Alımı & Fonlama</span>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                Firma & Etkinlik Başvuru Formu
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Firma / Kurum Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: BilimX Akademi, Doğa STEM A.Ş."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Yetkili Adı Soyadı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ad Soyad"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Kurumsal E-Posta</label>
                  <input
                    type="email"
                    placeholder="iletisim@sirketiniz.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Etkinlik / Ürün Kategorisi</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'robotics', label: 'Robotik & Kodlama Kiti' },
                    { id: 'science', label: 'Fen & Deney Seti' },
                    { id: 'book', label: 'Kitap & Yayıncılık' },
                    { id: 'museum', label: 'Müze & Bilim Gezisi' },
                    { id: 'workshop', label: 'Drama & Sanat Atölyesi' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`p-2 rounded-xl text-[11px] font-bold border text-left transition-all ${
                        category === cat.id
                          ? 'bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Ürün / Atölye Açıklaması ve Teklifiniz</label>
                <textarea
                  rows={3}
                  placeholder="Okullara ve sınıflara sunmak istediğiniz ürün, kit veya atölye içeriği hakkında kısa bilgi..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-xs font-black shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Vitrin Başvurusunu Gönder</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
