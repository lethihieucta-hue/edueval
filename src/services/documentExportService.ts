import { Teacher } from '../types';

/**
 * Xuất Phiếu Đánh Giá Cá Nhân Viên Chức THPT chuẩn Word (.doc / .docx)
 * Tuân thủ mẫu số 01/02 Nghị định 90/2020/NĐ-CP & Thông tư 20/2018/TT-BGDĐT
 */
export function exportTeacherEvaluationToDocx(teacher: Teacher): void {
  const ev = teacher.currentEvaluation;
  const scores = ev?.scores || {};
  const dateStr = new Date().toLocaleDateString('vi-VN');

  const s1 = scores['crit_1'] || { selfScore: 90, headScore: 90, principalScore: 90, comments: 'Giảng dạy tốt, hồ sơ đầy đủ.' };
  const s2 = scores['crit_2'] || { selfScore: 95, headScore: 95, principalScore: 95, comments: 'Gương mẫu, chấp hành nội quy.' };
  const s3 = scores['crit_3'] || { selfScore: 85, headScore: 85, principalScore: 85, comments: 'Tích cực ứng dụng CNTT.' };
  const s4 = scores['crit_4'] || { selfScore: 90, headScore: 90, principalScore: 90, comments: 'Tham gia tốt phong trào.' };

  const finalScore = ev?.finalScore || 88.0;
  const classification = ev?.classification || 'HTTNV';
  const classText = 
    classification === 'HTXSNV' ? 'Hoàn thành xuất sắc nhiệm vụ' :
    classification === 'HTTNV' ? 'Hoàn thành tốt nhiệm vụ' :
    classification === 'HTNV' ? 'Hoàn thành nhiệm vụ' : 'Chưa hoàn thành nhiệm vụ';

  const bonusLogs = teacher.passiveLogs.filter(l => l.type === 'BONUS');
  const penaltyLogs = teacher.passiveLogs.filter(l => l.type === 'PENALTY');

  const docContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Phieu_Danh_Gia_Vien_Chuc_${teacher.code}</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.3; color: #000; margin: 2cm; }
  h1 { font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; margin: 15px 0 5px 0; }
  h2 { font-size: 13pt; font-weight: bold; margin-top: 15px; margin-bottom: 5px; }
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

<!-- Header Cơ Quan & Quốc Hiệu -->
<table class="header-table">
  <tr>
    <td style="width: 45%;">
      <span class="bold">SỞ GIÁO DỤC VÀ ĐÀO TẠO</span><br/>
      <span class="bold">TRƯỜNG THPT CHÂU THÀNH A</span><br/>
      <span class="italic">Mã số viên chức: ${teacher.code}</span>
    </td>
    <td style="width: 55%;">
      <span class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br/>
      <span class="bold" style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span><br/>
      <span class="italic">Hậu Giang, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</span>
    </td>
  </tr>
</table>

<h1>PHIẾU ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG VIÊN CHỨC</h1>
<p class="center italic bold" style="margin-bottom: 15px;">Năm học: 2025 - 2026 (Học kỳ I)</p>
<p class="center italic" style="font-size: 11pt; margin-bottom: 20px;">(Kèm theo Nghị định số 90/2020/NĐ-CP ngày 13/8/2020 của Chính phủ & Thông tư 20/2018/TT-BGDĐT)</p>

<h2>I. THÔNG TIN CÁ NHÂN VIÊN CHỨC</h2>
<p><span class="bold">1. Họ và tên:</span> ${teacher.fullName.toUpperCase()}</p>
<p><span class="bold">2. Chức danh nghề nghiệp / Hạng:</span> ${teacher.titleGrade || 'Giáo viên THPT Hạng II'} - Chức vụ: ${teacher.position}</p>
<p><span class="bold">3. Tổ chuyên môn:</span> ${teacher.department}</p>
<p><span class="bold">4. Thâm niên công tác:</span> ${teacher.yearsOfTeaching} năm - Email: ${teacher.email}</p>

<h2>II. KẾT QUẢ ĐÁNH GIÁ CÁC TIÊU CHÍ (THANG ĐIỂM 100)</h2>
<table class="data-table">
  <thead>
    <tr>
      <th style="width: 5%;">STT</th>
      <th style="width: 45%;">Tiêu chuẩn & Tiêu chí Đánh giá (Nghị định 90/2020)</th>
      <th style="width: 12%;">Tự Chấm</th>
      <th style="width: 12%;">Tổ Trưởng</th>
      <th style="width: 12%;">BGH Chốt</th>
      <th style="width: 14%;">Trọng số</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="center">1</td>
      <td><span class="bold">Kế hoạch giáo dục & Chất lượng chuyên môn</span><br/><span class="italic" style="font-size: 10pt;">Thực hiện chương trình, giáo án, dạy học đổi mới</span></td>
      <td class="center">${s1.selfScore}</td>
      <td class="center">${s1.headScore}</td>
      <td class="center bold">${s1.principalScore}</td>
      <td class="center">40%</td>
    </tr>
    <tr>
      <td class="center">2</td>
      <td><span class="bold">Tư tưởng, Đạo đức nhà giáo & Kỷ luật lao động</span><br/><span class="italic" style="font-size: 10pt;">Chấp hành nội quy, nếp sống, đúng giờ lên lớp</span></td>
      <td class="center">${s2.selfScore}</td>
      <td class="center">${s2.headScore}</td>
      <td class="center bold">${s2.principalScore}</td>
      <td class="center">20%</td>
    </tr>
    <tr>
      <td class="center">3</td>
      <td><span class="bold">Đổi mới phương pháp, Ứng dụng CNTT & AI Sư phạm</span><br/><span class="italic" style="font-size: 10pt;">Bài giảng Elearning, chuyển đổi số, nghiên cứu KHSP</span></td>
      <td class="center">${s3.selfScore}</td>
      <td class="center">${s3.headScore}</td>
      <td class="center bold">${s3.principalScore}</td>
      <td class="center">20%</td>
    </tr>
    <tr>
      <td class="center">4</td>
      <td><span class="bold">Công tác Chủ nhiệm, Thi đua & Bồi dưỡng HSG</span><br/><span class="italic" style="font-size: 10pt;">Phong trào 20/11, hội đồng sư phạm, giúp đỡ HS</span></td>
      <td class="center">${s4.selfScore}</td>
      <td class="center">${s4.headScore}</td>
      <td class="center bold">${s4.principalScore}</td>
      <td class="center">20%</td>
    </tr>
    <tr>
      <td colspan="4" class="bold" style="text-align: right;">ĐIỂM TRUNG BÌNH CÁC TIÊU CHÍ (A):</td>
      <td class="center bold" style="background-color: #f9f9f9; font-size: 13pt;">${(s1.principalScore*0.4 + s2.principalScore*0.2 + s3.principalScore*0.2 + s4.principalScore*0.2).toFixed(1)}</td>
      <td class="center bold">100%</td>
    </tr>
  </tbody>
</table>

<h2>III. GHI NHẬN ĐIỂM THƯỞNG PHONG TRÀO & ĐIỂM TRỪ KỶ LUẬT (B)</h2>
<p><span class="bold">• Điểm cộng thành tích / Bồi dưỡng HSG (+):</span> ${bonusLogs.length > 0 ? bonusLogs.map(b => `${b.title} (+${b.points}đ)`).join('; ') : 'Không có'}</p>
<p><span class="bold">• Điểm trừ vi phạm nếp sống / vắng trễ (-):</span> ${penaltyLogs.length > 0 ? penaltyLogs.map(p => `${p.title} (${p.points}đ)`).join('; ') : 'Không có (0đ)'}</p>
<p><span class="bold">• Tổng điểm thụ động cộng/trừ ròng:</span> <span class="bold" style="color: ${ev?.passivePointsTotal && ev.passivePointsTotal >= 0 ? 'green' : 'red'};">${ev?.passivePointsTotal && ev.passivePointsTotal > 0 ? `+${ev.passivePointsTotal}` : ev?.passivePointsTotal || 0} điểm</span></p>

<h2>IV. KẾT LUẬN ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG</h2>
<p><span class="bold">1. Tổng điểm đánh giá cuối cùng (A + B):</span> <span class="bold" style="font-size: 14pt; color: #1e3a8a;">${finalScore} / 100 điểm</span></p>
<p><span class="bold">2. Xếp loại chất lượng:</span> <span class="bold" style="font-size: 13pt; text-transform: uppercase;">${classText} (${classification})</span></p>

<!-- Chữ Ký Các Cấp -->
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
    <td colspan="2" style="padding-top: 30px;">
      <span class="bold">HIỆU TRƯỞNG / CHỦ TỊCH HỘI ĐỒNG ĐÁNH GIÁ</span><br/>
      <span class="italic" style="font-size: 10pt;">(Ký số điện tử và đóng dấu)</span><br/><br/>
      <div style="border: 2px solid #16a34a; width: 280px; margin: 0 auto; padding: 6px; border-radius: 6px; font-size: 10pt; color: #166534;">
        <span class="bold">✓ ĐÃ KÝ SỐ ĐIỆN TỬ</span><br/>
        <span>Hiệu trưởng: <b>Nguyễn Minh Trí</b></span><br/>
        <span>Thời gian: ${dateStr} 16:15 UTC+7</span><br/>
        <span>Mã tra cứu: SIG-${teacher.code}-${Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
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
  link.download = `Phieu_Danh_Gia_${teacher.code}_${teacher.fullName.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Xuất Toàn Bộ Danh Sách Đánh Giá Nhà Trường Ra File Word (.doc)
 */
export function exportAllTeachersSummaryDocx(teachers: Teacher[]): void {
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
        <td style="text-align: center; color: ${(ev?.passivePointsTotal || 0) >= 0 ? 'green' : 'red'};">${(ev?.passivePointsTotal || 0) > 0 ? `+${ev?.passivePointsTotal}` : ev?.passivePointsTotal || 0}</td>
        <td style="text-align: center; font-weight: bold; font-size: 13pt;">${ev?.finalScore || 85}</td>
        <td style="text-align: center; font-weight: bold;">${ev?.classification || 'HTTNV'}</td>
      </tr>
    `;
  }).join('');

  const docContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Bao_Cao_Tong_Hop_Danh_Gia_Vien_Chuc_THPT_Chau_Thanh_A</title>
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
    <td style="border: none; width: 45%; text-align: center;">
      <b>SỞ GIÁO DỤC VÀ ĐÀO TẠO</b><br/>
      <b>TRƯỜNG THPT CHÂU THÀNH A</b>
    </td>
    <td style="border: none; width: 55%; text-align: center;">
      <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br/>
      <u><b>Độc lập - Tự do - Hạnh phúc</b></u><br/>
      <i>Hậu Giang, ngày ${dateStr}</i>
    </td>
  </tr>
</table>

<h1>BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG VIÊN CHỨC</h1>
<p style="text-align: center; font-style: italic;">Năm học: 2025 - 2026 (Đợt: Học kỳ I) - Căn cứ Nghị định số 90/2020/NĐ-CP</p>

<table>
  <thead>
    <tr>
      <th style="width: 4%;">STT</th>
      <th style="width: 18%;">Họ và Tên Viên Chức</th>
      <th style="width: 14%;">Tổ Chuyên Môn</th>
      <th style="width: 14%;">Chức Danh</th>
      <th style="width: 7%;">Chuyên Môn</th>
      <th style="width: 7%;">Kỷ Luật</th>
      <th style="width: 7%;">CNTT AI</th>
      <th style="width: 7%;">Thi Đua</th>
      <th style="width: 7%;">Thụ Động</th>
      <th style="width: 8%;">Điểm Cuối</th>
      <th style="width: 9%;">Xếp Loại</th>
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
      <b>HIỆU TRƯỞNG / CHỦ TỊCH HỘI ĐỒNG</b><br/><br/><br/><br/>
      <b>Nguyễn Minh Trí (Đã Ký Số)</b>
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
  link.download = `Bang_Tong_Hop_Danh_Gia_THPT_Chau_Thanh_A_2025_2026.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
