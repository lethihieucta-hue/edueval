import React, { useState } from 'react';
import { WeightMatrix, EvaluationCriteria, Teacher, SandboxSimulationResult, AssessmentClassification } from '../../types';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Info,
  Sparkles,
  Lock
} from 'lucide-react';

interface WeightMatrixSandboxTabProps {
  weightMatrices: WeightMatrix[];
  activeMatrix: WeightMatrix;
  setActiveMatrix: (matrix: WeightMatrix) => void;
  criteria: EvaluationCriteria[];
  teachers: Teacher[];
  onApplyMatrixToSystem: (matrix: WeightMatrix) => void;
}

export const WeightMatrixSandboxTab: React.FC<WeightMatrixSandboxTabProps> = ({
  weightMatrices,
  activeMatrix,
  setActiveMatrix,
  criteria,
  teachers,
  onApplyMatrixToSystem,
}) => {
  // Temporary weight state for Sandbox editing
  const [chuyenMonW, setChuyenMonW] = useState<number>(activeMatrix.chuyenMonWeight);
  const [daoDucW, setDaoDucW] = useState<number>(activeMatrix.daoDucWeight);
  const [doiMoiW, setDoiMoiW] = useState<number>(activeMatrix.doiMoiCnttWeight);
  const [thiDuaW, setThiDuaW] = useState<number>(activeMatrix.thiDuaWeight);

  const [sandboxResults, setSandboxResults] = useState<SandboxSimulationResult[] | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  const totalWeight = chuyenMonW + daoDucW + doiMoiW + thiDuaW;

  // Select a preset
  const handleSelectPreset = (m: WeightMatrix) => {
    setActiveMatrix(m);
    setChuyenMonW(m.chuyenMonWeight);
    setDaoDucW(m.daoDucWeight);
    setDoiMoiW(m.doiMoiCnttWeight);
    setThiDuaW(m.thiDuaWeight);
    setSandboxResults(null);
  };

  // Helper score classification according to MoET rules
  const getClassificationByScore = (score: number): AssessmentClassification => {
    if (score >= 90) return 'HTXSNV';
    if (score >= 75) return 'HTTNV';
    if (score >= 60) return 'HTNV';
    return 'CHT';
  };

  // Run Sandbox Simulation Engine
  const handleRunSimulation = () => {
    if (totalWeight !== 100) {
      alert('Tổng trọng số phải bằng đúng 100%. Vui lòng điều chỉnh lại thanh trượt!');
      return;
    }

    setIsSimulating(true);

    setTimeout(() => {
      const results: SandboxSimulationResult[] = teachers.map((teacher) => {
        const evalData = teacher.currentEvaluation;
        const scores = evalData?.scores || {};

        const s1 = scores['crit_1']?.headScore ?? 85;
        const s2 = scores['crit_2']?.headScore ?? 90;
        const s3 = scores['crit_3']?.headScore ?? 85;
        const s4 = scores['crit_4']?.headScore ?? 85;

        // Old score calculation with active matrix
        const oldScore = evalData?.finalScore ?? 85;
        const oldClassification = evalData?.classification ?? 'HTTNV';

        // New score calculation with Sandbox weight
        const rawNew = (s1 * chuyenMonW + s2 * daoDucW + s3 * doiMoiW + s4 * thiDuaW) / 100;
        const passiveTotal = evalData?.passivePointsTotal ?? 0;
        const newScore = Math.min(100, Math.max(0, parseFloat((rawNew + passiveTotal).toFixed(1))));
        const newClassification = getClassificationByScore(newScore);

        return {
          teacherId: teacher.id,
          teacherName: teacher.fullName,
          department: teacher.department,
          oldScore,
          oldClassification,
          newScore,
          newClassification,
          changed: oldClassification !== newClassification,
          scoreDiff: parseFloat((newScore - oldScore).toFixed(1)),
        };
      });

      setSandboxResults(results);
      setIsSimulating(false);
    }, 600);
  };

  const handleOpenOtpModal = () => {
    if (totalWeight !== 100) {
      alert('Tổng trọng số phải bằng 100% mới được áp dụng!');
      return;
    }
    setShowOtpModal(true);
    setOtpInput('');
    setOtpError('');
  };

  const handleConfirmApply = () => {
    if (otpInput.trim() !== '123456') {
      setOtpError('Mã OTP không đúng. Vui lòng nhập mã thử nghiệm "123456"!');
      return;
    }

    const updatedMatrix: WeightMatrix = {
      ...activeMatrix,
      chuyenMonWeight: chuyenMonW,
      daoDucWeight: daoDucW,
      doiMoiCnttWeight: doiMoiW,
      thiDuaWeight: thiDuaW,
      isActive: true,
      note: `Đã cập nhật cấu hình ma trận trọng số mới lúc ${new Date().toLocaleTimeString('vi-VN')}`
    };

    onApplyMatrixToSystem(updatedMatrix);
    setShowOtpModal(false);
    alert('Đã áp dụng ma trận trọng số mới thành công vào toàn bộ hệ thống!');
  };

  const upgradedCount = sandboxResults?.filter((r) => r.scoreDiff > 0 && r.changed).length || 0;
  const downgradedCount = sandboxResults?.filter((r) => r.scoreDiff < 0 && r.changed).length || 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-purple-200">
              <Sliders className="w-3.5 h-3.5" /> Mô Phỏng Sandbox
            </span>
            <span className="text-xs text-slate-500">Quy định Nghị định 90/2020/NĐ-CP</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Thiết Lập Ma Trận Trọng Số & Giả Lập Xếp Loại (Sandbox)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mô phỏng tức thì tác động của việc thay đổi trọng số lên kết quả phân loại thi đua viên chức trước khi chính thức chốt điểm.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-slate-600">Khung trọng số:</span>
          <select
            value={activeMatrix.id}
            onChange={(e) => {
              const found = weightMatrices.find((m) => m.id === e.target.value);
              if (found) handleSelectPreset(found);
            }}
            className="bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {weightMatrices.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} {m.isActive ? '(Đang áp dụng)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Sandbox Controls & Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sliders Box */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Tùy Chỉnh Trọng Số (% Tỉ Trọng)
            </h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              totalWeight === 100 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
            }`}>
              Tổng: {totalWeight}%
            </span>
          </div>

          {totalWeight !== 100 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Tổng trọng số phải bằng đúng 100% để chạy mô phỏng chính xác.</span>
            </div>
          )}

          {/* Slider 1: Chuyên môn */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>1. Kế hoạch & Chuyên môn</span>
              <span className="text-blue-600 font-bold">{chuyenMonW}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={chuyenMonW}
              onChange={(e) => setChuyenMonW(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[11px] text-slate-400">Giảng dạy, giáo án, tiến độ chương trình</p>
          </div>

          {/* Slider 2: Đạo đức kỷ luật */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>2. Tư tưởng, Đạo đức & Kỷ luật</span>
              <span className="text-blue-600 font-bold">{daoDucW}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={40}
              step={5}
              value={daoDucW}
              onChange={(e) => setDaoDucW(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[11px] text-slate-400">Chấp hành nội quy, đúng giờ lên lớp</p>
          </div>

          {/* Slider 3: Đổi mới CNTT */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>3. Đổi mới, CNTT & AI Sư phạm</span>
              <span className="text-purple-600 font-bold">{doiMoiW}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={doiMoiW}
              onChange={(e) => setDoiMoiW(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <p className="text-[11px] text-slate-400">Bài giảng E-learning, ứng dụng công nghệ số</p>
          </div>

          {/* Slider 4: Phong trào thi đua */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>4. Phong trào Thi đua & HSG</span>
              <span className="text-amber-600 font-bold">{thiDuaW}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={thiDuaW}
              onChange={(e) => setThiDuaW(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <p className="text-[11px] text-slate-400">Bồi dưỡng HSG, chủ nhiệm, hội thao</p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 space-y-2 border-t border-slate-100">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating || totalWeight !== 100}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-white ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Đang Tính Toán Sandbox...' : '⚡ Chạy Giả Lập Mô Phỏng Sandbox'}</span>
            </button>

            <button
              onClick={handleOpenOtpModal}
              disabled={totalWeight !== 100}
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Chính Thức Áp Dụng Ma Trận Này</span>
            </button>
          </div>
        </div>

        {/* Sandbox Results Display Area */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Kết Quả Giả Lập Xếp Loại Toàn Trường
                </h3>
                <p className="text-xs text-slate-500">So sánh phân loại Trước vs. Sau khi áp dụng trọng số Sandbox</p>
              </div>

              {sandboxResults && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +{upgradedCount} Thăng hạng
                  </span>
                  {downgradedCount > 0 && (
                    <span className="bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-md border border-rose-200 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" /> -{downgradedCount} Giảm hạng
                    </span>
                  )}
                </div>
              )}
            </div>

            {!sandboxResults ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
                <Sliders className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-bounce" />
                <h4 className="text-sm font-bold text-slate-700 mb-1">Chưa Chạy Giả Lập Sandbox</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Vui lòng điều chỉnh thanh trượt tỉ lệ phần trăm bên trái và nhấn nút <strong>"⚡ Chạy Giả Lập Mô Phỏng Sandbox"</strong> để xem kết quả.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">Giáo Viên</th>
                      <th className="py-2.5 px-3">Tổ Chuyên Môn</th>
                      <th className="py-2.5 px-3 text-center">Hiện Tại</th>
                      <th className="py-2.5 px-3 text-center">Sandbox Mới</th>
                      <th className="py-2.5 px-3 text-center">Chênh Lệch</th>
                      <th className="py-2.5 px-3 text-center">Tác Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sandboxResults.map((r) => (
                      <tr key={r.teacherId} className={`hover:bg-slate-50/80 transition-colors ${r.changed ? 'bg-amber-50/20' : ''}`}>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{r.teacherName}</td>
                        <td className="py-2.5 px-3 text-slate-500">{r.department}</td>
                        <td className="py-2.5 px-3 text-center font-medium text-slate-700">
                          {r.oldScore}đ ({r.oldClassification})
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-indigo-700">
                          {r.newScore}đ ({r.newClassification})
                        </td>
                        <td className={`py-2.5 px-3 text-center font-bold ${
                          r.scoreDiff > 0 ? 'text-emerald-600' : r.scoreDiff < 0 ? 'text-rose-600' : 'text-slate-400'
                        }`}>
                          {r.scoreDiff > 0 ? `+${r.scoreDiff}` : r.scoreDiff}đ
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {r.changed ? (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              r.scoreDiff > 0 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                : 'bg-rose-100 text-rose-800 border-rose-200'
                            }`}>
                              {r.scoreDiff > 0 ? 'Thăng Hạng' : 'Giảm Hạng'}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                              Giữ Nguyên
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              Tính năng Sandbox đảm bảo tuyệt đối không làm ghi đè dữ liệu thật cho đến khi Admin xác nhận bằng OTP.
            </span>
          </div>
        </div>

      </div>

      {/* OTP Confirmation Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác Thực 2 Lớp Bằng OTP</h3>
                <p className="text-xs text-slate-500">Ký số phê duyệt cập nhật Ma trận Trọng số</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Mã xác thực OTP vừa được hệ thống gửi tới thiết bị BGH. Vui lòng nhập mã thử nghiệm <strong className="text-emerald-700 font-bold">123456</strong> để lưu chính thức.
            </p>

            <div className="space-y-3 mb-5">
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Nhập mã OTP (123456)..."
                className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                maxLength={6}
              />
              {otpError && <p className="text-xs text-rose-600 font-medium text-center">{otpError}</p>}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmApply}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
              >
                Xác Nhận & Lưu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
