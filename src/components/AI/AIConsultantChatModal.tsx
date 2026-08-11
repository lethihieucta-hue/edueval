import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  HelpCircle,
  Key,
  ShieldCheck
} from 'lucide-react';
import { askEdTechConsultantClient, getStoredApiKey } from '../../services/geminiClient';

interface AIConsultantChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemContext?: any;
  onOpenApiKeyModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

const SAMPLE_PROMPTS = [
  'Quy định khống chế tối đa 20% Hoàn thành xuất sắc nhiệm vụ theo Nghị định 233/2026/NĐ-CP?',
  'Chu kỳ năm học từ 2026-2027 sang 2027-2028 qua mốc tháng 7 được tính toán như thế nào?',
  'Chênh lệch điểm đánh giá giữa Tổ trưởng và Ban Giám hiệu quá 15% thì xử lý thế nào?',
  'Cách xuất Phiếu đánh giá viên chức mẫu chuẩn Nghị định 233/2026/NĐ-CP ra file Word?',
  'Cách xây dựng Lộ trình Phát triển Cá nhân (IDP) nâng cao kỹ năng ứng dụng AI cho giáo viên?'
];

export const AIConsultantChatModal: React.FC<AIConsultantChatModalProps> = ({
  isOpen,
  onClose,
  systemContext,
  onOpenApiKeyModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'AI',
      text: `### 1. **Tóm lược tình huống/yêu cầu:**
Kính chào Thầy/Cô! Tôi là **Trợ lý AI EdTech & Tư Vấn Đánh Giá Viên Chức THPT** (Google Gemini AI).

### 2. **Giải pháp chi tiết:**
- *Thao tác hệ thống:* Thầy/Cô có thể hỏi đáp về quy định **Nghị định 233/2026/NĐ-CP**, tỷ lệ khống chế 20% Top Xuất sắc theo nhóm chức danh, đối soát 360°, xuất Phiếu đánh giá viên chức (.docx / .xlsx) hoặc lập Lộ trình IDP sư phạm.
- *Quản lý năm học:* Tự động nhận diện chu kỳ năm học \`2026 - 2027\` và chuyển tiếp sang \`2027 - 2028\` sau mốc Tháng 7 năm 2027.
- *Khuyến nghị chuyên môn:* Khi thay đổi trọng số thi đua, hãy luôn dùng chế độ **Mô phỏng Sandbox** để kiểm thử phân bố xếp loại trước khi chính thức phê duyệt và ký số.

### 3. **Căn cứ & Lưu ý:**
Hệ thống tuân thủ nghiêm ngặt **Nghị định số 233/2026/NĐ-CP** và các Thông tư chuẩn nghề nghiệp giáo viên THPT của Bộ GD&ĐT.

### 4. **Hành động tiếp theo:**
Thầy/Cô hãy chọn một trong các câu hỏi gợi ý nhanh bên dưới hoặc nhập thắc mắc của mình!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'Gemini AI Sư Phạm (NĐ 233)',
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hasApiKey = !!getStoredApiKey();

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    const response = await askEdTechConsultantClient(textToSend, systemContext);

    const aiMsg: ChatMessage = {
      id: `ai_${Date.now()}`,
      sender: 'AI',
      text: response.reply,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: response.modelUsed,
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[620px] shadow-2xl border border-slate-200 flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>AI EdTech & Quản Trị Đánh Giá Viên Chức</span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.2 rounded-full border border-amber-400/30">
                  Gemini Free
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">Tư vấn chuyên môn, giải đáp Nghị định 90/2020 & khai vấn IDP</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!hasApiKey && onOpenApiKeyModal && (
              <button
                onClick={onOpenApiKeyModal}
                className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                title="Nhập API Key để sử dụng trực tiếp"
              >
                <Key className="w-3 h-3" />
                <span>Nhập Key</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${
                msg.sender === 'USER' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${
                msg.sender === 'USER' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-indigo-600 text-white shadow-sm'
              }`}>
                {msg.sender === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-4 shadow-xs ${
                msg.sender === 'USER'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none space-y-2'
              }`}>
                <div className="whitespace-pre-line leading-relaxed font-sans text-xs">
                  {msg.text}
                </div>
                
                <div className={`text-[10px] mt-1 flex items-center justify-between ${
                  msg.sender === 'USER' ? 'text-blue-200' : 'text-slate-400'
                }`}>
                  {msg.modelUsed && (
                    <span className="text-[9px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.2 rounded">
                      Model: {msg.modelUsed}
                    </span>
                  )}
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold p-3 bg-white rounded-2xl border border-slate-200 w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span>Chuyên gia AI đang phân tích dữ liệu và soạn phản hồi cho Thầy/Cô...</span>
            </div>
          )}
        </div>

        {/* Sample Prompts */}
        <div className="p-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto flex items-center gap-2 text-[11px]">
          <span className="text-slate-500 font-semibold shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> Câu hỏi mẫu:
          </span>
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 transition-all cursor-pointer font-medium"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Hỏi bất kỳ điều gì về đánh giá viên chức, NĐ 90/2020, sáng kiến kinh nghiệm..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputQuery.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
