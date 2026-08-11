import React, { useState } from 'react';
import { 
  EmulationMovement, 
  AwardPointRule, 
  MovementParticipation, 
  Teacher, 
  PassiveLog 
} from '../../types';
import { 
  Flag, 
  Award, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Star, 
  Calendar, 
  UserCheck, 
  Sparkles, 
  TrendingUp, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { SUPPORTED_ACADEMIC_YEARS } from '../../utils/academicYear';

interface MovementsAndAwardsTabProps {
  movements: EmulationMovement[];
  setMovements: React.Dispatch<React.SetStateAction<EmulationMovement[]>>;
  participations: MovementParticipation[];
  setParticipations: React.Dispatch<React.SetStateAction<MovementParticipation[]>>;
  teachers: Teacher[];
  onAddPassiveLog: (teacherId: string, log: PassiveLog) => void;
  onAddAuditLog: (action: string, targetName: string, details: string) => void;
}

export const MovementsAndAwardsTab: React.FC<MovementsAndAwardsTabProps> = ({
  movements,
  setMovements,
  participations,
  setParticipations,
  teachers,
  onAddPassiveLog,
  onAddAuditLog,
}) => {
  const [activeTab, setActiveTab] = useState<'movements' | 'records'>('movements');

  // Movement Modal State
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<EmulationMovement | null>(null);
  const [movementForm, setMovementForm] = useState({
    title: '',
    academicYear: '2025 - 2026',
    startDate: '',
    endDate: '',
    description: '',
    status: 'ACTIVE' as EmulationMovement['status'],
  });

  // Award Point Rule Modal inside Movement
  const [selectedMovementForRule, setSelectedMovementForRule] = useState<EmulationMovement | null>(null);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    level: 'Cấp Tỉnh / Thành phố' as AwardPointRule['level'],
    awardName: 'Giải Nhất' as AwardPointRule['awardName'],
    points: 5.0,
  });

  // Record Teacher Award Modal
  const [isRecordAwardModalOpen, setIsRecordAwardModalOpen] = useState(false);
  const [awardRecordForm, setAwardRecordForm] = useState({
    teacherId: '',
    movementId: '',
    ruleId: '',
    note: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Movement Handlers
  const handleOpenMovementModal = (mov?: EmulationMovement) => {
    if (mov) {
      setEditingMovement(mov);
      setMovementForm({
        title: mov.title,
        academicYear: mov.academicYear,
        startDate: mov.startDate,
        endDate: mov.endDate,
        description: mov.description,
        status: mov.status,
      });
    } else {
      setEditingMovement(null);
      setMovementForm({
        title: '',
        academicYear: '2025 - 2026',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        description: '',
        status: 'ACTIVE',
      });
    }
    setIsMovementModalOpen(true);
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementForm.title.trim()) return;

    if (editingMovement) {
      setMovements((prev) =>
        prev.map((m) => (m.id === editingMovement.id ? { ...m, ...movementForm } : m))
      );
      onAddAuditLog('CẬP NHẬT PHONG TRÀO', movementForm.title, `Đã cập nhật phong trào ${movementForm.title}`);
      showToast(`Đã cập nhật phong trào thi đua "${movementForm.title}"!`);
    } else {
      const newMov: EmulationMovement = {
        id: `mov_${Date.now()}`,
        ...movementForm,
        awardRules: [
          { id: `r1_${Date.now()}`, level: 'Cấp Trường', awardName: 'Giải Nhất', points: 3.0 },
          { id: `r2_${Date.now()}`, level: 'Cấp Trường', awardName: 'Giải Nhì', points: 2.0 },
          { id: `r3_${Date.now()}`, level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhất', points: 8.0 },
          { id: `r4_${Date.now()}`, level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhì', points: 6.0 },
        ],
      };
      setMovements((prev) => [newMov, ...prev]);
      onAddAuditLog('TẠO PHONG TRÀO THI ĐUA', movementForm.title, `Đã tạo phong trào thi đua mới: ${movementForm.title}`);
      showToast(`Đã tạo phong trào thi đua "${movementForm.title}"!`);
    }
    setIsMovementModalOpen(false);
  };

  const handleDeleteMovement = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phong trào "${title}"?`)) {
      setMovements((prev) => prev.filter((m) => m.id !== id));
      onAddAuditLog('XÓA PHONG TRÀO', title, `Đã xóa phong trào ${title}`);
      showToast(`Đã xóa phong trào "${title}"!`);
    }
  };

  // Rule Handlers
  const handleOpenRuleModal = (mov: EmulationMovement) => {
    setSelectedMovementForRule(mov);
    setRuleForm({ level: 'Cấp Tỉnh / Thành phố', awardName: 'Giải Nhất', points: 5.0 });
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovementForRule) return;

    const newRule: AwardPointRule = {
      id: `rule_${Date.now()}`,
      level: ruleForm.level,
      awardName: ruleForm.awardName,
      points: Number(ruleForm.points),
    };

    setMovements((prev) =>
      prev.map((m) => {
        if (m.id !== selectedMovementForRule.id) return m;
        return {
          ...m,
          awardRules: [...m.awardRules, newRule],
        };
      })
    );

    onAddAuditLog(
      'QUY ĐỊNH ĐIỂM GIẢI THƯỞNG',
      selectedMovementForRule.title,
      `Quy định ${ruleForm.awardName} (${ruleForm.level}): +${ruleForm.points} điểm`
    );
    showToast(`Đã bổ sung quy định điểm (+${ruleForm.points}đ) cho phong trào!`);
    setIsRuleModalOpen(false);
  };

  const handleDeleteRule = (movementId: string, ruleId: string) => {
    setMovements((prev) =>
      prev.map((m) => {
        if (m.id !== movementId) return m;
        return {
          ...m,
          awardRules: m.awardRules.filter((r) => r.id !== ruleId),
        };
      })
    );
    showToast('Đã xóa quy định điểm giải thưởng!');
  };

  // Record Teacher Achievement
  const handleOpenRecordAwardModal = (movementId?: string) => {
    const defaultMov = movementId || (movements.length > 0 ? movements[0].id : '');
    const firstMov = movements.find((m) => m.id === defaultMov);
    const defaultRule = firstMov?.awardRules[0]?.id || '';

    setAwardRecordForm({
      teacherId: teachers[0]?.id || '',
      movementId: defaultMov,
      ruleId: defaultRule,
      note: '',
    });
    setIsRecordAwardModalOpen(true);
  };

  const handleSaveTeacherAward = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === awardRecordForm.teacherId);
    const movement = movements.find((m) => m.id === awardRecordForm.movementId);
    const rule = movement?.awardRules.find((r) => r.id === awardRecordForm.ruleId);

    if (!teacher || !movement || !rule) {
      alert('Vui lòng chọn đầy đủ Giáo viên, Phong trào và Cấp giải thưởng!');
      return;
    }

    const newPart: MovementParticipation = {
      id: `mp_${Date.now()}`,
      movementId: movement.id,
      movementTitle: movement.title,
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      department: teacher.department,
      level: rule.level,
      awardName: rule.awardName,
      pointsEarned: rule.points,
      recordedDate: new Date().toISOString().split('T')[0],
      note: awardRecordForm.note || `Đạt ${rule.awardName} ${rule.level} trong ${movement.title}`,
    };

    setParticipations((prev) => [newPart, ...prev]);

    // Automatically add to teacher's passive logs
    const newLog: PassiveLog = {
      id: `pl_mov_${Date.now()}`,
      teacherId: teacher.id,
      type: 'BONUS',
      source: 'KHEN_THUONG_HSG',
      title: `${rule.awardName} - ${rule.level}`,
      description: `${movement.title}. ${awardRecordForm.note || ''}`,
      points: rule.points,
      timestamp: new Date().toLocaleString('vi-VN'),
      verified: true,
    };

    onAddPassiveLog(teacher.id, newLog);
    onAddAuditLog(
      'GHI NHẬN THÀNH TÍCH PHONG TRÀO',
      teacher.fullName,
      `Đạt ${rule.awardName} (${rule.level}) - Phong trào: ${movement.title}. Cộng +${rule.points}đ vào điểm thi đua.`
    );

    showToast(`Đã ghi nhận thành tích & cộng +${rule.points} điểm cho thầy/cô ${teacher.fullName}!`);
    setIsRecordAwardModalOpen(false);
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

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Chức Năng Admin / BGH
            </span>
            <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Quy Định Điểm Thi Đua
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Quản Lý Phong Trào Thi Đua & Điểm Giải Thưởng
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Cập nhật danh sách phong trào, thiết lập thang điểm thưởng cho từng cấp giải (Trường, Huyện, Tỉnh, Quốc gia) và ghi nhận điểm thi đua cho giáo viên.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleOpenMovementModal()}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Phong Trào Mới</span>
          </button>

          <button
            onClick={() => handleOpenRecordAwardModal()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Ghi Nhận Thành Tích GV</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('movements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'movements'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Danh Sách Phong Trào & Quy Định Điểm ({movements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('records')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'records'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Star className="w-4 h-4 text-amber-300" />
          <span>Lịch Sử Thành Tích & Điểm Thưởng GV ({participations.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: MOVEMENTS & SCORING RULES */}
      {activeTab === 'movements' && (
        <div className="space-y-6">
          {movements.map((mov) => (
            <div key={mov.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-amber-300 transition-all">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      mov.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {mov.status === 'ACTIVE' ? 'Đang diễn ra' : 'Đã kết thúc'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Năm học {mov.academicYear}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{mov.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{mov.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenRecordAwardModal(mov.id)}
                    className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Cộng điểm cho GV</span>
                  </button>

                  <button
                    onClick={() => handleOpenMovementModal(mov)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                    title="Sửa phong trào"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteMovement(mov.id, mov.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    title="Xóa phong trào"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Award Rules Section */}
              <div className="mt-4 pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Quy định điểm thưởng theo cấp giải đạt được:
                  </span>

                  <button
                    onClick={() => handleOpenRuleModal(mov)}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quy định mức điểm mới</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mov.awardRules.map((rule) => (
                    <div key={rule.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between group">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 block">{rule.level}</span>
                        <span className="text-xs font-bold text-slate-800">{rule.awardName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          +{rule.points}đ
                        </span>
                        <button
                          onClick={() => handleDeleteRule(mov.id, rule.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                          title="Xóa quy định này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: PARTICIPATION & AWARD RECORDS */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Danh Sách Giáo Viên Đạt Giải & Được Cộng Điểm Thi Đua</h3>
              <p className="text-xs text-slate-500">Tự động kết nối tới Sổ Thu Thập Thụ Động và Đánh Giá 360°</p>
            </div>

            <button
              onClick={() => handleOpenRecordAwardModal()}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
            >
              + Ghi Nhận Thành Tích
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Giáo Viên</th>
                  <th className="py-3 px-3">Tổ Chuyên Môn</th>
                  <th className="py-3 px-3">Phong Trào Thi Đua</th>
                  <th className="py-3 px-3">Cấp Giải</th>
                  <th className="py-3 px-3">Giải Đạt Được</th>
                  <th className="py-3 px-3 text-right">Điểm Cộng</th>
                  <th className="py-3 px-3">Ngày Ghi Nhận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {participations.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-900">{p.teacherName}</td>
                    <td className="py-3 px-3 font-medium text-slate-600">{p.department}</td>
                    <td className="py-3 px-3 max-w-xs truncate" title={p.movementTitle}>{p.movementTitle}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{p.level}</td>
                    <td className="py-3 px-3">
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                        {p.awardName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-emerald-600">
                      +{p.pointsEarned} điểm
                    </td>
                    <td className="py-3 px-3 text-slate-500">{p.recordedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MOVEMENT MODAL */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              {editingMovement ? 'Cập Nhật Phong Trào Thi Đua' : 'Tạo Phong Trào Thi Đua Mới'}
            </h3>

            <form onSubmit={handleSaveMovement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Phong Trào Thi Đua</label>
                <input
                  type="text"
                  required
                  placeholder="Tên hội thi / phong trào..."
                  value={movementForm.title}
                  onChange={(e) => setMovementForm({ ...movementForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Mục Tiêu / Yêu Cầu</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả chi tiết nội dung phong trào..."
                  value={movementForm.description}
                  onChange={(e) => setMovementForm({ ...movementForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Năm Học</label>
                  <select
                    value={movementForm.academicYear}
                    onChange={(e) => setMovementForm({ ...movementForm, academicYear: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {SUPPORTED_ACADEMIC_YEARS.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng Thái</label>
                  <select
                    value={movementForm.status}
                    onChange={(e) => setMovementForm({ ...movementForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="ACTIVE">Đang diễn ra</option>
                    <option value="COMPLETED">Đã kết thúc</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold shadow-sm"
                >
                  Lưu Phong Trào
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RULE POINT MODAL */}
      {isRuleModalOpen && selectedMovementForRule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2">
              Bổ Sung Mức Điểm Giải Thưởng
            </h3>
            <p className="text-xs text-slate-500 mb-4">{selectedMovementForRule.title}</p>

            <form onSubmit={handleSaveRule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cấp Giải Thưởng</label>
                <select
                  value={ruleForm.level}
                  onChange={(e) => setRuleForm({ ...ruleForm, level: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Cấp Trường">Cấp Trường</option>
                  <option value="Cấp Xã (Cụm Trường)">Cấp Xã (Cụm Trường)</option>
                  <option value="Cấp Tỉnh / Thành phố">Cấp Tỉnh / Thành phố</option>
                  <option value="Cấp Quốc Gia">Cấp Quốc Gia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loại Giải / Giấy Khen</label>
                <select
                  value={ruleForm.awardName}
                  onChange={(e) => setRuleForm({ ...ruleForm, awardName: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Giải Nhất">Giải Nhất</option>
                  <option value="Giải Nhì">Giải Nhì</option>
                  <option value="Giải Ba">Giải Ba</option>
                  <option value="Giải Khuyến Khích">Giải Khuyến Khích</option>
                  <option value="Đạt giải / Giấy khen">Đạt giải / Giấy khen</option>
                  <option value="Bằng khen cấp Bộ/Tỉnh">Bằng khen cấp Bộ/Tỉnh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Điểm Thưởng Quy Định (+ Điểm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="20"
                  required
                  value={ruleForm.points}
                  onChange={(e) => setRuleForm({ ...ruleForm, points: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-700"
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  Áp Dụng Quy Định
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD AWARD FOR TEACHER MODAL */}
      {isRecordAwardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Ghi Nhận Thành Tích & Cộng Điểm Cho GV
            </h3>

            <form onSubmit={handleSaveTeacherAward} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Giáo Viên</label>
                <select
                  value={awardRecordForm.teacherId}
                  onChange={(e) => setAwardRecordForm({ ...awardRecordForm, teacherId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.fullName} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Phong Trào Thi Đua</label>
                <select
                  value={awardRecordForm.movementId}
                  onChange={(e) => {
                    const movId = e.target.value;
                    const mov = movements.find((m) => m.id === movId);
                    setAwardRecordForm({
                      ...awardRecordForm,
                      movementId: movId,
                      ruleId: mov?.awardRules[0]?.id || '',
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {movements.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Cấp & Giải Thưởng Đạt Được</label>
                <select
                  value={awardRecordForm.ruleId}
                  onChange={(e) => setAwardRecordForm({ ...awardRecordForm, ruleId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-amber-800"
                >
                  {movements
                    .find((m) => m.id === awardRecordForm.movementId)
                    ?.awardRules.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.level} - {r.awardName} (+{r.points} điểm)
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi Chú Minh Chứng / Quyết Định Khen Thưởng</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quyết định số 142/QĐ-SGDĐT..."
                  value={awardRecordForm.note}
                  onChange={(e) => setAwardRecordForm({ ...awardRecordForm, note: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecordAwardModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  Cộng ĐiểmNgay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
