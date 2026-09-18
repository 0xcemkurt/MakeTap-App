import React, { useState } from 'react';
import { StemProduct } from '../types';
import { PartnerSponsorModal } from './PartnerSponsorModal';
import {
  Sparkles,
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Award,
  ShoppingCart,
  Bot,
  Zap,
  Share2,
  Megaphone,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

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
  const [showPartnerModal, setShowPartnerModal] = useState(false);
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
        '4-A Sınıfı STEM-X Robotik Atölyesi Başlıyor!',
        'Değerli Velilerimiz, MEB onaylı STEM-X Robotik Kodlama Kiti sınıfa özel ₺450 indirimli fiyatıyla temin edilmiştir. 21 Mart Cumartesi günü saat 10:00’da ilk canlı robot montaj atölyemiz gerçekleştirilecektir.'
      );
    }
    setOrderedSuccess(true);
    setTimeout(() => setOrderedSuccess(false), 4000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-pop overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-cyan-300 border border-white/20 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider max-w-full">
                  <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                  <span className="truncate">Ayın Etkinliği & Sponsorlu Eğitim Vitrini</span>
                </div>
                <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 flex-wrap break-words">
                  <span className="break-words">{stemProduct.name}</span>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                    Sponsor Partner: STEM-X Robotics & Bilim A.Ş.
                  </span>
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

          {orderedSuccess && (
            <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              STEM-X Robotik Kiti sınıf bütçesine eklendi ve velilere duyuru iletildi!
            </div>
          )}

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Open Ecosystem & Sponsor Banner Callout */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block text-xs">
                    Bu Bölüm Bağımsız Eğitim & Teknoloji Şirketlerinin Sponsorlu Vitrinidir
                  </span>
                  <p className="text-slate-600 text-[11px] font-medium leading-relaxed mt-0.5">
                    STEM-X, MakeTab sisteminin bir ürünü değildir. Okullara özel atölyeler ve robotik kitler geliştiren bağımsız eğitim şirketlerinin <strong>"Ayın Etkinliği"</strong> vitrinidir.
                  </p>
                </div>
              </div>

              <Button
                variant="softBrand"
                size="sm"
                onClick={() => setShowPartnerModal(true)}
                className="shrink-0"
              >
                <Megaphone className="w-3.5 h-3.5 text-amber-500" />
                <span>Bu Alanda Reklam Ver / Satış Yap</span>
              </Button>
            </div>

            {/* Main Product Showcase Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                <div className="space-y-3 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      {stemProduct.badge}
                    </div>
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-white/10 text-cyan-300 border border-white/15">
                      Firma: STEM-X Robotics & Bilim A.Ş.
                    </span>
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

                  <Button
                    variant="success"
                    onClick={handleCreateClassOrder}
                    className="w-full min-h-[44px]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Sınıf Kasa/Fonuna Ekle (₺450)
                  </Button>

                  <Button
                    variant="ghostDark"
                    onClick={handleShareStory}
                    className="w-full"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Hikayede & Panoda Duyur
                  </Button>
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
                {stemProduct.events.map((ev) => {
                  const isEnrolled = !!enrolledEvents[ev.id];

                  return (
                    <div
                      key={ev.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                        isEnrolled
                          ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-300'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <Badge tone="indigo" className="shrink-0">
                            {ev.gradeLevel}
                          </Badge>
                          <span className="text-[11px] font-bold text-slate-500 truncate min-w-0 text-right">
                            {ev.instructor}
                          </span>
                        </div>

                        <h5 className="text-sm font-black text-slate-900 leading-snug">
                          {ev.title}
                        </h5>

                        <div className="space-y-1 text-xs text-slate-600 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-600" />
                            <span>{ev.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{ev.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                          <span>Kontenjan:</span>
                          <span className="text-emerald-700 font-black">{ev.spotsLeft} Boş Yer</span>
                        </div>

                        <Button
                          variant={isEnrolled ? 'success' : 'indigo'}
                          onClick={() => handleEnrollEvent(ev.id)}
                          className="w-full min-h-[38px]"
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
                        </Button>
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
              <span>MakeTab Açık Eğitim Ekosistemi • Sponsorlu Atölyeler Bağımsız Şirketlerce Sunulur</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPartnerModal(true)}
                className="min-h-[38px] px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5 text-amber-700" />
                <span>Reklam / Vitrin Başvurusu</span>
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="min-h-[38px]"
              >
                Kapat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PartnerSponsorModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
      />
    </>
  );
};
