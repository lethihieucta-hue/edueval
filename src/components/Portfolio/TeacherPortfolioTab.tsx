import React, { useState } from 'react';
import { Teacher, EvidenceItem, IDPPlan } from '../../types';
import { 
  FolderGit2, 
  Sparkles, 
  Plus, 
  ExternalLink, 
  Award, 
  CheckCircle2, 
  Clock, 
  Target, 
  BookOpen, 
  Lightbulb, 
  FileText,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { fetchGenerateIDP } from '../../services/apiClient';

interface TeacherPortfolioTabProps {
  teachers: Teacher[];
  onUpdateTeacherIDP: (teacherId: string, idp: IDPPlan) => void;
  onAddEvidence: (teacherId: string, evidence: EvidenceItem) => void;
}

export const TeacherPortfolioTab: React.FC<TeacherPortfolioTabProps> = ({
  teachers,
  onUpdateTeacherIDP,
  onAddEvidence,
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [isGeneratingIDP, setIsGeneratingIDP] = useState<boolean>(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);

  // New Evidence State
  const [evidenceTitle, setEvidenceTitle] = useState<string>('');
  const [evidenceCategory, setEvidenceCategory] = useState<string>('Chuyển đổi số');
  const [evidenceType, setEvidenceType] = useState<'IMAGE' | 'PDF' | 'LINK' | 'CERTIFICATE'>('CERTIFICATE');
  const [evidenceDesc, setEvidenceDesc] = useState<string>('');

  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);
  const [modelUsedInfo, setModelUsedInfo] = useState<string | null>(null);

  // Trigger AI IDP Generation with Gemini
  const handleGenerateIDPWithGemini = async () => {
    if (!currentTeacher) return;
    setIsGeneratingIDP(true);
    setAiErrorMessage(null);

    try {
      const generatedIDPData = await fetchGenerateIDP(currentTeacher);

      const newIDP: IDPPlan = {
        id: `idp_${currentTeacher.id}_${Date.now()}`,
        teacherId: currentTeacher.id,
        createdAt: new Date().toLocaleDateString('vi-VN'),
        updatedAt: new Date().toLocaleDateString('vi-VN'),
        overallAssessment: generatedIDPData.overallAssessment || 'Đánh giá tổng quan năng lực giáo viên.',
        strengths: generatedIDPData.strengths || ['Kỹ năng sư phạm đạt chuẩn', 'Nhiệt huyết với công tác'],
        areasForImprovement: generatedIDPData.areasForImprovement || ['Ứng dụng công nghệ số'],
        goals: generatedIDPData.goals || [],
        aiCoachingAdvice: generatedIDPData.aiCoachingAdvice || 'Giáo viên tiếp tục phát huy thế mạnh sư phạm.',
      };

      onUpdateTeacherIDP(currentTeacher.id, newIDP);
    } catch (err: any) {
      console.error('IDP Generation Error:', err);
      setAiErrorMessage(err?.message || '429 RESOURCE_EXHAUSTED: Quá hạn mức yêu cầu API');
    } finally {
      setIsGeneratingIDP(false);
    }
  };

  const handleCreateEvidence = () => {
    if (!evidenceTitle.trim()) {
      alert('Vui lòng nhập tên minh chứng!');
      return;
    }

    const item: EvidenceItem = {
      id: `ev_${Date.now()}`,
      title: evidenceTitle,
      category: evidenceCategory,
      fileUrl: '#',
      fileType: evidenceType,
      uploadedAt: new Date().toLocaleDateString('vi-VN'),
      description: evidenceDesc || 'Minh chứng đã lưu vào Hồ sơ Số.',
      status: 'APPROVED',
    };

    onAddEvidence(currentTeacher.id, item);
    setShowEvidenceModal(false);
    setEvidenceTitle('');
    setEvidenceDesc('');
    alert('Đã tải minh chứng mới lên Hồ sơ Số thành công!');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Teacher Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-purple-200">
              <FolderGit2 className="w-3.5 h-3.5" /> Digital Portfolio & IDP
            </span>
            <span className="text-xs text-slate-500">Khai Vấn Phát Triển Cá Nhân AI</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Hồ Sơ Năng Lực Số & AI Coaching Lộ Trình Phát Triển (IDP)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lưu trữ minh chứng "Storytelling" đa phương tiện và tự động lập Lộ trình Phát triển Cá nhân giải quyết lỗ hổng kỹ năng.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="text-xs font-semibold text-slate-700">Chọn Viên Chức:</label>
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName} ({t.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Teacher Profile Card Header */}
      {currentTeacher && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={currentTeacher.avatar} alt={currentTeacher.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400/50 shadow-md" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">{currentTeacher.fullName}</h3>
                <span className="bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  {currentTeacher.code}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {currentTeacher.department} • {currentTeacher.position} • {currentTeacher.titleGrade} ({currentTeacher.yearsOfTeaching} năm thâm niên)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowEvidenceModal(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>Tải Minh Chứng Mới</span>
            </button>

            <button
              onClick={handleGenerateIDPWithGemini}
              disabled={isGeneratingIDP}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isGeneratingIDP ? 'animate-spin' : ''}`} />
              <span>{isGeneratingIDP ? 'AI Đang Lập IDP...' : '🤖 Khai Vấn IDP Với Gemini AI'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Evidence Gallery & IDP Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Digital Portfolio Storytelling Gallery */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Kho Minh Chứng Số ({currentTeacher?.evidences.length || 0})
            </h3>
            <span className="text-[11px] text-slate-500">Dạng Storytelling</span>
          </div>

          {currentTeacher?.evidences.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Chưa có minh chứng số nào được tải lên. Nhấn "Tải Minh Chứng Mới" để lưu giữ bằng cấp, chuyên đề hoặc video bài giảng.
            </div>
          ) : (
            <div className="space-y-3">
              {currentTeacher?.evidences.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 transition-all text-xs">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-800 line-clamp-1">{item.title}</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded shrink-0">
                      {item.fileType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200/60">
                    <span>Ngày tải: {item.uploadedAt}</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Đã Duyệt
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: AI Coaching IDP Plan */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-indigo-600" />
                Lộ Trình Phát Triển Cá Nhân (IDP - Individual Development Plan)
              </h3>
              <p className="text-xs text-slate-500">Phân tích lỗ hổng kỹ năng & Đề xuất khóa học E-learning từ AI Consultant</p>
            </div>

            {currentTeacher?.idpPlan && (
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-md border border-indigo-200">
                Cập nhật: {currentTeacher.idpPlan.updatedAt}
              </span>
            )}
          </div>

            {aiErrorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <span>Trạng thái: Đã dừng do lỗi</span>
                </div>
                <p className="font-mono text-[11px] bg-rose-100/70 p-2 rounded border border-rose-200 break-all">
                  Chi tiết lỗi API: {aiErrorMessage}
                </p>
                <p className="text-[11px] text-rose-700">
                  Thầy/Cô vui lòng kiểm tra lại API Key hoặc tạo key mới miễn phí trên Google AI Studio qua nút Settings trên Header.
                </p>
              </div>
            )}

          {!currentTeacher?.idpPlan ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-2 animate-pulse" />
              <h4 className="text-sm font-bold text-slate-700 mb-1">Chưa Có Lộ Trình Phát Triển Cá Nhân (IDP)</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                Nhấn nút <strong>"🤖 Khai Vấn IDP Với Gemini AI"</strong> ở trên để Gemini AI tự động phân tích điểm yếu và xuất Lộ trình phát triển năng lực chuẩn hóa.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Overall AI Assessment */}
              <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl border border-indigo-200 text-xs">
                <div className="font-bold text-indigo-900 flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Đánh Giá Tổng Quan Năng Lực Từ Gemini AI Consultant
                </div>
                <p className="text-indigo-950 leading-relaxed font-medium mb-3">
                  {currentTeacher.idpPlan.overallAssessment}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-indigo-200/60">
                  <div>
                    <span className="font-bold text-emerald-800 block mb-1">✓ Điểm Mạnh Nổi Bật:</span>
                    <ul className="list-disc list-inside text-emerald-900 space-y-0.5">
                      {currentTeacher.idpPlan.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-amber-800 block mb-1">⚠ Cần Cải Thiện:</span>
                    <ul className="list-disc list-inside text-amber-900 space-y-0.5">
                      {currentTeacher.idpPlan.areasForImprovement.map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Goals & E-learning Courses */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mục Tiêu Hành Động & Khóa Học E-Learning Khuyên Dùng
                </h4>

                {currentTeacher.idpPlan.goals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{goal.skillGapArea}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                        Thời hạn: {goal.deadline}
                      </span>
                    </div>

                    <p className="text-slate-700 font-medium"><strong>Mục tiêu:</strong> {goal.targetGoal}</p>

                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Các bước thực hiện:</span>
                      <ul className="list-decimal list-inside text-slate-600 space-y-0.5 pl-1">
                        {goal.actionSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    {goal.recommendedCourses.length > 0 && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="font-bold text-purple-900 block mb-1 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                          Khóa học E-learning Đề Xuất:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {goal.recommendedCourses.map((c, idx) => (
                            <div key={idx} className="p-2.5 bg-white rounded-lg border border-purple-200 flex justify-between items-center text-[11px]">
                              <div>
                                <div className="font-bold text-purple-950">{c.title}</div>
                                <div className="text-slate-400">{c.platform} • {c.duration}</div>
                              </div>
                              <span className="text-purple-600 font-bold cursor-pointer hover:underline">Học ngay →</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* AI Coaching Motivation Box */}
              <div className="p-3.5 bg-purple-900 text-purple-100 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <strong className="text-amber-300 font-bold block">Lời Khuyên Khai Vấn (AI Coaching):</strong>
                  <p className="mt-0.5 text-purple-200">{currentTeacher.idpPlan.aiCoachingAdvice}</p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Add Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Tải Minh Chứng Số Mới</h3>
            <p className="text-xs text-slate-500 mb-4">Lưu chứng chỉ, video bài giảng hoặc chuyên đề khoa học</p>

            <div className="space-y-3 text-xs mb-5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Minh Chứng:</label>
                <input
                  type="text"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="Ví dụ: Giấy chứng nhận tập huấn E-learning 2025..."
                  className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Danh Mục:</label>
                  <select
                    value={evidenceCategory}
                    onChange={(e) => setEvidenceCategory(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
                  >
                    <option value="Chuyển đổi số">Chuyển đổi số</option>
                    <option value="Thành tích chuyên môn">Thành tích chuyên môn</option>
                    <option value="Nghiên cứu khoa học">Nghiên cứu khoa học</option>
                    <option value="Đổi mới phương pháp">Đổi mới phương pháp</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Định Dạng:</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
                  >
                    <option value="CERTIFICATE">Chứng chỉ số</option>
                    <option value="IMAGE">Hình ảnh tiết dạy</option>
                    <option value="PDF">Sáng kiến kinh nghiệm (PDF)</option>
                    <option value="LINK">Liên kết E-learning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô Tả Minh Chứng:</label>
                <textarea
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  placeholder="Nhập chi tiết quyết định hoặc nội dung..."
                  className="w-full h-20 p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleCreateEvidence}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md cursor-pointer"
              >
                Lưu Minh Chứng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
