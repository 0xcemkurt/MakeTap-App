import { describe, it, expect } from 'vitest';
import { INITIAL_CLASSROOM, INITIAL_FINANCE_ITEMS, CLASSROOM_STUDENT_IDS } from './initialData';
import { INITIAL_CLASSES_SUMMARY } from './principalData';

describe('veri tutarlılığı (Hafif MVP)', () => {
  it('demo öğrenci sayısı ve id listesi eşleşiyor', () => {
    expect(INITIAL_CLASSROOM.students.length).toBeGreaterThanOrEqual(16);
    const ids = INITIAL_CLASSROOM.students.map((s) => s.id).sort();
    expect([...CLASSROOM_STUDENT_IDS].sort()).toEqual(ids);
  });

  it('finans ödemelerinde orphan öğrenci id yok', () => {
    const valid = new Set(INITIAL_CLASSROOM.students.map((s) => s.id));
    for (const item of INITIAL_FINANCE_ITEMS) {
      for (const sid of Object.keys(item.payments)) {
        expect(valid.has(sid), `${item.id} içinde geçersiz öğrenci: ${sid}`).toBe(true);
      }
      // Her finans kalemi sınıftaki tüm öğrencileri kapsamalı
      for (const s of INITIAL_CLASSROOM.students) {
        expect(item.payments[s.id], `${item.id} içinde ${s.id} ödemesi eksik`).toBeDefined();
      }
    }
  });

  it('targetTotal = amountPerStudent x öğrenci sayısı', () => {
    const n = INITIAL_CLASSROOM.students.length;
    for (const item of INITIAL_FINANCE_ITEMS) {
      expect(item.targetTotal).toBe(item.amountPerStudent * n);
    }
  });

  it('müdür özeti 4-A sınıfı demo sınıf ile tutarlı', () => {
    const summary4A = INITIAL_CLASSES_SUMMARY.find((c) => c.id === 'class-4a');
    expect(summary4A).toBeDefined();
    expect(summary4A!.studentCount).toBe(INITIAL_CLASSROOM.students.length);
    const totalPoints = INITIAL_CLASSROOM.students.reduce((s, x) => s + x.totalPoints, 0);
    expect(summary4A!.totalPoints).toBe(totalPoints);
  });
});
