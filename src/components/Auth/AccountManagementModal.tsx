import React, { useState } from 'react';
import { UserAccount, Role, Department } from '../../types';
import { 
  Users, 
  Search, 
  Download, 
  Key, 
  Shield, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  FileSpreadsheet,
  Edit2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { exportAccountsToExcel } from '../../services/excelService';

interface AccountManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<UserAccount[]>>;
  currentUser: UserAccount | null;
  onAddAuditLog: (action: string, targetName: string, details: string) => void;
  academicYear?: string;
}

export const AccountManagementModal: React.FC<AccountManagementModalProps> = ({
  isOpen,
  onClose,
  accounts,
  setAccounts,
  currentUser,
  onAddAuditLog,
  academicYear = '2026 - 2027',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('Tất cả Tổ');
  const [selectedRole, setSelectedRole] = useState<string>('Tất cả Vai trò');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Change password modal state
  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleExportExcel = async () => {
    try {
      await exportAccountsToExcel(accounts, academicYear);
      onAddAuditLog('XUẤT DANH SÁCH 70 TÀI KHOẢN EXCEL', 'Toàn trường', 'Xuất file Excel danh sách 70 tài khoản cán bộ giáo viên');
      showToast('Đã xuất file Excel danh sách 70 tài khoản thành công!');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xuất file Excel tài khoản.');
    }
  };

  const handleResetPassword = (acc: UserAccount) => {
    const defaultPass = acc.role === 'ADMIN_PRINCIPAL' ? 'admin123' : '123456';
    if (window.confirm(`Bạn có chắc chắn muốn đặt lại mật khẩu của ${acc.fullName} về mặc định (${defaultPass})?`)) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === acc.id ? { ...a, passwordHash: defaultPass } : a))
      );
      onAddAuditLog('RESET MẬT KHẨU TÀI KHOẢN', acc.fullName, `Đặt lại mật khẩu tài khoản ${acc.username} về ${defaultPass}`);
      showToast(`Đã đặt lại mật khẩu của ${acc.fullName} về "${defaultPass}"!`);
    }
  };

  const handleSaveCustomPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount || !newPassword.trim()) return;

    setAccounts((prev) =>
      prev.map((a) => (a.id === editingAccount.id ? { ...a, passwordHash: newPassword.trim() } : a))
    );

    onAddAuditLog('ĐỔI MẬT KHẨU TÀI KHOẢN', editingAccount.fullName, `Cập nhật mật khẩu mới cho ${editingAccount.username}`);
    showToast(`Đã cập nhật mật khẩu mới cho ${editingAccount.fullName}!`);
    setEditingAccount(null);
    setNewPassword('');
  };

  const filteredAccounts = accounts.filter((a) => {
    const matchSearch = 
      a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.teacherId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'Tất cả Tổ' || a.department === selectedDept;
    const matchRole = selectedRole === 'Tất cả Vai trò' || a.role === selectedRole;
    return matchSearch && matchDept && matchRole;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">Quản Lý 70 Tài Khoản & Phân Quyền Sư Phạm</h2>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  {accounts.length} Tài khoản
                </span>
              </div>
              <p className="text-xs text-slate-300">Quản trị cấp quyền BGH, Tổ trưởng/Tổ phó và Giáo viên cá nhân</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Xuất Danh Sách Excel (.xlsx)</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo Tên giáo viên, Username, Mã số..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Tất cả Tổ">Tất cả Tổ Chuyên Môn</option>
              <option value="Tổ Toán">Tổ Toán</option>
              <option value="Tổ Văn - GDKTPL">Tổ Văn - GDKTPL</option>
              <option value="Tổ Hoá - Sinh">Tổ Hoá - Sinh</option>
              <option value="Tổ Sử - Địa - Anh Văn">Tổ Sử - Địa - Anh Văn</option>
              <option value="Tổ Lý - TD - QP">Tổ Lý - TD - QP</option>
              <option value="Tổ Tin - Công nghệ">Tổ Tin - Công nghệ</option>
              <option value="Tổ Văn Phòng">Tổ Văn Phòng</option>
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Tất cả Vai trò">Tất cả Vai trò</option>
              <option value="ADMIN_PRINCIPAL">Ban Giám Hiệu / Admin</option>
              <option value="HEAD_OF_DEPARTMENT">Tổ Trưởng / Tổ Phó</option>
              <option value="TEACHER">Giáo Viên Cá Nhân</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-extrabold">
                  <th className="py-3 px-3.5 w-12 text-center">STT</th>
                  <th className="py-3 px-3.5">Họ và Tên</th>
                  <th className="py-3 px-3.5">Tổ Chuyên Môn</th>
                  <th className="py-3 px-3.5">Chức Vụ</th>
                  <th className="py-3 px-3.5">Phân Quyền</th>
                  <th className="py-3 px-3.5">Tên Đăng Nhập</th>
                  <th className="py-3 px-3.5">Mật Khẩu</th>
                  <th className="py-3 px-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map((acc, idx) => (
                  <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span>{acc.fullName}</span>
                        {currentUser?.id === acc.id && (
                          <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded-full border border-blue-200">
                            Bạn
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600">{acc.department}</td>
                    <td className="py-2.5 px-3.5 text-slate-600 font-medium">{acc.position}</td>
                    <td className="py-2.5 px-3.5">
                      <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                        acc.role === 'ADMIN_PRINCIPAL'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : acc.role === 'HEAD_OF_DEPARTMENT'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {acc.role === 'ADMIN_PRINCIPAL' && <ShieldCheck className="w-3 h-3" />}
                        {acc.role === 'HEAD_OF_DEPARTMENT' && <UserCheck className="w-3 h-3" />}
                        {acc.role === 'TEACHER' && <GraduationCap className="w-3 h-3" />}
                        <span>{acc.role === 'ADMIN_PRINCIPAL' ? 'BGH / Admin' : (acc.role === 'HEAD_OF_DEPARTMENT' ? 'Tổ Trưởng/Phó' : 'Giáo Viên')}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-blue-700 font-bold">{acc.username}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-emerald-700 font-semibold border border-slate-200">
                        {acc.passwordHash}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingAccount(acc);
                            setNewPassword('');
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                          title="Đổi mật khẩu"
                        >
                          <Key className="w-3.5 h-3.5 inline mr-1" />
                          Đổi Pass
                        </button>
                        <button
                          onClick={() => handleResetPassword(acc)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[11px] font-semibold border border-amber-200 transition-all cursor-pointer"
                          title="Đặt lại về mặc định (123456)"
                        >
                          <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                          Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Change Password Modal Overlay */}
        {editingAccount && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Key className="w-5 h-5 text-blue-600" />
                  <span>Đổi Mật Khẩu Cho {editingAccount.fullName}</span>
                </div>
                <button
                  onClick={() => setEditingAccount(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCustomPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Tài khoản: <strong className="text-slate-900">{editingAccount.username}</strong>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới..."
                      className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingAccount(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Lưu Mật Khẩu Mới
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Hệ thống gồm <strong>70 tài khoản</strong> giáo viên & nhân viên THPT Châu Thành A</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Hoàn Tất & Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
