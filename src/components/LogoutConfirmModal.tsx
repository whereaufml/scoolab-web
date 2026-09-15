import { memo } from 'react';
import { LogOut } from 'lucide-react';

const LogoutConfirmModal = memo(({ isOpen, onConfirm, onCancel }: any) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut size={28} />
        </div>
        <h3 className="font-bold text-xl text-slate-900 mb-2">Keluar Akun?</h3>
        <p className="text-sm text-slate-600 mb-6">Apakah kamu yakin ingin keluar dari aplikasi pembelajaran ini?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">Batal</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">Ya, Keluar</button>
        </div>
      </div>
    </div>
  );
});

export default LogoutConfirmModal;
