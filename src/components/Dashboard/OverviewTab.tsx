import React from 'react';
import { Teacher, Role } from '../../types';
import { 
  Users, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  TrendingDown, 
  Send,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface OverviewTabProps {
  teachers: Teacher[];
  currentRole: Role;
  onOpenAIChat: () => void;
  onSelectTeacherForIDP: (teacher: Teacher) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  teachers,
  currentRole,
  onOpenAIChat,
  onSelectTeacherForIDP,
}) => {
  // Calculate Key Stats
  const totalTeachers = teachers.length;
  const htxsCount = teachers.filter((t) => t.currentEvaluation?.classification === 'HTXSNV').length;
  const httnCount = teachers.filter((t) => t.currentEvaluation?.classification === 'HTTNV').length;
  const htnvCount = teachers.filter((t) => t.currentEvaluation?.classification === 'HTNV').length;
  const chtCount = teachers.filter((t) => t.currentEvaluation?.classification === 'CHT').length;

  const anomalyTeachers = teachers.filter((t) => t.currentEvaluation?.isAnomaly);
  const performanceDipTeachers = teachers.filter((t) => {
    const trend = t.performanceTrend || [];
    if (trend.length < 3) return false;
    const last3 = trend.slice(-3);
    return last3[0].score > last3[1].score && last3[1].score > last3[2].score;
  });

  const avgScore = (
    teachers.reduce((acc, t) => acc + (t.currentEvaluation?.finalScore || 85), 0) / totalTeachers
  ).toFixed(1);

  // Radar Data across 5 core dimensions
  const radarDimensions = [
    'Phẩm chất nhà giáo',
    'Phát triển chuyên môn',
    'Năng lực sư phạm',
    'Ứng dụng CNTT & AI',
    'Xây dựng môi trường & Thi đua'
  ];

  const radarData = radarDimensions.map((dim) => {
    const scores = teachers.map((t) => {
      const match = t.skillDimensions.find((s) => s.dimensionName === dim);
      return match ? match.score : 80;
    });
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return {
      dimension: dim,
      Thực_Tế: avg,
      Chỉ_Tiêu_Mục_Tiêu: 88,
    };
  });

  // Emulation Heatmap / Department Comparison
  const departmentScores = [
    { name: 'Tổ Toán', avgScore: 92.4, htxsPct: 50 },
    { name: 'Tổ Văn - GDKTPL', avgScore: 90.1, htxsPct: 40 },
    { name: 'Tổ Hoá - Sinh', avgScore: 89.5, htxsPct: 35 },
    { name: 'Tổ Sử - Địa - Anh Văn', avgScore: 91.0, htxsPct: 45 },
    { name: 'Tổ Lý - TD - QP', avgScore: 88.5, htxsPct: 35 },
    { name: 'Tổ Tin - Công nghệ', avgScore: 93.0, htxsPct: 55 },
    { name: 'Tổ Văn Phòng', avgScore: 90.0, htxsPct: 40 }
  ];

  // Send Alert Mock
  const handleSendZaloAlert = (teacherName: string) => {
    alert(`[Mô phỏng Zalo/Telegram Bot] Đã gửi thông báo cảnh báo "Cần hỗ trợ giáo viên ${teacherName} do sụt giảm chỉ số 3 tuần liên tiếp" tới Tổ trưởng chuyên môn và BGH!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick AI Trigger */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Dữ liệu Real-time
              </span>
              <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                Bộ GD&ĐT THPT
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Báo Cáo Tổng Quan Đánh Giá Viên Chức
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Tự động hóa đối soát 360°, phát hiện cảnh báo bất thường cảm tính và khai vấn phát triển cá nhân (IDP).
            </p>
          </div>

          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 text-xs cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Hỏi Chuyên Gia AI Consultant</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Tổng Viên Chức</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalTeachers}</div>
          <p className="text-[11px] text-slate-500 mt-1">Đã cập nhật đủ hồ sơ</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs mb-2 font-medium">
            <span>Hoàn Thành Xuất Sắc (HTXSNV)</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800">{htxsCount} <span className="text-xs font-normal text-emerald-600">({Math.round((htxsCount / totalTeachers) * 100)}%)</span></div>
          <p className="text-[11px] text-emerald-600 mt-1">Đạt chỉ tiêu kế hoạch</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between text-blue-700 text-xs mb-2 font-medium">
            <span>Hoàn Thành Tốt (HTTNV)</span>
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-800">{httnCount} <span className="text-xs font-normal text-blue-600">({Math.round((httnCount / totalTeachers) * 100)}%)</span></div>
          <p className="text-[11px] text-blue-600 mt-1">Chưa có vi phạm</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 text-xs mb-2 font-semibold">
            <span>Cảnh Báo Bất Thường</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-800">{anomalyTeachers.length}</div>
          <p className="text-[11px] text-rose-600 mt-1">Chênh lệch rating &gt; 15%</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart: 5 Khung năng lực */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-indigo-600" />
                Khung Năng Lực 360° (Biểu Đồ Radar)
              </h3>
              <p className="text-xs text-slate-500">So sánh điểm trung bình thực tế vs Chỉ tiêu nhà trường</p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-1 rounded-md border border-indigo-100">
              5 Chiều
            </span>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#475569', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Thực Tế Toàn Trường" dataKey="Thực_Tế" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Chỉ Tiêu Mục Tiêu" dataKey="Chỉ_Tiêu_Mục_Tiêu" stroke="#10b981" fill="#34d399" fillOpacity={0.2} />
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 mt-2 flex items-center justify-between">
            <span>Mặt bằng năng lực CNTT & AI toàn trường:</span>
            <strong className="text-indigo-700 font-bold">81.5 / 100 điểm</strong>
          </div>
        </div>

        {/* Bar Chart: So sánh Điểm Thi đua giữa các Tổ chuyên môn */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Điểm Thi Đua Theo Tổ Chuyên Môn
              </h3>
              <p className="text-xs text-slate-500">Đối soát tiến độ giữa 6 Tổ bộ môn THPT</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-1 rounded-md border border-emerald-100">
              Học Kỳ I
            </span>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentScores} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[60, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="avgScore" name="Điểm TB Thi Đua" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 mt-2 flex items-center justify-between">
            <span>Tổ thi đua dẫn đầu:</span>
            <strong className="text-emerald-900 font-bold">Tổ Toán & Tổ Sử-Địa-GDCD (92.4 điểm)</strong>
          </div>
        </div>

      </div>

      {/* Early Warning & Performance Dip Alert Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              Cảnh Báo Sớm: Giáo Viên Cần Hỗ Trợ (Performance Dip Warnings)
            </h3>
            <p className="text-xs text-slate-500">Tự động phát hiện khi chỉ số hiệu suất sụt giảm liên tục 3 tuần trở lên</p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
            {performanceDipTeachers.length} Cảnh báo active
          </span>
        </div>

        {performanceDipTeachers.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            Không phát hiện sự sụt giảm phong độ bất thường ở giáo viên nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceDipTeachers.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.fullName} className="w-10 h-10 rounded-full object-cover border border-amber-300" />
                      <div>
                        <div className="font-bold text-xs text-slate-900">{t.fullName}</div>
                        <div className="text-[11px] text-slate-500">{t.department} • {t.position}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200">
                      Sụt giảm 3 tuần
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 mb-3">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Xu hướng điểm 4 tuần gần nhất:</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      {t.performanceTrend.map((pt, idx) => (
                        <span key={idx} className={idx === t.performanceTrend.length - 1 ? 'text-rose-600 font-bold' : ''}>
                          {pt.period}: {pt.score}đ {idx < t.performanceTrend.length - 1 && '→'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
                  <button
                    onClick={() => handleSendZaloAlert(t.fullName)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Cảnh Báo Zalo/Telegram</span>
                  </button>

                  <button
                    onClick={() => onSelectTeacherForIDP(t)}
                    className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium py-1.5 px-3 rounded-lg border border-indigo-200 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Xem Lộ Trình IDP</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
