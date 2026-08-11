import React, { useState, useEffect } from 'react';
import { 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  X, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  HelpCircle,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  getPreferredModel, 
  setPreferredModel, 
  AVAILABLE_MODELS, 
  testGeminiApiKey 
} from '../../services/geminiClient';

interface ApiKeyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: (hasKey: boolean) => void;
}

export const ApiKeyGuideModal: React.FC<ApiKeyGuideModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3-flash-preview');
  
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    modelUsed?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setSelectedModel(getPreferredModel());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        message: 'Vui lòng nhập hoặc dán mã API Key trước khi kiểm tra!',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testGeminiApiKey(apiKey.trim());
    setTestResult(res);
    setIsTesting(false);
  };

  const handleSave = () => {
    setStoredApiKey(apiKey.trim());
    setPreferredModel(selectedModel);
    if (onKeyUpdated) {
      onKeyUpdated(!!apiKey.trim());
    }
    onClose();
  };

  const handleClearKey = () => {
    setApiKey('');
    setStoredApiKey('');
    setTestResult(null);
    if (onKeyUpdated) {
      onKeyUpdated(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in duration-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 shrink-0">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
                Thiết Lập Google Gemini AI (Bản Miễn Phí)
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                100% Free
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Hướng dẫn đơn giản 3 bước giúp Thầy/Cô kết nối AI phục vụ đánh giá, khai vấn IDP và tư vấn sư phạm.
            </p>
          </div>
        </div>

        {/* 3 Step Visual Guide for Teachers */}
        <div className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-200 mb-6 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            3 Bước Lấy Khóa API Miễn Phí (Chỉ Mất 30 Giây)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            
            {/* Step 1 */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center">1</span>
                  <span>Mở Google AI Studio</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Đăng nhập bằng tài khoản Google bất kỳ (hoàn toàn miễn phí, không cần thẻ tín dụng).
                </p>
              </div>
              <a
                href="https://aistudio.google.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-1 text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-all cursor-pointer"
              >
                <span>Mở AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Step 2 */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center">2</span>
                  <span>Tạo Khóa API Key</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Nhấn nút màu xanh <strong className="text-blue-700 font-bold">"Create API key"</strong> và sao chép (Copy) đoạn mã khóa.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-slate-400 bg-slate-50 p-1.5 rounded text-center font-mono">
                AIzaSy... (Khóa riêng)
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center">3</span>
                  <span>Dán & Kiểm Tra</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Dán vào ô nhập bên dưới và nhấn nút <strong className="text-emerald-700 font-bold">"Kiểm tra kết nối"</strong> để bắt đầu sử dụng.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-700 bg-emerald-50 p-1.5 rounded text-center font-semibold">
                ✓ Sử dụng trọn đời
              </div>
            </div>

          </div>
        </div>

        {/* API Key Input Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-600" />
                Nhập Khóa Gemini API Key Của Thầy/Cô:
              </span>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="text-slate-400 hover:text-rose-600 text-[11px] font-normal cursor-pointer"
                >
                  Xóa khóa đã lưu
                </button>
              )}
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="Dán mã API Key tại đây (bắt đầu bằng AIzaSy...)"
                className="w-full pl-3.5 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />

              <div className="absolute right-2 top-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                  title={showKey ? 'Ẩn khóa' : 'Hiện khóa'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Test Key Button & Result Banner */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting || !apiKey.trim()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Zap className={`w-3.5 h-3.5 text-amber-400 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Đang Kiểm Tra Kết Nối...' : 'Kiểm Tra Kết Nối (Test Key)'}</span>
            </button>

            <p className="text-[11px] text-slate-400">
              Khóa được lưu bảo mật trong trình duyệt (Local Storage).
            </p>
          </div>

          {/* Test Result Message Banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold">
                  {testResult.success ? 'Kiểm Tra Thành Công!' : 'Không Thể Kết Nối:'}
                </div>
                <p className="mt-0.5 leading-relaxed">{testResult.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Model Selection Cards */}
        <div className="mb-6 space-y-2">
          <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Chọn Model Gemini AI Mặc Định:</span>
            <span className="text-[11px] text-slate-400 font-normal">Tự động Fallback khi model bận</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {AVAILABLE_MODELS.map((m) => {
              const isSelected = selectedModel === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs text-slate-900 line-clamp-1">{m.name.split(' (')[0]}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">{m.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Chuẩn bảo mật Google AI Studio</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="py-2.5 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Lưu & Bắt Đầu Sử Dụng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
