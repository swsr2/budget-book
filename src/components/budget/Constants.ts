export const C = {
  bg:     '#F2F4F6',
  card:   '#FFFFFF',
  blue:   '#3182F6',
  red:    '#F04452',
  green:  '#00B493',
  text:   '#191F28',
  sub:    '#8B95A1',
  border: '#E5E8EB',
};

export const CATS_EXPENSE = [
  { id:'식비',    icon:'food',    bg:'#FFF0EB', fg:'#F04452' },
  { id:'교통비',  icon:'bus',     bg:'#EBF2FF', fg:'#3182F6' },
  { id:'쇼핑',   icon:'shop',    bg:'#F9EBF9', fg:'#A259CC' },
  { id:'의료비',  icon:'medical', bg:'#EBFAF5', fg:'#00B493' },
  { id:'문화생활',icon:'culture', bg:'#FFEDF0', fg:'#F04452' },
  { id:'통신비',  icon:'phone',   bg:'#EBF5FF', fg:'#3182F6' },
  { id:'구독',   icon:'sub',     bg:'#FFF7EB', fg:'#F0AC00' },
  { id:'술/음료', icon:'drink',   bg:'#FFF0EB', fg:'#F06A00' },
  { id:'미용',   icon:'beauty',  bg:'#FCEEFF', fg:'#C759D6' },
  { id:'교육',   icon:'edu',     bg:'#EBF9FF', fg:'#0099CC' },
  { id:'주거',   icon:'home2',   bg:'#F0F0F0', fg:'#666E7B' },
  { id:'기타',   icon:'other',   bg:'#F2F4F6', fg:'#8B95A1' },
];

export const CATS_INCOME = [
  { id:'급여',   icon:'money',   bg:'#EBFAF5', fg:'#00B493' },
  { id:'부수입',  icon:'gift',    bg:'#EBF2FF', fg:'#3182F6' },
  { id:'용돈',   icon:'wallet',  bg:'#FFF7EB', fg:'#F0AC00' },
  { id:'보너스',  icon:'bonus',   bg:'#FFEDF5', fg:'#F04452' },
];

export const PAYMENTS = ['신용카드','체크카드','현금','계좌이체'];

export const FIXED_EXPENSES_DEFAULT = [
  { id:1, category:'통신비', icon:'phone', bg:'#EBF5FF', fg:'#3182F6', label:'휴대폰 요금', amount:75000,  active:true  },
  { id:2, category:'구독',   icon:'sub',   bg:'#FFF7EB', fg:'#F0AC00', label:'넷플릭스',   amount:17000,  active:true  },
  { id:3, category:'주거',   icon:'house', bg:'#F0F0F0', fg:'#666E7B', label:'관리비',     amount:120000, active:true  },
  { id:4, category:'교육',   icon:'edu',   bg:'#EBF9FF', fg:'#0099CC', label:'영어회화',   amount:80000,  active:false },
  { id:5, category:'구독',   icon:'sub',   bg:'#FFF7EB', fg:'#F0AC00', label:'유튜브 프리미엄', amount:14900, active:true },
];

export const INITIAL_TXS = [
  { id:1,  date:'2026-04-01', type:'income',  category:'급여',   amount:3000000, who:'husband', payment:'계좌이체', memo:'4월 급여' },
  { id:2,  date:'2026-04-01', type:'income',  category:'급여',   amount:2500000, who:'wife',    payment:'계좌이체', memo:'4월 급여' },
  { id:3,  date:'2026-04-02', type:'expense', category:'식비',   amount:45000,   who:'husband', payment:'신용카드', memo:'마트 장보기' },
  { id:4,  date:'2026-04-03', type:'expense', category:'교통비', amount:2300,    who:'wife',    payment:'체크카드', memo:'지하철' },
  { id:5,  date:'2026-04-05', type:'expense', category:'쇼핑',   amount:89000,   who:'wife',    payment:'신용카드', memo:'봄 옷' },
  { id:6,  date:'2026-04-07', type:'expense', category:'식비',   amount:32000,   who:'husband', payment:'현금',    memo:'저녁식사' },
  { id:7,  date:'2026-04-10', type:'expense', category:'통신비', amount:75000,   who:'husband', payment:'신용카드', memo:'휴대폰 요금' },
  { id:8,  date:'2026-04-12', type:'expense', category:'문화생활',amount:28000,  who:'wife',    payment:'신용카드', memo:'영화' },
  { id:9,  date:'2026-04-14', type:'expense', category:'식비',   amount:67000,   who:'husband', payment:'신용카드', memo:'외식' },
  { id:10, date:'2026-04-15', type:'expense', category:'의료비', amount:15000,   who:'wife',    payment:'현금',    memo:'약국' },
  { id:11, date:'2026-04-18', type:'expense', category:'구독',   amount:17000,   who:'husband', payment:'신용카드', memo:'넷플릭스' },
  { id:12, date:'2026-04-20', type:'expense', category:'식비',   amount:52000,   who:'wife',    payment:'신용카드', memo:'주말 장보기' },
  { id:13, date:'2026-04-22', type:'expense', category:'미용',   amount:35000,   who:'wife',    payment:'현금',    memo:'미용실' },
  { id:14, date:'2026-04-23', type:'income',  category:'부수입', amount:150000,  who:'husband', payment:'계좌이체', memo:'중고거래' },
  { id:15, date:'2026-04-24', type:'expense', category:'술/음료',amount:45000,   who:'husband', payment:'신용카드', memo:'동창 모임' },
  { id:16, date:'2026-04-25', type:'expense', category:'교통비', amount:35000,   who:'wife',    payment:'신용카드', memo:'주유' },
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
  return (type==='income' ? CATS_INCOME : CATS_EXPENSE).find(c=>c.id===id) || { icon:'other', bg:'#F2F4F6', fg:'#8B95A1', id: '기타' };
}
export type Transaction = Omit<typeof INITIAL_TXS[0], 'id'> & { id: string };
