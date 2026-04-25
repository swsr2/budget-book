import * as XLSX from 'xlsx';
import { Transaction } from '@/components/budget/Constants';

export async function parseExcel(file: File): Promise<Omit<Transaction, 'id'>[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // 엑셀 데이터를 JSON 배열로 변환 (raw:false 옵션으로 서식 문자열화)
  const jsonData = XLSX.utils.sheet_to_json<any>(sheet, { raw: false });
  const transactions: Omit<Transaction, 'id'>[] = [];
  
  for (const row of jsonData) {
    const rawDate = row['일자'] || row['날짜'] || row['Date'] || row['date'];
    const rawType = row['분류'] || row['구분'] || row['type'] || '지출';
    const rawCat = row['카테고리'] || row['항목'] || row['category'] || '기타';
    const rawAmount = row['금액'] || row['amount'] || row['지출금액'] || row['이용금액'];
    const rawMemo = row['내용'] || row['사용처'] || row['memo'] || row['가맹점명'];
    const rawPayment = row['결제수단'] || row['결제'] || row['payment'] || '신용카드';
    const rawWho = row['주체'] || row['사용자'] || row['who'] || '남편';
    
    if (!rawDate || !rawAmount) continue;

    let parsedDate = String(rawDate).trim().replace(/\//g, '-').replace(/\./g, '-');
    if (parsedDate.length > 10) parsedDate = parsedDate.substring(0, 10);
    
    const typeVar = String(rawType).includes('수입') ? 'income' : 'expense';
    const amountNum = typeof rawAmount === 'number' ? rawAmount : parseInt(String(rawAmount).replace(/[^0-9]/g, '')) || 0;
    const whoVar = String(rawWho).includes('아내') || String(rawWho).includes('wife') ? 'wife' : 'husband';
    
    transactions.push({
      date: parsedDate,
      type: typeVar,
      category: String(rawCat),
      amount: amountNum,
      memo: String(rawMemo),
      payment: String(rawPayment),
      who: whoVar
    });
  }
  
  return transactions;
}
