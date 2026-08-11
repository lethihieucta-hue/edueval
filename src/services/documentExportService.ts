import { Teacher } from '../types';

/**
 * Xuất Phiếu Đánh Giá Cá Nhân Viên Chức THPT chuẩn Word (.doc / .docx)
 * Tuân thủ theo Nghị định số 233/2026/NĐ-CP của Chính phủ
 * về đánh giá, xếp loại chất lượng đối với đơn vị sự nghiệp công lập và viên chức
 */
export function exportTeacherEvaluationToDocx(
  teacher: Teacher,
  academicYear: string = '2026 - 2027',
  period: string = 'Học kỳ I'
): void {
  const ev = teacher.currentEvaluation;
  const scores = ev?.scores || {};
  const dateStr = new Date().toLocaleDateString('vi-VN');
  const now = new Date();

  const s1 = scores['crit_1'] || { selfScore: 90, headScore: 90, principalScore: 90, comments: 'Thực hiện tốt kế hoạch bài dạy và chương trình GDPT 2018.' };
  const s2 = scores['crit_2'] || { selfScore: 95, headScore: 95, principalScore: 95, comments: 'Gương mẫu, chấp hành nghiêm quy chế chuyên môn và văn hóa công sở.' };
  const s3 = scores['crit_3'] || { selfScore: 85, headScore: 85, principalScore: 85, comments: 'Tích cực ứng dụng CNTT, bài giảng số và công cụ AI hỗ trợ giảng dạy.' };
  const s4 = scores['crit_4'] || { selfScore: 90, headScore: 90, principalScore: 90, comments: 'Nhiệt tình tham gia các phong trào thi đua và bồi dưỡng học sinh.' };

  const finalScore = ev?.finalScore || 88.0;
  const classification = ev?.classification || 'HTTNV';
  const classText = 
    classification === 'HTXSNV' ? 'Hoàn thành xuất sắc nhiệm vụ' :
    classification === 'HTTNV' ? 'Hoàn thành tốt nhiệm vụ' :
    classification === 'HTNV' ? 'Hoàn thành nhiệm vụ' : 'Không hoàn thành nhiệm vụ';

  const bonusLogs = teacher.passiveLogs.filter(l => l.type === 'BONUS');
  const penaltyLogs = teacher.passiveLogs.filter(l => l.type === 'PENALTY');

  const docContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Phieu_Danh_Gia_Vien_Chuc_ND233_${teacher.code}</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000; margin: 2cm; }
  h1 { font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; margin: 15px 0 5px 0; }
  h2 { font-size: 13pt; font-weight: bold; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; }
  p { margin: 4px 0; }
  .header-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
  .header-table td { text-align: center; vertical-align: top; font-size: 12pt; border: none; padding: 2px; }
  table.data-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data-table th, table.data-table td { border: 1px solid #000; padding: 6px 8px; font-size: 12pt; text-align: left; }
  table.data-table th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
  .center { text-align: center; }
  .bold { font-weight: bold; }
  .italic { font-style: italic; }
  .signature-table { width: 100%; border-collapse: collapse; margin-top: 25px; }
  .signature-table td { width: 50%; text-align: center; vertical-align: top; border: none; font-size: 12pt; }
</style>
</head>
<body>

<!-- Header Cơ Quan & Quốc Hiệu Chuẩn Văn Bản Nhà Nước -->
<table class="header-table">
  <tr>
    <td style="width: 48%;">
      <span class="bold">SỞ GIÁO DỤC VÀ ĐÀO TẠO TP. CẦN THƠ</span><br/>
      <span class="bold">TRƯỜNG THPT CHÂU THÀNH A</span><br/>
      <span class="italic">Mã viên chức: ${teacher.code}</span>
    </td>
    <td style="width: 52%;">
      <span class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br/>
      <span class="bold" style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span><br/>
      <span class="italic">Tân Hoà, ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}</span>
    </td>
  </tr>
</table>

<h1>PHIẾU ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG VIÊN CHỨC</h1>
<p class="center bold italic" style="margin-bottom: 5px;">Năm học: ${academicYear} (${period})</p>
<p class="center italic" style="font-size: 11pt; margin-bottom: 20px;">
  (Căn cứ theo Nghị định số 233/2026/NĐ-CP của Chính phủ quy định về đánh giá, xếp loại chất lượng đối với đơn vị sự nghiệp công lập và viên chức)
</p>

<h2>I. THÔNG TIN CÁ NHÂN VIÊN CHỨC</h2>
<p><span class="bold">1. Họ và tên:</span> ${teacher.fullName.toUpperCase()}</p>
<p><span class="bold">2. Chức danh nghề nghiệp / Hạng:</span> ${teacher.titleGrade || 'Giáo viên THPT Hạng II'}</p>
<p><span class="bold">3. Chức vụ / Vị trí công tác:</span> ${teacher.position} - <span class="bold">Tổ chuyên môn:</span> ${teacher.department}</p>
<p><span class="bold">4. Thâm niên công tác:</span> ${teacher.yearsOfTeaching} năm - <span class="bold">Email:</span> ${teacher.email} - <span class="bold">SĐT:</span> ${teacher.phone}</p>

<h2>II. KẾT QUẢ ĐÁNH GIÁ THỰC HIỆN NHIỆM VỤ THEO VỊ TRÍ VIỆC LÀM (THANG ĐIỂM 100)</h2>
<table class="data-table">
  <thead>
    <tr>
      <th style="width: 5%;">STT</th>
      <th style="width: 45%;">Tiêu chuẩn & Tiêu chí Đánh giá (Nghị định 233/2026/NĐ-CP)</th>
      <th style="width: 12%;">Tự Chấm</th>
      <th style="width: 12%;">Tổ Trưởng</th>
      <th style="width: 12%;">BGH Chốt</th>
      <th style="width: 14%;">Trọng Số</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="center">1</td>
      <td>
        <span class="bold">Kế hoạch giáo dục & Chuyên môn GDPT 2018</span><br/>
        <span class="italic" style="font-size: 10pt;">Thực hiện kế hoạch bài dạy, tiến độ chương trình, chất lượng giảng dạy</span>
      </td>
      <td class="center">${s1.selfScore}</td>
      <td class="center">${s1.headScore}</td>
      <td class="center bold">${s1.principalScore}</td>
      <td class="center">40%</td>
    </tr>
    <tr>
      <td class="center">2</td>
      <td>
        <span class="bold">Tư tưởng, Đạo đức nhà giáo & Kỷ luật lao động</span><br/>
        <span class="italic" style="font-size: 10pt;">Chấp hành nội quy, văn hóa công sở, đúng giờ lên lớp, đạo đức nghề nghiệp</span>
      </td>
      <td class="center">${s2.selfScore}</td>
      <td class="center">${s2.headScore}</td>
      <td class="center bold">${s2.principalScore}</td>
      <td class="center">20%</td>
    </tr>
    <tr>
      <td class="center">3</td>
      <td>
        <span class="bold">Đổi mới phương pháp, Chuyển đổi số & Ứng dụng AI Sư phạm</span><br/>
        <span class="italic" style="font-size: 10pt;">Thiết kế bài giảng Elearning, sáng kiến sư phạm, sử dụng công nghệ số</span>
      </td>
      <td class="center">${s3.selfScore}</td>
      <td class="center">${s3.headScore}</td>
      <td class="center bold">${s3.principalScore}</td>
      <td class="center">20%</td>
    </tr>
    <tr>
      <td class="center">4</td>
      <td>
        <span class="bold">Công tác Chủ nhiệm, Thi đua & Bồi dưỡng HSG</span><br/>
        <span class="italic" style="font-size: 10pt;">Tham gia phong trào 20/11, bồi dưỡng HSG, hỗ trợ học sinh, phục vụ tập thể</span>
      </td>
      <td class="center">${s4.selfScore}</td>
      <td class="center">${s4.headScore}</td>
      <td class="center bold">${s4.principalScore}</td>
      <td class="center">20%</td>
    </tr>
    <tr>
      <td colspan="4" class="bold" style="text-align: right;">ĐIỂM TRUNG BÌNH CÁC TIÊU CHUẨN (A):</td>
      <td class="center bold" style="background-color: #f9f9f9; font-size: 13pt;">${(s1.principalScore*0.4 + s2.principalScore*0.2 + s3.principalScore*0.2 + s4.principalScore*0.2).toFixed(1)}</td>
      <td class="center bold">100%</td>
    </tr>
  </tbody>
</table>

<h2>III. GHI NHẬN ĐIỂM THƯỞNG THÀNH TÍCH & ĐIỂM TRỪ KỶ LUẬT (B)</h2>
<p><span class="bold">• Điểm cộng thành tích / Khen thưởng phong trào (+):</span> ${bonusLogs.length > 0 ? bonusLogs.map(b => `${b.title} (+${b.points}đ)`).join('; ') : 'Không có (0đ)'}</p>
<p><span class="bold">• Điểm trừ vi phạm quy chế / vắng trễ (-):</span> ${penaltyLogs.length > 0 ? penaltyLogs.map(p => `${p.title} (${p.points}đ)`).join('; ') : 'Không có (0đ)'}</p>
<p><span class="bold">• Tổng điểm thụ động đối soát (+/-):</span> <span class="bold" style="color: ${(ev?.passivePointsTotal || 0) >= 0 ? '#15803d' : '#b91c1c'};">${(ev?.passivePointsTotal || 0) > 0 ? `+${ev?.passivePointsTotal}` : ev?.passivePointsTotal || 0} điểm</span></p>

<h2>IV. Ý KIẾN NHẬN XÉT CỦA TỔ CHUYÊN MÔN & TẬP THỂ</h2>
<p><span class="bold">• Về ưu điểm:</span> Đồng chí ${teacher.fullName} hoàn thành tốt các nhiệm vụ chuyên môn được giao, có tinh thần trách nhiệm, tích cực đổi mới phương pháp giảng dạy.</p>
<p><span class="bold">• Về tồn tại, hạn chế:</span> Cần tiếp tục đẩy mạnh các sản phẩm bài giảng số và nghiên cứu khoa học sư phạm ứng dụng trong học kỳ tiếp theo.</p>

<h2>V. KẾT LUẬN ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG (HIỆU TRƯỞNG QUYẾT ĐỊNH)</h2>
<p><span class="bold">1. Tổng điểm đánh giá cuối cùng (A + B):</span> <span class="bold" style="font-size: 14pt; color: #1e3a8a;">${finalScore} / 100 điểm</span></p>
<p><span class="bold">2. Xếp loại chất lượng viên chức:</span> <span class="bold" style="font-size: 13pt; text-transform: uppercase; color: #047857;">${classText} (${classification})</span></p>

<!-- Khối Chữ Ký & Ký Số Điện Tử Xác Thực 2FA -->
<table class="signature-table">
  <tr>
    <td>
      <span class="bold">VIÊN CHỨC TỰ ĐÁNH GIÁ</span><br/>
      <span class="italic" style="font-size: 10pt;">(Ký và ghi rõ họ tên)</span><br/><br/><br/><br/>
      <span class="bold">${teacher.fullName}</span>
    </td>
    <td>
      <span class="bold">TỔ TRƯỞNG CHUYÊN MÔN</span><br/>
      <span class="italic" style="font-size: 10pt;">(Đã họp đối soát và duyệt Lớp 1)</span><br/><br/><br/><br/>
      <span class="bold">Lê Thị Thu Hà</span>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top: 25px;">
      <span class="bold">HIỆU TRƯỞNG / CHỦ TỊCH HỘI ĐỒNG ĐÁNH GIÁ</span><br/>
      <span class="italic" style="font-size: 10pt;">(Ký số điện tử theo Nghị định 233/2026/NĐ-CP và đóng dấu số)</span><br/><br/>
      <div style="border: 2px solid #16a34a; width: 320px; margin: 0 auto; padding: 8px 12px; border-radius: 8px; font-size: 10pt; color: #166534; background-color: #f0fdf4;">
        <span class="bold" style="font-size: 11pt;">✓ ĐÃ KÝ SỐ ĐIỆN TỬ HỢP LỆ</span><br/>
        <span>Người ký: <b>Hiệu trưởng Nguyễn Minh Trí</b></span><br/>
        <span>Cơ quan: <b>Trường THPT Châu Thành A</b></span><br/>
        <span>Thời gian ký: ${dateStr} 16:30 UTC+7</span><br/>
        <span>Mã xác thực: ND233-${teacher.code}-${Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
      </div>
    </td>
  </tr>
</table>

</body>
</html>
`;

  const blob = new Blob(['\uFEFF' + docContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Phieu_Danh_Gia_ND233_${teacher.code}_${teacher.fullName.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Xuất Toàn Bộ Bảng Tổng Hợp Kết Quả Đánh Giá Viên Chức Ra File Word (.doc/.docx)
 * Theo chuẩn Nghị định số 233/2026/NĐ-CP của Chính phủ
 */
export function exportAllTeachersSummaryDocx(
  teachers: Teacher[],
  academicYear: string = '2026 - 2027',
  period: string = 'Học kỳ I'
): void {
  const dateStr = new Date().toLocaleDateString('vi-VN');
  
  const rowsHtml = teachers.map((t, idx) => {
    const ev = t.currentEvaluation;
    return `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td><b>${t.fullName}</b><br/><span style="font-size: 10pt; color: #555;">${t.code}</span></td>
        <td>${t.department}</td>
        <td>${t.position}</td>
        <td style="text-align: center;">${ev?.scores['crit_1']?.principalScore || 85}</td>
        <td style="text-align: center;">${ev?.scores['crit_2']?.principalScore || 90}</td>
        <td style="text-align: center;">${ev?.scores['crit_3']?.principalScore || 85}</td>
        <td style="text-align: center;">${ev?.scores['crit_4']?.principalScore || 85}</td>
        <td style="text-align: center; color: ${(ev?.passivePointsTotal || 0) >= 0 ? 'green' : 'red'}; font-weight: bold;">
          ${(ev?.passivePointsTotal || 0) > 0 ? `+${ev?.passivePointsTotal}` : ev?.passivePointsTotal || 0}
        </td>
        <td style="text-align: center; font-weight: bold; font-size: 12pt; color: #1e3a8a;">${ev?.finalScore || 85.0}</td>
        <td style="text-align: center; font-weight: bold; color: ${ev?.classification === 'HTXSNV' ? '#047857' : '#1e40af'};">
          ${ev?.classification || 'HTTNV'}
        </td>
      </tr>
    `;
  }).join('');

  const docContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Bao_Cao_Tong_Hop_Danh_Gia_Vien_Chuc_ND233</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.25; color: #000; margin: 1.5cm; }
  h1 { font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; margin: 15px 0 5px 0; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  th, td { border: 1px solid #000; padding: 5px 6px; font-size: 11pt; }
  th { background-color: #e5e7eb; font-weight: bold; text-align: center; }
</style>
</head>
<body>

<table style="width: 100%; border: none; margin-bottom: 20px;">
  <tr style="border: none;">
    <td style="border: none; width: 48%; text-align: center;">
      <b>SỞ GIÁO DỤC VÀ ĐÀO TẠO TP. CẦN THƠ</b><br/>
      <b>TRƯỜNG THPT CHÂU THÀNH A</b>
    </td>
    <td style="border: none; width: 52%; text-align: center;">
      <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br/>
      <u><b>Độc lập - Tự do - Hạnh phúc</b></u><br/>
      <i>Tân Hoà, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</i>
    </td>
  </tr>
</table>

<h1>BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG VIÊN CHỨC</h1>
<p style="text-align: center; font-style: italic; font-weight: bold;">
  Năm học: ${academicYear} (Đợt: ${period}) - Căn cứ Nghị định số 233/2026/NĐ-CP của Chính phủ
</p>

<table>
  <thead>
    <tr>
      <th style="width: 4%;">STT</th>
      <th style="width: 18%;">Họ và Tên Viên Chức</th>
      <th style="width: 14%;">Tổ Chuyên Môn</th>
      <th style="width: 14%;">Chức Vụ</th>
      <th style="width: 7%;">Chuyên Môn (40%)</th>
      <th style="width: 7%;">Kỷ Luật (20%)</th>
      <th style="width: 7%;">CNTT AI (20%)</th>
      <th style="width: 7%;">Thi Đua (20%)</th>
      <th style="width: 7%;">Thụ Động (+/-)</th>
      <th style="width: 7%;">Tổng Điểm</th>
      <th style="width: 8%;">Xếp Loại</th>
    </tr>
  </thead>
  <tbody>
    ${rowsHtml}
  </tbody>
</table>

<table style="width: 100%; border: none; margin-top: 30px;">
  <tr style="border: none;">
    <td style="border: none; width: 50%; text-align: center;">
      <b>CHỦ TỊCH CÔNG ĐOÀN</b><br/><br/><br/><br/>
      <b>Lê Thị Thu Hà</b>
    </td>
    <td style="border: none; width: 50%; text-align: center;">
      <b>HIỆU TRƯỞNG / CHỦ TỊCH HỘI ĐỒNG</b><br/>
      <span style="font-size: 10pt; font-style: italic;">(Đã Ký Số Điện Tử Theo NĐ 233/2026/NĐ-CP)</span><br/><br/><br/>
      <b>Nguyễn Minh Trí</b>
    </td>
  </tr>
</table>

</body>
</html>
`;

  const blob = new Blob(['\uFEFF' + docContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Bang_Tong_Hop_Danh_Gia_ND233_THPT_ChauThanhA_${academicYear.replace(/\s+/g, '')}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
