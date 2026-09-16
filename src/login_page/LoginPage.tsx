import React, { useState } from 'react';
import { Calculator, AlertCircle, LogIn, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Pastikan path ini sesuai letak file supabaseClient-mu

interface LoginPageProps {
  onLogin: (userData: any) => void;
  // usersDb dihapus karena kita login langsung pakai Supabase
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      return setError('Username dan sandi wajib diisi.');
    }

    setIsLoading(true);
    try {
      // Mencari akun di tabel profiles berdasarkan username dan password
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single(); // single() karena username unik (hanya ada 1)

      if (error || !data) {
        throw new Error('Username atau kata sandi salah.');
      }

      // Berhasil login, kirim data ke App.tsx
      onLogin(data);

    } catch (err: any) {
      setError(err.message || 'Gagal terhubung ke sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <Calculator size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Portal Scoolab</h1>
          <p className="text-slate-500 text-sm mt-1">Silakan masuk menggunakan akunmu</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-3 border border-red-100 animate-in fade-in zoom-in-95">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" placeholder="Masukkan username" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kata Sandi</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" placeholder="Masukkan kata sandi" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
              {isLoading ? 'Memeriksa Data...' : 'Masuk Sekarang'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;