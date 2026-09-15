import { memo } from 'react';
import { ShieldAlert, AlertCircle, Smartphone, LogOut } from 'lucide-react';

const SingleDeviceConflictModal = memo(({ isOpen, username, onKeepSession, onLogout }: any) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Sesi Login Terdeteksi di Perangkat Lain!</h3>
          <p className="text-xs text-slate-500">Akun Siswa <span className="font-bold text-slate-800">@{username}</span> baru saja dimasuki dari perangkat/browser lain.</p>
        </div>
        <div className="mx-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-left">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-1">
            <AlertCircle size={18} className="shrink-0" />
            <span>PERINGATAN KEAMANAN SESI</span>
          </div>
          <p className="text-xs text-red-800 font-medium">Sesuai aturan, akun siswa hanya diperbolehkan aktif pada 1 perangkat. Jika kamu mengizinkan perangkat baru, sesi ini akan dihentikan otomatis.</p>
        </div>
        <div className="p-6 space-y-3">
          <button onClick={onKeepSession} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
            <Smartphone size={18} />Tetap Tinggal (Gunakan Perangkat Ini)
          </button>
          <button onClick={onLogout} className="w-full py-3 px-4 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
            <LogOut size={18} />Izinkan Perangkat Baru & Keluar
          </button>
        </div>
      </div>
    </div>
  );
});

export default SingleDeviceConflictModal;
