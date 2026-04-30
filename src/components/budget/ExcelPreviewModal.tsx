import React from 'react';
import { Transaction } from './Constants';
import { CheckCircle2 } from 'lucide-react';

export function ExcelPreviewModal({ 
  parsedData, 
  onConfirm, 
  onCancel,
  isUploading,
  existingTxs = []
}: { 
  parsedData: Omit<Transaction, 'id'>[]; 
  onConfirm: () => void; 
  onCancel: () => void;
  isUploading: boolean;
  existingTxs?: Transaction[];
}) {
  const incomeCount = parsedData.filter(d => d.type === 'income').length;
  const expenseCount = parsedData.filter(d => d.type === 'expense').length;
  const totalIncome = parsedData.filter(d => d.type === 'income').reduce((a,b)=>a+b.amount,0);
  const totalExpense = parsedData.filter(d => d.type === 'expense').reduce((a,b)=>a+b.amount,0);

  // 중복 가능성 체크 (날짜와 금액이 같은 내역이 이미 있는지 확인)
  const duplicateCount = parsedData.filter(p => 
    existingTxs.some(e => e.date === p.date && e.amount === p.amount)
  ).length;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[340px] overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease-out]">
        <div className="p-6 pb-2 text-center relative mt-2">
          <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">엑셀 데이터 발견</h2>
          <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
            업로드된 파일에서<br/>총 <strong>{parsedData.length}건</strong>의 내역을 성공적으로 찾았습니다.
          </p>
        </div>
        
        <div className="p-5 bg-[var(--background)] m-5 rounded-2xl flex flex-col gap-3 border border-[var(--border)]">
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-semibold text-[var(--text-muted)]">수입 ({incomeCount}건)</span>
            <span className="text-[15px] font-bold text-blue-500">+{totalIncome.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-semibold text-[var(--text-muted)]">지출 ({expenseCount}건)</span>
            <span className="text-[15px] font-bold text-red-500">-{totalExpense.toLocaleString()}원</span>
          </div>
          {duplicateCount > 0 && (
            <div className="mt-1 p-2 bg-amber-50 rounded-lg border border-amber-100 flex items-center gap-2">
              <span className="text-[16px]">⚠️</span>
              <span className="text-[11px] text-amber-700 font-bold leading-tight">
                이미 등록된 내역과 날짜/금액이 겹치는 항목이 {duplicateCount}건 있어요. 중복에 주의하세요!
              </span>
            </div>
          )}
        </div>

        <div className="p-5 pt-0 grid grid-cols-2 gap-3 mt-1">
          <button 
            disabled={isUploading}
            onClick={onCancel}
            className="py-3.5 rounded-xl text-sm font-bold bg-[#f2f4f6] text-[#4e5968] hover:bg-[#e5e8eb] transition-colors disabled:opacity-50"
          >
            취소하기
          </button>
          <button 
            disabled={isUploading}
            onClick={onConfirm}
            className="py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity shadow-lg shadow-[var(--primary)]/30 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'var(--primary-gradient)' }}
          >
            {isUploading ? '저장 중...' : '확인 (저장)'}
          </button>
        </div>
      </div>
    </div>
  );
}
