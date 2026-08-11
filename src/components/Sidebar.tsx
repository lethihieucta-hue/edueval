import React from 'react';
import { 
  BarChart3, 
  Sliders, 
  ClipboardCheck, 
  Database, 
  FolderGit2, 
  FileText, 
  AlertTriangle,
  Award,
  BookOpen,
  Users,
  Flag,
  Clock,
  ShieldCheck
} from 'lucide-react';

export type TabType = 
  | 'overview' 
  | 'admin_dept_staff'
  | 'movements_awards'
  | 'attendance_tardiness'
  | 'self_declaration'
  | 'matrix_sandbox' 
  | 'evaluation_360' 
  | 'passive_collector' 
  | 'portfolio_idp' 
  | 'moet_reports';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  anomalyCount: number;
  pendingApprovalsCount: number;
  academicYear?: string;
  period?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  anomalyCount,
  pendingApprovalsCount,
  academicYear = '2026 - 2027',
  period = 'Học kỳ I'
}) => {
  const menuItems = [
    {
      id: 'overview' as TabType,
      label: 'Tổng Quan & Analytics',
      sublabel: 'Radar 360°, Heatmap & KPIs',
      icon: BarChart3,
    },
    {
      id: 'admin_dept_staff' as TabType,
      label: 'Quản Lý Tổ & Tổ Viên',
      sublabel: 'Danh sách tổ chuyên môn & GV',
      icon: Users,
    },
    {
      id: 'movements_awards' as TabType,
      label: 'Phong Trào & Điểm Giải',
      sublabel: 'Cập nhật phong trào, mức điểm',
      icon: Flag,
    },
    {
      id: 'attendance_tardiness' as TabType,
      label: 'Chuyên Cần & Kỷ Luật',
      sublabel: 'Đi trễ, bỏ tiết, vi phạm nếp sống',
      icon: Clock,
    },
    {
      id: 'self_declaration' as TabType,
      label: 'Tự Kê Khai & Duyệt 2 Lớp',
      sublabel: 'GV kê khai & Tổ trưởng/BGH duyệt',
      icon: ShieldCheck,
    },
    {
      id: 'matrix_sandbox' as TabType,
      label: 'Trọng Số & Sandbox',
      sublabel: 'Điều chỉnh & Giả lập kết quả',
      icon: Sliders,
    },
    {
      id: 'evaluation_360' as TabType,
      label: 'Đánh Giá 360° & Phê Duyệt',
      sublabel: 'Cảnh báo bất thường, Ký số',
      icon: ClipboardCheck,
      badge: anomalyCount > 0 ? { count: anomalyCount, color: 'bg-rose-500' } : (pendingApprovalsCount > 0 ? { count: pendingApprovalsCount, color: 'bg-amber-500' } : undefined)
    },
    {
      id: 'passive_collector' as TabType,
      label: 'Thu Thập Thụ Động & Log',
      sublabel: 'Sổ đầu bài, Chấm công, Audit Log',
      icon: Database,
    },
    {
      id: 'portfolio_idp' as TabType,
      label: 'Hồ Sơ Số & AI Coaching IDP',
      sublabel: 'Minh chứng & Lộ trình phát triển',
      icon: FolderGit2,
    },
    {
      id: 'moet_reports' as TabType,
      label: 'Báo Cáo Chuẩn Bộ GD&ĐT',
      sublabel: 'Nghị định 233/2026/NĐ-CP & In file',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200 shrink-0 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Academic Year Info Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs mb-1">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>NĂM HỌC {academicYear}</span>
          </div>
          <p className="text-[11px] text-slate-500">Đợt đánh giá: <strong className="text-slate-700 font-semibold">{period}</strong></p>
          <div className="mt-2 text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium border border-blue-100 flex items-center justify-between">
            <span>Chuẩn đánh giá:</span>
            <span className="font-bold">NĐ 233/2026</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Phân Hệ Quản Trị & Đánh Giá
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold leading-snug">{item.label}</div>
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5">{item.sublabel}</div>
                  </div>
                </div>

                {item.badge && (
                  <span className={`${item.badge.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs shrink-0 ml-1`}>
                    {item.badge.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200 mt-6 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-1">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-slate-700">Trường THPT Đạt Chuẩn QG</span>
        </div>
        <p className="text-[10px] text-slate-400">Phiên bản Hệ thống v3.8 - Chống Bất Thường AI</p>
      </div>
    </aside>
  );
};
