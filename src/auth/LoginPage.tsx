import React, { useState, useEffect, memo } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, Calculator, Sigma } from 'lucide-react';

// --- Definisi Tipe Data ---
export interface UserRecord {
  id: string;
  pass: string;
  classId?: string;
}

export interface UsersDb {
  siswa: Record<string, UserRecord>;
  guru: Record<string, UserRecord>;
}

export interface UserSession {
  name: string;
  role: 'siswa' | 'guru' | 'admin' ;
  id: string;
  classId?: string;
}

interface LoginFormProps {
  role: 'siswa' | 'guru'  | 'admin';
  onLogin: (userData: UserSession) => void;
  usersDb: UsersDb;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, onLogin, usersDb }) => {
  const [name, setName] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [errors, setErrors] = useState<{form?: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { setName(''); setPassword(''); setErrors({}); }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password) return setErrors({ form: 'Semua kolom wajib diisi.' });
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const dbRole = usersDb[role];
      const userRecord = dbRole[name.trim()];
      
      if (userRecord && userRecord.pass === password) {
        onLogin({ name: name.trim(), role, id: userRecord.id, classId: userRecord.classId });
      } else { 
        setErrors({ form: 'Nama atau sandi yang dimasukkan salah.' }); 
      }
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-6">
      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl flex gap-2 border border-red-200">
          <AlertCircle size={18} />{errors.form}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Pengguna</label>
        <input 
          type="text" 
          value={name} 
          onChange={e=>setName(e.target.value)} 
          placeholder={role === 'siswa' ? "Contoh: Siswa 1" : "Contoh: Guru 1"} 
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm" 
        />
      </div>
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Kata Sandi</label>
        <input 
          type={showPassword ? "text" : "password"} 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          placeholder="••••••••" 
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm" 
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)} 
          className="absolute right-3 top-9 text-slate-400 focus:outline-none"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex justify-center items-center gap-2 mt-6"
      >
        {isLoading ? <><Loader2 size={18} className="animate-spin" /> Memuat...</> : 'Masuk'}
      </button>
    </form>
  );
};

interface LoginPageProps {
  onLogin: (userData: UserSession) => void;
  usersDb: UsersDb;
}

const LoginPage: React.FC<LoginPageProps> = memo(({ onLogin, usersDb }) => {
  const [role, setRole] = useState<'siswa' | 'guru'>('siswa');
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-white/10 transform -rotate-12"><Calculator size={120} /></div>
        <div className="absolute bottom-20 right-20 text-white/10 transform rotate-12"><Sigma size={160} /></div>
        <div className="relative z-10 max-w-md text-center text-white">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8"><Calculator size={48} /></div>
          <h1 className="text-4xl font-bold mb-4">Belajar Matematika Jadi Menyenangkan</h1>
          <p className="text-blue-100 text-lg">Platform interaktif untuk memahami Sistem Persamaan Linear Dua Variabel dengan mudah.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-100">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Calculator size={18} className="text-white" /></div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">SCOOLMATE</h1>
            </div>
            <p className="text-slate-500 text-sm">Portal Pembelajaran Interaktif</p>
          </div>
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6 relative">
            <button onClick={() => setRole('siswa')} className={`flex-1 py-2 text-sm font-medium z-10 ${role==='siswa'?'text-blue-700':'text-slate-500'}`}>Siswa</button>
            <button onClick={() => setRole('guru')} className={`flex-1 py-2 text-sm font-medium z-10 ${role==='guru'?'text-blue-700':'text-slate-500'}`}>Guru</button>
            <div className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300" style={{ transform: role === 'siswa' ? 'translateX(0)' : 'translateX(100%)' }} />
          </div>
          <LoginForm role={role} onLogin={onLogin} usersDb={usersDb} />
        </div>
      </div>
    </div>
  );
});

export default LoginPage;
