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
  Plus
} from 'lucide-react';

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
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. EXPORT SAMPLE TEMPLATES (XUẤT FILE MẪU)
  const handleExportTemplate = (type: ImportType) => {
    let headers = '';
    let sampleData = '';
    let filename = '';

    if (type === 'TEACHERS') {
      filename = 'Mau_Import_DanhSach_GiaoVien_EduEval.csv';
      headers = 'Mã GV,Họ và Tên,Tổ Chuyên Môn,Chức Vụ,Hạng Chức Danh,Thâm Niên (Năm),Email,Số Điện Thoại\n';
      sampleData = 
        'GV-CT-101,Nguyễn Văn An,Tổ Toán,Giáo viên THPT,Giáo viên THPT Hạng II,12,nguyenvanan@thptchauthanha.edu.vn,0912345678\n' +
        'GV-CT-102,Lê Thị Mai,Tổ Văn - GDKTPL,Tổ trưởng chuyên môn,Giáo viên THPT Hạng I,18,lethimai@thptchauthanha.edu.vn,0987654321\n' +
        'GV-CT-103,Trần Quốc Bảo,Tổ Lý - TD - QP,Giáo viên THPT,Giáo viên THPT Hạng III,4,tranquocbao@thptchauthanha.edu.vn,0909123456\n';
    } else if (type === 'DECLARATIONS') {
      filename = 'Mau_Import_TuKeKhai_PhongTrao_EduEval.csv';
      headers = 'Mã GV,Loại Khai Báo (BONUS_AWARD/PENALTY_INFRACTION),Cấp/Danh Mục,Tên Phong Trào hoặc Lỗi Vi Phạm,Giải Thưởng hoặc Chi Tiết,Điểm Đề Xuất (+/-),Minh Chứng/Mô Tả\n';
      sampleData = 
        'gv_01,BONUS_AWARD,Cấp Tỉnh / Thành phố,Hội thi Thiết kế Bài giảng Số & Elearning,Giải Nhất,8.0,Quyết định khen thưởng số 1234/QĐ-SGDĐT\n' +
        'gv_04,BONUS_AWARD,Cấp Xã (Cụm Trường),Hội thao Người giáo viên THPT,Giải Nhất,4.0,Giấy khen cụm thi đua số 3 môn bóng chuyền\n' +
        'gv_03,PENALTY_INFRACTION,Vi phạm nếp sống / Kỷ luật,Nộp chậm giáo án & trễ sinh hoạt chào cờ,Trễ 15 phút chào cờ,-2.0,Giải trình tự kiểm điểm nộp chậm giáo án tuần 10\n';
    } else {
      filename = 'Mau_Import_DiemThuDong_AutoLog_EduEval.csv';
      headers = 'Mã GV,Nguồn Dữ Liệu (SO_DAU_BAI/MAY_CHAM_CONG/HE_THONG_GIAO_AN/KHEN_THUONG_HSG),Loại Điểm (BONUS/PENALTY),Tiêu Đề Sự Kiện,Điểm Quy Đổi (+/-),Mô Tả Chi Tiết\n';
      sampleData = 
        'gv_01,KHEN_THUONG_HSG,BONUS,Bồi dưỡng học sinh giỏi Toán 12 đạt 02 Giải Nhất cấp Tỉnh,10.0,Ghi nhận tự động từ quyết định thi HSG\n' +
        'gv_02,MAY_CHAM_CONG,PENALTY,Đi trễ máy chấm công FaceID ngày 15/11,-1.5,Máy quét chấm công ghi nhận trễ 20 phút\n' +
        'gv_06,SO_DAU_BAI,BONUS,100% Tiết dạy đăng ký bài giảng số tích cực,3.0,Ghi nhận từ sổ đầu bài điện tử tuần 12\n';
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
  };

  // 2. PARSE CSV FILE UPON UPLOAD
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError(null);
    setImportSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);
      parseCSV(text);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const parseCSV = (csvText: string) => {
    try {
      const lines = csvText.split(/\r\n|\n/).filter((line) => line.trim() !== '');
      if (lines.length < 2) {
        setParseError('File không có dữ liệu hoặc sai định dạng mẫu!');
        setParsedRows([]);
        return;
      }

      // First line is headers
      const headers = lines[0].replace(/^\uFEFF/, '').split(',').map(h => h.trim());
      const dataRows = [];

      for (let i = 1; i < lines.length; i++) {
        // Simple comma split respecting quotes
        const rawLine = lines[i];
        if (!rawLine.trim()) continue;

        // basic regex for csv splitting
        const values = rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(',');
        const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());

        if (cleanValues.length >= 2) {
          dataRows.push(cleanValues);
        }
      }

      setParsedRows(dataRows);
    } catch (err) {
      setParseError('Lỗi khi đọc file CSV/Excel. Vui lòng kiểm tra định dạng!');
      setParsedRows([]);
    }
  };

  // 3. PROCESS IMPORT INTO APPLICATION STATE
  const handleConfirmImport = () => {
    if (parsedRows.length === 0) {
      alert('Không có hàng dữ liệu hợp lệ để nhập!');
      return;
    }

    let importedCount = 0;
    const nowStr = new Date().toLocaleString('vi-VN');

    if (activeImportType === 'TEACHERS') {
      const newTeachersList: Teacher[] = [];

      parsedRows.forEach((row, idx) => {
        const [code, fullName, department, position, titleGrade, yearsOfTeaching, email, phone] = row;
        if (!fullName) return;

        const teacherId = `gv_imp_${Date.now()}_${idx}`;
        const newTeacher: Teacher = {
          id: teacherId,
          code: code || `GV-${Date.now()}-${idx}`,
          fullName: fullName,
          email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@thptchauthanha.edu.vn`,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          department: (department as Department) || 'Tổ Toán',
          position: (position as any) || 'Giáo viên THPT',
          titleGrade: (titleGrade as any) || 'Giáo viên THPT Hạng II',
          yearsOfTeaching: Number(yearsOfTeaching) || 5,
          phone: phone || '0900 000 000',
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
            scores: {}
          }
        };

        newTeachersList.push(newTeacher);
        importedCount++;
      });

      setTeachers(prev => [...newTeachersList, ...prev]);
      onAddAuditLog('NHẬP FILE MẪU DANH SÁCH GV', 'Hệ thống', `Đã nhập thành công ${importedCount} giáo viên từ file mẫu CSV`);

    } else if (activeImportType === 'DECLARATIONS') {
      const newDeclarationsList: SelfDeclarationRecord[] = [];

      parsedRows.forEach((row, idx) => {
        const [teacherRef, type, categoryOrLevel, title, awardNameOrInfraction, suggestedPoints, evidenceUrlOrDesc] = row;
        
        // Find teacher by code or ID or name
        const foundTeacher = teachers.find(t => 
          t.id === teacherRef || t.code === teacherRef || t.fullName.toLowerCase().includes((teacherRef || '').toLowerCase())
        ) || teachers[0];

        if (!title) return;

        const newRec: SelfDeclarationRecord = {
          id: `sd_imp_${Date.now()}_${idx}`,
          teacherId: foundTeacher.id,
          teacherName: foundTeacher.fullName,
          department: foundTeacher.department,
          type: (type === 'PENALTY_INFRACTION' ? 'PENALTY_INFRACTION' : 'BONUS_AWARD'),
          title: title,
          categoryOrLevel: (categoryOrLevel as any) || 'Cấp Trường',
          awardNameOrInfraction: awardNameOrInfraction || 'Giải Nhất',
          suggestedPoints: Number(suggestedPoints) || (type === 'PENALTY_INFRACTION' ? -2.0 : 3.0),
          evidenceUrlOrDesc: evidenceUrlOrDesc || 'Nhập từ file mẫu đính kèm.',
          submittedAt: nowStr,
          status: 'PENDING_HEAD'
        };

        newDeclarationsList.push(newRec);
        importedCount++;
      });

      setSelfDeclarations(prev => [...newDeclarationsList, ...prev]);
      onAddAuditLog('NHẬP FILE MẪU TỰ KÊ KHAI', 'Hệ thống', `Đã nhập ${importedCount} bản kê khai phong trào/vi phạm từ file mẫu`);

    } else {
      // PASSIVE LOGS
      parsedRows.forEach((row, idx) => {
        const [teacherRef, source, type, title, points, description] = row;
        
        const foundTeacher = teachers.find(t => 
          t.id === teacherRef || t.code === teacherRef || t.fullName.toLowerCase().includes((teacherRef || '').toLowerCase())
        ) || teachers[0];

        if (!title) return;

        const newLog: PassiveLog = {
          id: `pl_imp_${Date.now()}_${idx}`,
          teacherId: foundTeacher.id,
          type: type === 'PENALTY' ? 'PENALTY' : 'BONUS',
          source: (source as any) || 'SO_DAU_BAI',
          title: title,
          description: description || 'Dữ liệu nhập từ file mẫu tự động.',
          points: Number(points) || (type === 'PENALTY' ? -2.0 : 2.0),
          timestamp: nowStr,
          verified: true
        };

        onAddPassiveLog(foundTeacher.id, newLog);
        importedCount++;
      });

      onAddAuditLog('NHẬP FILE MẪU ĐIỂM THỤ ĐỘNG', 'Hệ thống', `Đã nhập ${importedCount} ghi nhận điểm thụ động từ file mẫu`);
    }

    setImportSuccessMsg(`Thành công! Đã nhập ${importedCount} hàng dữ liệu vào hệ thống EduEval.`);
    setParsedRows([]);
    setFileName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Xuất File Mẫu & Nhập Dữ Liệu Tự Động (EduEval)
              </h3>
              <p className="text-xs text-slate-500">
                Tải file mẫu Excel/CSV chuẩn định dạng và tải file lên để tự động cập nhật hệ thống
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {importSuccessMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-bold mb-5">
          <button
            onClick={() => {
              setActiveImportType('TEACHERS');
              setParsedRows([]);
              setFileName('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeImportType === 'TEACHERS'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Danh Sách Giáo Viên
          </button>

          <button
            onClick={() => {
              setActiveImportType('DECLARATIONS');
              setParsedRows([]);
              setFileName('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeImportType === 'DECLARATIONS'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Tự Kê Khai & Phong Trào
          </button>

          <button
            onClick={() => {
              setActiveImportType('PASSIVE_LOGS');
              setParsedRows([]);
              setFileName('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeImportType === 'PASSIVE_LOGS'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Điểm Thụ Động
          </button>
        </div>

        {/* Step 1: Export Template Button */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-200">
              BƯỚC 1: XUẤT FILE MẪU CHUẨN
            </span>
            <h4 className="font-bold text-xs text-slate-800 mt-1">
              Tải file mẫu Excel/CSV đúng cấu trúc hệ thống EduEval
            </h4>
            <p className="text-[11px] text-slate-500">
              File có mã hóa UTF-8 tiếng Việt nguyên vẹn, tương thích Microsoft Excel & Google Sheets.
            </p>
          </div>

          <button
            onClick={() => handleExportTemplate(activeImportType)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Tải File Mẫu (.CSV)</span>
          </button>
        </div>

        {/* Step 2: Upload Filled File */}
        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-all bg-white mb-5">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <span className="font-bold text-xs text-slate-800 block mb-1">
            BƯỚC 2: TẢI FILE ĐÃ ĐIỀN DỮ LIỆU LÊN HỆ THỐNG
          </span>
          <p className="text-[11px] text-slate-500 mb-3">
            Chọn file mẫu .CSV hoặc Excel (.csv format) đã nhập đúng định dạng
          </p>

          <label className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all">
            <FileCheck className="w-4 h-4" />
            <span>Chọn File Từ Máy Tính</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {fileName && (
            <div className="mt-3 text-xs font-semibold text-slate-700 bg-slate-100 py-1.5 px-3 rounded-lg inline-block">
              📄 File đã chọn: <strong>{fileName}</strong>
            </div>
          )}
        </div>

        {parseError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {/* Parsed Rows Preview Table */}
        {parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-emerald-600" />
                Xem Trước Dữ Liệu Đọc Được ({parsedRows.length} hàng):
              </span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Sẵn sàng nhập
              </span>
            </div>

            <div className="overflow-x-auto max-h-48 border border-slate-200 rounded-xl">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 font-bold text-slate-700 sticky top-0">
                  <tr>
                    <th className="p-2 border-b">STT</th>
                    <th className="p-2 border-b">Cột 1 (Mã / Tên)</th>
                    <th className="p-2 border-b">Cột 2 (Họ tên / Loại)</th>
                    <th className="p-2 border-b">Cột 3 (Tổ / Cấp)</th>
                    <th className="p-2 border-b">Cột 4 (Chức vụ / Tiêu đề)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2 font-bold text-slate-800">{row[0] || '-'}</td>
                      <td className="p-2 text-slate-700">{row[1] || '-'}</td>
                      <td className="p-2 text-slate-600">{row[2] || '-'}</td>
                      <td className="p-2 text-slate-600 truncate max-w-xs">{row[3] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setParsedRows([]);
                  setFileName('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy Chọn File
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Xác Nhận Nhập {parsedRows.length} Hàng Vào EduEval</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
