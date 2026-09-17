import React, { useState } from 'react';
import { StemProduct, StemWorkshopEvent } from '../types';
import {
  Sparkles,
  X,
  Cpu,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Award,
  ShoppingCart,
  Send,
  ExternalLink,
  Bot,
  Zap,
  Download,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StemXStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  stemProduct: StemProduct;
  onOrderForClass?: (product: StemProduct) => void;
  onAnnounceInStory?: (title: string, content: string) => void;
}

export const StemXStoreModal: React.FC<StemXStoreModalProps> = ({
  isOpen,
  onClose,
  stemProduct,
  onOrderForClass,
  onAnnounceInStory,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(stemProduct.events[0]?.id || '');
  const [orderedSuccess, setOrderedSuccess] = useState(false);
  const [enrolledEvents, setEnrolledEvents] = useState<Record<string, boolean>>({
    'event-1': true,
  });

  if (!isOpen) return null;

  const handleEnrollEvent = (eventId: string) => {
    setEnrolledEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
    confetti({ particleCount: 35, spread: 60 });
  };

  const handleCreateClassOrder = () => {
    if (onOrderForClass) {
      onOrderForClass(stemProduct);
    }
    setOrderedSuccess(true);
    confetti({ particleCount: 60, spread: 70 });
    setTimeout(() => setOrderedSuccess(false), 4000);
  };

  const handleShareStory = () => {
    if (onAnnounceInStory) {
      onAnnounceInStory(
        '🚀 4-A Sınıfı STEM-X Robotik Atölyesi Başlıyor!',
        'Değerli Velilerimiz, MEB onaylı STEM-X Robotik Kodlama Kiti sınıfa özel ₺450 indirimli fiyatıyla temin edilmiştir. 21 Mart Cumartesi günü saat 10:00’da ilk canlı robot montaj atölyemiz gerçekleştirilecektir.'
      );
    }
    setOrderedSuccess(true);
    setTimeout(() => setOrderedSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-cyan-300 border border-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                MakeTab Eğitim Teknolojileri & Sınıf Mağazası
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                {stemProduct.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderedSuccess && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            STEM-X Robotik Kiti sınıf bütçesine eklendi ve velilere duyuru iletildi!
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Product Showcase Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  {stemProduct.badge}
                </div>

                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  STEM-X Yeni Nesil Robotik Kodlama Kiti
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  {stemProduct.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {stemProduct.features.map((feat, i) => (
                    <div
                      key={i}
                      className="text-xs font-semibold text-slate-200 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 flex items-center gap-2"
                    >
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA Card */}
              <div className="w-full md:w-64 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 flex flex-col items-center text-center space-y-3 shrink-0">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Sınıf Toplu Alım Kampanyası
                </span>

                <div className="space-y-0.5">
                  <div className="text-xs text-rose-300 line-through font-bold">
                    Perakende: ₺{stemProduct.originalPrice}
                  </div>
                  <div className="text-3xl font-black text-emerald-400 tracking-tight">
                    ₺{stemProduct.discountedPrice}
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium">
                    Öğrenci Başı • Kargo & Okul Teslimi Ücretsiz
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateClassOrder}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/25 active:scale-[0.98]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Sınıf Kasa/Fonuna Ekle (₺450)
                </button>

                <button
                  type="button"
                  onClick={handleShareStory}
                  className="w-full min-h-[38px] py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Hikayede & Panoda Duyur
                </button>
              </div>
            </div>
          </div>

          {/* Live Workshop Events & Schedule Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  STEM-X Canlı Atölye ve Etkinlik Zamanları (Takvim)
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Robotik kiti alan öğrencilerimiz için uzman mühendisler eşliğinde çevrim içi canlı dersler
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                4-A Sınıfı Özel Takvimi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stemProduct.events.map((ev, idx) => {
                const isEnrolled = !!enrolledEvents[ev.id];

                return (
                  <div
                    key={ev.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isEnrolled
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                          Etkinlik {idx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.time}
                        </span>
                      </div>

                      <h5 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                        {ev.title}
                      </h5>

                      <div className="text-[11px] text-indigo-700 font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {ev.date}
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {ev.description}
                      </p>

                      <div className="text-[11px] text-slate-500 font-semibold pt-1 border-t border-slate-100">
                        👨‍🏫 {ev.instructor}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>Kontenjan:</span>
                        <span className="text-emerald-700 font-black">{ev.spotsLeft} Boş Yer</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEnrollEvent(ev.id)}
                        className={`w-full min-h-[38px] py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
                          isEnrolled
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Sınıf Kaydı Yapıldı
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4" />
                            Sınıfı Atölyeye Kaydet
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Milli Eğitim Bakanlığı Bilişim ve Robotik Standartlarına Uygunluk Onaylı</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[38px] px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
