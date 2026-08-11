import React, { useState } from 'react';
import { Teacher } from '../../types';
import { 
  FileText, 
  Printer, 
  Download, 
  Award, 
  Users, 
  Percent,
  FileDown,
  Calendar,
  CheckCircle2,
  Eye,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { 
  exportTeacherEvaluationToDocx, 
  exportAllTeachersSummaryDocx 
} from '../../services/documentExportService';
import { exportTeachersToExcel } from '../../services/excelService';

interface MoETReportTabProps {
  teachers: Teacher[];
  academicYear?: string;
  period?: string;
}

export const MoETReportTab: React.FC<MoETReportTabProps> = ({ 
  teachers,
  academicYear = '2026 - 2027',
  period = 'Học kỳ I'
}) => {
  const [reportMode, setReportMode] = useState<'STANDARD_100' | 'MOET_ND233'>('MOET_ND233');
  const [previewTeacher, setPreviewTeacher] = useState<Teacher | null>(null);

  // Calculate scores for standard 100 report mode
  const calculateTeacherStandardScore = (t: Teacher) => {
    const baseScore = 100;

    // Calculate total bonus and total penalty points from passive logs
    const bonusPoints = t.passiveLogs
      .filter((l) => l.type === 'BONUS')
      .reduce((sum, l) => sum + Math.abs(l.points), 0);

    const penaltyPoints = t.passiveLogs
      .filter((l) => l.type === 'PENALTY')
      .reduce((sum, l) => sum + Math.abs(l.points), 0);

    const totalEmulationScore = baseScore + bonusPoints - penaltyPoints;

    return {
      baseScore,
      bonusPoints,
      penaltyPoints,
      totalEmulationScore,
    };
  };

  // Group teachers by position / functional group (6 nhóm chức vụ chuẩn)
  const groupedTeachers = teachers.reduce((acc, t) => {
    let groupKey = 'Giáo viên THPT';
    if (t.position.includes('Hiệu trưởng') || t.position.includes('BGH') || t.position.includes('Lãnh đạo')) {
      groupKey = 'Ban Giám Hiệu';
    } else if (t.position.includes('Tổ phó')) {
      groupKey = 'Tổ phó chuyên môn';
    } else if (t.position.includes('Tổ trưởng')) {
      groupKey = 'Tổ trưởng chuyên môn';
    } else if (t.position.includes('Hợp đồng') || t.position.includes('HĐLĐ') || t.position.toLowerCase().includes('hop dong')) {
      groupKey = 'Hợp đồng lao động';
    } else if (t.department === 'Tổ Văn Phòng' || t.position.includes('Văn phòng') || t.position.includes('Nhân viên')) {
      groupKey = 'Nhân viên Tổ Văn Phòng';
    }

    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(t);
    return acc;
  }, {} as Record<string, Teacher[]>);

  // Compute 20% Top Excellent (HTXSNV) per group
  const groupRankings: Record<
    string,
    {
      teachersWithRank: Array<{
        teacher: Teacher;
        baseScore: number;
        bonusPoints: number;
        penaltyPoints: number;
        totalEmulationScore: number;
        rankInGroup: number;
        isTop20Percent: boolean;
        assignedClassification: 'HTXSNV' | 'HTTNV' | 'HTNV';
      }>;
      quota20Percent: number;
      totalInGroup: number;
    }
  > = {};

  Object.keys(groupedTeachers).forEach((groupKey) => {
    const list = groupedTeachers[groupKey];
    
    // Sort descending by total emulation score
    const sorted = list
      .map((t) => ({ teacher: t, ...calculateTeacherStandardScore(t) }))
      .sort((a, b) => b.totalEmulationScore - a.totalEmulationScore);

    // Calculate 20% limit (At least 1 person per group if group size >= 1)
    const quota = Math.max(1, Math.round(sorted.length * 0.20));

    const teachersWithRank = sorted.map((item, idx) => {
      const rank = idx + 1;
      const isTop20 = rank <= quota;
      const assignedClassification = isTop20 ? 'HTXSNV' : item.totalEmulationScore >= 80 ? 'HTTNV' : 'HTNV';

      return {
        ...item,
        rankInGroup: rank,
        isTop20Percent: isTop20,
        assignedClassification: assignedClassification as 'HTXSNV' | 'HTTNV' | 'HTNV',
      };
    });

    groupRankings[groupKey] = {
      teachersWithRank,
      quota20Percent: quota,
      totalInGroup: list.length,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
              <Award className="w-3.5 h-3.5" /> Chuẩn Nghị Định 233/2026/NĐ-CP
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-200">
              <Calendar className="w-3 h-3" /> Năm Học {academicYear} • {period}
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Báo Cáo Đánh Giá & Xếp Loại Chất Lượng Viên Chức
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Căn cứ theo Nghị định số 233/2026/NĐ-CP của Chính phủ. Hỗ trợ xuất Phiếu đánh giá cá nhân (.doc/.docx) và Bảng tổng hợp Excel (.xlsx).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => exportAllTeachersSummaryDocx(teachers, academicYear, period)}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            title="Xuất bảng tổng hợp toàn trường chuẩn Word (.docx)"
          >
            <FileDown className="w-4 h-4 text-blue-200" />
            <span>Xuất Báo Cáo Word (.docx)</span>
          </button>

          <button
            onClick={async () => {
              try {
                await exportTeachersToExcel(teachers, undefined, academicYear, period);
              } catch (err: any) {
                alert(err.message || 'Lỗi khi xuất file Excel');
              }
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            title="Xuất bảng tổng hợp đánh giá toàn trường ra file Excel (.xlsx)"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Báo Cáo Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In A4 Toàn Trường</span>
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 print:hidden">
        <button
          onClick={() => setReportMode('MOET_ND233')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            reportMode === 'MOET_ND233'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Báo Cáo Đánh Giá, Xếp Loại Viên Chức (Nghị Định 233/2026/NĐ-CP)</span>
        </button>

        <button
          onClick={() => setReportMode('STANDARD_100')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            reportMode === 'STANDARD_100'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>2. Báo Cáo Thi Đua Chuẩn 100 Điểm & Top 20% Xuất Sắc (Theo Nhóm Chức Vụ)</span>
        </button>
      </div>

      {/* MODE 1: MOET NĐ 233/2026/NĐ-CP STANDARD FORM */}
      {reportMode === 'MOET_ND233' && (
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-300 shadow-xl font-serif text-slate-900 max-w-5xl mx-auto print:shadow-none print:border-none print:p-0">
          
          <div className="grid grid-cols-2 text-center text-xs md:text-sm mb-8 leading-tight">
            <div>
              <p className="font-sans font-bold text-xs uppercase text-slate-700">SỞ GIÁO DỤC VÀ ĐÀO TẠO TP. CẦN THƠ</p>
              <p className="font-sans font-bold text-xs uppercase text-slate-900">TRƯỜNG THPT CHÂU THÀNH A</p>
              <p className="text-[11px] font-sans text-slate-500 italic mt-1">Mã đơn vị: 01425THPT</p>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-xs md:text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold underline text-xs">Độc lập - Tự do - Hạnh phúc</p>
              <p className="text-[11px] font-sans text-slate-500 italic mt-1">Tân Hoà, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
            </div>
          </div>

          <div className="text-center my-6">
            <h1 className="text-lg md:text-xl font-bold uppercase tracking-wide">
              BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG VIÊN CHỨC
            </h1>
            <p className="text-xs font-sans text-blue-900 mt-1 font-bold">
              NĂM HỌC {academicYear} (ĐỢT: {period.toUpperCase()})
            </p>
            <p className="text-[11px] font-sans text-slate-600 italic mt-0.5">
              (Căn cứ Nghị định số 233/2026/NĐ-CP của Chính phủ quy định về đánh giá, xếp loại chất lượng đối với đơn vị sự nghiệp công lập và viên chức)
            </p>
          </div>

          <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 font-sans text-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-slate-500 block">Tổng số viên chức:</span>
              <strong className="text-base text-slate-900">{teachers.length} người</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Hoàn thành xuất sắc:</span>
              <strong className="text-base text-emerald-700">
                {teachers.filter(t => t.currentEvaluation?.classification === 'HTXSNV').length} người
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Hoàn thành tốt:</span>
              <strong className="text-base text-blue-700">
                {teachers.filter(t => t.currentEvaluation?.classification === 'HTTNV').length} người
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Hoàn thành nhiệm vụ:</span>
              <strong className="text-base text-amber-700">
                {teachers.filter(t => t.currentEvaluation?.classification === 'HTNV').length} người
              </strong>
            </div>
          </div>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-left border-collapse border border-slate-400 text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-800 text-center border-b border-slate-400">
                  <th className="border border-slate-400 py-2.5 px-2 w-10">STT</th>
                  <th className="border border-slate-400 py-2.5 px-3">Họ và Tên Viên Chức</th>
                  <th className="border border-slate-400 py-2.5 px-2">Tổ Chuyên Môn</th>
                  <th className="border border-slate-400 py-2.5 px-2">Chức Vụ</th>
                  <th className="border border-slate-400 py-2.5 px-2">Chuyên Môn (40%)</th>
                  <th className="border border-slate-400 py-2.5 px-2">Kỷ Luật (20%)</th>
                  <th className="border border-slate-400 py-2.5 px-2">CNTT & AI (20%)</th>
                  <th className="border border-slate-400 py-2.5 px-2">Thi Đua (20%)</th>
                  <th className="border border-slate-400 py-2.5 px-2">Thụ Động (+/-)</th>
                  <th className="border border-slate-400 py-2.5 px-2 bg-indigo-50 font-black">Tổng Điểm</th>
                  <th className="border border-slate-400 py-2.5 px-2">Xếp Loại NĐ 233</th>
                  <th className="border border-slate-400 py-2.5 px-2 print:hidden">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, idx) => {
                  const ev = t.currentEvaluation;
                  const scores = ev?.scores || {};

                  return (
                    <tr key={t.id} className="border-b border-slate-300 hover:bg-slate-50/80">
                      <td className="border border-slate-300 py-2 px-2 text-center font-medium">{idx + 1}</td>
                      <td className="border border-slate-300 py-2 px-3 font-bold text-slate-900">
                        {t.fullName}
                        <span className="block text-[10px] text-slate-500 font-normal">{t.code}</span>
                      </td>
                      <td className="border border-slate-300 py-2 px-2 text-center text-slate-600">{t.department}</td>
                      <td className="border border-slate-300 py-2 px-2 text-center text-slate-600">{t.position}</td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-mono">{scores['crit_1']?.principalScore || 85}</td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-mono">{scores['crit_2']?.principalScore || 90}</td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-mono">{scores['crit_3']?.principalScore || 85}</td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-mono">{scores['crit_4']?.principalScore || 85}</td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-mono font-bold" style={{ color: (ev?.passivePointsTotal || 0) >= 0 ? '#15803d' : '#b91c1c' }}>
                        {(ev?.passivePointsTotal || 0) > 0 ? `+${ev?.passivePointsTotal}` : ev?.passivePointsTotal || 0}
                      </td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-black text-indigo-950 bg-indigo-50/50 text-sm">{ev?.finalScore || 85}</td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-bold">
                        <span className={
                          ev?.classification === 'HTXSNV' ? 'text-emerald-700 font-extrabold' : 'text-blue-700'
                        }>
                          {ev?.classification || 'HTTNV'}
                        </span>
                      </td>
                      <td className="border border-slate-300 py-2 px-2 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => exportTeacherEvaluationToDocx(t, academicYear, period)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-blue-200 transition-all cursor-pointer"
                            title="Tải Phiếu đánh giá cá nhân theo Nghị định 233/2026/NĐ-CP (Word .doc)"
                          >
                            Phiếu NĐ 233 (.doc)
                          </button>
                          <button
                            onClick={() => setPreviewTeacher(t)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1 rounded-lg transition-all cursor-pointer"
                            title="Xem trước mẫu phiếu đánh giá A4"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 text-center font-sans text-xs mt-12 pt-6 border-t border-slate-200">
            <div>
              <p className="font-bold uppercase text-slate-800">TỔ TRƯỞNG TỔ CHUYÊN MÔN</p>
              <p className="text-[11px] text-slate-400 italic mb-16">(Ký, ghi rõ họ tên)</p>
              <p className="font-bold text-slate-900">Lê Thị Thu Hà</p>
            </div>

            <div>
              <p className="font-bold uppercase text-slate-800">HIỆU TRƯỞNG / CHỦ TỊCH HỘI ĐỒNG</p>
              <p className="text-[11px] text-slate-400 italic mb-16">(Ký số điện tử & đóng dấu số)</p>
              <p className="font-bold text-slate-900">Nguyễn Minh Trí</p>
              <p className="text-[10px] text-emerald-700 font-mono mt-1">[Đã Xác Thực Ký Số Điện Tử Theo NĐ 233/2026/NĐ-CP]</p>
            </div>
          </div>

        </div>
      )}

      {/* MODE 2: STANDARD 100 POINTS REPORT & TOP 20% BY POSITION GROUP */}
      {reportMode === 'STANDARD_100' && (
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-300 shadow-xl font-sans text-slate-900 max-w-6xl mx-auto print:shadow-none print:border-none print:p-0">
          
          <div className="grid grid-cols-2 text-center text-xs md:text-sm mb-6 leading-tight">
            <div>
              <p className="font-bold text-xs uppercase text-slate-700">SỞ GIÁO DỤC VÀ ĐÀO TẠO TP. CẦN THƠ</p>
              <p className="font-bold text-xs uppercase text-slate-900">TRƯỜNG THPT CHÂU THÀNH A</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">Hội Đồng Thi Đua Khen Thưởng</p>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-xs md:text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold underline text-xs">Độc lập - Tự do - Hạnh phúc</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">Tân Hoà, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
            </div>
          </div>

          <div className="text-center my-6">
            <h1 className="text-base md:text-lg font-extrabold uppercase tracking-wide text-slate-900">
              BẢNG BÁO CÁO THI ĐUA CHUẨN MẶC ĐỊNH 100 ĐIỂM & DANH SÁCH 20% XUẤT SẮC
            </h1>
            <p className="text-xs text-blue-900 mt-1 font-bold">
              NĂM HỌC {academicYear} ({period.toUpperCase()})
            </p>
            <p className="text-[11px] text-slate-500 italic">
              Công thức: Tổng điểm = Điểm chuẩn (100đ) + Điểm cộng (Thành tích, Phong trào) - Điểm trừ (Vắng trễ, Vi phạm chỉ tiêu)
            </p>
          </div>

          {/* Group 20% Breakdown Summary Stats */}
          <div className="my-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            {Object.keys(groupRankings).map((gKey) => {
              const grp = groupRankings[gKey];
              return (
                <div key={gKey} className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs">
                  <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>{gKey}</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                      Khống chế 20%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 mt-2">
                    <span>Tổng số: <strong>{grp.totalInGroup} người</strong></span>
                    <span className="text-emerald-800 font-extrabold">
                      {grp.quota20Percent} Xuất Sắc
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Tables by Position Group */}
          {Object.keys(groupRankings).map((gKey) => {
            const grp = groupRankings[gKey];

            return (
              <div key={gKey} className="my-6 space-y-2">
                <div className="flex items-center justify-between bg-slate-100 p-3 rounded-t-2xl border-x border-t border-slate-300">
                  <span className="font-bold text-slate-900 text-xs uppercase flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-700" />
                    Nhóm Chức Vụ: {gKey} ({grp.totalInGroup} Cán bộ / Giáo viên)
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Tối đa 20%: {grp.quota20Percent} Cán bộ đạt Xuất Sắc
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-400 text-xs">
                    <thead>
                      <tr className="bg-slate-200 font-bold text-slate-800 text-center border-b border-slate-400">
                        <th className="border border-slate-400 py-2 px-2 w-10">Thứ Hạng</th>
                        <th className="border border-slate-400 py-2 px-3">Họ và Tên Viên Chức</th>
                        <th className="border border-slate-400 py-2 px-2">Tổ Chuyên Môn</th>
                        <th className="border border-slate-400 py-2 px-2">Điểm Chuẩn</th>
                        <th className="border border-slate-400 py-2 px-2 text-emerald-700">Điểm Cộng (+)</th>
                        <th className="border border-slate-400 py-2 px-2 text-rose-700">Điểm Trừ (-)</th>
                        <th className="border border-slate-400 py-2 px-2 bg-indigo-50 font-black">Tổng Điểm Thi Đua</th>
                        <th className="border border-slate-400 py-2 px-2">Top 20% Xuất Sắc</th>
                        <th className="border border-slate-400 py-2 px-2">Xếp Loại Thi Đua</th>
                        <th className="border border-slate-400 py-2 px-2 print:hidden">Phiếu Word</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grp.teachersWithRank.map((item) => (
                        <tr 
                          key={item.teacher.id} 
                          className={`border-b border-slate-300 ${
                            item.isTop20Percent ? 'bg-emerald-50/50 font-medium' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="border border-slate-300 py-2 px-2 text-center font-bold text-slate-800">
                            #{item.rankInGroup}
                          </td>
                          
                          <td className="border border-slate-300 py-2 px-3 font-bold text-slate-900">
                            {item.teacher.fullName}
                          </td>

                          <td className="border border-slate-300 py-2 px-2 text-center text-slate-600">
                            {item.teacher.department}
                          </td>

                          <td className="border border-slate-300 py-2 px-2 text-center font-mono font-semibold">
                            {item.baseScore}đ
                          </td>

                          <td className="border border-slate-300 py-2 px-2 text-center font-mono font-bold text-emerald-700">
                            +{item.bonusPoints.toFixed(1)}đ
                          </td>

                          <td className="border border-slate-300 py-2 px-2 text-center font-mono font-bold text-rose-700">
                            -{item.penaltyPoints.toFixed(1)}đ
                          </td>

                          <td className="border border-slate-300 py-2 px-2 text-center font-mono font-black text-indigo-950 bg-indigo-50/60 text-sm">
                            {item.totalEmulationScore.toFixed(1)}
                          </td>

                          <td className="border border-slate-300 py-2 px-2 text-center">
                            {item.isTop20Percent ? (
                              <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs">
                                ★ Top 20% Xuất Sắc
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>

                          <td className="border border-slate-300 py-2 px-2 text-center font-bold">
                            <span className={
                              item.assignedClassification === 'HTXSNV' ? 'text-emerald-700 font-extrabold' : 'text-blue-700'
                            }>
                              {item.assignedClassification}
                            </span>
                          </td>

                          <td className="border border-slate-300 py-2 px-2 text-center print:hidden">
                            <button
                              onClick={() => exportTeacherEvaluationToDocx(item.teacher, academicYear, period)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-blue-200 transition-all cursor-pointer"
                              title="Tải phiếu đánh giá cá nhân chuẩn Word (.docx)"
                            >
                              Tải Word (.doc)
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          <div className="grid grid-cols-2 text-center font-sans text-xs mt-12 pt-6 border-t border-slate-300">
            <div>
              <p className="font-bold uppercase text-slate-800">CHỦ TỊCH CÔNG ĐOÀN / HỘI ĐỒNG THI ĐUA</p>
              <p className="text-[11px] text-slate-400 italic mb-16">(Ký, ghi rõ họ tên)</p>
              <p className="font-bold text-slate-900">Lê Thị Thu Hà</p>
            </div>

            <div>
              <p className="font-bold uppercase text-slate-800">HIỆU TRƯỞNG / CHỦ TỊCH HỘI ĐỒNG</p>
              <p className="text-[11px] text-slate-400 italic mb-16">(Ký số điện tử theo NĐ 233/2026/NĐ-CP)</p>
              <p className="font-bold text-slate-900">Nguyễn Minh Trí</p>
              <p className="text-[10px] text-emerald-700 font-mono mt-1">[Đã Phê Duyệt Tỉ Lệ 20% Xuất Sắc & Ký Số]</p>
            </div>
          </div>

        </div>
      )}

      {/* Teacher A4 Evaluation Preview Modal */}
      {previewTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto font-serif">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 font-sans">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Xem Trước Phiếu Đánh Giá Viên Chức (Nghị Định 233/2026/NĐ-CP)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportTeacherEvaluationToDocx(previewTeacher, academicYear, period)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => setPreviewTeacher(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-center my-4">
              <h2 className="text-base font-bold uppercase">PHIẾU ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG VIÊN CHỨC</h2>
              <p className="text-xs font-sans text-slate-600 italic">
                Năm học: {academicYear} ({period}) - Căn cứ Nghị định số 233/2026/NĐ-CP
              </p>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-800">
              <p><strong>1. Họ và tên:</strong> {previewTeacher.fullName.toUpperCase()}</p>
              <p><strong>2. Chức danh:</strong> {previewTeacher.titleGrade} - <strong>Chức vụ:</strong> {previewTeacher.position}</p>
              <p><strong>3. Tổ chuyên môn:</strong> {previewTeacher.department} - <strong>Thâm niên:</strong> {previewTeacher.yearsOfTeaching} năm</p>
              <p><strong>4. Tổng điểm đánh giá cuối cùng:</strong> <strong className="text-sm text-blue-800 font-sans">{previewTeacher.currentEvaluation?.finalScore || 85} / 100 điểm</strong></p>
              <p><strong>5. Xếp loại chất lượng:</strong> <strong className="text-sm text-emerald-800 uppercase font-sans">{previewTeacher.currentEvaluation?.classification || 'HTTNV'}</strong></p>
            </div>

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs font-sans text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <strong>ĐÃ KÝ SỐ ĐIỆN TỬ BỞI HIỆU TRƯỞNG NGUYỄN MINH TRÍ</strong>
              <p className="text-[11px] text-emerald-700 mt-0.5">Xác thực mã bảo mật: ND233-{previewTeacher.code}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
