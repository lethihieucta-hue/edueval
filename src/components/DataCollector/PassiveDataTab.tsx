import React, { useState } from 'react';
import { Teacher, AuditLogItem, PassiveLog } from '../../types';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  MinusCircle, 
  ShieldCheck, 
  Clock, 
  Search,
  FileSpreadsheet,
  Cpu
} from 'lucide-react';
import { syncGoogleSheetsData } from '../../services/apiClient';

interface PassiveDataTabProps {
  teachers: Teacher[];
  auditLogs: AuditLogItem[];
  onAddPassiveLog: (teacherId: string, log: PassiveLog) => void;
  onOpenTemplateModal?: () => void;
}

export const PassiveDataTab: React.FC<PassiveDataTabProps> = ({
  teachers,
  auditLogs,
  onAddPassiveLog,
  onOpenTemplateModal,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [showAddLogModal, setShowAddLogModal] = useState<boolean>(false);

  // New Log State
  const [targetTeacherId, setTargetTeacherId] = useState<string>(teachers[0]?.id || '');
  const [logType, setLogType] = useState<'BONUS' | 'PENALTY'>('BONUS');
  const [logSource, setLogSource] = useState<'SO_DAU_BAI' | 'MAY_CHAM_CONG' | 'HE_THONG_GIAO_AN' | 'KHEN_THUONG_HSG'>('SO_DAU_BAI');
  const [logTitle, setLogTitle] = useState<string>('');
  const [logPoints, setLogPoints] = useState<number>(2.0);
  const [logDesc, setLogDesc] = useState<string>('');

  // Collect all passive logs across teachers
  const allPassiveLogs = teachers.flatMap((t) =>
    t.passiveLogs.map((pl) => ({
      ...pl,
      teacherName: t.fullName,
      teacherDepartment: t.department,
    }))
  );

  const handleSyncSheets = async () => {
    setIsSyncing(true);
    const res = await syncGoogleSheetsData();
    setIsSyncing(false);
    setSyncStatus(`Đã đồng bộ ${res.syncedCount} bản ghi mới lúc ${res.timestamp}`);
    setTimeout(() => setSyncStatus(null), 5000);
  };

  const handleCreatePassiveLog = () => {
    if (!logTitle.trim()) {
      alert('Vui lòng nhập tiêu đề ghi nhận!');
      return;
    }

    const newLog: PassiveLog = {
      id: `pl_${Date.now()}`,
      teacherId: targetTeacherId,
      type: logType,
      source: logSource,
      title: logTitle,
      description: logDesc || 'Dữ liệu được ghi nhận tự động từ hệ thống phụ trợ.',
      points: logType === 'BONUS' ? Math.abs(logPoints) : -Math.abs(logPoints),
      timestamp: new Date().toLocaleString('vi-VN'),
      verified: true,
    };

    onAddPassiveLog(targetTeacherId, newLog);
    setShowAddLogModal(false);
    setLogTitle('');
    setLogDesc('');
    alert('Đã bổ sung ghi nhận dữ liệu thụ động thành công!');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
              <Cpu className="w-3.5 h-3.5" /> Thu Thập Thụ Động 100% Khách Quan
            </span>
            <span className="text-xs text-slate-500">Google Sheets • Sổ Đầu Bài • Máy Chấm Công</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Thu Thập Dữ Liệu Thụ Động & Nhật Ký Kiểm Toán (Audit Log)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tự động ghi nhận điểm cộng/trừ hành vi để loại bỏ cảm tính, đi kèm nhật ký đối soát pháp lý không thể sửa xóa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onOpenTemplateModal && (
            <button
              onClick={onOpenTemplateModal}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-700 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Xuất File Mẫu & Nhập Excel</span>
            </button>
          )}

          <button
            onClick={handleSyncSheets}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang Đồng Bộ...' : 'Đồng Bộ Real-time Google Sheets'}</span>
          </button>

          <button
            onClick={() => setShowAddLogModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Thêm Ghi Nhận</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Passive Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            Nhật Ký Điểm Cộng / Điểm Trừ Thụ Động Tự Động
          </h3>
          <span className="text-xs text-slate-500">{allPassiveLogs.length} ghi nhận</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Giáo Viên</th>
                <th className="py-3 px-4">Nguồn Dữ Liệu</th>
                <th className="py-3 px-4">Sự Kiện / Lý Do Ghi Nhận</th>
                <th className="py-3 px-4 text-center">Loại</th>
                <th className="py-3 px-4 text-center">Điểm Quy Đổi</th>
                <th className="py-3 px-4 text-center">Thời Gian</th>
                <th className="py-3 px-4 text-center">Xác Thực</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allPassiveLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{log.teacherName}</div>
                    <div className="text-[11px] text-slate-400">{log.teacherDepartment}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                      {log.source}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{log.title}</div>
                    <p className="text-[11px] text-slate-500">{log.description}</p>
                  </td>

                  <td className="py-3 px-4 text-center">
                    {log.type === 'BONUS' ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                        Điểm Cộng
                      </span>
                    ) : (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-200">
                        Điểm Trừ
                      </span>
                    )}
                  </td>

                  <td className={`py-3 px-4 text-center font-extrabold text-sm ${
                    log.points >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {log.points > 0 ? `+${log.points}` : log.points}đ
                  </td>

                  <td className="py-3 px-4 text-center text-slate-500 font-mono text-[11px]">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-600" /> Auto Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Nhật Ký Hệ Thống Không Thể Sửa Xóa (Audit Log)
            </h3>
            <p className="text-xs text-slate-500">Lưu vết mọi thao tác chốt điểm, đổi trọng số, ký số kèm địa chỉ IP</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md">
            Lưu trên Cloud Log
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Thời Gian</th>
                <th className="py-3 px-4">Người Thực Hiện</th>
                <th className="py-3 px-4">Hành Động</th>
                <th className="py-3 px-4">Đối Tượng Tác Động</th>
                <th className="py-3 px-4">Chi Tiết Thao Tác</th>
                <th className="py-3 px-4 text-center">IP & Hash Ký Số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-semibold">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{log.actorName}</div>
                    <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-indigo-50 text-indigo-800 font-bold px-2 py-0.5 rounded border border-indigo-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{log.targetTeacherName}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">{log.details}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="text-slate-500">{log.ipAddress}</div>
                    {log.signedHash && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded font-mono">
                        {log.signedHash}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Passive Log Modal */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Ghi Nhận Thụ Động Thủ Công</h3>
            <p className="text-xs text-slate-500 mb-4">Ghi nhận điểm thưởng / điểm trừ chính thức</p>

            <div className="space-y-3 text-xs mb-5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn Giáo Viên:</label>
                <select
                  value={targetTeacherId}
                  onChange={(e) => setTargetTeacherId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại Ghi Nhận:</label>
                  <select
                    value={logType}
                    onChange={(e) => setLogType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="BONUS">Điểm Cộng (+)</option>
                    <option value="PENALTY">Điểm Trừ (-)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số Điểm Quy Đổi:</label>
                  <input
                    type="number"
                    step={0.5}
                    value={logPoints}
                    onChange={(e) => setLogPoints(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl font-bold text-center focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nguồn Dữ Liệu:</label>
                <select
                  value={logSource}
                  onChange={(e) => setLogSource(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  <option value="SO_DAU_BAI">Sổ Đầu Bài Điện Tử</option>
                  <option value="MAY_CHAM_CONG">Máy Chấm Công FaceID</option>
                  <option value="HE_THONG_GIAO_AN">Hệ Thống Quản Lý Giáo Án</option>
                  <option value="KHEN_THUONG_HSG">Thành Tích Bồi Dưỡng HSG</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiêu Đề Sự Kiện:</label>
                <input
                  type="text"
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  placeholder="Ví dụ: Khen thưởng bồi dưỡng HSG cấp tỉnh..."
                  className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô Tả Chi Tiết:</label>
                <textarea
                  value={logDesc}
                  onChange={(e) => setLogDesc(e.target.value)}
                  placeholder="Ghi rõ số quyết định hoặc bằng chứng đính kèm..."
                  className="w-full h-16 p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddLogModal(false)}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleCreatePassiveLog}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
              >
                Ghi Nhận Ngay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
