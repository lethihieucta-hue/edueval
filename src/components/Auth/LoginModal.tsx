import React, { useState } from 'react';
import { UserAccount, Role, Department } from '../../types';
import { 
  Lock, 
  User, 
  Key, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Search,
  Building2,
  HelpCircle,
  Users
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onOpenAccountManager?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  accounts,
  currentUser,
  onLogin,
  onOpenAccountManager,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'LOGIN_FORM' | 'QUICK_ACCOUNTS'>('LOGIN_FORM');
  const [searchAccountQuery, setSearchAccountQuery] = useState<string>('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('Tất cả Tổ');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMsg('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.');
      return;
    }

    const foundAcc = accounts.find(
      (a) => a.username.toLowerCase() === cleanUser || a.teacherId.toLowerCase() === cleanUser
    );

    if (!foundAcc) {
      setErrorMsg('Tên đăng nhập không tồn tại trong hệ thống 70 tài khoản!');
      return;
    }

    if (foundAcc.passwordHash !== cleanPass) {
      setErrorMsg('Mật khẩu không chính xác! (Mật khẩu mặc định là 123456 hoặc admin123)');
      return;
    }

    onLogin(foundAcc);
    onClose();
  };

  const handleQuickLogin = (acc: UserAccount) => {
    onLogin(acc);
    onClose();
  };

  const filteredAccounts = accounts.filter((a) => {
    const matchSearch = 
      a.fullName.toLowerCase().includes(searchAccountQuery.toLowerCase()) ||
      a.username.toLowerCase().includes(searchAccountQuery.toLowerCase()) ||
      a.position.toLowerCase().includes(searchAccountQuery.toLowerCase());
    const matchDept = selectedDeptFilter === 'Tất cả Tổ' || a.department === selectedDeptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with School Branding */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white">EduEval • THPT CHÂU THÀNH A</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  NĐ 233/2026
                </span>
              </div>
              <p className="text-xs text-slate-300">Hệ thống Đăng nhập & Đánh giá Viên chức Sư phạm</p>
            </div>
          </div>

          {/* Tab Switcher: Direct Login vs 70 Accounts Selector */}
          <div className="flex items-center gap-2 mt-4 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setActiveTab('LOGIN_FORM')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'LOGIN_FORM'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Đăng Nhập Tài Khoản</span>
            </button>

            <button
              onClick={() => setActiveTab('QUICK_ACCOUNTS')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'QUICK_ACCOUNTS'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Tra Cứu 70 Tài Khoản & Mật Khẩu</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'LOGIN_FORM' ? (
            <div className="space-y-5">
              
              {/* Currently Logged-in Info Banner */}
              {currentUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                      alt="" 
                      className="w-10 h-10 rounded-xl object-cover border border-blue-300"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>Đang đăng nhập: {currentUser.fullName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          currentUser.role === 'ADMIN_PRINCIPAL' 
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : currentUser.role === 'HEAD_OF_DEPARTMENT'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {currentUser.role === 'ADMIN_PRINCIPAL' ? 'BGH / Admin' : (currentUser.role === 'HEAD_OF_DEPARTMENT' ? 'Tổ Trưởng / Tổ Phó' : 'Giáo Viên')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{currentUser.department} • {currentUser.position}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Box */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tên đăng nhập (Username / Mã GV)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="VD: admin, totruong.toan, gv.toan.01..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Mật khẩu (Password)
                    </label>
                    <span className="text-[11px] text-blue-600 font-medium">Mặc định: 123456</span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>ĐĂNG NHẬP VÀO HỆ THỐNG</span>
                </button>
              </form>

              {/* Quick Select Quick Chips */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 mb-2.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Chọn nhanh vai trò để thử nghiệm (Quick Demo Login):</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      const admin = accounts.find((a) => a.username === 'admin');
                      if (admin) handleQuickLogin(admin);
                    }}
                    className="p-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-purple-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>BGH / Hiệu Trưởng</span>
                    </div>
                    <p className="text-[10px] text-purple-600 mt-0.5">Thầy Nguyễn Minh Trí</p>
                  </button>

                  <button
                    onClick={() => {
                      const head = accounts.find((a) => a.username === 'totruong.toan');
                      if (head) handleQuickLogin(head);
                    }}
                    className="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tổ Trưởng Toán</span>
                    </div>
                    <p className="text-[10px] text-blue-600 mt-0.5">Thầy Trần Văn Hoàng</p>
                  </button>

                  <button
                    onClick={() => {
                      const gv = accounts.find((a) => a.username === 'gv.toan.03' || a.role === 'TEACHER');
                      if (gv) handleQuickLogin(gv);
                    }}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Giáo Viên Cá Nhân</span>
                    </div>
                    <p className="text-[10px] text-emerald-600 mt-0.5">Tự nhập điểm & Kê khai</p>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Tab 2: 70 Accounts Explorer */
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchAccountQuery}
                    onChange={(e) => setSearchAccountQuery(e.target.value)}
                    placeholder="Tìm theo tên giáo viên, username..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Tất cả Tổ">Tất cả Tổ</option>
                  <option value="Tổ Toán">Tổ Toán</option>
                  <option value="Tổ Văn - GDKTPL">Tổ Văn - GDKTPL</option>
                  <option value="Tổ Hoá - Sinh">Tổ Hoá - Sinh</option>
                  <option value="Tổ Sử - Địa - Anh Văn">Tổ Sử - Địa - Anh Văn</option>
                  <option value="Tổ Lý - TD - QP">Tổ Lý - TD - QP</option>
                  <option value="Tổ Tin - Công nghệ">Tổ Tin - Công nghệ</option>
                  <option value="Tổ Văn Phòng">Tổ Văn Phòng</option>
                </select>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
                <span>Hiển thị <strong>{filteredAccounts.length}</strong> / 70 tài khoản</span>
                <span className="text-blue-600 font-medium">Bấm "Đăng nhập" để vào ngay</span>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {filteredAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        acc.role === 'ADMIN_PRINCIPAL'
                          ? 'bg-purple-600 text-white'
                          : acc.role === 'HEAD_OF_DEPARTMENT'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {acc.fullName.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{acc.fullName}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            acc.role === 'ADMIN_PRINCIPAL'
                              ? 'bg-purple-100 text-purple-700'
                              : acc.role === 'HEAD_OF_DEPARTMENT'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {acc.role === 'ADMIN_PRINCIPAL' ? 'BGH' : (acc.role === 'HEAD_OF_DEPARTMENT' ? 'Tổ Trưởng/Phó' : 'Giáo Viên')}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>User: <strong className="text-blue-700 font-mono">{acc.username}</strong></span>
                          <span>•</span>
                          <span>Pass: <strong className="text-emerald-700 font-mono">{acc.passwordHash}</strong></span>
                          <span>•</span>
                          <span>{acc.department}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickLogin(acc)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                    >
                      Chọn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Phân quyền độc lập theo Nghị định 233/2026/NĐ-CP</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
