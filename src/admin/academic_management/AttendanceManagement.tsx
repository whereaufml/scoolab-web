import React, { useState } from 'react';
import { Activity, UserCheck, UserX, Users, Clock, ClipboardList } from 'lucide-react';

// --- DATA SEMENTARA ---
// TODO: ganti dengan data presensi asli (dari backend / state global) saat fitur ini dikembangkan lebih lanjut.
const MOCK_STATS = {
  totalGuru: 24,
  totalSiswa: 342,
  hadirHariIni: 330,
  tidakHadir: 12,
};

const MOCK_LOGS: { id: string; nama: string; role: 'Guru' | 'Siswa'; waktu: string; status: 'Hadir' | 'Izin' | 'Alpa' }[] = [
  // Sengaja dikosongkan dulu — nanti diisi dari data presensi harian yang sesungguhnya.
];

const AttendanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guru' | 'siswa'>('siswa');

  const statCards = [
    { label: 'Total Guru', value: MOCK_STATS.totalGuru, icon: Users, color: 'text-pink-500 bg-pink-50' },
    { label: 'Total Siswa', value: MOCK_STATS.totalSiswa, icon: Users, color: 'text-pink-500 bg-pink-50' },
    { label: 'Hadir Hari Ini', value: MOCK_STATS.hadirHariIni, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Tidak Hadir', value: MOCK_STATS.tidakHadir, icon: UserX, color: 'text-rose-600 bg-rose-50' },
  ];

  const filteredLogs = MOCK_LOGS.filter(log =>
    activeTab === 'guru' ? log.role === 'Guru' : log.role === 'Siswa'
  );

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in">
      {/* --- HEADER --- */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-pink-900 flex items-center gap-2">
          <Activity className="text-pink-600" />
          Presensi & Absensi
        </h2>
        <p className="text-pink-700 text-sm mt-1">
          Pantau tingkat kehadiran guru dan siswa secara langsung.
        </p>
      </div>

      {/* --- KARTU STATISTIK --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${card.color}`}>
                <Icon size={22} />
              </div>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* --- LOG PRESENSI --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-pink-50/50">
          <h3 className="font-bold text-pink-900 flex items-center gap-2">
            <Clock size={18} className="text-pink-600" />
            Log Presensi Hari Ini
          </h3>
          <div className="flex bg-white p-1 rounded-xl border border-pink-100 w-fit">
            <button
              onClick={() => setActiveTab('siswa')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                activeTab === 'siswa' ? 'bg-pink-600 text-white' : 'text-pink-700'
              }`}
            >
              Siswa
            </button>
            <button
              onClick={() => setActiveTab('guru')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                activeTab === 'guru' ? 'bg-pink-600 text-white' : 'text-pink-700'
              }`}
            >
              Guru
            </button>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-pink-50 text-pink-400 rounded-2xl flex items-center justify-center mb-3">
              <ClipboardList size={28} />
            </div>
            <p className="font-semibold text-slate-700">Belum ada data presensi</p>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">
              Log kehadiran {activeTab === 'siswa' ? 'siswa' : 'guru'} akan muncul di sini setelah fitur presensi terhubung ke data sebenarnya.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-800">{log.nama}</p>
                  <p className="text-xs text-slate-500">{log.waktu}</p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    log.status === 'Hadir'
                      ? 'bg-emerald-50 text-emerald-700'
                      : log.status === 'Izin'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;
