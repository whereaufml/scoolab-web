import { useState, memo } from 'react';
import { Calendar, Clock, FolderOpen, BarChart2, ShieldAlert } from 'lucide-react';

// Impor komponen dari folder components
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';

// Impor modul materi dan penilaian
import MateriModule from '../materi/MateriModule';
import EvaluationModule from '../penilaian/EvaluationModule';

const StudentDashboard = memo(({ user, activeServer, onLogout, materiData, lkpdDb, setLkpdDb, latihanDb, setLatihanDb, ujianDb, setUjianDb, onChangePassword }: any) => {
  const [currentView, setCurrentView] = useState('main'); 
  const [activeMateriId, setActiveMateriId] = useState<any>(null);

  // Peringatan jika kelas diarsipkan
  if (!activeServer || activeServer.isArchived) return (
    <DashboardLayout user={user} onLogout={onLogout} onChangePassword={onChangePassword}>
      <div className="text-center py-20">
        <ShieldAlert size={40} className="mx-auto text-red-500 mb-4"/>
        Akses Kelas Dinonaktifkan
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout user={user} activeServer={activeServer} onLogout={onLogout} onBack={currentView !== 'main' ? () => {setCurrentView('main'); setActiveMateriId(null);} : null} onChangePassword={onChangePassword}>
      {currentView === 'main' && (
        <div className="space-y-6 max-w-3xl">
          
          {/* KOTAK JADWAL SISWA (Nuansa Ungu Muda)[cite: 14] */}
          <div className="bg-purple-100 border border-purple-200 p-5 md:p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center gap-4 animate-in fade-in">
            <div className="w-14 h-14 bg-purple-200 text-purple-700 rounded-2xl flex items-center justify-center shrink-0">
              <Calendar size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-purple-900 mb-3 md:mb-2">Jadwal Hari Ini: Senin, 14 September 2026</h3>
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-purple-800 font-medium">
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl border border-purple-200">
                  <Clock size={16} className="text-purple-600 shrink-0" /> 
                  <span>08:00 - 09:30 | Matematika</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl border border-purple-200">
                  <Clock size={16} className="text-purple-600 shrink-0" /> 
                  <span>10:00 - 11:30 | B. Indonesia</span>
                </div>
              </div>
            </div>
            <button className="mt-2 md:mt-0 px-4 py-3 md:py-2.5 bg-purple-200/50 text-purple-500 text-sm font-bold rounded-xl md:ml-auto w-full md:w-auto text-center cursor-not-allowed border border-purple-300">
              Detail Jadwal
            </button>
          </div>

          {/* Grid Menu Utama Siswa[cite: 14] */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DashboardCard title="Materi Pembelajaran" desc="LKPD, Latihan Soal, Asesmen" icon={FolderOpen} color="bg-blue-50 border border-blue-100 text-blue-600" onClick={() => setCurrentView('materi_list')} />
            <DashboardCard title="Evaluasi Akhir" desc="Lihat rekap nilai belajarmu" icon={BarChart2} color="bg-rose-50 border border-rose-100 text-rose-600" onClick={() => setCurrentView('evaluasi')} />
          </div>
        </div>
      )}
      
      {/* Menampilkan Modul Materi[cite: 14] */}
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

      {/* Menampilkan Modul Evaluasi Marun untuk Siswa[cite: 14] */}
      {currentView === 'evaluasi' && (
        <EvaluationModule role="siswa" userData={user} />
      )}
    </DashboardLayout>
  );
});

export default StudentDashboard;
