import * as XLSX from 'xlsx';
import { Transaction } from '@/components/budget/Constants';

export async function parseExcel(file: File): Promise<Omit<Transaction, 'id'>[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true }); // 날짜 형식을 인식하도록 설정
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // raw:false로 하면 포맷팅된 문자열을 가져오지만, 날짜의 경우 정확한 처리를 위해 유연하게 대응
  const jsonData = XLSX.utils.sheet_to_json<any>(sheet, { raw: true });
  const transactions: Omit<Transaction, 'id'>[] = [];
  
  for (const row of jsonData) {
    // 1. 날짜 추출 (다양한 헤더 대응)
    const rawDate = row['일자'] || row['날짜'] || row['이용일자'] || row['거래일자'] || row['거래일'] || row['승인일자'] || row['Date'] || row['date'];
    
    // 2. 금액 추출
    const rawAmount = row['금액'] || row['지출'] || row['수입'] || row['지출금액'] || row['이용금액'] || row['거래금액'] || row['amount'];
    
    if (!rawDate || rawAmount === undefined) continue;

    // 3. 날짜 파싱 로직 강화
    let parsedDate = "";
    if (rawDate instanceof Date) {
      // 엑셀 Date 객체 타임존/밀림 이슈 방지를 위해 12시간을 더한 후 UTC 기준으로 파싱
      const adjustedDate = new Date(rawDate.getTime() + 12 * 60 * 60 * 1000);
      const y = adjustedDate.getUTCFullYear();
      const m = String(adjustedDate.getUTCMonth() + 1).padStart(2, '0');
      const d = String(adjustedDate.getUTCDate()).padStart(2, '0');
      parsedDate = `${y}-${m}-${d}`;
    } else if (typeof rawDate === 'number' && rawDate > 30000) {
      // 엑셀 시리얼 날짜인 경우 (1900년 이후 숫자로 표현됨)
      const dateObj = XLSX.SSF.parse_date_code(rawDate);
      parsedDate = `${dateObj.y}-${String(dateObj.m).padStart(2, '0')}-${String(dateObj.d).padStart(2, '0')}`;
    } else {
      // 문자열인 경우 매우 유연하게 파싱
      const str = String(rawDate).trim();
      
      if (/^\d{8}$/.test(str)) {
        // '20260520' 같은 8자리 연속 숫자
        parsedDate = `${str.substring(0,4)}-${str.substring(4,6)}-${str.substring(6,8)}`;
      } else {
        // 숫자만 모두 추출 (예: '2026년 5월 20일' -> [2026, 5, 20])
        const parts = str.match(/\d+/g);
        if (parts) {
          const currentYear = new Date().getFullYear();
          let y = currentYear, m = 1, d = 1;

          if (parts.length >= 3) {
            y = parseInt(parts[0]);
            if (y < 100) y += 2000; // '24' -> 2024
            m = parseInt(parts[1]);
            d = parseInt(parts[2]);
          } else if (parts.length === 2) {
            // 연도가 생략된 경우 (예: '5/20', '05월 20일')
            m = parseInt(parts[0]);
            d = parseInt(parts[1]);
          } else if (parts.length === 1 && parts[0].length === 4) {
             // '0520' 같은 4자리 연속 숫자
             m = parseInt(parts[0].substring(0,2));
             d = parseInt(parts[0].substring(2,4));
          } else {
             // 그 외의 경우 (예를 들어 '20일' 등)
             d = parseInt(parts[0]);
             m = new Date().getMonth() + 1;
          }

          parsedDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        } else {
          parsedDate = str;
        }
      }
    }
    
    if (parsedDate.length > 10) parsedDate = parsedDate.substring(0, 10);
    
    // 4. 나머지 데이터 추출
    const rawType = row['분류'] || row['구분'] || row['종류'] || row['type'] || '지출';
    const rawCat = row['카테고리'] || row['항목'] || row['category'] || '기타';
    const rawMemo = row['내용'] || row['사용처'] || row['상호'] || row['가맹점명'] || row['memo'];
    const rawPayment = row['결제수단'] || row['결제'] || row['수단'] || row['payment'] || '신용카드';
    const rawWho = row['주체'] || row['사용자'] || row['누구'] || row['who'] || '공용';
    
    const typeVar = (String(rawType).includes('수입') || String(rawType).includes('입금')) ? 'income' : 
                    (String(rawType).includes('이체') || String(rawType).includes('송금')) ? 'transfer' : 'expense';
    
    const amountNum = typeof rawAmount === 'number' ? rawAmount : parseInt(String(rawAmount).replace(/[^0-9]/g, '')) || 0;
    
    const whoVar = (String(rawWho).includes('아내') || String(rawWho).includes('wife')) ? 'wife' : 
                   (String(rawWho).includes('공용') || String(rawWho).includes('shared') || String(rawWho).includes('공동')) ? 'shared' : 'husband';
    
    // 결제수단 정규화 (은행/계좌/이체 등 포함 시 '계좌이체'로 맵핑)
    const payStr = String(rawPayment).trim();
    let paymentVar = payStr;
    if (payStr.includes('은행') || payStr.includes('계좌') || payStr.includes('이체') || payStr.includes('통장') || payStr.includes('송금')) {
      paymentVar = '계좌이체';
    } else if (payStr.includes('체크')) {
      paymentVar = '체크카드';
    } else if (payStr.includes('카드')) {
      paymentVar = '신용카드';
    } else if (payStr.includes('현금')) {
      paymentVar = '현금';
    }

    transactions.push({
      date: parsedDate,
      type: typeVar,
      category: String(rawCat),
      amount: Math.abs(amountNum),
      memo: String(rawMemo),
      payment: paymentVar,
      who: whoVar
    });
  }
  
  return transactions;
}
