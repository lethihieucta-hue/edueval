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
  Check
} from 'lucide-react';
import { 
  parseTeachersExcelFile, 
  exportTeacherTemplateExcel, 
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

type ImportType = 'TEACHERS' | 'DECLARATIONS' | 'PASSIVE_LOGS';

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
  const [activeImportType, setActiveImportType] = useState<ImportType>('TEACHERS');
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Teachers parsing state
  const [validTeachers, setValidTeachers] = useState<ParsedTeacherRow[]>([]);
  const [invalidTeachers, setInvalidTeachers] = useState<{ rowNumber: number; rawData: any; errorReason: string }[]>([]);
  const [totalRowsCount, setTotalRowsCount] = useState<number>(0);
  const [previewFilter, setPreviewFilter] = useState<'ALL' | 'VALID' | 'INVALID'>('ALL');
  const [skipInvalid, setSkipInvalid] = useState<boolean>(true);

  // Fallback CSV rows for other tabs
  const [legacyParsedRows, setLegacyParsedRows] = useState<any[]>([]);
  
  const [parseError, setParseError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. EXPORT SAMPLE TEMPLATES (XUẤT FILE MẪU EXCEL HOẶC CSV)
  const handleExportExcelTemplate = async (type: ImportType) => {
    try {
      if (type === 'TEACHERS') {
        await exportTeacherTemplateExcel();
        onAddAuditLog('TẢI FILE MẪU EXCEL GV', 'Hệ thống', 'Tải file mẫu Excel (.xlsx) danh sách giáo viên');
      } else if (type === 'DECLARATIONS') {
        await exportDeclarationTemplateExcel();
        onAddAuditLog('TẢI FILE MẪU EXCEL TỰ KÊ KHAI', 'Hệ thống', 'Tải file mẫu Excel (.xlsx) tự kê khai phong trào');
      } else {
        handleExportCSVTemplate(type);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tải file mẫu Excel');
    }
  };

  const handleExportCSVTemplate = (type: ImportType) => {
    let headers = '';
    let sampleData = '';
    let filename = '';

    if (type === 'TEACHERS') {
      filename = 'Mau_Import_DanhSach_GiaoVien_EduEval.csv';
      headers = 'Mã GV,Họ và Tên,Tổ Chuyên Môn,Chức Vụ,Hạng Chức Danh,Thâm Niên (Năm),Email,Số Điện Thoại\n';
      sampleData = 
        'GV-TOAN-101,Nguyễn Văn An,Tổ Toán,Giáo viên THPT,Giáo viên THPT Hạng II,12,nguyenvanan@thptchauthanha.edu.vn,0912345678\n' +
        'GV-VAN-102,Lê Thị Mai,Tổ Văn - GDKTPL,Tổ trưởng chuyên môn,Giáo viên THPT Hạng I,18,lethimai@thptchauthanha.edu.vn,0987654321\n' +
        'GV-LY-103,Trần Quốc Bảo,Tổ Lý - TD - QP,Giáo viên THPT,Giáo viên THPT Hạng III,4,tranquocbao@thptchauthanha.edu.vn,0909123456\n';
    } else if (type === 'DECLARATIONS') {
      filename = 'Mau_Import_TuKeKhai_PhongTrao_EduEval.csv';
      headers = 'Mã GV hoặc Tên GV,Loại Khai Báo (BONUS/PENALTY),Cấp / Danh Mục,Tên Phong Trào hoặc Lỗi Vi Phạm,Giải Thưởng hoặc Chi Tiết,Điểm Đề Xuất (+/-),Minh Chứng / Mô Tả\n';
      sampleData = 
        'Trần Văn Hoàng,BONUS,Cấp Tỉnh / Thành phố,Hội thi Thiết kế Bài giảng Số & Elearning,Giải Nhất,8.0,Quyết định khen thưởng số 1234/QĐ-SGDĐT\n' +
        'Phạm Minh Đức,BONUS,Cấp Xã (Cụm Trường),Hội thao Người giáo viên THPT,Giải Nhất,4.0,Giấy khen cụm thi đua số 3 môn bóng chuyền\n' +
        'Nguyễn Minh Tuấn,PENALTY,Vi phạm nếp sống / Kỷ luật,Nộp chậm giáo án & trễ sinh hoạt chào cờ,Trễ 15 phút chào cờ,-2.0,Giải trình tự kiểm điểm nộp chậm giáo án tuần 10\n';
    } else {
      filename = 'Mau_Import_DiemThuDong_AutoLog_EduEval.csv';
      headers = 'Mã GV hoặc Tên GV,Nguồn Dữ Liệu (SO_DAU_BAI/MAY_CHAM_CONG/HE_THONG_GIAO_AN/KHEN_THUONG_HSG),Loại Điểm (BONUS/PENALTY),Tiêu Đề Sự Kiện,Điểm Quy Đổi (+/-),Mô Tả Chi Tiết\n';
      sampleData = 
        'Trần Văn Hoàng,KHEN_THUONG_HSG,BONUS,Bồi dưỡng học sinh giỏi Toán 12 đạt 02 Giải Nhất cấp Tỉnh,10.0,Ghi nhận tự động từ quyết định thi HSG\n' +
        'Lê Thị Thu Hà,MAY_CHAM_CONG,PENALTY,Đi trễ máy chấm công FaceID ngày 15/11,-1.5,Máy quét chấm công ghi nhận trễ 20 phút\n' +
        'Hoàng Quốc Việt,SO_DAU_BAI,BONUS,100% Tiết dạy đăng ký bài giảng số tích cực,3.0,Ghi nhận từ sổ đầu bài điện tử tuần 12\n';
    }

    const csvContent = '\uFEFF' + headers + sampleData;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 2. PARSE EXCEL / CSV FILE UPON UPLOAD
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError(null);
    setImportSuccessMsg(null);
    setIsLoading(true);

    try {
      if (activeImportType === 'TEACHERS') {
        const result = await parseTeachersExcelFile(file);
        setValidTeachers(result.validRows);
        setInvalidTeachers(result.invalidRows);
        setTotalRowsCount(result.totalRows);

        if (result.validRows.length === 0 && result.invalidRows.length > 0) {
          setParseError(`Không tìm thấy dòng giáo viên nào hợp lệ trong file. Vui lòng kiểm tra các dòng bị báo lỗi bên dưới.`);
        }
      } else {
        // Parse CSV/Excel for declarations or passive logs
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          parseLegacyCSV(text);
          setIsLoading(false);
        };
        reader.readAsText(file, 'UTF-8');
        return;
      }
    } catch (err: any) {
      setParseError(err.message || 'Lỗi khi đọc file bảng tính.');
      setValidTeachers([]);
      setInvalidTeachers([]);
      setTotalRowsCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const parseLegacyCSV = (csvText: string) => {
    try {
      const lines = csvText.split(/\r\n|\n/).filter((line) => line.trim() !== '');
      if (lines.length < 2) {
        setParseError('File không có dữ liệu hoặc sai định dạng mẫu!');
        setLegacyParsedRows([]);
        return;
      }

      const dataRows = [];
      for (let i = 1; i < lines.length; i++) {
        const rawLine = lines[i];
        if (!rawLine.trim()) continue;
        const values = rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(',');
        const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
        if (cleanValues.length >= 2) {
          dataRows.push(cleanValues);
        }
      }
      setLegacyParsedRows(dataRows);
    } catch (err) {
      setParseError('Lỗi khi đọc file CSV.');
      setLegacyParsedRows([]);
    }
  };

  // 3. PROCESS IMPORT INTO APPLICATION STATE
  const handleConfirmImport = () => {
    const nowStr = new Date().toLocaleString('vi-VN');

    if (activeImportType === 'TEACHERS') {
      if (validTeachers.length === 0) {
        alert('Không có giáo viên hợp lệ nào để nhập!');
        return;
      }

      const newTeachersList: Teacher[] = validTeachers.map((row, idx) => {
        const teacherId = `gv_imp_${Date.now()}_${idx}`;
        return {
          id: teacherId,
          code: row.code || `GV-CT-${Math.floor(100 + Math.random() * 900)}`,
          fullName: row.fullName,
          email: row.email,
          avatar: `https://images.unsplash.com/photo-${1535713875002 + (idx % 10)}?w=150&auto=format&fit=crop&q=80`,
          department: row.department,
          position: row.position,
          titleGrade: row.titleGrade,
          yearsOfTeaching: row.yearsOfTeaching,
          phone: row.phone,
          skillDimensions: [
            { dimensionName: 'Phẩm chất nhà giáo', score: 90, benchmarkScore: 90 },
            { dimensionName: 'Phát triển chuyên môn', score: 85, benchmarkScore: 85 },
            { dimensionName: 'Năng lực sư phạm', score: 85, benchmarkScore: 85 },
            { dimensionName: 'Ứng dụng CNTT & AI', score: 80, benchmarkScore: 80 },
            { dimensionName: 'Xây dựng môi trường & Thi đua', score: 85, benchmarkScore: 85 }
          ],
          performanceTrend: [
            { period: 'Tháng 9', score: 85 },
            { period: 'Tháng 10', score: 86 },
            { period: 'Tháng 11', score: 88 }
          ],
          passiveLogs: [],
          evidences: [],
          currentEvaluation: {
            id: `eval_${teacherId}`,
            teacherId: teacherId,
            period: 'Học kỳ I (2025-2026)',
            status: 'DRAFT',
            passivePointsTotal: 0,
            finalScore: 85.0,
            classification: 'HTTNV',
            isAnomaly: false,
            scores: {
              crit_1: { criteriaId: 'crit_1', selfScore: 85, headScore: 85, principalScore: 85 },
              crit_2: { criteriaId: 'crit_2', selfScore: 90, headScore: 90, principalScore: 90 },
              crit_3: { criteriaId: 'crit_3', selfScore: 85, headScore: 85, principalScore: 85 },
              crit_4: { criteriaId: 'crit_4', selfScore: 85, headScore: 85, principalScore: 85 }
            }
          }
        };
      });

      setTeachers(prev => [...newTeachersList, ...prev]);
      onAddAuditLog(
        'NHẬP EXCEL DANH SÁCH GV',
        'Hệ thống',
        `Đã nhập thành công ${newTeachersList.length} giáo viên từ file Excel "${fileName}"`
      );

      setImportSuccessMsg(`Đã nhập thành công ${newTeachersList.length} giáo viên vào hệ thống EduEval!`);
      setValidTeachers([]);
      setInvalidTeachers([]);
      setFileName('');

    } else if (activeImportType === 'DECLARATIONS') {
      if (legacyParsedRows.length === 0) {
        alert('Không có dữ liệu kê khai hợp lệ để nhập!');
        return;
      }

      let importedCount = 0;
      const newDeclarationsList: SelfDeclarationRecord[] = [];

      legacyParsedRows.forEach((row, idx) => {
        const [teacherRef, type, categoryOrLevel, title, awardNameOrInfraction, suggestedPoints, evidenceUrlOrDesc] = row;
        const foundTeacher = teachers.find(t => 
          t.id === teacherRef || t.code === teacherRef || t.fullName.toLowerCase().includes((teacherRef || '').toLowerCase())
        ) || teachers[0];

        if (!title) return;

        const newRec: SelfDeclarationRecord = {
          id: `sd_imp_${Date.now()}_${idx}`,
          teacherId: foundTeacher.id,
          teacherName: foundTeacher.fullName,
          department: foundTeacher.department,
          type: (String(type).toUpperCase().includes('PENALTY') || String(type).toUpperCase().includes('VI_PHAM') ? 'PENALTY_INFRACTION' : 'BONUS_AWARD'),
          title: title,
          categoryOrLevel: (categoryOrLevel as any) || 'Cấp Trường',
          awardNameOrInfraction: awardNameOrInfraction || 'Giải Nhất',
          suggestedPoints: Number(suggestedPoints) || 3.0,
          evidenceUrlOrDesc: evidenceUrlOrDesc || 'Nhập từ file mẫu Excel/CSV.',
          submittedAt: nowStr,
          status: 'PENDING_HEAD'
        };

        newDeclarationsList.push(newRec);
        importedCount++;
      });

      setSelfDeclarations(prev => [...newDeclarationsList, ...prev]);
      onAddAuditLog('NHẬP FILE TỰ KÊ KHAI', 'Hệ thống', `Đã nhập ${importedCount} bản kê khai phong trào/vi phạm từ file`);
      setImportSuccessMsg(`Đã nhập thành công ${importedCount} bản kê khai phong trào/vi phạm!`);
      setLegacyParsedRows([]);
      setFileName('');

    } else {
      // PASSIVE LOGS
      if (legacyParsedRows.length === 0) {
        alert('Không có ghi nhận điểm thụ động hợp lệ để nhập!');
        return;
      }

      let importedCount = 0;
      legacyParsedRows.forEach((row, idx) => {
        const [teacherRef, source, type, title, points, description] = row;
        const foundTeacher = teachers.find(t => 
          t.id === teacherRef || t.code === teacherRef || t.fullName.toLowerCase().includes((teacherRef || '').toLowerCase())
        ) || teachers[0];

        if (!title) return;

        const newLog: PassiveLog = {
          id: `pl_imp_${Date.now()}_${idx}`,
          teacherId: foundTeacher.id,
          type: String(type).toUpperCase().includes('PENALTY') ? 'PENALTY' : 'BONUS',
          source: (source as any) || 'SO_DAU_BAI',
          title: title,
          description: description || 'Dữ liệu nhập từ file mẫu tự động.',
          points: Number(points) || 2.0,
          timestamp: nowStr,
          verified: true
        };

        onAddPassiveLog(foundTeacher.id, newLog);
        importedCount++;
      });

      onAddAuditLog('NHẬP FILE ĐIỂM THỤ ĐỘNG', 'Hệ thống', `Đã nhập ${importedCount} ghi nhận điểm thụ động từ file`);
      setImportSuccessMsg(`Đã nhập thành công ${importedCount} ghi nhận điểm thụ động!`);
      setLegacyParsedRows([]);
      setFileName('');
    }
  };

  const handleClearSelectedFile = () => {
    setFileName('');
    setValidTeachers([]);
    setInvalidTeachers([]);
    setLegacyParsedRows([]);
    setParseError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg text-slate-900 flex items-center gap-2">
                Xuất File Mẫu & Nhập Dữ Liệu Excel / CSV
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Chuẩn Sư Phạm
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hỗ trợ đọc trực tiếp file Microsoft Excel (.xlsx, .xls) & CSV với khả năng xem trước và kiểm duyệt lỗi tự động.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {importSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold mb-5 flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{importSuccessMsg}</span>
            </div>
            <button 
              onClick={() => setImportSuccessMsg(null)}
              className="text-emerald-700 hover:underline cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Import Type Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold mb-6">
          <button
            onClick={() => {
              setActiveImportType('TEACHERS');
              handleClearSelectedFile();
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeImportType === 'TEACHERS'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>1. Danh Sách Giáo Viên</span>
          </button>

          <button
            onClick={() => {
              setActiveImportType('DECLARATIONS');
              handleClearSelectedFile();
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeImportType === 'DECLARATIONS'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>2. Tự Kê Khai & Phong Trào</span>
          </button>

          <button
            onClick={() => {
              setActiveImportType('PASSIVE_LOGS');
              handleClearSelectedFile();
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeImportType === 'PASSIVE_LOGS'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4 text-indigo-600" />
            <span>3. Điểm Thụ Động</span>
          </button>
        </div>

        {/* Step 1: Export Sample Templates */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-5 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              BƯỚC 1: XUẤT FILE MẪU CHUẨN
            </span>
            <h4 className="font-bold text-sm text-slate-900 mt-1.5">
              Tải file mẫu Excel (.xlsx) hoặc CSV đúng quy chuẩn EduEval
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              File có sẵn 6 dòng giáo viên mẫu cho tất cả các tổ và sheet hướng dẫn các quy định.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleExportExcelTemplate(activeImportType)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải File Mẫu Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => handleExportCSVTemplate(activeImportType)}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>File CSV (.csv)</span>
            </button>
          </div>
        </div>

        {/* Step 2: Upload File Drag & Drop Zone */}
        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-6 text-center transition-all bg-white mb-6">
          <Upload className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
          <span className="font-extrabold text-sm text-slate-900 block mb-1">
            BƯỚC 2: TẢI FILE EXCEL HOẶC CSV ĐÃ NHẬP LIỆU LÊN HỆ THỐNG
          </span>
          <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
            Hỗ trợ định dạng <strong>.xlsx</strong>, <strong>.xls</strong>, <strong>.csv</strong>. Hệ thống tự động kiểm tra ký tự rác và đối soát cột.
          </p>

          <label className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg cursor-pointer transition-all active:scale-95">
            <FileCheck className="w-4 h-4" />
            <span>Chọn File Excel (.xlsx / .csv) Từ Máy</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {fileName && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-slate-800 bg-slate-100 py-1.5 px-3.5 rounded-xl border border-slate-200 flex items-center gap-2">
                📄 File đã chọn: <strong>{fileName}</strong>
              </span>
              <button
                onClick={handleClearSelectedFile}
                className="text-xs text-rose-600 hover:text-rose-800 p-1 font-semibold cursor-pointer"
                title="Huỷ chọn file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {parseError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 font-medium mb-6 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{parseError}</p>
              <p className="text-[11px] text-rose-700 mt-1">
                Lưu ý: Nếu bạn dùng Apple Numbers (.numbers), vui lòng chọn File > Export To > Excel (.xlsx) trước khi tải lên.
              </p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="p-8 text-center text-xs text-slate-600 font-bold">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Đang phân tích và kiểm duyệt dữ liệu bảng tính...
          </div>
        )}

        {/* Step 3: LIVE PREVIEW & VALIDATION TABLE (DÀNH CHO GIÁO VIÊN) */}
        {activeImportType === 'TEACHERS' && (validTeachers.length > 0 || invalidTeachers.length > 0) && (
          <div className="space-y-4 border-t border-slate-200 pt-5">
            
            {/* Validation Badges Summary */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">
                  Tổng số phát hiện: <strong>{totalRowsCount} hàng</strong>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {validTeachers.length} Hợp Lệ
                </span>
                {invalidTeachers.length > 0 && (
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {invalidTeachers.length} Bị Lỗi Ký Tự
                  </span>
                )}
              </div>

              {/* Filter preview selector */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setPreviewFilter('ALL')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    previewFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tất cả ({totalRowsCount})
                </button>
                <button
                  onClick={() => setPreviewFilter('VALID')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    previewFilter === 'VALID' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Hợp lệ ({validTeachers.length})
                </button>
                {invalidTeachers.length > 0 && (
                  <button
                    onClick={() => setPreviewFilter('INVALID')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      previewFilter === 'INVALID' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Bị lỗi ({invalidTeachers.length})
                  </button>
                )}
              </div>
            </div>

            {/* Table Preview */}
            <div className="overflow-x-auto max-h-64 border border-slate-200 rounded-2xl shadow-inner">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold text-slate-700 sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Trạng Thái</th>
                    <th className="p-2.5">Mã GV</th>
                    <th className="p-2.5">Họ và Tên</th>
                    <th className="p-2.5">Tổ Chuyên Môn</th>
                    <th className="p-2.5">Chức Vụ</th>
                    <th className="p-2.5">Hạng Chức Danh</th>
                    <th className="p-2.5">Thâm Niên</th>
                    <th className="p-2.5">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Valid Rows */}
                  {(previewFilter === 'ALL' || previewFilter === 'VALID') &&
                    validTeachers.map((row, idx) => (
                      <tr key={`v_${idx}`} className="hover:bg-emerald-50/40">
                        <td className="p-2.5 font-bold text-emerald-700 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Hợp lệ
                        </td>
                        <td className="p-2.5 font-bold text-blue-700">{row.code}</td>
                        <td className="p-2.5 font-bold text-slate-900">{row.fullName}</td>
                        <td className="p-2.5 text-slate-700">{row.department}</td>
                        <td className="p-2.5 text-slate-700">{row.position}</td>
                        <td className="p-2.5 text-slate-600">{row.titleGrade}</td>
                        <td className="p-2.5 text-slate-700">{row.yearsOfTeaching} năm</td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px] truncate max-w-xs">{row.email}</td>
                      </tr>
                    ))}

                  {/* Invalid Rows */}
                  {(previewFilter === 'ALL' || previewFilter === 'INVALID') &&
                    invalidTeachers.map((row, idx) => (
                      <tr key={`inv_${idx}`} className="bg-rose-50/70 hover:bg-rose-100/70 text-rose-900">
                        <td className="p-2.5 font-bold text-rose-700 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Hàng {row.rowNumber} Lỗi
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-rose-700">Lỗi</td>
                        <td className="p-2.5 font-bold text-rose-900 break-all">
                          {String(row.rawData?.[1] || row.rawData?.[0] || 'Dữ liệu hỏng')}
                        </td>
                        <td colSpan={5} className="p-2.5 text-rose-800 italic font-medium">
                          ⚠️ {row.errorReason} (Sẽ tự động loại bỏ)
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipInvalid}
                  onChange={(e) => setSkipInvalid(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>Tự động bỏ qua {invalidTeachers.length} dòng lỗi và chỉ nạp dòng hợp lệ (Khuyến nghị)</span>
              </label>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleClearSelectedFile}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Huỷ Bỏ
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={validTeachers.length === 0}
                  className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Nạp {validTeachers.length} Giáo Viên Vào Hệ Thống</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Legacy CSV Preview for Declarations & Passive Logs */}
        {activeImportType !== 'TEACHERS' && legacyParsedRows.length > 0 && (
          <div className="space-y-4 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-emerald-600" />
                Xem Trước Dữ Liệu Đọc Được ({legacyParsedRows.length} hàng):
              </span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Sẵn sàng nạp
              </span>
            </div>

            <div className="overflow-x-auto max-h-52 border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold text-slate-700 sticky top-0">
                  <tr>
                    <th className="p-2.5 border-b">STT</th>
                    <th className="p-2.5 border-b">Giáo Viên</th>
                    <th className="p-2.5 border-b">Loại / Nguồn</th>
                    <th className="p-2.5 border-b">Cấp / Tiêu Đề</th>
                    <th className="p-2.5 border-b">Điểm (+/-)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {legacyParsedRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">{row[0] || '-'}</td>
                      <td className="p-2.5 text-slate-700">{row[1] || '-'}</td>
                      <td className="p-2.5 text-slate-700 truncate max-w-xs">{row[2] || row[3] || '-'}</td>
                      <td className="p-2.5 font-bold text-emerald-700">{row[4] || row[5] || '+2.0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleClearSelectedFile}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Huỷ
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Xác Nhận Nạp {legacyParsedRows.length} Hàng Vào EduEval</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
