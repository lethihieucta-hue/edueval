import { Teacher } from '../types';
import { MOCK_TEACHERS } from '../data/mockData';

/**
 * Kiểm tra xem một chuỗi có chứa ký tự rác/nhị phân từ file hỏng hay không
 */
export function isCorruptedString(str?: string | null): boolean {
  if (!str) return false;
  const s = String(str).trim();
  if (!s) return false;

  // 1. Chứa ký tự thay thế lỗi UTF-8 (replacement character \uFFFD)
  if (s.includes('\uFFFD') || s.includes('')) {
    return true;
  }

  // 2. Chứa các tên file nội bộ nhị phân của Apple Numbers / Zip (.iwa, Index/Tables,...)
  if (
    s.includes('.iwa') ||
    s.includes('Index/Tables') ||
    s.includes('DataList-') ||
    s.includes('\\3D-') ||
    s.includes('0C9C18') ||
    s.includes('B6C80DD3301') ||
    s.includes('B995-4E35-AD') ||
    s.includes('%bZB') ||
    s.includes('^P')
  ) {
    return true;
  }

  // 3. Chứa các ký tự điều khiển nhị phân ASCII không in được (\x00-\x08, \x0B, \x0C, \x0E-\x1F, \x7F)
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/.test(s)) {
    return true;
  }

  // 4. Quá nhiều ký tự biểu tượng/ký hiệu lạ không phải chữ cái tiếng Việt hoặc tiếng Anh
  const cleanAlpha = s.replace(/[\p{L}\p{N}\s.,_()\-@]/gu, '');
  if (s.length > 3 && cleanAlpha.length / s.length > 0.3) {
    return true;
  }

  // 5. Tên quá ngắn vô nghĩa (chỉ 1 chữ cái kèm ký tự lạ)
  if (s.length === 1 && !/[a-zA-Z0-9]/.test(s)) {
    return true;
  }

  return false;
}

/**
 * Kiểm tra một bản ghi Giáo viên có bị lỗi ký tự hay không
 */
export function isCorruptedTeacher(t: Partial<Teacher>): boolean {
  if (!t) return true;

  // Tên bị rỗng hoặc lỗi chuỗi
  if (!t.fullName || typeof t.fullName !== 'string') return true;
  if (isCorruptedString(t.fullName)) return true;

  // Tên quá ngắn vô nghĩa như "V", "^P", "~"
  const trimmedName = t.fullName.trim();
  if (trimmedName.length <= 1) return true;
  if (/^[\^~*!@#$%&()_+=\-[\]{};:'",.<>?/\\|`~]+$/.test(trimmedName)) return true;

  // Mã GV bị lỗi
  if (t.code && isCorruptedString(t.code)) return true;

  // Email bị lỗi
  if (t.email && isCorruptedString(t.email)) return true;

  // Tổ chuyên môn bị lỗi
  if (t.department && isCorruptedString(t.department)) return true;

  return false;
}

/**
 * Lọc sạch danh sách giáo viên, xoá toàn bộ các bản ghi lỗi ký tự/nhị phân
 */
export function cleanTeachersList(teachers: Teacher[]): {
  cleanTeachers: Teacher[];
  removedCount: number;
  removedTeachers: Teacher[];
} {
  if (!Array.isArray(teachers)) {
    return {
      cleanTeachers: MOCK_TEACHERS,
      removedCount: 0,
      removedTeachers: [],
    };
  }

  const cleanTeachers: Teacher[] = [];
  const removedTeachers: Teacher[] = [];

  for (const t of teachers) {
    if (isCorruptedTeacher(t)) {
      removedTeachers.push(t);
    } else {
      cleanTeachers.push(t);
    }
  }

  // Nếu sau khi lọc danh sách rỗng, tự động khôi phục danh sách mẫu chuẩn
  const finalTeachers = cleanTeachers.length > 0 ? cleanTeachers : MOCK_TEACHERS;

  return {
    cleanTeachers: finalTeachers,
    removedCount: removedTeachers.length,
    removedTeachers,
  };
}

/**
 * Chuẩn hóa họ tên tiếng Việt (viết hoa chữ cái đầu, xóa khoảng trắng thừa)
 */
export function formatVietnameseName(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
