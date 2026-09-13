import React, { useState } from 'react';
import { 
  CalendarDays, BookOpen, Users, Edit3, Megaphone, 
  Clock, ArrowRight, UserCheck, Activity 
} from 'lucide-react';

// Data Tiruan untuk Aktivitas Nyata
const LIVE_ACTIVITY = {
  guruMengajar: 18,
  totalGuru: 28,
  siswaBelajar: 512,
  totalSiswa: 600,
};

const MOCK_AGENDA = [
  { id: 1, tanggal: '15 Sep 2026', acara: 'Ujian Tengah Semester', tipe: 'Akademik' },
  { id: 2, tanggal: '20 Sep 2026', acara: 'Lomba Cerdas Cermat', tipe: 'Kompetisi' },
];

const OperationalManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'edit_kelas' | 'jadwal'>('overview');

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-pink-900 flex items-center gap-2">
          <CalendarDays className="text-pink-600" />
          Operasional & Jadwal Sekolah
        </h2>
        <p className="text-pink-600 text-sm mt-1">
          Pantau aktivitas belajar mengajar nyata, jadwal pelajaran, dan agenda sekolah.
        </p>
      </div>

      {/* Bagian 1: Pantauan Langsung (Live) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-pink-600">Guru Sedang Mengajar</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-pink-900">{LIVE_ACTIVITY.guruMengajar}</h3>
              <p className="text-sm text-slate-500 font-medium mb-1">dari {LIVE_ACTIVITY.totalGuru} guru</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <UserCheck size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-pink-600">Siswa Sedang Belajar</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-pink-900">{LIVE_ACTIVITY.siswaBelajar}</h3>
              <p className="text-sm text-slate-500 font-medium mb-1">dari {LIVE_ACTIVITY.totalSiswa} siswa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 2: Menu Aksi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tombol Pengaturan Kelas */}
        <button 
          onClick={() => setActiveTab('edit_kelas')}
          className="bg-pink-600 p-6 rounded-3xl text-left text-white shadow-md hover:bg-pink-700 transition-colors group relative overflow-hidden"
        >
          <Edit3 size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold mb-2">Manajemen Kelas</h3>
          <p className="text-pink-100 text-sm mb-4">Edit wali kelas, mata pelajaran, dan daftar anggota siswa.</p>
          <div className="flex items-center gap-2 text-sm font-semibold text-pink-100 group-hover:text-white transition-colors">
            Mulai Konfigurasi <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Tombol Jadwal Pelajaran */}
        <button 
          onClick={() => setActiveTab('jadwal')}
          className="bg-white p-6 rounded-3xl text-left border border-pink-200 shadow-sm hover:border-pink-400 transition-colors group relative overflow-hidden"
        >
          <Clock size={80} className="absolute -bottom-4 -right-4 text-pink-100 opacity-50 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold text-pink-900 mb-2">Jadwal Pelajaran</h3>
          <p className="text-pink-600 text-sm mb-4">Atur jadwal mengajar mingguan dan harian untuk setiap kelas.</p>
          <div className="flex items-center gap-2 text-sm font-semibold text-pink-500 group-hover:text-pink-700 transition-colors">
            Lihat Jadwal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Panel Agenda Sekolah (Statik) */}
        <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 shadow-sm">
          <h3 className="text-lg font-bold text-pink-900 mb-4 flex items-center gap-2">
            <Megaphone size={20} className="text-pink-600" />
            Agenda Sekolah
          </h3>
          <div className="space-y-3">
            {MOCK_AGENDA.map((agenda) => (
              <div key={agenda.id} className="bg-white p-3 rounded-xl border border-pink-100/50">
                <p className="text-xs font-bold text-pink-500 mb-0.5">{agenda.tanggal}</p>
                <p className="text-sm font-semibold text-slate-800">{agenda.acara}</p>
              </div>
            ))}
            <button className="w-full mt-2 py-2 border-2 border-dashed border-pink-300 text-pink-600 rounded-xl text-sm font-bold hover:bg-pink-100 transition-colors">
              + Tambah Agenda
            </button>
          </div>
        </div>
      </div>

      {/* Bagian 3: Area Konten Dinamis */}
      {activeTab === 'edit_kelas' && (
        <div className="mt-8 p-8 bg-white border border-pink-100 rounded-3xl text-center animate-in fade-in zoom-in-95">
          <Users size={48} className="mx-auto text-pink-300 mb-4" />
          <h3 className="text-xl font-bold text-pink-900 mb-2">Editor Ruang Kelas</h3>
          <p className="text-pink-600">Fitur untuk mengubah Guru Pengajar dan memindahkan Siswa antar kelas akan ditampilkan di sini.</p>
        </div>
      )}

      {activeTab === 'jadwal' && (
        <div className="mt-8 p-8 bg-white border border-pink-100 rounded-3xl text-center animate-in fade-in zoom-in-95">
          <BookOpen size={48} className="mx-auto text-pink-300 mb-4" />
          <h3 className="text-xl font-bold text-pink-900 mb-2">Jadwal Mingguan & Harian</h3>
          <p className="text-pink-600">Tabel jadwal mata pelajaran yang dapat disesuaikan oleh Administrator akan dirender di sini.</p>
        </div>
      )}
    </div>
  );
};

export default OperationalManagement;
