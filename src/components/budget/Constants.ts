export const C = {
  bg: '#F2F4F6',
  card: '#FFFFFF',
  blue: '#3182F6',
  red: '#F04452',
  green: '#00B493',
  text: '#191F28',
  sub: '#8B95A1',
  border: '#E5E8EB',
};

export type Category = {
  id: string;
  icon: string;
  bg: string;
  fg: string;
};

export const CATS_EXPENSE: Category[] = [
  { id: '주거', icon: 'home2', bg: '#F0F0F0', fg: '#666E7B' },
  { id: '통신', icon: 'phone', bg: '#EBF5FF', fg: '#3182F6' },
  { id: '보험', icon: 'medical', bg: '#EBFAF5', fg: '#00B493' }, // Using medical icon for insurance as fallback, or maybe shield if added later
  { id: '외식', icon: 'food', bg: '#FFF0EB', fg: '#F04452' },
  { id: '마트/편의점', icon: 'grocery', bg: '#FFF0EB', fg: '#F06A00' },
  { id: '생활편의', icon: 'daily', bg: '#EBFAF5', fg: '#00B493' },
  { id: '문화/여가', icon: 'culture', bg: '#FFEDF0', fg: '#F04452' },
  { id: '여행', icon: 'travel', bg: '#EBF9FF', fg: '#0099CC' },
  { id: '교육', icon: 'edu', bg: '#EBF9FF', fg: '#0099CC' },
  { id: '육아', icon: 'family', bg: '#FFF7EB', fg: '#F0AC00' },
  { id: '교통', icon: 'bus', bg: '#EBF2FF', fg: '#3182F6' },
  { id: '의료/건강', icon: 'checkup', bg: '#EBFAF5', fg: '#00B493' },
  { id: '쇼핑/미용', icon: 'shop', bg: '#F9EBF9', fg: '#A259CC' },
  { id: '경조사', icon: 'gift', bg: '#FFF7EB', fg: '#F0AC00' },
  { id: '용돈', icon: 'wallet', bg: '#FFF0EB', fg: '#F06A00' },
  { id: '세금/공과금', icon: 'tax', bg: '#F2F4F6', fg: '#8B95A1' },
  { id: '기타', icon: 'other', bg: '#F2F4F6', fg: '#8B95A1' },
];

export const CATS_INCOME: Category[] = [
  { id: '급여', icon: 'money', bg: '#EBFAF5', fg: '#00B493' },
  { id: '부수입', icon: 'gift', bg: '#EBF2FF', fg: '#3182F6' },
  { id: '투자소득', icon: 'stock', bg: '#FFF7EB', fg: '#F0AC00' },
  { id: '보너스', icon: 'bonus', bg: '#FFEDF5', fg: '#F04452' },
  { id: '기타소득', icon: 'other', bg: '#F2F4F6', fg: '#8B95A1' },
];

export const CATS_TRANSFER: Category[] = [
  { id: '저축', icon: 'saving', bg: '#EBF2FF', fg: '#3182F6' },
  { id: '투자', icon: 'stock', bg: '#FFF7EB', fg: '#F0AC00' },
  { id: '부동산', icon: 'home2', bg: '#F0F0F0', fg: '#666E7B' },
  { id: '기타', icon: 'other', bg: '#F2F4F6', fg: '#8B95A1' },
];

export const PAYMENTS = ['신용카드', '체크카드', '현금', '계좌이체'];

export const FIXED_EXPENSES_DEFAULT = [
  { id: 1, category: '통신', icon: 'phone', bg: '#EBF5FF', fg: '#3182F6', label: '휴대폰 요금', amount: 75000, active: true },
  { id: 2, category: '문화/여가', icon: 'sub', bg: '#FFEDF0', fg: '#F04452', label: '넷플릭스', amount: 17000, active: true },
  { id: 3, category: '주거', icon: 'home2', bg: '#F0F0F0', fg: '#666E7B', label: '관리비', amount: 120000, active: true },
  { id: 4, category: '교육', icon: 'edu', bg: '#EBF9FF', fg: '#0099CC', label: '영어회화', amount: 80000, active: false },
  { id: 5, category: '문화/여가', icon: 'sub', bg: '#FFEDF0', fg: '#F04452', label: '유튜브 프리미엄', amount: 14900, active: true },
];

export const INITIAL_TXS = [
  { id: 1, date: '2026-04-01', type: 'income', category: '급여', amount: 3000000, who: 'husband', payment: '계좌이체', memo: '4월 급여' },
  { id: 2, date: '2026-04-01', type: 'income', category: '급여', amount: 2500000, who: 'wife', payment: '계좌이체', memo: '4월 급여' },
  { id: 3, date: '2026-04-02', type: 'expense', category: '마트/편의점', amount: 45000, who: 'husband', payment: '신용카드', memo: '이마트' },
  { id: 4, date: '2026-04-03', type: 'expense', category: '교통', amount: 2300, who: 'wife', payment: '체크카드', memo: '지하철' },
  { id: 5, date: '2026-04-05', type: 'expense', category: '쇼핑/미용', amount: 89000, who: 'wife', payment: '신용카드', memo: '봄 옷' },
  { id: 6, date: '2026-04-07', type: 'expense', category: '외식', amount: 32000, who: 'husband', payment: '현금', memo: '저녁식사' },
  { id: 7, date: '2026-04-10', type: 'expense', category: '통신', amount: 75000, who: 'husband', payment: '신용카드', memo: '휴대폰 요금' },
  { id: 8, date: '2026-04-12', type: 'expense', category: '문화/여가', amount: 28000, who: 'wife', payment: '신용카드', memo: '영화' },
  { id: 9, date: '2026-04-14', type: 'expense', category: '외식', amount: 67000, who: 'husband', payment: '신용카드', memo: '패밀리 레스토랑' },
  { id: 10, date: '2026-04-15', type: 'expense', category: '의료/건강', amount: 15000, who: 'wife', payment: '현금', memo: '약국' },
  { id: 11, date: '2026-04-18', type: 'expense', category: '문화/여가', amount: 17000, who: 'husband', payment: '신용카드', memo: '넷플릭스' },
  { id: 12, date: '2026-04-20', type: 'expense', category: '마트/편의점', amount: 52000, who: 'wife', payment: '신용카드', memo: '주말 장보기' },
  { id: 13, date: '2026-04-22', type: 'expense', category: '쇼핑/미용', amount: 35000, who: 'wife', payment: '현금', memo: '미용실' },
  { id: 14, date: '2026-04-23', type: 'income', category: '부수입', amount: 150000, who: 'husband', payment: '계좌이체', memo: '당근마켓' },
  { id: 15, date: '2026-04-24', type: 'expense', category: '외식', amount: 45000, who: 'husband', payment: '신용카드', memo: '동창 모임' },
  { id: 16, date: '2026-04-25', type: 'expense', category: '교통', amount: 35000, who: 'wife', payment: '신용카드', memo: '주유' },
  { id: 17, date: '2026-04-26', type: 'transfer', category: '저축', amount: 500000, who: 'shared', payment: '계좌이체', memo: '적금 자동이체' },
  { id: 18, date: '2026-04-27', type: 'transfer', category: '투자', amount: 300000, who: 'husband', payment: '계좌이체', memo: '주식 매수' },
];

export function fmt(n: number) { return n.toLocaleString('ko-KR'); }
export function fmtShort(n: number) {
  if (n >= 10000) {
    const man = Math.floor(n / 10000);
    const chun = Math.floor((n % 10000) / 1000);
    return chun > 0 ? `${man}.${chun}만` : `${man}만`;
  }
  return n.toLocaleString('ko-KR');
}

export function getCat(type: string, id: string) {
  const list = type === 'income' ? CATS_INCOME : type === 'transfer' ? CATS_TRANSFER : CATS_EXPENSE;
  return list.find(c => c.id === id) || { icon: 'other', bg: '#F2F4F6', fg: '#8B95A1', id: '기타' };
}

export type Transaction = {
  id: string;
  date: string;
  type: string; // 'income' | 'expense' | 'transfer'
  category: string;
  amount: number;
  who: string;
  payment: string;
  memo: string;
};
