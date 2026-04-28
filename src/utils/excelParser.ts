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
      // JS Date 객체인 경우
      parsedDate = rawDate.toISOString().split('T')[0];
    } else if (typeof rawDate === 'number' && rawDate > 30000) {
      // 엑셀 시리얼 날짜인 경우 (1900년 이후 숫자로 표현됨)
      const dateObj = XLSX.SSF.parse_date_code(rawDate);
      parsedDate = `${dateObj.y}-${String(dateObj.m).padStart(2, '0')}-${String(dateObj.d).padStart(2, '0')}`;
    } else {
      // 문자열인 경우
      parsedDate = String(rawDate).trim().replace(/\//g, '-').replace(/\./g, '-');
      
      // '24-02-15' -> '2024-02-15' 보정
      if (/^\d{2}-\d{2}-\d{2}$/.test(parsedDate)) {
        parsedDate = '20' + parsedDate;
      }
      // '02-15' -> '2026-02-15' 보정 (연도가 없는 경우 현재 연도 추가)
      if (/^\d{1,2}-\d{1,2}$/.test(parsedDate)) {
        parsedDate = `${new Date().getFullYear()}-${parsedDate}`;
      }
    }
    
    if (parsedDate.length > 10) parsedDate = parsedDate.substring(0, 10);
    
    // 4. 나머지 데이터 추출
    const rawType = row['분류'] || row['구분'] || row['종류'] || row['type'] || '지출';
    const rawCat = row['카테고리'] || row['항목'] || row['category'] || '기타';
    const rawMemo = row['내용'] || row['사용처'] || row['상호'] || row['가맹점명'] || row['memo'];
    const rawPayment = row['결제수단'] || row['결제'] || row['수단'] || row['payment'] || '신용카드';
    const rawWho = row['주체'] || row['사용자'] || row['누구'] || row['who'] || '남편';
    
    const typeVar = (String(rawType).includes('수입') || String(rawType).includes('입금')) ? 'income' : 
                    (String(rawType).includes('이체') || String(rawType).includes('송금')) ? 'transfer' : 'expense';
    
    const amountNum = typeof rawAmount === 'number' ? rawAmount : parseInt(String(rawAmount).replace(/[^0-9]/g, '')) || 0;
    
    const whoVar = (String(rawWho).includes('아내') || String(rawWho).includes('wife')) ? 'wife' : 
                   (String(rawWho).includes('공용') || String(rawWho).includes('shared') || String(rawWho).includes('공동')) ? 'shared' : 'husband';
    
    transactions.push({
      date: parsedDate,
      type: typeVar,
      category: String(rawCat),
      amount: Math.abs(amountNum),
      memo: String(rawMemo),
      payment: String(rawPayment),
      who: whoVar
    });
  }
  
  return transactions;
}
