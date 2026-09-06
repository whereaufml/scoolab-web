import { useState, useEffect, useCallback, memo } from 'react';
import { 
  AlertCircle, CheckCircle, LogOut, BarChart2, Calculator, X, ShieldAlert, Smartphone, ArrowLeft, FolderOpen, Trash2, Settings, Lock, AlertTriangle
} from 'lucide-react';

import { spldvTemplateUjian } from './materi/ujian/spldvUjianData';
import MateriModule from './materi/MateriModule';
import TeacherServerLobby from './dashboard/TeacherServerLobby'; 
import LoginPage from './auth/LoginPage';
import TeacherDashboard from './dashboard/TeacherDashboard';
import { spldvTemplateLatihan } from './materi/latihan/spldvLatihanData';


const INITIAL_LKPD = [
  {
    id: "lkpd_01",
    materiId: "mat_1", 
    title: "LKPD 1: Memahami Konsep Dasar SPLDV",
    desc: "Pelajari bentuk umum dan konsep dasar Sistem Persamaan Linear Dua Variabel melalui modul interaktif ini.",
    coverPreset: "math",
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    content: []
  }
];

const INITIAL_CLASSES = [
  { id: 'cls_8a', subject: 'Matematika', name: 'Kelas 8A', year: '2026/2027', isArchived: false, studentCount: 5 },
  { id: 'cls_8b', subject: 'Matematika', name: 'Kelas 8B', year: '2026/2027', isArchived: false, studentCount: 0 }
];

const INITIAL_MATERI = [
  { id: 'mat_1', classId: 'cls_8a', title: 'Bab 1: Konsep Dasar SPLDV', desc: 'Mengenal variabel, konstanta, dan penyelesaian dengan metode grafik.', isDeleted: false, deletedAt: null }
];

const INITIAL_USERS_DB = {
  siswa: { 
    "Siswa 1": { id: "s1", pass: "siswa123", classId: "cls_8a" },
    "Siswa 2": { id: "s2", pass: "siswa123", classId: "cls_8a" },
    "Siswa 3": { id: "s3", pass: "siswa123", classId: "cls_8a" },
    "Siswa 4": { id: "s4", pass: "siswa123", classId: "cls_8a" },
    "Siswa 5": { id: "s5", pass: "siswa123", classId: "cls_8a" }
  },
  guru: { 
    "Guru 1": { id: "g1", pass: "guru123" }
  }
};

const SingleDeviceConflictModal = memo(({ isOpen, username, onKeepSession, onLogout }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><ShieldAlert size={32} /></div>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Sesi Login Terdeteksi di Perangkat Lain!</h3>
          <p className="text-xs text-slate-500">Akun Siswa <span className="font-bold text-slate-800">@{username}</span> baru saja dimasuki dari perangkat/browser lain.</p>
        </div>
        <div className="mx-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-left">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-1"><AlertCircle size={18} className="shrink-0" /><span>PERINGATAN KEAMANAN SESI</span></div>
          <p className="text-xs text-red-800 font-medium">Sesuai aturan, akun siswa hanya diperbolehkan aktif pada 1 perangkat. Jika kamu mengizinkan perangkat baru, sesi ini akan dihentikan otomatis.</p>
        </div>
        <div className="p-6 space-y-3">
          <button onClick={onKeepSession} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"><Smartphone size={18} />Tetap Tinggal (Gunakan Perangkat Ini)</button>
          <button onClick={onLogout} className="w-full py-3 px-4 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"><LogOut size={18} />Izinkan Perangkat Baru & Keluar</button>
        </div>
      </div>
    </div>
  );
});

const ChangePasswordModal = memo(({ isOpen, onClose, onSave }: any) => {
  const [oldPass, setOldPass] = useState(''); const [newPass, setNewPass] = useState('');
  const [error, setError] = useState(''); const [success, setSuccess] = useState(false);

  useEffect(() => { if (isOpen) { setOldPass(''); setNewPass(''); setError(''); setSuccess(false); } }, [isOpen]);

  if (!isOpen) return null;
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!oldPass || !newPass) return setError('Semua kolom wajib diisi');
    if (newPass.length < 4) return setError('Sandi baru minimal 4 karakter');
    const err = onSave(oldPass, newPass);
    if (err) setError(err); else { setSuccess(true); setTimeout(() => onClose(), 1500); }
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
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Sandi Lama</label><input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Masukkan sandi saat ini" /></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Sandi Baru</label><input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Buat sandi baru (min 4 karakter)" /></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">Batal</button>
              <button type="submit" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl">Simpan Sandi</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
});

export const ReusableDeleteConfirmModal = memo(({ isOpen, onClose, onConfirm, title, desc }: any) => {  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm"><Trash2 size={28} /></div>
          <h3 className="font-bold text-xl text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-600 mb-4">{desc}</p>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-left mb-6">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">Penghapusan permanen akan dilakukan otomatis dalam <strong>30 hari</strong>. Kamu dapat memulihkannya dari Lobby Sampah sebelum waktu tersebut.</p>
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

export const DashboardCard = memo(({ icon: Icon, title, desc, color, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}><Icon size={28} /></div>
    <h3 className="font-semibold text-slate-800 text-lg mb-1">{title}</h3>
    <p className="text-slate-500 text-sm">{desc}</p>
  </div>
));

export const DashboardLayout = memo(({ user, activeServer, onChangeServer, onLogout, onBack, onChangePassword, children }: any) => {  
  const [showSettings, setShowSettings] = useState(false);
  return (
  <div className="min-h-screen bg-slate-50">
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && <button onClick={onBack} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"><ArrowLeft size={18} /></button>}
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Calculator size={18} className="text-white" /></div><span className="font-bold text-slate-800 hidden sm:block">SCOOLMATE</span></div>
          {activeServer && <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg hidden md:block border border-blue-100">{activeServer.name}</span>}
        </div>
        <div className="flex items-center gap-3">
          {user.role === 'guru' && onChangeServer && !onBack && <button onClick={onChangeServer} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"><ArrowLeft size={14} className="inline mr-1"/>Lobby Server</button>}
          <div className="text-right hidden sm:block"><p className="text-sm font-semibold text-slate-800">{user.name}</p><p className="text-xs text-blue-600 capitalize">{user.role}</p></div>
          <div className="w-10 h-10 bg-blue-100 border border-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold">{user.name.charAt(0).toUpperCase()}</div>
          <button onClick={() => setShowSettings(true)} className="p-2 text-slate-400 hover:text-blue-600 rounded-xl transition-colors"><Settings size={20} /></button>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><LogOut size={20} /></button>
        </div>
      </div>
    </header>
    <main className="max-w-6xl mx-auto px-4 py-8 relative">{children}</main>
    <ChangePasswordModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSave={onChangePassword} />
  </div>
  );
});

const StudentDashboard = memo(({ user, activeServer, onLogout, materiData, lkpdDb, setLkpdDb, latihanDb, setLatihanDb, ujianDb, setUjianDb, onChangePassword }: any) => {
  const [currentView, setCurrentView] = useState('main'); 
  const [activeMateriId, setActiveMateriId] = useState<any>(null);

  if (!activeServer || activeServer.isArchived) return <DashboardLayout user={user} onLogout={onLogout} onChangePassword={onChangePassword}><div className="text-center py-20"><ShieldAlert size={40} className="mx-auto text-red-500 mb-4"/>Akses Kelas Dinonaktifkan</div></DashboardLayout>;

  return (
    <DashboardLayout user={user} activeServer={activeServer} onLogout={onLogout} onBack={currentView !== 'main' ? () => {setCurrentView('main'); setActiveMateriId(null);} : null} onChangePassword={onChangePassword}>
      {currentView === 'main' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          <DashboardCard title="Materi Pembelajaran" desc="LKPD, Latihan Soal, Asesmen" icon={FolderOpen} color="bg-blue-50 border border-blue-100 text-blue-600" onClick={() => setCurrentView('materi_list')} />
          <DashboardCard title="Evaluasi Akhir" desc="Lihat rekap nilai belajarmu" icon={BarChart2} color="bg-orange-50 border border-orange-100 text-orange-600" onClick={() => setCurrentView('evaluasi')} />
        </div>
      )}
      {currentView.includes('materi') && (
        <MateriModule 
          role="siswa" 
          classId={activeServer.id} 
          materiData={materiData} 
          lkpdDb={lkpdDb} 
          setLkpdDb={setLkpdDb} 
          latihanDb={latihanDb} 
          setLatihanDb={setLatihanDb}
          ujianDb={ujianDb} 
          setUjianDb={setUjianDb}
          user={user}
          activeMateriId={activeMateriId} 
          onOpenMateriDetail={(id: any) => { setActiveMateriId(id); setCurrentView('materi_detail'); }} 
          onBack={()=>{setCurrentView('materi_list'); setActiveMateriId(null);}} 
        />
      )}
    </DashboardLayout>
  );
});

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

const App = () => {
  const [lkpdList, setLkpdList] = useState(() => { 
    const s = localStorage.getItem('scool_lkpd_lengkap'); 
    return s ? JSON.parse(s) : INITIAL_LKPD; 
  });
  
  const [ujianDb, setUjianDb] = useState<any[]>(() => {
    const s = localStorage.getItem('scool_ujn_db');
    return s ? JSON.parse(s) : [spldvTemplateUjian];
  });

  const [user, setUser] = useState<any>(null);
  const [usersDb, setUsersDb] = useState(() => { const s = localStorage.getItem('scool_u'); return s ? JSON.parse(s) : INITIAL_USERS_DB; });
  const [classes, setClasses] = useState(() => { const s = localStorage.getItem('scool_c'); return s ? JSON.parse(s) : INITIAL_CLASSES; });
  const [materiList, setMateriList] = useState(() => { const s = localStorage.getItem('scool_m'); return s ? JSON.parse(s) : INITIAL_MATERI; });
  const [latihanList, setLatihanList] = useState(() => {
    // UBAH v2 MENJADI v3 DI BAWAH INI
    const s = localStorage.getItem('scool_lat_v3');
    return s ? JSON.parse(s) : spldvTemplateLatihan;
  });

  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).substr(2, 9)); 

  useEffect(() => { localStorage.setItem('scool_u', JSON.stringify(usersDb)); }, [usersDb]);
  useEffect(() => { localStorage.setItem('scool_c', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem('scool_m', JSON.stringify(materiList)); }, [materiList]);
  useEffect(() => { localStorage.setItem('scool_lat_v3', JSON.stringify(latihanList)); }, [latihanList]);
  useEffect(() => { localStorage.setItem('scool_lkpd_lengkap', JSON.stringify(lkpdList)); }, [lkpdList]);
  useEffect(() => { localStorage.setItem('scool_ujn_db', JSON.stringify(ujianDb)); }, [ujianDb]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (user && user.role === 'siswa' && e.key === `scool_session_${user.id}`) {
        if (e.newValue !== sessionId) setShowConflictModal(true);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user, sessionId]);

  useEffect(() => {
    const s = localStorage.getItem('scool_sess');
    if (s) { try { setUser(JSON.parse(s)); } catch(e){} }
  }, []);

  const handleLogin = useCallback((userData: any) => {
    const newSession = Math.random().toString(36).substr(2, 9);
    setSessionId(newSession);
    
    if (userData.role === 'siswa') {
      const activeClass = classes.find((c: any) => c.id === userData.classId) || classes.find((c: any) => !c.isArchived);
      setSelectedServerId(activeClass ? activeClass.id : null);
      localStorage.setItem(`scool_session_${userData.id}`, newSession);
    }
    
    setUser(userData); 
    localStorage.setItem('scool_sess', JSON.stringify(userData));
  }, [classes]);

  const handleLogout = useCallback(() => { 
    setUser(null); 
    setSelectedServerId(null); 
    localStorage.removeItem('scool_sess'); 
    setShowLogoutModal(false);
    setShowConflictModal(false);
  }, []);

  const handleKeepSession = () => {
    if (user) localStorage.setItem(`scool_session_${user.id}`, sessionId);
    setShowConflictModal(false);
  };

  const handleChangePassword = useCallback((oldPass: string, newPass: string) => {
    if (!user) return "Sesi tidak valid.";
    const roleDb = usersDb[user.role];
    const uKey = Object.keys(roleDb).find(k => roleDb[k].id === user.id);
    const uRec = uKey ? roleDb[uKey] : null;
    
    if (!uRec || uRec.pass !== oldPass) return "Sandi lama salah.";

    setUsersDb((prev: any) => ({ ...prev, [user.role]: { ...prev[user.role], [uKey as string]: { ...uRec, pass: newPass } } }));
    return null; 
  }, [user, usersDb]);

  if (!user) return <LoginPage onLogin={handleLogin} usersDb={usersDb} />;
  
  if (user.role === 'guru' && !selectedServerId) {
    return (
      <>
        <TeacherServerLobby user={user} classes={classes} onSelectServer={setSelectedServerId} onLogout={() => setShowLogoutModal(true)} onAddClass={(c:any)=>setClasses((p:any)=>[...p,c])} onArchiveClass={(id:string)=>setClasses((p:any)=>p.map((c:any)=>c.id===id?{...c, isArchived:true}:c))} onRestoreClass={(id:string)=>setClasses((p:any)=>p.map((c:any)=>c.id===id?{...c, isArchived:false}:c))} />
        <LogoutConfirmModal isOpen={showLogoutModal} onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />
      </>
    );
  }

  const selectedServer = classes.find((c: any) => c.id === selectedServerId);

  return (
    <>
      {user.role === 'siswa' ? (
        <StudentDashboard user={user} activeServer={selectedServer} onLogout={() => setShowLogoutModal(true)} materiData={materiList} lkpdDb={lkpdList} setLkpdDb={setLkpdList} latihanDb={latihanList} setLatihanDb={setLatihanList} ujianDb={ujianDb} setUjianDb={setUjianDb} onChangePassword={handleChangePassword} />
      ) : (
        <TeacherDashboard user={user} activeServer={selectedServer} onChangeServer={() => setSelectedServerId(null)} onLogout={() => setShowLogoutModal(true)} usersDb={usersDb} materiData={materiList} setMateriData={setMateriList} lkpdDb={lkpdList} setLkpdDb={setLkpdList} latihanDb={latihanList} setLatihanDb={setLatihanList} ujianDb={ujianDb} setUjianDb={setUjianDb} onChangePassword={handleChangePassword} />
      )}
      
      <LogoutConfirmModal isOpen={showLogoutModal} onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />
      <SingleDeviceConflictModal isOpen={showConflictModal} username={user.name} onKeepSession={handleKeepSession} onLogout={handleLogout} />
    </>
  );
}

export default App;