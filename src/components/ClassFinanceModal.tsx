import React, { useState } from 'react';
import { Student, ClassFinanceItem } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  Wallet,
  X,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  Printer,
  Calendar,
  AlertCircle,
  FileCheck,
  TrendingUp,
  Receipt,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClassFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  financeItems: ClassFinanceItem[];
  onTogglePayment: (itemId: string, studentId: string) => void;
  onAddFinanceItem: (item: Omit<ClassFinanceItem, 'id' | 'payments'>) => void;
}

export const ClassFinanceModal: React.FC<ClassFinanceModalProps> = ({
  isOpen,
  onClose,
  students,
  financeItems,
  onTogglePayment,
  onAddFinanceItem,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(financeItems[0]?.id || '');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [receiptToast, setReceiptToast] = useState<string | null>(null);

  // New Item Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'gezi' | 'etkinlik' | 'materyal' | 'aidat' | 'stem'>('etkinlik');
  const [newAmount, setNewAmount] = useState(150);
  const [newDueDate, setNewDueDate] = useState('05 Nisan 2026');

  if (!isOpen) return null;

  const currentItem = financeItems.find((f) => f.id === selectedItemId) || financeItems[0];

  // Calculations for current item
  const totalStudents = students.length;
  const paidCount = currentItem
    ? students.filter((s) => currentItem.payments?.[s.id]?.paid).length
    : 0;
  const totalCollected = currentItem ? paidCount * currentItem.amountPerStudent : 0;
  const targetTotal = currentItem ? currentItem.targetTotal : 0;
  const progressPct = targetTotal > 0 ? Math.min(100, Math.round((totalCollected / targetTotal) * 100)) : 0;

  // Grand totals across all items
  const grandTotalCollected = financeItems.reduce((sum, item) => {
    const itemPaid = students.filter((s) => item.payments?.[s.id]?.paid).length;
    return sum + itemPaid * item.amountPerStudent;
  }, 0);

  const grandTargetTotal = financeItems.reduce((sum, item) => sum + item.targetTotal, 0);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddFinanceItem({
      title: newTitle.trim(),
      description: newDescription.trim() || 'Sınıf ortak etkinlik bütçesi.',
      category: newCategory,
      amountPerStudent: Number(newAmount),
      targetTotal: Number(newAmount) * students.length,
      dueDate: newDueDate,
      status: 'active',
    });

    setIsAddingNew(false);
    setNewTitle('');
    setNewDescription('');
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleSendReceipt = (student: Student) => {
    const msg = `Sayın ${student.parentName}, ${student.name} ${student.surname} için "${currentItem?.title}" ücreti olan ₺${currentItem?.amountPerStudent} tutarındaki ödemeniz MakeTab sınıf kasasına alınmıştır. Makbuz No: MK-${Math.floor(1000 + Math.random() * 9000)}`;
    setReceiptToast(`Veliye Makbuz SMS/Bildirimi İletildi: ${student.parentName}`);
    setTimeout(() => setReceiptToast(null), 3500);
  };

  const handleSendReminderToAll = () => {
    const unpaidStudents = students.filter((s) => !currentItem?.payments?.[s.id]?.paid);
    setReceiptToast(`${unpaidStudents.length} veliye nazik hatırlatma mesajı ve ödeme linki gönderildi.`);
    setTimeout(() => setReceiptToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                4-A Sınıf Kasası & Etkinlik Bütçesi
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Öğretmen ve veli şeffaf bütçe takibi, gezi/etkinlik aidatları ve makbuz yönetimi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Toplam Toplanan
            </span>
            <span className="text-lg font-black text-emerald-700">
              ₺{grandTotalCollected.toLocaleString('tr-TR')}
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold">Tüm Fonlar</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Hedef Bütçe
            </span>
            <span className="text-lg font-black text-slate-800">
              ₺{grandTargetTotal.toLocaleString('tr-TR')}
            </span>
            <span className="text-[10px] text-blue-600 block font-semibold">
              %{Math.round((grandTotalCollected / (grandTargetTotal || 1)) * 100)} Tamamlandı
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Aktif Etkinlikler
            </span>
            <span className="text-lg font-black text-indigo-700">
              {financeItems.length} Kalem
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold">Geziler & Materyal</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-center">
            <button
              onClick={() => setIsAddingNew(true)}
              className="min-h-[38px] w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Yeni Kalem Ekle
            </button>
          </div>
        </div>

        {/* Toast alert */}
        {receiptToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            {receiptToast}
          </div>
        )}

        {/* Main Content: Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: Events / Items List */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/60 p-3.5 overflow-y-auto space-y-2.5 shrink-0">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-extrabold text-slate-700">Etkinlik & Fon Listesi</span>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                {financeItems.length} Kalem
              </span>
            </div>

            {financeItems.map((item) => {
              const isSelected = item.id === selectedItemId;
              const pCount = students.filter((s) => item.payments?.[s.id]?.paid).length;
              const col = pCount * item.amountPerStudent;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setIsAddingNew(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-xs font-black text-slate-900 leading-snug line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-black text-emerald-700 shrink-0">
                      ₺{item.amountPerStudent}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {item.description}
                  </p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>{pCount}/{totalStudents} Veli Ödedi</span>
                      <span className="text-blue-600">₺{col} / ₺{item.targetTotal}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, (col / (item.targetTotal || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Pane: Selected Event Details & Student Payment Roster */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white flex flex-col">
            {isAddingNew ? (
              /* Add New Event Form */
              <form onSubmit={handleCreateItem} className="space-y-4 max-w-lg">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-600" />
                    Yeni Sınıf Etkinliği / Fon Kalemi Oluştur
                  </h3>
                  <p className="text-xs text-slate-500">
                    Örn: Tiyatro bileti, planetaryum gezisi, fotokopi fonu vb.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Etkinlik / Fon Başlığı</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Örn: Ankara Bilim Müzesi ve Planetaryum Gezisi"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Açıklama</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Gezide otobüs ücreti, müze giriş bileti ve öğle sandviçi dahildir."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Öğrenci Başı Ücret (₺)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={newAmount}
                      onChange={(e) => setNewAmount(Number(e.target.value))}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Son Ödeme Tarihi</label>
                    <input
                      type="text"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      placeholder="15 Nisan 2026"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="min-h-[42px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-colors shadow-xs"
                  >
                    Kalemi Kaydet ve Velilere Aç
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="min-h-[42px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    İptal
                  </button>
                </div>
              </form>
            ) : currentItem ? (
              /* Selected Event View & Roster */
              <div className="space-y-5">
                {/* Event Top Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                        {currentItem.category.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Son Tarih: {currentItem.dueDate}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {currentItem.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {currentItem.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-end gap-1.5">
                    <span className="text-2xl font-black text-emerald-700">
                      ₺{currentItem.amountPerStudent}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Öğrenci Başı Katılım
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <div className="space-y-1 flex-1 min-w-[200px]">
                    <div className="flex justify-between text-xs font-black text-slate-800">
                      <span>Tahsilat Durumu: {paidCount} / {totalStudents} Veli</span>
                      <span className="text-blue-700">₺{totalCollected} / ₺{targetTotal} (%{progressPct})</span>
                    </div>
                    <div className="w-full h-2.5 bg-blue-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSendReminderToAll}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Bekleyen Velilere Hatırlat ({totalStudents - paidCount})
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Yazdır
                    </button>
                  </div>
                </div>

                {/* Students Payment Roster */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs font-extrabold text-slate-700">
                    <span>4-A Öğrenci ve Veli Listesi</span>
                    <span>Ödeme Durumu & Makbuz</span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden max-h-[340px] overflow-y-auto">
                    {students.map((std) => {
                      const payment = currentItem.payments?.[std.id];
                      const isPaid = !!payment?.paid;

                      return (
                        <div
                          key={std.id}
                          className="p-3 bg-white hover:bg-slate-50/70 flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <StudentAvatar
                              name={std.name}
                              color={std.avatarColor}
                              size="sm"
                              showBadge={false}
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {std.name} {std.surname}
                              </h4>
                              <p className="text-[11px] text-slate-500 truncate">
                                Veli: {std.parentName} • {std.parentPhone}
                              </p>
                              {isPaid && payment.paidAt && (
                                <p className="text-[10px] text-emerald-600 font-bold">
                                  ✓ Ödendi: {payment.paidAt} ({payment.receiptNo || 'Makbuzlu'})
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isPaid && (
                              <button
                                onClick={() => handleSendReceipt(std)}
                                title="Veliye Makbuz SMS Gönder"
                                className="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-bold text-[11px] flex items-center gap-1 transition-colors"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                Makbuz
                              </button>
                            )}

                            <button
                              onClick={() => onTogglePayment(currentItem.id, std.id)}
                              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-2xs ${
                                isPaid
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900'
                              }`}
                            >
                              {isPaid ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Ödendi (₺{currentItem.amountPerStudent})
                                </>
                              ) : (
                                <>
                                  <Clock className="w-4 h-4 text-amber-600" />
                                  Ödeme Bekliyor
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
