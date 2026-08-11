import React, { useState } from 'react';
import { Role, UserAccount } from '../types';
import { 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  RefreshCw, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Key,
  Calendar,
  Users,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { SUPPORTED_ACADEMIC_YEARS, EVALUATION_PERIODS } from '../utils/academicYear';

interface NavbarProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: UserAccount | null;
  onOpenLoginModal: () => void;
  onOpenAccountManager: () => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  academicYear: string;
  setAcademicYear: (year: string) => void;
  period: string;
  setPeriod: (period: string) => void;
  onOpenAIChat: () => void;
  onSyncSheets: () => void;
  isSyncing: boolean;
  anomalyCount: number;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

const DEPARTMENTS: string[] = [
  'Tất cả Tổ chuyên môn',
  'Tổ Toán',
  'Tổ Văn - GDKTPL',
  'Tổ Hoá - Sinh',
  'Tổ Sử - Địa - Anh Văn',
  'Tổ Lý - TD - QP',
  'Tổ Tin - Công nghệ',
  'Tổ Văn Phòng'
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  currentUser,
  onOpenLoginModal,
  onOpenAccountManager,
  selectedDepartment,
  setSelectedDepartment,
  searchQuery,
  setSearchQuery,
  academicYear,
  setAcademicYear,
  period,
  setPeriod,
  onOpenAIChat,
  onSyncSheets,
  isSyncing,
  anomalyCount,
  onOpenApiKeyModal,
  hasApiKey,
}) => {
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleSyncClick = async () => {
    onSyncSheets();
    setSyncToast('Đã đồng bộ dữ liệu Real-time thành công từ Google Sheets Sổ Đầu Bài & Chấm công!');
    setTimeout(() => setSyncToast(null), 3500);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-lg">
      {/* Top Notification Toast if Synced */}
      {syncToast && (
        <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 transition-all">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  EduEval
                </span>
                <span className="hidden sm:inline font-semibold text-xs text-slate-300">
                  • THPT CHÂU THÀNH A
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  NĐ 233/2026
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400">Hệ Thống 70 Tài Khoản Đánh Giá Viên Chức</p>
            </div>
          </div>

          {/* Academic Year & Period Selector Controls */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2 py-1 rounded-xl shrink-0">
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-semibold text-slate-300 hidden md:inline">Năm học:</span>
            </div>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-blue-300 font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
              title="Chọn năm học đánh giá"
            >
              {SUPPORTED_ACADEMIC_YEARS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr} {yr === '2026 - 2027' ? '(Hiện tại)' : yr === '2027 - 2028' ? '(Kế tiếp)' : ''}
                </option>
              ))}
            </select>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
              title="Chọn đợt đánh giá"
            >
              {EVALUATION_PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Search & Dept Filter */}
          <div className="hidden xl:flex items-center gap-2 flex-1 max-w-xs mx-1">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm giáo viên..."
                className="w-full pl-8 pr-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 transition-all cursor-pointer shrink-0 max-w-[130px]"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Action Tools & Logged User Info */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* MANDATORY API KEY BUTTON (Theo AI_INSTRUCTIONS.md mục 2) */}
            <button
              onClick={onOpenApiKeyModal}
              title="Cài đặt API Key Gemini để sử dụng toàn bộ tính năng AI"
              className="hidden lg:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700 transition-all active:scale-95 cursor-pointer shadow-xs group"
            >
              <div className="relative">
                <Key className={`w-4 h-4 ${hasApiKey ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`} />
                {!hasApiKey && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                )}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-slate-400 font-medium">Settings (API Key)</span>
                <span className="text-rose-500 font-extrabold text-[11px] group-hover:underline flex items-center gap-1">
                  Lấy API key để sử dụng app
                  {hasApiKey && <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-normal px-1 py-0.2 rounded border border-emerald-500/30">✓ Đã có Key</span>}
                </span>
              </div>
            </button>

            {/* AI EdTech Consultant Button */}
            <button
              onClick={onOpenAIChat}
              className="hidden sm:flex items-center gap-1.5 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-3 py-2 rounded-xl shadow-md shadow-indigo-500/20 border border-indigo-400/30 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Consultant</span>
              {anomalyCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                  {anomalyCount}
                </span>
              )}
            </button>

            {/* 70 Accounts Manager Button (For Admin/BGH or quick access) */}
            <button
              onClick={onOpenAccountManager}
              title="Quản lý & Xuất danh sách 70 tài khoản giáo viên"
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-2.5 py-1.5 rounded-xl border border-slate-700 transition-all active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span className="hidden md:inline">70 Tài Khoản</span>
            </button>

            {/* Active User Pill & Login/Switch Account Trigger */}
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 p-1 pl-2.5 rounded-2xl">
              <div 
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 cursor-pointer group"
                title="Bấm để đổi tài khoản hoặc đăng nhập tài khoản khác"
              >
                <div className="flex flex-col text-right leading-tight">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors flex items-center justify-end gap-1">
                    {currentUser ? currentUser.fullName : 'Chưa đăng nhập'}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </span>
                  <span className={`text-[10px] font-bold ${
                    currentUser?.role === 'ADMIN_PRINCIPAL' 
                      ? 'text-purple-400' 
                      : currentUser?.role === 'HEAD_OF_DEPARTMENT'
                      ? 'text-blue-400'
                      : 'text-emerald-400'
                  }`}>
                    {currentUser?.role === 'ADMIN_PRINCIPAL' ? 'BGH / Hiệu Trưởng' : (currentUser?.role === 'HEAD_OF_DEPARTMENT' ? `${currentUser.department} (Tổ Trưởng)` : 'Giáo Viên Cá Nhân')}
                  </span>
                </div>

                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm ${
                  currentUser?.role === 'ADMIN_PRINCIPAL'
                    ? 'bg-purple-600'
                    : currentUser?.role === 'HEAD_OF_DEPARTMENT'
                    ? 'bg-blue-600'
                    : 'bg-emerald-600'
                }`}>
                  {currentUser ? currentUser.fullName.slice(0, 1) : <User className="w-4 h-4" />}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
