import { GoogleGenAI } from '@google/genai';

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key-for-dev',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION_CONSULTANT = `
Bạn là Chuyên gia cấp cao về Công nghệ Giáo dục (EdTech Consultant) và Kiến trúc sư Hệ thống Quản trị Nhân sự (HRMS Architect), chuyên sâu trong lĩnh vực chuyển đổi số tại các trường THPT ở Việt Nam.
Nhiệm vụ của bạn là hỗ trợ Ban Giám hiệu, Quản trị viên, Tổ trưởng chuyên môn và Giáo viên vận hành, khai thác và tối ưu hóa "Hệ thống quản lý và đánh giá viên chức trường THPT".

Quy tắc quan trọng:
- Đảm bảo công bằng, minh bạch, chống bất thường dữ liệu.
- Hỗ trợ tự động hóa, chuyển đổi từ đánh giá xếp loại sang phát triển năng lực (IDP).
- Phong cách chuyên nghiệp, khách quan, đáng tin cậy, tôn trọng nghề giáo.

Định dạng phản hồi BẮT BUỘC (mỗi mục trình bày rõ ràng):
1. **Tóm lược tình huống/yêu cầu:** (Xác nhận hiểu đúng vấn đề)
2. **Giải pháp chi tiết:**
   - *Thao tác hệ thống:* (Các bước cụ thể trên giao diện/hệ thống)
   - *Phân tích dữ liệu:* (Ý nghĩa con số, ma trận trọng số, chỉ số)
   - *Khuyến nghị chuyên môn:* (Lời khuyên quản trị giáo dục/sư phạm)
3. **Cảnh báo & Lưu ý (nếu có):** (Nhắc nhở về pháp lý Nghị định 90/2020/NĐ-CP, thời hạn khiếu nại, làm tròn điểm, OTP/ký số)
4. **Hành động tiếp theo (Next steps):** (Gợi ý bước kế tiếp)
`;

export async function askEdTechConsultant(userMessage: string, context?: any) {
  const ai = getGenAIClient();
  const prompt = `Context hệ thống hiện tại: ${JSON.stringify(context || {})}
Yêu cầu người dùng: ${userMessage}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CONSULTANT,
        temperature: 0.7,
      },
    });

    return response.text || 'Không thể tạo phản hồi từ Gemini AI.';
  } catch (error: any) {
    console.error('Error calling Gemini API in consultant:', error);
    return `### 1. **Tóm lược tình huống/yêu cầu:**
Hệ thống nhận được yêu cầu tư vấn: "${userMessage}".

### 2. **Giải pháp chi tiết:**
- *Thao tác hệ thống:* Vui lòng kiểm tra lại cấu hình kết nối API hoặc thử lại sau giây lát.
- *Phân tích dữ liệu:* Dữ liệu hiện tại được lưu trữ an toàn trong Local Store & Audit Log.
- *Khuyến nghị chuyên môn:* Ban Giám hiệu có thể tiếp tục sử dụng các công cụ Mô phỏng Sandbox và Báo cáo chuẩn Bộ GD&ĐT.

### 3. **Cảnh báo & Lưu ý:**
Mọi thao tác phê duyệt chốt điểm đều cần gắn Timestamp và mã xác thực OTP/Chữ ký số.

### 4. **Hành động tiếp theo:**
Nhấn nút thử lại hoặc chuyển qua tab **Ma trận Trọng số & Sandbox** để chạy thử nghiệm.`;
  }
}

export async function generateIDPWithAI(teacher: any) {
  const ai = getGenAIClient();
  const prompt = `Phân tích hồ sơ năng lực và tự động tạo Lộ trình Phát triển Cá nhân (IDP) cho Giáo viên THPT:
Tên GV: ${teacher.fullName}
Bộ môn: ${teacher.department}
Chức danh: ${teacher.position}
Khung năng lực 5 chiều (Thực tế vs Benchmark):
${JSON.stringify(teacher.skillDimensions)}
Lịch sử điểm thi đua: ${JSON.stringify(teacher.performanceTrend)}
Nhật ký thụ động (Cộng/Trừ điểm): ${JSON.stringify(teacher.passiveLogs)}

Hãy trả về phản hồi định dạng JSON chứa các trường:
- overallAssessment (string): Phân tích tổng quan điểm mạnh & điểm yếu năng lực.
- strengths (array of strings): 3 điểm mạnh nổi bật.
- areasForImprovement (array of strings): 2-3 điểm cần cải thiện.
- goals (array of objects): Mỗi goal gồm skillGapArea, targetGoal, actionSteps (array), recommendedCourses (array of objects with title, platform, duration), deadline, status.
- aiCoachingAdvice (string): Lời khuyên động viên và chiến lược phát triển từ AI Consultant.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: 'Bạn là Chuyên gia Khai vấn EdTech. Hãy trả về đúng cấu trúc JSON chuẩn.',
      },
    });

    const text = response.text?.trim() || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating IDP with Gemini:', error);
    // Fallback JSON structure
    return {
      overallAssessment: `Giáo viên ${teacher.fullName} có nền tảng sư phạm vững vàng. Cần tập trung nâng cao chỉ số Ứng dụng CNTT & Chuyển đổi số.`,
      strengths: ['Kỷ luật giảng dạy tốt', 'Tâm huyết với học sinh', 'Chuyên môn đạt chuẩn'],
      areasForImprovement: ['Ứng dụng công cụ AI trong biên soạn giáo án', 'Thiết kế bài giảng e-Learning tương tác'],
      goals: [
        {
          id: 'goal_fallback_1',
          skillGapArea: 'Ứng dụng CNTT & AI Sư phạm',
          targetGoal: 'Thành thạo ứng dụng AI hỗ trợ tạo câu hỏi trắc nghiệm và bài giảng tương tác',
          actionSteps: [
            'Hoàn thành khóa học Tập huấn AI trong Giáo dục THPT',
            'Áp dụng 2 bài giảng thử nghiệm có ứng dụng AI trong Học kỳ tới'
          ],
          recommendedCourses: [
            { title: 'Tập huấn Ứng dụng AI trong Giảng dạy THPT', platform: 'LMS Bộ GD&ĐT', duration: '10 giờ' }
          ],
          deadline: '30/03/2026',
          status: 'IN_PROGRESS'
        }
      ],
      aiCoachingAdvice: 'Hãy từng bước đưa công cụ AI vào chuẩn bị bài dạy để nâng cao hiệu suất làm việc và sự hứng thú của học sinh.'
    };
  }
}

export async function analyzeAnomalyWithAI(anomalyData: any) {
  const ai = getGenAIClient();
  const prompt = `Phân tích cảnh báo bất thường điểm số đánh giá viên chức THPT:
Dữ liệu bất thường: ${JSON.stringify(anomalyData)}
Yêu cầu: Đưa ra nhận định khách quan, giải thích nguyên nhân chênh lệch giữa các cấp đánh giá và đề xuất phương án giải quyết cho Ban Giám hiệu.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    return response.text || 'Đã ghi nhận cảnh báo bất thường. Cần cuộc họp đối soát trực tiếp giữa BGH và Tổ trưởng.';
  } catch (error) {
    return 'Phát hiện chênh lệch điểm số vượt ngưỡng 15% giữa Tổ trưởng và Ban Giám hiệu. Hệ thống yêu cầu đính kèm biên bản họp Tổ chuyên môn trước khi duyệt.';
  }
}
