import React, { useState } from 'react';
import { Activity, UserCheck, Users, Clock, ClipboardList, Plus, X } from 'lucide-react';

interface AttendanceLog {
  id: string;
  nama: string;
  role: 'Guru' | 'Siswa';
  waktu: string;
  status: 'Hadir' | 'Izin' | 'Alpa';
}

const AttendanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guru' | 'siswa'>('siswa');
  
  // State untuk data log presensi agar interaktif
  const [logs, setLogs] = useState<AttendanceLog[]>([
    { id: '1', nama: 'Andi Wijaya', role: 'Siswa', waktu: '07:15 WIB', status: 'Hadir' },
    { id: '2', nama: 'Bpk. Budi Santoso', role: 'Guru', waktu: '06:50 WIB', status: 'Hadir' },
  ]);

  // State untuk modal tambah presensi manual
  const [showModal, setShowModal] = useState(false);
  const [nama, setNama] = useState('');
  const [role, setRole] = useState<'Guru' | 'Siswa'>('Siswa');
  const [status, setStatus] = useState<'Hadir' | 'Izin' | 'Alpa'>('Hadir');

  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    const newLog: AttendanceLog = {
      id: `att_${Date.now()}`,
      nama: nama.trim(),
      role,
      waktu: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status,
    };

    setLogs(prev => [newLog, ...prev]);
    setNama('');
    setShowModal(false);
  };

  // Hitung statistik berdasarkan data log aktif
  const totalSiswaHadir = logs.filter(l => l.role === 'Siswa' && l.status === 'Hadir').length + 330;
  const totalGuruHadir = logs.filter(l => l.role === 'Guru' && l.status === 'Hadir').length + 23;

  const statCards = [
    { label: 'Total Guru', value: '28', icon: Users, color: 'text-pink-500 bg-pink-50' },
    { label: 'Total Siswa', value: '342', icon: Users, color: 'text-pink-500 bg-pink-50' },
    { label: 'Guru Hadir', value: totalGuruHadir, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Siswa Hadir', value: totalSiswaHadir, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
  ];

  const filteredLogs = logs.filter(log =>
    activeTab === 'guru' ? log.role === 'Guru' : log.role === 'Siswa'
  );

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-pink-900 flex items-center gap-2">
            <Activity className="text-pink-600" />
            Presensi & Absensi
          </h2>
          <p className="text-pink-700 text-sm mt-1">
            Pantau tingkat kehadiran guru dan siswa secara langsung[cite: 1].
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={16} /> Rekap Kehadiran Manual
        </button>
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
              Log kehadiran {activeTab === 'siswa' ? 'siswa' : 'guru'} akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-800">{log.nama} <span className="text-xs text-slate-400 font-normal">({log.role})</span></p>
                  <p className="text-xs text-slate-500">Tercatat pukul: {log.waktu}</p>
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

      {/* --- MODAL TAMBAH PRESENSI MANUAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">Rekap Kehadiran Manual</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAttendance} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  placeholder="Contoh: Siti Aminah"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Peran</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as 'Guru' | 'Siswa')}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                >
                  <option value="Siswa">Siswa</option>
                  <option value="Guru">Guru</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status Kehadiran</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'Hadir' | 'Izin' | 'Alpa')}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Izin">Izin</option>
                  <option value="Alpa">Alpa</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold rounded-xl shadow-sm"
                >
                  Simpan Presensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
