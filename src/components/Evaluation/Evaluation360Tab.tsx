import React, { useState } from 'react';
import { Teacher, Role, EvaluationCriteria, TeacherEvaluation, AppealDispute } from '../../types';
import { 
  ClipboardCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  User, 
  Edit3, 
  Send, 
  Lock, 
  MessageSquare,
  Clock,
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react';
import { fetchAnalyzeAnomaly } from '../../services/apiClient';

interface Evaluation360TabProps {
  teachers: Teacher[];
  currentRole: Role;
  criteria: EvaluationCriteria[];
  appeals: AppealDispute[];
  onUpdateTeacherEvaluation: (teacherId: string, evaluation: TeacherEvaluation) => void;
  onResolveAppeal: (appealId: string, status: 'RESOLVED' | 'REJECTED', note: string) => void;
}

export const Evaluation360Tab: React.FC<Evaluation360TabProps> = ({
  teachers,
  currentRole,
  criteria,
  appeals,
  onUpdateTeacherEvaluation,
  onResolveAppeal,
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
  
  // Score Editing State
  const [editScores, setEditScores] = useState<Record<string, { self: number; head: number; principal: number; comments: string }>>({});
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [aiAnomalyAnalysis, setAiAnomalyAnalysis] = useState<string | null>(null);
  const [isAnalyzingAnomaly, setIsAnalyzingAnomaly] = useState<boolean>(false);

  // Appeal Modal State
  const [selectedAppeal, setSelectedAppeal] = useState<AppealDispute | null>(null);
  const [appealResponseNote, setAppealResponseNote] = useState<string>('');

  const handleOpenScoringModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    const existing = teacher.currentEvaluation?.scores || {};
    const init: Record<string, { self: number; head: number; principal: number; comments: string }> = {};

    criteria.forEach((c) => {
      init[c.id] = {
        self: existing[c.id]?.selfScore ?? 85,
        head: existing[c.id]?.headScore ?? 85,
        principal: existing[c.id]?.principalScore ?? 85,
        comments: existing[c.id]?.comments || '',
      };
    });

    setEditScores(init);
    setAiAnomalyAnalysis(null);
    setShowScoreModal(true);
  };

  // Analyze Anomaly with AI
  const handleAnalyzeAnomalyClick = async () => {
    if (!selectedTeacher) return;
    setIsAnalyzingAnomaly(true);
    const text = await fetchAnalyzeAnomaly({
      teacherName: selectedTeacher.fullName,
      scores: editScores,
      passiveLogs: selectedTeacher.passiveLogs
    });
    setAiAnomalyAnalysis(text);
    setIsAnalyzingAnomaly(false);
  };

  // Save Scoring Changes
  const handleSaveEvaluation = () => {
    if (!selectedTeacher) return;

    // Check rating gap anomaly
    let hasAnomaly = false;
    let anomalyReason = '';

    criteria.forEach((c) => {
      const s = editScores[c.id];
      const gap = Math.abs(s.head - s.principal);
      if (gap > 15) {
        hasAnomaly = true;
        anomalyReason = `CẢNH BÁO BẤT THƯỜNG: Chênh lệch điểm tiêu chí "${c.title}" giữa Tổ trưởng (${s.head}đ) và Ban Giám hiệu (${s.principal}đ) vượt quá 15 điểm!`;
      }
    });

    // Calculate final weighted score
    let totalRaw = 0;
    const scoresObj: Record<string, any> = {};

    criteria.forEach((c) => {
      const val = editScores[c.id];
      const selectedScore = currentRole === 'ADMIN_PRINCIPAL' ? val.principal : (currentRole === 'HEAD_OF_DEPARTMENT' ? val.head : val.self);
      totalRaw += (selectedScore * c.weightPercent) / 100;

      scoresObj[c.id] = {
        criteriaId: c.id,
        selfScore: val.self,
        headScore: val.head,
        principalScore: val.principal,
        comments: val.comments,
      };
    });

    const passiveBonus = selectedTeacher.currentEvaluation?.passivePointsTotal || 0;
    const finalScore = parseFloat(Math.min(100, Math.max(0, totalRaw + passiveBonus)).toFixed(1));

    let classification: any = 'HTTNV';
    if (finalScore >= 90) classification = 'HTXSNV';
    else if (finalScore >= 75) classification = 'HTTNV';
    else if (finalScore >= 60) classification = 'HTNV';
    else classification = 'CHT';

    const updatedEval: TeacherEvaluation = {
      id: selectedTeacher.currentEvaluation?.id || `eval_${selectedTeacher.id}`,
      teacherId: selectedTeacher.id,
      period: 'Học kỳ I (2025-2026)',
      status: currentRole === 'ADMIN_PRINCIPAL' ? 'APPROVED' : (currentRole === 'HEAD_OF_DEPARTMENT' ? 'HEAD_REVIEWED' : 'SELF_SUBMITTED'),
      passivePointsTotal: passiveBonus,
      finalScore,
      classification,
      isAnomaly: hasAnomaly,
      anomalyReason: hasAnomaly ? anomalyReason : undefined,
      scores: scoresObj,
      selfSubmittedAt: selectedTeacher.currentEvaluation?.selfSubmittedAt || new Date().toLocaleString('vi-VN'),
      headApprovedAt: currentRole !== 'TEACHER' ? new Date().toLocaleString('vi-VN') : undefined,
      principalApprovedAt: currentRole === 'ADMIN_PRINCIPAL' ? new Date().toLocaleString('vi-VN') : undefined,
    };

    onUpdateTeacherEvaluation(selectedTeacher.id, updatedEval);
    setShowScoreModal(false);
    alert('Đã cập nhật kết quả đánh giá thành công!');
  };

  // Open Digital Signature Modal
  const handleOpenDigitalSignature = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowSignatureModal(true);
    setOtpCode('');
    setOtpError('');
  };

  // Confirm Digital Signature with 2FA
  const handleConfirmSignature = () => {
    if (otpCode !== '123456') {
      setOtpError('Mã OTP không đúng. Nhập "123456" để thử nghiệm!');
      return;
    }

    if (!selectedTeacher || !selectedTeacher.currentEvaluation) return;

    const hash = Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    const updatedEval: TeacherEvaluation = {
      ...selectedTeacher.currentEvaluation,
      status: 'APPROVED',
      digitalSignature: {
        signedBy: 'Hiệu trưởng Nguyễn Minh Trí (Đã ký số)',
        timestamp: new Date().toLocaleString('vi-VN'),
        hash: `SIG-${hash.toUpperCase()}`,
        otpVerified: true,
      },
    };

    onUpdateTeacherEvaluation(selectedTeacher.id, updatedEval);
    setShowSignatureModal(false);
    alert('Đã hoàn tất Ký số Phê duyệt Đánh giá thành công!');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-200">
              <ClipboardCheck className="w-3.5 h-3.5" /> Quy Trình Đánh Giá 3 Cấp
            </span>
            <span className="text-xs text-slate-500">Nghị định 90/2020/NĐ-CP • Ký số 2FA</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Quy Trình Đánh Giá 360°, Phê Duyệt & Chống Bất Thường</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tự đánh giá → Tổ trưởng chấm → BGH phê duyệt. Hệ thống tự động kích hoạt cảnh báo khi phát hiện cảm tính hoặc chênh lệch &gt; 15%.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Vai trò hiện tại: {currentRole === 'ADMIN_PRINCIPAL' ? 'Ban Giám Hiệu' : currentRole === 'HEAD_OF_DEPARTMENT' ? 'Tổ Trưởng / Tổ Phó Chuyên Môn' : 'Giáo Viên'}
          </span>
        </div>
      </div>

      {/* Appeals Panel if exists */}
      {appeals.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              Đơn Khiếu Nại / Giải Trình Đang Chờ Xử Lý ({appeals.filter(a => a.status === 'PENDING').length})
            </h3>
            <span className="text-[11px] text-amber-700 font-medium">Thời hạn đối soát: Trong vòng 7 ngày</span>
          </div>

          <div className="space-y-2">
            {appeals.map((app) => (
              <div key={app.id} className="bg-white p-3 rounded-xl border border-amber-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span>{app.teacherName}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-normal">
                      {app.submittedAt}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1 italic">"{app.reason}"</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedAppeal(app);
                      setAppealResponseNote('');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    Xem & Xử Lý
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Teacher Evaluation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Danh Sách Viên Chức THPT & Lịch Sử Đánh Giá</h3>
          <span className="text-xs text-slate-500">Tổng cộng {teachers.length} viên chức</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Mã & Họ Tên GV</th>
                <th className="py-3 px-4">Tổ Chuyên Môn</th>
                <th className="py-3 px-4 text-center">Tự Chấm</th>
                <th className="py-3 px-4 text-center">Tổ Trưởng</th>
                <th className="py-3 px-4 text-center">BGH Chấm</th>
                <th className="py-3 px-4 text-center">Thụ Động</th>
                <th className="py-3 px-4 text-center">Điểm Cuối</th>
                <th className="py-3 px-4 text-center">Xếp Loại</th>
                <th className="py-3 px-4 text-center">Trạng Thái</th>
                <th className="py-3 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((t) => {
                const evalData = t.currentEvaluation;
                const isAnomaly = evalData?.isAnomaly;
                const signed = evalData?.digitalSignature;

                return (
                  <tr key={t.id} className={`hover:bg-slate-50 transition-colors ${isAnomaly ? 'bg-rose-50/20' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={t.avatar} alt={t.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{t.fullName}</span>
                            {isAnomaly && (
                              <span title="Cảnh báo bất thường rating" className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{t.code} • {t.position}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">{t.department}</td>

                    <td className="py-3 px-4 text-center text-slate-600 font-medium">
                      {evalData?.scores['crit_1']?.selfScore || 85}đ
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-blue-700">
                      {evalData?.scores['crit_1']?.headScore || 85}đ
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-indigo-700">
                      {evalData?.scores['crit_1']?.principalScore || 85}đ
                    </td>

                    <td className={`py-3 px-4 text-center font-bold ${
                      (evalData?.passivePointsTotal || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {(evalData?.passivePointsTotal || 0) > 0 ? `+${evalData?.passivePointsTotal}` : evalData?.passivePointsTotal || 0}đ
                    </td>

                    <td className="py-3 px-4 text-center font-extrabold text-sm text-slate-900">
                      {evalData?.finalScore || 85.0}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        evalData?.classification === 'HTXSNV'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : evalData?.classification === 'HTTNV'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {evalData?.classification || 'HTTNV'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {signed ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-600" /> Đã Ký Số
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded border border-slate-200">
                          {evalData?.status === 'APPROVED' ? 'Đã duyệt' : 'Đang xử lý'}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenScoringModal(t)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Chấm Điểm</span>
                        </button>

                        {currentRole === 'ADMIN_PRINCIPAL' && !signed && (
                          <button
                            onClick={() => handleOpenDigitalSignature(t)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Ký Số</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scoring & Anomaly Review Modal */}
      {showScoreModal && selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <img src={selectedTeacher.avatar} alt={selectedTeacher.fullName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Phiếu Đánh Giá 360° - {selectedTeacher.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedTeacher.department} • {selectedTeacher.position}</p>
                </div>
              </div>
              <button
                onClick={() => setShowScoreModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Criteria Scores Input */}
            <div className="space-y-4 mb-6">
              {criteria.map((c) => {
                const s = editScores[c.id] || { self: 85, head: 85, principal: 85, comments: '' };
                const gap = Math.abs(s.head - s.principal);

                return (
                  <div key={c.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <span>{c.title} ({c.moetCode})</span>
                      <span className="text-blue-600 font-semibold">Trọng số: {c.weightPercent}%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">{c.description}</p>

                    <div className="grid grid-cols-3 gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-1">Tự Chấm (GV)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={s.self}
                          onChange={(e) => setEditScores({ ...editScores, [c.id]: { ...s, self: Number(e.target.value) } })}
                          className="w-full bg-slate-50 border border-slate-300 rounded p-1 text-center font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-blue-700 block mb-1">Tổ Trưởng / Tổ Phó Chấm</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={s.head}
                          onChange={(e) => setEditScores({ ...editScores, [c.id]: { ...s, head: Number(e.target.value) } })}
                          className="w-full bg-blue-50/50 border border-blue-300 rounded p-1 text-center font-bold text-blue-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-indigo-700 block mb-1">BGH Phê Duyệt</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={s.principal}
                          onChange={(e) => setEditScores({ ...editScores, [c.id]: { ...s, principal: Number(e.target.value) } })}
                          className="w-full bg-indigo-50/50 border border-indigo-300 rounded p-1 text-center font-bold text-indigo-900 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {gap > 15 && (
                      <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-700 font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Cảnh báo bất thường: Lệch {gap} điểm giữa Tổ chuyên môn & BGH!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI Anomaly Explanation Tool */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Phân Tích AI Chống Bất Thường Cảm Tính
                </span>
                <button
                  onClick={handleAnalyzeAnomalyClick}
                  disabled={isAnalyzingAnomaly}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-3 py-1 rounded-lg transition-all cursor-pointer"
                >
                  {isAnalyzingAnomaly ? 'Đang phân tích...' : 'Phân Tích Bằng AI'}
                </button>
              </div>

              {aiAnomalyAnalysis ? (
                <div className="text-xs text-purple-950 bg-white p-3 rounded-lg border border-purple-200 leading-relaxed font-sans">
                  {aiAnomalyAnalysis}
                </div>
              ) : (
                <p className="text-[11px] text-purple-700">
                  Nhấn nút để Gemini AI đối soát tự động dữ liệu chênh lệch điểm số với nhật ký thụ động Sổ Đầu Bài.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowScoreModal(false)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleSaveEvaluation}
                className="py-2 px-5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all cursor-pointer"
              >
                Lưu Điểm Đánh Giá
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2FA Digital Signature Modal */}
      {showSignatureModal && selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Ký Số Phê Duyệt Cuối Cùng</h3>
                <p className="text-xs text-slate-500">Giáo viên: {selectedTeacher.fullName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Điểm cuối cùng: <strong className="text-slate-900 font-bold">{selectedTeacher.currentEvaluation?.finalScore} điểm</strong> ({selectedTeacher.currentEvaluation?.classification}). Vui lòng nhập mã OTP thử nghiệm <strong className="text-emerald-700 font-bold">123456</strong> để tạo Chữ ký số gắn Timestamp.
            </p>

            <div className="space-y-3 mb-5">
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Nhập mã OTP (123456)..."
                className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                maxLength={6}
              />
              {otpError && <p className="text-xs text-rose-600 font-medium text-center">{otpError}</p>}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmSignature}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
              >
                Ký Số & Khóa Hồ Sơ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appeal Review Modal */}
      {selectedAppeal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Giải Quyết Đơn Khiếu Nại</h3>
            <p className="text-xs text-slate-500 mb-4">Giáo viên: {selectedAppeal.teacherName}</p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 mb-4">
              <strong>Nội dung khiếu nại:</strong>
              <p className="mt-1 italic">"{selectedAppeal.reason}"</p>
            </div>

            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-slate-700 block">Ý kiến phản hồi từ Ban Giám Hiệu:</label>
              <textarea
                value={appealResponseNote}
                onChange={(e) => setAppealResponseNote(e.target.value)}
                placeholder="Nhập kết luận đối soát của BGH..."
                className="w-full h-24 p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedAppeal(null)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  onResolveAppeal(selectedAppeal.id, 'REJECTED', appealResponseNote || 'BGH giữ nguyên kết quả đánh giá.');
                  setSelectedAppeal(null);
                }}
                className="py-2 px-4 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Bác Đơn Khiếu Nại
              </button>
              <button
                onClick={() => {
                  onResolveAppeal(selectedAppeal.id, 'RESOLVED', appealResponseNote || 'BGH chấp thuận điều chỉnh cộng bổ sung điểm kỷ luật.');
                  setSelectedAppeal(null);
                }}
                className="py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                Chấp Nhận Điều Chỉnh
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
