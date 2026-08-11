import React, { useState } from 'react';
import { Teacher, SelfDeclarationRecord, PassiveLog, Department } from '../../types';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  X, 
  HelpCircle,
  Table,
  Plus,
  AlertTriangle,
  FileText,
  Trash2,
  Check,
  Clipboard,
  Globe,
  ArrowRight,
  Edit3,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  parseTeachersExcelFile, 
  parsePastedSpreadsheetText,
  fetchAndParseGoogleSheetUrl,
  exportTeacherTemplateExcel, 
  export70TeachersSampleExcel,
  exportTeachersToExcel,
  exportDeclarationTemplateExcel,
  exportDeclarationsToExcel,
  ParsedTeacherRow
} from '../../services/excelService';

interface TemplateImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  selfDeclarations: SelfDeclarationRecord[];
  setSelfDeclarations: React.Dispatch<React.SetStateAction<SelfDeclarationRecord[]>>;
  onAddPassiveLog: (teacherId: string, log: PassiveLog) => void;
  onAddAuditLog: (action: string, targetName: string, details: string) => void;
}

type ImportSourceTab = 'FILE_EXCEL' | 'QUICK_PASTE' | 'GOOGLE_SHEET_URL' | 'SAMPLE_TEMPLATES';
type ImportCategory = 'TEACHERS' | 'DECLARATIONS' | 'PASSIVE_LOGS';

export const TemplateImportExportModal: React.FC<TemplateImportExportModalProps> = ({
  isOpen,
  onClose,
  teachers,
  setTeachers,
  selfDeclarations,
  setSelfDeclarations,
  onAddPassiveLog,
  onAddAuditLog,
}) => {
  const [activeSourceTab, setActiveSourceTab] = useState<ImportSourceTab>('FILE_EXCEL');
  const [activeCategory, setActiveCategory] = useState<ImportCategory>('TEACHERS');
  
  // File & parsing states
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pastedText, setPastedText] = useState<string>('');
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>('');
  
  // Parsed teachers rows for interactive preview
  const [previewRows, setPreviewRows] = useState<ParsedTeacherRow[]>([]);
  const [invalidRows, setInvalidRows] = useState<{ rowNumber: number; rawData: any; errorReason: string }[]>([]);
  const [importMode, setImportMode] = useState<'REPLACE' | 'APPEND'>('REPLACE');
  
  const [parseError, setParseError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Xử lý tải file Excel / CSV
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError(null);
    setImportSuccessMsg(null);
    setIsLoading(true);

    try {
      if (activeCategory === 'TEACHERS') {
        const result = await parseTeachersExcelFile(file);
        setPreviewRows(result.validRows);
        setInvalidRows(result.invalidRows);

        if (result.validRows.length === 0 && result.invalidRows.length > 0) {
          setParseError(`Không tìm thấy hàng giáo viên nào hợp lệ trong file.`);
        }
      }
    } catch (err: any) {
      setParseError(err.message || 'Lỗi khi đọc file bảng tính.');
      setPreviewRows([]);
      setInvalidRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Xử lý dán trực tiếp (Quick Paste)
  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setParseError('Vui lòng dán nội dung bảng từ Excel hoặc Google Sheets trước.');
      return;
    }

    setParseError(null);
    setImportSuccessMsg(null);
    setIsLoading(true);

    try {
      const result = parsePastedSpreadsheetText(pastedText);
      setPreviewRows(result.validRows);
      setInvalidRows(result.invalidRows);
      if (result.validRows.length === 0) {
        setParseError('Không nhận diện được hàng dữ liệu nào. Vui lòng kiểm tra lại cấu trúc bảng đã dán.');
      }
    } catch (err: any) {
      setParseError(err.message || 'Lỗi khi phân tích dữ liệu dán.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Xử lý lấy từ Google Sheets URL
  const handleFetchGoogleSheets = async () => {
    if (!googleSheetUrl.trim()) {
      setParseError('Vui lòng nhập đường link Google Sheets.');
      return;
    }

    setParseError(null);
    setImportSuccessMsg(null);
    setIsLoading(true);

    try {
      const result = await fetchAndParseGoogleSheetUrl(googleSheetUrl);
      setPreviewRows(result.validRows);
      setInvalidRows(result.invalidRows);
      if (result.validRows.length === 0) {
        setParseError('Không tìm thấy dữ liệu giáo viên trong Google Sheets.');
      }
    } catch (err: any) {
      setParseError(err.message || 'Lỗi khi đồng bộ Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Trình sửa ô trực tiếp trên bảng xem trước
  const handleEditCell = (index: number, field: keyof ParsedTeacherRow, value: any) => {
    setPreviewRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeletePreviewRow = (index: number) => {
    setPreviewRows((prev) => prev.filter((_, i) => i !== index));
  };

  // 5. Lưu vào hệ thống
  const handleCommitImport = () => {
    if (previewRows.length === 0) {
      setParseError('Không có dữ liệu hợp lệ để lưu vào hệ thống.');
      return;
    }

    const newTeachersList: Teacher[] = previewRows.map((r, idx) => {
      const teacherId = r.code ? `gv_${r.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : `gv_imp_${Date.now()}_${idx}`;
      return {
        id: teacherId,
        code: r.code || `GV-CT-${100 + idx}`,
        fullName: r.fullName,
        email: r.email,
        phone: r.phone,
        department: r.department,
        position: r.position,
        titleGrade: r.titleGrade,
        yearsOfTeaching: r.yearsOfTeaching,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        currentEvaluation: {
          id: `eval_${teacherId}`,
          teacherId,
          period: 'Học kỳ I - 2026-2027',
          status: 'SELF_SUBMITTED',
          scores: {
            crit_1: { criteriaId: 'crit_1', selfScore: 85, headScore: 85, principalScore: 85 },
            crit_2: { criteriaId: 'crit_2', selfScore: 90, headScore: 90, principalScore: 90 },
            crit_3: { criteriaId: 'crit_3', selfScore: 85, headScore: 85, principalScore: 85 },
            crit_4: { criteriaId: 'crit_4', selfScore: 85, headScore: 85, principalScore: 85 },
          },
          passivePointsTotal: 0,
          finalScore: 86.0,
          classification: 'HTTNV',
          isAnomaly: false,
          selfSubmittedAt: new Date().toLocaleString('vi-VN')
        },
        skillDimensions: [
          { dimensionName: 'Phẩm chất nhà giáo', score: 90, benchmarkScore: 90 },
          { dimensionName: 'Phát triển chuyên môn', score: 85, benchmarkScore: 85 },
          { dimensionName: 'Năng lực sư phạm', score: 85, benchmarkScore: 85 },
          { dimensionName: 'Ứng dụng CNTT & AI', score: 80, benchmarkScore: 80 },
          { dimensionName: 'Xây dựng môi trường & Thi đua', score: 85, benchmarkScore: 85 }
        ],
        performanceTrend: [
          { period: 'Tháng 9', score: 82 },
          { period: 'Tháng 10', score: 85 },
          { period: 'Tháng 11', score: 86 }
        ],
        evidences: [],
        passiveLogs: []
      };
    });

    if (importMode === 'REPLACE') {
      setTeachers(newTeachersList);
    } else {
      setTeachers((prev) => [...prev, ...newTeachersList]);
    }

    onAddAuditLog(
      'NHẬP DANH SÁCH GIÁO VIÊN EXCEL',
      `${previewRows.length} Giáo viên`,
      `Đã nhập thành công ${previewRows.length} giáo viên vào cơ sở dữ liệu (Chế độ: ${importMode === 'REPLACE' ? 'Thay thế toàn bộ' : 'Bổ sung'})`
    );

    setImportSuccessMsg(`Đã nhập thành công ${previewRows.length} giáo viên vào hệ thống EduEval!`);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">Trung Tâm Nhập & Xuất Dữ Liệu Thông Minh</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  Chống Phát Sinh Lỗi 100%
                </span>
              </div>
              <p className="text-xs text-slate-300">Nhập Excel, Dán trực tiếp từ Google Sheets, Sửa lỗi trực quan trước khi lưu</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Method Selector Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSourceTab('FILE_EXCEL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSourceTab === 'FILE_EXCEL'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>1. Tải File Excel (.xlsx, .csv)</span>
          </button>

          <button
            onClick={() => setActiveSourceTab('QUICK_PASTE')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSourceTab === 'QUICK_PASTE'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clipboard className="w-4 h-4 text-indigo-600" />
            <span>2. Dán Bảng Trực Tiếp (Quick Paste)</span>
          </button>

          <button
            onClick={() => setActiveSourceTab('GOOGLE_SHEET_URL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSourceTab === 'GOOGLE_SHEET_URL'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>3. Link Google Sheets</span>
          </button>

          <button
            onClick={() => setActiveSourceTab('SAMPLE_TEMPLATES')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSourceTab === 'SAMPLE_TEMPLATES'
                ? 'bg-white text-purple-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Download className="w-4 h-4 text-purple-600" />
            <span>4. Tải File Mẫu Chuẩn</span>
          </button>
        </div>

        {/* Status Messages */}
        {parseError && (
          <div className="bg-rose-50 border-b border-rose-200 text-rose-700 text-xs p-3 px-6 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{parseError}</span>
          </div>
        )}

        {importSuccessMsg && (
          <div className="bg-emerald-600 text-white text-xs font-bold p-3 px-6 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{importSuccessMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: UPLOAD FILE EXCEL */}
          {activeSourceTab === 'FILE_EXCEL' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all">
                <input
                  type="file"
                  id="excelFileInput"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="excelFileInput"
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 group-hover:bg-blue-200 text-blue-600 flex items-center justify-center mb-3 transition-colors">
                    <Upload className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600">
                    Bấm để chọn file Excel (.xlsx, .xls, .csv) hoặc kéo thả vào đây
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Tự động nhận diện tiêu đề, bỏ qua dòng trống hoặc logo trường ở dòng đầu
                  </p>
                  {fileName && (
                    <span className="mt-3 text-xs font-mono font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      ✓ Đã chọn: {fileName}
                    </span>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: QUICK PASTE */}
          {activeSourceTab === 'QUICK_PASTE' && (
            <div className="space-y-3">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 text-xs text-indigo-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Cách dùng siêu dễ:</strong> Mở bảng Google Sheets hoặc Excel của bạn &rarr; Bôi đen toàn bộ các dòng &rarr; Nhấn <strong>Ctrl+C</strong> &rarr; Bấm vào ô bên dưới và nhấn <strong>Ctrl+V</strong>.
                </div>
              </div>

              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Dán (Ctrl+V) bảng dữ liệu giáo viên từ Excel hoặc Google Sheets vào đây..."
                rows={6}
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 shadow-inner"
              />

              <button
                onClick={handleParsePastedText}
                disabled={isLoading || !pastedText.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Clipboard className="w-4 h-4" />
                <span>Phân Tích Bảng Dữ Liệu Đã Dán</span>
              </button>
            </div>
          )}

          {/* TAB 3: GOOGLE SHEETS URL */}
          {activeSourceTab === 'GOOGLE_SHEET_URL' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900">
                <strong>Đồng bộ Google Sheets trực tiếp:</strong> Dán đường link Google Sheets (chế độ chia sẻ công khai có liên kết).
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={googleSheetUrl}
                  onChange={(e) => setGoogleSheetUrl(e.target.value)}
                  placeholder="VD: https://docs.google.com/spreadsheets/d/1A2B3C.../edit"
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleFetchGoogleSheets}
                  disabled={isLoading || !googleSheetUrl.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Globe className="w-4 h-4" />
                  <span>Tải Về & Đọc</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SAMPLE TEMPLATES DOWNLOAD */}
          {activeSourceTab === 'SAMPLE_TEMPLATES' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-purple-50 border border-purple-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                    70
                  </div>
                  <h4 className="font-extrabold text-sm text-purple-950 mb-1">File Mẫu 70 Giáo Viên Có Sẵn</h4>
                  <p className="text-xs text-purple-700 mb-4">
                    Đã điền sẵn đầy đủ 70 cán bộ giáo viên theo 7 tổ chuyên môn của THPT Châu Thành A.
                  </p>
                </div>
                <button
                  onClick={() => export70TeachersSampleExcel()}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File 70 GV Mẫu</span>
                </button>
              </div>

              <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-blue-950 mb-1">File Mẫu Rỗng & Hướng Dẫn</h4>
                  <p className="text-xs text-blue-700 mb-4">
                    Gồm 6 dòng mẫu kèm trang tính hướng dẫn quy định chi tiết từng cột.
                  </p>
                </div>
                <button
                  onClick={() => exportTeacherTemplateExcel()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File Mẫu Rỗng</span>
                </button>
              </div>

              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-amber-950 mb-1">File Mẫu Tự Kê Khai / Phong Trào</h4>
                  <p className="text-xs text-amber-700 mb-4">
                    Mẫu chuẩn để nhập hàng loạt các quyết định khen thưởng và kê khai.
                  </p>
                </div>
                <button
                  onClick={() => exportDeclarationTemplateExcel()}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Mẫu Kê Khai</span>
                </button>
              </div>
            </div>
          )}

          {/* INTERACTIVE PREVIEW & INLINE CELL EDITOR TABLE */}
          {previewRows.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-800">
                    Bảng Xem Trước & Chỉnh Sửa Trực Tiếp ({previewRows.length} Giáo Viên)
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[11px] px-2 py-0.5 rounded-full">
                    ✓ Hợp lệ
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <span className="font-semibold">Chế độ lưu:</span>
                    <select
                      value={importMode}
                      onChange={(e: any) => setImportMode(e.target.value)}
                      className="bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="REPLACE">Thay thế toàn bộ danh sách hiện tại</option>
                      <option value="APPEND">Bổ sung thêm vào danh sách hiện tại</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCommitImport}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lưu Vào Hệ Thống ({previewRows.length} GV)</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-2.5 text-[11px] text-blue-900 flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Bạn có thể <strong>click trực tiếp vào bất kỳ ô nào</strong> bên dưới để chỉnh sửa thông tin trước khi nhấn nút Lưu.</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-[350px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold z-10">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">STT</th>
                      <th className="py-2.5 px-3">Mã GV</th>
                      <th className="py-2.5 px-3">Họ và Tên</th>
                      <th className="py-2.5 px-3">Tổ Chuyên Môn</th>
                      <th className="py-2.5 px-3">Chức Vụ</th>
                      <th className="py-2.5 px-3">Hạng</th>
                      <th className="py-2.5 px-3 w-16">Thâm Niên</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">SĐT</th>
                      <th className="py-2.5 px-3 w-10 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                        
                        <td className="py-1 px-2">
                          <input
                            type="text"
                            value={row.code}
                            onChange={(e) => handleEditCell(idx, 'code', e.target.value)}
                            className="w-24 px-2 py-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-xs font-mono font-bold text-blue-700"
                          />
                        </td>

                        <td className="py-1 px-2">
                          <input
                            type="text"
                            value={row.fullName}
                            onChange={(e) => handleEditCell(idx, 'fullName', e.target.value)}
                            className="w-40 px-2 py-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-xs font-bold text-slate-800"
                          />
                        </td>

                        <td className="py-1 px-2">
                          <select
                            value={row.department}
                            onChange={(e) => handleEditCell(idx, 'department', e.target.value)}
                            className="px-2 py-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-xs font-medium text-slate-700 cursor-pointer"
                          >
                            <option value="Tổ Toán">Tổ Toán</option>
                            <option value="Tổ Văn - GDKTPL">Tổ Văn - GDKTPL</option>
                            <option value="Tổ Hoá - Sinh">Tổ Hoá - Sinh</option>
                            <option value="Tổ Sử - Địa - Anh Văn">Tổ Sử - Địa - Anh Văn</option>
                            <option value="Tổ Lý - TD - QP">Tổ Lý - TD - QP</option>
                            <option value="Tổ Tin - Công nghệ">Tổ Tin - Công nghệ</option>
                            <option value="Tổ Văn Phòng">Tổ Văn Phòng</option>
                          </select>
                        </td>

                        <td className="py-1 px-2">
                          <input
                            type="text"
                            value={row.position}
                            onChange={(e) => handleEditCell(idx, 'position', e.target.value)}
                            className="w-32 px-2 py-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-xs text-slate-700"
                          />
                        </td>

                        <td className="py-1 px-2">
                          <select
                            value={row.titleGrade}
                            onChange={(e) => handleEditCell(idx, 'titleGrade', e.target.value)}
                            className="px-2 py-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-xs text-slate-700 cursor-pointer"
                          >
                            <option value="Giáo viên THPT Hạng I">Hạng I</option>
                            <option value="Giáo viên THPT Hạng II">Hạng II</option>
                            <option value="Giáo viên THPT Hạng III">Hạng III</option>
                          </select>
                        </td>

                        <td className="py-1 px-2">
                          <input
                            type="number"
                            value={row.yearsOfTeaching}
                            onChange={(e) => handleEditCell(idx, 'yearsOfTeaching', Number(e.target.value))}
                            className="w-14 px-2 py-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-xs text-center"
                          />
                        </td>

                        <td className="py-1 px-2">
                          <input
                            type="text"
                            value={row.email}
                            onChange={(e) => handleEditCell(idx, 'email', e.target.value)}
                            className="w-48 px-2 py-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-xs text-slate-600 font-mono"
                          />
                        </td>

                        <td className="py-1 px-2">
                          <input
                            type="text"
                            value={row.phone}
                            onChange={(e) => handleEditCell(idx, 'phone', e.target.value)}
                            className="w-28 px-2 py-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-xs text-slate-600"
                          />
                        </td>

                        <td className="py-1 px-2 text-center">
                          <button
                            onClick={() => handleDeletePreviewRow(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Xóa hàng này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Chuẩn hóa tự động theo tiêu chuẩn Nghị định 233/2026/NĐ-CP</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
