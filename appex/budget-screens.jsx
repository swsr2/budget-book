
// ── Design Tokens ─────────────────────────────────────────────────
const C = {
  bg:     '#F2F4F6',
  card:   '#FFFFFF',
  blue:   '#3182F6',
  red:    '#F04452',
  green:  '#00B493',
  text:   '#191F28',
  sub:    '#8B95A1',
  border: '#E5E8EB',
};

// ── SVG Icons ─────────────────────────────────────────────────────
function Icon({ name, size=18, color='currentColor' }) {
  const paths = {
    food:    'M8 2v4c0 2.2-1.8 4-4 4v10h2V12.8c1.7-.5 3-2 3-3.8V2H8zm4 0v16h2v-7h3V2h-2v5h-1V2h-2zm-6 0H4v6h2V2z',
    bus:     'M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 4c3.31 0 5.95.29 6.71 1H5.29C6.05 4.29 8.69 4 12 4zM6 7h12v5H6V7z',
    shop:    'M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z',
    medical: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z',
    culture: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z',
    phone:   'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z',
    sub:     'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z',
    drink:   'M6 3l-.37 2h12.74l-.37-2H6zm-.75 4L4 17h16L18.75 7H5.25zm6.75 8.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 12.5 12 12.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z',
    beauty:  'M12 2a5 5 0 100 10A5 5 0 0012 2zm0 8a3 3 0 110-6 3 3 0 010 6zm-7 14v-2a7 7 0 0114 0v2h-2v-2a5 5 0 00-10 0v2H5z',
    edu:     'M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-7 8.5v4l7 3.86L19 15.5v-4l-7 3.82-7-3.82z',
    home2:   'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    other:   'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
    money:   'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
    gift:    'M20 6h-2.18c.07-.26.18-.51.18-.8C18 3.43 16.57 2 14.8 2c-1.05 0-1.96.54-2.5 1.35l-.3.45-.3-.45C11.16 2.54 10.25 2 9.2 2 7.43 2 6 3.43 6 5.2c0 .29.11.54.18.8H4c-1.11 0-2 .89-2 2v3c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V8c0-1.11-.89-2-2-2zm-5-2c.66 0 1.2.54 1.2 1.2 0 .66-.54 1.2-1.2 1.2H13V5.2C13 4.54 13.54 4 14.2 4zM9.2 4c.66 0 1.2.54 1.2 1.2V6.4H9.2C8.54 6.4 8 5.86 8 5.2 8 4.54 8.54 4 9.2 4zM4 11v9c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-9H4zm6 8H6v-7h4v7zm8 0h-6v-7h6v7z',
    wallet:  'M21 7H3a1 1 0 00-1 1v12a1 1 0 001 1h18a1 1 0 001-1V8a1 1 0 00-1-1zm-1 12H4V9h16v10zm-8-7a2 2 0 100 4 2 2 0 000-4zM3 5h17v2H3z',
    bonus:   'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z',
    house:   'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    bell:    'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
    setting: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink:0 }}>
      <path d={paths[name] || paths.other} />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────
const CATS_EXPENSE = [
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
const CATS_INCOME = [
  { id:'급여',   icon:'money',   bg:'#EBFAF5', fg:'#00B493' },
  { id:'부수입',  icon:'gift',    bg:'#EBF2FF', fg:'#3182F6' },
  { id:'용돈',   icon:'wallet',  bg:'#FFF7EB', fg:'#F0AC00' },
  { id:'보너스',  icon:'bonus',   bg:'#FFEDF5', fg:'#F04452' },
];
const PAYMENTS = ['신용카드','체크카드','현금','계좌이체'];

const FIXED_EXPENSES_DEFAULT = [
  { id:1, category:'통신비', icon:'phone', bg:'#EBF5FF', fg:'#3182F6', label:'휴대폰 요금', amount:75000,  active:true  },
  { id:2, category:'구독',   icon:'sub',   bg:'#FFF7EB', fg:'#F0AC00', label:'넷플릭스',   amount:17000,  active:true  },
  { id:3, category:'주거',   icon:'house', bg:'#F0F0F0', fg:'#666E7B', label:'관리비',     amount:120000, active:true  },
  { id:4, category:'교육',   icon:'edu',   bg:'#EBF9FF', fg:'#0099CC', label:'영어회화',   amount:80000,  active:false },
  { id:5, category:'구독',   icon:'sub',   bg:'#FFF7EB', fg:'#F0AC00', label:'유튜브 프리미엄', amount:14900, active:true },
];

const INITIAL_TXS = [
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

function fmt(n) { return n.toLocaleString('ko-KR') + '원'; }
function getCat(type, id) {
  return (type==='income' ? CATS_INCOME : CATS_EXPENSE).find(c=>c.id===id) || { icon:'other', bg:'#F2F4F6', fg:'#8B95A1' };
}

// ── CatIcon ───────────────────────────────────────────────────────
function CatIcon({ cat, size=44 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:size*0.28, background:cat.bg,
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <Icon name={cat.icon} size={size*0.45} color={cat.fg} />
    </div>
  );
}

function WhoTag({ who }) {
  return (
    <span style={{ fontSize:10, fontWeight:600, padding:'2px 6px', borderRadius:6,
      background:who==='husband'?'#EBF2FF':'#FCEEFF',
      color:who==='husband'?'#3182F6':'#C759D6' }}>
      {who==='husband'?'남편':'아내'}
    </span>
  );
}

// ── TxRow ─────────────────────────────────────────────────────────
function TxRow({ tx, last }) {
  const cat = getCat(tx.type, tx.category);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 0',
      borderBottom:last?'none':`1px solid ${C.border}` }}>
      <CatIcon cat={cat} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:3 }}>{tx.category}</div>
        <div style={{ fontSize:12, color:C.sub, display:'flex', gap:6, alignItems:'center' }}>
          <span>{tx.memo}</span>
          <span style={{ color:C.border }}>·</span>
          <WhoTag who={tx.who} />
        </div>
      </div>
      <span style={{ fontSize:15, fontWeight:700, flexShrink:0,
        color:tx.type==='income'?C.green:C.red }}>
        {tx.type==='income'?'+':'-'}{fmt(tx.amount)}
      </span>
    </div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────────
function HomeScreen({ transactions }) {
  const income  = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const balance = income - expense;
  const hExp = transactions.filter(t=>t.type==='expense'&&t.who==='husband').reduce((s,t)=>s+t.amount,0);
  const wExp = transactions.filter(t=>t.type==='expense'&&t.who==='wife').reduce((s,t)=>s+t.amount,0);
  const recent = [...transactions].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  const expRatio = income ? Math.min(expense/income*100,100) : 0;

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg, paddingBottom:90 }}>
      {/* Header */}
      <div style={{ background:C.card, padding:'20px 20px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <div>
            <div style={{ fontSize:13, color:C.sub, fontWeight:500 }}>2026년 4월</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.text }}>우리 가계부</div>
          </div>
          <div style={{ width:38, height:38, borderRadius:'50%', background:C.bg,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="bell" size={20} color={C.sub} />
          </div>
        </div>

        {/* Couple card */}
        <div style={{ background:C.bg, borderRadius:16, padding:'16px', margin:'16px 0' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            {[['husband','남편','#3182F6', hExp], ['wife','아내','#C759D6', wExp]].map(([who,label,color,exp])=>(
              <div key={who} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:42, height:42, borderRadius:'50%',
                  background:who==='husband'?'#DBEAFE':'#FAE8FF',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:22 }}>{who==='husband'?'👨':'👩'}</span>
                </div>
                <div>
                  <div style={{ fontSize:12, color:C.sub, marginBottom:2 }}>{label}</div>
                  <div style={{ fontSize:15, fontWeight:700, color }}>-{fmt(exp)}</div>
                </div>
              </div>
            ))}
            <div style={{ fontSize:20 }}>💑</div>
          </div>
          {/* Expense ratio bar */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:11, color:C.sub }}>이달 지출 현황</span>
              <span style={{ fontSize:11, fontWeight:700, color:C.red }}>{expRatio.toFixed(0)}%</span>
            </div>
            <div style={{ height:6, background:C.border, borderRadius:4, overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:4, background:C.red,
                width:`${expRatio}%`, transition:'width 0.5s' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
              <span style={{ fontSize:11, color:C.red }}>지출 {fmt(expense)}</span>
              <span style={{ fontSize:11, color:C.sub }}>수입 {fmt(income)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 summary tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, padding:'8px 16px', marginBottom:0 }}>
        {[
          { label:'수입', val:income, color:C.green, icon:'money' },
          { label:'지출', val:expense, color:C.red, icon:'shop' },
          { label:'잔액', val:balance, color:C.blue, icon:'wallet' },
        ].map(item=>(
          <div key={item.label} style={{ background:C.card, borderRadius:14, padding:'14px 10px', textAlign:'center' }}>
            <div style={{ width:32, height:32, borderRadius:10,
              background:item.color+'18', display:'flex', alignItems:'center',
              justifyContent:'center', margin:'0 auto 8px' }}>
              <Icon name={item.icon} size={16} color={item.color} />
            </div>
            <div style={{ fontSize:10, color:C.sub, marginBottom:4 }}>{item.label}</div>
            <div style={{ fontSize:13, fontWeight:800, color:item.color,
              wordBreak:'break-all', lineHeight:1.2 }}>
              {(item.val/10000).toFixed(0)}만원
            </div>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div style={{ background:C.card, margin:'8px 0', padding:'16px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>최근 내역</span>
          <span style={{ fontSize:12, color:C.blue, fontWeight:600 }}>전체보기</span>
        </div>
        {recent.map((tx,i)=><TxRow key={tx.id} tx={tx} last={i===recent.length-1} />)}
      </div>
    </div>
  );
}

// ── CALENDAR ─────────────────────────────────────────────────────
function CalendarScreen({ transactions }) {
  const [sel, setSel] = React.useState('2026-04-25');
  const year=2026, daysInMonth=30, firstDay=3;
  const dayLabels=['일','월','화','수','목','금','토'];

  const dayMap={};
  transactions.forEach(t=>{
    if(!dayMap[t.date]) dayMap[t.date]={inc:0,exp:0};
    if(t.type==='income') dayMap[t.date].inc+=t.amount;
    else dayMap[t.date].exp+=t.amount;
  });
  const cells=[];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);

  const totalInc=transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const totalExp=transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const selTxs=transactions.filter(t=>t.date===sel).sort((a,b)=>b.amount-a.amount);

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg, paddingBottom:90 }}>
      <div style={{ background:C.card, padding:'16px 20px 0', marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
          <button style={{ border:'none', background:'none', cursor:'pointer', color:C.sub, fontSize:20, padding:'4px 8px' }}>‹</button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:17, fontWeight:700, color:C.text }}>2026년 4월</div>
            <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:2 }}>
              <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>수입 +{fmt(totalInc)}</span>
              <span style={{ fontSize:11, color:C.red,   fontWeight:600 }}>지출 -{fmt(totalExp)}</span>
              <span style={{ fontSize:11, color:C.sub }}>합계 +{fmt(totalInc-totalExp)}</span>
            </div>
          </div>
          <button style={{ border:'none', background:'none', cursor:'pointer', color:C.sub, fontSize:20, padding:'4px 8px' }}>›</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', textAlign:'center',
          padding:'8px 0 4px', borderBottom:`1px solid ${C.border}` }}>
          {dayLabels.map((d,i)=>(
            <div key={d} style={{ fontSize:11, fontWeight:600,
              color:i===0?C.red:i===6?C.blue:C.sub }}>{d}</div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'6px 0 4px' }}>
          {cells.map((day,i)=>{
            if(!day) return <div key={`e${i}`} />;
            const dk=`2026-04-${String(day).padStart(2,'0')}`;
            const data=dayMap[dk];
            const isSel=dk===sel;
            return (
              <div key={day} onClick={()=>setSel(dk)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'3px 1px', cursor:'pointer' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', display:'flex',
                  alignItems:'center', justifyContent:'center', marginBottom:1,
                  background:isSel?C.text:'transparent' }}>
                  <span style={{ fontSize:12, fontWeight:isSel?700:400,
                    color:isSel?'white':i%7===0?C.red:i%7===6?C.blue:C.text }}>{day}</span>
                </div>
                {data&&(
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    {data.exp>0&&<span style={{ fontSize:9, color:C.red, lineHeight:1.3 }}>-{(data.exp/1000).toFixed(0)}K</span>}
                    {data.inc>0&&<span style={{ fontSize:9, color:C.green, lineHeight:1.3 }}>+{(data.inc/10000).toFixed(0)}만</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background:C.card, padding:'16px 20px' }}>
        <div style={{ fontSize:13, fontWeight:600, color:C.sub, marginBottom:8 }}>
          {sel.slice(5).replace('-','월 ')}일 내역
        </div>
        {selTxs.length===0
          ? <div style={{ padding:'20px 0', textAlign:'center', color:C.sub, fontSize:14 }}>내역이 없어요</div>
          : selTxs.map((tx,i)=><TxRow key={tx.id} tx={tx} last={i===selTxs.length-1} />)
        }
      </div>
    </div>
  );
}

// ── LEDGER ───────────────────────────────────────────────────────
function LedgerScreen({ transactions }) {
  const groups={};
  [...transactions].sort((a,b)=>b.date.localeCompare(a.date)).forEach(tx=>{
    if(!groups[tx.date]) groups[tx.date]=[];
    groups[tx.date].push(tx);
  });
  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg, paddingBottom:90 }}>
      <div style={{ background:C.card, padding:'18px 20px 14px', marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button style={{ border:'none', background:'none', fontSize:18, color:C.sub, cursor:'pointer' }}>‹</button>
          <span style={{ fontSize:17, fontWeight:700, color:C.text }}>2026년 4월</span>
          <button style={{ border:'none', background:'none', fontSize:18, color:C.sub, cursor:'pointer' }}>›</button>
        </div>
      </div>
      {Object.entries(groups).map(([date,txs])=>{
        const dayInc=txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
        const dayExp=txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
        const [,mm,dd]=date.split('-');
        const dayName=['일','월','화','수','목','금','토'][new Date(date).getDay()];
        return (
          <div key={date} style={{ background:C.card, marginBottom:8, padding:'0 20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'12px 0 4px', borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.sub }}>{mm}월 {dd}일 {dayName}요일</span>
              <div style={{ display:'flex', gap:10 }}>
                {dayInc>0&&<span style={{ fontSize:12, color:C.green, fontWeight:600 }}>+{fmt(dayInc)}</span>}
                {dayExp>0&&<span style={{ fontSize:12, color:C.red,   fontWeight:600 }}>-{fmt(dayExp)}</span>}
              </div>
            </div>
            {txs.map((tx,i)=><TxRow key={tx.id} tx={tx} last={i===txs.length-1} />)}
          </div>
        );
      })}
    </div>
  );
}

// ── STATS SCREEN ──────────────────────────────────────────────────
function StatsScreen({ transactions }) {
  const [mode, setMode] = React.useState('expense');
  const filtered = transactions.filter(t=>t.type===mode);
  const total = filtered.reduce((s,t)=>s+t.amount,0);
  const cats = mode==='expense' ? CATS_EXPENSE : CATS_INCOME;
  const PIE_COLORS=['#F04452','#3182F6','#A259CC','#00B493','#F0AC00','#F06A00','#C759D6','#0099CC','#00B493','#3182F6'];

  const byId={};
  filtered.forEach(t=>{ byId[t.category]=(byId[t.category]||0)+t.amount; });
  const rows = Object.entries(byId)
    .map(([id,amount])=>({ ...(cats.find(c=>c.id===id)||{icon:'other',bg:'#F2F4F6',fg:'#8B95A1',id}), amount, pct:total?amount/total*100:0 }))
    .sort((a,b)=>b.amount-a.amount);

  // SVG Donut
  const cx=90, cy=90, r=72, sw=20, circ=2*Math.PI*r;
  let cum=0;
  const arcs = rows.map((row,i)=>{
    const pct=row.pct/100;
    const arc={ pct, offset:circ*(1-pct), rotation:cum*360-90, color:PIE_COLORS[i%PIE_COLORS.length] };
    cum+=pct;
    return arc;
  });

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg, paddingBottom:90 }}>
      <div style={{ background:C.card, padding:'18px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <button style={{ border:'none', background:'none', fontSize:18, color:C.sub, cursor:'pointer' }}>‹</button>
          <span style={{ fontSize:17, fontWeight:700, color:C.text }}>2026년 4월</span>
          <button style={{ border:'none', background:'none', fontSize:18, color:C.sub, cursor:'pointer' }}>›</button>
        </div>
        {/* Toggle */}
        <div style={{ display:'flex', background:C.bg, borderRadius:10, padding:3, marginBottom:16 }}>
          {[['expense','지출'],['income','수입']].map(([v,l])=>(
            <button key={v} onClick={()=>setMode(v)}
              style={{ flex:1, padding:'9px', borderRadius:8, border:'none', cursor:'pointer',
                fontWeight:700, fontSize:14, transition:'all 0.15s',
                background:mode===v?C.card:'transparent',
                color:mode===v?C.text:C.sub,
                boxShadow:mode===v?'0 1px 4px rgba(0,0,0,0.08)':'none' }}>{l}</button>
          ))}
        </div>
        {/* Total */}
        <div style={{ textAlign:'center', marginBottom:4 }}>
          <div style={{ fontSize:12, color:C.sub, marginBottom:4 }}>{mode==='expense'?'총 지출':'총 수입'}</div>
          <div style={{ fontSize:30, fontWeight:800, color:C.text }}>{fmt(total)}</div>
        </div>
        {/* Donut */}
        {total>0&&(
          <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
            <svg width={180} height={180} viewBox="0 0 180 180">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.bg} strokeWidth={sw} />
              {arcs.map((arc,i)=>(
                <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                  stroke={arc.color} strokeWidth={sw}
                  strokeDasharray={`${circ*arc.pct} ${circ*(1-arc.pct)}`}
                  transform={`rotate(${arc.rotation} ${cx} ${cy})`} />
              ))}
              <text x={cx} y={cy-7} textAnchor="middle" fill={C.sub} fontSize={11}>{rows.length}개 항목</text>
              <text x={cx} y={cy+12} textAnchor="middle" fill={C.text} fontSize={13} fontWeight="800">이번 달</text>
            </svg>
          </div>
        )}
      </div>

      {/* Category list */}
      <div style={{ background:C.card, marginTop:8, padding:'8px 20px' }}>
        {rows.map((row,i)=>(
          <div key={row.id} style={{ display:'flex', alignItems:'center', gap:12,
            padding:'12px 0', borderBottom:i<rows.length-1?`1px solid ${C.border}`:'none' }}>
            <CatIcon cat={row} size={40} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:14, fontWeight:600, color:C.text }}>{row.id}</span>
                <span style={{ fontSize:14, fontWeight:700, color:mode==='expense'?C.red:C.green }}>{fmt(row.amount)}</span>
              </div>
              <div style={{ height:5, background:C.bg, borderRadius:3 }}>
                <div style={{ height:'100%', borderRadius:3,
                  background:PIE_COLORS[i%PIE_COLORS.length], width:`${row.pct}%` }} />
              </div>
            </div>
            <span style={{ fontSize:12, color:C.sub, width:34, textAlign:'right' }}>{row.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FIXED EXPENSES ────────────────────────────────────────────────
function FixedScreen({ onApply }) {
  const [items, setItems] = React.useState(FIXED_EXPENSES_DEFAULT);
  const [applied, setApplied] = React.useState(false);
  const activeTotal = items.filter(i=>i.active).reduce((s,i)=>s+i.amount,0);

  function toggle(id) { setItems(prev=>prev.map(i=>i.id===id?{...i,active:!i.active}:i)); }
  function apply() {
    items.filter(i=>i.active).forEach(item=>{
      onApply({ type:'expense', category:item.category, amount:item.amount,
        who:'husband', payment:'신용카드', memo:item.label, date:'2026-04-25', id:Date.now()+item.id });
    });
    setApplied(true);
    setTimeout(()=>setApplied(false), 2500);
  }

  return (
    <div style={{ flex:1, overflowY:'auto', background:C.bg, paddingBottom:90 }}>
      <div style={{ background:C.card, padding:'20px 20px 16px', marginBottom:8 }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>고정비</div>
        <div style={{ fontSize:13, color:C.sub, marginBottom:16 }}>매달 반복되는 항목을 관리해요</div>
        <div style={{ background:C.bg, borderRadius:14, padding:'16px' }}>
          <div style={{ fontSize:12, color:C.sub, marginBottom:4 }}>이달 고정비 합계</div>
          <div style={{ fontSize:26, fontWeight:800, color:C.text }}>{fmt(activeTotal)}</div>
        </div>
      </div>

      <div style={{ background:C.card, padding:'8px 20px', marginBottom:8 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, padding:'10px 0 4px' }}>고정비 목록</div>
        {items.map((item,i)=>(
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12,
            padding:'13px 0', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:42, height:42, borderRadius:12, background:item.bg,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name={item.icon} size={19} color={item.fg} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:600, color:item.active?C.text:C.sub }}>{item.label}</div>
              <div style={{ fontSize:12, color:C.sub }}>{item.category} · 매월 자동</div>
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:item.active?C.red:C.sub, marginRight:8 }}>
              -{fmt(item.amount)}
            </span>
            <div onClick={()=>toggle(item.id)} style={{ cursor:'pointer',
              width:42, height:24, borderRadius:12, position:'relative', flexShrink:0,
              background:item.active?C.blue:C.border, transition:'background 0.2s' }}>
              <div style={{ position:'absolute', top:3, borderRadius:'50%', width:18, height:18,
                background:'white', transition:'left 0.2s', left:item.active?21:3,
                boxShadow:'0 1px 4px rgba(0,0,0,0.18)' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:'0 0 8px' }}>
        <button onClick={apply}
          style={{ width:'100%', padding:'16px', borderRadius:14, border:'none',
            background:applied?C.green:C.text, color:'white', fontSize:15,
            fontWeight:700, cursor:'pointer', transition:'background 0.3s' }}>
          {applied ? '✓ 이번 달에 적용됐어요' : `이번 달에 적용하기 · ${fmt(activeTotal)}`}
        </button>
      </div>
    </div>
  );
}

// ── ADD MODAL ─────────────────────────────────────────────────────
function AddModal({ onClose, onSave }) {
  const [type, setType]     = React.useState('expense');
  const [amount, setAmount] = React.useState('');
  const [category, setCat]  = React.useState('');
  const [payment, setPay]   = React.useState('신용카드');
  const [who, setWho]       = React.useState('husband');
  const [memo, setMemo]     = React.useState('');
  const cats = type==='expense' ? CATS_EXPENSE : CATS_INCOME;
  const accent = type==='expense' ? C.red : C.green;

  function num(n) {
    if(n==='del') setAmount(p=>p.slice(0,-1));
    else if(amount.length<9) setAmount(p=>p+n);
  }
  function save() {
    if(!amount||!category) return;
    onSave({ type, amount:parseInt(amount), category, payment, who, memo, date:'2026-04-25', id:Date.now() });
    onClose();
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.4)',
      display:'flex', flexDirection:'column' }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ marginTop:'auto', background:C.card, borderRadius:'22px 22px 0 0', maxHeight:'94%', overflowY:'auto' }}>
        <div style={{ padding:'16px 20px' }}>
          <div style={{ width:32, height:4, background:C.border, borderRadius:2, margin:'0 auto 18px' }} />
          <div style={{ display:'flex', background:C.bg, borderRadius:10, padding:3, marginBottom:18 }}>
            {[['expense','지출'],['income','수입']].map(([v,l])=>(
              <button key={v} onClick={()=>{setType(v);setCat('');}}
                style={{ flex:1, padding:'10px', borderRadius:8, border:'none', cursor:'pointer',
                  fontWeight:700, fontSize:14, transition:'all 0.15s',
                  background:type===v?(v==='expense'?C.red:C.green):'transparent',
                  color:type===v?'white':C.sub }}>{l}</button>
            ))}
          </div>
          <div style={{ fontSize:11, color:C.sub, textAlign:'center', marginBottom:4 }}>2026. 04. 25 토요일</div>
          <div style={{ textAlign:'center', marginBottom:16 }}>
            <span style={{ fontSize:36, fontWeight:800, color:amount?accent:'#D1D5DB' }}>
              {amount ? parseInt(amount).toLocaleString('ko-KR')+'원' : '0원'}
            </span>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
            {PAYMENTS.map(p=>(
              <button key={p} onClick={()=>setPay(p)}
                style={{ padding:'6px 13px', borderRadius:20, border:'none', cursor:'pointer',
                  fontWeight:600, fontSize:12, background:payment===p?accent+'18':C.bg,
                  color:payment===p?accent:C.sub, outline:payment===p?`1.5px solid ${accent}`:'none' }}>{p}</button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            {[['husband','남편'],['wife','아내']].map(([v,l])=>(
              <button key={v} onClick={()=>setWho(v)}
                style={{ flex:1, padding:'10px', borderRadius:10,
                  border:`1.5px solid ${who===v?accent:C.border}`, cursor:'pointer',
                  background:who===v?accent+'0D':'white', color:who===v?accent:C.sub, fontWeight:600, fontSize:13 }}>{l}</button>
            ))}
          </div>
          <div style={{ fontSize:12, fontWeight:600, color:C.sub, marginBottom:8 }}>카테고리</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
            {cats.map(cat=>(
              <button key={cat.id} onClick={()=>setCat(cat.id)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                  padding:'10px 4px', borderRadius:12,
                  border:`1.5px solid ${category===cat.id?accent:'transparent'}`,
                  background:category===cat.id?accent+'10':cat.bg, cursor:'pointer' }}>
                <Icon name={cat.icon} size={22} color={category===cat.id?accent:cat.fg} />
                <span style={{ fontSize:10, color:category===cat.id?accent:C.text, fontWeight:600 }}>{cat.id}</span>
              </button>
            ))}
          </div>
          <input value={memo} onChange={e=>setMemo(e.target.value)} placeholder="메모"
            style={{ width:'100%', padding:'12px 14px', borderRadius:10, border:`1px solid ${C.border}`,
              fontSize:14, outline:'none', background:'#FAFAFA', color:C.text,
              marginBottom:12, boxSizing:'border-box' }} />
          <button onClick={save} disabled={!amount||!category}
            style={{ width:'100%', padding:'15px', borderRadius:12, border:'none', marginBottom:6,
              background:(!amount||!category)?C.border:C.text,
              color:(!amount||!category)?C.sub:'white',
              fontSize:15, fontWeight:700, cursor:(!amount||!category)?'not-allowed':'pointer' }}>
            저장하기
          </button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderTop:`1px solid ${C.border}` }}>
          {['1','2','3','4','5','6','7','8','9','00','0','del'].map(n=>(
            <button key={n} onClick={()=>num(n)}
              style={{ padding:'17px', border:'none', borderRight:`1px solid ${C.border}`,
                borderBottom:`1px solid ${C.border}`, background:C.card,
                fontSize:n==='del'?18:17, fontWeight:500, cursor:'pointer', color:C.text }}>
              {n==='del'?'⌫':n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HomeScreen, CalendarScreen, LedgerScreen, StatsScreen, FixedScreen, AddModal,
  INITIAL_TXS, fmt, C
});
