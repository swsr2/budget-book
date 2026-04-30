import React, { useState, useEffect } from 'react';
import { C, fmt, fmtShort, getCat, Transaction, CATS_EXPENSE, CATS_INCOME, CATS_TRANSFER, PAYMENTS, FIXED_EXPENSES_DEFAULT } from './Constants';
import { Icon, CatIcon } from './Icons';

function WhoTag({ who }: { who: string }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${who === 'husband' ? 'bg-[#ebf2ff] text-[#3182f6]' : 'bg-[#fceeff] text-[#c759d6]'
      }`}>
      {who === 'husband' ? '남편' : '아내'}
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
  const hExp = transactions.filter(t => t.type === 'expense' && t.who === 'husband').reduce((s, t) => s + t.amount, 0);
  const wExp = transactions.filter(t => t.type === 'expense' && t.who === 'wife').reduce((s, t) => s + t.amount, 0);

  const totalExpWho = hExp + wExp;
  const hRatio = totalExpWho ? (hExp / totalExpWho) * 100 : 50;
  const wRatio = totalExpWho ? (wExp / totalExpWho) * 100 : 50;

  // 자산은 applyTransactionToAssets에서 이미 실시간 반영되므로 별도 계산 불필요
  const totalAssets = assets.filter(a => a.id !== 'loan').reduce((s, a) => s + a.amount, 0);
  const loanAsset = assets.find(a => a.id === 'loan');
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
        <div className="mb-6 p-5 rounded-[28px] bg-gray-50/60 border border-gray-100 flex justify-between items-end">
          <div>
            <div className="text-[12px] text-[var(--text-muted)] font-bold mb-1 opacity-80">총 자산</div>
            <div className="text-[26px] font-extrabold text-[var(--foreground)] tracking-tight leading-none">
              {fmt(totalAssets)}<span className="text-[15px] font-bold ml-0.5">원</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[var(--text-muted)] font-bold mb-0.5 opacity-60">순자산 (자산-대출)</div>
            <div className="text-[14px] font-extrabold text-[var(--foreground)] opacity-70">
              {fmt(totalAssets - (loanAsset?.amount || 0))}원
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-7 w-full">
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

        <div className="bg-white rounded-[24px] p-5 border border-[var(--border)] shadow-sm w-full">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[14px] font-bold text-[var(--foreground)]">누가 더 많이 썼을까?</span>
            <span className="text-[20px] select-none">💑</span>
          </div>
          <div className="flex justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[16px]">👨</div>
              <div>
                <div className="text-[11px] text-[var(--text-muted)] font-medium mb-0.5">남편</div>
                <div className="text-[14px] font-bold text-[#3182f6]">{fmt(hExp)}원</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[16px]">👩</div>
              <div>
                <div className="text-[11px] text-[var(--text-muted)] font-medium mb-0.5">아내</div>
                <div className="text-[14px] font-bold text-[#c759d6]">{fmt(wExp)}원</div>
              </div>
            </div>
          </div>
          <div className="h-3.5 w-full bg-gray-100 rounded-full flex overflow-hidden shadow-inner p-0.5 gap-0.5">
            <div className="h-full bg-[#3182f6] rounded-full transition-all duration-1000 ease-out" style={{ width: `${hRatio}%` }}></div>
            <div className="h-full bg-[#c759d6] rounded-full transition-all duration-1000 ease-out" style={{ width: `${wRatio}%` }}></div>
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
  const [currentDate, setCurrentDate] = useState(() => {
    const dates = transactions.map(t => t.date).sort();
    return dates.length > 0 ? new Date(dates[dates.length - 1]) : new Date();
  });
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
    else dayMap[t.date].exp += t.amount;
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
  const [currentDate, setCurrentDate] = useState(() => {
    const dates = transactions.map(t => t.date).sort();
    return dates.length > 0 ? new Date(dates[dates.length - 1]) : new Date();
  });

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
        <h3 className="text-[15px] font-extrabold text-[var(--foreground)] mb-4 ml-1 border-b border-[var(--border)] pb-3">항목별 상세</h3>
        {rows.map((row, i) => (
          <div key={row.id} className={`flex items-center gap-4 py-3.5 ${i < rows.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
            <CatIcon cat={row} size={42} />
            <div className="flex-1">
              <div className="flex justify-between mb-1.5">
                <span className="text-[14px] font-bold text-[var(--foreground)]">{row.id}</span>
                <span className={`text-[14px] font-bold ${mode === 'expense' ? 'text-[var(--foreground)]' : 'text-[var(--primary)]'}`}>{fmt(row.amount)}원</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length], width: `${row.pct}%` }} />
              </div>
            </div>
            <span className="text-[13px] font-bold text-[var(--text-muted)] w-10 text-right">{row.pct.toFixed(0)}%</span>
          </div>
        ))}
        {rows.length === 0 && <div className="text-center py-6 text-gray-400 text-sm">내역이 없습니다.</div>}
      </div>
    </div>
  );
}

export function FixedScreen({ onApply, showAddFixed, onCloseAddFixed }: { onApply: (tx: Transaction) => void, showAddFixed?: boolean, onCloseAddFixed?: () => void }) {
  const [items, setItems] = useState(FIXED_EXPENSES_DEFAULT);
  
  useEffect(() => {
    const saved = localStorage.getItem('budget_fixed');
    if (saved) setItems(JSON.parse(saved));
  }, []);
  const [applied, setApplied] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const [newType, setNewType] = useState('expense');
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const activeTotal = items.filter((i: any) => i.active).reduce((s: number, i: any) => s + i.amount, 0);

  function persist(next: typeof items) { setItems(next); localStorage.setItem('budget_fixed', JSON.stringify(next)); }
  function toggle(id: number) { persist(items.map((i: any) => i.id === id ? { ...i, active: !i.active } : i)); }
  function remove(id: number) { if (confirm('이 고정비 항목을 삭제할까요?')) persist(items.filter((i: any) => i.id !== id)); }
  function startEdit(item: any) { setEditIdx(item.id); setEditLabel(item.label); setEditAmount(String(item.amount)); }
  function saveEdit() {
    if (editIdx === null) return;
    persist(items.map((i: any) => i.id === editIdx ? { ...i, label: editLabel, amount: parseInt(editAmount) || 0 } : i));
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
      icon: catObj.icon,
      bg: catObj.bg,
      fg: catObj.fg,
      active: true,
    };
    persist([...items, newItem]);
    setNewLabel(''); setNewAmount(''); setNewCategory(''); setNewType('expense');
    onCloseAddFixed?.();
  }
  function apply() {
    items.filter((i: any) => i.active).forEach((item: any) => {
      onApply({
        type: item.type || 'expense', category: item.category, amount: item.amount,
        who: 'shared', payment: '계좌이체', memo: item.label, date: new Date().toISOString().slice(0, 10), id: Date.now() + item.id + ""
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
            <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="금액" className="w-full p-4 rounded-xl bg-gray-50 mb-3 outline-none font-medium" />
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
                    <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} placeholder="금액" className="flex-1 text-[14px] font-bold p-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50" />
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
                      <div className="text-[11px] text-gray-400">[{item.type === 'transfer' ? '이체' : '지출'}] {item.category} · 매월 자동</div>
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
              <button key={v} onClick={() => { setType(v); if (!initialTx || initialTx.type !== v) { setCat(''); } }}
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

          <div className="flex gap-2 flex-wrap mb-6">
            {PAYMENTS.map(p => (
              <button key={p} onClick={() => setPay(p)}
                className={`px-4 py-2 rounded-full font-bold text-[13px] transition-all border ${payment === p ? 'border-[var(--foreground)] bg-[var(--foreground)] text-white shadow-md' : 'border-gray-200 bg-white text-[var(--text-muted)]'}`}>
                {p}
              </button>
            ))}
          </div>

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

