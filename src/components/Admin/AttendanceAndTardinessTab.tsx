import React, { useState } from 'react';
import { 
  AttendanceRecord, 
  Teacher, 
  PassiveLog, 
  Role 
} from '../../types';
import { 
  Clock, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Search, 
  Filter, 
  UserX, 
  Calendar, 
  ShieldAlert, 
  FileText,
  UserCheck
} from 'lucide-react';

interface AttendanceAndTardinessTabProps {
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  teachers: Teacher[];
  currentRole: Role;
  onAddPassiveLog: (teacherId: string, log: PassiveLog) => void;
  onAddAuditLog: (action: string, targetName: string, details: string) => void;
}

export const AttendanceAndTardinessTab: React.FC<AttendanceAndTardinessTabProps> = ({
  attendanceRecords,
  setAttendanceRecords,
  teachers,
  currentRole,
  onAddPassiveLog,
  onAddAuditLog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tất cả Tổ chuyên môn');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for logging attendance
  const [form, setForm] = useState({
    teacherId: teachers[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    type: 'DI_TRE' as AttendanceRecord['type'],
    minutesLate: 15,
    reason: '',
    deductPoints: 2.0,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto calculate suggested points based on attendance type
  const handleTypeChange = (type: AttendanceRecord['type']) => {
    let suggestedDeduct = 2.0;
    if (type === 'DI_TRE') suggestedDeduct = 1.5;
    if (type === 'VANG_CO_PHEP') suggestedDeduct = 0.5;
    if (type === 'VANG_KHONG_PHEP') suggestedDeduct = 5.0;
    if (type === 'VE_SOM') suggestedDeduct = 1.5;
    if (type === 'BO_TIET') suggestedDeduct = 4.0;

    setForm({
      ...form,
      type,
      deductPoints: suggestedDeduct,
    });
  };

  // Filter records
  const filteredRecords = attendanceRecords.filter((r) => {
    const matchSearch = r.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) || r.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'Tất cả Tổ chuyên môn' || r.department === selectedDept;
    return matchSearch && matchDept;
  });

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === form.teacherId);
    if (!teacher) return;

    const typeLabels: Record<AttendanceRecord['type'], string> = {
      DI_TRE: `Đi trễ ${form.minutesLate} phút`,
      VANG_CO_PHEP: 'Vắng có phép',
      VANG_KHONG_PHEP: 'Vắng không phép',
      VE_SOM: 'Về sớm',
      BO_TIET: 'Bỏ tiết giảng dạy',
    };

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      department: teacher.department,
      date: form.date,
      type: form.type,
      minutesLate: form.type === 'DI_TRE' ? Number(form.minutesLate) : undefined,
      reason: form.reason || typeLabels[form.type],
      deductPoints: Number(form.deductPoints),
      recordedBy: currentRole === 'ADMIN_PRINCIPAL' ? 'Hiệu trưởng / BGH' : 'Tổ trưởng chuyên môn',
      timestamp: new Date().toLocaleString('vi-VN'),
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);

    // Create a penalty passive log for the teacher
    const penaltyPoints = -Math.abs(Number(form.deductPoints));
    const newLog: PassiveLog = {
      id: `pl_att_${Date.now()}`,
      teacherId: teacher.id,
      type: 'PENALTY',
      source: 'MAY_CHAM_CONG',
      title: typeLabels[form.type],
      description: `Ngày ${form.date}. Ly do: ${form.reason || 'Cập nhật từ BGH'}.`,
      points: penaltyPoints,
      timestamp: new Date().toLocaleString('vi-VN'),
      verified: true,
    };

    onAddPassiveLog(teacher.id, newLog);
    onAddAuditLog(
      'CẬP NHẬT VẮNG TRỄ',
      teacher.fullName,
      `Ghi nhận ${typeLabels[form.type]} ngày ${form.date}. Trừ điểm kỷ luật: ${penaltyPoints}đ`
    );

    showToast(`Đã ghi nhận vắng/trễ cho thầy/cô ${teacher.fullName} (Trừ ${Math.abs(penaltyPoints)}đ)!`);
    setIsAddModalOpen(false);
  };

  const handleDeleteRecord = (id: string, teacherName: string) => {
    if (window.confirm(`Xóa ghi nhận vắng/trễ này của giáo viên ${teacherName}?`)) {
      setAttendanceRecords((prev) => prev.filter((r) => r.id !== id));
      showToast(`Đã xóa bản ghi vắng/trễ!`);
    }
  };

  const totalDeducted = attendanceRecords.reduce((acc, r) => acc + r.deductPoints, 0);

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
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-rose-500/20 text-rose-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-rose-400/30 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Dành cho BGH & Admin Quản Lý
            </span>
            <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Kỷ Luật Lao Động
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Cập Nhật Vắng / Trễ & Kỷ Luật Nếp Sống Nhà Trường
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Ghi nhận chính xác tình trạng đi trễ, vắng mặt, bỏ tiết của giáo viên. Tự động quy đổi thành điểm trừ kỷ luật vào Tiêu chí 2 (Nghị định 90/2020/NĐ-CP).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cập Nhật Vắng / Trễ Mới</span>
        </button>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-1">Tổng Lần Ghi Nhận Vắng / Trễ</span>
            <span className="text-2xl font-bold text-slate-900">{attendanceRecords.length} lần</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-700 font-medium block mb-1">Tổng Điểm Trừ Kỷ Luật</span>
            <span className="text-2xl font-bold text-rose-800">-{totalDeducted.toFixed(1)} điểm</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-1">Cán Bộ Ghi Nhận Chính</span>
            <span className="text-sm font-bold text-indigo-700">Ban Giám Hiệu THPT Châu Thành A</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        
        {/* Filter bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên giáo viên hoặc lý do..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-rose-500 cursor-pointer w-full md:w-auto"
          >
            <option value="Tất cả Tổ chuyên môn">Tất cả Tổ chuyên môn</option>
            {Array.from(new Set(teachers.map((t) => t.department))).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Table Records */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Ngày Ghi Nhận</th>
                <th className="py-3 px-3">Giáo Viên</th>
                <th className="py-3 px-3">Tổ Chuyên Môn</th>
                <th className="py-3 px-3">Hình Thức</th>
                <th className="py-3 px-3">Lý Do / Chi Tiết</th>
                <th className="py-3 px-3 text-right">Điểm Trừ</th>
                <th className="py-3 px-3">Cán Bộ Cập Nhật</th>
                <th className="py-3 px-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-semibold text-slate-900">{r.date}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{r.teacherName}</td>
                  <td className="py-3 px-3 font-medium text-slate-600">{r.department}</td>
                  <td className="py-3 px-3">
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      r.type === 'VANG_KHONG_PHEP' || r.type === 'BO_TIET' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {r.type === 'DI_TRE' ? `Đi trễ ${r.minutesLate ? `(${r.minutesLate}p)` : ''}` :
                       r.type === 'VANG_CO_PHEP' ? 'Vắng có phép' :
                       r.type === 'VANG_KHONG_PHEP' ? 'Vắng không phép' :
                       r.type === 'VE_SOM' ? 'Về sớm' : 'Bỏ tiết dạy'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={r.reason}>{r.reason}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-rose-600">
                    -{r.deductPoints} điểm
                  </td>
                  <td className="py-3 px-3 text-slate-500">{r.recordedBy}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleDeleteRecord(r.id, r.teacherName)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-all cursor-pointer"
                      title="Xóa bản ghi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            Chưa có ghi nhận vắng/trễ nào cho bộ lọc hiện tại.
          </div>
        )}
      </div>

      {/* ADD ATTENDANCE RECORD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-600" />
              Cập Nhật Vắng / Trễ Cho Giáo Viên
            </h3>

            <form onSubmit={handleSaveRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Giáo Viên</label>
                <select
                  value={form.teacherId}
                  onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.fullName} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày Vi Phạm</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hình Thức</label>
                  <select
                    value={form.type}
                    onChange={(e) => handleTypeChange(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-rose-800"
                  >
                    <option value="DI_TRE">Đi trễ</option>
                    <option value="VANG_CO_PHEP">Vắng có phép</option>
                    <option value="VANG_KHONG_PHEP">Vắng không phép</option>
                    <option value="VE_SOM">Về sớm</option>
                    <option value="BO_TIET">Bỏ tiết giảng dạy</option>
                  </select>
                </div>
              </div>

              {form.type === 'DI_TRE' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số Phút Đi Trễ</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={form.minutesLate}
                    onChange={(e) => setForm({ ...form, minutesLate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lý Do / Chi Tiết Sự Việc</label>
                <input
                  type="text"
                  placeholder="Nhập chi tiết lý do..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mức Trừ Điểm Kỷ Luật (- Điểm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  required
                  value={form.deductPoints}
                  onChange={(e) => setForm({ ...form, deductPoints: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-rose-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  Lưu & Trừ Điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
