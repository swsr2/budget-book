import React, { useState, useEffect } from 'react';
import { C, fmt, fmtShort, getCat, Transaction, CATS_EXPENSE, CATS_INCOME, CATS_TRANSFER, PAYMENTS, FIXED_EXPENSES_DEFAULT } from './Constants';
import { Icon, CatIcon } from './Icons';

function WhoTag({ who }: { who: string }) {
  const isHusband = who === 'husband';
  const isShared = who === 'shared';
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isHusband ? 'bg-[#ebf2ff] text-[#3182f6]' : isShared ? 'bg-purple-100 text-purple-600' : 'bg-[#fceeff] text-[#c759d6]'
      }`}>
      {isHusband ? '남편' : isShared ? '공동' : '아내'}
    </span>
  );
}

export function TxRow({ tx, last, onClick, onDelete }: { tx: Transaction, last: boolean, onClick?: (tx: Transaction) => void, onDelete?: (id: string) => void }) {
  const cat = getCat(tx.type, tx.category);
  return (
    <div className={`flex items-center gap-3 py-3.5 ${!last ? 'border-b border-[var(--border)]' : ''}`}>
      <div onClick={() => onClick?.(tx)} className={`flex items-center gap-3 flex-1 min-w-0 ${onClick ? 'cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all -mx-2 px-2 rounded-xl' : ''}`}>
        <CatIcon cat={cat} />
        <div className="flex-1 min-w-0 py-1">
          <div className="text-[15px] font-bold text-[var(--foreground)] mb-1 truncate">
            {tx.category}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {tx.memo && <span className="text-[12px] text-[var(--text-muted)] truncate max-w-[140px] block">{tx.memo}</span>}
            <WhoTag who={tx.who} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <div onClick={() => onClick?.(tx)} className={`text-[16px] font-bold ${onClick ? 'cursor-pointer' : ''} ${tx.type === 'income' ? 'text-[var(--primary)]' : tx.type === 'transfer' ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
          {tx.type === 'income' ? '+' : tx.type === 'transfer' ? '' : '-'}{fmt(tx.amount)}원
        </div>
        {onDelete && (
          <button onClick={(e) => { e.stopPropagation(); if (confirm('정말 삭제할까요?')) onDelete(tx.id); }} className="text-[13px] p-1.5 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

export type AssetItem = { id: string; label: string; emoji: string; amount: number };

export function HomeScreen({ transactions, onUpload, assets, onAssetsChange, onDelete }: {
  transactions: Transaction[],
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  assets: AssetItem[],
  onAssetsChange: (assets: AssetItem[]) => void,
  onDelete?: (id: string) => void
}) {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // 자산 계산: 금융자산(통장/현금/예적금/투자/연금), 부동산, 대출, 순자산
  const realEstateAsset = assets.find(a => a.id === 'realestate');
  const loanAsset = assets.find(a => a.id === 'loan');
  const financialAssets = assets.filter(a => a.id !== 'loan' && a.id !== 'realestate');
  
  const financialTotal = financialAssets.reduce((s, a) => s + a.amount, 0);
  const realEstateTotal = realEstateAsset?.amount || 0;
  const loanTotal = loanAsset?.amount || 0;
  const totalAssets = financialTotal + realEstateTotal;
  const netAssets = totalAssets - loanTotal;

  const normalAssets = assets.filter(a => a.id !== 'loan');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');

  const startEdit = (asset: AssetItem) => {
    const baseAsset = assets.find(a => a.id === asset.id);
    setEditingId(asset.id);
    setEditVal(String(baseAsset?.amount || 0));
  };
  const saveEdit = (id: string) => {
    const val = parseInt(editVal.replace(/,/g, '')) || 0;
    onAssetsChange(assets.map(a => a.id === id ? { ...a, amount: val } : a));
    setEditingId(null);
  };

  const renderAssetRow = (asset: AssetItem, isLast: boolean) => (
    <div key={asset.id} className={`flex items-center gap-3.5 py-3.5 ${!isLast ? 'border-b border-[var(--border)]' : ''}`}>
      <div className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center text-[18px] border border-gray-100">{asset.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold text-[var(--foreground)] mb-0.5">{asset.label}</div>
      </div>
      {editingId === asset.id ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEdit(asset.id)}
            className="w-28 text-right text-[14px] font-bold py-1.5 px-2 rounded-lg border border-[var(--primary)] outline-none bg-purple-50"
            autoFocus
          />
          <button onClick={() => saveEdit(asset.id)} className="text-[12px] font-bold text-white px-3 py-1.5 rounded-lg" style={{ background: 'var(--primary-gradient)' }}>OK</button>
        </div>
      ) : (
        <div onClick={() => startEdit(asset)} className="cursor-pointer flex items-center gap-1 hover:opacity-70 transition-opacity">
          <span className={`text-[15px] font-bold ${asset.amount < 0 ? 'text-red-500' : 'text-[var(--foreground)]'}`}>{asset.amount < 0 ? `-${fmt(Math.abs(asset.amount))}` : fmt(asset.amount)}원</span>
          <span className="text-[10px] text-[var(--text-muted)]">✏️</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--background)] pb-24 animate-[fadeIn_0.3s_ease]">
      <div className="bg-white px-5 sm:px-6 pt-8 pb-8 rounded-b-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative z-10 w-full">
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="text-[13px] text-[var(--text-muted)] font-medium mb-1 tracking-wider opacity-80">2026년</div>
            <div className="text-[24px] font-extrabold text-[var(--foreground)] tracking-tight">우리 가계부</div>
          </div>
          <label className="cursor-pointer w-12 h-12 rounded-full bg-[var(--background)] flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-100 shadow-sm active:scale-95">
            <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={onUpload} />
            <span className="text-[12px] font-extrabold text-[var(--primary)]">엑셀</span>
          </label>
        </div>

        {/* Assets Summary Header Card */}
        <div className="mb-6 p-5 rounded-[28px] bg-gradient-to-br from-gray-50/90 via-purple-50/30 to-blue-50/40 border border-gray-100 shadow-sm">
          {/* Main: 순자산 */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--primary)] font-extrabold mb-1">
                <span>💎</span>
                <span>순자산</span>
                <span className="text-[10px] text-[var(--text-muted)] font-normal">(총자산 - 대출)</span>
              </div>
              <div className="text-[28px] font-black text-[var(--foreground)] tracking-tight leading-none">
                {fmt(netAssets)}<span className="text-[16px] font-bold ml-0.5">원</span>
              </div>
            </div>
            {loanTotal > 0 && (
              <div className="text-right bg-red-50/80 px-2.5 py-1 rounded-xl border border-red-100">
                <div className="text-[10px] text-red-500 font-bold">대출(부채)</div>
                <div className="text-[12px] font-extrabold text-red-600">-{fmt(loanTotal)}원</div>
              </div>
            )}
          </div>

          {/* Sub Grid: 금융자산 vs 부동산 */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-gray-200/60">
            <div className="bg-white/90 p-3 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-bold mb-1">
                <span className="flex items-center gap-1">🏦 금융자산</span>
              </div>
              <div className="text-[16px] font-extrabold text-blue-600 tracking-tight">
                {fmt(financialTotal)}<span className="text-[12px] font-bold ml-0.5 text-gray-500">원</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5 truncate">예적금·투자·계좌 등</div>
            </div>

            <div className="bg-white/90 p-3 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-bold mb-1">
                <span className="flex items-center gap-1">🏠 부동산</span>
              </div>
              <div className="text-[16px] font-extrabold text-purple-600 tracking-tight">
                {fmt(realEstateTotal)}<span className="text-[12px] font-bold ml-0.5 text-gray-500">원</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5 truncate">실물 부동산 자산</div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 flex justify-between items-center text-[11px] text-[var(--text-muted)] opacity-70 px-1">
            <span>총 자산 (금융 + 부동산)</span>
            <span className="font-bold text-[var(--foreground)]">{fmt(totalAssets)}원</span>
          </div>
        </div>

        <div className="flex gap-3 mb-2 w-full">
          <div className="flex-1 rounded-[24px] pt-5 pb-6 px-5 text-white shadow-xl shadow-[var(--primary)]/30 relative overflow-hidden group" style={{ background: 'var(--primary-gradient)' }}>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-[20px] group-hover:scale-110 transition-transform duration-500"></div>
            <div className="text-[13px] font-medium text-white/80 mb-2">총 수입</div>
            <div className="text-[22px] font-bold tracking-tight">{fmt(income)}원</div>
          </div>
          <div className="flex-1 rounded-[24px] bg-[#f8f9fa] border border-[#e5e8eb] pt-5 pb-6 px-5 text-[var(--foreground)] relative overflow-hidden">
            <div className="text-[13px] font-semibold text-[var(--text-muted)] mb-2">총 지출</div>
            <div className="text-[22px] font-bold tracking-tight">{fmt(expense)}원</div>
          </div>
        </div>
      </div>

      {/* Asset Management */}
      <div className="mt-4 mx-4 sm:mx-6 rounded-[28px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-[16px] font-bold text-[var(--foreground)]">자산 현황</span>
          <span className="text-[20px] select-none">💰</span>
        </div>
        {normalAssets.map((asset, i) => renderAssetRow(asset, i === normalAssets.length - 1))}
      </div>

      {/* Loan - Separate Section */}
      {loanAsset && (
        <div className="mt-3 mx-4 sm:mx-6 rounded-[28px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-[16px] font-bold text-[var(--foreground)]">대출 현황</span>
            <span className="text-[20px] select-none">🏠</span>
          </div>
          {renderAssetRow(loanAsset, true)}
        </div>
      )}
    </div>
  );
}

export function HistoryScreen({ transactions, onRowClick, onDateSelect, onDelete }: { transactions: Transaction[], onRowClick?: (tx: Transaction) => void, onDateSelect?: (date: string) => void, onDelete?: (id: string) => void }) {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const formattedMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
  const moveMonth = (dir: number) => {
    setCurrentDate(new Date(year, month + dir, 1));
    if (view === 'calendar') setSel('');
  };

  // Calendar specific
  const [sel, setSel] = useState("");
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const handleSelectDate = (dk: string) => { setSel(dk); onDateSelect?.(dk); };
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  // Data
  const monthTxs = transactions.filter(t => t.date.startsWith(formattedMonth));

  // For Calendar
  const dayMap: Record<string, { inc: number, exp: number }> = {};
  monthTxs.forEach(t => {
    if (!dayMap[t.date]) dayMap[t.date] = { inc: 0, exp: 0 };
    if (t.type === 'income') dayMap[t.date].inc += t.amount;
    else if (t.type === 'expense') dayMap[t.date].exp += t.amount;
  });
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const totalInc = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExp = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const displaySel = sel || (() => {
    const today = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
    return today.startsWith(formattedMonth) && dayMap[today] ? today : '';
  })();
  const selTxs = displaySel ? monthTxs.filter(t => t.date === displaySel).sort((a, b) => b.amount - a.amount) : [];

  // For List
  const groups: Record<string, Transaction[]> = {};
  [...monthTxs].sort((a, b) => b.date.localeCompare(a.date)).forEach(tx => {
    if (!groups[tx.date]) groups[tx.date] = [];
    groups[tx.date].push(tx);
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--background)] pb-24 animate-[fadeIn_0.3s_ease]">
      <div className={`bg-white px-4 pt-8 pb-5 shadow-sm relative z-10 w-full border-b border-[var(--border)] ${view === 'calendar' ? 'rounded-b-[40px]' : 'rounded-b-[40px] mb-4'}`}>
        <div className="flex bg-gray-100 p-1 rounded-xl w-full max-w-[200px] mx-auto mb-5">
          <button onClick={() => setView('calendar')} className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all ${view === 'calendar' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>달력</button>
          <button onClick={() => setView('list')} className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>목록</button>
        </div>

        <div className="flex items-center justify-between mb-5 px-2">
          <button onClick={() => moveMonth(-1)} className="p-2 text-[var(--text-muted)] hover:bg-gray-100 rounded-full transition-colors font-bold text-xl leading-none">‹</button>
          <div className="text-center">
            <div className="text-[18px] font-extrabold text-[var(--foreground)] tracking-tight">{year}년 {month + 1}월</div>
            <div className="flex gap-3 justify-center mt-1.5 opacity-90">
              <span className="text-[11px] text-[var(--primary)] font-bold">수입 +{fmt(totalInc)}원</span>
              <span className="text-[11px] text-[var(--foreground)] font-bold">지출 -{fmt(totalExp)}원</span>
            </div>
          </div>
          <button onClick={() => moveMonth(1)} className="p-2 text-[var(--text-muted)] hover:bg-gray-100 rounded-full transition-colors font-bold text-xl leading-none">›</button>
        </div>

        {view === 'calendar' && (
          <>
            <div className="grid grid-cols-7 text-center pb-2 mb-2 border-b border-[var(--border)]">
              {dayLabels.map((d, i) => (
                <div key={d} className={`text-[11px] font-bold ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-[var(--text-muted)]'}`}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2">
              {cells.map((day, i) => {
                if (!day) return <div key={`e${i}`} />;
                const dk = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const data = dayMap[dk];
                const isSel = dk === displaySel;
                return (
                  <div key={day} onClick={() => handleSelectDate(dk)} className="flex flex-col items-center p-1 cursor-pointer group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all ${isSel ? 'bg-[var(--foreground)] text-white shadow-md' : 'text-[var(--foreground)] group-hover:bg-gray-100'}`}>
                      <span className={`text-[13px] ${isSel ? 'font-bold' : i % 7 === 0 ? 'text-red-500' : i % 7 === 6 ? 'text-blue-500' : ''}`}>{day}</span>
                    </div>
                    {data && (
                      <div className="flex flex-col items-center gap-[1px]">
                        {data.exp > 0 && <span className="text-[9px] text-[var(--foreground)] font-[900] tracking-tighter">-{fmtShort(data.exp)}</span>}
                        {data.inc > 0 && <span className="text-[9px] text-[var(--primary)] font-[900] tracking-tighter">+{fmtShort(data.inc)}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {view === 'calendar' && (
        <div className="mt-4 mx-4 sm:mx-6 rounded-[28px] bg-white p-5 pb-3 shadow-sm">
          <div className="text-[14px] font-bold text-[var(--text-muted)] mb-3 px-1 border-b border-[var(--border)] pb-3">
            {displaySel ? displaySel.slice(5).replace('-', '월 ') + '일 내역' : '날짜를 선택하세요'}
          </div>
          {selTxs.length === 0
            ? <div className="py-8 text-center text-[13px] text-[var(--text-muted)]">이 날은 내역이 없어요 🐣</div>
            : selTxs.map((tx, i) => <TxRow key={tx.id} tx={tx} onClick={onRowClick} onDelete={onDelete} last={i === selTxs.length - 1} />)
          }
        </div>
      )}

      {view === 'list' && (
        <>
          {Object.keys(groups).length === 0 && (
            <div className="py-12 text-center text-[13px] text-[var(--text-muted)]">이 달에는 내역이 없습니다.</div>
          )}

          {Object.entries(groups).map(([date, txs]) => {
            const dayInc = txs.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + t.amount, 0);
            const dayExp = txs.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + t.amount, 0);
            const [, mm, dd] = date.split('-');
            const dayName = ['일', '월', '화', '수', '목', '금', '토'][new Date(date).getDay()];
            return (
              <div key={date} className="mx-4 sm:mx-6 rounded-[28px] bg-white p-5 pb-3 shadow-sm mb-4">
                <div className="flex justify-between items-center border-b border-[var(--border)] pb-3 mb-2">
                  <span className="text-[13px] font-extrabold text-[var(--text-muted)]">{mm}월 {dd}일 {dayName}요일</span>
                  <div className="flex gap-3">
                    {dayInc > 0 && <span className="text-[12px] text-[var(--primary)] font-bold">+{fmt(dayInc)}원</span>}
                    {dayExp > 0 && <span className="text-[12px] text-[var(--foreground)] font-bold">-{fmt(dayExp)}원</span>}
                  </div>
                </div>
                {txs.map((tx, i) => <TxRow key={tx.id} tx={tx} onClick={onRowClick} onDelete={onDelete} last={i === txs.length - 1} />)}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export function StatsScreen({ transactions }: { transactions: Transaction[] }) {
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const [mode, setMode] = useState('expense');
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const moveMonth = (dir: number) => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + dir, 1));
  const moveYear = (dir: number) => setCurrentDate(new Date(currentDate.getFullYear() + dir, currentDate.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const formattedMonth = `${year}-${String(month + 1).padStart(2, '0')}`;

  const filtered = transactions.filter(t =>
    t.type === mode &&
    (period === 'month' ? t.date.startsWith(formattedMonth) : t.date.startsWith(`${year}-`))
  );

  const total = filtered.reduce((s, t) => s + t.amount, 0);
  const cats = mode === 'expense' ? CATS_EXPENSE : CATS_INCOME;
  const PIE_COLORS = ['#8b5cf6', '#c759d6', '#3182f6', '#00b493', '#f0ac00', '#f04452', '#f06a00', '#0099cc', '#9ca3af', '#6b7280'];

  const byId: Record<string, number> = {};
  filtered.forEach(t => { byId[t.category] = (byId[t.category] || 0) + t.amount; });
  const rows = Object.entries(byId)
    .map(([id, amount]) => ({ ...(cats.find(c => c.id === id) || { icon: 'other', bg: '#F2F4F6', fg: '#8B95A1', id }), amount, pct: total ? amount / total * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount);

  const cx = 90, cy = 90, r = 72, sw = 20, circ = 2 * Math.PI * r;
  let cum = 0;
  const arcs = rows.map((row, i) => {
    const pct = row.pct / 100;
    const arc = { pct, offset: circ * (1 - pct), rotation: cum * 360 - 90, color: PIE_COLORS[i % PIE_COLORS.length] };
    cum += pct;
    return arc;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--background)] pb-24 animate-[fadeIn_0.3s_ease]">
      <div className="bg-white rounded-b-[40px] px-5 pt-8 pb-5 shadow-sm relative z-10 w-full mb-4">

        <div className="flex bg-gray-100 p-1 rounded-xl w-full max-w-[200px] mx-auto mb-6">
          <button onClick={() => setPeriod('month')} className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all ${period === 'month' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>월별</button>
          <button onClick={() => setPeriod('year')} className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all ${period === 'year' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>연간</button>
        </div>

        <div className="flex justify-between items-center px-1 mb-5">
          <button onClick={() => period === 'month' ? moveMonth(-1) : moveYear(-1)} className="p-2 text-[var(--text-muted)] hover:bg-gray-100 rounded-full transition-colors font-bold text-xl leading-none">‹</button>
          <div className="text-[20px] font-extrabold text-[var(--foreground)] tracking-tight">{period === 'year' ? `${year}년 한 해` : `${year}년 ${month + 1}월`}</div>
          <button onClick={() => period === 'month' ? moveMonth(1) : moveYear(1)} className="p-2 text-[var(--text-muted)] hover:bg-gray-100 rounded-full transition-colors font-bold text-xl leading-none">›</button>
        </div>

        <div className="flex bg-gray-50 rounded-[14px] p-1.5 mb-6 border border-gray-100">
          {[['expense', '지출'], ['income', '수입']].map(([v, l]) => (
            <button key={v} onClick={() => { setMode(v); setExpandedCat(null); }}
              className={`flex-1 py-2.5 rounded-[10px] font-bold text-[14px] transition-all duration-200 ${mode === v ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[var(--foreground)]' : 'text-[var(--text-muted)]'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="text-[13px] text-[var(--text-muted)] font-medium mb-1">{mode === 'expense' ? '총 지출' : '총 수입'}</div>
          <div className="text-[32px] font-extrabold tracking-tight text-[var(--foreground)]">{fmt(total)}<span className="text-[20px]">원</span></div>
        </div>

        {total > 0 && (
          <div className="flex justify-center my-4 relative">
            <svg width={180} height={180} viewBox="0 0 180 180" className="drop-shadow-sm">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f8f9fa" strokeWidth={sw} />
              {arcs.map((arc, i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                  stroke={arc.color} strokeWidth={sw} strokeLinecap="round"
                  strokeDasharray={`${circ * arc.pct} ${circ * (1 - arc.pct)}`}
                  transform={`rotate(${arc.rotation} ${cx} ${cy})`} className="transition-all duration-1000 ease-out" />
              ))}
              <text x={cx} y={cy - 5} textAnchor="middle" fill="var(--text-muted)" fontSize={12} fontWeight="600">{rows.length}개 항목</text>
              <text x={cx} y={cy + 15} textAnchor="middle" fill="var(--foreground)" fontSize={15} fontWeight="800">통계</text>
            </svg>
          </div>
        )}
      </div>

      <div className="mx-4 sm:mx-6 rounded-[28px] bg-white p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-[var(--border)] pb-3">
          <h3 className="text-[15px] font-extrabold text-[var(--foreground)] ml-1">카테고리별 상세</h3>
          <span className="text-[11px] text-[var(--text-muted)] font-medium">터치 시 상세 내역 펼치기</span>
        </div>
        
        {rows.map((row, i) => {
          const isExpanded = expandedCat === row.id;
          const catTxList = filtered
            .filter(t => t.category === row.id)
            .sort((a, b) => b.date.localeCompare(a.date));

          return (
            <div key={row.id} className={`py-3.5 ${i < rows.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
              {/* 카테고리 헤더 (아코디언 토글) */}
              <div 
                onClick={() => setExpandedCat(isExpanded ? null : row.id)}
                className="flex items-center gap-3.5 cursor-pointer select-none active:opacity-70 transition-opacity"
              >
                <CatIcon cat={row} size={42} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1.5 items-center">
                    <span className="text-[14px] font-bold text-[var(--foreground)] flex items-center gap-1.5 truncate">
                      {row.id}
                      <span className="text-[10px] text-gray-400 font-normal">({catTxList.length}건)</span>
                    </span>
                    <span className={`text-[14px] font-bold ${mode === 'expense' ? 'text-[var(--foreground)]' : 'text-[var(--primary)]'}`}>
                      {fmt(row.amount)}원
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length], width: `${row.pct}%` }} 
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 pl-1">
                  <span className="text-[13px] font-bold text-[var(--text-muted)] min-w-[36px] text-right">
                    {row.pct.toFixed(0)}%
                  </span>
                  <span className={`text-[12px] text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </div>

              {/* 아코디언 상세 내역 리스트 */}
              {isExpanded && (
                <div className="mt-3.5 pt-3 border-t border-dashed border-gray-200 bg-gray-50/70 rounded-2xl px-3.5 py-2.5 animate-[fadeIn_0.2s_ease]">
                  <div className="space-y-2.5">
                    {catTxList.map((tx, idx) => (
                      <div key={tx.id || idx} className="flex justify-between items-center text-[12px] border-b border-gray-100 last:border-none pb-2 last:pb-0">
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="font-bold text-[var(--foreground)] truncate">
                            {tx.memo || '내용 없음'}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                            <span>{tx.date}</span>
                            <span>•</span>
                            <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200/60 font-medium">
                              {tx.payment}
                            </span>
                            {tx.who && (
                              <span className="text-gray-400">
                                ({tx.who === 'husband' ? '남편' : tx.who === 'wife' ? '아내' : '공용'})
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="font-extrabold text-[var(--foreground)] whitespace-nowrap pl-2">
                          {fmt(tx.amount)}원
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {rows.length === 0 && <div className="text-center py-6 text-gray-400 text-sm">내역이 없습니다.</div>}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 신규: ReportScreen (토스 스타일 스마트 리포트 탭)
// ----------------------------------------------------
export function ReportScreen({ transactions }: { transactions: Transaction[] }) {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [year, setYear] = useState(() => new Date().getFullYear());

  // 1. 해당 연도의 지출 데이터만 필터링
  const expenseTxs = transactions.filter(t => t.type === 'expense' && t.date.startsWith(`${year}-`));

  // 2. 월별 리스트 (01월 ~ 12월) 생성
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  
  // 현재/최근 월 파악
  const thisMonthStr = `${year}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const lastMonthDate = new Date(year, new Date().getMonth() - 1, 1);
  const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

  // 이번 달 / 지난 달 지출
  const thisMonthTxs = transactions.filter(t => t.type === 'expense' && t.date.startsWith(thisMonthStr));
  const lastMonthTxs = transactions.filter(t => t.type === 'expense' && t.date.startsWith(lastMonthStr));

  // 카테고리별 지난달 vs 이번달 비교 (가장 줄여야 할 지출 1위 찾기)
  const thisCatSum: Record<string, number> = {};
  thisMonthTxs.forEach(t => { thisCatSum[t.category] = (thisCatSum[t.category] || 0) + t.amount; });

  const lastCatSum: Record<string, number> = {};
  lastMonthTxs.forEach(t => { lastCatSum[t.category] = (lastCatSum[t.category] || 0) + t.amount; });

  // 전월 대비 증가액이 가장 큰 카테고리
  const surgeList = Object.entries(thisCatSum).map(([cat, amount]) => {
    const prev = lastCatSum[cat] || 0;
    const diff = amount - prev;
    const pct = prev > 0 ? (diff / prev) * 100 : (amount > 0 ? 100 : 0);
    return { cat, amount, prev, diff, pct };
  }).sort((a, b) => b.diff - a.diff);

  const topSurge = surgeList.length > 0 && surgeList[0].diff > 0 
    ? surgeList[0] 
    : (surgeList[0] || { cat: '외식', amount: 0, prev: 0, diff: 0, pct: 0 });

  // 3. 월별 추세 다이어그램 데이터 (선 그래프용)
  const monthlyAmounts = months.map(m => {
    const prefix = `${year}-${m}`;
    const txs = transactions.filter(t => 
      t.type === 'expense' && 
      t.date.startsWith(prefix) && 
      (selectedCat === 'all' || t.category === selectedCat)
    );
    return txs.reduce((s, t) => s + t.amount, 0);
  });

  // 데이터가 있는 마지막 월(1~12 중 실제 데이터가 존재하는 범위까지 계산)
  const activeMonths = months.map((m, idx) => ({ month: `${parseInt(m)}월`, amount: monthlyAmounts[idx] }));
  const maxVal = Math.max(...monthlyAmounts, 1);
  const avgAmount = monthlyAmounts.filter(a => a > 0).length > 0 
    ? Math.round(monthlyAmounts.filter(a => a > 0).reduce((a, b) => a + b, 0) / monthlyAmounts.filter(a => a > 0).length)
    : 0;

  // SVG 곡선 좌표 계산 (가로 320, 세로 120)
  const chartWidth = 320;
  const chartHeight = 110;
  const paddingX = 15;
  const stepX = (chartWidth - paddingX * 2) / (12 - 1);

  const points = monthlyAmounts.map((amt, idx) => {
    const x = paddingX + idx * stepX;
    const y = chartHeight - (amt / maxVal) * (chartHeight - 20) - 10;
    return { x, y, amt, month: `${idx + 1}월` };
  });

  // 부드러운 Bezier curve path 생성
  let pathD = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX = (curr.x + next.x) / 2;
    pathD += ` C ${cpX},${curr.y} ${cpX},${next.y} ${next.x},${next.y}`;
  }
  const areaD = `${pathD} L ${points[points.length - 1].x},${chartHeight + 10} L ${points[0].x},${chartHeight + 10} Z`;

  // 최신 활성 월 포인트
  const currentMonthIdx = new Date().getMonth();
  const currentPoint = points[currentMonthIdx] || points[points.length - 1];

  // 4. 이번 달 TOP 3 카테고리
  const top3Cats = Object.entries(thisCatSum)
    .map(([cat, amount]) => {
      const thisMonthTotal = thisMonthTxs.reduce((s, t) => s + t.amount, 0) || 1;
      return { cat, amount, pct: (amount / thisMonthTotal) * 100 };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // 상위 자주 쓰는 카테고리 칩 목록
  const chipCategories = ['all', '외식', '마트/편의점', '생활편의', '교통', '주거', '쇼핑/미용'];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f2f4f6] pb-24 animate-[fadeIn_0.3s_ease]">
      {/* 헤더 */}
      <div className="bg-white px-6 pt-8 pb-5 rounded-b-[36px] shadow-sm mb-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[12px] font-bold text-[var(--primary)] uppercase tracking-wider mb-1">Smart Report</div>
            <h1 className="text-[24px] font-black text-[#191f28] tracking-tight">지출 분석 리포트</h1>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] font-extrabold text-[#4e5968] bg-[#f2f4f6] px-3.5 py-1.5 rounded-full">
            <span>{year}년</span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-4">
        {/* 1. 토스식 팩폭 진단 카드 */}
        <div className="bg-white rounded-[26px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#f04452] bg-red-50 px-2.5 py-1 rounded-full mb-3">
            <span>⚠️ 지출 주의보</span>
          </div>

          <h2 className="text-[21px] font-black text-[#191f28] leading-snug tracking-tight">
            이번 달은 <span className="text-[var(--primary)]">{topSurge.cat}</span>을<br />
            제일 줄이셔야 해요
          </h2>

          <p className="text-[13px] text-[#4e5968] mt-2 leading-relaxed">
            {topSurge.diff > 0 ? (
              <>
                지난달보다 <b className="text-[#f04452] font-black">{fmt(topSurge.diff)}원</b> 더 썼어요.
                {topSurge.pct > 0 && <span> (전월비 +{topSurge.pct.toFixed(0)}% 급증)</span>}
              </>
            ) : (
              <>현재 지출 관리를 아주 알뜰하게 잘 유지하고 계십니다! 👏</>
            )}
          </p>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#8b95a1] font-medium block">이번 달 {topSurge.cat} 지출</span>
              <span className="text-[17px] font-black text-[#191f28]">{fmt(topSurge.amount)}원</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#8b95a1] font-medium block">전월 지출</span>
              <span className="text-[13px] font-bold text-[#6b7684]">{fmt(topSurge.prev)}원</span>
            </div>
          </div>
        </div>

        {/* 2. 연간 선 그래프(다이어그램) 카드 */}
        <div className="bg-white rounded-[26px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[11px] font-extrabold text-[#8b95a1]">연간 지출 트렌드</span>
              <h3 className="text-[17px] font-black text-[#191f28] mt-0.5 tracking-tight">월별 추세 다이어그램</h3>
            </div>
            <span className="text-[11px] text-[#3182f6] font-bold bg-blue-50 px-2.5 py-0.5 rounded-full">
              {selectedCat === 'all' ? '전체 지출' : selectedCat}
            </span>
          </div>

          {/* 카테고리 필터 칩 */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar py-2 my-1 -mx-2 px-2">
            {chipCategories.map(cat => {
              const active = selectedCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold shrink-0 transition-all ${
                    active ? 'bg-[#191f28] text-white shadow-sm' : 'bg-[#f2f4f6] text-[#6b7684] hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? '전체' : cat}
                </button>
              );
            })}
          </div>

          {/* SVG 선 다이어그램 */}
          <div className="relative w-full h-[170px] mt-3 select-none">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lineDiagramGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3182f6" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#3182f6" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              {/* 가이드 라인 */}
              <line x1={paddingX} y1={25} x2={chartWidth - paddingX} y2={25} stroke="#f2f4f6" strokeDasharray="3,3" strokeWidth="1" />
              <line x1={paddingX} y1={60} x2={chartWidth - paddingX} y2={60} stroke="#f2f4f6" strokeDasharray="3,3" strokeWidth="1" />
              <line x1={paddingX} y1={95} x2={chartWidth - paddingX} y2={95} stroke="#f2f4f6" strokeDasharray="3,3" strokeWidth="1" />

              {/* 그라데이션 영역 */}
              {maxVal > 0 && <path d={areaD} fill="url(#lineDiagramGrad)" />}

              {/* 메인 곡선 */}
              {maxVal > 0 && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#3182f6"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-500 ease-out"
                />
              )}

              {/* 각 월 포인트 */}
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={idx === currentMonthIdx ? 5.5 : 3.5}
                  fill={idx === currentMonthIdx ? '#f04452' : 'white'}
                  stroke={idx === currentMonthIdx ? 'white' : '#3182f6'}
                  strokeWidth={idx === currentMonthIdx ? 2.5 : 2}
                />
              ))}

              {/* 현재 월 툴팁 */}
              {currentPoint && currentPoint.amt > 0 && (
                <g transform={`translate(${Math.min(Math.max(currentPoint.x - 30, 5), chartWidth - 65)}, ${Math.max(currentPoint.y - 28, 2)})`}>
                  <rect width="60" height="20" rx="6" fill="#191f28" />
                  <text x="30" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {fmtShort(currentPoint.amt)}원
                  </text>
                </g>
              )}
            </svg>

            {/* X축 월 라벨 */}
            <div className="flex justify-between text-[10px] font-semibold text-[#8b95a1] pt-1 px-1">
              {months.filter((_, i) => i % 2 === 0).map(m => (
                <span key={m} className={m === String(currentMonthIdx + 1).padStart(2, '0') ? 'text-[#3182f6] font-bold' : ''}>
                  {parseInt(m)}월
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-[#f9fafb] p-3.5 rounded-2xl flex items-center justify-between text-[12px]">
            <span className="text-[#6b7684] font-medium">연평균 월 지출</span>
            <span className="font-black text-[#191f28]">{fmt(avgAmount)}원</span>
          </div>
        </div>

        {/* 3. 이번 달 지출 TOP 3 */}
        <div className="bg-white rounded-[26px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[16px] font-black text-[#191f28] tracking-tight">이번 달 지출 TOP 3</h3>
            <span className="text-[11px] font-semibold text-[#8b95a1]">전체 대비 비중</span>
          </div>

          <div className="space-y-4">
            {top3Cats.map((item, idx) => {
              const badgeColors = ['bg-red-50 text-[#f04452]', 'bg-blue-50 text-[#3182f6]', 'bg-gray-100 text-[#4e5968]'];
              const barColors = ['bg-[#f04452]', 'bg-[#3182f6]', 'bg-[#8b95a1]'];

              return (
                <div key={item.cat}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full font-black text-[11px] flex items-center justify-center ${badgeColors[idx]}`}>
                        {idx + 1}
                      </span>
                      <span className="text-[14px] font-extrabold text-[#191f28]">{item.cat}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[14px] font-black text-[#191f28]">{fmt(item.amount)}원</span>
                      <span className="text-[11px] text-[#8b95a1] font-bold ml-1.5">({item.pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-[#f2f4f6] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColors[idx]}`}
                      style={{ width: `${Math.min(item.pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {top3Cats.length === 0 && <div className="text-center py-4 text-gray-400 text-xs">내역이 없습니다.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FixedScreen({ items, onItemsChange, onApply, showAddFixed, onCloseAddFixed }: { 
  items: any[], 
  onItemsChange: (items: any[]) => void,
  onApply: (tx: Transaction) => void, 
  showAddFixed?: boolean, 
  onCloseAddFixed?: () => void 
}) {
  const [applied, setApplied] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editPayment, setEditPayment] = useState('신용카드');
  const [editMemo, setEditMemo] = useState('');
  const [editDay, setEditDay] = useState('');

  const [newType, setNewType] = useState('expense');
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPayment, setNewPayment] = useState('신용카드');
  const [newMemo, setNewMemo] = useState('');
  const [newDay, setNewDay] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const activeTotal = items.filter((i: any) => i.active).reduce((s: number, i: any) => s + i.amount, 0);

  function persist(next: typeof items) { onItemsChange(next); }
  function toggle(id: number) { persist(items.map((i: any) => i.id === id ? { ...i, active: !i.active } : i)); }
  function remove(id: number) { if (confirm('이 고정비 항목을 삭제할까요?')) persist(items.filter((i: any) => i.id !== id)); }
  function startEdit(item: any) { 
    setEditIdx(item.id); 
    setEditLabel(item.label); 
    setEditAmount(String(item.amount)); 
    setEditPayment(item.payment || '신용카드');
    setEditMemo(item.memo || '');
    setEditDay(item.day ? String(item.day) : '');
  }
  function saveEdit() {
    if (editIdx === null) return;
    persist(items.map((i: any) => i.id === editIdx ? { 
      ...i, 
      label: editLabel, 
      amount: parseInt(editAmount) || 0,
      payment: editPayment,
      memo: editMemo,
      day: parseInt(editDay) || null
    } : i));
    setEditIdx(null);
  }
  function addNew() {
    if (!newLabel || !newAmount || !newCategory) return;
    const catObj = getCat(newType, newCategory);
    const newItem = {
      id: Date.now(),
      label: newLabel,
      amount: parseInt(newAmount) || 0,
      type: newType,
      category: newCategory,
      payment: newPayment,
      memo: newMemo,
      day: parseInt(newDay) || null,
      icon: catObj.icon,
      bg: catObj.bg,
      fg: catObj.fg,
      active: true,
    };
    persist([...items, newItem]);
    setNewLabel(''); setNewAmount(''); setNewCategory(''); setNewType('expense');
    setNewPayment('신용카드'); setNewMemo(''); setNewDay('');
    onCloseAddFixed?.();
  }
  function apply() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');

    items.filter((i: any) => i.active).forEach((item: any) => {
      let applyDate = new Date().toISOString().slice(0, 10);
      if (item.day) {
        const dStr = String(item.day).padStart(2, '0');
        // 이번 달을 기준으로 날짜 생성
        applyDate = `${currentYear}-${currentMonth}-${dStr}`;
      }

      onApply({
        type: item.type || 'expense', 
        category: item.category, 
        amount: item.amount,
        who: 'shared', 
        payment: item.payment || '계좌이체', 
        memo: item.memo ? `${item.label} (${item.memo})` : item.label, 
        date: applyDate, 
        id: Date.now() + item.id + ""
      });
    });
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--background)] pb-24 animate-[fadeIn_0.3s_ease]">
      <div className="bg-white px-5 sm:px-6 pt-10 pb-6 rounded-b-[40px] shadow-sm relative z-10 w-full mb-4">
        <div className="text-[24px] font-extrabold text-[var(--foreground)] tracking-tight mb-2">고정비</div>
        <div className="text-[13px] text-[var(--text-muted)] font-medium mb-6">매달 숨막히게 나가는 단골 손님들 💸</div>

        <div className="shadow-lg shadow-[var(--primary)]/30 rounded-[24px] p-5 text-white relative overflow-hidden group" style={{ background: 'var(--primary-gradient)' }}>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-[20px] group-hover:scale-110 transition-transform duration-500"></div>
          <div className="text-[13px] font-medium text-white/80 mb-2">이달 고정비 합계</div>
          <div className="text-[28px] font-extrabold tracking-tight">{fmt(activeTotal)}원</div>
        </div>
      </div>

      {showAddFixed && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex flex-col justify-end animate-[fadeIn_0.2s_ease]" onClick={e => { if (e.target === e.currentTarget) onCloseAddFixed?.(); }}>
          <div className="bg-white rounded-t-[32px] w-full sm:max-w-[440px] mx-auto p-6 pb-8 shadow-2xl animate-[slideUp_0.3s_ease]">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5" />
            <div className="text-[18px] font-extrabold text-[var(--primary)] mb-5">✨ 새 고정비 추가</div>

            <div className="flex bg-gray-100 rounded-xl p-1.5 mb-5">
              {[['expense', '지출'], ['transfer', '이체']].map(([v, l]) => (
                <button key={v} onClick={() => { setNewType(v); setNewCategory(''); }}
                  className={`flex-1 py-2 rounded-lg font-bold text-[14px] transition-all ${newType === v ? 'bg-white shadow-sm text-[var(--foreground)]' : 'text-[var(--text-muted)]'}`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap mb-6">
              {(newType === 'expense' ? CATS_EXPENSE : CATS_TRANSFER).map(c => (
                <button key={c.id} onClick={() => setNewCategory(c.id)} className={`px-4 py-2 rounded-full font-bold text-[13px] border ${newCategory === c.id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-white border-gray-200'}`}>{c.id}</button>
              ))}
            </div>

            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="상세내용 (예: 관리비)" className="w-full p-4 rounded-xl bg-gray-50 mb-3 outline-none font-medium" />
            <div className="flex gap-2 mb-3">
              <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="금액" className="flex-1 p-4 rounded-xl bg-gray-50 outline-none font-medium" />
              <input type="number" value={newDay} onChange={e => setNewDay(e.target.value)} placeholder="결제일(예: 25)" className="w-28 p-4 rounded-xl bg-gray-50 outline-none font-medium text-center" min="1" max="31" />
            </div>
            
            <div className="flex gap-2 mb-3">
              {['신용카드', '체크카드', '현금', '계좌이체'].map(p => (
                <button key={p} onClick={() => setNewPayment(p)} className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold border transition-all ${newPayment === p ? 'bg-[var(--foreground)] text-white border-[var(--foreground)]' : 'bg-white border-gray-100 text-gray-400'}`}>{p}</button>
              ))}
            </div>
            <input value={newMemo} onChange={e => setNewMemo(e.target.value)} placeholder="카드명/이체 메모 등 (선택)" className="w-full p-4 rounded-xl bg-gray-50 mb-5 outline-none font-medium text-[14px]" />

            <button onClick={addNew} className="w-full py-4 rounded-xl font-bold text-white" style={{ background: 'var(--primary-gradient)' }}>추가하기</button>
          </div>
        </div>
      )}

      <div className="mx-4 sm:mx-6 flex flex-col gap-3 mb-4">
        {items.map((item: any) => {
          const dynamicCat = getCat(item.type || 'expense', item.category);
          return (
            <div key={item.id} className="rounded-[20px] bg-white p-4 shadow-sm relative">
              {editIdx === item.id ? (
                <div className="flex flex-col gap-2">
                  <input value={editLabel} onChange={e => setEditLabel(e.target.value)} placeholder="항목명" className="text-[14px] font-bold p-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50" />
                  <div className="flex gap-2">
                    <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} placeholder="금액" className="flex-1 min-w-0 text-[14px] font-bold p-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50" />
                    <input type="number" value={editDay} onChange={e => setEditDay(e.target.value)} placeholder="일" className="w-[52px] text-[14px] font-bold p-2.5 text-center rounded-xl border border-gray-200 outline-none bg-gray-50 shrink-0" min="1" max="31" />
                    <select value={editPayment} onChange={e => setEditPayment(e.target.value)} className="w-[90px] text-[12px] font-bold p-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50 shrink-0">
                      {['신용카드', '체크카드', '현금', '계좌이체'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <input value={editMemo} onChange={e => setEditMemo(e.target.value)} placeholder="메모 (선택)" className="text-[13px] p-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50" />
                  <div className="flex gap-2 justify-end mt-1">
                    <button onClick={saveEdit} className="px-4 py-2 rounded-xl text-white text-[13px] font-bold" style={{ background: 'var(--primary-gradient)' }}>저장</button>
                    <button onClick={() => setEditIdx(null)} className="px-3 py-2 rounded-xl bg-gray-100 text-[13px] font-bold text-gray-500">취소</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute top-2.5 right-3 flex gap-1">
                    <button onClick={() => startEdit(item)} className="text-[9px] p-1 rounded-md hover:bg-gray-100 transition-colors opacity-40 hover:opacity-100">✏️</button>
                    <button onClick={() => remove(item.id)} className="text-[9px] p-1 rounded-md hover:bg-red-50 transition-colors opacity-40 hover:opacity-100">🗑️</button>
                  </div>
                  <div className="flex items-center gap-3 pr-12">
                    <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: dynamicCat.bg }}>
                      <Icon name={dynamicCat.icon} size={20} color={dynamicCat.fg} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[14px] font-bold mb-0.5 ${item.active ? 'text-[var(--foreground)]' : 'text-gray-400'}`}>{item.label}</div>
                      <div className="text-[11px] text-gray-400">
                        {item.day && <span className="text-[var(--primary)] font-bold mr-1">매월 {item.day}일</span>}
                        {item.payment && <span className="text-[var(--primary)] font-bold mr-1">{item.payment}</span>}
                        {item.memo && <span className="mr-1">· {item.memo}</span>}
                        <span>[{item.type === 'transfer' ? '이체' : '지출'}] {item.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className={`text-[16px] font-bold ${item.active ? 'text-[var(--foreground)]' : 'text-gray-300'}`}>-{fmt(item.amount)}원</div>
                    <div onClick={() => toggle(item.id)} className={`w-[46px] h-[26px] rounded-full cursor-pointer transition-colors duration-300 relative shrink-0 ${item.active ? 'bg-[var(--primary)]' : 'bg-gray-200'}`}>
                      <div className={`w-[20px] h-[20px] bg-white rounded-full shadow-sm absolute top-[3px] transition-all duration-300 ${item.active ? 'left-[23px]' : 'left-[3px]'}`} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-4 pb-2">
        <button onClick={apply} className={`w-full py-4.5 rounded-[18px] text-[15px] font-bold text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${applied ? 'bg-[var(--green)]' : 'bg-[var(--foreground)] hover:opacity-90'}`}>
          {applied ? '✓ 이달 장부에 기록 완료' : `이달 내역에 적용하기 · ${fmt(activeTotal)}원`}
        </button>
      </div>
    </div>
  );
}

export function TxFormModal({
  onClose,
  onSave,
  onDelete,
  initialTx,
  defaultDate
}: {
  onClose: () => void,
  onSave: (tx: any) => void,
  onDelete?: (id: string) => void,
  initialTx?: Transaction | null,
  defaultDate?: string
}) {
  const isEdit = !!initialTx;
  const todayStr = new Date().toISOString().slice(0, 10);
  const [type, setType] = useState(initialTx?.type || 'expense');
  const [amount, setAmount] = useState(initialTx?.amount ? String(Math.abs(initialTx.amount)) : '');
  const [category, setCat] = useState(initialTx?.category || '');
  const [payment, setPay] = useState(initialTx?.payment || '신용카드');
  const [who, setWho] = useState(initialTx?.who || 'husband');
  const [memo, setMemo] = useState(initialTx?.memo || '');
  const [date, setDate] = useState(initialTx?.date || defaultDate || todayStr);

  const cats = type === 'expense' ? CATS_EXPENSE : type === 'transfer' ? CATS_TRANSFER : CATS_INCOME;

  function save() {
    if (!amount || !category) return;
    onSave({
      ...(isEdit ? initialTx : {}),
      type,
      amount: parseInt(amount),
      category, payment, who, memo,
      date,
      id: initialTx?.id || Date.now() + ""
    });
    onClose();
  }

  const handleDelete = () => {
    if (!isEdit || !initialTx || !onDelete) return;
    if (confirm('이 내역을 영구히 삭제할까요?')) {
      onDelete(initialTx.id);
      onClose();
    }
  };

  const canSave = !!(amount && category);

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex flex-col justify-end animate-[fadeIn_0.2s_ease]" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-t-[32px] w-full sm:max-w-[440px] mx-auto overflow-hidden flex flex-col max-h-[94vh] shadow-2xl animate-[slideUp_0.3s_ease]">

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-4">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5" />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[18px] font-extrabold text-[var(--foreground)]">{isEdit ? '내역 수정' : '내역 추가'}</h2>
            {isEdit && (
              <button onClick={handleDelete} className="text-[13px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">삭제</button>
            )}
          </div>

          <div className="flex bg-gray-100 rounded-[14px] p-1.5 mb-6">
            {[['expense', '지출'], ['income', '수입'], ['transfer', '이체']].map(([v, l]) => (
                <button key={v} onClick={() => { 
                  setType(v); 
                  if (!initialTx || initialTx.type !== v) { setCat(''); }
                  if (v === 'transfer' && payment !== '계좌이체') { setPay('계좌이체'); }
                  if (v === 'income' && (payment === '신용카드' || payment === '체크카드')) { setPay('계좌이체'); }
                }}
                className={`flex-1 py-2.5 rounded-[10px] font-bold text-[14px] transition-all duration-200 ${type === v ? 'bg-white shadow-sm text-[var(--foreground)]' : 'text-[var(--text-muted)]'}`}>
                {l}
              </button>
            ))}
          </div>

          <div className="text-center mb-4">
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="text-[14px] font-bold text-[var(--foreground)] bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 outline-none text-center focus:border-[var(--foreground)] transition-colors" />
          </div>

          <div className="text-center mb-6">
            <div className="relative inline-block">
              <input
                type="number"
                value={amount}
                onChange={e => { const v = e.target.value.replace(/\D/g, ''); if (v.length <= 10) setAmount(v); }}
                placeholder="0"
                className={`text-[42px] font-extrabold tracking-tight text-center bg-transparent outline-none w-48 ${amount ? 'text-[var(--foreground)]' : 'text-gray-300'}`}
                style={{ MozAppearance: 'textfield' }}
              />
              <span className="text-[24px] font-extrabold text-gray-400 absolute right-0 top-1/2 -translate-y-1/2">원</span>
            </div>
          </div>

          {type !== 'transfer' && (
            <div className="flex gap-2 flex-wrap mb-6">
              {(type === 'income' ? ['계좌이체', '현금'] : PAYMENTS).map(p => (
                <button key={p} onClick={() => setPay(p)}
                  className={`px-4 py-2 rounded-full font-bold text-[13px] transition-all border ${payment === p ? 'border-[var(--foreground)] bg-[var(--foreground)] text-white shadow-md' : 'border-gray-200 bg-white text-[var(--text-muted)]'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 mb-6">
            {[['husband', '남편', '👨'], ['wife', '아내', '👩'], ['shared', '공동', '👫']].map(([v, l, emoji]) => (
              <button key={v} onClick={() => setWho(v)}
                className={`flex-1 p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all ${who === v ? 'border-[var(--primary)] bg-purple-50 text-[var(--primary)]' : 'border-gray-100 bg-white text-[var(--text-muted)] hover:bg-gray-50'}`}>
                <span className="text-[16px]">{emoji}</span>
                <span className="font-bold text-[14px]">{l}</span>
              </button>
            ))}
          </div>

          <div className="text-[13px] font-extrabold text-[var(--foreground)] mb-3">카테고리</div>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {cats.map(cat => (
              <button key={cat.id} onClick={() => { setCat(cat.id); }}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-[16px] border-2 transition-colors ${category === cat.id ? 'border-[var(--foreground)] bg-gray-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}>
                <Icon name={cat.icon} size={24} color={category === cat.id ? 'var(--foreground)' : cat.fg} />
                <span className={`text-[11px] font-bold ${category === cat.id ? 'text-[var(--foreground)]' : 'text-gray-500'}`}>{cat.id}</span>
              </button>
            ))}
          </div>

          <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="메모 (선택사항)"
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 text-[15px] font-medium outline-none text-[var(--foreground)] mb-4 focus:border-[var(--foreground)] focus:bg-white transition-colors placeholder:text-gray-400" />

          <button onClick={save} disabled={!canSave}
            className={`w-full py-4.5 rounded-[18px] text-[16px] font-bold transition-all ${!canSave ? 'bg-gray-200 text-gray-400' : 'text-white shadow-lg shadow-[var(--primary)]/30 active:scale-95'}`}
            style={{ background: !canSave ? undefined : 'var(--primary-gradient)' }}>
            {isEdit ? '수정 완료' : '장부에 기록'}
          </button>
        </div>
      </div>
    </div>
  );
}

