import { Teacher, Department, SelfDeclarationRecord, PassiveLog, UserAccount } from '../types';
import { isCorruptedString, isCorruptedTeacher, formatVietnameseName } from '../utils/sanitizer';
import { MOCK_TEACHERS } from '../data/mockData';

// Khai báo kiểu mở rộng cho window.XLSX nếu có
declare global {
  interface Window {
    XLSX?: any;
  }
}

/**
 * Đảm bảo thư viện SheetJS (XLSX) đã sẵn sàng
 */
async function getXLSX(): Promise<any> {
  if (typeof window !== 'undefined' && window.XLSX) {
    return window.XLSX;
  }

  // Nếu chưa nạp, tải động từ CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.onload = () => {
      if (window.XLSX) {
        resolve(window.XLSX);
      } else {
        reject(new Error('Không thể tải thư viện XLSX. Vui lòng kiểm tra kết nối mạng.'));
      }
    };
    script.onerror = () => reject(new Error('Lỗi khi tải thư viện xử lý Excel.'));
    document.body.appendChild(script);
  });
}

export interface ParsedTeacherRow {
  code: string;
  fullName: string;
  department: Department;
  position: Teacher['position'];
  titleGrade: Teacher['titleGrade'];
  yearsOfTeaching: number;
  email: string;
  phone: string;
}

export interface ParseResult<T> {
  validRows: T[];
  invalidRows: {
    rowNumber: number;
    rawData: any;
    errorReason: string;
  }[];
  totalRows: number;
  sheetNames: string[];
}

/**
 * Chuẩn hóa tên cột để đối soát thông minh
 */
function normalizeHeaderName(header: string): string {
  if (!header) return '';
  return header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
    .replace(/[^a-z0-9]/g, ''); // Bỏ ký tự đặc biệt
}

/**
 * Đối soát Tổ chuyên môn thông minh
 */
export function normalizeDepartment(deptStr?: string): Department {
  if (!deptStr) return 'Tổ Toán';
  const clean = deptStr.trim().toLowerCase();
  
  if (clean.includes('toan')) return 'Tổ Toán';
  if (clean.includes('van') || clean.includes('gdktpl') || clean.includes('kinh te') || clean.includes('phap luat')) return 'Tổ Văn - GDKTPL';
  if (clean.includes('hoa') || clean.includes('sinh')) return 'Tổ Hoá - Sinh';
  if (clean.includes('su') || clean.includes('dia') || clean.includes('anh') || clean.includes('ngoai ngu') || clean.includes('tieng anh')) return 'Tổ Sử - Địa - Anh Văn';
  if (clean.includes('ly') || clean.includes('the duc') || clean.includes('td') || clean.includes('qp') || clean.includes('quoc phong') || clean.includes('vat ly')) return 'Tổ Lý - TD - QP';
  if (clean.includes('tin') || clean.includes('cong nghe') || clean.includes('cntt') || clean.includes('tin hoc')) return 'Tổ Tin - Công nghệ';
  if (clean.includes('van phong') || clean.includes('ke toan') || clean.includes('y te') || clean.includes('thu vien') || clean.includes('thiet bi') || clean.includes('hanh chinh')) return 'Tổ Văn Phòng';

  return 'Tổ Toán';
}

/**
 * Đối soát Chức vụ thông minh
 */
export function normalizePosition(posStr?: string): Teacher['position'] {
  if (!posStr) return 'Giáo viên THPT';
  const clean = posStr.trim().toLowerCase();

  if (clean.includes('hieu truong') || clean.includes('bgh') || clean.includes('lanh dao') || clean.includes('pho hieu truong')) return 'Hiệu trưởng';
  if (clean.includes('to truong') || clean.includes('truong bo mon')) return 'Tổ trưởng chuyên môn';
  if (clean.includes('to pho') || clean.includes('pho to') || clean.includes('pho bo mon')) return 'Tổ phó chuyên môn';
  if (clean.includes('hop dong') || clean.includes('hdld') || clean.includes('hợp đồng')) return 'Hợp đồng lao động';
  if (clean.includes('van phong') || clean.includes('ke toan') || clean.includes('y te') || clean.includes('thu vien')) return 'Nhân viên Văn phòng';
  return 'Giáo viên THPT';
}

/**
 * Đối soát Hạng chức danh thông minh
 */
export function normalizeTitleGrade(gradeStr?: string): Teacher['titleGrade'] {
  if (!gradeStr) return 'Giáo viên THPT Hạng II';
  const clean = gradeStr.trim().toLowerCase();

  if (clean.includes('hang i') || clean.includes('hạng 1') || clean.includes('hang 1') || clean.includes('hạng i') || clean.includes('hang i ')) return 'Giáo viên THPT Hạng I';
  if (clean.includes('hang iii') || clean.includes('hạng 3') || clean.includes('hang 3') || clean.includes('hạng iii') || clean.includes('hang 3')) return 'Giáo viên THPT Hạng III';
  return 'Giáo viên THPT Hạng II';
}

/**
 * Trích xuất danh sách Giáo viên từ mảng hàng 2 chiều thô (raw 2D rows)
 */
export function extractTeachersFromRaw2DMatrix(rawRows: any[][]): ParseResult<ParsedTeacherRow> {
  if (!rawRows || rawRows.length < 2) {
    throw new Error('Dữ liệu không có đủ hàng để xử lý (tối thiểu 1 hàng tiêu đề và 1 hàng dữ liệu).');
  }

  // Tìm hàng tiêu đề (header row) - Quét tối đa 10 dòng đầu
  let headerRowIndex = 0;
  let codeCol = -1;
  let nameCol = -1;
  let deptCol = -1;
  let posCol = -1;
  let gradeCol = -1;
  let yearsCol = -1;
  let emailCol = -1;
  let phoneCol = -1;

  for (let r = 0; r < Math.min(10, rawRows.length); r++) {
    const row = rawRows[r].map((cell) => normalizeHeaderName(String(cell || '')));
    for (let c = 0; c < row.length; c++) {
      const h = row[c];
      if (h.includes('magv') || h.includes('maso') || h.includes('macb') || h.includes('code') || h.includes('id') || (h.startsWith('ma') && !h.includes('mail'))) {
        if (codeCol === -1) codeCol = c;
      }
      if (h.includes('hovaten') || h.includes('hoten') || h.includes('tengv') || h.includes('ten') || h.includes('fullname') || h.includes('name') || h.includes('giaovien') || h.includes('canbo')) {
        if (nameCol === -1) nameCol = c;
      }
      if (h.includes('tochuyenmon') || h.includes('tobomon') || h.includes('to') || h.includes('bomon') || h.includes('department') || h.includes('dept') || h.includes('phongban')) {
        if (deptCol === -1) deptCol = c;
      }
      if (h.includes('chucvu') || h.includes('vitri') || h.includes('position') || h.includes('pos') || h.includes('vaitro') || h.includes('chucdanh')) {
        if (posCol === -1) posCol = c;
      }
      if (h.includes('hangchucdanh') || h.includes('hang') || h.includes('grade') || h.includes('ngach')) {
        if (gradeCol === -1) gradeCol = c;
      }
      if (h.includes('thamnien') || h.includes('sonam') || h.includes('namcongtac') || h.includes('years') || h.includes('nam')) {
        if (yearsCol === -1) yearsCol = c;
      }
      if (h.includes('email') || h.includes('thudientu') || h.includes('mail')) {
        if (emailCol === -1) emailCol = c;
      }
      if (h.includes('sodienthoai') || h.includes('sdt') || h.includes('dienthoai') || h.includes('phone') || h.includes('tel')) {
        if (phoneCol === -1) phoneCol = c;
      }
    }

    if (nameCol !== -1) {
      headerRowIndex = r;
      break;
    }
  }

  // Nếu không tìm thấy cột họ tên rõ ràng, fallback theo vị trí cột mẫu
  if (nameCol === -1) {
    headerRowIndex = 0;
    codeCol = 0;
    nameCol = 1;
    deptCol = 2;
    posCol = 3;
    gradeCol = 4;
    yearsCol = 5;
    emailCol = 6;
    phoneCol = 7;
  }

  const validRows: ParsedTeacherRow[] = [];
  const invalidRows: { rowNumber: number; rawData: any; errorReason: string }[] = [];

  for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!row || row.every((c: any) => String(c || '').trim() === '')) {
      continue; // Bỏ qua hàng trống
    }

    const rawName = String(nameCol !== -1 && row[nameCol] ? row[nameCol] : '').trim();
    const rawCode = String(codeCol !== -1 && row[codeCol] ? row[codeCol] : '').trim();
    const rawDept = String(deptCol !== -1 && row[deptCol] ? row[deptCol] : '').trim();
    const rawPos = String(posCol !== -1 && row[posCol] ? row[posCol] : '').trim();
    const rawGrade = String(gradeCol !== -1 && row[gradeCol] ? row[gradeCol] : '').trim();
    const rawYears = yearsCol !== -1 && row[yearsCol] !== undefined ? Number(row[yearsCol]) : 5;
    const rawEmail = String(emailCol !== -1 && row[emailCol] ? row[emailCol] : '').trim();
    const rawPhone = String(phoneCol !== -1 && row[phoneCol] ? row[phoneCol] : '').trim();

    // 1. Kiểm tra họ tên
    if (!rawName) {
      invalidRows.push({
        rowNumber: r + 1,
        rawData: row,
        errorReason: 'Thiếu họ và tên giáo viên',
      });
      continue;
    }

    if (isCorruptedString(rawName) || rawName.length < 2) {
      invalidRows.push({
        rowNumber: r + 1,
        rawData: row,
        errorReason: `Họ tên "${rawName}" chứa ký tự lỗi/nhị phân không đọc được.`,
      });
      continue;
    }

    if (isCorruptedString(rawCode)) {
      invalidRows.push({
        rowNumber: r + 1,
        rawData: row,
        errorReason: `Mã giáo viên "${rawCode}" bị lỗi ký tự.`,
      });
      continue;
    }

    const formattedName = formatVietnameseName(rawName);
    const department = normalizeDepartment(rawDept);
    const position = normalizePosition(rawPos);
    const titleGrade = normalizeTitleGrade(rawGrade);
    const years = isNaN(rawYears) || rawYears < 0 ? 5 : Math.round(rawYears);

    // Tự sinh email chuẩn nếu chưa có
    const defaultEmail = `${formattedName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '.')}@thptchauthanha.edu.vn`;

    const code = rawCode || `GV-CT-${Math.floor(100 + Math.random() * 900)}`;
    const email = rawEmail && rawEmail.includes('@') ? rawEmail : defaultEmail;
    const phone = rawPhone || '0900 000 000';

    validRows.push({
      code,
      fullName: formattedName,
      department,
      position,
      titleGrade,
      yearsOfTeaching: years,
      email,
      phone,
    });
  }

  return {
    validRows,
    invalidRows,
    totalRows: rawRows.length - (headerRowIndex + 1),
    sheetNames: ['DuLieuGiaoVien'],
  };
}

/**
 * Phân tích file Excel (.xlsx, .xls) hoặc CSV để nạp danh sách Giáo viên
 */
export async function parseTeachersExcelFile(file: File): Promise<ParseResult<ParsedTeacherRow>> {
  const fileNameLower = file.name.toLowerCase();
  if (fileNameLower.endsWith('.numbers')) {
    throw new Error(
      'File của bạn có định dạng Apple Numbers (.numbers). Vui lòng mở file trên máy Mac/iPhone, chọn "File" > "Export To" > "Excel (.xlsx)" hoặc "CSV" trước khi tải lên hệ thống EduEval.'
    );
  }

  const XLSX = await getXLSX();
  const buffer = await file.arrayBuffer();

  let workbook: any;
  try {
    workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  } catch (err: any) {
    throw new Error('Không thể đọc file bảng tính. File có thể bị hỏng hoặc sai định dạng Excel chuẩn.');
  }

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('File Excel không có trang tính (sheet) nào chứa dữ liệu.');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  const result = extractTeachersFromRaw2DMatrix(rawRows);
  result.sheetNames = workbook.SheetNames;
  return result;
}

/**
 * Phân tích nội dung Copy-Paste trực tiếp từ Excel hoặc Google Sheets
 */
export function parsePastedSpreadsheetText(pastedText: string): ParseResult<ParsedTeacherRow> {
  if (!pastedText || !pastedText.trim()) {
    throw new Error('Chưa có nội dung dán từ bảng tính.');
  }

  const lines = pastedText.split(/\r\n|\n/).filter((l) => l.trim() !== '');
  if (lines.length < 1) {
    throw new Error('Nội dung dán không chứa hàng dữ liệu hợp lệ.');
  }

  // Nhận diện tab (\t) hoặc dấu phẩy (,) hoặc dấu chấm phẩy (;)
  const sampleLine = lines[0];
  let delimiter = '\t';
  if (sampleLine.includes('\t')) {
    delimiter = '\t';
  } else if (sampleLine.includes(';') && (sampleLine.match(/;/g)?.length || 0) >= 3) {
    delimiter = ';';
  } else if (sampleLine.includes(',') && (sampleLine.match(/,/g)?.length || 0) >= 3) {
    delimiter = ',';
  }

  const rawRows = lines.map((line) => {
    return line.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ''));
  });

  return extractTeachersFromRaw2DMatrix(rawRows);
}

/**
 * Tải và phân tích từ Google Sheets công khai (Public CSV Link / Sheet ID)
 */
export async function fetchAndParseGoogleSheetUrl(sheetUrl: string): Promise<ParseResult<ParsedTeacherRow>> {
  if (!sheetUrl || !sheetUrl.trim()) {
    throw new Error('Vui lòng nhập đường link Google Sheets hợp lệ.');
  }

  let fetchUrl = sheetUrl.trim();
  // Chuyển đổi link Google Sheet sang CSV export link nếu cần
  const match = fetchUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  }

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Không thể kết nối tới Google Sheets (${response.statusText}). Hãy chắc chắn rằng bảng tính Google Sheets của bạn đã được bật chế độ chia sẻ công khai ("Bất kỳ ai có liên kết đều có thể xem").`);
  }

  const csvText = await response.text();
  return parsePastedSpreadsheetText(csvText);
}

/**
 * Xuất Danh Sách 70 Tài Khoản Ra File Excel (.xlsx) Kèm Mật Khẩu
 */
export async function exportAccountsToExcel(
  accounts: UserAccount[], 
  academicYear: string = '2026 - 2027'
): Promise<void> {
  const XLSX = await getXLSX();

  const data = accounts.map((acc, idx) => {
    let roleText = 'Giáo viên (Tự chấm điểm & Kê khai)';
    if (acc.role === 'ADMIN_PRINCIPAL') {
      roleText = 'Ban Giám Hiệu / Admin (Toàn quyền quản trị & Ký số)';
    } else if (acc.role === 'HEAD_OF_DEPARTMENT') {
      roleText = 'Tổ trưởng / Tổ phó (Chấm điểm tổ & Duyệt cấp 1)';
    }

    return {
      'STT': idx + 1,
      'Mã Định Danh': acc.teacherId,
      'Họ và Tên': acc.fullName,
      'Tổ Chuyên Môn': acc.department,
      'Chức Vụ': acc.position,
      'Phân Quyền Hệ Thống': roleText,
      'Tên Đăng Nhập (Username)': acc.username,
      'Mật Khẩu Mặc Định (Password)': acc.passwordHash,
      'Email Đăng Ký': acc.email || `${acc.username}@thptchauthanha.edu.vn`,
      'Số Điện Thoại': acc.phone || '0900 000 000',
      'Hướng Dẫn Đăng Nhập': 'Đăng nhập tại EduEval THPT Châu Thành A, tự đổi mật khẩu sau lần đăng nhập đầu tiên.',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 16 }, // Mã
    { wch: 24 }, // Họ tên
    { wch: 22 }, // Tổ
    { wch: 22 }, // Chức vụ
    { wch: 36 }, // Quyền
    { wch: 24 }, // Username
    { wch: 24 }, // Password
    { wch: 32 }, // Email
    { wch: 16 }, // SĐT
    { wch: 55 }, // Ghi chú
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSach_TaiKhoan_70GV');

  const fileName = `DanhSach_TaiKhoan_EduEval_70GV_THPT_ChauThanhA_${academicYear.replace(/\s+/g, '')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Xuất Toàn Bộ 70 Giáo Viên Mẫu Ra File Excel (.xlsx) Chuẩn
 */
export async function export70TeachersSampleExcel(): Promise<void> {
  const XLSX = await getXLSX();

  const data = MOCK_TEACHERS.map((t, idx) => ({
    'STT': idx + 1,
    'Mã GV': t.code,
    'Họ và Tên': t.fullName,
    'Tổ Chuyên Môn': t.department,
    'Chức Vụ': t.position,
    'Hạng Chức Danh': t.titleGrade,
    'Thâm Niên (Năm)': t.yearsOfTeaching,
    'Email': t.email,
    'Số Điện Thoại': t.phone,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 16 },
    { wch: 24 },
    { wch: 22 },
    { wch: 24 },
    { wch: 24 },
    { wch: 16 },
    { wch: 34 },
    { wch: 16 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSach_70_GiaoVien_Mau');
  XLSX.writeFile(workbook, 'DanhSach_Mau_70_GiaoVien_THPT_ChauThanhA.xlsx');
}

/**
 * Xuất Danh Sách Giáo Viên Ra File Excel (.xlsx) Đẹp Chuẩn Sư Phạm
 * Theo Nghị định số 233/2026/NĐ-CP của Chính phủ
 */
export async function exportTeachersToExcel(
  teachers: Teacher[], 
  customFileName?: string,
  academicYear: string = '2026 - 2027',
  period: string = 'Học kỳ I'
): Promise<void> {
  const XLSX = await getXLSX();

  // Lọc bỏ giáo viên lỗi trước khi xuất
  const validTeachers = teachers.filter((t) => !isCorruptedTeacher(t));

  const data = validTeachers.map((t, idx) => {
    const ev = t.currentEvaluation;
    return {
      'STT': idx + 1,
      'Mã GV': t.code,
      'Họ và Tên': t.fullName,
      'Tổ Chuyên Môn': t.department,
      'Chức Vụ': t.position,
      'Hạng Chức Danh': t.titleGrade,
      'Thâm Niên (Năm)': t.yearsOfTeaching,
      'Email': t.email,
      'Số Điện Thoại': t.phone,
      'Năm Học': academicYear,
      'Đợt Đánh Giá': period,
      'Điểm Tự Chấm (40%)': ev?.scores['crit_1']?.selfScore ?? 85,
      'Điểm Tổ Chấm (40%)': ev?.scores['crit_1']?.headScore ?? 85,
      'Điểm BGH Chuyên Môn (40%)': ev?.scores['crit_1']?.principalScore ?? 85,
      'Điểm Kỷ Luật (20%)': ev?.scores['crit_2']?.principalScore ?? 90,
      'Điểm CNTT & AI (20%)': ev?.scores['crit_3']?.principalScore ?? 85,
      'Điểm Thi Đua (20%)': ev?.scores['crit_4']?.principalScore ?? 85,
      'Điểm Thụ Động (+/-)': ev?.passivePointsTotal ?? 0,
      'Điểm Tổng Kết': ev?.finalScore ?? 85.0,
      'Xếp Loại (NĐ 233)': ev?.classification ?? 'HTTNV',
      'Trạng Thái Phê Duyệt': ev?.status === 'APPROVED' ? 'Đã Phê Duyệt (Ký Số NĐ 233)' : ev?.status === 'HEAD_REVIEWED' ? 'Tổ Trưởng Đã Duyệt' : 'Bản Thảo Tự Chấm',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã GV
    { wch: 24 }, // Họ và Tên
    { wch: 22 }, // Tổ Chuyên Môn
    { wch: 22 }, // Chức Vụ
    { wch: 24 }, // Hạng Chức Danh
    { wch: 15 }, // Thâm Niên
    { wch: 32 }, // Email
    { wch: 15 }, // SĐT
    { wch: 15 }, // Năm học
    { wch: 16 }, // Đợt
    { wch: 18 }, // Điểm tự chấm
    { wch: 18 }, // Điểm tổ chấm
    { wch: 22 }, // Điểm BGH
    { wch: 18 }, // Tiêu chí 2
    { wch: 18 }, // Tiêu chí 3
    { wch: 18 }, // Tiêu chí 4
    { wch: 16 }, // Thụ động
    { wch: 16 }, // Điểm tổng kết
    { wch: 18 }, // Xếp loại
    { wch: 26 }, // Trạng thái
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSach_GiaoVien_ND233');

  const fileName = customFileName || `DanhSach_GiaoVien_ND233_THPT_ChauThanhA_${academicYear.replace(/\s+/g, '')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Xuất File Mẫu Excel (.xlsx) Rỗng Để Người Dùng Nhập Dữ Liệu Giáo Viên
 */
export async function exportTeacherTemplateExcel(): Promise<void> {
  const XLSX = await getXLSX();

  // Sheet 1: Dữ liệu mẫu 6 giáo viên
  const sampleData = [
    {
      'Mã GV': 'GV-TOAN-101',
      'Họ và Tên': 'Nguyễn Văn An',
      'Tổ Chuyên Môn': 'Tổ Toán',
      'Chức Vụ': 'Giáo viên THPT',
      'Hạng Chức Danh': 'Giáo viên THPT Hạng II',
      'Thâm Niên (Năm)': 12,
      'Email': 'nguyenvanan@thptchauthanha.edu.vn',
      'Số Điện Thoại': '0912345678',
    },
    {
      'Mã GV': 'GV-VAN-102',
      'Họ và Tên': 'Lê Thị Mai',
      'Tổ Chuyên Môn': 'Tổ Văn - GDKTPL',
      'Chức Vụ': 'Tổ trưởng chuyên môn',
      'Hạng Chức Danh': 'Giáo viên THPT Hạng I',
      'Thâm Niên (Năm)': 18,
      'Email': 'lethimai@thptchauthanha.edu.vn',
      'Số Điện Thoại': '0987654321',
    },
    {
      'Mã GV': 'GV-LY-103',
      'Họ và Tên': 'Trần Quốc Bảo',
      'Tổ Chuyên Môn': 'Tổ Lý - TD - QP',
      'Chức Vụ': 'Giáo viên THPT',
      'Hạng Chức Danh': 'Giáo viên THPT Hạng III',
      'Thâm Niên (Năm)': 4,
      'Email': 'tranquocbao@thptchauthanha.edu.vn',
      'Số Điện Thoại': '0909123456',
    },
    {
      'Mã GV': 'GV-HOA-104',
      'Họ và Tên': 'Phạm Ngọc Hân',
      'Tổ Chuyên Môn': 'Tổ Hoá - Sinh',
      'Chức Vụ': 'Giáo viên THPT',
      'Hạng Chức Danh': 'Giáo viên THPT Hạng II',
      'Thâm Niên (Năm)': 9,
      'Email': 'phamngochan@thptchauthanha.edu.vn',
      'Số Điện Thoại': '0933112233',
    },
    {
      'Mã GV': 'GV-TIN-105',
      'Họ và Tên': 'Vũ Hoàng Nam',
      'Tổ Chuyên Môn': 'Tổ Tin - Công nghệ',
      'Chức Vụ': 'Giáo viên THPT',
      'Hạng Chức Danh': 'Giáo viên THPT Hạng II',
      'Thâm Niên (Năm)': 7,
      'Email': 'vuhoangnam@thptchauthanha.edu.vn',
      'Số Điện Thoại': '0977889900',
    },
    {
      'Mã GV': 'GV-SU-106',
      'Họ và Tên': 'Đặng Kim Ngân',
      'Tổ Chuyên Môn': 'Tổ Sử - Địa - Anh Văn',
      'Chức Vụ': 'Tổ phó chuyên môn',
      'Hạng Chức Danh': 'Giáo viên THPT Hạng I',
      'Thâm Niên (Năm)': 15,
      'Email': 'dangkimngan@thptchauthanha.edu.vn',
      'Số Điện Thoại': '0966445566',
    },
  ];

  const wsSample = XLSX.utils.json_to_sheet(sampleData);
  wsSample['!cols'] = [
    { wch: 16 },
    { wch: 22 },
    { wch: 22 },
    { wch: 24 },
    { wch: 24 },
    { wch: 16 },
    { wch: 34 },
    { wch: 16 },
  ];

  // Sheet 2: Hướng dẫn quy định
  const guideData = [
    {
      'Tên Cột': 'Mã GV',
      'Bắt Buộc': 'Không (Tự động sinh nếu trống)',
      'Giá Trị Mẫu': 'GV-CT-101, GV-TOAN-01',
      'Ghi Chú': 'Mã định danh duy nhất của giáo viên',
    },
    {
      'Tên Cột': 'Họ và Tên',
      'Bắt Buộc': 'BẮT BUỘC',
      'Giá Trị Mẫu': 'Nguyễn Văn An, Lê Thị Mai',
      'Ghi Chú': 'Tên tiếng Việt đầy đủ, hệ thống tự chuẩn hoá viết hoa',
    },
    {
      'Tên Cột': 'Tổ Chuyên Môn',
      'Bắt Buộc': 'Khuyến nghị',
      'Giá Trị Mẫu': 'Tổ Toán, Tổ Văn - GDKTPL, Tổ Hoá - Sinh, Tổ Sử - Địa - Anh Văn, Tổ Lý - TD - QP, Tổ Tin - Công nghệ, Tổ Văn Phòng',
      'Ghi Chú': 'Hệ thống tự động nhận diện theo tên tổ chuẩn',
    },
    {
      'Tên Cột': 'Chức Vụ',
      'Bắt Buộc': 'Không',
      'Giá Trị Mẫu': 'Giáo viên THPT, Tổ trưởng chuyên môn, Tổ phó chuyên môn, Hiệu trưởng',
      'Ghi Chú': 'Mặc định là "Giáo viên THPT"',
    },
    {
      'Tên Cột': 'Hạng Chức Danh',
      'Bắt Buộc': 'Không',
      'Giá Trị Mẫu': 'Giáo viên THPT Hạng I, Giáo viên THPT Hạng II, Giáo viên THPT Hạng III',
      'Ghi Chú': 'Mặc định là "Giáo viên THPT Hạng II"',
    },
    {
      'Tên Cột': 'Thâm Niên (Năm)',
      'Bắt Buộc': 'Không',
      'Giá Trị Mẫu': '5, 10, 15',
      'Ghi Chú': 'Số năm công tác trong ngành giáo dục',
    },
  ];

  const wsGuide = XLSX.utils.json_to_sheet(guideData);
  wsGuide['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 45 }, { wch: 45 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, wsSample, 'DanhSach_GiaoVien_Mau');
  XLSX.utils.book_append_sheet(workbook, wsGuide, 'HuongDan_QuyDinh');

  XLSX.writeFile(workbook, 'Mau_Import_DanhSach_GiaoVien_EduEval.xlsx');
}

/**
 * Xuất Danh Sách Tự Kê Khai / Phong Trào Ra Excel (.xlsx)
 */
export async function exportDeclarationsToExcel(declarations: SelfDeclarationRecord[]): Promise<void> {
  const XLSX = await getXLSX();

  const data = declarations.map((d, idx) => ({
    'STT': idx + 1,
    'Mã Bản Kê': d.id,
    'Họ và Tên Giáo Viên': d.teacherName,
    'Tổ Chuyên Môn': d.department,
    'Loại Kê Khai': d.type === 'BONUS_AWARD' ? 'Khen Thưởng / Phong Trào (+)' : 'Kỷ Luật / Vi Phạm (-)',
    'Cấp / Danh Mục': d.categoryOrLevel,
    'Tên Phong Trào / Sự Kiện': d.title,
    'Giải Thưởng / Lỗi Vi Phạm': d.awardNameOrInfraction,
    'Điểm Đề Xuất (+/-)': d.suggestedPoints,
    'Minh Chứng / Mô Tả': d.evidenceUrlOrDesc,
    'Thời Gian Nộp': d.submittedAt,
    'Trạng Thái': d.status === 'APPROVED' ? 'Đã Phê Duyệt (Ký Số)' : d.status === 'PENDING_PRINCIPAL' ? 'Chờ BGH Duyệt' : d.status === 'PENDING_HEAD' ? 'Chờ Tổ Trưởng Duyệt' : 'Từ Chối',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 22 },
    { wch: 20 },
    { wch: 24 },
    { wch: 22 },
    { wch: 35 },
    { wch: 24 },
    { wch: 16 },
    { wch: 35 },
    { wch: 18 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'TuKeKhai_PhongTrao');
  XLSX.writeFile(workbook, `DanhSach_TuKeKhai_EduEval_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Xuất File Mẫu Tự Kê Khai Ra Excel (.xlsx)
 */
export async function exportDeclarationTemplateExcel(): Promise<void> {
  const XLSX = await getXLSX();

  const sampleData = [
    {
      'Mã GV hoặc Tên GV': 'Trần Văn Hoàng',
      'Loại Khai Báo (BONUS/PENALTY)': 'BONUS',
      'Cấp / Danh Mục': 'Cấp Tỉnh / Thành phố',
      'Tên Phong Trào hoặc Lỗi Vi Phạm': 'Hội thi Thiết kế Bài giảng Số & Elearning',
      'Giải Thưởng hoặc Chi Tiết': 'Giải Nhất',
      'Điểm Đề Xuất (+/-)': 8.0,
      'Minh Chứng / Mô Tả': 'Quyết định khen thưởng số 1234/QĐ-SGDĐT',
    },
    {
      'Mã GV hoặc Tên GV': 'Phạm Minh Đức',
      'Loại Khai Báo (BONUS/PENALTY)': 'BONUS',
      'Cấp / Danh Mục': 'Cấp Xã (Cụm Trường)',
      'Tên Phong Trào hoặc Lỗi Vi Phạm': 'Hội thao Người giáo viên THPT môn Bóng chuyền',
      'Giải Thưởng hoặc Chi Tiết': 'Giải Nhất',
      'Điểm Đề Xuất (+/-)': 4.0,
      'Minh Chứng / Mô Tả': 'Giấy khen cụm thi đua số 3 môn bóng chuyền hơi',
    },
    {
      'Mã GV hoặc Tên GV': 'Nguyễn Minh Tuấn',
      'Loại Khai Báo (BONUS/PENALTY)': 'PENALTY',
      'Cấp / Danh Mục': 'Vi phạm nếp sống / Kỷ luật',
      'Tên Phong Trào hoặc Lỗi Vi Phạm': 'Nộp chậm giáo án tuần 10 & trễ sinh hoạt',
      'Giải Thưởng hoặc Chi Tiết': 'Trễ 15 phút chào cờ',
      'Điểm Đề Xuất (+/-)': -2.0,
      'Minh Chứng / Mô Tả': 'Giải trình tự kiểm điểm nộp chậm giáo án',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 22 },
    { wch: 26 },
    { wch: 24 },
    { wch: 38 },
    { wch: 26 },
    { wch: 18 },
    { wch: 40 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_TuKeKhai');
  XLSX.writeFile(workbook, 'Mau_Import_TuKeKhai_PhongTrao_EduEval.xlsx');
}
