"use client";
import React, { useState, useEffect } from 'react';
import { HomeScreen, HistoryScreen, StatsScreen, FixedScreen, TxFormModal, AssetItem } from '@/components/budget/Screens';
import { Transaction } from '@/components/budget/Constants';
import { Home, CalendarDays, ScrollText, PieChart, ArrowLeftRight, Plus } from 'lucide-react';
import { parseExcel } from '@/utils/excelParser';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, doc } from 'firebase/firestore';
import { ExcelPreviewModal } from '@/components/budget/ExcelPreviewModal';

const DEFAULT_ASSETS: AssetItem[] = [
  { id: 'bank', label: '계좌 자산', emoji: '🏦', amount: 0 },
  { id: 'cash', label: '현금 자산', emoji: '💵', amount: 0 },
  { id: 'savings', label: '예적금', emoji: '🏧', amount: 0 },
  { id: 'invest', label: '투자 자산', emoji: '📈', amount: 0 },
  { id: 'realestate', label: '부동산', emoji: '🏢', amount: 0 },
  { id: 'loan', label: '대출', emoji: '🏠', amount: 0 },
];

export default function Page() {
  const [tab, setTab] = useState('home');
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddFixed, setShowAddFixed] = useState(false);

  // Assets State (localStorage persistence)
  const [assets, setAssets] = useState<AssetItem[]>(DEFAULT_ASSETS);

  useEffect(() => {
    const saved = localStorage.getItem('budget_assets');
    if (saved) {
      const parsed = JSON.parse(saved) as AssetItem[];
      // 새로운 기본 항목이 추가되었을 경우를 대비해 병합
      const merged = DEFAULT_ASSETS.map(def => {
        const found = parsed.find(p => p.id === def.id);
        return found ? { ...def, amount: found.amount } : def;
      });
      setAssets(merged);
    }
  }, []);

  const handleAssetsChange = (newAssets: AssetItem[]) => {
    setAssets(newAssets);
    localStorage.setItem('budget_assets', JSON.stringify(newAssets));
  };

  // Excel Preview State
  const [previewData, setPreviewData] = useState<Omit<Transaction, 'id'>[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Helper: Apply Transaction to Assets
  const applyTransactionToAssets = (tx: Transaction | Omit<Transaction, 'id'>, mode: 'add' | 'delete', currentAssets: AssetItem[]) => {
    const next = [...currentAssets.map(a => ({ ...a }))];
    const factor = mode === 'add' ? 1 : -1;

    const updateAmount = (id: string, delta: number) => {
      const idx = next.findIndex(a => a.id === id);
      if (idx !== -1) {
        next[idx].amount += delta;
      }
    };

    if (tx.type === 'income') {
      updateAmount('bank', tx.amount * factor);
    } else if (tx.type === 'expense') {
      // User requested: all expenses from 'bank'
      updateAmount('bank', -tx.amount * factor);
    } else if (tx.type === 'transfer') {
      // 출처 판단: 메모에 '예적금'이 있으면 예적금에서 차감, 아니면 계좌에서 차감
      const isFromSavings = tx.memo?.includes('예적금');
      const sourceId = isFromSavings ? 'savings' : 'bank';
      
      updateAmount(sourceId, -tx.amount * factor);
      
      if (tx.category === '저축') updateAmount('savings', tx.amount * factor);
      if (tx.category === '투자') updateAmount('invest', tx.amount * factor);
      if (tx.category === '부동산') updateAmount('realestate', tx.amount * factor);
    }
    return next;
  };

  const txsCol = collection(db, 'transactions');

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = await getDocs(txsCol);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as unknown as Transaction));
        setTxs(data);
      } catch (e) {
        console.error(e);
        alert('파이어베이스 연결 권한 에러! (Network 탭 또는 Firestore 규칙을 확인하세요)');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSave(tx: Transaction) {
    if (editTarget) {
      try {
        // 1. Undo old effect
        let nextAssets = applyTransactionToAssets(editTarget, 'delete', assets);
        // 2. Apply new effect
        nextAssets = applyTransactionToAssets(tx, 'add', nextAssets);

        const ref = doc(db, 'transactions', tx.id);
        const { id, ...data } = tx;
        await updateDoc(ref, data);
        
        setTxs(prev => prev.map(t => t.id === id ? tx : t));
        handleAssetsChange(nextAssets);
      } catch (e) {
        alert('수정 권한 없음!');
      }
    } else {
      try {
        const { id, ...data } = tx;
        const docRef = await addDoc(txsCol, data);
        const newTx = { ...data, id: docRef.id as any };
        
        setTxs(prev => [...prev, newTx]);
        
        // Apply new effect
        const nextAssets = applyTransactionToAssets(newTx, 'add', assets);
        handleAssetsChange(nextAssets);
      } catch (e) {
        alert('저장 권한이 없습니다! DB 규칙을 확인하세요.');
      }
    }
    setShowAdd(false);
    setEditTarget(null);
  }

  async function handleDelete(id: string) {
    const target = txs.find(t => t.id === id);
    try {
      await deleteDoc(doc(db, 'transactions', id));
      
      if (target) {
        const nextAssets = applyTransactionToAssets(target, 'delete', assets);
        handleAssetsChange(nextAssets);
      }
      
      setTxs(prev => prev.filter(t => t.id !== id));
      setShowAdd(false);
      setEditTarget(null);
    } catch (e: any) {
      console.error(e);
      alert('삭제 에러: ' + (e.message || '권한 없음'));
    }
  }

  async function handleExcelSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseExcel(file);
      setPreviewData(parsed);
    } catch (err) {
      alert('엑셀 읽기 오류. 양식을 확인하세요.');
    }
    e.target.value = '';
  }

  async function confirmExcelUpload() {
    if (!previewData) return;
    setIsUploading(true);
    try {
      const batch = writeBatch(db);
      const inserted: Transaction[] = [];
      let nextAssets = [...assets.map(a => ({ ...a }))];

      previewData.forEach(item => {
        const newRef = doc(txsCol);
        batch.set(newRef, item);
        const newTx = { ...item, id: newRef.id as any };
        inserted.push(newTx);
        
        // Update assets for each item
        nextAssets = applyTransactionToAssets(newTx, 'add', nextAssets);
      });

      await batch.commit();
      setTxs(prev => [...prev, ...inserted]);
      handleAssetsChange(nextAssets);
      setPreviewData(null);
    } catch (err) {
      console.error(err);
      alert('엑셀 데이터를 DB에 적재하는 중 오류 발생');
    } finally {
      setIsUploading(false);
    }
  }

  const handleRowClick = (tx: Transaction) => {
    setEditTarget(tx);
    setShowAdd(true);
  };

  const renderScreen = () => {
    switch (tab) {
      case 'home': return <HomeScreen transactions={txs} onUpload={handleExcelSelect} assets={assets} onAssetsChange={handleAssetsChange} onDelete={handleDelete} />;
      case 'history': return <HistoryScreen transactions={txs} onRowClick={handleRowClick} onDateSelect={setSelectedDate} onDelete={handleDelete} />;
      case 'stats': return <StatsScreen transactions={txs} />;
      case 'fixed': return <FixedScreen onApply={handleSave} showAddFixed={showAddFixed} onCloseAddFixed={() => setShowAddFixed(false)} />;
      default: return <HomeScreen transactions={txs} onUpload={handleExcelSelect} assets={assets} onAssetsChange={handleAssetsChange} onDelete={handleDelete} />;
    }
  };

  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'history', label: '내역', icon: CalendarDays },
    { id: 'stats', label: '통계', icon: PieChart },
    { id: 'fixed', label: '고정비', icon: ArrowLeftRight },
  ];

  return (
    <div className="min-h-screen sm:py-6 bg-[var(--secondary)] flex items-center justify-center font-['MaruBuri'] text-[var(--foreground)]">

      {/* Responsive Premium Container */}
      <div className="w-full h-[100dvh] sm:h-[90vh] sm:max-h-[950px] sm:max-w-[440px] bg-[var(--background)] sm:rounded-[36px] sm:shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:border sm:border-gray-200 overflow-hidden flex flex-col relative transition-all duration-300 group">

        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-[200] flex items-center justify-center flex-col gap-4 animate-in fade-in transition-all">
            <div className="w-12 h-12 border-4 border-gray-200 border-b-[var(--primary)] rounded-full animate-spin"></div>
            <span className="text-[15px] font-bold text-[var(--primary)]">데이터 준비 중...</span>
          </div>
        )}

        {/* Main View Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto no-scrollbar flex flex-col relative bg-[var(--background)]">
          {renderScreen()}
        </div>

        {/* Floating Add Button - only on history & fixed */}
        {(tab === 'history' || tab === 'fixed') && (
          <button
            onClick={() => {
              if (tab === 'fixed') { setShowAddFixed(true); }
              else { setShowAdd(true); setEditTarget(null); }
            }}
            className="absolute bottom-[100px] right-5 z-[100] w-[58px] h-[58px] rounded-full text-white shadow-[0_8px_20px_rgba(139,92,246,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            style={{ background: 'var(--primary-gradient)' }}
          >
            <Plus size={30} strokeWidth={2.5} />
          </button>
        )}

        {/* Bottom Glass Navigation */}
        <div className="h-[80px] sm:h-[90px] bg-white/85 backdrop-blur-xl border-t border-[var(--border)] flex justify-around items-start pt-3 pb-6 sm:pb-8 shrink-0 relative z-[90]">
          {tabs.map(t => {
            const active = tab === t.id;
            const IconComp = t.icon;
            return (
              <div
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 w-16 ${active ? 'text-[var(--primary)] -translate-y-1' : 'text-[#A0A5AE] hover:text-[#7A7E85]'}`}
              >
                <IconComp size={24} className="mb-1" strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{t.label}</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* CRUD Modal for Add/Edit/Delete */}
      {showAdd && (
        <TxFormModal
          onClose={() => { setShowAdd(false); setEditTarget(null); }}
          onSave={handleSave}
          onDelete={handleDelete}
          initialTx={editTarget}
          defaultDate={selectedDate || undefined}
        />
      )}

      {/* Confirm Bulk Upload Modal */}
      {previewData && (
        <ExcelPreviewModal
          parsedData={previewData}
          onConfirm={confirmExcelUpload}
          onCancel={() => setPreviewData(null)}
          isUploading={isUploading}
        />
      )}

    </div>
  );
}
