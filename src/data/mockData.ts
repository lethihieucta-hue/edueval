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
  { id: 'dept_1', name: 'Tổ Toán', headTeacherName: 'Đặng Minh Đỗ', deputyHeadTeacherName: 'Lê Phan Trí Mẫn', description: 'Toán học & Tư duy logic sư phạm' },
  { id: 'dept_2', name: 'Tổ Văn - GDKTPL', headTeacherName: 'Danh Thanh Sang', deputyHeadTeacherName: 'Đinh Minh Tuấn', description: 'Ngữ văn & Giáo dục kinh tế và pháp luật' },
  { id: 'dept_3', name: 'Tổ Hoá - Sinh', headTeacherName: 'Đỗ Kim Xuyến', deputyHeadTeacherName: 'Đỗ Thị Thu', description: 'Hóa học, Sinh học & Nghiên cứu khoa học' },
  { id: 'dept_4', name: 'Tổ Sử - Địa - Anh Văn', headTeacherName: 'Đặng Văn Hải', deputyHeadTeacherName: 'Đỗ Thị Thanh Thuý', description: 'Lịch sử, Địa lý & Tiếng Anh hội nhập' },
  { id: 'dept_5', name: 'Tổ Lý - TD - QP', headTeacherName: 'Bùi Hữu Nhựt', deputyHeadTeacherName: 'Bùi Thị Ngọc Ngân', description: 'Vật lý, Thể dục & Giáo dục quốc phòng an ninh' },
  { id: 'dept_6', name: 'Tổ Tin - Công nghệ', headTeacherName: 'Dương Thái Hưng', deputyHeadTeacherName: 'Nguyễn Hà Như Thu', description: 'Tin học, Công nghệ số & STEM/AI' },
  { id: 'dept_7', name: 'Tổ Văn Phòng', headTeacherName: 'Dương Như Ý', deputyHeadTeacherName: 'Nguyễn Văn Tặng', description: 'Hành chính, Kế toán, Thư viện, Thiết bị & Y tế' }
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
    title: 'Hội thi Giáo viên Dạy giỏi & Ứng dụng CNTT/AI THPT Châu Thành A',
    academicYear: '2026 - 2027',
    startDate: '2026-11-01',
    endDate: '2026-12-15',
    description: 'Đổi mới phương pháp dạy học, kiểm tra đánh giá số hóa và xây dựng kho học liệu trực tuyến.',
    status: 'ACTIVE',
    awardRules: [
      { id: 'rg1', level: 'Cấp Trường', awardName: 'Giải Nhất', points: 4.0 },
      { id: 'rg2', level: 'Cấp Trường', awardName: 'Giải Nhì', points: 3.0 },
      { id: 'rg3', level: 'Cấp Trường', awardName: 'Giải Ba', points: 2.0 },
      { id: 'rg4', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhất', points: 8.0 },
      { id: 'rg5', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhì', points: 6.0 }
    ]
  }
];

export const INITIAL_MOVEMENT_PARTICIPATIONS: MovementParticipation[] = [
  {
    id: 'mp_1',
    movementId: 'mov_2011',
    teacherId: 'gv_toan_01',
    teacherName: 'Đặng Minh Đỗ',
    department: 'Tổ Toán',
    level: 'Cấp Tỉnh / Thành phố',
    awardName: 'Giải Nhất',
    awardedPoints: 8.0,
    certificateNumber: '112/QĐ-SGDĐT',
    awardedDate: '18/11/2026',
    status: 'APPROVED',
    evidenceFile: 'QD_KhenThuong_GVG_Tinh_2026.pdf',
    notes: 'Đạt thành tích xuất sắc Bồi dưỡng HSG Toán cấp Tỉnh.'
  },
  {
    id: 'mp_2',
    movementId: 'mov_2011',
    teacherId: 'gv_toan_03',
    teacherName: 'Lê Thị Hiếu',
    department: 'Tổ Toán',
    level: 'Cấp Trường',
    awardName: 'Giải Nhất',
    awardedPoints: 3.0,
    certificateNumber: '45/QĐ-THPTCTA',
    awardedDate: '15/11/2026',
    status: 'APPROVED',
    evidenceFile: 'ChungNhan_TietDayTot_2026.pdf',
    notes: 'Tiết dạy đổi mới phương pháp ứng dụng Geogebra.'
  },
  {
    id: 'mp_3',
    movementId: 'mov_2011',
    teacherId: 'gv_van_01',
    teacherName: 'Danh Thanh Sang',
    department: 'Tổ Văn - GDKTPL',
    level: 'Cấp Tỉnh / Thành phố',
    awardName: 'Giải Nhất',
    awardedPoints: 8.0,
    certificateNumber: '118/QĐ-SGDĐT',
    awardedDate: '18/11/2026',
    status: 'APPROVED',
    evidenceFile: 'QD_KhenThuong_Van_2026.pdf',
    notes: 'Giải Nhất Hội thi Giáo viên Giỏi môn Ngữ văn cấp Tỉnh.'
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att_1',
    teacherId: 'gv_toan_04',
    teacherName: 'Nguyễn Hữu Thạnh',
    department: 'Tổ Toán',
    date: '2026-10-12',
    checkInTime: '07:18:22',
    scheduledTime: '07:00:00',
    type: 'TARDY',
    status: 'EXPLAINED',
    explanationReason: 'Mưa lớn ngập đường vào trường, đã xin phép Tổ trưởng báo cáo trước giờ vào lớp.',
    resolvedAction: 'EXCUSED'
  }
];

export const INITIAL_SELF_DECLARATIONS: SelfDeclarationRecord[] = [
  {
    id: 'sd_1',
    teacherId: 'gv_toan_03',
    teacherName: 'Lê Thị Hiếu',
    department: 'Tổ Toán',
    type: 'BONUS_AWARD',
    title: 'Giải Nhất Hội thi Thiết kế Bài giảng E-Learning Ứng dụng AI',
    categoryOrLevel: 'Cấp Trường',
    awardNameOrInfraction: 'Giải Nhất',
    suggestedPoints: 3.0,
    evidenceUrlOrDesc: 'Quyết định khen thưởng số 45/QĐ-THPTCTA ngày 15/11/2026 của Hiệu trưởng.',
    submittedAt: '16/11/2026 09:30:15',
    status: 'APPROVED',
    headApproval: {
      approvedBy: 'Thầy Đặng Minh Đỗ (Tổ trưởng)',
      approvedAt: '16/11/2026 14:20:00',
      comment: 'Tổ đã kiểm tra giấy khen và bài giảng gốc, hoàn toàn hợp lệ.'
    },
    principalApproval: {
      approvedBy: 'Hiệu trưởng Nguyễn Minh Trí',
      approvedAt: '17/11/2026 08:15:00',
      comment: 'Ban Giám Hiệu phê duyệt cộng 3.0 điểm thi đua.'
    }
  }
];

// 63 Authentic Teachers Roster from Google Sheet
const RAW_GOOGLE_SHEET_TEACHERS = [
  // Ban Giám Hiệu
  { id: 'bgh_01', code: 'BGH-01', fullName: 'Nguyễn Minh Trí', department: 'Tổ Toán', position: 'Hiệu trưởng', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 24, email: 'admin@thptchauthanha.edu.vn', phone: '0913 888 999', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', selfScore: 95, headScore: 96, principalScore: 98, role: 'ADMIN_PRINCIPAL', username: 'admin', pass: 'admin123' },
  { id: 'bgh_02', code: 'BGH-02', fullName: 'Trần Thị Ngọc Lan', department: 'Tổ Văn - GDKTPL', position: 'Phó Hiệu trưởng', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 20, email: 'bgh.ngoclan@thptchauthanha.edu.vn', phone: '0918 777 666', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', selfScore: 94, headScore: 95, principalScore: 96, role: 'ADMIN_PRINCIPAL', username: 'bgh.ngoclan', pass: '123456' },

  // Tổ Toán (10 GV)
  { id: 'gv_toan_01', code: 'GV-TOAN-01', fullName: 'Đặng Minh Đỗ', department: 'Tổ Toán', position: 'Tổ trưởng chuyên môn', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 18, email: 'totruong.toan@thptchauthanha.edu.vn', phone: '0912 345 678', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', selfScore: 92, headScore: 94, principalScore: 95, role: 'HEAD_OF_DEPARTMENT', username: 'totruong.toan', pass: '123456' },
  { id: 'gv_toan_02', code: 'GV-TOAN-02', fullName: 'Lê Phan Trí Mẫn', department: 'Tổ Toán', position: 'Tổ phó chuyên môn', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 15, email: 'topho.toan@thptchauthanha.edu.vn', phone: '0903 112 233', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', selfScore: 90, headScore: 92, principalScore: 92, role: 'HEAD_OF_DEPARTMENT', username: 'topho.toan', pass: '123456' },
  { id: 'gv_toan_03', code: 'GV-TOAN-03', fullName: 'Lê Thị Hiếu', department: 'Tổ Toán', position: 'Tổ phó chuyên môn', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 12, email: 'gv.toan-03@thptchauthanha.edu.vn', phone: '0914 223 344', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', selfScore: 92, headScore: 93, principalScore: 94, role: 'TEACHER', username: 'gv.toan-03', pass: '123456' },
  { id: 'gv_toan_04', code: 'GV-TOAN-04', fullName: 'Nguyễn Hữu Thạnh', department: 'Tổ Toán', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 10, email: 'gv.toan-04@thptchauthanha.edu.vn', phone: '0988 334 455', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', selfScore: 86, headScore: 87, principalScore: 88, role: 'TEACHER', username: 'gv.toan-04', pass: '123456' },
  { id: 'gv_toan_05', code: 'GV-TOAN-05', fullName: 'Nguyễn Thị Tính', department: 'Tổ Toán', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 9, email: 'gv.toan-05@thptchauthanha.edu.vn', phone: '0977 445 566', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 89, role: 'TEACHER', username: 'gv.toan-05', pass: '123456' },
  { id: 'gv_toan_06', code: 'GV-TOAN-06', fullName: 'Trần Thanh Hải', department: 'Tổ Toán', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 6, email: 'gv.toan-06@thptchauthanha.edu.vn', phone: '0933 556 677', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', selfScore: 85, headScore: 86, principalScore: 86, role: 'TEACHER', username: 'gv.toan-06', pass: '123456' },
  { id: 'gv_toan_07', code: 'GV-TOAN-07', fullName: 'Trần Thị Bach Tuyết', department: 'Tổ Toán', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 11, email: 'gv.toan-07@thptchauthanha.edu.vn', phone: '0966 667 788', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', selfScore: 87, headScore: 88, principalScore: 88, role: 'TEACHER', username: 'gv.toan-07', pass: '123456' },
  { id: 'gv_toan_08', code: 'GV-TOAN-08', fullName: 'Võ Văn Bảy', department: 'Tổ Toán', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 19, email: 'gv.toan-08@thptchauthanha.edu.vn', phone: '0908 778 899', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', selfScore: 91, headScore: 92, principalScore: 93, role: 'TEACHER', username: 'gv.toan-08', pass: '123456' },
  { id: 'gv_toan_09', code: 'GV-TOAN-09', fullName: 'Trương Sơn Hà', department: 'Tổ Toán', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 5, email: 'gv.toan-09@thptchauthanha.edu.vn', phone: '0944 889 900', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', selfScore: 84, headScore: 85, principalScore: 85, role: 'TEACHER', username: 'gv.toan-09', pass: '123456' },
  { id: 'gv_toan_10', code: 'GV-TOAN-10', fullName: 'Huỳnh Khánh Duy', department: 'Tổ Toán', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 4, email: 'gv.toan-10@thptchauthanha.edu.vn', phone: '0922 990 011', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', selfScore: 85, headScore: 85, principalScore: 85, role: 'TEACHER', username: 'gv.toan-10', pass: '123456' },

  // Tổ Văn - GDKTPL (10 GV)
  { id: 'gv_van_01', code: 'GV-VAN-01', fullName: 'Danh Thanh Sang', department: 'Tổ Văn - GDKTPL', position: 'Tổ trưởng chuyên môn', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 16, email: 'totruong.vangdktpl@thptchauthanha.edu.vn', phone: '0912 888 111', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', selfScore: 93, headScore: 94, principalScore: 95, role: 'HEAD_OF_DEPARTMENT', username: 'totruong.vangdktpl', pass: '123456' },
  { id: 'gv_van_02', code: 'GV-VAN-02', fullName: 'Đinh Minh Tuấn', department: 'Tổ Văn - GDKTPL', position: 'Tổ phó chuyên môn', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 13, email: 'topho.vangdktpl@thptchauthanha.edu.vn', phone: '0983 222 333', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', selfScore: 90, headScore: 91, principalScore: 92, role: 'HEAD_OF_DEPARTMENT', username: 'topho.vangdktpl', pass: '123456' },
  { id: 'gv_van_03', code: 'GV-VAN-03', fullName: 'Huỳnh Thuý Yến', department: 'Tổ Văn - GDKTPL', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 11, email: 'gv.van-03@thptchauthanha.edu.vn', phone: '0972 333 444', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80', selfScore: 89, headScore: 90, principalScore: 90, role: 'TEACHER', username: 'gv.van-03', pass: '123456' },
  { id: 'gv_van_04', code: 'GV-VAN-04', fullName: 'Nguyễn Thanh Khiêm', department: 'Tổ Văn - GDKTPL', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 10, email: 'gv.van-04@thptchauthanha.edu.vn', phone: '0938 444 555', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80', selfScore: 87, headScore: 88, principalScore: 88, role: 'TEACHER', username: 'gv.van-04', pass: '123456' },
  { id: 'gv_van_05', code: 'GV-VAN-05', fullName: 'Phạm Văn Thuấn', department: 'Tổ Văn - GDKTPL', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 9, email: 'gv.van-05@thptchauthanha.edu.vn', phone: '0909 555 666', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80', selfScore: 86, headScore: 87, principalScore: 87, role: 'TEACHER', username: 'gv.van-05', pass: '123456' },
  { id: 'gv_van_06', code: 'GV-VAN-06', fullName: 'Thái Thị Ngọc Duyên', department: 'Tổ Văn - GDKTPL', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 8, email: 'gv.van-06@thptchauthanha.edu.vn', phone: '0966 666 777', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 89, role: 'TEACHER', username: 'gv.van-06', pass: '123456' },
  { id: 'gv_van_07', code: 'GV-VAN-07', fullName: 'Trần Quang Duy', department: 'Tổ Văn - GDKTPL', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 5, email: 'gv.van-07@thptchauthanha.edu.vn', phone: '0945 777 888', avatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&auto=format&fit=crop&q=80', selfScore: 85, headScore: 86, principalScore: 86, role: 'TEACHER', username: 'gv.van-07', pass: '123456' },
  { id: 'gv_van_08', code: 'GV-VAN-08', fullName: 'Trần Thị Trúc Ni', department: 'Tổ Văn - GDKTPL', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 7, email: 'gv.van-08@thptchauthanha.edu.vn', phone: '0919 888 999', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 89, role: 'TEACHER', username: 'gv.van-08', pass: '123456' },
  { id: 'gv_van_09', code: 'GV-VAN-09', fullName: 'Võ Thị Hà', department: 'Tổ Văn - GDKTPL', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 17, email: 'gv.van-09@thptchauthanha.edu.vn', phone: '0987 999 000', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80', selfScore: 91, headScore: 92, principalScore: 93, role: 'TEACHER', username: 'gv.van-09', pass: '123456' },
  { id: 'gv_van_10', code: 'GV-VAN-10', fullName: 'Trần Ngọc Hân', department: 'Tổ Văn - GDKTPL', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 4, email: 'gv.van-10@thptchauthanha.edu.vn', phone: '0934 111 222', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', selfScore: 85, headScore: 85, principalScore: 85, role: 'TEACHER', username: 'gv.van-10', pass: '123456' },

  // Tổ Hoá - Sinh (10 GV)
  { id: 'gv_hoasinh_01', code: 'GV-HOASINH-01', fullName: 'Đỗ Kim Xuyến', department: 'Tổ Hoá - Sinh', position: 'Tổ trưởng chuyên môn', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 17, email: 'totruong.hoasinh@thptchauthanha.edu.vn', phone: '0912 555 444', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', selfScore: 92, headScore: 94, principalScore: 95, role: 'HEAD_OF_DEPARTMENT', username: 'totruong.hoasinh', pass: '123456' },
  { id: 'gv_hoasinh_02', code: 'GV-HOASINH-02', fullName: 'Đỗ Thị Thu', department: 'Tổ Hoá - Sinh', position: 'Tổ phó chuyên môn', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 14, email: 'topho.hoasinh@thptchauthanha.edu.vn', phone: '0988 666 555', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', selfScore: 90, headScore: 92, principalScore: 92, role: 'HEAD_OF_DEPARTMENT', username: 'topho.hoasinh', pass: '123456' },
  { id: 'gv_hoasinh_03', code: 'GV-HOASINH-03', fullName: 'Lê Thị Huỳnh Giao', department: 'Tổ Hoá - Sinh', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 11, email: 'gv.hoasinh-03@thptchauthanha.edu.vn', phone: '0977 777 666', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', selfScore: 89, headScore: 90, principalScore: 90, role: 'TEACHER', username: 'gv.hoasinh-03', pass: '123456' },
  { id: 'gv_hoasinh_04', code: 'GV-HOASINH-04', fullName: 'Lê Thị Phương Chi', department: 'Tổ Hoá - Sinh', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 10, email: 'gv.hoasinh-04@thptchauthanha.edu.vn', phone: '0933 888 777', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', selfScore: 87, headScore: 88, principalScore: 88, role: 'TEACHER', username: 'gv.hoasinh-04', pass: '123456' },
  { id: 'gv_hoasinh_05', code: 'GV-HOASINH-05', fullName: 'Lê Văn Sinh', department: 'Tổ Hoá - Sinh', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 9, email: 'gv.hoasinh-05@thptchauthanha.edu.vn', phone: '0908 999 888', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', selfScore: 86, headScore: 87, principalScore: 87, role: 'TEACHER', username: 'gv.hoasinh-05', pass: '123456' },
  { id: 'gv_hoasinh_06', code: 'GV-HOASINH-06', fullName: 'Lê Yến Nhi', department: 'Tổ Hoá - Sinh', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 5, email: 'gv.hoasinh-06@thptchauthanha.edu.vn', phone: '0966 000 111', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', selfScore: 85, headScore: 86, principalScore: 86, role: 'TEACHER', username: 'gv.hoasinh-06', pass: '123456' },
  { id: 'gv_hoasinh_07', code: 'GV-HOASINH-07', fullName: 'Nguyễn Thị Ngọc Ngân', department: 'Tổ Hoá - Sinh', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 8, email: 'gv.hoasinh-07@thptchauthanha.edu.vn', phone: '0944 111 222', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 89, role: 'TEACHER', username: 'gv.hoasinh-07', pass: '123456' },
  { id: 'gv_hoasinh_08', code: 'GV-HOASINH-08', fullName: 'Nguyễn Văn Út', department: 'Tổ Hoá - Sinh', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 6, email: 'gv.hoasinh-08@thptchauthanha.edu.vn', phone: '0922 222 333', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', selfScore: 85, headScore: 86, principalScore: 86, role: 'TEACHER', username: 'gv.hoasinh-08', pass: '123456' },
  { id: 'gv_hoasinh_09', code: 'GV-HOASINH-09', fullName: 'Phan Thị Bích', department: 'Tổ Hoá - Sinh', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 10, email: 'gv.hoasinh-09@thptchauthanha.edu.vn', phone: '0915 333 444', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80', selfScore: 87, headScore: 88, principalScore: 88, role: 'TEACHER', username: 'gv.hoasinh-09', pass: '123456' },
  { id: 'gv_hoasinh_10', code: 'GV-HOASINH-10', fullName: 'Võ Văn Sáu', department: 'Tổ Hoá - Sinh', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 18, email: 'gv.hoasinh-10@thptchauthanha.edu.vn', phone: '0989 444 555', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', selfScore: 91, headScore: 92, principalScore: 93, role: 'TEACHER', username: 'gv.hoasinh-10', pass: '123456' },

  // Tổ Sử - Địa - Anh Văn (12 GV)
  { id: 'gv_sudiaanh_01', code: 'GV-SUDIAANH-01', fullName: 'Đặng Văn Hải', department: 'Tổ Sử - Địa - Anh Văn', position: 'Tổ trưởng chuyên môn', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 18, email: 'totruong.suiaanhvan@thptchauthanha.edu.vn', phone: '0912 666 777', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', selfScore: 93, headScore: 94, principalScore: 95, role: 'HEAD_OF_DEPARTMENT', username: 'totruong.suiaanhvan', pass: '123456' },
  { id: 'gv_sudiaanh_02', code: 'GV-SUDIAANH-02', fullName: 'Đỗ Thị Thanh Thuý', department: 'Tổ Sử - Địa - Anh Văn', position: 'Tổ phó chuyên môn', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 15, email: 'topho.suiaanhvan@thptchauthanha.edu.vn', phone: '0988 777 888', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', selfScore: 91, headScore: 92, principalScore: 93, role: 'HEAD_OF_DEPARTMENT', username: 'topho.suiaanhvan', pass: '123456' },
  { id: 'gv_sudiaanh_03', code: 'GV-SUDIAANH-03', fullName: 'Hồ Hải Âu', department: 'Tổ Sử - Địa - Anh Văn', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 11, email: 'gv.sudiaanh-03@thptchauthanha.edu.vn', phone: '0977 888 999', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 89, role: 'TEACHER', username: 'gv.sudiaanh-03', pass: '123456' },
  { id: 'gv_sudiaanh_04', code: 'GV-SUDIAANH-04', fullName: 'Lâm Gia Bảo', department: 'Tổ Sử - Địa - Anh Văn', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 5, email: 'gv.sudiaanh-04@thptchauthanha.edu.vn', phone: '0933 999 000', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', selfScore: 85, headScore: 86, principalScore: 86, role: 'TEACHER', username: 'gv.sudiaanh-04', pass: '123456' },
  { id: 'gv_sudiaanh_05', code: 'GV-SUDIAANH-05', fullName: 'Lê Thị Hồng Diệu', department: 'Tổ Sử - Địa - Anh Văn', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 9, email: 'gv.sudiaanh-05@thptchauthanha.edu.vn', phone: '0908 000 111', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', selfScore: 87, headScore: 88, principalScore: 88, role: 'TEACHER', username: 'gv.sudiaanh-05', pass: '123456' },
  { id: 'gv_sudiaanh_06', code: 'GV-SUDIAANH-06', fullName: 'Lê Thị Hường', department: 'Tổ Sử - Địa - Anh Văn', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 8, email: 'gv.sudiaanh-06@thptchauthanha.edu.vn', phone: '0966 111 222', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 89, role: 'TEACHER', username: 'gv.sudiaanh-06', pass: '123456' },
  { id: 'gv_sudiaanh_07', code: 'GV-SUDIAANH-07', fullName: 'Lê Thị Phương Thảo', department: 'Tổ Sử - Địa - Anh Văn', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 10, email: 'gv.sudiaanh-07@thptchauthanha.edu.vn', phone: '0944 222 333', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', selfScore: 89, headScore: 90, principalScore: 90, role: 'TEACHER', username: 'gv.sudiaanh-07', pass: '123456' },
  { id: 'gv_sudiaanh_08', code: 'GV-SUDIAANH-08', fullName: 'Nguyễn Thị Thanh Quyên', department: 'Tổ Sử - Địa - Anh Văn', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 8, email: 'gv.sudiaanh-08@thptchauthanha.edu.vn', phone: '0922 333 444', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80', selfScore: 87, headScore: 88, principalScore: 88, role: 'TEACHER', username: 'gv.sudiaanh-08', pass: '123456' },
  { id: 'gv_sudiaanh_09', code: 'GV-SUDIAANH-09', fullName: 'Nguyễn Thuý Hồng', department: 'Tổ Sử - Địa - Anh Văn', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 9, email: 'gv.sudiaanh-09@thptchauthanha.edu.vn', phone: '0917 444 555', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 89, role: 'TEACHER', username: 'gv.sudiaanh-09', pass: '123456' },
  { id: 'gv_sudiaanh_10', code: 'GV-SUDIAANH-10', fullName: 'Trần Hoài Bảo', department: 'Tổ Sử - Địa - Anh Văn', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 6, email: 'gv.sudiaanh-10@thptchauthanha.edu.vn', phone: '0981 555 666', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', selfScore: 85, headScore: 86, principalScore: 86, role: 'TEACHER', username: 'gv.sudiaanh-10', pass: '123456' },
  { id: 'gv_sudiaanh_11', code: 'GV-SUDIAANH-11', fullName: 'Trần Thị Hà', department: 'Tổ Sử - Địa - Anh Văn', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 10, email: 'gv.sudiaanh-11@thptchauthanha.edu.vn', phone: '0935 666 777', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', selfScore: 87, headScore: 88, principalScore: 88, role: 'TEACHER', username: 'gv.sudiaanh-11', pass: '123456' },
  { id: 'gv_sudiaanh_12', code: 'GV-SUDIAANH-12', fullName: 'Trần Thị Kiều Nương', department: 'Tổ Sử - Địa - Anh Văn', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 5, email: 'gv.sudiaanh-12@thptchauthanha.edu.vn', phone: '0904 777 888', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', selfScore: 85, headScore: 85, principalScore: 85, role: 'TEACHER', username: 'gv.sudiaanh-12', pass: '123456' },

  // Tổ Lý - TD - QP (10 GV)
  { id: 'gv_lytdqp_01', code: 'GV-LYTDQP-01', fullName: 'Bùi Hữu Nhựt', department: 'Tổ Lý - TD - QP', position: 'Tổ trưởng chuyên môn', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 17, email: 'totruong.lytdqp@thptchauthanha.edu.vn', phone: '0912 111 333', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', selfScore: 92, headScore: 94, principalScore: 95, role: 'HEAD_OF_DEPARTMENT', username: 'totruong.lytdqp', pass: '123456' },
  { id: 'gv_lytdqp_02', code: 'GV-LYTDQP-02', fullName: 'Bùi Thị Ngọc Ngân', department: 'Tổ Lý - TD - QP', position: 'Tổ phó chuyên môn', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 14, email: 'topho.lytdqp@thptchauthanha.edu.vn', phone: '0988 222 444', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', selfScore: 90, headScore: 92, principalScore: 92, role: 'HEAD_OF_DEPARTMENT', username: 'topho.lytdqp', pass: '123456' },
  { id: 'gv_lytdqp_03', code: 'GV-LYTDQP-03', fullName: 'Hoàng Ngọc Lương', department: 'Tổ Lý - TD - QP', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 11, email: 'gv.lytdqp-03@thptchauthanha.edu.vn', phone: '0977 333 555', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 89, role: 'TEACHER', username: 'gv.lytdqp-03', pass: '123456' },
  { id: 'gv_lytdqp_04', code: 'GV-LYTDQP-04', fullName: 'Lư Thanh Tho', department: 'Tổ Lý - TD - QP', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 10, email: 'gv.lytdqp-04@thptchauthanha.edu.vn', phone: '0933 444 666', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', selfScore: 87, headScore: 88, principalScore: 88, role: 'TEACHER', username: 'gv.lytdqp-04', pass: '123456' },
  { id: 'gv_lytdqp_05', code: 'GV-LYTDQP-05', fullName: 'Nguyễn Anh Thư', department: 'Tổ Lý - TD - QP', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 16, email: 'gv.lytdqp-05@thptchauthanha.edu.vn', phone: '0908 555 777', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', selfScore: 91, headScore: 92, principalScore: 93, role: 'TEACHER', username: 'gv.lytdqp-05', pass: '123456' },
  { id: 'gv_lytdqp_06', code: 'GV-LYTDQP-06', fullName: 'Nguyễn Hữu Tiền', department: 'Tổ Lý - TD - QP', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 9, email: 'gv.lytdqp-06@thptchauthanha.edu.vn', phone: '0966 666 888', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', selfScore: 86, headScore: 87, principalScore: 87, role: 'TEACHER', username: 'gv.lytdqp-06', pass: '123456' },
  { id: 'gv_lytdqp_07', code: 'GV-LYTDQP-07', fullName: 'Nguyễn Ngọc Thuấn', department: 'Tổ Lý - TD - QP', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 8, email: 'gv.lytdqp-07@thptchauthanha.edu.vn', phone: '0944 777 999', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', selfScore: 87, headScore: 88, principalScore: 88, role: 'TEACHER', username: 'gv.lytdqp-07', pass: '123456' },
  { id: 'gv_lytdqp_08', code: 'GV-LYTDQP-08', fullName: 'Nguyễn Thị Ngọc Diệu', department: 'Tổ Lý - TD - QP', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 7, email: 'gv.lytdqp-08@thptchauthanha.edu.vn', phone: '0922 888 000', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 89, role: 'TEACHER', username: 'gv.lytdqp-08', pass: '123456' },
  { id: 'gv_lytdqp_09', code: 'GV-LYTDQP-09', fullName: 'Phạm Trường Giang', department: 'Tổ Lý - TD - QP', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 5, email: 'gv.lytdqp-09@thptchauthanha.edu.vn', phone: '0916 999 111', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', selfScore: 85, headScore: 86, principalScore: 86, role: 'TEACHER', username: 'gv.lytdqp-09', pass: '123456' },
  { id: 'gv_lytdqp_10', code: 'GV-LYTDQP-10', fullName: 'Võ Trần Lộc', department: 'Tổ Lý - TD - QP', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 10, email: 'gv.lytdqp-10@thptchauthanha.edu.vn', phone: '0982 000 222', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', selfScore: 89, headScore: 90, principalScore: 90, role: 'TEACHER', username: 'gv.lytdqp-10', pass: '123456' },

  // Tổ Tin - Công nghệ (5 GV)
  { id: 'gv_tin_01', code: 'GV-TIN-01', fullName: 'Dương Thái Hưng', department: 'Tổ Tin - Công nghệ', position: 'Tổ trưởng chuyên môn', titleGrade: 'Giáo viên THPT Hạng I', yearsOfExp: 16, email: 'totruong.tincongnghe@thptchauthanha.edu.vn', phone: '0912 333 222', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', selfScore: 93, headScore: 95, principalScore: 96, role: 'HEAD_OF_DEPARTMENT', username: 'totruong.tincongnghe', pass: '123456' },
  { id: 'gv_tin_02', code: 'GV-TIN-02', fullName: 'Nguyễn Hà Như Thu', department: 'Tổ Tin - Công nghệ', position: 'Tổ phó chuyên môn', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 12, email: 'topho.tincongnghe@thptchauthanha.edu.vn', phone: '0988 444 333', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', selfScore: 90, headScore: 92, principalScore: 92, role: 'HEAD_OF_DEPARTMENT', username: 'topho.tincongnghe', pass: '123456' },
  { id: 'gv_tin_03', code: 'GV-TIN-03', fullName: 'Nguyễn Thanh Lâm', department: 'Tổ Tin - Công nghệ', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 10, email: 'gv.tin-03@thptchauthanha.edu.vn', phone: '0977 555 444', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 89, role: 'TEACHER', username: 'gv.tin-03', pass: '123456' },
  { id: 'gv_tin_04', code: 'GV-TIN-04', fullName: 'Phạm Thị Thanh Thuý', department: 'Tổ Tin - Công nghệ', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng II', yearsOfExp: 8, email: 'gv.tin-04@thptchauthanha.edu.vn', phone: '0933 666 555', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', selfScore: 87, headScore: 88, principalScore: 88, role: 'TEACHER', username: 'gv.tin-04', pass: '123456' },
  { id: 'gv_tin_05', code: 'GV-TIN-05', fullName: 'Trần Thị Tiền Giang', department: 'Tổ Tin - Công nghệ', position: 'Giáo viên THPT', titleGrade: 'Giáo viên THPT Hạng III', yearsOfExp: 5, email: 'gv.tin-05@thptchauthanha.edu.vn', phone: '0908 777 666', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', selfScore: 86, headScore: 86, principalScore: 86, role: 'TEACHER', username: 'gv.tin-05', pass: '123456' },

  // Tổ Văn Phòng (5 NV)
  { id: 'nv_vp_01', code: 'NV-VP-01', fullName: 'Dương Như Ý', department: 'Tổ Văn Phòng', position: 'Kế toán viên', titleGrade: 'Viên chức Hành chính', yearsOfExp: 14, email: 'totruong.vanphong@thptchauthanha.edu.vn', phone: '0912 777 111', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', selfScore: 92, headScore: 93, principalScore: 94, role: 'HEAD_OF_DEPARTMENT', username: 'totruong.vanphong', pass: '123456' },
  { id: 'nv_vp_02', code: 'NV-VP-02', fullName: 'Nguyễn Văn Tặng', department: 'Tổ Văn Phòng', position: 'Hợp đồng lao động', titleGrade: 'Hợp đồng lao động', yearsOfExp: 8, email: 'topho.vanphong@thptchauthanha.edu.vn', phone: '0988 888 222', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', selfScore: 88, headScore: 89, principalScore: 90, role: 'HEAD_OF_DEPARTMENT', username: 'topho.vanphong', pass: '123456' },
  { id: 'nv_vp_03', code: 'NV-VP-03', fullName: 'Phùng Văn Trung', department: 'Tổ Văn Phòng', position: 'Tổ trưởng Văn phòng', titleGrade: 'Viên chức Hành chính', yearsOfExp: 15, email: 'nv.vp-03@thptchauthanha.edu.vn', phone: '0977 999 333', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', selfScore: 90, headScore: 91, principalScore: 92, role: 'TEACHER', username: 'nv.vp-03', pass: '123456' },
  { id: 'nv_vp_04', code: 'NV-VP-04', fullName: 'Trần Kim Châu', department: 'Tổ Văn Phòng', position: 'Hợp đồng lao động', titleGrade: 'Hợp đồng lao động', yearsOfExp: 6, email: 'nv.vp-04@thptchauthanha.edu.vn', phone: '0933 000 444', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', selfScore: 86, headScore: 87, principalScore: 87, role: 'TEACHER', username: 'nv.vp-04', pass: '123456' },
  { id: 'nv_vp_05', code: 'NV-VP-05', fullName: 'Nguyễn Thị Ngọc Huyền', department: 'Tổ Văn Phòng', position: 'Cán bộ Thư viện', titleGrade: 'Viên chức Hành chính', yearsOfExp: 9, email: 'nv.vp-05@thptchauthanha.edu.vn', phone: '0908 111 555', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', selfScore: 89, headScore: 90, principalScore: 90, role: 'TEACHER', username: 'nv.vp-05', pass: '123456' }
];

export const MOCK_TEACHERS: Teacher[] = RAW_GOOGLE_SHEET_TEACHERS.map((t, idx) => {
  const finalScore = parseFloat(((t.headScore * 0.4 + t.principalScore * 0.4 + t.selfScore * 0.2) + (idx < 5 ? 3 : 0)).toFixed(1));
  let classification: AssessmentClassification = 'HTTNV';
  if (finalScore >= 90) classification = 'HTXSNV';
  else if (finalScore >= 75) classification = 'HTTNV';
  else if (finalScore >= 60) classification = 'HTNV';
  else classification = 'CHT';

  return {
    id: t.id,
    code: t.code,
    fullName: t.fullName,
    department: t.department as Department,
    position: t.position,
    titleGrade: t.titleGrade as any,
    yearsOfTeaching: t.yearsOfExp,
    email: t.email,
    phone: t.phone,
    avatar: t.avatar,
    currentEvaluation: {
      id: `eval_${t.id}`,
      teacherId: t.id,
      period: 'Học kỳ I (2026-2027)',
      status: t.role === 'ADMIN_PRINCIPAL' ? 'APPROVED' : 'HEAD_REVIEWED',
      passivePointsTotal: idx < 5 ? 3.0 : 0.0,
      finalScore: finalScore > 100 ? 100 : finalScore,
      classification,
      isAnomaly: false,
      scores: {
        crit_1: { criteriaId: 'crit_1', selfScore: t.selfScore, headScore: t.headScore, principalScore: t.principalScore, comments: 'Chuyên môn vững vàng' },
        crit_2: { criteriaId: 'crit_2', selfScore: t.selfScore + 1, headScore: t.headScore, principalScore: t.principalScore, comments: 'Tác phong sư phạm mẫu mực' },
        crit_3: { criteriaId: 'crit_3', selfScore: t.selfScore - 1, headScore: t.headScore, principalScore: t.principalScore, comments: 'Đổi mới phương pháp tốt' },
        crit_4: { criteriaId: 'crit_4', selfScore: t.selfScore, headScore: t.headScore, principalScore: t.principalScore, comments: 'Tham gia thi đua tích cực' }
      },
      selfSubmittedAt: '10/11/2026 08:30:00',
      headApprovedAt: '12/11/2026 14:15:00',
      principalApprovedAt: t.role === 'ADMIN_PRINCIPAL' ? '15/11/2026 16:00:00' : undefined,
      digitalSignature: t.role === 'ADMIN_PRINCIPAL' ? {
        signedBy: 'Hiệu trưởng Nguyễn Minh Trí (Đã ký số NĐ 233)',
        timestamp: '15/11/2026 16:00:00',
        hash: `SIG-BGH-CTA-${t.id.toUpperCase()}`,
        otpVerified: true
      } : undefined
    },
    passiveLogs: idx < 5 ? [
      {
        id: `pl_${t.id}_1`,
        teacherId: t.id,
        type: 'BONUS',
        source: 'KHEN_THUONG_HSG',
        title: 'Thành tích thi đua Dạy tốt 20/11',
        description: 'Đạt giải cao trong phong trào chào mừng Ngày Nhà giáo Việt Nam.',
        points: 3.0,
        timestamp: '15/11/2026 10:00:00',
        verified: true
      }
    ] : [],
    skillDimensions: [
      { dimension: 'Chuyên môn', actualScore: Math.min(100, t.headScore + 2), benchmarkScore: 85 },
      { dimension: 'Đạo đức', actualScore: Math.min(100, t.headScore + 4), benchmarkScore: 90 },
      { dimension: 'CNTT/AI', actualScore: Math.min(100, t.headScore - 2), benchmarkScore: 80 },
      { dimension: 'Phong trào', actualScore: Math.min(100, t.headScore + 1), benchmarkScore: 80 },
      { dimension: 'Đổi mới PPDH', actualScore: Math.min(100, t.headScore), benchmarkScore: 85 }
    ],
    performanceTrend: [
      { period: '2024-2025 HK1', score: 86.5, classification: 'HTTNV' },
      { period: '2024-2025 HK2', score: 88.0, classification: 'HTTNV' },
      { period: '2025-2026 HK1', score: 90.5, classification: 'HTXSNV' },
      { period: '2025-2026 HK2', score: 92.0, classification: 'HTXSNV' },
      { period: '2026-2027 HK1', score: finalScore > 100 ? 100 : finalScore, classification }
    ],
    evidences: [
      {
        id: `ev_${t.id}_1`,
        title: 'Giấy chứng nhận Giáo viên Dạy giỏi / Bồi dưỡng HSG',
        category: 'chuyen_mon',
        issueDate: '20/11/2026',
        issuingAuthority: 'Sở GD&ĐT / THPT Châu Thành A',
        fileUrl: 'ChungNhan_ChuyenMon_2026.pdf',
        verified: true
      }
    ]
  };
});

export const INITIAL_USER_ACCOUNTS: UserAccount[] = RAW_GOOGLE_SHEET_TEACHERS.map((t) => ({
  id: `acc_${t.id}`,
  username: t.username,
  passwordHash: t.pass,
  fullName: t.fullName,
  role: t.role as any,
  department: t.department,
  position: t.position,
  teacherId: t.id,
  avatar: t.avatar,
  email: t.email,
  phone: t.phone
}));

export const INITIAL_WEIGHT_MATRICES: WeightMatrix[] = [
  {
    id: 'mat_standard_233',
    name: 'Ma Trận Chuẩn Nghị định 233/2026/NĐ-CP (Đặc thù THPT)',
    chuyenMonWeight: 40,
    daoDucWeight: 20,
    doiMoiCnttWeight: 20,
    thiDuaWeight: 20,
    isActive: true,
    description: 'Cân đối toàn diện giữa năng lực sư phạm, kỷ luật, ứng dụng CNTT/AI và thành tích thi đua.'
  },
  {
    id: 'mat_innovation',
    name: 'Ma Trận Ưu Tiên Chuyển Đổi Số & Đổi Mới Sáng Tạo',
    chuyenMonWeight: 30,
    daoDucWeight: 20,
    doiMoiCnttWeight: 35,
    thiDuaWeight: 15,
    isActive: false,
    description: 'Thúc đẩy giáo viên ứng dụng bài giảng số E-learning và AI trong dạy học.'
  }
];

export const INITIAL_CRITERIA: EvaluationCriteria[] = [
  {
    id: 'crit_1',
    moetCode: 'TC.01',
    title: 'Tiêu chuẩn 1: Phẩm chất chính trị, đạo đức lối sống & nếp sống văn hóa',
    description: 'Chấp hành chủ trương, đường lối của Đảng, pháp luật của Nhà nước; giữ gìn đạo đức nhà giáo.',
    weightPercent: 20,
    category: 'daoDucWeight',
    rubrics: [
      { level: 'HTXSNV', description: 'Gương mẫu, đạt danh hiệu tiên tiến, không có phản ánh vi phạm.', minScore: 90 },
      { level: 'HTTNV', description: 'Thực hiện tốt quy chế, lối sống lành mạnh.', minScore: 75 },
      { level: 'HTNV', description: 'Cơ bản chấp hành, có nhắc nhở nhẹ.', minScore: 60 },
      { level: 'CHT', description: 'Vi phạm quy chế hoặc bị kỷ luật.', minScore: 0 }
    ]
  },
  {
    id: 'crit_2',
    moetCode: 'TC.02',
    title: 'Tiêu chuẩn 2: Năng lực chuyên môn, nghiệp vụ & chất lượng giảng dạy',
    description: 'Soạn giáo án theo CT GDPT 2018, chất lượng bộ môn phụ trách, tỷ lệ học sinh khá giỏi.',
    weightPercent: 40,
    category: 'chuyenMonWeight',
    rubrics: [
      { level: 'HTXSNV', description: 'Học sinh đạt kết quả cao, có HS giỏi cấp tỉnh, tiết dạy đạt Xuất sắc.', minScore: 90 },
      { level: 'HTTNV', description: 'Đạt chỉ tiêu nhà trường giao, giảng dạy vững vàng.', minScore: 75 },
      { level: 'HTNV', description: 'Hoàn thành tiến độ chương trình, chất lượng đạt mức trung bình.', minScore: 60 },
      { level: 'CHT', description: 'Chưa đạt chỉ tiêu chuyên môn hoặc có học sinh yếu kém nhiều.', minScore: 0 }
    ]
  },
  {
    id: 'crit_3',
    moetCode: 'TC.03',
    title: 'Tiêu chuẩn 3: Đổi mới phương pháp, ứng dụng CNTT & Chuyển đổi số',
    description: 'Sử dụng bài giảng số, phần mềm tương tác (Canva, Quizizz, Geogebra), ứng dụng AI sư phạm.',
    weightPercent: 20,
    category: 'doiMoiCnttWeight',
    rubrics: [
      { level: 'HTXSNV', description: 'Tiên phong ứng dụng AI, có bài giảng tương tác mẫu chia sẻ trong tổ.', minScore: 90 },
      { level: 'HTTNV', description: 'Sử dụng thành thạo máy chiếu, bảng tương tác, phần mềm quản lý điểm.', minScore: 75 },
      { level: 'HTNV', description: 'Có ứng dụng công nghệ ở mức cơ bản.', minScore: 60 },
      { level: 'CHT', description: 'Không ứng dụng công nghệ, bảo thủ phương pháp cũ.', minScore: 0 }
    ]
  },
  {
    id: 'crit_4',
    moetCode: 'TC.04',
    title: 'Tiêu chuẩn 4: Tham gia phong trào thi đua & Hoạt động tập thể',
    description: 'Tích cực tham gia bồi dưỡng thường xuyên, hội thi giáo viên dạy giỏi, hoạt động đoàn thể.',
    weightPercent: 20,
    category: 'thiDuaWeight',
    rubrics: [
      { level: 'HTXSNV', description: 'Đạt giải hội thi, dẫn dắt phong trào đoàn thể xuất sắc.', minScore: 90 },
      { level: 'HTTNV', description: 'Tham gia đầy đủ, tích cực đóng góp cho tập thể.', minScore: 75 },
      { level: 'HTNV', description: 'Tham gia ở mức trung bình, có vắng một số hoạt động.', minScore: 60 },
      { level: 'CHT', description: 'Thờ ơ, không tham gia các hoạt động chung của trường.', minScore: 0 }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_init_01',
    timestamp: '15/11/2026 08:00:00',
    actorName: 'Hệ thống EduEval THPT Châu Thành A',
    actorRole: 'ADMIN_PRINCIPAL',
    action: 'KHỞI TẠO HỆ THỐNG DANH SÁCH 63 VIÊN CHỨC & TÀI KHOẢN',
    targetTeacherName: 'Toàn bộ 63 cán bộ giáo viên',
    details: 'Đã nạp thành công danh sách từ Google Sheets chính thức và khởi tạo tài khoản đăng nhập theo phân quyền Nghị định 233/2026/NĐ-CP.',
    ipAddress: '118.70.124.18'
  }
];

export const INITIAL_APPEALS: AppealDispute[] = [];
