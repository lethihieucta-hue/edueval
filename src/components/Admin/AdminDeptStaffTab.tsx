import React, { useState } from 'react';
import { Teacher, Department, DepartmentInfo } from '../../types';
import { 
  Building2, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  CheckCircle2, 
  UserPlus, 
  Shield, 
  Award, 
  Phone, 
  Mail, 
  Sparkles,
  ChevronRight,
  Filter,
  FileSpreadsheet,
  Download,
  Upload,
  AlertTriangle,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { isCorruptedTeacher, cleanTeachersList } from '../../utils/sanitizer';
import { exportTeachersToExcel } from '../../services/excelService';
import { MOCK_TEACHERS } from '../../data/mockData';

interface AdminDeptStaffTabProps {
  departments: DepartmentInfo[];
  setDepartments: React.Dispatch<React.SetStateAction<DepartmentInfo[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  onAddAuditLog: (action: string, targetName: string, details: string) => void;
  onOpenTemplateModal?: () => void;
}

export const AdminDeptStaffTab: React.FC<AdminDeptStaffTabProps> = ({
  departments,
  setDepartments,
  teachers,
  setTeachers,
  onAddAuditLog,
  onOpenTemplateModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'departments' | 'staff'>('staff');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('Tất cả Tổ chuyên môn');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Department Modal State
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentInfo | null>(null);
  const [deptForm, setDeptForm] = useState({ name: '', headTeacherName: '', description: '' });

  // Staff Modal State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    code: '',
    fullName: '',
    email: '',
    phone: '',
    department: 'Tổ Toán' as Department,
    position: 'Giáo viên THPT' as Teacher['position'],
    titleGrade: 'Giáo viên THPT Hạng II' as Teacher['titleGrade'],
    yearsOfTeaching: 5,
    avatar: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch = 
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDeptFilter === 'Tất cả Tổ chuyên môn' || t.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  // Handle Department CRUD
  const handleOpenDeptModal = (dept?: DepartmentInfo) => {
    if (dept) {
      setEditingDept(dept);
      setDeptForm({ name: dept.name, headTeacherName: dept.headTeacherName || '', description: dept.description || '' });
    } else {
      setEditingDept(null);
      setDeptForm({ name: '', headTeacherName: '', description: '' });
    }
    setIsDeptModalOpen(true);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name.trim()) return;

    if (editingDept) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === editingDept.id ? { ...d, ...deptForm } : d))
      );
      onAddAuditLog('CẬP NHẬT TỔ CHUYÊN MÔN', deptForm.name, `Đã cập nhật thông tin ${deptForm.name}`);
      showToast(`Đã cập nhật thông tin ${deptForm.name} thành công!`);
    } else {
      const newDept: DepartmentInfo = {
        id: `dept_${Date.now()}`,
        name: deptForm.name as any,
        headTeacherName: deptForm.headTeacherName,
        description: deptForm.description,
      };
      setDepartments((prev) => [...prev, newDept]);
      onAddAuditLog('THÊM MỚI TỔ CHUYÊN MÔN', deptForm.name, `Đã tạo tổ chuyên môn mới: ${deptForm.name}`);
      showToast(`Đã thêm mới ${deptForm.name} vào hệ thống!`);
    }
    setIsDeptModalOpen(false);
  };

  const handleDeleteDept = (deptId: string, deptName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${deptName}?`)) {
      setDepartments((prev) => prev.filter((d) => d.id !== deptId));
      onAddAuditLog('XÓA TỔ CHUYÊN MÔN', deptName, `Đã xóa tổ chuyên môn ${deptName}`);
      showToast(`Đã xóa ${deptName}!`);
    }
  };

  // Handle Staff CRUD
  const handleOpenStaffModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTeacherForm({
        code: teacher.code,
        fullName: teacher.fullName,
        email: teacher.email,
        phone: teacher.phone,
        department: teacher.department,
        position: teacher.position,
        titleGrade: teacher.titleGrade,
        yearsOfTeaching: teacher.yearsOfTeaching,
        avatar: teacher.avatar,
      });
    } else {
      setEditingTeacher(null);
      setTeacherForm({
        code: `GV-CT-${Math.floor(100 + Math.random() * 900)}`,
        fullName: '',
        email: '',
        phone: '',
        department: 'Tổ Toán',
        position: 'Giáo viên THPT',
        titleGrade: 'Giáo viên THPT Hạng II',
        yearsOfTeaching: 3,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });
    }
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.fullName.trim()) return;

    if (editingTeacher) {
      setTeachers((prev) =>
        prev.map((t) => (t.id === editingTeacher.id ? { ...t, ...teacherForm } : t))
      );
      onAddAuditLog('CẬP NHẬT TỔ VIÊN', teacherForm.fullName, `Đã chỉnh sửa thông tin giáo viên ${teacherForm.fullName}`);
      showToast(`Đã cập nhật thông tin thầy/cô ${teacherForm.fullName}!`);
    } else {
      const newTeacher: Teacher = {
        id: `gv_${Date.now()}`,
        code: teacherForm.code || `GV-${Date.now()}`,
        fullName: teacherForm.fullName,
        email: teacherForm.email || `${teacherForm.fullName.toLowerCase().replace(/\s+/g, '.')}@thptchauthanha.edu.vn`,
        avatar: teacherForm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        department: teacherForm.department,
        position: teacherForm.position,
        titleGrade: teacherForm.titleGrade,
        yearsOfTeaching: Number(teacherForm.yearsOfTeaching),
        phone: teacherForm.phone || '0900 000 000',
        skillDimensions: [
          { dimensionName: 'Phẩm chất nhà giáo', score: 90, benchmarkScore: 90 },
          { dimensionName: 'Phát triển chuyên môn', score: 85, benchmarkScore: 85 },
          { dimensionName: 'Năng lực sư phạm', score: 85, benchmarkScore: 85 },
          { dimensionName: 'Ứng dụng CNTT & AI', score: 80, benchmarkScore: 80 },
          { dimensionName: 'Xây dựng môi trường & Thi đua', score: 85, benchmarkScore: 85 }
        ],
        performanceTrend: [
          { period: 'Tháng 9', score: 85 },
          { period: 'Tháng 10', score: 86 },
          { period: 'Tháng 11', score: 88 }
        ],
        passiveLogs: [],
        evidences: [],
        currentEvaluation: {
          id: `eval_${Date.now()}`,
          teacherId: `gv_${Date.now()}`,
          period: 'Học kỳ I (2025-2026)',
          status: 'DRAFT',
          passivePointsTotal: 0,
          finalScore: 85.0,
          classification: 'HTTNV',
          isAnomaly: false,
          scores: {}
        }
      };

      setTeachers((prev) => [newTeacher, ...prev]);
      onAddAuditLog('THÊM TỔ VIÊN MỚI', teacherForm.fullName, `Đã thêm giáo viên ${teacherForm.fullName} vào ${teacherForm.department}`);
      showToast(`Đã thêm mới giáo viên ${teacherForm.fullName} vào danh sách!`);
    }
    setIsStaffModalOpen(false);
  };

  const handleDeleteStaff = (teacherId: string, fullName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá giáo viên ${fullName} khỏi danh sách nhà trường?`)) {
      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      onAddAuditLog('XÓA TỔ VIÊN', fullName, `Đã xoá hồ sơ giáo viên ${fullName}`);
      showToast(`Đã xoá giáo viên ${fullName} khỏi hệ thống!`);
    }
  };

  // Phát hiện giáo viên bị lỗi
  const corruptedTeachers = teachers.filter(isCorruptedTeacher);
  const corruptedCount = corruptedTeachers.length;

  const handleCleanCorrupted = () => {
    const { cleanTeachers, removedCount } = cleanTeachersList(teachers);
    setTeachers(cleanTeachers);
    onAddAuditLog('DỌN DẸP DỮ LIỆU LỖI', 'Hệ thống', `Đã dọn dẹp và xoá bỏ ${removedCount} bản ghi giáo viên bị lỗi ký tự nhị phân`);
    showToast(`Đã xoá sạch ${removedCount} giáo viên lỗi, phục hồi danh sách chuẩn!`);
  };

  const handleResetStandard = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại danh sách giáo viên mẫu chuẩn ban đầu (đầy đủ 6 nhóm chức vụ: BGH, Tổ trưởng, Tổ phó, Giáo viên, Tổ văn phòng, Hợp đồng lao động) của trường THPT Châu Thành A?')) {
      setTeachers(MOCK_TEACHERS);
      onAddAuditLog('KHÔI PHỤC DANH SÁCH CHUẨN', 'Hệ thống', 'Khôi phục danh sách giáo viên mẫu chuẩn ban đầu đầy đủ 6 nhóm chức vụ.');
      showToast('Đã khôi phục danh sách giáo viên mẫu chuẩn thành công!');
    }
  };

  const handleDirectExportExcel = async () => {
    try {
      await exportTeachersToExcel(teachers);
      onAddAuditLog('XUẤT FILE EXCEL DANH SÁCH GV', 'Hệ thống', `Đã xuất ${teachers.length} giáo viên ra file Excel .xlsx`);
      showToast('Đã xuất file Excel (.xlsx) danh sách giáo viên thành công!');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xuất file Excel');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Warning Banner If Corrupted Data Found */}
      {corruptedCount > 0 && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-2 border-rose-300 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-black text-sm md:text-base text-rose-950 flex items-center gap-2">
                ⚠️ Phát Hiện {corruptedCount} Bản Ghi Giáo Viên Bị Lỗi Dữ Liệu Ký Tự Rác
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                Các bản ghi này do nạp nhầm file nhị phân (Numbers hoặc file hỏng). Bấm nút bên cạnh để xoá sạch ngay và giữ lại dữ liệu chuẩn.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCleanCorrupted}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xoá Sạch {corruptedCount} GV Lỗi Ngay</span>
            </button>
            <button
              onClick={handleResetStandard}
              className="flex items-center gap-1.5 bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Chuẩn</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Quản Trị Viên & BGH
            </span>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30">
              THPT CHÂU THÀNH A
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Quản Lý Danh Sách Tổ Chuyên Môn & Tổ Viên
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Chức năng dành cho Admin / BGH để quản lý các Tổ bộ môn, danh sách giáo viên và nhập/xuất file Excel (.xlsx).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDirectExportExcel}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer"
            title="Xuất toàn bộ danh sách giáo viên ra file Excel .xlsx"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>Xuất Excel (.xlsx)</span>
          </button>

          {onOpenTemplateModal && (
            <button
              onClick={onOpenTemplateModal}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer"
              title="Mở cửa sổ nhập file Excel/CSV và tải file mẫu"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-100" />
              <span>Nhập Excel / File Mẫu</span>
            </button>
          )}

          <button
            onClick={handleResetStandard}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="Dọn dẹp và khôi phục danh sách 6 giáo viên chuẩn ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Dọn Dẹp / Reset</span>
          </button>

          <button
            onClick={() => handleOpenDeptModal()}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            <span>Thêm Tổ Mới</span>
          </button>

          <button
            onClick={() => handleOpenStaffModal()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Tổ Viên</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'staff'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh Sách Tổ Viên ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('departments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'departments'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Danh Sách Tổ Chuyên Môn ({departments.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: STAFF LIST */}
      {activeSubTab === 'staff' && (
        <div className="space-y-4">
          
          {/* Controls bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên giáo viên, mã GV, email..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer w-full md:w-auto"
              >
                <option value="Tất cả Tổ chuyên môn">Tất cả Tổ chuyên môn ({teachers.length})</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({teachers.filter((t) => t.department === d.name).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Teachers Cards Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((t) => {
              const isCorrupt = isCorruptedTeacher(t);
              return (
                <div 
                  key={t.id} 
                  className={`rounded-2xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
                    isCorrupt 
                      ? 'bg-rose-50/60 border-rose-400 ring-2 ring-rose-300/50' 
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div>
                    {isCorrupt && (
                      <div className="mb-2 px-2.5 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-lg flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Dữ liệu bị lỗi ký tự
                        </span>
                        <button
                          onClick={() => handleDeleteStaff(t.id, t.fullName)}
                          className="underline hover:text-rose-200 cursor-pointer"
                        >
                          Xoá dòng này
                        </button>
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <img src={t.avatar} alt={t.fullName} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                        <div>
                          <h3 className={`font-bold text-sm ${isCorrupt ? 'text-rose-900 break-all' : 'text-slate-900'}`}>{t.fullName}</h3>
                          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {t.code}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!isCorrupt && (
                          <button
                            onClick={() => handleOpenStaffModal(t)}
                            title="Chỉnh sửa thông tin"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteStaff(t.id, t.fullName)}
                          title="Xóa giáo viên"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Tổ chuyên môn:</span>
                        <span className="font-bold text-slate-800">{t.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Chức vụ:</span>
                        <span className="font-semibold text-indigo-700">{t.position}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Hạng chức danh:</span>
                        <span className="text-slate-700">{t.titleGrade}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Thâm niên:</span>
                        <span className="text-slate-700">{t.yearsOfTeaching || (t as any).yearsOfExp || 10} năm công tác</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1 px-1">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{t.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Đánh giá HK I:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      t.currentEvaluation?.classification === 'HTXSNV' ? 'bg-emerald-100 text-emerald-800' :
                      t.currentEvaluation?.classification === 'HTTNV' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {t.currentEvaluation?.finalScore || 85}đ ({t.currentEvaluation?.classification || 'HTNV'})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTeachers.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              Không tìm thấy giáo viên nào phù hợp với bộ lọc.
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: DEPARTMENTS LIST */}
      {activeSubTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((d) => {
            const memberCount = teachers.filter((t) => t.department === d.name).length;
            const headTeacher = teachers.find((t) => t.department === d.name && t.position === 'Tổ trưởng chuyên môn');
            const deputyHeadTeacher = teachers.find((t) => t.department === d.name && t.position === 'Tổ phó chuyên môn');

            return (
              <div key={d.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900">{d.name}</h3>
                        <p className="text-xs text-slate-500">{d.description || 'Tổ chuyên môn THPT Châu Thành A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenDeptModal(d)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDept(d.id, d.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tổ trưởng chuyên môn:</span>
                      <strong className="text-slate-800">{d.headTeacherName || headTeacher?.fullName || 'Chưa phân công'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tổ phó chuyên môn:</span>
                      <strong className="text-slate-700">{d.deputyHeadTeacherName || deputyHeadTeacher?.fullName || 'Chưa phân công'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Số lượng tổ viên:</span>
                      <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">{memberCount} giáo viên</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Nhà trường THPT Châu Thành A</span>
                  <button
                    onClick={() => {
                      setSelectedDeptFilter(d.name);
                      setActiveSubTab('staff');
                    }}
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Xem danh sách tổ viên</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DEPARTMENT MODAL */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              {editingDept ? `Chỉnh Sửa ${editingDept.name}` : 'Thêm Tổ Chuyên Môn Mới'}
            </h3>

            <form onSubmit={handleSaveDept} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Tổ Chuyên Môn</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tổ Toán, Tổ Văn - GDKTPL..."
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tổ Trưởng Chuyên Môn</label>
                <input
                  type="text"
                  placeholder="Họ và tên Tổ trưởng..."
                  value={deptForm.headTeacherName}
                  onChange={(e) => setDeptForm({ ...deptForm, headTeacherName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả / Ghi chú</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả các bộ môn trực thuộc..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Lưu Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAFF MODAL */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              {editingTeacher ? `Chỉnh Sửa Giáo Viên: ${editingTeacher.fullName}` : 'Thêm Giáo Viên / Tổ Viên Mới'}
            </h3>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã Giáo Viên</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.code}
                    onChange={(e) => setTeacherForm({ ...teacherForm, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ Và Tên</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={teacherForm.fullName}
                    onChange={(e) => setTeacherForm({ ...teacherForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tổ Chuyên Môn</label>
                  <select
                    value={teacherForm.department}
                    onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value as Department })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chức Vụ</label>
                  <select
                    value={teacherForm.position}
                    onChange={(e) => setTeacherForm({ ...teacherForm, position: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Giáo viên THPT">Giáo viên THPT</option>
                    <option value="Tổ phó chuyên môn">Tổ phó chuyên môn</option>
                    <option value="Tổ trưởng chuyên môn">Tổ trưởng chuyên môn</option>
                    <option value="Hợp đồng lao động">Hợp đồng lao động</option>
                    <option value="Phó Hiệu trưởng">Phó Hiệu trưởng</option>
                    <option value="Hiệu trưởng">Hiệu trưởng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạng Chức Danh Nghề Nghiệp</label>
                  <select
                    value={teacherForm.titleGrade}
                    onChange={(e) => setTeacherForm({ ...teacherForm, titleGrade: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Giáo viên THPT Hạng I">Giáo viên THPT Hạng I</option>
                    <option value="Giáo viên THPT Hạng II">Giáo viên THPT Hạng II</option>
                    <option value="Giáo viên THPT Hạng III">Giáo viên THPT Hạng III</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thâm Niên Công Tác (Năm)</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={teacherForm.yearsOfTeaching}
                    onChange={(e) => setTeacherForm({ ...teacherForm, yearsOfTeaching: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Công Việc</label>
                  <input
                    type="email"
                    placeholder="example@thptchauthanha.edu.vn"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    placeholder="0912 345 678"
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Lưu Giáo Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
