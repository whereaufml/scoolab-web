import { useState, useEffect } from 'react';
import { Users, FolderOpen, BarChart2 } from 'lucide-react';
import DashboardLayout from "../components/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import DataSiswaModule from '../users/DataSiswaModule';
import MateriModule from '../materi/MateriModule';
// Memanggil komponen Evaluasi (Pastikan letak foldernya benar, mundur satu folder lalu masuk ke penilaian)
import EvaluationModule from '../penilaian/EvaluationModule';
import { supabase } from '../supabaseClient';

// Mengambil kode kelas seperti "8A" dari nama server guru, mis. "Kelas 8A" -> "8A".
// Server guru (subject/name/year) itu konsep terpisah dari tabel `classes` (tingkat+rombel)
// di Supabase, jadi pencocokannya lewat nama tampilan kelas ini.
const extractKelasCode = (namaServer?: string): string | null => {
  if (!namaServer) return null;
  const match = namaServer.match(/\d{1,2}[A-Za-z]/);
  return match ? match[0].toUpperCase() : null;
};

const TeacherDashboard = ({ 
  user, activeServer, onChangeServer, onLogout, 
  materiData, setMateriData, lkpdDb, setLkpdDb, 
  latihanDb, setLatihanDb, ujianDb, setUjianDb, onChangePassword 
}: any) => {
  const [currentView, setCurrentView] = useState('main'); 
  const [activeMateriId, setActiveMateriId] = useState<any>(null);

  // --- JUMLAH SISWA LIVE DARI SUPABASE, MENGGANTIKAN activeServer.studentCount YANG STATIS ---
  const [liveStudentCount, setLiveStudentCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);

  useEffect(() => {
    const kelasCode = extractKelasCode(activeServer?.name);
    if (!kelasCode) {
      setLiveStudentCount(null);
      return;
    }

    let isCancelled = false;
    const fetchCount = async () => {
      setCountLoading(true);
      try {
        const { data: kelasRow, error: kelasErr } = await supabase
          .from('classes')
          .select('id')
          .eq('nama_tampilan', kelasCode)
          .maybeSingle();

        if (kelasErr || !kelasRow) {
          if (!isCancelled) setLiveStudentCount(null);
          return;
        }

        const { count, error: countErr } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('kelas_id', kelasRow.id)
          .eq('role', 'siswa')
          .eq('is_deleted', false);

        if (!isCancelled) setLiveStudentCount(countErr ? null : (count ?? 0));
      } catch (err) {
        console.error('Gagal menghitung jumlah siswa:', err);
        if (!isCancelled) setLiveStudentCount(null);
      } finally {
        if (!isCancelled) setCountLoading(false);
      }
    };

    fetchCount();
    return () => { isCancelled = true; };
  }, [activeServer?.name]);

  // Fallback ke studentCount lama kalau kelasnya tidak ketemu di tabel `classes`
  // (misal namanya belum konsisten format "Kelas 8A"), supaya tidak tiba-tiba blank.
  const studentCountLabel = countLoading
    ? '...'
    : liveStudentCount !== null
      ? String(liveStudentCount)
      : (activeServer?.studentCount ?? '-');

  return (
    <DashboardLayout user={user} activeServer={activeServer} onChangeServer={onChangeServer} onLogout={onLogout} onBack={currentView !== 'main' ? () => {setCurrentView('main'); setActiveMateriId(null);} : null} onChangePassword={onChangePassword}>
      {currentView === 'main' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DashboardCard
            title="Data Siswa"
            desc={`Siswa terdaftar (${studentCountLabel})`}
            icon={Users}
            color="bg-blue-50 border border-blue-100 text-blue-600"
            onClick={() => setCurrentView('data_siswa')}
          />
          <DashboardCard title="Materi Pembelajaran" desc="Modul, LKPD, Asesmen" icon={FolderOpen} color="bg-emerald-50 border border-emerald-100 text-emerald-600" onClick={() => setCurrentView('materi_list')} />
          <DashboardCard title="Evaluasi & Nilai" desc="Rekap analisis nilai siswa" icon={BarChart2} color="bg-rose-50 border border-rose-100 text-rose-600" onClick={() => setCurrentView('evaluasi')} />
        </div>
      )}
      
      {currentView === 'data_siswa' && <DataSiswaModule classId={activeServer.id} onBack={() => setCurrentView('main')} />}
      
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

      {/* Menampilkan Modul Evaluasi Marun untuk Guru */}
      {currentView === 'evaluasi' && (
        <EvaluationModule role="guru" userData={user} />
      )}
    </DashboardLayout>
  );
};

export default TeacherDashboard;