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
  SelfDeclarationRecord
} from '../types';

export const INITIAL_DEPARTMENT_INFOS: DepartmentInfo[] = [
  { id: 'dept_1', name: 'Tổ Toán', headTeacherName: 'Trần Văn Hoàng', description: 'Toán học & Ứng dụng tư duy logic' },
  { id: 'dept_2', name: 'Tổ Văn - GDKTPL', headTeacherName: 'Lê Thị Thu Hà', description: 'Ngữ văn & Giáo dục kinh tế và pháp luật' },
  { id: 'dept_3', name: 'Tổ Hoá - Sinh', headTeacherName: 'Nguyễn Văn Minh', description: 'Hóa học, Sinh học & Nghiên cứu khoa học' },
  { id: 'dept_4', name: 'Tổ Sử - Địa - Anh Văn', headTeacherName: 'Đỗ Thị Phương Thảo', description: 'Lịch sử, Địa lý & Tiếng Anh' },
  { id: 'dept_5', name: 'Tổ Lý - TD - QP', headTeacherName: 'Phạm Minh Đức', description: 'Vật lý, Thể dục & Giáo dục quốc phòng' },
  { id: 'dept_6', name: 'Tổ Tin - Công nghệ', headTeacherName: 'Hoàng Quốc Việt', description: 'Tin học, Công nghệ & Chuyển đổi số' },
  { id: 'dept_7', name: 'Tổ Văn Phòng', headTeacherName: 'Nguyễn Thị Bích', description: 'Hành chính, Kế toán, Y tế & Thư viện' }
];

export const INITIAL_EMULATION_MOVEMENTS: EmulationMovement[] = [
  {
    id: 'mov_2011',
    title: 'Phong trào Thi đua Dạy tốt - Học tốt Chào mừng Ngày Nhà giáo Việt Nam 20/11',
    academicYear: '2025 - 2026',
    startDate: '2025-10-15',
    endDate: '2025-11-20',
    description: 'Đội ngũ giáo viên thi đua tiết dạy tốt, bài giảng E-learning sáng tạo và bồi dưỡng học sinh giỏi.',
    status: 'COMPLETED',
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
    academicYear: '2025 - 2026',
    startDate: '2025-11-01',
    endDate: '2025-12-15',
    description: 'Đánh giá năng lực sư phạm, đổi mới hình thức tổ chức lớp học và thực hiện Chương trình GDPT 2018.',
    status: 'COMPLETED',
    awardRules: [
      { id: 'rg1', level: 'Cấp Trường', awardName: 'Giải Nhất', points: 4.0 },
      { id: 'rg2', level: 'Cấp Trường', awardName: 'Giải Nhì', points: 3.0 },
      { id: 'rg3', level: 'Cấp Xã (Cụm Trường)', awardName: 'Giải Nhất', points: 6.0 },
      { id: 'rg4', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhất', points: 9.0 }
    ]
  },
  {
    id: 'mov_cds',
    title: 'Hội thi Thiết kế Bài giảng Số, Elearning & Sáng kiến AI trong Giáo dục năm 2025-2026',
    academicYear: '2025 - 2026',
    startDate: '2025-11-01',
    endDate: '2026-01-15',
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
    academicYear: '2025 - 2026',
    startDate: '2025-09-01',
    endDate: '2026-03-30',
    description: 'Giáo viên hướng dẫn học sinh thực hiện dự án nghiên cứu KHKT và ôn luyện đội tuyển học sinh giỏi.',
    status: 'ACTIVE',
    awardRules: [
      { id: 'rk1', level: 'Cấp Xã (Cụm Trường)', awardName: 'Giải Nhất', points: 4.5 },
      { id: 'rk2', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhất', points: 7.0 },
      { id: 'rk3', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhì', points: 5.0 },
      { id: 'rk4', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Ba', points: 3.5 },
      { id: 'rk5', level: 'Cấp Quốc Gia', awardName: 'Giải Nhất', points: 10.0 }
    ]
  },
  {
    id: 'mov_hoathao',
    title: 'Hội thao & Tiếng hát Người giáo viên THPT CHÂU THÀNH A năm học 2025-2026',
    academicYear: '2025 - 2026',
    startDate: '2025-10-20',
    endDate: '2025-11-15',
    description: 'Phong trào văn hóa văn nghệ, thể dục thể thao tạo môi trường gắn kết đoàn kết cán bộ giáo viên.',
    status: 'COMPLETED',
    awardRules: [
      { id: 'rh1', level: 'Cấp Trường', awardName: 'Giải Nhất', points: 2.5 },
      { id: 'rh2', level: 'Cấp Xã (Cụm Trường)', awardName: 'Giải Nhất', points: 4.0 },
      { id: 'rh3', level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhất', points: 6.0 }
    ]
  }
];

export const INITIAL_MOVEMENT_PARTICIPATIONS: MovementParticipation[] = [
  {
    id: 'mp_01',
    movementId: 'mov_2011',
    movementTitle: 'Phong trào Thi đua Dạy tốt - Học tốt Chào mừng Ngày Nhà giáo Việt Nam 20/11',
    teacherId: 'gv_01',
    teacherName: 'Trần Văn Hoàng',
    department: 'Tổ Toán',
    level: 'Cấp Tỉnh / Thành phố',
    awardName: 'Giải Nhất',
    pointsEarned: 8.0,
    recordedDate: '2025-11-18',
    note: 'Bồi dưỡng HSG Toán 12 đạt 02 giải Nhất cấp Tỉnh / Thành phố.'
  },
  {
    id: 'mp_02',
    movementId: 'mov_cds',
    movementTitle: 'Hội thi Thiết kế Bài giảng Số, Elearning & Sáng kiến AI trong Giáo dục năm 2025-2026',
    teacherId: 'gv_06',
    teacherName: 'Hoàng Quốc Việt',
    department: 'Tổ Tin - Công nghệ',
    level: 'Cấp Trường',
    awardName: 'Giải Nhất',
    pointsEarned: 4.0,
    recordedDate: '2025-11-28',
    note: 'Sáng kiến hệ thống quét mã QR điểm danh tự động.'
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att_01',
    teacherId: 'gv_03',
    teacherName: 'Nguyễn Minh Tuấn',
    department: 'Tổ Sử - Địa - Anh Văn',
    date: '2025-11-10',
    type: 'DI_TRE',
    minutesLate: 15,
    reason: 'Trễ buổi sinh hoạt chào cờ đầu tuần do sự cố giao thông',
    deductPoints: 2.0,
    recordedBy: 'BGH - Phó Hiệu trưởng',
    timestamp: '2025-11-10 07:15'
  },
  {
    id: 'att_02',
    teacherId: 'gv_03',
    teacherName: 'Nguyễn Minh Tuấn',
    department: 'Tổ Sử - Địa - Anh Văn',
    date: '2025-11-17',
    type: 'DI_TRE',
    minutesLate: 10,
    reason: 'Đến trường sau giờ trống cờ vào tiết 1',
    deductPoints: 1.5,
    recordedBy: 'Admin Hệ thống',
    timestamp: '2025-11-17 07:10'
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
    moetCode: 'NĐ90-Đa1'
  },
  {
    id: 'crit_2',
    category: 'dao_duc_ky_luat',
    title: 'Tư tưởng chính trị, Đạo đức nhà giáo & Kỷ luật lao động',
    description: 'Chấp hành đường lối, nội quy nhà trường, đúng giờ lên lớp, ứng xử chuẩn mực với đồng nghiệp và học sinh.',
    maxScore: 100,
    weightPercent: 20,
    moetCode: 'NĐ90-Đa2'
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
    moetCode: 'NĐ90-Đa4'
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
    effectiveFrom: '01/09/2025',
    note: 'Áp dụng cho đánh giá định kỳ toàn bộ năm học.'
  },
  {
    id: 'wm_emulation_2011',
    name: 'Đợt Cao Điểm Thi Đua 20/11 & HSG',
    chuyenMonWeight: 35,
    daoDucWeight: 15,
    doiMoiCnttWeight: 20,
    thiDuaWeight: 30,
    isActive: false,
    effectiveFrom: '15/10/2025',
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
    effectiveFrom: '01/01/2026',
    note: 'Khuyến khích giáo viên đẩy mạnh bài giảng số và ứng dụng AI.'
  }
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'gv_01',
    code: 'GV-TOAN-01',
    fullName: 'Trần Văn Hoàng',
    email: 'hoang.tran@thptchauthanha.edu.vn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Tổ Toán',
    position: 'Tổ trưởng chuyên môn',
    titleGrade: 'Giáo viên THPT Hạng I',
    yearsOfTeaching: 14,
    phone: '0912 345 678',
    skillDimensions: [
      { dimensionName: 'Phẩm chất nhà giáo', score: 98, benchmarkScore: 90 },
      { dimensionName: 'Phát triển chuyên môn', score: 95, benchmarkScore: 85 },
      { dimensionName: 'Năng lực sư phạm', score: 92, benchmarkScore: 85 },
      { dimensionName: 'Ứng dụng CNTT & AI', score: 88, benchmarkScore: 80 },
      { dimensionName: 'Xây dựng môi trường & Thi đua', score: 94, benchmarkScore: 85 }
    ],
    performanceTrend: [
      { period: 'Tháng 9', score: 91 },
      { period: 'Tháng 10', score: 94 },
      { period: 'Tháng 11', score: 96 },
      { period: 'Tháng 12', score: 95 }
    ],
    passiveLogs: [
      {
        id: 'pl_01',
        teacherId: 'gv_01',
        type: 'BONUS',
        source: 'KHEN_THUONG_HSG',
        title: 'Thành tích Bồi dưỡng HSG',
        description: '02 Học sinh đạt giải Nhì cấp Thành phố môn Toán lớp 12.',
        points: 5.0,
        timestamp: '2025-11-18 10:30',
        verified: true
      },
      {
        id: 'pl_02',
        teacherId: 'gv_01',
        type: 'BONUS',
        source: 'HE_THONG_GIAO_AN',
        title: 'Hoàn thành Kế hoạch bài dạy sớm',
        description: 'Nộp đầy đủ 100% giáo án Module 3 trước hạn 3 ngày.',
        points: 2.0,
        timestamp: '2025-11-01 08:00',
        verified: true
      }
    ],
    evidences: [
      {
        id: 'ev_01',
        title: 'Giấy khen HSG Giỏi Cấp Thành Phố môn Toán 12',
        category: 'Thành tích chuyên môn',
        fileUrl: '#',
        fileType: 'CERTIFICATE',
        uploadedAt: '2025-11-20',
        description: 'Quyết định số 1425/QĐ-SGDĐT khen thưởng GV bồi dưỡng HSG.',
        status: 'APPROVED'
      },
      {
        id: 'ev_02',
        title: 'Bài giảng E-learning Hình học Không gian 12',
        category: 'Chuyển đổi số',
        fileUrl: '#',
        fileType: 'LINK',
        uploadedAt: '2025-10-15',
        description: 'Sử dụng phần mềm Geogebra 3D kết hợp LMS trường.',
        status: 'APPROVED'
      }
    ],
    currentEvaluation: {
      id: 'eval_gv_01',
      teacherId: 'gv_01',
      period: 'Học kỳ I (2025-2026)',
      status: 'APPROVED',
      passivePointsTotal: 7.0,
      finalScore: 95.8,
      classification: 'HTXSNV',
      isAnomaly: false,
      scores: {
        crit_1: { criteriaId: 'crit_1', selfScore: 96, headScore: 95, principalScore: 95, comments: 'Giảng dạy xuất sắc, hồ sơ chu đáo.' },
        crit_2: { criteriaId: 'crit_2', selfScore: 100, headScore: 98, principalScore: 98, comments: 'Gương mẫu, uy tín cao.' },
        crit_3: { criteriaId: 'crit_3', selfScore: 90, headScore: 90, principalScore: 92, comments: 'Ứng dụng Geogebra và bài giảng tương tác rất tốt.' },
        crit_4: { criteriaId: 'crit_4', selfScore: 95, headScore: 96, principalScore: 96, comments: 'Bồi dưỡng HSG đạt kết quả cao.' }
      },
      selfSubmittedAt: '2025-12-20 14:00',
      headApprovedAt: '2025-12-22 09:30',
      principalApprovedAt: '2025-12-24 16:15',
      digitalSignature: {
        signedBy: 'Hiệu trưởng Nguyễn Minh Trí',
        timestamp: '2025-12-24 16:15:02 UTC+7',
        hash: 'a8f9c12b7e402d1a3f6',
        otpVerified: true
      }
    }
  },
  {
    id: 'gv_02',
    code: 'GV-VAN-02',
    fullName: 'Lê Thị Thu Hà',
    email: 'ha.le@thptchauthanha.edu.vn',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department: 'Tổ Văn - GDKTPL',
    position: 'Tổ trưởng chuyên môn',
    titleGrade: 'Giáo viên THPT Hạng I',
    yearsOfTeaching: 16,
    phone: '0988 765 432',
    skillDimensions: [
      { dimensionName: 'Phẩm chất nhà giáo', score: 96, benchmarkScore: 90 },
      { dimensionName: 'Phát triển chuyên môn', score: 94, benchmarkScore: 85 },
      { dimensionName: 'Năng lực sư phạm', score: 95, benchmarkScore: 85 },
      { dimensionName: 'Ứng dụng CNTT & AI', score: 72, benchmarkScore: 80 },
      { dimensionName: 'Xây dựng môi trường & Thi đua', score: 90, benchmarkScore: 85 }
    ],
    performanceTrend: [
      { period: 'Tháng 9', score: 88 },
      { period: 'Tháng 10', score: 89 },
      { period: 'Tháng 11', score: 90 },
      { period: 'Tháng 12', score: 89 }
    ],
    passiveLogs: [
      {
        id: 'pl_03',
        teacherId: 'gv_02',
        type: 'BONUS',
        source: 'KHEN_THUONG_HSG',
        title: 'HSG Cấp Tỉnh Văn',
        description: '01 Giải Nhất cấp Tỉnh Ngữ Văn lớp 12.',
        points: 4.0,
        timestamp: '2025-11-22 14:00',
        verified: true
      }
    ],
    evidences: [
      {
        id: 'ev_03',
        title: 'Chuyên đề Sáng kiến Kinh nghiệm Văn học Hiện đại',
        category: 'Nghiên cứu khoa học',
        fileUrl: '#',
        fileType: 'PDF',
        uploadedAt: '2025-11-10',
        description: 'Đã nghiệm thu cấp Trường đạt loại Xuất sắc.',
        status: 'APPROVED'
      }
    ],
    idpPlan: {
      id: 'idp_gv_02',
      teacherId: 'gv_02',
      createdAt: '2025-12-25',
      updatedAt: '2025-12-25',
      overallAssessment: 'Giáo viên giàu kinh nghiệm, tâm huyết, chuyên môn Ngữ văn xuất sắc. Tuy nhiên năng lực Ứng dụng CNTT & AI trong bài giảng chưa thực sự đột phá (72/100).',
      strengths: [
        'Kỹ năng truyền cảm hứng bài giảng xuất sắc',
        'Bồi dưỡng HSG đạt giải cao',
        'Hồ sơ chuyên môn chỉn chu'
      ],
      areasForImprovement: [
        'Sử dụng các công cụ AI hỗ trợ tạo ngữ liệu minh họa',
        'Thiết kế sơ đồ tư duy số (Mindmap) trên phần mềm Canva/Miro',
        'Ứng dụng Trắc nghiệm tương tác Kahoot/Quizizz cho bài học Văn'
      ],
      goals: [
        {
          id: 'goal_01',
          skillGapArea: 'Ứng dụng CNTT & AI trong giảng dạy',
          targetGoal: 'Thành thạo thiết kế bài giảng số tương tác và sử dụng AI sinh hình ảnh minh họa tác phẩm văn học.',
          actionSteps: [
            'Tham gia tập huấn "Sử dụng Canva và GenAI trong môn Ngữ văn"',
            'Tạo 03 bài giảng số thử nghiệm trên Canva cho học kỳ II',
            'Sử dụng Quizizz cho kiểm tra thường xuyên 15 phút'
          ],
          recommendedCourses: [
            { title: 'Tạo bài giảng Văn học tương tác với Canva & AI', platform: 'Tập huấn Sống Số THPT', duration: '12 giờ' },
            { title: 'Chuyển đổi số trong Giảng dạy Ngữ Văn THPT', platform: 'Hệ thống LMS Bộ GD&ĐT', duration: '8 giờ' }
          ],
          deadline: '15/03/2026',
          status: 'IN_PROGRESS'
        }
      ],
      aiCoachingAdvice: 'Cô Hà có nền tảng vững vàng về sư phạm. Việc làm quen với công cụ AI trực quan như Canva AI sẽ giúp cô chuẩn bị giáo án văn học sinh động hơn 40%, tiết kiệm thời gian mà học sinh thích thú hơn.'
    },
    currentEvaluation: {
      id: 'eval_gv_02',
      teacherId: 'gv_02',
      period: 'Học kỳ I (2025-2026)',
      status: 'APPROVED',
      passivePointsTotal: 4.0,
      finalScore: 90.2,
      classification: 'HTXSNV',
      isAnomaly: false,
      scores: {
        crit_1: { criteriaId: 'crit_1', selfScore: 95, headScore: 94, principalScore: 94, comments: 'Bài giảng sâu sắc, truyền cảm hứng.' },
        crit_2: { criteriaId: 'crit_2', selfScore: 98, headScore: 96, principalScore: 96 },
        crit_3: { criteriaId: 'crit_3', selfScore: 75, headScore: 75, principalScore: 76, comments: 'Cần nâng cao ứng dụng công nghệ số.' },
        crit_4: { criteriaId: 'crit_4', selfScore: 90, headScore: 92, principalScore: 92 }
      },
      selfSubmittedAt: '2025-12-19 11:20',
      headApprovedAt: '2025-12-21 15:40',
      principalApprovedAt: '2025-12-24 16:20'
    }
  },
  {
    id: 'gv_03',
    code: 'GV-ANH-03',
    fullName: 'Nguyễn Minh Tuấn',
    email: 'tuan.nguyen@thptchauthanha.edu.vn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Tổ Sử - Địa - Anh Văn',
    position: 'Giáo viên THPT',
    titleGrade: 'Giáo viên THPT Hạng II',
    yearsOfTeaching: 6,
    phone: '0903 112 233',
    skillDimensions: [
      { dimensionName: 'Phẩm chất nhà giáo', score: 85, benchmarkScore: 90 },
      { dimensionName: 'Phát triển chuyên môn', score: 88, benchmarkScore: 85 },
      { dimensionName: 'Năng lực sư phạm', score: 86, benchmarkScore: 85 },
      { dimensionName: 'Ứng dụng CNTT & AI', score: 96, benchmarkScore: 80 },
      { dimensionName: 'Xây dựng môi trường & Thi đua', score: 65, benchmarkScore: 85 }
    ],
    performanceTrend: [
      { period: 'Tháng 9', score: 82 },
      { period: 'Tháng 10', score: 78 },
      { period: 'Tháng 11', score: 74 },
      { period: 'Tháng 12', score: 71 }
    ],
    passiveLogs: [
      {
        id: 'pl_04',
        teacherId: 'gv_03',
        type: 'PENALTY',
        source: 'MAY_CHAM_CONG',
        title: 'Đi muộn giờ sinh hoạt đầu tuần',
        description: 'Vào muộn 15 phút trong buổi chào cờ ngày 10/11/2025.',
        points: -2.0,
        timestamp: '2025-11-10 07:15',
        verified: true
      },
      {
        id: 'pl_05',
        teacherId: 'gv_03',
        type: 'PENALTY',
        source: 'HE_THONG_GIAO_AN',
        title: 'Chậm nộp Kế hoạch bài dạy',
        description: 'Chậm nộp giáo án Tuần 12 quá hạn 24 giờ.',
        points: -1.5,
        timestamp: '2025-11-17 18:00',
        verified: true
      }
    ],
    evidences: [],
    currentEvaluation: {
      id: 'eval_gv_03',
      teacherId: 'gv_03',
      period: 'Học kỳ I (2025-2026)',
      status: 'HEAD_REVIEWED',
      passivePointsTotal: -3.5,
      finalScore: 73.5,
      classification: 'HTNV',
      isAnomaly: true,
      anomalyReason: 'CẢNH BÁO BẤT THƯỜNG: Điểm Tổ trưởng chấm (88 điểm) chênh lệch +18% so với dữ liệu thụ động và đánh giá thực tế của BGH (72 điểm). Đồng thời sụt giảm hiệu suất 3 tuần liên tiếp!',
      scores: {
        crit_1: { criteriaId: 'crit_1', selfScore: 85, headScore: 88, principalScore: 75, comments: 'BGH nhận xét: Kỷ luật giảng dạy cần củng cố.' },
        crit_2: { criteriaId: 'crit_2', selfScore: 80, headScore: 85, principalScore: 70, comments: 'Bị trừ điểm chấm công và chậm nộp giáo án.' },
        crit_3: { criteriaId: 'crit_3', selfScore: 95, headScore: 95, principalScore: 90, comments: 'Thế mạnh lớn về tiếng Anh và công nghệ.' },
        crit_4: { criteriaId: 'crit_4', selfScore: 70, headScore: 75, principalScore: 60, comments: 'Ít tham gia phong trào tập thể.' }
      },
      selfSubmittedAt: '2025-12-18 16:00',
      headApprovedAt: '2025-12-20 10:15'
    }
  },
  {
    id: 'gv_04',
    code: 'GV-LY-04',
    fullName: 'Phạm Minh Đức',
    email: 'duc.pham@thptchauthanha.edu.vn',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Tổ Lý - TD - QP',
    position: 'Giáo viên THPT',
    titleGrade: 'Giáo viên THPT Hạng II',
    yearsOfTeaching: 9,
    phone: '0977 889 900',
    skillDimensions: [
      { dimensionName: 'Phẩm chất nhà giáo', score: 92, benchmarkScore: 90 },
      { dimensionName: 'Phát triển chuyên môn', score: 90, benchmarkScore: 85 },
      { dimensionName: 'Năng lực sư phạm', score: 88, benchmarkScore: 85 },
      { dimensionName: 'Ứng dụng CNTT & AI', score: 92, benchmarkScore: 80 },
      { dimensionName: 'Xây dựng môi trường & Thi đua', score: 87, benchmarkScore: 85 }
    ],
    performanceTrend: [
      { period: 'Tháng 9', score: 86 },
      { period: 'Tháng 10', score: 88 },
      { period: 'Tháng 11', score: 89 },
      { period: 'Tháng 12', score: 90 }
    ],
    passiveLogs: [
      {
        id: 'pl_06',
        teacherId: 'gv_04',
        type: 'BONUS',
        source: 'SO_DAU_BAI',
        title: 'Thí nghiệm thực hành sáng tạo',
        description: 'Tổ chức 100% tiết dạy Vật lý 11 có thí nghiệm mô phỏng ảo PhET.',
        points: 3.0,
        timestamp: '2025-11-25 15:00',
        verified: true
      }
    ],
    evidences: [
      {
        id: 'ev_04',
        title: 'Video Thí nghiệm Vật lý Mô phỏng PhET 3D',
        category: 'Đổi mới phương pháp',
        fileUrl: '#',
        fileType: 'IMAGE',
        uploadedAt: '2025-11-20',
        description: 'Minh chứng tiết dạy chuyên đề cụm trường.',
        status: 'APPROVED'
      }
    ],
    currentEvaluation: {
      id: 'eval_gv_04',
      teacherId: 'gv_04',
      period: 'Học kỳ I (2025-2026)',
      status: 'APPROVED',
      passivePointsTotal: 3.0,
      finalScore: 88.5,
      classification: 'HTTNV',
      isAnomaly: false,
      scores: {
        crit_1: { criteriaId: 'crit_1', selfScore: 88, headScore: 88, principalScore: 88 },
        crit_2: { criteriaId: 'crit_2', selfScore: 92, headScore: 92, principalScore: 92 },
        crit_3: { criteriaId: 'crit_3', selfScore: 90, headScore: 90, principalScore: 90 },
        crit_4: { criteriaId: 'crit_4', selfScore: 84, headScore: 84, principalScore: 84 }
      },
      selfSubmittedAt: '2025-12-19 09:00',
      headApprovedAt: '2025-12-21 11:00',
      principalApprovedAt: '2025-12-24 16:30'
    }
  },
  {
    id: 'gv_05',
    code: 'GV-SU-05',
    fullName: 'Đỗ Thị Phương Thảo',
    email: 'thao.do@thptchauthanha.edu.vn',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Tổ Sử - Địa - Anh Văn',
    position: 'Tổ trưởng chuyên môn',
    titleGrade: 'Giáo viên THPT Hạng I',
    yearsOfTeaching: 18,
    phone: '0915 223 344',
    skillDimensions: [
      { dimensionName: 'Phẩm chất nhà giáo', score: 96, benchmarkScore: 90 },
      { dimensionName: 'Phát triển chuyên môn', score: 92, benchmarkScore: 85 },
      { dimensionName: 'Năng lực sư phạm', score: 94, benchmarkScore: 85 },
      { dimensionName: 'Ứng dụng CNTT & AI', score: 85, benchmarkScore: 80 },
      { dimensionName: 'Xây dựng môi trường & Thi đua', score: 93, benchmarkScore: 85 }
    ],
    performanceTrend: [
      { period: 'Tháng 9', score: 90 },
      { period: 'Tháng 10', score: 92 },
      { period: 'Tháng 11', score: 93 },
      { period: 'Tháng 12', score: 92 }
    ],
    passiveLogs: [],
    evidences: [],
    currentEvaluation: {
      id: 'eval_gv_05',
      teacherId: 'gv_05',
      period: 'Học kỳ I (2025-2026)',
      status: 'APPROVED',
      passivePointsTotal: 0,
      finalScore: 92.0,
      classification: 'HTXSNV',
      isAnomaly: false,
      scores: {
        crit_1: { criteriaId: 'crit_1', selfScore: 92, headScore: 92, principalScore: 92 },
        crit_2: { criteriaId: 'crit_2', selfScore: 96, headScore: 96, principalScore: 96 },
        crit_3: { criteriaId: 'crit_3', selfScore: 88, headScore: 88, principalScore: 88 },
        crit_4: { criteriaId: 'crit_4', selfScore: 92, headScore: 92, principalScore: 92 }
      },
      selfSubmittedAt: '2025-12-18 10:00',
      headApprovedAt: '2025-12-20 14:00',
      principalApprovedAt: '2025-12-24 16:35'
    }
  },
  {
    id: 'gv_06',
    code: 'GV-TIN-06',
    fullName: 'Hoàng Quốc Việt',
    email: 'viet.hoang@thptchauthanha.edu.vn',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department: 'Tổ Tin - Công nghệ',
    position: 'Giáo viên THPT',
    titleGrade: 'Giáo viên THPT Hạng III',
    yearsOfTeaching: 3,
    phone: '0966 554 433',
    skillDimensions: [
      { dimensionName: 'Phẩm chất nhà giáo', score: 90, benchmarkScore: 90 },
      { dimensionName: 'Phát triển chuyên môn', score: 85, benchmarkScore: 85 },
      { dimensionName: 'Năng lực sư phạm', score: 82, benchmarkScore: 85 },
      { dimensionName: 'Ứng dụng CNTT & AI', score: 99, benchmarkScore: 80 },
      { dimensionName: 'Xây dựng môi trường & Thi đua', score: 88, benchmarkScore: 85 }
    ],
    performanceTrend: [
      { period: 'Tháng 9', score: 84 },
      { period: 'Tháng 10', score: 86 },
      { period: 'Tháng 11', score: 88 },
      { period: 'Tháng 12', score: 89 }
    ],
    passiveLogs: [
      {
        id: 'pl_07',
        teacherId: 'gv_06',
        type: 'BONUS',
        source: 'GOOGLE_SHEETS_SYNC',
        title: 'Hỗ trợ Kỹ thuật Chuyển đổi số Trường',
        description: 'Xây dựng hệ thống quét mã QR điểm danh học sinh tự động.',
        points: 4.0,
        timestamp: '2025-11-28 09:00',
        verified: true
      }
    ],
    evidences: [
      {
        id: 'ev_05',
        title: 'Mã nguồn Hệ thống Điểm danh QR Code THPT',
        category: 'Sáng kiến kinh nghiệm',
        fileUrl: '#',
        fileType: 'LINK',
        uploadedAt: '2025-11-28',
        description: 'Ứng dụng thử nghiệm cho toàn trường đạt hiệu quả tốt.',
        status: 'APPROVED'
      }
    ],
    currentEvaluation: {
      id: 'eval_gv_06',
      teacherId: 'gv_06',
      period: 'Học kỳ I (2025-2026)',
      status: 'APPROVED',
      passivePointsTotal: 4.0,
      finalScore: 89.0,
      classification: 'HTTNV',
      isAnomaly: false,
      scores: {
        crit_1: { criteriaId: 'crit_1', selfScore: 84, headScore: 85, principalScore: 85 },
        crit_2: { criteriaId: 'crit_2', selfScore: 90, headScore: 90, principalScore: 90 },
        crit_3: { criteriaId: 'crit_3', selfScore: 100, headScore: 98, principalScore: 98 },
        crit_4: { criteriaId: 'crit_4', selfScore: 85, headScore: 85, principalScore: 85 }
      },
      selfSubmittedAt: '2025-12-19 14:00',
      headApprovedAt: '2025-12-21 16:00',
      principalApprovedAt: '2025-12-24 16:40'
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_01',
    timestamp: '2025-12-24 16:40:12',
    actorName: 'Nguyễn Minh Trí',
    actorRole: 'Hiệu trưởng',
    action: 'KÝ SỐ PHÊ DUYỆT ĐÁNH GIÁ',
    targetTeacherName: 'Hoàng Quốc Việt',
    details: 'Phê duyệt kết quả đánh giá Học kỳ I đạt Hoàn thành Tốt nhiệm vụ (89.0 điểm). Mã OTP xác thực thành công.',
    ipAddress: '118.70.124.18',
    signedHash: 'e9a1827c5d4f21e09a3'
  },
  {
    id: 'log_02',
    timestamp: '2025-12-24 16:15:02',
    actorName: 'Nguyễn Minh Trí',
    actorRole: 'Hiệu trưởng',
    action: 'KÝ SỐ PHÊ DUYỆT ĐÁNH GIÁ',
    targetTeacherName: 'Trần Văn Hoàng',
    details: 'Phê duyệt kết quả đánh giá Học kỳ I đạt Hoàn thành Xuất sắc nhiệm vụ (95.8 điểm).',
    ipAddress: '118.70.124.18',
    signedHash: 'a8f9c12b7e402d1a3f6'
  },
  {
    id: 'log_03',
    timestamp: '2025-12-20 10:15:44',
    actorName: 'Tổ trưởng Tiếng Anh',
    actorRole: 'Tổ trưởng chuyên môn',
    action: 'GHI NHẬN ĐÁNH GIÁ TỔ MÔN',
    targetTeacherName: 'Nguyễn Minh Tuấn',
    details: 'Chấm điểm Tổ môn (88.0 điểm). Kích hoạt cảnh báo bất thường tự động do chênh lệch với dữ liệu thụ động.',
    ipAddress: '118.70.124.22'
  },
  {
    id: 'log_04',
    timestamp: '2025-11-28 09:00:00',
    actorName: 'Hệ thống Đồng bộ Thụ động',
    actorRole: 'SYSTEM_BOT',
    action: 'THU THẬP ĐIỂM CỘNG TỰ ĐỘNG',
    targetTeacherName: 'Hoàng Quốc Việt',
    details: '+4.0 điểm thưởng từ Sổ tay Chuyển đổi số (Đã đối soát qua Google Sheets Sync).',
    ipAddress: '127.0.0.1'
  }
];

export const INITIAL_APPEALS: AppealDispute[] = [
  {
    id: 'app_01',
    teacherId: 'gv_03',
    teacherName: 'Nguyễn Minh Tuấn',
    evaluationId: 'eval_gv_03',
    reason: 'Kính trình Ban Giám hiệu, em xin giải trình về việc đi muộn ngày 10/11 do hỗ trợ kỳ thi chứng chỉ sinh viên của trường và có xác nhận của PHT. Kính mong BGH xem xét lại điểm Kỷ luật.',
    attachedEvidences: ['https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=300'],
    status: 'PENDING',
    submittedAt: '2025-12-22 15:30'
  }
];

export const INITIAL_SELF_DECLARATIONS: SelfDeclarationRecord[] = [
  {
    id: 'sd_01',
    teacherId: 'gv_01',
    teacherName: 'Trần Văn Hoàng',
    department: 'Tổ Toán',
    type: 'BONUS_AWARD',
    title: 'Hội thi Thiết kế Bài giảng Số, Elearning & Sáng kiến AI trong Giáo dục',
    categoryOrLevel: 'Cấp Tỉnh / Thành phố',
    awardNameOrInfraction: 'Giải Nhất',
    suggestedPoints: 8.0,
    evidenceUrlOrDesc: 'Quyết định số 1845/QĐ-SGDĐT về việc khen thưởng GV đạt Giải Nhất thiết kế bài giảng E-learning số toán 12.',
    submittedAt: '2025-12-10 09:30',
    status: 'APPROVED',
    headApproval: {
      approvedBy: 'Trần Văn Hoàng (Tổ trưởng)',
      approvedAt: '2025-12-11 10:00',
      comment: 'Đã xác minh đầy đủ quyết định và minh chứng video bài giảng số.'
    },
    principalApproval: {
      approvedBy: 'Hiệu trưởng Nguyễn Minh Trí',
      approvedAt: '2025-12-12 14:20',
      comment: 'Đã ký số phê duyệt chính thức công nhận +8.0 điểm thi đua.'
    }
  },
  {
    id: 'sd_02',
    teacherId: 'gv_04',
    teacherName: 'Phạm Minh Đức',
    department: 'Tổ Lý - TD - QP',
    type: 'BONUS_AWARD',
    title: 'Hội thao & Tiếng hát Người giáo viên THPT Châu Thành A',
    categoryOrLevel: 'Cấp Xã (Cụm Trường)',
    awardNameOrInfraction: 'Giải Nhất',
    suggestedPoints: 4.0,
    evidenceUrlOrDesc: 'Giấy khen Cụm thi đua số 3 môn Bóng chuyền hơi nam giáo viên.',
    submittedAt: '2025-12-15 11:00',
    status: 'PENDING_PRINCIPAL',
    headApproval: {
      approvedBy: 'Tổ trưởng Phạm Minh Đức',
      approvedAt: '2025-12-16 08:30',
      comment: 'Đã kiểm tra giấy khen cụm trường hợp lệ. Trình BGH phê duyệt.'
    }
  },
  {
    id: 'sd_03',
    teacherId: 'gv_03',
    teacherName: 'Nguyễn Minh Tuấn',
    department: 'Tổ Sử - Địa - Anh Văn',
    type: 'PENALTY_INFRACTION',
    title: 'Kê khai vi phạm & Tự nhận mức trừ điểm kỷ luật',
    categoryOrLevel: 'Vi phạm nếp sống / Kỷ luật',
    awardNameOrInfraction: 'Đi trễ sinh hoạt đầu tuần & Chậm nộp giáo án',
    suggestedPoints: -3.5,
    evidenceUrlOrDesc: 'Trễ 15 phút chào cờ ngày 10/11 và nộp chậm giáo án tuần 12. Tự kê khai xin rút kinh nghiệm.',
    submittedAt: '2025-12-18 16:45',
    status: 'PENDING_HEAD'
  }
];
