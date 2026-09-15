import { memo } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

const ReusableDeleteConfirmModal = memo(({ isOpen, onClose, onConfirm, title, desc }: any) => {  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <Trash2 size={28} />
          </div>
          <h3 className="font-bold text-xl text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-600 mb-4">{desc}</p>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-left mb-6">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Penghapusan permanen akan dilakukan otomatis dalam <strong>30 hari</strong>. Kamu dapat memulihkannya dari Lobby Sampah sebelum waktu tersebut.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">Batal</button>
            <button onClick={onConfirm} className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl">Ya, Hapus</button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReusableDeleteConfirmModal;
