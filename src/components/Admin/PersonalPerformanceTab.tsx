import React, { useState, useMemo } from 'react';
import { 
  PerformanceCriterionRule, 
  TeacherPerformanceRecord, 
  Teacher, 
  PassiveLog,
  PerformanceCriterionCategory,
  PerformanceCriterionType,
  PerformanceCalculationMode
} from '../../types';
import { 
  Zap, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  SlidersHorizontal, 
  UserCheck, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Download, 
  Users,
  Target,
  Percent
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface PersonalPerformanceTabProps {
  performanceRules: PerformanceCriterionRule[];
  setPerformanceRules: React.Dispatch<React.SetStateAction<PerformanceCriterionRule[]>>;
  performanceRecords: TeacherPerformanceRecord[];
  setPerformanceRecords: React.Dispatch<React.SetStateAction<TeacherPerformanceRecord[]>>;
  teachers: Teacher[];
  onAddPassiveLog: (teacherId: string, log: PassiveLog) => void;
  onAddAuditLog: (action: string, targetName: string, details: string) => void;
  academicYear?: string;
  period?: string;
}

const CATEGORY_MAP: Record<PerformanceCriterionCategory, { label: string; color: string; bg: string; border: string }> = {
  CHUYEN_MON: { 
    label: 'Chuyên Môn & Học Lực', 
    color: 'text-blue-700', 
    bg: 'bg-blue-50', 
    border: 'border-blue-200' 
  },
  CHU_NHIEM_HOP_PH: { 
    label: 'Chủ Nhiệm & Họp PH', 
    color: 'text-amber-700', 
    bg: 'bg-amber-50', 
    border: 'border-amber-200' 
  },
  DOAN_THE_BHYT: { 
    label: 'Đoàn Thể & BHYT', 
    color: 'text-emerald-700', 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200' 
  },
  KIEM_NHIEM: { 
    label: 'Kiêm Nhiệm Chức Vụ', 
    color: 'text-purple-700', 
    bg: 'bg-purple-50', 
    border: 'border-purple-200' 
  },
  VI_PHAM_KHAC: { 
    label: 'Vi Phạm & Kỷ Luật Khác', 
    color: 'text-rose-700', 
    bg: 'bg-rose-50', 
    border: 'border-rose-200' 
  },
  CUSTOM: { 
    label: 'Tiêu Chí Tùy Chỉnh', 
    color: 'text-slate-700', 
    bg: 'bg-slate-50', 
    border: 'border-slate-200' 
  },
};

export const PersonalPerformanceTab: React.FC<PersonalPerformanceTabProps> = ({
  performanceRules,
  setPerformanceRules,
  performanceRecords,
  setPerformanceRecords,
  teachers,
  onAddPassiveLog,
  onAddAuditLog,
  academicYear = '2026 - 2027',
  period = 'Học kỳ I'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'rules' | 'records'>('rules');

  // Search & Filter State
  const [ruleSearchQuery, setRuleSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  const [recordSearchQuery, setRecordSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedRecordTypeFilter, setSelectedRecordTypeFilter] = useState<string>('ALL');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Rule Modal State (Create / Edit)
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PerformanceCriterionRule | null>(null);
  const [ruleForm, setRuleForm] = useState({
    title: '',
    category: 'CHUYEN_MON' as PerformanceCriterionCategory,
    type: 'PENALTY' as PerformanceCriterionType,
    calcMode: 'PERCENTAGE' as PerformanceCalculationMode,
    basePoints: 1.5,
    unitLabel: '% thiếu',
    description: '',
    standardTarget: '',
    penaltyRateFormula: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  // Record Point Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordForm, setRecordForm] = useState({
    teacherId: teachers[0]?.id || '',
    criterionId: performanceRules[0]?.id || '',
    metricValue: '',
    pointsAdjusted: 2.0,
    academicYear: academicYear,
    period: period,
    reasonOrEvidence: '',
    calcActualRate: 80,
    calcOccurrences: 1,
  });

  // Open Create/Edit Rule Modal
  const handleOpenRuleModal = (rule?: PerformanceCriterionRule) => {
    if (rule) {
      setEditingRule(rule);
      setRuleForm({
        title: rule.title,
        category: rule.category,
        type: rule.type,
        calcMode: rule.calcMode,
        basePoints: Math.abs(rule.basePoints),
        unitLabel: rule.unitLabel || '',
        description: rule.description,
        standardTarget: rule.standardTarget || '',
        penaltyRateFormula: rule.penaltyRateFormula || '',
        status: rule.status,
      });
    } else {
      setEditingRule(null);
      setRuleForm({
        title: '',
        category: 'CHUYEN_MON',
        type: 'PENALTY',
        calcMode: 'PERCENTAGE',
        basePoints: 1.5,
        unitLabel: '% chưa đạt',
        description: '',
        standardTarget: 'Đạt 100% chỉ tiêu giao',
        penaltyRateFormula: 'Thiếu dưới 10%: -1.0đ; Thiếu 10-20%: -2.0đ; Thiếu > 20%: -3.0đ',
        status: 'ACTIVE',
      });
    }
    setIsRuleModalOpen(true);
  };

  // Save Rule (Create or Update)
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleForm.title.trim()) {
      alert('Vui lòng nhập tên tiêu chí!');
      return;
    }

    const calculatedBasePoints = ruleForm.type === 'PENALTY' ? -Math.abs(ruleForm.basePoints) : Math.abs(ruleForm.basePoints);

    if (editingRule) {
      setPerformanceRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                ...ruleForm,
                basePoints: calculatedBasePoints,
              }
            : r
        )
      );
      onAddAuditLog('CẬP NHẬT TIÊU CHÍ HIỆU SUẤT', ruleForm.title, `Đã cập nhật quy định: ${ruleForm.title}`);
      showToast(`Đã cập nhật tiêu chí hiệu suất "${ruleForm.title}"!`);
    } else {
      const newRule: PerformanceCriterionRule = {
        id: `perf_crit_${Date.now()}`,
        ...ruleForm,
        basePoints: calculatedBasePoints,
      };
      setPerformanceRules((prev) => [newRule, ...prev]);
      onAddAuditLog('TẠO TIÊU CHÍ HIỆU SUẤT MỚI', ruleForm.title, `Đã tạo tiêu chí hiệu suất mới: ${ruleForm.title} (${ruleForm.type === 'BONUS' ? '+' : '-'}${Math.abs(ruleForm.basePoints)}đ)`);
      showToast(`Đã tạo tiêu chí hiệu suất mới "${ruleForm.title}"!`);
    }
    setIsRuleModalOpen(false);
  };

  // Delete Rule
  const handleDeleteRule = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tiêu chí hiệu suất "${title}"?`)) {
      setPerformanceRules((prev) => prev.filter((r) => r.id !== id));
      onAddAuditLog('XÓA TIÊU CHÍ HIỆU SUẤT', title, `Đã xóa tiêu chí hiệu suất: ${title}`);
      showToast(`Đã xóa tiêu chí "${title}"!`);
    }
  };

  // Toggle Rule Status (ACTIVE / INACTIVE)
  const handleToggleRuleStatus = (rule: PerformanceCriterionRule) => {
    const newStatus = rule.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setPerformanceRules((prev) =>
      prev.map((r) => (r.id === rule.id ? { ...r, status: newStatus } : r))
    );
    showToast(`Đã chuyển trạng thái tiêu chí sang ${newStatus === 'ACTIVE' ? 'Đang áp dụng' : 'Tạm ngưng'}!`);
  };

  // Open Record Modal
  const handleOpenRecordModal = (preselectedRuleId?: string, preselectedTeacherId?: string) => {
    const activeRules = performanceRules.filter((r) => r.status === 'ACTIVE');
    const selectedRule = activeRules.find((r) => r.id === preselectedRuleId) || activeRules[0] || performanceRules[0];
    const initialTeacher = teachers.find((t) => t.id === preselectedTeacherId) || teachers[0];

    const defaultPoints = selectedRule ? selectedRule.basePoints : 1.0;

    setRecordForm({
      teacherId: initialTeacher?.id || '',
      criterionId: selectedRule?.id || '',
      metricValue: selectedRule?.standardTarget || '',
      pointsAdjusted: defaultPoints,
      academicYear: academicYear,
      period: period,
      reasonOrEvidence: '',
      calcActualRate: 85,
      calcOccurrences: 1,
    });
    setIsRecordModalOpen(true);
  };

  // Handle smart calculation update when criterion or metric inputs change
  const handleCriterionChangeInRecordModal = (newCritId: string) => {
    const rule = performanceRules.find((r) => r.id === newCritId);
    if (!rule) return;

    let suggestedPoints = rule.basePoints;
    let suggestedMetric = rule.standardTarget || '';

    if (rule.calcMode === 'PER_OCCURRENCE') {
      suggestedPoints = rule.basePoints * (recordForm.calcOccurrences || 1);
      suggestedMetric = `Số lượng: ${recordForm.calcOccurrences || 1} ${rule.unitLabel || 'lần'}`;
    }

    setRecordForm({
      ...recordForm,
      criterionId: newCritId,
      pointsAdjusted: suggestedPoints,
      metricValue: suggestedMetric,
    });
  };

  // Save Performance Record
  const handleSavePerformanceRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === recordForm.teacherId);
    const rule = performanceRules.find((r) => r.id === recordForm.criterionId);

    if (!teacher || !rule) {
      alert('Vui lòng chọn đầy đủ Giáo viên và Tiêu chí hiệu suất!');
      return;
    }

    const points = parseFloat(Number(recordForm.pointsAdjusted).toFixed(1));

    const newRecord: TeacherPerformanceRecord = {
      id: `perf_rec_${Date.now()}`,
      criterionId: rule.id,
      criterionTitle: rule.title,
      category: rule.category,
      type: points >= 0 ? 'BONUS' : 'PENALTY',
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      department: teacher.department,
      metricValue: recordForm.metricValue || rule.title,
      pointsAdjusted: points,
      recordedDate: new Date().toISOString().split('T')[0],
      academicYear: recordForm.academicYear,
      period: recordForm.period,
      reasonOrEvidence: recordForm.reasonOrEvidence || 'Ghi nhận theo quy định đánh giá hiệu suất cá nhân.',
      recordedBy: 'Ban Giám Hiệu',
    };

    setPerformanceRecords((prev) => [newRecord, ...prev]);

    // Automatically push to PassiveLog & update teacher total score
    const newLog: PassiveLog = {
      id: `pl_perf_${Date.now()}`,
      teacherId: teacher.id,
      type: points >= 0 ? 'BONUS' : 'PENALTY',
      source: 'MAY_CHAM_CONG',
      title: `${rule.title} (${points >= 0 ? '+' : ''}${points}đ)`,
      description: `${recordForm.metricValue ? recordForm.metricValue + '. ' : ''}${recordForm.reasonOrEvidence || ''}`,
      points: points,
      timestamp: new Date().toLocaleString('vi-VN'),
      verified: true,
    };

    onAddPassiveLog(teacher.id, newLog);

    onAddAuditLog(
      'GHI NHẬN ĐIỂM HIỆU SUẤT CÁ NHÂN',
      teacher.fullName,
      `${points >= 0 ? 'Cộng' : 'Trừ'} ${points}đ theo tiêu chí "${rule.title}". Căn cứ: ${recordForm.metricValue || 'Quy định hiệu suất'}.`
    );

    showToast(`Đã ghi nhận ${points >= 0 ? '+' : ''}${points}đ hiệu suất cho thầy/cô ${teacher.fullName}!`);
    setIsRecordModalOpen(false);
  };

  // Delete Performance Record
  const handleDeleteRecord = (record: TeacherPerformanceRecord) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bản ghi điểm hiệu suất của giáo viên "${record.teacherName}"?`)) {
      setPerformanceRecords((prev) => prev.filter((r) => r.id !== record.id));
      
      // Rollback points via an inverse passive log
      const rollbackLog: PassiveLog = {
        id: `pl_roll_${Date.now()}`,
        teacherId: record.teacherId,
        type: record.pointsAdjusted >= 0 ? 'PENALTY' : 'BONUS',
        source: 'MAY_CHAM_CONG',
        title: `Hủy ghi nhận: ${record.criterionTitle}`,
        description: `Hoàn trả lại điểm đã ghi nhận trước đó (${record.pointsAdjusted}đ).`,
        points: -record.pointsAdjusted,
        timestamp: new Date().toLocaleString('vi-VN'),
        verified: true,
      };
      onAddPassiveLog(record.teacherId, rollbackLog);

      onAddAuditLog(
        'HỦY BẢN GHI HIỆU SUẤT',
        record.teacherName,
        `Đã hủy ghi nhận ${record.criterionTitle} (${record.pointsAdjusted}đ)`
      );
      showToast(`Đã xóa bản ghi & hoàn trả điểm cho ${record.teacherName}!`);
    }
  };

  // Export Records to Excel
  const handleExportExcel = () => {
    if (performanceRecords.length === 0) {
      alert('Chưa có dữ liệu bản ghi điểm hiệu suất để xuất file!');
      return;
    }

    const dataToExport = performanceRecords.map((r, idx) => ({
      'STT': idx + 1,
      'Họ và Tên Giáo Viên': r.teacherName,
      'Tổ Chuyên Môn': r.department,
      'Tiêu Chí Hiệu Suất': r.criterionTitle,
      'Nhóm Tiêu Chí': CATEGORY_MAP[r.category]?.label || r.category,
      'Loại': r.type === 'BONUS' ? 'Cộng Điểm (+)' : 'Trừ Điểm (-)',
      'Điểm Cộng / Trừ': r.pointsAdjusted,
      'Thông Số / Tỉ Lệ / Diễn Giải': r.metricValue || '',
      'Căn Cứ / Minh Chứng': r.reasonOrEvidence || '',
      'Năm Học': r.academicYear,
      'Học Kỳ': r.period,
      'Ngày Ghi Nhận': r.recordedDate,
      'Người Ghi Nhận': r.recordedBy,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HieuSuatCaNhan');
    XLSX.writeFile(wb, `Hieu_Suat_Ca_Nhan_${academicYear.replace(/\s+/g, '')}_${period.replace(/\s+/g, '')}.xlsx`);
    showToast('Đã xuất file Excel thành công!');
  };

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return performanceRules.filter((r) => {
      const matchSearch = r.title.toLowerCase().includes(ruleSearchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(ruleSearchQuery.toLowerCase()) ||
        (r.standardTarget && r.standardTarget.toLowerCase().includes(ruleSearchQuery.toLowerCase()));
      
      const matchCategory = selectedCategoryFilter === 'ALL' || r.category === selectedCategoryFilter;
      const matchType = selectedTypeFilter === 'ALL' || r.type === selectedTypeFilter;

      return matchSearch && matchCategory && matchType;
    });
  }, [performanceRules, ruleSearchQuery, selectedCategoryFilter, selectedTypeFilter]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return performanceRecords.filter((rec) => {
      const matchSearch = rec.teacherName.toLowerCase().includes(recordSearchQuery.toLowerCase()) ||
        rec.criterionTitle.toLowerCase().includes(recordSearchQuery.toLowerCase()) ||
        (rec.metricValue && rec.metricValue.toLowerCase().includes(recordSearchQuery.toLowerCase())) ||
        (rec.reasonOrEvidence && rec.reasonOrEvidence.toLowerCase().includes(recordSearchQuery.toLowerCase()));
      
      const matchDept = selectedDeptFilter === 'ALL' || rec.department === selectedDeptFilter;
      const matchType = selectedRecordTypeFilter === 'ALL' || rec.type === selectedRecordTypeFilter;

      return matchSearch && matchDept && matchType;
    });
  }, [performanceRecords, recordSearchQuery, selectedDeptFilter, selectedRecordTypeFilter]);

  // KPI Statistics
  const totalBonusPoints = performanceRecords
    .filter((r) => r.pointsAdjusted > 0)
    .reduce((acc, curr) => acc + curr.pointsAdjusted, 0);

  const totalPenaltyPoints = performanceRecords
    .filter((r) => r.pointsAdjusted < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.pointsAdjusted), 0);

  const uniqueTeachersCount = new Set(performanceRecords.map((r) => r.teacherId)).size;

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-teal-400/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Phân Hệ Quản Trị Hiệu Suất
            </span>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-400/30">
              Điểm Cộng & Điểm Trừ Tùy Biến
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Quản Lý Hiệu Suất Cá Nhân & Điểm Mở Rộng
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Thiết lập tiêu chí và công thức tính điểm linh hoạt theo nhu cầu trường học: trừ điểm không đạt chỉ tiêu chuyên môn, thiếu tỉ lệ họp phụ huynh, cộng điểm vận động BHYT học sinh, kiêm nhiệm chức vụ, trừ vi phạm nếp sống & sổ sách khác.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleOpenRuleModal()}
            className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Tiêu Chí Mới</span>
          </button>

          <button
            onClick={() => handleOpenRecordModal()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Ghi Nhận Điểm GV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Tổng Tiêu Chí Áp Dụng</div>
            <div className="text-xl font-bold text-slate-900">
              {performanceRules.filter((r) => r.status === 'ACTIVE').length} / {performanceRules.length}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Tổng Điểm Thưởng Đã Cộng</div>
            <div className="text-xl font-bold text-emerald-600">
              +{totalBonusPoints.toFixed(1)}đ
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Tổng Điểm Phạt Đã Trừ</div>
            <div className="text-xl font-bold text-rose-600">
              -{totalPenaltyPoints.toFixed(1)}đ
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold uppercase">GV Được Ghi Nhận</div>
            <div className="text-xl font-bold text-indigo-600">
              {uniqueTeachersCount} <span className="text-xs text-slate-400 font-normal">({performanceRecords.length} lượt)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtab Buttons */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('rules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'rules'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Danh Mục Tiêu Chí & Mức Điểm ({performanceRules.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('records')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'records'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Lịch Sử & Ghi Nhận Điểm GV ({performanceRecords.length})</span>
          </button>
        </div>

        {activeSubTab === 'records' && (
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>
        )}
      </div>

      {/* SUBTAB 1: PERFORMANCE RULES LIST */}
      {activeSubTab === 'rules' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm tiêu chí hiệu suất, công thức, chỉ tiêu..."
                value={ruleSearchQuery}
                onChange={(e) => setRuleSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 overflow-x-auto">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
              >
                <option value="ALL">Tất cả nhóm tiêu chí</option>
                <option value="CHUYEN_MON">Chuyên Môn & Học Lực</option>
                <option value="CHU_NHIEM_HOP_PH">Chủ Nhiệm & Họp PH</option>
                <option value="DOAN_THE_BHYT">Đoàn Thể & BHYT</option>
                <option value="KIEM_NHIEM">Kiêm Nhiệm Chức Vụ</option>
                <option value="VI_PHAM_KHAC">Vi Phạm & Kỷ Luật Khác</option>
                <option value="CUSTOM">Tiêu Chí Tùy Chỉnh</option>
              </select>

              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
              >
                <option value="ALL">Tất cả hình thức</option>
                <option value="BONUS">Điểm Cộng (+)</option>
                <option value="PENALTY">Điểm Trừ (-)</option>
              </select>
            </div>
          </div>

          {/* Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map((rule) => {
              const catInfo = CATEGORY_MAP[rule.category] || CATEGORY_MAP.CUSTOM;
              const isPenalty = rule.type === 'PENALTY';

              return (
                <div
                  key={rule.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between ${
                    rule.status === 'ACTIVE'
                      ? 'border-slate-200 hover:border-teal-400 hover:shadow-md'
                      : 'border-slate-200 opacity-60 bg-slate-50/60'
                  }`}
                >
                  <div>
                    {/* Card Header: Category & Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${catInfo.bg} ${catInfo.color} ${catInfo.border}`}>
                        {catInfo.label}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isPenalty ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isPenalty ? '- TRỪ ĐIỂM' : '+ CỘNG ĐIỂM'}
                        </span>

                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                          {rule.calcMode === 'PERCENTAGE' ? 'Theo tỉ lệ %' : (rule.calcMode === 'PER_OCCURRENCE' ? 'Theo số lần' : 'Cố định')}
                        </span>
                      </div>
                    </div>

                    {/* Title & Score */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {rule.title}
                      </h3>
                      <div className={`text-base font-extrabold shrink-0 px-2.5 py-1 rounded-xl border ${
                        isPenalty ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {isPenalty ? '-' : '+'}{Math.abs(rule.basePoints)}đ
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {rule.description}
                    </p>

                    {/* Standard Target & Formula Box */}
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1.5 text-xs text-slate-700 mb-4">
                      {rule.standardTarget && (
                        <div className="flex items-start gap-1.5">
                          <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span className="font-semibold text-slate-800">
                            Chỉ tiêu chuẩn: <span className="font-normal text-slate-600">{rule.standardTarget}</span>
                          </span>
                        </div>
                      )}

                      {rule.penaltyRateFormula && (
                        <div className="flex items-start gap-1.5">
                          <Percent className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span className="font-semibold text-slate-800">
                            Thang điểm: <span className="font-normal text-slate-600">{rule.penaltyRateFormula}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleRuleStatus(rule)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        rule.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {rule.status === 'ACTIVE' ? '✓ Đang áp dụng' : '⏸ Tạm ngưng'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenRecordModal(rule.id)}
                        className="flex items-center gap-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        title="Ghi nhận điểm tiêu chí này cho giáo viên"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Áp dụng cho GV</span>
                      </button>

                      <button
                        onClick={() => handleOpenRuleModal(rule)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                        title="Sửa tiêu chí"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteRule(rule.id, rule.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Xóa tiêu chí"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: TEACHER PERFORMANCE RECORDS */}
      {activeSubTab === 'records' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm tên giáo viên, tiêu chí, diễn giải số liệu..."
                value={recordSearchQuery}
                onChange={(e) => setRecordSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
              >
                <option value="ALL">Tất cả Tổ chuyên môn</option>
                <option value="Tổ Toán">Tổ Toán</option>
                <option value="Tổ Văn - GDKTPL">Tổ Văn - GDKTPL</option>
                <option value="Tổ Hoá - Sinh">Tổ Hoá - Sinh</option>
                <option value="Tổ Sử - Địa - Anh Văn">Tổ Sử - Địa - Anh Văn</option>
                <option value="Tổ Lý - TD - QP">Tổ Lý - TD - QP</option>
                <option value="Tổ Tin - Công nghệ">Tổ Tin - Công nghệ</option>
                <option value="Tổ Văn Phòng">Tổ Văn Phòng</option>
              </select>

              <select
                value={selectedRecordTypeFilter}
                onChange={(e) => setSelectedRecordTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
              >
                <option value="ALL">Tất cả loại điểm</option>
                <option value="BONUS">Điểm Thưởng (+)</option>
                <option value="PENALTY">Điểm Trừ / Phạt (-)</option>
              </select>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Giáo Viên & Tổ</th>
                  <th className="py-3 px-3">Tiêu Chí Hiệu Suất</th>
                  <th className="py-3 px-3">Nhóm Tiêu Chí</th>
                  <th className="py-3 px-3">Thông Số / Diễn Giải</th>
                  <th className="py-3 px-3 text-right">Điểm Áp Dụng</th>
                  <th className="py-3 px-3">Căn Cứ / Quyết Định</th>
                  <th className="py-3 px-3">Ngày Ghi</th>
                  <th className="py-3 px-3 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                      Không tìm thấy bản ghi điểm hiệu suất nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => {
                    const isPenalty = rec.pointsAdjusted < 0;
                    const catInfo = CATEGORY_MAP[rec.category] || CATEGORY_MAP.CUSTOM;

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{rec.teacherName}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{rec.department}</div>
                        </td>

                        <td className="py-3 px-3 max-w-xs font-semibold text-slate-800">
                          {rec.criterionTitle}
                        </td>

                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catInfo.bg} ${catInfo.color} ${catInfo.border}`}>
                            {catInfo.label}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-700 font-medium">
                          {rec.metricValue || '—'}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <span className={`font-extrabold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${
                            isPenalty 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {isPenalty ? '' : '+'}{rec.pointsAdjusted}đ
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={rec.reasonOrEvidence}>
                          {rec.reasonOrEvidence || 'Ghi nhận theo quy chế nhà trường'}
                        </td>

                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {rec.recordedDate}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleDeleteRecord(rec)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                            title="Xóa bản ghi & hoàn trả điểm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT RULE MODAL */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-slate-900 mb-1 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-teal-600" />
              {editingRule ? 'Cập Nhật Tiêu Chí Hiệu Suất' : 'Tạo Tiêu Chí Hiệu Suất Mới'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Thiết lập quy tắc cộng hoặc trừ điểm linh hoạt cho các chỉ tiêu chuyên môn, chủ nhiệm, BHYT, kiêm nhiệm hoặc vi phạm.
            </p>

            <form onSubmit={handleSaveRule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Tiêu Chí / Nội Dung Hiệu Suất (*)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thiếu tỉ lệ phụ huynh tham gia họp lớp, Vận động 100% BHYT..."
                  value={ruleForm.title}
                  onChange={(e) => setRuleForm({ ...ruleForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nhóm Tiêu Chí</label>
                  <select
                    value={ruleForm.category}
                    onChange={(e) => setRuleForm({ ...ruleForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  >
                    <option value="CHUYEN_MON">Chuyên Môn & Học Lực</option>
                    <option value="CHU_NHIEM_HOP_PH">Chủ Nhiệm & Họp PH</option>
                    <option value="DOAN_THE_BHYT">Đoàn Thể & BHYT</option>
                    <option value="KIEM_NHIEM">Kiêm Nhiệm Chức Vụ</option>
                    <option value="VI_PHAM_KHAC">Vi Phạm & Kỷ Luật Khác</option>
                    <option value="CUSTOM">Tiêu Chí Tùy Chỉnh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hình Thức Điểm</label>
                  <select
                    value={ruleForm.type}
                    onChange={(e) => setRuleForm({ ...ruleForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="BONUS">➕ Cộng Điểm Thưởng</option>
                    <option value="PENALTY">➖ Trừ Điểm Phạt</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phương Thức Tính</label>
                  <select
                    value={ruleForm.calcMode}
                    onChange={(e) => setRuleForm({ ...ruleForm, calcMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="PERCENTAGE">Theo Tỉ Lệ %</option>
                    <option value="PER_OCCURRENCE">Theo Số Lần / Lượt</option>
                    <option value="FIXED">Điểm Cố Định</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức Điểm Cơ Sở</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="50"
                    required
                    value={ruleForm.basePoints}
                    onChange={(e) => setRuleForm({ ...ruleForm, basePoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Đơn Vị Tính</label>
                  <input
                    type="text"
                    placeholder="VD: % thiếu, lần, chức vụ"
                    value={ruleForm.unitLabel}
                    onChange={(e) => setRuleForm({ ...ruleForm, unitLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chỉ Tiêu Chuẩn / Yêu Cầu Đạt</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Sĩ số phụ huynh dự họp >= 85%, Đạt 100% BHYT..."
                  value={ruleForm.standardTarget}
                  onChange={(e) => setRuleForm({ ...ruleForm, standardTarget: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Công Thức / Thang Điểm Chi Tiết</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Thiếu 5-10%: -1.0đ; Thiếu 10-20%: -2.0đ; Thiếu > 20%: -3.0đ..."
                  value={ruleForm.penaltyRateFormula}
                  onChange={(e) => setRuleForm({ ...ruleForm, penaltyRateFormula: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Hướng Dẫn Áp Dụng</label>
                <textarea
                  rows={2}
                  placeholder="Căn cứ quy chế, hướng dẫn kiểm tra và trách nhiệm của giáo viên..."
                  value={ruleForm.description}
                  onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  {editingRule ? 'Lưu Cập Nhật' : 'Tạo Tiêu Chí'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PERFORMANCE TO TEACHER MODAL */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-600" />
              Ghi Nhận Điểm Hiệu Suất Cho Giáo Viên
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Điểm cộng hoặc trừ sẽ tự động cập nhật vào Sổ Thu Thập Thụ Động và Bảng Đánh Giá 360°.
            </p>

            <form onSubmit={handleSavePerformanceRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Giáo Viên (*)</label>
                <select
                  value={recordForm.teacherId}
                  onChange={(e) => setRecordForm({ ...recordForm, teacherId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.department}) — Mã: {t.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Tiêu Chí Hiệu Suất (*)</label>
                <select
                  value={recordForm.criterionId}
                  onChange={(e) => handleCriterionChangeInRecordModal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  {performanceRules
                    .filter((r) => r.status === 'ACTIVE')
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        [{r.type === 'BONUS' ? '+' : '-'}{Math.abs(r.basePoints)}đ] {r.title} ({CATEGORY_MAP[r.category]?.label || r.category})
                      </option>
                    ))}
                </select>
              </div>

              {/* Dynamic Formula Display for selected rule */}
              {(() => {
                const selectedRule = performanceRules.find((r) => r.id === recordForm.criterionId);
                if (!selectedRule) return null;

                return (
                  <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3 text-xs text-teal-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-teal-700" />
                      Chỉ tiêu chuẩn: {selectedRule.standardTarget || 'Theo quy định'}
                    </div>
                    {selectedRule.penaltyRateFormula && (
                      <div className="text-[11px] text-teal-800">
                        <strong>Thang tính điểm:</strong> {selectedRule.penaltyRateFormula}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thông Số Thực Tế / Diễn Giải (*)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Sĩ số dự họp đạt 68% (thiếu 17%), 100% BHYT đúng hạn, Kiêm nhiệm TTCM..."
                  value={recordForm.metricValue}
                  onChange={(e) => setRecordForm({ ...recordForm, metricValue: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Điểm Áp Dụng (+ / - Điểm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={recordForm.pointsAdjusted}
                    onChange={(e) => setRecordForm({ ...recordForm, pointsAdjusted: Number(e.target.value) })}
                    className={`w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold ${
                      recordForm.pointsAdjusted >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Nhập dấu (-) nếu là điểm phạt</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Đợt Đánh Giá</label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                    {recordForm.academicYear} • {recordForm.period}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Căn Cứ / Số Quyết Định / Biên Bản</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Biên bản họp PH ngày 15/10, Báo cáo Y tế học đường..."
                  value={recordForm.reasonOrEvidence}
                  onChange={(e) => setRecordForm({ ...recordForm, reasonOrEvidence: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  Ghi Nhận & Đồng Bộ Điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
