import { describe, it, expect } from 'vitest';
import { getCurriculumExam, PREBUILT_EXAMS } from './curriculumExams';

describe('getCurriculumExam (Hafif MVP)', () => {
  it('istenen soru adedini tam olarak döndürür', () => {
    for (const count of [3, 4, 5, 8]) {
      const exam = getCurriculumExam('Fen Bilimleri', 'Kuvvet', count);
      expect(exam.questions).toHaveLength(count);
    }
  });

  it('havuzdan fazla istenirse variant id üretir (duplicate olmaz)', () => {
    const baseLen = PREBUILT_EXAMS['Matematik'].questions.length;
    const exam = getCurriculumExam('Matematik', 'Kesirler', baseLen + 3);
    expect(exam.questions).toHaveLength(baseLen + 3);
    const ids = exam.questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('bilinmeyen ders fallback ile Fen Bilimleri havuzunu kullanır', () => {
    const exam = getCurriculumExam('Uzay Bilimi', 'Kara Delikler', 4);
    expect(exam.questions).toHaveLength(4);
  });

  it('süre en az 10 dk ve soru sayısıyla orantılı', () => {
    const small = getCurriculumExam('Türkçe', 'Deyimler', 2);
    const big = getCurriculumExam('Türkçe', 'Deyimler', 8);
    expect(small.durationMinutes).toBeGreaterThanOrEqual(10);
    expect(big.durationMinutes).toBeGreaterThanOrEqual(small.durationMinutes);
  });
});
