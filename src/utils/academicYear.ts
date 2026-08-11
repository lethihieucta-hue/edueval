/**
 * Utility quản lý Năm Học & Chu Kỳ Thời Gian theo quy chuẩn Ngành Giáo Dục
 * và Nghị định số 233/2026/NĐ-CP của Chính phủ.
 */

export const SUPPORTED_ACADEMIC_YEARS = [
  '2025 - 2026',
  '2026 - 2027',
  '2027 - 2028',
  '2028 - 2029',
  '2029 - 2030'
] as const;

export type AcademicYearType = typeof SUPPORTED_ACADEMIC_YEARS[number];

export const EVALUATION_PERIODS = [
  'Học kỳ I',
  'Học kỳ II',
  'Đánh giá Cả năm (Tổng kết)'
] as const;

export type EvaluationPeriodType = typeof EVALUATION_PERIODS[number];

/**
 * Tự động xác định Năm học dựa trên mốc thời gian:
 * - Chu kỳ năm học tính từ Tháng 8 năm trước đến hết Tháng 7 năm sau.
 * - Nếu tháng >= 7 (tháng 8 trở đi, do getMonth() trả về 0-11): Năm học là ${year} - ${year+1}
 *   Ví dụ: Tháng 8/2026 -> 2026 - 2027.
 * - Qua Tháng 7 năm 2027 (tức từ 01/08/2027 trở đi): Hệ thống tự động chuyển sang Năm học 2027 - 2028.
 * - Nếu tháng < 7 (tháng 1 đến tháng 7): Thuộc năm học ${year-1} - ${year}
 *   Ví dụ: Tháng 3/2027 -> 2026 - 2027.
 */
export function getAutoAcademicYear(targetDate: Date = new Date()): AcademicYearType {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth(); // 0 = Tháng 1, 6 = Tháng 7, 7 = Tháng 8

  // Nếu từ tháng 8 trở đi (month >= 7)
  if (month >= 7) {
    const calculated = `${year} - ${year + 1}` as AcademicYearType;
    return SUPPORTED_ACADEMIC_YEARS.includes(calculated) ? calculated : '2026 - 2027';
  } else {
    // Từ tháng 1 đến tháng 7 (month <= 6)
    const calculated = `${year - 1} - ${year}` as AcademicYearType;
    return SUPPORTED_ACADEMIC_YEARS.includes(calculated) ? calculated : '2026 - 2027';
  }
}

/**
 * Lấy mô tả chi tiết của Năm học và Học kỳ đang chọn
 */
export function formatAcademicYearPeriod(year: string, period: string): string {
  return `${period} (Năm học ${year})`;
}

/**
 * Chuẩn hóa chuỗi năm học (ví dụ: '2026-2027' -> '2026 - 2027')
 */
export function normalizeAcademicYear(str?: string): AcademicYearType {
  if (!str) return '2026 - 2027';
  const clean = str.replace(/\s+/g, '');
  if (clean.includes('2025-2026') || clean.includes('20252026')) return '2025 - 2026';
  if (clean.includes('2026-2027') || clean.includes('20262027')) return '2026 - 2027';
  if (clean.includes('2027-2028') || clean.includes('20272028')) return '2027 - 2028';
  if (clean.includes('2028-2029') || clean.includes('20282029')) return '2028 - 2029';
  if (clean.includes('2029-2030') || clean.includes('20292030')) return '2029 - 2030';
  return '2026 - 2027';
}
