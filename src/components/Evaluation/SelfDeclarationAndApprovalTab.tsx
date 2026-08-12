import React, { useState } from 'react';
import { 
  SelfDeclarationRecord, 
  Teacher, 
  Role, 
  PassiveLog,
  ApprovalStatus2Layer,
  DeclarationType
} from '../../types';
import { 
  FileCheck2, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Award, 
  AlertTriangle, 
  FileText, 
  Search, 
  Filter, 
  ChevronRight,
  UserCheck,
  Send,
  FileSpreadsheet
} from 'lucide-react';

interface SelfDeclarationAndApprovalTabProps {
  selfDeclarations: SelfDeclarationRecord[];
  setSelfDeclarations: React.Dispatch<React.SetStateAction<SelfDeclarationRecord[]>>;
  teachers: Teacher[];
  currentRole: Role;
  currentTeacherId?: string; // ID of currently logged in teacher if available
  onAddPassiveLog: (teacherId: string, log: PassiveLog) => void;
  onAddAuditLog: (action: string, targetName: string, details: string) => void;
  onOpenTemplateModal?: () => void;
}

export const SelfDeclarationAndApprovalTab: React.FC<SelfDeclarationAndApprovalTabProps> = ({
  selfDeclarations,
  setSelfDeclarations,
  teachers,
  currentRole,
  currentTeacherId = 'gv_01',
  onAddPassiveLog,
  onAddAuditLog,
  onOpenTemplateModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDeclarationModalOpen, setIsDeclarationModalOpen] = useState<boolean>(false);

  // Approval Comment Modal
  const [selectedRecordForApproval, setSelectedRecordForApproval] = useState<SelfDeclarationRecord | null>(null);
  const [approvalActionType, setApprovalActionType] = useState<'HEAD_APPROVE' | 'PRINCIPAL_APPROVE' | 'REJECT' | null>(null);
  const [approvalComment, setApprovalComment] = useState<string>('');

  // Form state
  const [form, setForm] = useState({
    teacherId: currentTeacherId || teachers[0]?.id || 'gv_01',
    type: 'BONUS_AWARD' as DeclarationType,
    title: '',
    categoryOrLevel: 'Cấp Trường' as SelfDeclarationRecord['categoryOrLevel'],
    awardNameOrInfraction: 'Giải Nhất',
    suggestedPoints: 3.0,
    evidenceUrlOrDesc: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Default points auto-suggest
  const handleLevelOrTypeChange = (type: DeclarationType, level: SelfDeclarationRecord['categoryOrLevel']) => {
    let pts = 3.0;
    if (type === 'BONUS_AWARD') {
      if (level === 'Cấp Trường') pts = 3.0;
      if (level === 'Cấp Xã (Cụm Trường)') pts = 5.0;
      if (level === 'Cấp Tỉnh / Thành phố') pts = 8.0;
      if (level === 'Cấp Quốc Gia') pts = 10.0;
    } else {
      if (level === 'Vi phạm nếp sống / Kỷ luật') pts = -2.0;
      if (level === 'Chỉ tiêu chuyên môn chưa đạt') pts = -3.0;
    }
    setForm(prev => ({ ...prev, type, categoryOrLevel: level, suggestedPoints: pts }));
  };

  const handleCreateDeclaration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Vui lòng nhập tên phong trào hoặc nội dung vi phạm/chưa đạt!');
      return;
    }

    const teacher = teachers.find(t => t.id === form.teacherId);
    if (!teacher) return;

    const newRecord: SelfDeclarationRecord = {
      id: `sd_${Date.now()}`,
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      department: teacher.department,
      type: form.type,
      title: form.title,
      categoryOrLevel: form.categoryOrLevel,
      awardNameOrInfraction: form.awardNameOrInfraction,
      suggestedPoints: form.suggestedPoints,
      evidenceUrlOrDesc: form.evidenceUrlOrDesc || 'Đã kê khai trong bản tự chấm cá nhân.',
      submittedAt: new Date().toLocaleString('vi-VN'),
      status: 'PENDING_HEAD',
    };

    setSelfDeclarations(prev => [newRecord, ...prev]);

    onAddAuditLog(
      'KÊ KHAI ĐIỂM THI ĐƯA / VI PHẠM',
      teacher.fullName,
      `Tự kê khai: ${form.title} (${form.categoryOrLevel}) - Đề xuất: ${form.suggestedPoints > 0 ? '+' : ''}${form.suggestedPoints}đ`
    );

    showToast(`Đã gửi tự kê khai! Hồ sơ đang ở Lớp 1 (Chờ Tổ trưởng / Tổ phó chuyên môn xác minh).`);
    setIsDeclarationModalOpen(false);
    setForm({
      teacherId: currentTeacherId || teachers[0]?.id || 'gv_01',
      type: 'BONUS_AWARD',
      title: '',
      categoryOrLevel: 'Cấp Trường',
      awardNameOrInfraction: 'Giải Nhất',
      suggestedPoints: 3.0,
      evidenceUrlOrDesc: '',
    });
  };

  // Open Approval Comment Dialog
  const handleOpenApprovalModal = (record: SelfDeclarationRecord, action: 'HEAD_APPROVE' | 'PRINCIPAL_APPROVE' | 'REJECT') => {
    setSelectedRecordForApproval(record);
    setApprovalActionType(action);
    setApprovalComment('');
  };

  // Process Approval Execution
  const handleExecuteApproval = () => {
    if (!selectedRecordForApproval || !approvalActionType) return;

    const currentUserName = currentRole === 'ADMIN_PRINCIPAL' ? 'Hiệu trưởng / BGH' : 'Tổ trưởng / Tổ phó chuyên môn';
    const nowStr = new Date().toLocaleString('vi-VN');

    setSelfDeclarations(prev => prev.map(rec => {
      if (rec.id !== selectedRecordForApproval.id) return rec;

      if (approvalActionType === 'HEAD_APPROVE') {
        // Lớp 1 (Tổ trưởng / Tổ phó) duyệt -> Chuyển sang Lớp 2 (BGH/Admin)
        return {
          ...rec,
          status: 'PENDING_PRINCIPAL',
          headApproval: {
            approvedBy: currentUserName,
            approvedAt: nowStr,
            comment: approvalComment || 'Tổ trưởng / Tổ phó đã đối soát minh chứng hợp lệ.',
          }
        };
      } else if (approvalActionType === 'PRINCIPAL_APPROVE') {
        // Lớp 2 (BGH/Admin) duyệt -> Chuyển sang APPROVED & Tự động cộng/trừ điểm thụ động
        const approvedPts = rec.suggestedPoints;
        const newLog: PassiveLog = {
          id: `pl_sd_${Date.now()}`,
          teacherId: rec.teacherId,
          type: rec.type === 'BONUS_AWARD' ? 'BONUS' : 'PENALTY',
          source: rec.type === 'BONUS_AWARD' ? 'KHEN_THUONG_HSG' : 'MAY_CHAM_CONG',
          title: `${rec.title} (${rec.categoryOrLevel})`,
          description: `Đã qua 2 lớp phê duyệt (Lớp 1: Tổ trưởng, Lớp 2: BGH). Ghi chú BGH: ${approvalComment || 'Đã công nhận điểm thi đua.'}`,
          points: approvedPts,
          timestamp: nowStr,
          verified: true
        };

        onAddPassiveLog(rec.teacherId, newLog);

        return {
          ...rec,
          status: 'APPROVED',
          principalApproval: {
            approvedBy: currentUserName,
            approvedAt: nowStr,
            comment: approvalComment || 'Ban Giám Hiệu đã phê duyệt chính thức công nhận điểm.',
          }
        };
      } else {
        // REJECT
        return {
          ...rec,
          status: 'REJECTED',
          principalApproval: {
            approvedBy: currentUserName,
            approvedAt: nowStr,
            comment: approvalComment || 'Không đủ minh chứng hợp lệ hoặc không thuộc diện cộng/trừ điểm.',
          }
        };
      }
    }));

    onAddAuditLog(
      approvalActionType === 'REJECT' ? 'TỪ CHỐI TỰ KÊ KHAI' : 'PHÊ DUYỆT TỰ KÊ KHAI',
      selectedRecordForApproval.teacherName,
      `Thao tác: ${approvalActionType}. Tiêu đề: ${selectedRecordForApproval.title}`
    );

    if (approvalActionType === 'HEAD_APPROVE') {
      showToast(`[Lớp 1] Tổ trưởng / Tổ phó đã xác minh sơ bộ! Đã chuyển BGH phê duyệt (Lớp 2).`);
    } else if (approvalActionType === 'PRINCIPAL_APPROVE') {
      showToast(`[Lớp 2] BGH đã phê duyệt chính thức! Điểm thi đua đã được tự động cộng/trừ vào hệ thống.`);
    } else {
      showToast(`Đã từ chối bản kê khai này.`);
    }

    setSelectedRecordForApproval(null);
    setApprovalActionType(null);
  };

  // Filtering records
  const filteredRecords = selfDeclarations.filter(r => {
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchType = filterType === 'ALL' || r.type === filterType;
    const matchSearch = r.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

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
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Quy Trình Phê Duyệt 2 Lớp Minh Bạch
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Lớp 1: Tổ Trưởng • Lớp 2: BGH / Admin
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Tự Kê Khai Điểm Phong Trào & Vi Phạm (Phê Duyệt 2 Lớp)
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Giáo viên tự nhập thành tích giải thưởng phong trào hoặc tự báo cáo vi phạm, vắng trễ, chỉ tiêu chưa đạt. Điểm chỉ được tính chính thức khi qua đủ 2 lớp phê duyệt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onOpenTemplateModal && (
            <button
              onClick={onOpenTemplateModal}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-3 rounded-xl border border-slate-700 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Xuất File Mẫu & Nhập CSV</span>
            </button>
          )}

          <button
            onClick={() => setIsDeclarationModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tự Kê Khai Mới (Thành Tích / Vi Phạm)</span>
          </button>
        </div>
      </div>

      {/* 2-Tier Process Explanation Visual Steps */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">1</div>
          <div>
            <div className="font-bold text-slate-900">1. GV Tự Nhập</div>
            <div className="text-[11px] text-slate-500">Thành tích / Vi phạm & đính kèm minh chứng</div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">2</div>
          <div>
            <div className="font-bold text-slate-900">2. Lớp 1 (Tổ Trưởng)</div>
            <div className="text-[11px] text-slate-500">Đối soát minh chứng & Duyệt sơ bộ</div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0">3</div>
          <div>
            <div className="font-bold text-slate-900">3. Lớp 2 (BGH / Admin)</div>
            <div className="text-[11px] text-slate-500">Xác nhận chính thức công nhận kết quả</div>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">✓</div>
          <div>
            <div className="font-bold text-emerald-900">4. Tự Động Cộng / Trừ</div>
            <div className="text-[11px] text-emerald-700">Ghi nhận vào Quỹ Điểm Thi Đua 100</div>
          </div>
        </div>
      </div>

      {/* Main Records Table & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên giáo viên, tổ hoặc phong trào..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">Tất cả Loại kê khai</option>
              <option value="BONUS_AWARD">Thành Tích & Khen Thưởng (+)</option>
              <option value="PENALTY_INFRACTION">Vi Phạm & Chưa Đạt (-)</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">Tất cả Trạng thái</option>
              <option value="PENDING_HEAD">Chờ Lớp 1 (Tổ trưởng / Tổ phó duyệt)</option>
              <option value="PENDING_PRINCIPAL">Chờ Lớp 2 (BGH/Admin duyệt)</option>
              <option value="APPROVED">Đã Phê Duyệt 2 Lớp (Đã Cộng/Trừ Điểm)</option>
              <option value="REJECTED">Đã Từ Chối</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Giáo Viên Kê Khai</th>
                <th className="py-3 px-3">Loại & Tiêu Đề Phong Trào / Vi Phạm</th>
                <th className="py-3 px-3">Cấp Giải / Danh Mục</th>
                <th className="py-3 px-3 text-center">Đề Xuất Điểm</th>
                <th className="py-3 px-3">Minh Chứng Đính Kèm</th>
                <th className="py-3 px-3 text-center">Tiến Trình 2 Lớp</th>
                <th className="py-3 px-3 text-center">Thao Tác Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.map((r) => {
                const isBonus = r.type === 'BONUS_AWARD';

                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Teacher info */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{r.teacherName}</div>
                      <div className="text-[11px] text-slate-500">{r.department}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{r.submittedAt}</div>
                    </td>

                    {/* Title & Type */}
                    <td className="py-3 px-3 max-w-xs">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {isBonus ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                            Thành Tích Khen Thưởng
                          </span>
                        ) : (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">
                            Báo Cáo Vi Phạm / Hạn Chế
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-slate-800 leading-snug">{r.title}</div>
                    </td>

                    {/* Category or Level */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{r.categoryOrLevel}</div>
                      <div className="text-[11px] text-slate-500">{r.awardNameOrInfraction}</div>
                    </td>

                    {/* Points */}
                    <td className="py-3 px-3 text-center">
                      <span className={`text-sm font-extrabold px-2.5 py-1 rounded-lg ${
                        r.suggestedPoints >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {r.suggestedPoints > 0 ? `+${r.suggestedPoints}` : r.suggestedPoints}đ
                      </span>
                    </td>

                    {/* Evidence */}
                    <td className="py-3 px-3 max-w-xs">
                      <p className="text-[11px] text-slate-600 line-clamp-2" title={r.evidenceUrlOrDesc}>
                        {r.evidenceUrlOrDesc}
                      </p>
                    </td>

                    {/* 2-Layer Approval Timeline Badge */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        {/* Lớp 1 Badge */}
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="font-bold text-slate-500 min-w-10">Lớp 1:</span>
                          {r.headApproval ? (
                            <span className="text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                              ✓ {r.headApproval.approvedBy}
                            </span>
                          ) : r.status === 'REJECTED' ? (
                            <span className="text-rose-700 bg-rose-50 font-bold px-1.5 py-0.5 rounded border border-rose-200">✗ Từ chối</span>
                          ) : (
                            <span className="text-amber-800 bg-amber-50 font-bold px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">⏳ Chờ duyệt</span>
                          )}
                        </div>

                        {/* Lớp 2 Badge */}
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="font-bold text-slate-500 min-w-10">Lớp 2:</span>
                          {r.status === 'APPROVED' && r.principalApproval ? (
                            <span className="text-blue-800 bg-blue-50 font-bold px-1.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                              ✓ {r.principalApproval.approvedBy}
                            </span>
                          ) : r.status === 'REJECTED' ? (
                            <span className="text-rose-700 bg-rose-50 font-bold px-1.5 py-0.5 rounded border border-rose-200">✗ Từ chối</span>
                          ) : (
                            <span className="text-slate-400 italic">Chờ duyệt Lớp 2</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Approval Action buttons */}
                    <td className="py-3 px-3 text-center">
                      {r.status === 'APPROVED' ? (
                        <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã Công Nhận
                        </span>
                      ) : r.status === 'REJECTED' ? (
                        <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2.5 py-1 rounded-full border border-slate-300">
                          Đã Từ Chối
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1 items-center">
                          
                          {/* Lớp 1 Approval Option (Tổ trưởng hoặc Admin/Principal) */}
                          {r.status === 'PENDING_HEAD' && (
                            <button
                              onClick={() => handleOpenApprovalModal(r, 'HEAD_APPROVE')}
                              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-xs transition-all cursor-pointer w-full"
                            >
                              Duyệt Lớp 1 (Tổ trưởng / Tổ phó)
                            </button>
                          )}

                          {/* Lớp 2 Approval Option (BGH / Admin) */}
                          {r.status === 'PENDING_PRINCIPAL' && (
                            <button
                              onClick={() => handleOpenApprovalModal(r, 'PRINCIPAL_APPROVE')}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-xs transition-all cursor-pointer w-full"
                            >
                              Duyệt Lớp 2 (BGH/Admin)
                            </button>
                          )}

                          {/* Reject Option */}
                          <button
                            onClick={() => handleOpenApprovalModal(r, 'REJECT')}
                            className="text-rose-600 hover:bg-rose-50 text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer"
                          >
                            Từ chối
                          </button>

                        </div>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            Chưa có bản tự kê khai nào phù hợp với bộ lọc hiện tại.
          </div>
        )}

      </div>

      {/* CREATE SELF DECLARATION MODAL */}
      {isDeclarationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              Tự Kê Khai Thành Tích Phong Trào Hoặc Vi Phạm
            </h3>
            <p className="text-xs text-slate-500 mb-4">Hồ sơ sẽ trải qua 2 lớp phê duyệt: Lớp 1 (Tổ trưởng) & Lớp 2 (BGH/Admin)</p>

            <form onSubmit={handleCreateDeclaration} className="space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn Giáo Viên Kê Khai:</label>
                <select
                  value={form.teacherId}
                  onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-blue-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.fullName} ({t.department} - {t.position})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại Khai Báo:</label>
                  <select
                    value={form.type}
                    onChange={(e) => handleLevelOrTypeChange(e.target.value as DeclarationType, form.categoryOrLevel)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none focus:border-blue-500"
                  >
                    <option value="BONUS_AWARD">Khen Thưởng / Thành Tích (+)</option>
                    <option value="PENALTY_INFRACTION">Vi Phạm / Chưa Đạt (-)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cấp / Danh Mục:</label>
                  <select
                    value={form.categoryOrLevel}
                    onChange={(e) => handleLevelOrTypeChange(form.type, e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none focus:border-blue-500 text-indigo-900"
                  >
                    {form.type === 'BONUS_AWARD' ? (
                      <>
                        <option value="Cấp Trường">Cấp Trường</option>
                        <option value="Cấp Xã (Cụm Trường)">Cấp Xã (Cụm Trường)</option>
                        <option value="Cấp Tỉnh / Thành phố">Cấp Tỉnh / Thành phố</option>
                        <option value="Cấp Quốc Gia">Cấp Quốc Gia</option>
                      </>
                    ) : (
                      <>
                        <option value="Vi phạm nếp sống / Kỷ luật">Vi phạm nếp sống / Kỷ luật (Vắng trễ)</option>
                        <option value="Chỉ tiêu chuyên môn chưa đạt">Chỉ tiêu chuyên môn chưa đạt</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Phong Trào / Nội Dung Vi Phạm - Hạn Chế:</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={form.type === 'BONUS_AWARD' ? "Ví dụ: Hội thi Bài giảng E-learning & AI..." : "Ví dụ: Trễ sinh hoạt đầu tuần / Chưa đạt chỉ tiêu HSG..."}
                  className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giải / Chi Tiết Danh Hiệu / Loại Lỗi:</label>
                  <input
                    type="text"
                    required
                    value={form.awardNameOrInfraction}
                    onChange={(e) => setForm({ ...form, awardNameOrInfraction: e.target.value })}
                    placeholder={form.type === 'BONUS_AWARD' ? "Giải Nhất / Giải Nhì / Tham gia (không đạt giải) / Giấy Khen..." : "Vắng trễ / Bỏ tiết / Chậm giáo án / Thiếu tỉ lệ họp..."}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Điểm Tự Đề Xuất (+ / -):</label>
                  <input
                    type="number"
                    step={0.5}
                    value={form.suggestedPoints}
                    onChange={(e) => setForm({ ...form, suggestedPoints: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-xl font-bold text-center focus:outline-none focus:border-blue-500 text-indigo-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Minh Chứng Đính Kèm / Bản Tự Kiểm Điểm Giải Trình:</label>
                <textarea
                  value={form.evidenceUrlOrDesc}
                  onChange={(e) => setForm({ ...form, evidenceUrlOrDesc: e.target.value })}
                  placeholder="Nhập số quyết định, link đính kèm bằng khen hoặc nội dung tự kiểm điểm..."
                  className="w-full h-16 p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDeclarationModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Kê Khai Duyệt 2 Lớp</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* APPROVAL DIALOG MODAL */}
      {selectedRecordForApproval && approvalActionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              {approvalActionType === 'HEAD_APPROVE' && 'Xác Nhận Duyệt Lớp 1 (Tổ Trưởng)'}
              {approvalActionType === 'PRINCIPAL_APPROVE' && 'Phê Duyệt Chính Thức Lớp 2 (BGH / Admin)'}
              {approvalActionType === 'REJECT' && 'Từ Chối Bản Kê Khai'}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Giáo viên: <strong>{selectedRecordForApproval.teacherName}</strong> — Nội dung: {selectedRecordForApproval.title}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-4">
              <div className="flex justify-between font-bold mb-1">
                <span>Cấp / Danh mục: {selectedRecordForApproval.categoryOrLevel}</span>
                <span className={selectedRecordForApproval.suggestedPoints >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                  {selectedRecordForApproval.suggestedPoints > 0 ? '+' : ''}{selectedRecordForApproval.suggestedPoints} điểm
                </span>
              </div>
              <p className="text-slate-600 italic">{selectedRecordForApproval.evidenceUrlOrDesc}</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Nhận xét / Ý kiến chỉ đạo phê duyệt:</label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="Ghi rõ ý kiến thẩm định hoặc lý do phê duyệt/từ chối..."
                className="w-full h-20 p-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedRecordForApproval(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleExecuteApproval}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer ${
                  approvalActionType === 'REJECT' ? 'bg-rose-600 hover:bg-rose-700' :
                  approvalActionType === 'HEAD_APPROVE' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {approvalActionType === 'REJECT' ? 'Xác Nhận Từ Chối' : 'Xác Nhận Phê Duyệt'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
