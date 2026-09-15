import { useState, useEffect, useCallback } from 'react';

// 1. Impor Data Bawaan (Template)
import { spldvTemplateUjian } from './materi/ujian/spldvUjianData';
import { spldvTemplateLatihan } from './materi/latihan/spldvLatihanData';

// 2. Impor Halaman dan Dasbor
import LoginPage from './auth/LoginPage';
import AdminDashboard from './dashboard/AdminDashboard'; 
import TeacherServerLobby from './dashboard/TeacherServerLobby'; 
import TeacherDashboard from './dashboard/TeacherDashboard';
import StudentDashboard from './dashboard/StudentDashboard';

// 3. Impor Modal Peringatan Sistem
import LogoutConfirmModal from './components/LogoutConfirmModal';
import SingleDeviceConflictModal from './components/SingleDeviceConflictModal';

// --- DATA AWAL SISTEM ---[cite: 14]
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
  admin: {
    "admin_utama": { id: "a1", pass: "admin123" }
  },
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

const App = () => {
  // --- PENGELOLAAN MEMORI (STATE & LOCALSTORAGE) ---[cite: 14]
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
    const s = localStorage.getItem('scool_lat_v3');
    return s ? JSON.parse(s) : spldvTemplateLatihan;
  });

  const [schedules, setSchedules] = useState(() => {
    const s = localStorage.getItem('scool_schedules');
    return s ? JSON.parse(s) : [
      { id: 'sch_1', day: 'Senin', time: '08:00 - 09:30', subject: 'Matematika', teacher: 'Bpk. Budi Santoso', targetClass: 'Kelas 8A' },
      { id: 'sch_2', day: 'Senin', time: '10:00 - 11:30', subject: 'Matematika', teacher: 'Bpk. Budi Santoso', targetClass: 'Kelas 8B' },
    ];
  });

  const [events, setEvents] = useState(() => {
    const s = localStorage.getItem('scool_events');
    return s ? JSON.parse(s) : [
      { id: 'ev_1', date: '2026-09-20', title: 'Ujian Tengah Semester (UTS)', description: 'Persiapan soal dan pengawasan ujian serentak.', target: 'Semua (Guru & Murid)' },
    ];
  });

  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).substr(2, 9)); 

  // --- SINKRONISASI DATA KE BROWSER ---[cite: 14]
  useEffect(() => { localStorage.setItem('scool_u', JSON.stringify(usersDb)); }, [usersDb]);
  useEffect(() => { localStorage.setItem('scool_c', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem('scool_m', JSON.stringify(materiList)); }, [materiList]);
  useEffect(() => { localStorage.setItem('scool_lat_v3', JSON.stringify(latihanList)); }, [latihanList]);
  useEffect(() => { localStorage.setItem('scool_lkpd_lengkap', JSON.stringify(lkpdList)); }, [lkpdList]);
  useEffect(() => { localStorage.setItem('scool_ujn_db', JSON.stringify(ujianDb)); }, [ujianDb]);
  useEffect(() => { localStorage.setItem('scool_schedules', JSON.stringify(schedules)); }, [schedules]);
  useEffect(() => { localStorage.setItem('scool_events', JSON.stringify(events)); }, [events]);

  // Keamanan Multi-perangkat[cite: 14]
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (user && user.role === 'siswa' && e.key === `scool_session_${user.id}`) {
        if (e.newValue !== sessionId) setShowConflictModal(true);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user, sessionId]);

  // Pemulihan Sesi Login[cite: 14]
  useEffect(() => {
    const s = localStorage.getItem('scool_sess');
    if (s) { try { setUser(JSON.parse(s)); } catch(e){} }
  }, []);

  // --- FUNGSI-FUNGSI UTAMA ---[cite: 14]
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

  // --- PENGATURAN HALAMAN (ROUTING) ---[cite: 14]
  
  // Jika Belum Login
  if (!user) return <LoginPage onLogin={handleLogin} usersDb={usersDb} />;
  
  // Rute Admin
  if (user.role === 'admin') {
    return (
      <>
        <AdminDashboard user={user} onLogout={() => setShowLogoutModal(true)} schedules={schedules} setSchedules={setSchedules} events={events} setEvents={setEvents} />
        <LogoutConfirmModal isOpen={showLogoutModal} onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />
      </>
    );
  }

  // Rute Guru (Berada di Lobi)
  if (user.role === 'guru' && !selectedServerId) {
    return (
      <>
        <TeacherServerLobby user={user} classes={classes} onSelectServer={setSelectedServerId} onLogout={() => setShowLogoutModal(true)} onAddClass={(c:any)=>setClasses((p:any)=>[...p,c])} onArchiveClass={(id:string)=>setClasses((p:any)=>p.map((c:any)=>c.id===id?{...c, isArchived:true}:c))} onRestoreClass={(id:string)=>setClasses((p:any)=>p.map((c:any)=>c.id===id?{...c, isArchived:false}:c))} />
        <LogoutConfirmModal isOpen={showLogoutModal} onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />
      </>
    );
  }

  // Kelas yang sedang aktif
  const selectedServer = classes.find((c: any) => c.id === selectedServerId);

  // Rute Utama (Dasbor Siswa & Guru di dalam server kelas)
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
