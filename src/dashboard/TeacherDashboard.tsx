import { useState } from 'react';
import { Users, FolderOpen, BarChart2 } from 'lucide-react';
import { DashboardLayout, DashboardCard } from '../portal_pembelajaran_scoolab';
import DataSiswaModule from '../users/DataSiswaModule';
import MateriModule from '../materi/MateriModule';

const TeacherDashboard = ({ 
  user, activeServer, onChangeServer, onLogout, usersDb, 
  materiData, setMateriData, lkpdDb, setLkpdDb, 
  latihanDb, setLatihanDb, ujianDb, setUjianDb, onChangePassword 
}: any) => {
  const [currentView, setCurrentView] = useState('main'); 
  const [activeMateriId, setActiveMateriId] = useState<any>(null);

  return (
    <DashboardLayout user={user} activeServer={activeServer} onChangeServer={onChangeServer} onLogout={onLogout} onBack={currentView !== 'main' ? () => {setCurrentView('main'); setActiveMateriId(null);} : null} onChangePassword={onChangePassword}>
      {currentView === 'main' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DashboardCard title="Data Siswa" desc={`Siswa terdaftar (${activeServer?.studentCount})`} icon={Users} color="bg-blue-50 border border-blue-100 text-blue-600" onClick={() => setCurrentView('data_siswa')} />
          <DashboardCard title="Materi Pembelajaran" desc="Modul, LKPD, Asesmen" icon={FolderOpen} color="bg-emerald-50 border border-emerald-100 text-emerald-600" onClick={() => setCurrentView('materi_list')} />
          <DashboardCard title="Evaluasi & Nilai" desc="Rekap analisis nilai siswa" icon={BarChart2} color="bg-rose-50 border border-rose-100 text-rose-600" onClick={() => setCurrentView('evaluasi')} />
        </div>
      )}
      {currentView === 'data_siswa' && <DataSiswaModule classId={activeServer.id} usersDb={usersDb} onBack={() => setCurrentView('main')} />}
      {currentView.includes('materi') && (
        <MateriModule 
          role="guru" 
          classId={activeServer.id} 
          materiData={materiData} 
          lkpdDb={lkpdDb} 
          setLkpdDb={setLkpdDb} 
          latihanDb={latihanDb} 
          setLatihanDb={setLatihanDb}
          ujianDb={ujianDb} 
          setUjianDb={setUjianDb} 
          user={user}
          onAddMateri={(m: any) => setMateriData((p: any) => [...p, m])} 
          onUpdateMateri={(id: string, upd: any) => setMateriData((p: any) => p.map((m: any) => m.id === id ? { ...m, ...upd } : m))} 
          activeMateriId={activeMateriId} 
          onOpenMateriDetail={(id: string) => { setActiveMateriId(id); setCurrentView('materi_detail'); }} 
          onBack={() => { setCurrentView('materi_list'); setActiveMateriId(null); }} 
        />
      )}
    </DashboardLayout>
  );
};

export default TeacherDashboard;
