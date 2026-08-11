export type Role = 'ADMIN_PRINCIPAL' | 'HEAD_OF_DEPARTMENT' | 'TEACHER';

export type AssessmentClassification = 'HTXSNV' | 'HTTNV' | 'HTNV' | 'CHT'; 
// HTXSNV: Hoàn thành xuất sắc nhiệm vụ
// HTTNV: Hoàn thành tốt nhiệm vụ
// HTNV: Hoàn thành nhiệm vụ
// CHT: Chưa hoàn thành nhiệm vụ

export type Department = 
  | 'Tổ Toán'
  | 'Tổ Văn - GDKTPL'
  | 'Tổ Hoá - Sinh'
  | 'Tổ Sử - Địa - Anh Văn'
  | 'Tổ Lý - TD - QP'
  | 'Tổ Tin - Công nghệ'
  | 'Tổ Văn Phòng';

export interface DepartmentInfo {
  id: string;
  name: string;
  headTeacherId?: string;
  headTeacherName?: string;
  deputyHeadTeacherId?: string;
  deputyHeadTeacherName?: string;
  description?: string;
}

export interface AwardPointRule {
  id: string;
  level: 'Cấp Trường' | 'Cấp Xã (Cụm Trường)' | 'Cấp Tỉnh / Thành phố' | 'Cấp Quốc Gia';
  awardName: 'Giải Nhất' | 'Giải Nhì' | 'Giải Ba' | 'Giải Khuyến Khích' | 'Đạt giải / Giấy khen' | 'Bằng khen cấp Bộ/Tỉnh';
  points: number;
}

export type ApprovalStatus2Layer = 'PENDING_HEAD' | 'PENDING_PRINCIPAL' | 'APPROVED' | 'REJECTED';
export type DeclarationType = 'BONUS_AWARD' | 'PENALTY_INFRACTION';

export interface SelfDeclarationRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  department: string;
  type: DeclarationType;
  title: string; // Tên phong trào / Nội dung vi phạm hay hạn chế
  categoryOrLevel: 'Cấp Trường' | 'Cấp Xã (Cụm Trường)' | 'Cấp Tỉnh / Thành phố' | 'Cấp Quốc Gia' | 'Vi phạm nếp sống / Kỷ luật' | 'Chỉ tiêu chuyên môn chưa đạt';
  awardNameOrInfraction: string; // e.g. Giải Nhất, Giải Nhì OR Vắng trễ, Chậm nộp giáo án, Chưa đạt tỉ lệ tốt nghiệp
  suggestedPoints: number; // e.g. +5.0 or -2.0
  evidenceUrlOrDesc: string; // Minh chứng đính kèm / Bản tự kiểm điểm
  submittedAt: string;
  status: ApprovalStatus2Layer;
  headApproval?: {
    approvedBy: string;
    approvedAt: string;
    comment?: string;
  };
  principalApproval?: {
    approvedBy: string;
    approvedAt: string;
    comment?: string;
  };
}

export interface EmulationMovement {
  id: string;
  title: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
  awardRules: AwardPointRule[];
}

export interface MovementParticipation {
  id: string;
  movementId: string;
  movementTitle: string;
  teacherId: string;
  teacherName: string;
  department: string;
  level: string;
  awardName: string;
  pointsEarned: number;
  recordedDate: string;
  note?: string;
}

export interface AttendanceRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  department: string;
  date: string;
  type: 'DI_TRE' | 'VANG_CO_PHEP' | 'VANG_KHONG_PHEP' | 'VE_SOM' | 'BO_TIET';
  minutesLate?: number;
  reason: string;
  deductPoints: number;
  recordedBy: string;
  timestamp: string;
}

export interface EvaluationCriteria {
  id: string;
  category: 'chuyen_mon' | 'dao_duc_ky_luat' | 'doi_moi_cntt' | 'thi_dua_phong_trao';
  title: string;
  description: string;
  maxScore: number;
  weightPercent: number; // Trong ma trận trọng số hiện tại
  moetCode: string; // Mã tiêu chuẩn theo Thông tư/Nghị định 90/2020
}

export interface PassiveLog {
  id: string;
  teacherId: string;
  type: 'PENALTY' | 'BONUS';
  source: 'SO_DAU_BAI' | 'MAY_CHAM_CONG' | 'HE_THONG_GIAO_AN' | 'KHEN_THUONG_HSG' | 'GOOGLE_SHEETS_SYNC';
  title: string;
  description: string;
  points: number; // e.g. -2.5 or +5.0
  timestamp: string;
  verified: boolean;
}

export interface EvidenceItem {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'PDF' | 'LINK' | 'CERTIFICATE';
  uploadedAt: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface EvaluationScore {
  criteriaId: string;
  selfScore: number;
  headScore: number;
  principalScore: number;
  comments?: string;
}

export interface TeacherEvaluation {
  id: string;
  teacherId: string;
  period: string; // e.g. "Học kỳ I - 2025-2026" or "Tháng 11/2025"
  status: 'DRAFT' | 'SELF_SUBMITTED' | 'HEAD_REVIEWED' | 'APPROVED' | 'APPEALED';
  scores: Record<string, EvaluationScore>; // key: criteriaId
  passivePointsTotal: number;
  finalScore: number;
  classification: AssessmentClassification;
  isAnomaly: boolean;
  anomalyReason?: string;
  selfSubmittedAt?: string;
  headApprovedAt?: string;
  principalApprovedAt?: string;
  digitalSignature?: {
    signedBy: string;
    timestamp: string;
    hash: string;
    otpVerified: boolean;
  };
}

export interface SkillDimensionScore {
  dimensionName: string;
  score: number; // 0 to 100
  benchmarkScore: number; // Target benchmark (e.g. 85)
}

export interface Teacher {
  id: string;
  code: string; // e.g. "GV001"
  fullName: string;
  email: string;
  avatar: string;
  department: Department;
  position: 'Hiệu trưởng' | 'Phó Hiệu trưởng' | 'Tổ trưởng chuyên môn' | 'Tổ phó chuyên môn' | 'Giáo viên THPT' | 'Nhân viên Văn phòng' | 'Hợp đồng lao động' | string;
  titleGrade: 'Giáo viên THPT Hạng I' | 'Giáo viên THPT Hạng II' | 'Giáo viên THPT Hạng III';
  yearsOfTeaching: number;
  phone: string;
  currentEvaluation?: TeacherEvaluation;
  skillDimensions: SkillDimensionScore[];
  performanceTrend: { period: string; score: number }[];
  evidences: EvidenceItem[];
  passiveLogs: PassiveLog[];
  idpPlan?: IDPPlan;
}

export interface IDPGoal {
  id: string;
  skillGapArea: string;
  targetGoal: string;
  actionSteps: string[];
  recommendedCourses: {
    title: string;
    platform: string;
    duration: string;
    url?: string;
  }[];
  deadline: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface IDPPlan {
  id: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: string[];
  goals: IDPGoal[];
  aiCoachingAdvice: string;
}

export interface WeightMatrix {
  id: string;
  name: string;
  chuyenMonWeight: number; // e.g. 40%
  daoDucWeight: number; // e.g. 20%
  doiMoiCnttWeight: number; // e.g. 20%
  thiDuaWeight: number; // e.g. 20%
  isActive: boolean;
  effectiveFrom: string;
  note: string;
}

export interface SandboxSimulationResult {
  teacherId: string;
  teacherName: string;
  department: Department;
  oldScore: number;
  oldClassification: AssessmentClassification;
  newScore: number;
  newClassification: AssessmentClassification;
  changed: boolean;
  scoreDiff: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetTeacherName: string;
  details: string;
  ipAddress: string;
  signedHash?: string;
}

export interface AppealDispute {
  id: string;
  teacherId: string;
  teacherName: string;
  evaluationId: string;
  reason: string;
  attachedEvidences: string[];
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  submittedAt: string;
  responseNote?: string;
}
