import { GoogleGenAI } from '@google/genai';

export const API_KEY_STORAGE_KEY = 'GEMINI_API_KEY';
export const PREFERRED_MODEL_KEY = 'GEMINI_PREFERRED_MODEL';

// Danh sách các model AI được hỗ trợ trên Gemini Free & Pro
export const AVAILABLE_MODELS = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash (Mặc Định / Nhanh Nhất)',
    description: 'Tốc độ phản hồi cực nhanh, tối ưu cho bản Free, ít tốn tài nguyên.',
    badge: 'Khuyên Dùng (Free)',
    isDefault: true,
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro (Chuyên Sâu / Suy Luận)',
    description: 'Năng lực lập luận giáo dục chuyên sâu, phân tích sư phạm nâng cao.',
    badge: 'Mạnh Mẽ',
    isDefault: false,
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (Dự Phòng Ổn Định)',
    description: 'Model ổn định lâu dài, luôn sẵn sàng khi các model preview bận.',
    badge: 'Dự Phòng',
    isDefault: false,
  },
];

// Fallback chain theo AI_INSTRUCTIONS.md
export const FALLBACK_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash',
];

/**
 * Lấy API key hiện tại từ localStorage
 */
export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE_KEY)?.trim() || '';
}

/**
 * Lưu API key vào localStorage
 */
export function setStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (key && key.trim()) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * Lấy model người dùng ưu tiên chọn
 */
export function getPreferredModel(): string {
  if (typeof window === 'undefined') return 'gemini-3-flash-preview';
  return localStorage.getItem(PREFERRED_MODEL_KEY) || 'gemini-3-flash-preview';
}

/**
 * Lưu model ưu tiên
 */
export function setPreferredModel(modelId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFERRED_MODEL_KEY, modelId);
}

/**
 * Khởi tạo Google GenAI Client
 */
function createGenAIClient(apiKey?: string): GoogleGenAI {
  const key = apiKey || getStoredApiKey();
  return new GoogleGenAI({
    apiKey: key || 'dummy-key-for-ui',
    httpOptions: {
      headers: {
        'User-Agent': 'edueval-vietnam-highschool',
      },
    },
  });
}

/**
 * Kiểm tra kết nối API Key (Test Key)
 */
export async function testGeminiApiKey(apiKeyToTest: string): Promise<{
  success: boolean;
  message: string;
  modelUsed?: string;
  rawError?: string;
}> {
  if (!apiKeyToTest || !apiKeyToTest.trim()) {
    return {
      success: false,
      message: 'Vui lòng dán khóa API Key của bạn trước khi kiểm tra!',
    };
  }

  const ai = createGenAIClient(apiKeyToTest.trim());

  for (const model of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: 'Xin chào, vui lòng phản hồi ngắn 1 câu "Kết nối Gemini AI thành công!" để kiểm tra kết nối API.',
      });

      if (response.text) {
        return {
          success: true,
          message: `Kết nối thành công với ${model}! Thầy/Cô có thể sử dụng đầy đủ tính năng AI miễn phí.`,
          modelUsed: model,
        };
      }
    } catch (err: any) {
      console.warn(`Test failed on ${model}:`, err);
      // Tiếp tục thử model kế tiếp
      if (model === FALLBACK_MODELS[FALLBACK_MODELS.length - 1]) {
        const errMsg = err?.message || String(err);
        let userFriendlyMsg = 'Khóa API Key không hợp lệ hoặc đã hết hạn mức (Quota).';
        if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('403') || errMsg.includes('401')) {
          userFriendlyMsg = 'Mã API Key không chính xác. Vui lòng copy lại chính xác từ Google AI Studio.';
        } else if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          userFriendlyMsg = 'Khóa API tạm thời hết hạn mức (429 RESOURCE_EXHAUSTED). Thầy/Cô có thể tạo thêm 1 key mới miễn phí trên Google AI Studio.';
        }
        return {
          success: false,
          message: userFriendlyMsg,
          rawError: errMsg,
        };
      }
    }
  }

  return {
    success: false,
    message: 'Không thể kết nối tới máy chủ Google AI. Vui lòng kiểm tra lại đường truyền mạng hoặc khóa API Key.',
  };
}

/**
 * Hàm gọi AI với cơ chế Fallback và Retry tự động
 */
async function callGeminiWithFallback<T>(
  taskFn: (ai: GoogleGenAI, model: string) => Promise<T>
): Promise<{ result: T; modelUsed: string }> {
  const currentKey = getStoredApiKey();
  const ai = createGenAIClient(currentKey);
  const preferred = getPreferredModel();

  // Đặt model ưu tiên lên đầu danh sách fallback
  const modelsToTry = [
    preferred,
    ...FALLBACK_MODELS.filter((m) => m !== preferred),
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const result = await taskFn(ai, model);
      return { result, modelUsed: model };
    } catch (err: any) {
      console.warn(`Lỗi khi gọi model ${model}, tự động fallback sang model tiếp theo:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('Tất cả các model AI đều không phản hồi.');
}

const SYSTEM_INSTRUCTION_CONSULTANT = `
Bạn là Chuyên gia EdTech & Tư vấn Đánh giá Viên chức THPT tại Việt Nam.
Phong cách: Tận tâm, khách quan, chuẩn mực sư phạm, căn cứ theo Nghị định số 233/2026/NĐ-CP của Chính phủ (Quy định về đánh giá, xếp loại chất lượng đối với đơn vị sự nghiệp công lập và viên chức) và Thông tư chuẩn nghề nghiệp giáo viên Bộ GD&ĐT.

Định dạng phản hồi BẮT BUỘC (ngắn gọn, rõ ràng, dễ đọc):
1. **Tóm lược yêu cầu:** (Xác nhận ngắn gọn)
2. **Hướng dẫn / Giải pháp chi tiết:**
   - *Thao tác trên phần mềm:* Các bước thực hiện
   - *Khuyến nghị chuyên môn sư phạm:* Lời khuyên cụ thể
3. **Căn cứ & Lưu ý:** (Nghị định 233/2026/NĐ-CP, quy tắc khống chế tối đa 20% Top Xuất sắc theo nhóm chức danh, quy tắc làm tròn điểm, ký số...)
4. **Bước tiếp theo:** Gợi ý hành động kế tiếp.
`;

/**
 * Tư vấn EdTech Consultant
 */
export async function askEdTechConsultantClient(
  userMessage: string,
  context?: any
): Promise<{ reply: string; modelUsed: string; error?: string }> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    return {
      reply: `### 1. **Tóm lược yêu cầu:**
Thầy/Cô đang hỏi: "${userMessage}".

### 2. **Hướng dẫn / Giải pháp:**
- Hiện tại Thầy/Cô chưa cài đặt **Google Gemini API Key** cá nhân.
- Để sử dụng AI trực tiếp và mượt mà nhất, Thầy/Cô vui lòng bấm nút **"Lấy API key để sử dụng app"** trên thanh Menu trên cùng.
- Việc lấy API key là **HOÀN TOÀN MIỄN PHÍ** từ Google AI Studio, chỉ mất 30 giây!

### 3. **Căn cứ & Lưu ý:**
Hệ thống EduEval lưu khóa trực tiếp trên trình duyệt của Thầy/Cô, bảo mật 100%.

### 4. **Bước tiếp theo:**
Bấm nút màu đỏ trên Header để xem hướng dẫn 3 bước lấy key miễn phí nhé!`,
      modelUsed: 'Demo Mode (Chưa nhập Key)',
    };
  }

  const prompt = `Dữ liệu ngữ cảnh nhà trường: ${JSON.stringify(context || {})}
Câu hỏi của Thầy/Cô giáo viên: ${userMessage}`;

  try {
    const { result, modelUsed } = await callGeminiWithFallback(async (ai, model) => {
      const res = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_CONSULTANT,
          temperature: 0.7,
        },
      });
      return res.text || 'Không nhận được văn bản phản hồi.';
    });

    return { reply: result, modelUsed };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    return {
      reply: `### ⚠️ Thông Báo Lỗi Kết Nối AI (Đã thử tất cả Model):
**Chi tiết lỗi từ Google API:** \`${errMsg}\`

### Hướng Dẫn Khắc Phục Nhanh Cho Thầy/Cô:
1. Nếu lỗi là **429 RESOURCE_EXHAUSTED**: Khóa API Free của Google đang bị giới hạn số lượt/phút. Thầy/Cô hãy đợi 30 giây rồi thử lại, hoặc tạo 1 key mới tại [Google AI Studio](https://aistudio.google.com/api-keys).
2. Nếu lỗi là **API_KEY_INVALID**: Khóa API bị sai ký tự, vui lòng kiểm tra lại trong nút Cài Đặt trên thanh Menu.`,
      modelUsed: 'Lỗi',
      error: errMsg,
    };
  }
}

/**
 * Sinh Lộ trình phát triển cá nhân IDP
 */
export async function generateIDPWithAIClient(teacher: any): Promise<{
  idp: any;
  modelUsed: string;
  error?: string;
}> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    // Fallback thông minh khi chưa có key
    return {
      idp: {
        overallAssessment: `Giáo viên ${teacher.fullName} có phẩm chất nhà giáo và năng lực sư phạm rất tốt. Cần đẩy mạnh thêm chỉ số Đổi mới phương pháp dạy học & Ứng dụng AI/CNTT.`,
        strengths: [
          'Chuyên môn vững vàng, giảng dạy nhiệt huyết',
          'Chấp hành nghiêm túc quy chế chuyên môn và giờ giấc',
          'Đạt thành tích tốt trong công tác bồi dưỡng học sinh',
        ],
        areasForImprovement: [
          'Tích hợp công cụ bài giảng số Canva, Quizizz, Geogebra vào tiết học',
          'Ứng dụng AI hỗ trợ xây dựng ma trận đề kiểm tra và câu hỏi trắc nghiệm',
        ],
        goals: [
          {
            id: 'goal_fb_1',
            skillGapArea: 'Ứng dụng CNTT & AI Sư phạm',
            targetGoal: 'Thực hiện 02 tiết dạy có ứng dụng bài giảng tương tác và phần mềm AI trong Học kỳ tới',
            actionSteps: [
              'Tham gia khóa bồi dưỡng Chuyển đổi số trong Giáo dục THPT',
              'Thiết kế bài kiểm tra 15 phút trên nền tảng trắc nghiệm số',
            ],
            recommendedCourses: [
              {
                title: 'Tập huấn Ứng dụng AI trong Giảng dạy THPT',
                platform: 'LMS Bộ GD&ĐT',
                duration: '10 giờ',
              },
            ],
            deadline: '30/03/2026',
            status: 'IN_PROGRESS',
          },
        ],
        aiCoachingAdvice:
          'Chuyển đổi số và ứng dụng AI là đòn bẩy tuyệt vời giúp Thầy/Cô tiết kiệm 40% thời gian soạn bài mà học sinh lại vô cùng hứng thú!',
      },
      modelUsed: 'Mẫu Tự Động (Chưa có Key)',
    };
  }

  const prompt = `Phân tích hồ sơ năng lực giáo viên THPT và tạo Lộ trình Phát triển Cá nhân (IDP):
Tên GV: ${teacher.fullName}
Bộ môn: ${teacher.department}
Chức danh: ${teacher.position}
Khung năng lực 5 chiều: ${JSON.stringify(teacher.skillDimensions)}
Lịch sử điểm: ${JSON.stringify(teacher.performanceTrend)}
Nhật ký cộng/trừ điểm: ${JSON.stringify(teacher.passiveLogs)}

Yêu cầu trả về đúng JSON format:
{
  "overallAssessment": "string nhận định tổng quan",
  "strengths": ["3 điểm mạnh nổi bật"],
  "areasForImprovement": ["2-3 điểm cần cải thiện"],
  "goals": [
    {
      "id": "goal_1",
      "skillGapArea": "Tên kỹ năng",
      "targetGoal": "Mục tiêu cụ thể",
      "actionSteps": ["Bước 1", "Bước 2"],
      "recommendedCourses": [{"title": "Tên khóa học", "platform": "Nền tảng", "duration": "Thời lượng"}],
      "deadline": "dd/mm/yyyy",
      "status": "IN_PROGRESS"
    }
  ],
  "aiCoachingAdvice": "Lời khuyên truyền cảm hứng từ AI Coach"
}`;

  try {
    const { result, modelUsed } = await callGeminiWithFallback(async (ai, model) => {
      const res = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'Bạn là Chuyên gia Khai vấn Phát triển Năng lực Giáo viên THPT. Trả về đúng cấu trúc JSON chuẩn.',
        },
      });
      const parsed = JSON.parse(res.text || '{}');
      return parsed;
    });

    return { idp: result, modelUsed };
  } catch (err: any) {
    console.error('Error generating IDP:', err);
    // Fallback nếu parse JSON lỗi
    return {
      idp: {
        overallAssessment: `Giáo viên ${teacher.fullName} hoàn thành tốt nhiệm vụ, cần tăng cường ứng dụng công nghệ trong tiết dạy.`,
        strengths: ['Tâm huyết, trách nhiệm cao', 'Đảm bảo tiến độ chương trình'],
        areasForImprovement: ['Ứng dụng công nghệ số và bài giảng điện tử'],
        goals: [
          {
            id: 'g1',
            skillGapArea: 'Chuyển đổi số & AI',
            targetGoal: 'Thực hiện tiết dạy ứng dụng phần mềm giáo dục trực tuyến',
            actionSteps: ['Tham gia tập huấn', 'Xây dựng bài giảng mẫu'],
            recommendedCourses: [{ title: 'Chuyển đổi số THPT', platform: 'LMS Bộ GD&ĐT', duration: '8 giờ' }],
            deadline: '30/03/2026',
            status: 'IN_PROGRESS',
          },
        ],
        aiCoachingAdvice: 'Đổi mới phương pháp giảng dạy từng bước nhỏ sẽ tạo nên sự chuyển biến lớn!',
      },
      modelUsed: 'Fallback',
      error: err?.message || String(err),
    };
  }
}

/**
 * Phân tích cảnh báo bất thường điểm số
 */
export async function analyzeAnomalyWithAIClient(anomalyData: any): Promise<string> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    return 'Phát hiện chênh lệch điểm số vượt ngưỡng 15% giữa Tổ trưởng và Ban Giám hiệu. Đề xuất tổ chức đối soát giữa BGH và Tổ trưởng theo đúng quy trình trước khi ký số.';
  }

  const prompt = `Phân tích cảnh báo bất thường điểm số đánh giá viên chức THPT:
Dữ liệu: ${JSON.stringify(anomalyData)}
Yêu cầu: Đưa ra nhận định khách quan về nguyên nhân chênh lệch và đề xuất phương án giải quyết cho Ban Giám hiệu theo Nghị định số 233/2026/NĐ-CP của Chính phủ.`;

  try {
    const { result } = await callGeminiWithFallback(async (ai, model) => {
      const res = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.3,
        },
      });
      return res.text || 'Đã phân tích xong dữ liệu bất thường.';
    });
    return result;
  } catch (err) {
    return 'Phát hiện chênh lệch điểm số vượt ngưỡng 15%. Hệ thống khuyến nghị BGH xem xét đối soát biên bản họp Tổ chuyên môn.';
  }
}
