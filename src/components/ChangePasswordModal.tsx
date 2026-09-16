import { useState, useEffect, memo } from 'react';
import { Lock, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ChangePasswordModal = memo(({ isOpen, onClose, onSave }: any) => {
  const [oldPass, setOldPass] = useState(''); 
  const [newPass, setNewPass] = useState('');
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { 
    if (isOpen) { 
      setOldPass(''); 
      setNewPass(''); 
      setError(''); 
      setSuccess(false); 
      setIsSubmitting(false);
    } 
  }, [isOpen]);

  if (!isOpen) return null;
  
  // onSave sekarang bisa berupa panggilan ke Supabase (async, butuh waktu lewat jaringan),
  // bukan lagi pengecekan instan ke localStorage. Modal ini dibuat mendukung keduanya:
  // kalau onSave mengembalikan Promise, ditunggu dulu; kalau langsung mengembalikan
  // string/null seperti versi lama, tetap jalan juga.
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return; // cegah klik ganda saat request masih berjalan
    setError('');

    if (!oldPass || !newPass) return setError('Semua kolom wajib diisi');
    if (newPass.length < 6) return setError('Sandi baru minimal 6 karakter');

    setIsSubmitting(true);
    try {
      const err = await Promise.resolve(onSave(oldPass, newPass));
      if (err) {
        setError(err);
      } else {
        setSuccess(true);
        setTimeout(() => onClose(), 1500);
      }
    } catch (caughtErr: any) {
      // Jaga-jaga kalau onSave throw error (misal koneksi Supabase gagal total)
      setError(caughtErr?.message || 'Gagal menyimpan sandi. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Lock size={18} /> Ganti Sandi</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-full p-1"><X size={20} /></button>
        </div>
        {success ? (
          <div className="p-8 text-center animate-in zoom-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} /></div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Berhasil!</h3>
            <p className="text-sm text-slate-500">Sandi kamu telah diperbarui.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5">
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-100"><AlertCircle size={16} />{error}</div>}
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Sandi Lama</label><input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} disabled={isSubmitting} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm disabled:opacity-50" placeholder="Masukkan sandi saat ini" /></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Sandi Baru</label><input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} disabled={isSubmitting} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm disabled:opacity-50" placeholder="Buat sandi baru (min 6 karakter)" /></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl disabled:opacity-50">Batal</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2">
                {isSubmitting ? (<><Loader2 size={16} className="animate-spin" /> Menyimpan...</>) : 'Simpan Sandi'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
});

export default ChangePasswordModal;