import { 
  Teacher, 
  EvaluationCriteria, 
  WeightMatrix, 
  AuditLogItem, 
  AppealDispute,
  DepartmentInfo,
  EmulationMovement,
  MovementParticipation,
  AttendanceRecord,
  SelfDeclarationRecord,
  UserAccount,
  Department,
  AssessmentClassification
} from '../types';

export const INITIAL_DEPARTMENT_INFOS: DepartmentInfo[] = [
  { id: 'dept_1', name: 'Tổ Toán', headTeacherName: 'Trần Văn Hoàng', deputyHeadTeacherName: 'Nguyễn Văn Đạt', description: 'Toán học & Ứng dụng tư duy logic' },
  { id: 'dept_2', name: 'Tổ Văn - GDKTPL', headTeacherName: 'Lê Thị Thu Hà', deputyHeadTeacherName: 'Phạm Thị Mai', description: 'Ngữ văn & Giáo dục kinh tế và pháp luật' },
  { id: 'dept_3', name: 'Tổ Hoá - Sinh', headTeacherName: 'Nguyễn Văn Minh', deputyHeadTeacherName: 'Trần Thị Thu Thảo', description: 'Hóa học, Sinh học & Nghiên cứu khoa học' },
  { id: 'dept_4', name: 'Tổ Sử - Địa - Anh Văn', headTeacherName: 'Đỗ Thị Phương Thảo', deputyHeadTeacherName: 'Đặng Kim Ngân', description: 'Lịch sử, Địa lý & Tiếng Anh' },
  { id: 'dept_5', name: 'Tổ Lý - TD - QP', headTeacherName: 'Phạm Minh Đức', deputyHeadTeacherName: 'Lê Quốc Hùng', description: 'Vật lý, Thể dục & Giáo dục quốc phòng' },
  { id: 'dept_6', name: 'Tổ Tin - Công nghệ', headTeacherName: 'Hoàng Quốc Việt', deputyHeadTeacherName: 'Vũ Hoàng Nam', description: 'Tin học, Công nghệ & Chuyển đổi số' },
  { id: 'dept_7', name: 'Tổ Văn Phòng', headTeacherName: 'Nguyễn Thị Bích', deputyHeadTeacherName: 'Lê Minh Tuấn', description: 'Hành chính, Kế toán, Y tế & Thư viện' }
];

export const INITIAL_EMULATION_MOVEMENTS: EmulationMovement[] = [
  {
    id: 'mov_2011',
    title: 'Phong trào Thi đua Dạy tốt - Học tốt Chào mừng Ngày Nhà giáo Việt Nam 20/11',
    academicYear: '2026 - 2027',
    startDate: '2026-10-15',
    endDate: '2026-11-20',
    description: 'Đội ngũ giáo viên thi đua tiết dạy tốt, bài giảng E-learning sáng tạo và bồi dưỡng học sinh giỏi.',
    status: 'ACTIVE',
    awardRules: [
      { id: 'r1', level: 'Cấp Trường', awardName: 'Giải Nhất', points: 3.0 },
      { id: 'r2', level: 'Cấp Trường', awardName: 'Giải Nhì', points: 2.0 },
      { id: 'r3', level: 'Cấp Trường', awardName: 'Giải Ba', points: 1.5 },
      { id: 'r4', level: 'Cấp Xã (Cụm Trường)', awardName: 'Giải Nhất', points: 5.0 },
      { id: 'r5', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhất', points: 8.0 },
      { id: 'r6', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhì', points: 6.0 },
      { id: 'r7', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Ba', points: 4.0 },
      { id: 'r8', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Khuyến Khích', points: 2.5 },
      { id: 'r9', level: 'Cấp Quốc Gia', awardName: 'Giải Nhất', points: 10.0 }
    ]
  },
  {
    id: 'mov_gvg',
    title: 'Hội thi Giáo viên Dạy giỏi & Giảng dạy Tích cực THPT Châu Thành A',
    academicYear: '2026 - 2027',
    startDate: '2026-11-01',
    endDate: '2026-12-15',
    description: 'Đánh giá năng lực sư phạm, đổi mới hình thức tổ chức lớp học và thực hiện Chương trình GDPT 2018.',
    status: 'ACTIVE',
    awardRules: [
      { id: 'rg1', level: 'Cấp Trường', awardName: 'Giải Nhất', points: 4.0 },
      { id: 'rg2', level: 'Cấp Trường', awardName: 'Giải Nhì', points: 3.0 },
      { id: 'rg3', level: 'Cấp Xã (Cụm Trường)', awardName: 'Giải Nhất', points: 6.0 },
      { id: 'rg4', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhất', points: 9.0 }
    ]
  },
  {
    id: 'mov_cds',
    title: 'Hội thi Thiết kế Bài giảng Số, Elearning & Sáng kiến AI trong Giáo dục năm 2026-2027',
    academicYear: '2026 - 2027',
    startDate: '2026-11-01',
    endDate: '2027-01-15',
    description: 'Khuyến khích tích hợp công cụ AI, sơ đồ tư duy số và bài giảng Elearning tương tác vào chương trình giảng dạy.',
    status: 'ACTIVE',
    awardRules: [
      { id: 'rc1', level: 'Cấp Trường', awardName: 'Giải Nhất', points: 4.0 },
      { id: 'rc2', level: 'Cấp Trường', awardName: 'Giải Nhì', points: 2.5 },
      { id: 'rc3', level: 'Cấp Xã (Cụm Trường)', awardName: 'Giải Nhất', points: 5.0 },
      { id: 'rc4', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhất', points: 8.0 },
      { id: 'rc5', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhì', points: 6.0 }
    ]
  },
  {
    id: 'mov_khkt',
    title: 'Cuộc thi Nghiên cứu Khoa học Kỹ thuật (KHKT) & Bồi dưỡng HSG các Cấp',
    academicYear: '2026 - 2027',
    startDate: '2026-09-01',
    endDate: '2027-03-30',
    description: 'Giáo viên hướng dẫn học sinh thực hiện dự án nghiên cứu KHKT và ôn luyện đội tuyển học sinh giỏi.',
    status: 'ACTIVE',
    awardRules: [
      { id: 'rk1', level: 'Cấp Xã (Cụm Trường)', awardName: 'Giải Nhất', points: 4.5 },
      { id: 'rk2', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhất', points: 7.0 },
      { id: 'rk3', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhì', points: 5.0 },
      { id: 'rk4', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Ba', points: 3.5 },
      { id: 'rk5', level: 'Cấp Quốc Gia', awardName: 'Giải Nhất', points: 10.0 }
    ]
  }
];

export const INITIAL_MOVEMENT_PARTICIPATIONS: MovementParticipation[] = [
  {
    id: 'mp_01',
    movementId: 'mov_2011',
    movementTitle: 'Phong trào Thi đua Dạy tốt - Học tốt Chào mừng Ngày Nhà giáo Việt Nam 20/11',
    teacherId: 'gv_toan_01',
    teacherName: 'Trần Văn Hoàng',
    department: 'Tổ Toán',
    level: 'Cấp Tỉnh / Thành phố',
    awardName: 'Giải Nhất',
    pointsEarned: 8.0,
    recordedDate: '2026-11-18',
    note: 'Bồi dưỡng HSG Toán 12 đạt 02 giải Nhất cấp Tỉnh / Thành phố.'
  },
  {
    id: 'mp_02',
    movementId: 'mov_cds',
    movementTitle: 'Hội thi Thiết kế Bài giảng Số, Elearning & Sáng kiến AI trong Giáo dục năm 2026-2027',
    teacherId: 'gv_tin_01',
    teacherName: 'Hoàng Quốc Việt',
    department: 'Tổ Tin - Công nghệ',
    level: 'Cấp Trường',
    awardName: 'Giải Nhất',
    pointsEarned: 4.0,
    recordedDate: '2026-11-28',
    note: 'Sáng kiến hệ thống quét mã QR điểm danh tự động.'
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att_01',
    teacherId: 'gv_sudiaanh_03',
    teacherName: 'Nguyễn Minh Tuấn',
    department: 'Tổ Sử - Địa - Anh Văn',
    date: '2026-10-10',
    type: 'DI_TRE',
    minutesLate: 15,
    reason: 'Trễ buổi sinh hoạt chào cờ đầu tuần do sự cố giao thông',
    deductPoints: 2.0,
    recordedBy: 'BGH - Phó Hiệu trưởng',
    timestamp: '2026-10-10 07:15'
  },
  {
    id: 'att_02',
    teacherId: 'gv_sudiaanh_03',
    teacherName: 'Nguyễn Minh Tuấn',
    department: 'Tổ Sử - Địa - Anh Văn',
    date: '2026-10-17',
    type: 'DI_TRE',
    minutesLate: 10,
    reason: 'Đến trường sau giờ trống cờ vào tiết 1',
    deductPoints: 1.5,
    recordedBy: 'Admin Hệ thống',
    timestamp: '2026-10-17 07:10'
  }
];

export const INITIAL_CRITERIA: EvaluationCriteria[] = [
  {
    id: 'crit_1',
    category: 'chuyen_mon',
    title: 'Thực hiện kế hoạch giáo dục & Chất lượng giảng dạy',
    description: 'Soạn giáo án đúng tiến độ, thực hiện đủ tiết dạy, chất lượng bài giảng và kết quả kiểm tra học sinh.',
    maxScore: 100,
    weightPercent: 40,
    moetCode: 'NĐ233-Đa1'
  },
  {
    id: 'crit_2',
    category: 'dao_duc_ky_luat',
    title: 'Tư tưởng chính trị, Đạo đức nhà giáo & Kỷ luật lao động',
    description: 'Chấp hành đường lối, nội quy nhà trường, đúng giờ lên lớp, ứng xử chuẩn mực với đồng nghiệp và học sinh.',
    maxScore: 100,
    weightPercent: 20,
    moetCode: 'NĐ233-Đa2'
  },
  {
    id: 'crit_3',
    category: 'doi_moi_cntt',
    title: 'Đổi mới phương pháp, Ứng dụng CNTT & Chuyển đổi số',
    description: 'Ứng dụng AI, thiết kế bài giảng E-learning, sử dụng Sổ điểm điện tử, nghiên cứu khoa học sư phạm ứng dụng.',
    maxScore: 100,
    weightPercent: 20,
    moetCode: 'TT20-TiêuChuẩn3'
  },
  {
    id: 'crit_4',
    category: 'thi_dua_phong_trao',
    title: 'Công tác Chủ nhiệm, Thi đua & Hoạt động phong trào',
    description: 'Bồi dưỡng HSG, hỗ trợ học sinh yếu, tham gia hoạt động Đoàn - Đội, hội thao, đóng góp xây dựng tập thể.',
    maxScore: 100,
    weightPercent: 20,
    moetCode: 'NĐ233-Đa4'
  }
];

export const INITIAL_WEIGHT_MATRICES: WeightMatrix[] = [
  {
    id: 'wm_standard',
    name: 'Khung Chuẩn Học Kỳ (Mặc định)',
    chuyenMonWeight: 40,
    daoDucWeight: 20,
    doiMoiCnttWeight: 20,
    thiDuaWeight: 20,
    isActive: true,
    effectiveFrom: '01/09/2026',
    note: 'Áp dụng cho đánh giá định kỳ toàn bộ năm học 2026 - 2027.'
  },
  {
    id: 'wm_emulation_2011',
    name: 'Đợt Cao Điểm Thi Đua 20/11 & HSG',
    chuyenMonWeight: 35,
    daoDucWeight: 15,
    doiMoiCnttWeight: 20,
    thiDuaWeight: 30,
    isActive: false,
    effectiveFrom: '15/10/2026',
    note: 'Tăng trọng số Phong trào thi đua và Bồi dưỡng HSG.'
  },
  {
    id: 'wm_digital_trans',
    name: 'Trọng Số Đột Phá Chuyển Đổi Số',
    chuyenMonWeight: 35,
    daoDucWeight: 15,
    doiMoiCnttWeight: 35,
    thiDuaWeight: 15,
    isActive: false,
    effectiveFrom: '01/01/2027',
    note: 'Khuyến khích giáo viên đẩy mạnh bài giảng số và ứng dụng AI.'
  }
];

// Helper sinh đánh giá giáo viên chuẩn NĐ 233
function makeEvaluation(
  teacherId: string, 
  c1Self: number, c1Head: number, c1Prin: number,
  c2Self: number, c2Head: number, c2Prin: number,
  c3Self: number, c3Head: number, c3Prin: number,
  c4Self: number, c4Head: number, c4Prin: number,
  passiveBonus: number = 0,
  status: 'APPROVED' | 'HEAD_REVIEWED' | 'SELF_SUBMITTED' | 'DRAFT' = 'APPROVED'
) {
  const finalScore = parseFloat((c1Prin * 0.4 + c2Prin * 0.2 + c3Prin * 0.2 + c4Prin * 0.2 + passiveBonus).toFixed(1));
  let classification: AssessmentClassification = 'HTTNV';
  if (finalScore >= 90) classification = 'HTXSNV';
  else if (finalScore >= 75) classification = 'HTTNV';
  else if (finalScore >= 60) classification = 'HTNV';
  else classification = 'CHT';

  return {
    id: `eval_${teacherId}`,
    teacherId,
    period: 'Học kỳ I - 2026-2027',
    status,
    scores: {
      crit_1: { criteriaId: 'crit_1', selfScore: c1Self, headScore: c1Head, principalScore: c1Prin, comments: 'Hoàn thành tốt kế hoạch giảng dạy' },
      crit_2: { criteriaId: 'crit_2', selfScore: c2Self, headScore: c2Head, principalScore: c2Prin, comments: 'Chấp hành nghiêm kỷ luật lao động' },
      crit_3: { criteriaId: 'crit_3', selfScore: c3Self, headScore: c3Head, principalScore: c3Prin, comments: 'Tích cực ứng dụng CNTT và AI' },
      crit_4: { criteriaId: 'crit_4', selfScore: c4Self, headScore: c4Head, principalScore: c4Prin, comments: 'Tham gia sôi nổi phong trào' },
    },
    passivePointsTotal: passiveBonus,
    finalScore,
    classification,
    isAnomaly: Math.abs(c1Head - c1Prin) > 15 || Math.abs(c2Head - c2Prin) > 15,
    anomalyReason: (Math.abs(c1Head - c1Prin) > 15) ? 'Chênh lệch điểm chuyên môn giữa Tổ và BGH > 15đ' : undefined,
    selfSubmittedAt: '2026-11-20 10:00',
    headApprovedAt: status !== 'SELF_SUBMITTED' ? '2026-11-22 14:00' : undefined,
    principalApprovedAt: status === 'APPROVED' ? '2026-11-24 16:30' : undefined,
    digitalSignature: status === 'APPROVED' ? {
      signedBy: 'Hiệu trưởng Nguyễn Minh Trí',
      timestamp: '2026-11-24 16:30:00',
      hash: `sig_${teacherId}_nd233`,
      otpVerified: true
    } : undefined
  };
}

// Cấu hình 70 Cán bộ Giáo viên & Nhân viên chuẩn THPT Châu Thành A
interface TeacherRawDef {
  id: string;
  code: string;
  fullName: string;
  dept: Department;
  pos: string;
  grade: 'Giáo viên THPT Hạng I' | 'Giáo viên THPT Hạng II' | 'Giáo viên THPT Hạng III';
  years: number;
  phone: string;
  gender: 'M' | 'F';
  baseScore: number;
  bonus: number;
  status: 'APPROVED' | 'HEAD_REVIEWED' | 'SELF_SUBMITTED';
}

const RAW_TEACHERS_DATA: TeacherRawDef[] = [
  // 1. BAN GIÁM HIỆU (2 tài khoản kiêm nhiệm)
  { id: 'bgh_01', code: 'BGH-01', fullName: 'Nguyễn Minh Trí', dept: 'Tổ Toán', pos: 'Hiệu trưởng', grade: 'Giáo viên THPT Hạng I', years: 22, phone: '0913 888 999', gender: 'M', baseScore: 96, bonus: 5, status: 'APPROVED' },
  { id: 'bgh_02', code: 'BGH-02', fullName: 'Trần Thị Ngọc Lan', dept: 'Tổ Văn - GDKTPL', pos: 'Phó Hiệu trưởng', grade: 'Giáo viên THPT Hạng I', years: 19, phone: '0918 777 666', gender: 'F', baseScore: 94, bonus: 4, status: 'APPROVED' },

  // 2. TỔ TOÁN (10 Giáo viên)
  { id: 'gv_toan_01', code: 'GV-TOAN-01', fullName: 'Trần Văn Hoàng', dept: 'Tổ Toán', pos: 'Tổ trưởng chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 15, phone: '0912 345 678', gender: 'M', baseScore: 95, bonus: 5, status: 'APPROVED' },
  { id: 'gv_toan_02', code: 'GV-TOAN-02', fullName: 'Nguyễn Văn Đạt', dept: 'Tổ Toán', pos: 'Tổ phó chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 13, phone: '0903 112 233', gender: 'M', baseScore: 92, bonus: 3, status: 'APPROVED' },
  { id: 'gv_toan_03', code: 'GV-TOAN-03', fullName: 'Lê Văn Cường', dept: 'Tổ Toán', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 10, phone: '0914 223 344', gender: 'M', baseScore: 88, bonus: 2, status: 'APPROVED' },
  { id: 'gv_toan_04', code: 'GV-TOAN-04', fullName: 'Phạm Thị Bích Hạnh', dept: 'Tổ Toán', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 8, phone: '0988 334 455', gender: 'F', baseScore: 86, bonus: 0, status: 'HEAD_REVIEWED' },
  { id: 'gv_toan_05', code: 'GV-TOAN-05', fullName: 'Vũ Đức Thịnh', dept: 'Tổ Toán', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 9, phone: '0977 445 566', gender: 'M', baseScore: 87, bonus: 1, status: 'APPROVED' },
  { id: 'gv_toan_06', code: 'GV-TOAN-06', fullName: 'Đặng Thanh Tùng', dept: 'Tổ Toán', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 4, phone: '0933 556 677', gender: 'M', baseScore: 82, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_toan_07', code: 'GV-TOAN-07', fullName: 'Bùi Thị Tuyết Nga', dept: 'Tổ Toán', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 11, phone: '0966 667 788', gender: 'F', baseScore: 89, bonus: 2, status: 'APPROVED' },
  { id: 'gv_toan_08', code: 'GV-TOAN-08', fullName: 'Ngô Quốc Trung', dept: 'Tổ Toán', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 3, phone: '0908 778 899', gender: 'M', baseScore: 80, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_toan_09', code: 'GV-TOAN-09', fullName: 'Đoàn Kim Oanh', dept: 'Tổ Toán', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 7, phone: '0944 889 900', gender: 'F', baseScore: 85, bonus: 1, status: 'APPROVED' },
  { id: 'gv_toan_10', code: 'GV-TOAN-10', fullName: 'Dương Hữu Tài', dept: 'Tổ Toán', pos: 'Hợp đồng lao động', grade: 'Giáo viên THPT Hạng III', years: 2, phone: '0922 990 011', gender: 'M', baseScore: 78, bonus: 0, status: 'SELF_SUBMITTED' },

  // 3. TỔ VĂN - GDKTPL (12 Giáo viên)
  { id: 'gv_van_01', code: 'GV-VAN-01', fullName: 'Lê Thị Thu Hà', dept: 'Tổ Văn - GDKTPL', pos: 'Tổ trưởng chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 16, phone: '0912 888 111', gender: 'F', baseScore: 95, bonus: 4, status: 'APPROVED' },
  { id: 'gv_van_02', code: 'GV-VAN-02', fullName: 'Phạm Thị Mai', dept: 'Tổ Văn - GDKTPL', pos: 'Tổ phó chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 14, phone: '0983 222 333', gender: 'F', baseScore: 91, bonus: 3, status: 'APPROVED' },
  { id: 'gv_van_03', code: 'GV-VAN-03', fullName: 'Nguyễn Thị Thu Trang', dept: 'Tổ Văn - GDKTPL', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 9, phone: '0972 333 444', gender: 'F', baseScore: 88, bonus: 2, status: 'APPROVED' },
  { id: 'gv_van_04', code: 'GV-VAN-04', fullName: 'Trần Quỳnh Như', dept: 'Tổ Văn - GDKTPL', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 11, phone: '0938 444 555', gender: 'F', baseScore: 89, bonus: 1, status: 'APPROVED' },
  { id: 'gv_van_05', code: 'GV-VAN-05', fullName: 'Hoàng Thị Thùy Linh', dept: 'Tổ Văn - GDKTPL', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 8, phone: '0909 555 666', gender: 'F', baseScore: 86, bonus: 0, status: 'HEAD_REVIEWED' },
  { id: 'gv_van_06', code: 'GV-VAN-06', fullName: 'Võ Minh Quân', dept: 'Tổ Văn - GDKTPL', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 7, phone: '0966 666 777', gender: 'M', baseScore: 85, bonus: 1, status: 'APPROVED' },
  { id: 'gv_van_07', code: 'GV-VAN-07', fullName: 'Đỗ Thị Cẩm Nhung', dept: 'Tổ Văn - GDKTPL', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 4, phone: '0945 777 888', gender: 'F', baseScore: 83, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_van_08', code: 'GV-VAN-08', fullName: 'Nguyễn Ngọc Diệp', dept: 'Tổ Văn - GDKTPL', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 12, phone: '0919 888 999', gender: 'F', baseScore: 90, bonus: 2, status: 'APPROVED' },
  { id: 'gv_van_09', code: 'GV-VAN-09', fullName: 'Phan Văn Hậu', dept: 'Tổ Văn - GDKTPL', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 5, phone: '0987 999 000', gender: 'M', baseScore: 81, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_van_10', code: 'GV-VAN-10', fullName: 'Trần Thị Thanh Vân', dept: 'Tổ Văn - GDKTPL', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 10, phone: '0934 111 222', gender: 'F', baseScore: 87, bonus: 1, status: 'APPROVED' },
  { id: 'gv_van_11', code: 'GV-VAN-11', fullName: 'Lý Quốc Bảo', dept: 'Tổ Văn - GDKTPL', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 3, phone: '0901 222 333', gender: 'M', baseScore: 79, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_van_12', code: 'GV-VAN-12', fullName: 'Nguyễn Thị Hồng Hạnh', dept: 'Tổ Văn - GDKTPL', pos: 'Hợp đồng lao động', grade: 'Giáo viên THPT Hạng III', years: 2, phone: '0978 333 444', gender: 'F', baseScore: 80, bonus: 0, status: 'SELF_SUBMITTED' },

  // 4. TỔ HOÁ - SINH (10 Giáo viên)
  { id: 'gv_hoasinh_01', code: 'GV-HOASINH-01', fullName: 'Nguyễn Văn Minh', dept: 'Tổ Hoá - Sinh', pos: 'Tổ trưởng chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 17, phone: '0912 555 444', gender: 'M', baseScore: 94, bonus: 4, status: 'APPROVED' },
  { id: 'gv_hoasinh_02', code: 'GV-HOASINH-02', fullName: 'Trần Thị Thu Thảo', dept: 'Tổ Hoá - Sinh', pos: 'Tổ phó chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 13, phone: '0988 666 555', gender: 'F', baseScore: 91, bonus: 2, status: 'APPROVED' },
  { id: 'gv_hoasinh_03', code: 'GV-HOASINH-03', fullName: 'Phạm Ngọc Hân', dept: 'Tổ Hoá - Sinh', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 9, phone: '0977 777 666', gender: 'F', baseScore: 88, bonus: 1, status: 'APPROVED' },
  { id: 'gv_hoasinh_04', code: 'GV-HOASINH-04', fullName: 'Lê Hoàng Khang', dept: 'Tổ Hoá - Sinh', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 8, phone: '0933 888 777', gender: 'M', baseScore: 86, bonus: 1, status: 'APPROVED' },
  { id: 'gv_hoasinh_05', code: 'GV-HOASINH-05', fullName: 'Đặng Thảo Nguyên', dept: 'Tổ Hoá - Sinh', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 10, phone: '0908 999 888', gender: 'F', baseScore: 89, bonus: 2, status: 'APPROVED' },
  { id: 'gv_hoasinh_06', code: 'GV-HOASINH-06', fullName: 'Vũ Quốc Toàn', dept: 'Tổ Hoá - Sinh', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 4, phone: '0966 000 111', gender: 'M', baseScore: 82, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_hoasinh_07', code: 'GV-HOASINH-07', fullName: 'Bùi Thị Lan Anh', dept: 'Tổ Hoá - Sinh', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 7, phone: '0944 111 222', gender: 'F', baseScore: 85, bonus: 0, status: 'HEAD_REVIEWED' },
  { id: 'gv_hoasinh_08', code: 'GV-HOASINH-08', fullName: 'Hồ Văn Lâm', dept: 'Tổ Hoá - Sinh', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 3, phone: '0922 222 333', gender: 'M', baseScore: 80, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_hoasinh_09', code: 'GV-HOASINH-09', fullName: 'Ngô Kim Phượng', dept: 'Tổ Hoá - Sinh', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 11, phone: '0915 333 444', gender: 'F', baseScore: 87, bonus: 1, status: 'APPROVED' },
  { id: 'gv_hoasinh_10', code: 'GV-HOASINH-10', fullName: 'Trương Minh Trí', dept: 'Tổ Hoá - Sinh', pos: 'Hợp đồng lao động', grade: 'Giáo viên THPT Hạng III', years: 2, phone: '0989 444 555', gender: 'M', baseScore: 78, bonus: 0, status: 'SELF_SUBMITTED' },

  // 5. TỔ SỬ - ĐỊA - ANH VĂN (14 Giáo viên)
  { id: 'gv_sudiaanh_01', code: 'GV-SUDIAANH-01', fullName: 'Đỗ Thị Phương Thảo', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Tổ trưởng chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 16, phone: '0912 666 777', gender: 'F', baseScore: 94, bonus: 3, status: 'APPROVED' },
  { id: 'gv_sudiaanh_02', code: 'GV-SUDIAANH-02', fullName: 'Đặng Kim Ngân', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Tổ phó chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 15, phone: '0988 777 888', gender: 'F', baseScore: 92, bonus: 3, status: 'APPROVED' },
  { id: 'gv_sudiaanh_03', code: 'GV-SUDIAANH-03', fullName: 'Nguyễn Minh Tuấn', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 8, phone: '0977 888 999', gender: 'M', baseScore: 78, bonus: -3.5, status: 'HEAD_REVIEWED' },
  { id: 'gv_sudiaanh_04', code: 'GV-SUDIAANH-04', fullName: 'Lê Thị Khánh Huyền', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 9, phone: '0933 999 000', gender: 'F', baseScore: 89, bonus: 2, status: 'APPROVED' },
  { id: 'gv_sudiaanh_05', code: 'GV-SUDIAANH-05', fullName: 'Phạm Đức Duy', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 7, phone: '0908 000 111', gender: 'M', baseScore: 86, bonus: 1, status: 'APPROVED' },
  { id: 'gv_sudiaanh_06', code: 'GV-SUDIAANH-06', fullName: 'Trần Mai Phương', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 11, phone: '0966 111 222', gender: 'F', baseScore: 90, bonus: 2, status: 'APPROVED' },
  { id: 'gv_sudiaanh_07', code: 'GV-SUDIAANH-07', fullName: 'Vũ Hoàng Yến', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 4, phone: '0944 222 333', gender: 'F', baseScore: 83, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_sudiaanh_08', code: 'GV-SUDIAANH-08', fullName: 'Ngô Thanh Sơn', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 10, phone: '0922 333 444', gender: 'M', baseScore: 87, bonus: 1, status: 'APPROVED' },
  { id: 'gv_sudiaanh_09', code: 'GV-SUDIAANH-09', fullName: 'Bùi Thị Cẩm Tú', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 3, phone: '0917 444 555', gender: 'F', baseScore: 81, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_sudiaanh_10', code: 'GV-SUDIAANH-10', fullName: 'Dương Văn Hòa', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 12, phone: '0981 555 666', gender: 'M', baseScore: 88, bonus: 1, status: 'APPROVED' },
  { id: 'gv_sudiaanh_11', code: 'GV-SUDIAANH-11', fullName: 'Lâm Thị Ngọc Bích', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 5, phone: '0935 666 777', gender: 'F', baseScore: 84, bonus: 0, status: 'HEAD_REVIEWED' },
  { id: 'gv_sudiaanh_12', code: 'GV-SUDIAANH-12', fullName: 'Tạ Quốc Hưng', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 2, phone: '0904 777 888', gender: 'M', baseScore: 79, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_sudiaanh_13', code: 'GV-SUDIAANH-13', fullName: 'Nguyễn Thị Hồng Nhung', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 8, phone: '0969 888 999', gender: 'F', baseScore: 86, bonus: 1, status: 'APPROVED' },
  { id: 'gv_sudiaanh_14', code: 'GV-SUDIAANH-14', fullName: 'Cao Văn Lộc', dept: 'Tổ Sử - Địa - Anh Văn', pos: 'Hợp đồng lao động', grade: 'Giáo viên THPT Hạng III', years: 1, phone: '0948 999 000', gender: 'M', baseScore: 77, bonus: 0, status: 'SELF_SUBMITTED' },

  // 6. TỔ LÝ - TD - QP (10 Giáo viên)
  { id: 'gv_lytdqp_01', code: 'GV-LYTDQP-01', fullName: 'Phạm Minh Đức', dept: 'Tổ Lý - TD - QP', pos: 'Tổ trưởng chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 18, phone: '0912 111 333', gender: 'M', baseScore: 94, bonus: 4, status: 'APPROVED' },
  { id: 'gv_lytdqp_02', code: 'GV-LYTDQP-02', fullName: 'Lê Quốc Hùng', dept: 'Tổ Lý - TD - QP', pos: 'Tổ phó chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 14, phone: '0988 222 444', gender: 'M', baseScore: 91, bonus: 2, status: 'APPROVED' },
  { id: 'gv_lytdqp_03', code: 'GV-LYTDQP-03', fullName: 'Trần Quốc Bảo', dept: 'Tổ Lý - TD - QP', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 9, phone: '0977 333 555', gender: 'M', baseScore: 88, bonus: 2, status: 'APPROVED' },
  { id: 'gv_lytdqp_04', code: 'GV-LYTDQP-04', fullName: 'Nguyễn Văn Thành', dept: 'Tổ Lý - TD - QP', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 10, phone: '0933 444 666', gender: 'M', baseScore: 87, bonus: 1, status: 'APPROVED' },
  { id: 'gv_lytdqp_05', code: 'GV-LYTDQP-05', fullName: 'Đinh Thị Thu Thủy', dept: 'Tổ Lý - TD - QP', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 8, phone: '0908 555 777', gender: 'F', baseScore: 86, bonus: 1, status: 'APPROVED' },
  { id: 'gv_lytdqp_06', code: 'GV-LYTDQP-06', fullName: 'Võ Thành Nam', dept: 'Tổ Lý - TD - QP', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 4, phone: '0966 666 888', gender: 'M', baseScore: 82, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_lytdqp_07', code: 'GV-LYTDQP-07', fullName: 'Hoàng Văn Thắng', dept: 'Tổ Lý - TD - QP', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 11, phone: '0944 777 999', gender: 'M', baseScore: 89, bonus: 2, status: 'APPROVED' },
  { id: 'gv_lytdqp_08', code: 'GV-LYTDQP-08', fullName: 'Trần Thị Mỹ Linh', dept: 'Tổ Lý - TD - QP', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 3, phone: '0922 888 000', gender: 'F', baseScore: 80, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_lytdqp_09', code: 'GV-LYTDQP-09', fullName: 'Lê Văn Phúc', dept: 'Tổ Lý - TD - QP', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 7, phone: '0916 999 111', gender: 'M', baseScore: 85, bonus: 0, status: 'HEAD_REVIEWED' },
  { id: 'gv_lytdqp_10', code: 'GV-LYTDQP-10', fullName: 'Phan Tấn Đạt', dept: 'Tổ Lý - TD - QP', pos: 'Hợp đồng lao động', grade: 'Giáo viên THPT Hạng III', years: 2, phone: '0982 000 222', gender: 'M', baseScore: 78, bonus: 0, status: 'SELF_SUBMITTED' },

  // 7. TỔ TIN - CÔNG NGHỆ (8 Giáo viên)
  { id: 'gv_tin_01', code: 'GV-TIN-01', fullName: 'Hoàng Quốc Việt', dept: 'Tổ Tin - Công nghệ', pos: 'Tổ trưởng chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 14, phone: '0912 333 222', gender: 'M', baseScore: 95, bonus: 4, status: 'APPROVED' },
  { id: 'gv_tin_02', code: 'GV-TIN-02', fullName: 'Vũ Hoàng Nam', dept: 'Tổ Tin - Công nghệ', pos: 'Tổ phó chuyên môn', grade: 'Giáo viên THPT Hạng I', years: 11, phone: '0988 444 333', gender: 'M', baseScore: 92, bonus: 3, status: 'APPROVED' },
  { id: 'gv_tin_03', code: 'GV-TIN-03', fullName: 'Nguyễn Văn Hải', dept: 'Tổ Tin - Công nghệ', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 8, phone: '0977 555 444', gender: 'M', baseScore: 89, bonus: 2, status: 'APPROVED' },
  { id: 'gv_tin_04', code: 'GV-TIN-04', fullName: 'Trần Thị Bích Ngọc', dept: 'Tổ Tin - Công nghệ', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 9, phone: '0933 666 555', gender: 'F', baseScore: 88, bonus: 1, status: 'APPROVED' },
  { id: 'gv_tin_05', code: 'GV-TIN-05', fullName: 'Lê Anh Tuấn', dept: 'Tổ Tin - Công nghệ', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng II', years: 7, phone: '0908 777 666', gender: 'M', baseScore: 86, bonus: 1, status: 'APPROVED' },
  { id: 'gv_tin_06', code: 'GV-TIN-06', fullName: 'Phạm Thị Thùy Trang', dept: 'Tổ Tin - Công nghệ', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 4, phone: '0966 888 777', gender: 'F', baseScore: 83, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_tin_07', code: 'GV-TIN-07', fullName: 'Đặng Quốc Anh', dept: 'Tổ Tin - Công nghệ', pos: 'Giáo viên THPT', grade: 'Giáo viên THPT Hạng III', years: 3, phone: '0944 999 888', gender: 'M', baseScore: 81, bonus: 0, status: 'SELF_SUBMITTED' },
  { id: 'gv_tin_08', code: 'GV-TIN-08', fullName: 'Bùi Đức Long', dept: 'Tổ Tin - Công nghệ', pos: 'Hợp đồng lao động', grade: 'Giáo viên THPT Hạng III', years: 2, phone: '0922 000 999', gender: 'M', baseScore: 79, bonus: 0, status: 'SELF_SUBMITTED' },

  // 8. TỔ VĂN PHÒNG (6 Cán bộ/Nhân viên)
  { id: 'nv_vp_01', code: 'NV-VP-01', fullName: 'Nguyễn Thị Bích', dept: 'Tổ Văn Phòng', pos: 'Tổ trưởng Văn phòng', grade: 'Giáo viên THPT Hạng II', years: 15, phone: '0912 777 111', gender: 'F', baseScore: 92, bonus: 2, status: 'APPROVED' },
  { id: 'nv_vp_02', code: 'NV-VP-02', fullName: 'Lê Minh Tuấn', dept: 'Tổ Văn Phòng', pos: 'Tổ phó Văn phòng', grade: 'Giáo viên THPT Hạng II', years: 12, phone: '0988 888 222', gender: 'M', baseScore: 90, bonus: 2, status: 'APPROVED' },
  { id: 'nv_vp_03', code: 'NV-VP-03', fullName: 'Trần Thị Thu Cúc', dept: 'Tổ Văn Phòng', pos: 'Kế toán viên', grade: 'Giáo viên THPT Hạng II', years: 10, phone: '0977 999 333', gender: 'F', baseScore: 89, bonus: 1, status: 'APPROVED' },
  { id: 'nv_vp_04', code: 'NV-VP-04', fullName: 'Phạm Văn Hòa', dept: 'Tổ Văn Phòng', pos: 'Cán bộ Y tế', grade: 'Giáo viên THPT Hạng II', years: 8, phone: '0933 000 444', gender: 'M', baseScore: 87, bonus: 1, status: 'APPROVED' },
  { id: 'nv_vp_05', code: 'NV-VP-05', fullName: 'Đỗ Thị Minh Châu', dept: 'Tổ Văn Phòng', pos: 'Cán bộ Thư viện', grade: 'Giáo viên THPT Hạng III', years: 5, phone: '0908 111 555', gender: 'F', baseScore: 84, bonus: 0, status: 'HEAD_REVIEWED' },
  { id: 'nv_vp_06', code: 'NV-VP-06', fullName: 'Vũ Quốc Đạt', dept: 'Tổ Văn Phòng', pos: 'Cán bộ Thiết bị', grade: 'Giáo viên THPT Hạng III', years: 3, phone: '0966 222 666', gender: 'M', baseScore: 80, bonus: 0, status: 'SELF_SUBMITTED' }
];

// Tạo 70 hồ sơ Teacher chi tiết
export const MOCK_TEACHERS: Teacher[] = RAW_TEACHERS_DATA.map((t, idx) => {
  const avatarUrl = t.gender === 'F' 
    ? `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80`
    : `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80`;

  const email = `${t.fullName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '.')}@thptchauthanha.edu.vn`;

  const base = t.baseScore;
  const c1 = Math.min(100, Math.max(70, base + (idx % 3)));
  const c2 = Math.min(100, Math.max(75, base + 2));
  const c3 = Math.min(100, Math.max(70, base - (idx % 2)));
  const c4 = Math.min(100, Math.max(70, base + (idx % 2)));

  const evalRecord = makeEvaluation(
    t.id,
    c1, c1, c1,
    c2, c2, c2,
    c3, c3, c3,
    c4, c4, c4,
    t.bonus,
    t.status
  );

  return {
    id: t.id,
    code: t.code,
    fullName: t.fullName,
    email,
    avatar: avatarUrl,
    department: t.dept,
    position: t.pos,
    titleGrade: t.grade,
    yearsOfTeaching: t.years,
    phone: t.phone,
    currentEvaluation: evalRecord,
    skillDimensions: [
      { dimensionName: 'Phẩm chất nhà giáo', score: Math.min(100, base + 3), benchmarkScore: 90 },
      { dimensionName: 'Phát triển chuyên môn', score: Math.min(100, base + 1), benchmarkScore: 85 },
      { dimensionName: 'Năng lực sư phạm', score: Math.min(100, base), benchmarkScore: 85 },
      { dimensionName: 'Ứng dụng CNTT & AI', score: Math.min(100, base - 2), benchmarkScore: 80 },
      { dimensionName: 'Xây dựng môi trường & Thi đua', score: Math.min(100, base + 2), benchmarkScore: 85 }
    ],
    performanceTrend: [
      { period: 'Tháng 9', score: Math.max(70, base - 3) },
      { period: 'Tháng 10', score: Math.max(72, base - 1) },
      { period: 'Tháng 11', score: base },
      { period: 'Tháng 12', score: Math.min(100, base + 1) }
    ],
    passiveLogs: t.bonus !== 0 ? [
      {
        id: `pl_${t.id}_1`,
        teacherId: t.id,
        type: t.bonus > 0 ? 'BONUS' : 'PENALTY',
        source: t.bonus > 0 ? 'KHEN_THUONG_HSG' : 'MAY_CHAM_CONG',
        title: t.bonus > 0 ? 'Ghi nhận phong trào thi đua' : 'Chuyên cần & kỷ luật lao động',
        description: t.bonus > 0 ? 'Đóng góp tích cực hoạt động nhà trường' : 'Ghi nhận trễ chấm công / sinh hoạt',
        points: t.bonus,
        timestamp: '2026-11-15 08:30',
        verified: true
      }
    ] : [],
    evidences: [
      {
        id: `ev_${t.id}_1`,
        title: `Hồ sơ chuyên môn & Kế hoạch bài dạy GDPT 2018`,
        category: 'Hồ sơ chuyên môn',
        fileUrl: '#',
        fileType: 'PDF',
        uploadedAt: '2026-11-10',
        description: 'Kế hoạch bài dạy số và minh chứng đổi mới phương pháp giảng dạy.',
        status: 'APPROVED'
      }
    ],
    idpPlan: {
      id: `idp_${t.id}`,
      teacherId: t.id,
      createdAt: '2026-09-05',
      updatedAt: '2026-11-20',
      overallAssessment: `Thầy/Cô ${t.fullName} có tinh thần trách nhiệm cao, năng lực chuyên môn vững vàng, tích cực hưởng ứng chuyển đổi số theo Nghị định 233/2026/NĐ-CP.`,
      strengths: ['Phương pháp giảng dạy vững vàng', 'Ứng dụng tốt công nghệ và AI vào bài giảng', 'Kỷ luật công tác chuẩn mực'],
      areasForImprovement: ['Tăng cường bài giảng Elearning tương tác', 'Nghiên cứu khoa học sư phạm ứng dụng'],
      goals: [
        {
          id: `goal_${t.id}_1`,
          skillGapArea: 'Thiết kế bài giảng số & Elearning chuẩn GDPT 2018',
          targetGoal: 'Hoàn thành 02 bài giảng Elearning chất lượng cao đạt chuẩn',
          actionSteps: ['Tham gia khóa tập huấn LMS', 'Tích hợp bài tập trắc nghiệm số', 'Thử nghiệm trên lớp học'],
          recommendedCourses: [
            { title: 'Kỹ năng thiết kế Bài giảng Số & Ứng dụng AI', platform: 'MoET Training', duration: '20 giờ' }
          ],
          deadline: '2027-01-15',
          status: 'IN_PROGRESS'
        }
      ],
      aiCoachingAdvice: 'Tiếp tục phát huy thế mạnh phương pháp dạy học tích cực và lan tỏa kinh nghiệm bài giảng số cho các tổ viên.'
    }
  };
});

// TẠO DANH SÁCH 70+ TÀI KHOẢN ĐĂNG NHẬP (USER ACCOUNTS)
export const INITIAL_USER_ACCOUNTS: UserAccount[] = RAW_TEACHERS_DATA.map((t) => {
  let role: UserAccount['role'] = 'TEACHER';
  if (t.pos.includes('Hiệu trưởng')) {
    role = 'ADMIN_PRINCIPAL';
  } else if (t.pos.includes('Tổ trưởng') || t.pos.includes('Tổ phó')) {
    role = 'HEAD_OF_DEPARTMENT';
  }

  // Tạo username thông minh, dễ nhớ
  let username = '';
  if (t.id === 'bgh_01') username = 'admin';
  else if (t.id === 'bgh_02') username = 'bgh.ngoclan';
  else {
    if (t.pos.includes('Tổ trưởng')) {
      const deptKey = t.dept.replace('Tổ ', '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
      username = `totruong.${deptKey}`;
    } else if (t.pos.includes('Tổ phó')) {
      const deptKey = t.dept.replace('Tổ ', '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
      username = `topho.${deptKey}`;
    } else {
      username = t.code.toLowerCase().replace('-', '.');
    }
  }

  const defaultPassword = (username === 'admin') ? 'admin123' : '123456';

  return {
    id: `acc_${t.id}`,
    username,
    passwordHash: defaultPassword,
    fullName: t.fullName,
    role,
    department: t.dept,
    position: t.pos,
    teacherId: t.id,
    phone: t.phone,
    email: `${username}@thptchauthanha.edu.vn`
  };
});

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_01',
    timestamp: '2026-11-24 16:40:12',
    actorName: 'Nguyễn Minh Trí',
    actorRole: 'ADMIN_PRINCIPAL',
    action: 'KÝ SỐ PHÊ DUYỆT ĐÁNH GIÁ',
    targetTeacherName: 'Hoàng Quốc Việt',
    details: 'Phê duyệt kết quả đánh giá Học kỳ I đạt Hoàn thành Xuất sắc nhiệm vụ (96.0 điểm). Mã OTP xác thực thành công.',
    ipAddress: '118.70.124.18',
    signedHash: 'e9a1827c5d4f21e09a3'
  },
  {
    id: 'log_02',
    timestamp: '2026-11-24 16:15:02',
    actorName: 'Nguyễn Minh Trí',
    actorRole: 'ADMIN_PRINCIPAL',
    action: 'KÝ SỐ PHÊ DUYỆT ĐÁNH GIÁ',
    targetTeacherName: 'Trần Văn Hoàng',
    details: 'Phê duyệt kết quả đánh giá Học kỳ I đạt Hoàn thành Xuất sắc nhiệm vụ (98.0 điểm).',
    ipAddress: '118.70.124.18',
    signedHash: 'a8f9c12b7e402d1a3f6'
  },
  {
    id: 'log_03',
    timestamp: '2026-11-20 10:15:44',
    actorName: 'Đỗ Thị Phương Thảo (Tổ trưởng)',
    actorRole: 'HEAD_OF_DEPARTMENT',
    action: 'GHI NHẬN ĐÁNH GIÁ TỔ MÔN',
    targetTeacherName: 'Nguyễn Minh Tuấn',
    details: 'Chấm điểm Tổ môn (78.0 điểm). Ghi nhận trừ điểm chuyên cần do đi trễ.',
    ipAddress: '118.70.124.22'
  },
  {
    id: 'log_04',
    timestamp: '2026-11-18 09:00:00',
    actorName: 'Hệ thống Đồng bộ Thụ động',
    actorRole: 'SYSTEM_BOT',
    action: 'THU THẬP ĐIỂM CỘNG TỰ ĐỘNG',
    targetTeacherName: 'Hoàng Quốc Việt',
    details: '+4.0 điểm thưởng từ Sáng kiến Bài giảng số AI (Đã đối soát qua Google Sheets Sync).',
    ipAddress: '127.0.0.1'
  }
];

export const INITIAL_APPEALS: AppealDispute[] = [
  {
    id: 'app_01',
    teacherId: 'gv_sudiaanh_03',
    teacherName: 'Nguyễn Minh Tuấn',
    evaluationId: 'eval_gv_sudiaanh_03',
    reason: 'Kính trình Ban Giám hiệu, em xin giải trình về việc đi muộn ngày 10/10 do hỗ trợ kỳ thi chứng chỉ học sinh của trường và có xác nhận của PHT. Kính mong BGH xem xét lại điểm Kỷ luật.',
    attachedEvidences: ['https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=300'],
    status: 'PENDING',
    submittedAt: '2026-11-22 15:30'
  }
];

export const INITIAL_SELF_DECLARATIONS: SelfDeclarationRecord[] = [
  {
    id: 'sd_01',
    teacherId: 'gv_toan_01',
    teacherName: 'Trần Văn Hoàng',
    department: 'Tổ Toán',
    type: 'BONUS_AWARD',
    title: 'Hội thi Thiết kế Bài giảng Số, Elearning & Sáng kiến AI trong Giáo dục',
    categoryOrLevel: 'Cấp Tỉnh / Thành phố',
    awardNameOrInfraction: 'Giải Nhất',
    suggestedPoints: 8.0,
    evidenceUrlOrDesc: 'Quyết định số 1845/QĐ-SGDĐT về việc khen thưởng GV đạt Giải Nhất thiết kế bài giảng E-learning số toán 12.',
    submittedAt: '2026-11-10 09:30',
    status: 'APPROVED',
    headApproval: {
      approvedBy: 'Trần Văn Hoàng (Tổ trưởng)',
      approvedAt: '2026-11-11 10:00',
      comment: 'Đã xác minh đầy đủ quyết định và minh chứng video bài giảng số.'
    },
    principalApproval: {
      approvedBy: 'Hiệu trưởng Nguyễn Minh Trí',
      approvedAt: '2026-11-12 14:20',
      comment: 'Đã ký số phê duyệt chính thức công nhận +8.0 điểm thi đua.'
    }
  },
  {
    id: 'sd_02',
    teacherId: 'gv_lytdqp_01',
    teacherName: 'Phạm Minh Đức',
    department: 'Tổ Lý - TD - QP',
    type: 'BONUS_AWARD',
    title: 'Hội thao & Tiếng hát Người giáo viên THPT Châu Thành A',
    categoryOrLevel: 'Cấp Xã (Cụm Trường)',
    awardNameOrInfraction: 'Giải Nhất',
    suggestedPoints: 4.0,
    evidenceUrlOrDesc: 'Giấy khen Cụm thi đua số 3 môn Bóng chuyền hơi nam giáo viên.',
    submittedAt: '2026-11-15 11:00',
    status: 'PENDING_PRINCIPAL',
    headApproval: {
      approvedBy: 'Tổ trưởng Phạm Minh Đức',
      approvedAt: '2026-11-16 08:30',
      comment: 'Đã kiểm tra giấy khen cụm trường hợp lệ. Trình BGH phê duyệt.'
    }
  },
  {
    id: 'sd_03',
    teacherId: 'gv_sudiaanh_03',
    teacherName: 'Nguyễn Minh Tuấn',
    department: 'Tổ Sử - Địa - Anh Văn',
    type: 'PENALTY_INFRACTION',
    title: 'Kê khai vi phạm & Tự nhận mức trừ điểm kỷ luật',
    categoryOrLevel: 'Vi phạm nếp sống / Kỷ luật',
    awardNameOrInfraction: 'Đi trễ sinh hoạt đầu tuần & Chậm nộp giáo án',
    suggestedPoints: -3.5,
    evidenceUrlOrDesc: 'Trễ 15 phút chào cờ ngày 10/10 và nộp chậm giáo án tuần 12. Tự kê khai xin rút kinh nghiệm.',
    submittedAt: '2026-11-18 16:45',
    status: 'PENDING_HEAD'
  }
];
