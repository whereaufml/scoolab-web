import { useState, useEffect, memo } from 'react';
import { Calendar, Clock, FolderOpen, BarChart2, ShieldAlert, X, Loader2, CalendarDays } from 'lucide-react';

// Impor komponen dari folder components
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';

// Impor modul materi dan penilaian
import MateriModule from '../materi/MateriModule';
import EvaluationModule from '../penilaian/EvaluationModule';
import { supabase } from '../supabaseClient';

interface ScheduleRow {
  id: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  mata_pelajaran: string;
}

// Nama hari Indonesia sesuai urutan getDay() JS (0 = Minggu)
const HARI_LIST = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const getTodayHari = () => HARI_LIST[new Date().getDay()];

// Mengambil kode kelas seperti "8A" dari nama server siswa (mis. "Kelas 8A" -> "8A"),
// untuk dicocokkan ke tabel `classes` (tingkat+rombel) di Supabase.
const extractKelasCode = (namaServer?: string): string | null => {
  if (!namaServer) return null;
  const match = namaServer.match(/\d{1,2}[A-Za-z]/);
  return match ? match[0].toUpperCase() : null;
};

const StudentDashboard = memo(({ user, activeServer, onLogout, materiData, lkpdDb, setLkpdDb, latihanDb, setLatihanDb, ujianDb, setUjianDb, onChangePassword }: any) => {
  const [currentView, setCurrentView] = useState('main'); 
  const [activeMateriId, setActiveMateriId] = useState<any>(null);

  // --- JADWAL HARI INI, DIAMBIL DARI SUPABASE (menggantikan teks hardcode) ---
  const [todaySchedule, setTodaySchedule] = useState<ScheduleRow[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState('');
  const [kelasId, setKelasId] = useState<string | null>(null);

  // --- MODAL "DETAIL JADWAL" (dulu tombolnya mati, sekarang beneran buka jadwal seminggu) ---
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [weekSchedule, setWeekSchedule] = useState<ScheduleRow[]>([]);
  const [weekLoading, setWeekLoading] = useState(false);

  const todayHari = getTodayHari();

  useEffect(() => {
    const kelasCode = extractKelasCode(activeServer?.name);
    if (!kelasCode) {
      setScheduleLoading(false);
      setScheduleError('');
      setTodaySchedule([]);
      return;
    }

    let isCancelled = false;
    const fetchTodaySchedule = async () => {
      setScheduleLoading(true);
      setScheduleError('');
      try {
        const { data: kelasRow, error: kelasErr } = await supabase
          .from('classes')
          .select('id')
          .eq('nama_tampilan', kelasCode)
          .maybeSingle();

        if (kelasErr) throw kelasErr;
        if (!kelasRow) {
          if (!isCancelled) { setTodaySchedule([]); setKelasId(null); }
          return;
        }
        if (!isCancelled) setKelasId(kelasRow.id);

        const { data: rows, error: schedErr } = await supabase
          .from('schedules')
          .select('id, hari, jam_mulai, jam_selesai, mata_pelajaran')
          .eq('kelas_id', kelasRow.id)
          .eq('hari', todayHari)
          .order('jam_mulai');

        if (schedErr) throw schedErr;
        if (!isCancelled) setTodaySchedule(rows || []);
      } catch (err: any) {
        console.error('Gagal memuat jadwal:', err);
        if (!isCancelled) setScheduleError('Gagal memuat jadwal hari ini.');
      } finally {
        if (!isCancelled) setScheduleLoading(false);
      }
    };

    fetchTodaySchedule();
    return () => { isCancelled = true; };
  }, [activeServer?.name, todayHari]);

  // Buka modal "Detail Jadwal" -> ambil jadwal seminggu penuh untuk kelas ini
  const handleOpenFullSchedule = async () => {
    setShowFullSchedule(true);
    if (!kelasId) return;

    setWeekLoading(true);
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('id, hari, jam_mulai, jam_selesai, mata_pelajaran')
        .eq('kelas_id', kelasId)
        .order('jam_mulai');

      if (error) throw error;
      setWeekSchedule(data || []);
    } catch (err) {
      console.error('Gagal memuat jadwal seminggu:', err);
    } finally {
      setWeekLoading(false);
    }
  };

  // Peringatan jika kelas diarsipkan
  if (!activeServer || activeServer.isArchived) return (
    <DashboardLayout user={user} onLogout={onLogout} onChangePassword={onChangePassword}>
      <div className="text-center py-20">
        <ShieldAlert size={40} className="mx-auto text-red-500 mb-4"/>
        Akses Kelas Dinonaktifkan
      </div>
    </DashboardLayout>
  );

  // Kelompokkan jadwal seminggu per hari, urut Senin-Sabtu, untuk ditampilkan di modal
  const weekByHari = HARI_LIST.slice(1).map(hari => ({
    hari,
    items: weekSchedule.filter(s => s.hari === hari),
  }));

  return (
    <DashboardLayout user={user} activeServer={activeServer} onLogout={onLogout} onBack={currentView !== 'main' ? () => {setCurrentView('main'); setActiveMateriId(null);} : null} onChangePassword={onChangePassword}>
      {currentView === 'main' && (
        <div className="space-y-6 max-w-3xl">
          
          {/* KOTAK JADWAL SISWA (Nuansa Ungu Muda) — sekarang data asli dari Supabase */}
          <div className="bg-purple-100 border border-purple-200 p-5 md:p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center gap-4 animate-in fade-in">
            <div className="w-14 h-14 bg-purple-200 text-purple-700 rounded-2xl flex items-center justify-center shrink-0">
              <Calendar size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-purple-900 mb-3 md:mb-2 flex items-center gap-2">
                Jadwal Hari Ini: {todayHari}
                {scheduleLoading && <Loader2 size={16} className="animate-spin text-purple-500" />}
              </h3>

              {scheduleError ? (
                <p className="text-sm text-purple-800 font-medium">{scheduleError}</p>
              ) : !scheduleLoading && todaySchedule.length === 0 ? (
                <p className="text-sm text-purple-700 font-medium">Tidak ada jadwal pelajaran untuk hari ini.</p>
              ) : (
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 text-sm text-purple-800 font-medium">
                  {todaySchedule.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl border border-purple-200">
                      <Clock size={16} className="text-purple-600 shrink-0" />
                      <span>{item.jam_mulai.slice(0, 5)} - {item.jam_selesai.slice(0, 5)} | {item.mata_pelajaran}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Tombol ini dulu mati (cursor-not-allowed, tanpa onClick) — sekarang beneran buka detail jadwal seminggu */}
            <button
              onClick={handleOpenFullSchedule}
              className="mt-2 md:mt-0 px-4 py-3 md:py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl md:ml-auto w-full md:w-auto text-center transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <CalendarDays size={16} /> Detail Jadwal
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

      {/* MODAL DETAIL JADWAL SEMINGGU PENUH */}
      {showFullSchedule && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowFullSchedule(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-lg text-purple-900 flex items-center gap-2">
                <Calendar size={20} className="text-purple-600" /> Jadwal Seminggu — {activeServer.name}
              </h3>
              <button onClick={() => setShowFullSchedule(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            {weekLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-purple-600" size={28} />
              </div>
            ) : !kelasId ? (
              <p className="text-sm text-slate-400 text-center py-8">Data kelas belum tersambung ke jadwal sekolah.</p>
            ) : (
              <div className="space-y-4">
                {weekByHari.map(({ hari, items }) => (
                  <div key={hari}>
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">{hari}</p>
                    {items.length === 0 ? (
                      <p className="text-xs text-slate-400 italic mb-2">Tidak ada pelajaran.</p>
                    ) : (
                      <div className="space-y-2">
                        {items.map(item => (
                          <div key={item.id} className="flex items-center gap-2 bg-purple-50 border border-purple-100 px-3 py-2 rounded-xl text-sm text-purple-800">
                            <Clock size={14} className="text-purple-500 shrink-0" />
                            <span>{item.jam_mulai.slice(0, 5)} - {item.jam_selesai.slice(0, 5)} | {item.mata_pelajaran}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
});

export default StudentDashboard;