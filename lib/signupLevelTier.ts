import type { Curriculum } from '@/lib/api';

/** KG / K–8 → fixed CBSE; 9–10 → curriculum choice; 11–12 → curriculum + speciality */
export type SignupLevelTier = 'k8' | 'g910' | 'g1112';

/**
 * Maps API level display name to signup tier. Uses English-style labels (Grade/Class, KG).
 * Unknown names default to `g910` (curriculum choice, no speciality).
 */
export function getLevelTierFromName(name: string): SignupLevelTier {
  const n = name.toLowerCase();
  if (/\b(grade|class)\s*1[12]\b/.test(n)) return 'g1112';
  if (/\b(grade|class)\s*(9|10)\b/.test(n)) return 'g910';
  if (/\bkg\s*\d*\b/.test(n) || /kindergarten|nursery|prep\b/.test(n)) return 'k8';
  if (/\b(grade|class)\s*[1-8]\b/.test(n)) return 'k8';
  return 'g910';
}

/** Pick CBSE from GET /curriculums/public (name contains "cbse", case-insensitive). */
export function findCbseCurriculum(curriculums: Curriculum[]): Curriculum | undefined {
  return curriculums.find((c) => {
    const x = c.name.toLowerCase().trim();
    return x === 'cbse' || x.includes('cbse');
  });
}
