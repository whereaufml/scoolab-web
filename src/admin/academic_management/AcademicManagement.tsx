import React, { useState } from 'react';
import { BookOpen, Users, ArrowLeft, UserX, Clock, MonitorPlay, UserCheck, ChevronRight } from 'lucide-react';

// --- DATA TIRUAN ---
const MOCK_GRADES = [
  { id: 7, label: 'Kelas 7', muridAktif: 245, guruAktif: 12 },
  { id: 8, label: 'Kelas 8', muridAktif: 230, guruAktif: 11 },
  { id: 9, label: 'Kelas 9', muridAktif: 250, guruAktif: 14 },
];

const CLASS_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const MOCK_ABSENCES = {
  guru: ['Bpk. Budi (Sakit)', 'Ibu Siti (Izin Keluarga)'],
  murid: ['Andi - 7A (Sakit)', 'Beni - 7C (Izin)', 'Citra - 7F (Alfa)']
};

const MOCK_CLASS_DATA = {
  guruSaatIni: 'Ibu Ratna (Matematika)',
  waktu: '08:00 - 09:30 WIB',
  muridOnline: ['Andi Wijaya', 'Budi Santoso', 'Cici Permata', 'Deni Setiawan', 'Eka Putri']
};

const AcademicManagement: React.FC = () => {
  // State untuk melacak posisi layar (level 1, 2, atau 3)
  const [viewLevel, setViewLevel] = useState<'grades' | 'grade_detail' | 'class_detail'>('grades');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Fungsi navigasi
  const handleGradeClick = (grade: number) => {
    setSelectedGrade(grade);
    setViewLevel('grade_detail');
  };

  const handleClassClick = (className: string) => {
    setSelectedClass(className);
    setViewLevel('class_detail');
  };

  const goBack = () => {
    if (viewLevel === 'class_detail') setViewLevel('grade_detail');
    else if (viewLevel === 'grade_detail') {
      setViewLevel('grades');
      setSelectedGrade(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header dengan Tombol Kembali dinamis */}
      <div className="mb-6 flex items-center gap-4">
        {viewLevel !== 'grades' && (
          <button 
            onClick={goBack}
            className="p-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-xl transition-colors"
            title="Kembali"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-purple-900">
            {viewLevel === 'grades' ? 'Manajemen Akademik' : 
             viewLevel === 'grade_detail' ? `Detail Akademik Kelas ${selectedGrade}` : 
             `Pantauan Langsung Kelas ${selectedGrade}${selectedClass}`}
          </h2>
          <p className="text-purple-600 text-sm mt-1">
            {viewLevel === 'grades' ? 'Pantau aktivitas siswa dan kelas per jenjang.' : 
             viewLevel === 'grade_detail' ? 'Data absensi dan daftar kelas.' : 
             'Status guru mengajar dan siswa yang sedang login.'}
          </p>
        </div>
      </div>

      {/* LAYAR 1: Ringkasan Jenjang */}
      {viewLevel === 'grades' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_GRADES.map((grade) => (
            <button
              key={grade.id}
              onClick={() => handleGradeClick(grade.id)}
              className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-3xl font-bold text-purple-800">{grade.label}</h3>
                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <BookOpen size={28} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-xl border border-purple-100/50">
                  <UserCheck size={18} className="text-purple-500" />
                  <span className="text-sm font-medium text-purple-900">{grade.muridAktif} Murid Aktif Hari Ini</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-xl border border-purple-100/50">
                  <Users size={18} className="text-purple-500" />
                  <span className="text-sm font-medium text-purple-900">{grade.guruAktif} Guru Aktif Hari Ini</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* LAYAR 2: Detail Jenjang & Daftar Kelas A-I */}
      {viewLevel === 'grade_detail' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Panel Absensi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 font-bold mb-3 border-b border-rose-50 pb-2">
                <UserX size={18} /> Guru Absen Hari Ini
              </div>
              <ul className="space-y-2">
                {MOCK_ABSENCES.guru.map((guru, idx) => (
                  <li key={idx} className="text-sm text-slate-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">{guru}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm">
              <div className="flex items-center gap-2 text-orange-600 font-bold mb-3 border-b border-orange-50 pb-2">
                <UserX size={18} /> Murid Absen Hari Ini
              </div>
              <ul className="space-y-2">
                {MOCK_ABSENCES.murid.map((murid, idx) => (
                  <li key={idx} className="text-sm text-slate-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">{murid}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Grid Daftar Kelas */}
          <div>
            <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-purple-500" /> Daftar Ruang Kelas
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {CLASS_LETTERS.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleClassClick(letter)}
                  className="bg-white py-4 px-3 rounded-2xl border border-purple-100 shadow-sm hover:bg-purple-600 hover:text-white transition-all duration-300 group flex justify-between items-center"
                >
                  <span className="font-bold text-lg text-purple-800 group-hover:text-white transition-colors">
                    {selectedGrade}{letter}
                  </span>
                  <ChevronRight size={18} className="text-purple-300 group-hover:text-purple-200 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LAYAR 3: Pantauan Langsung Kelas */}
      {viewLevel === 'class_detail' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in zoom-in-95 duration-200">
          
          {/* Info Guru Mengajar */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-purple-600 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
              <Clock size={80} className="absolute -bottom-4 -right-4 opacity-10" />
              <h3 className="font-semibold text-purple-200 mb-1">Sedang Berlangsung</h3>
              <p className="text-xl font-bold mb-4">{MOCK_CLASS_DATA.waktu}</p>
              
              <div className="bg-purple-700/50 p-4 rounded-2xl backdrop-blur-sm border border-purple-500/30">
                <p className="text-xs text-purple-200 mb-1">Guru Pengajar</p>
                <p className="font-bold">{MOCK_CLASS_DATA.guruSaatIni}</p>
              </div>
              <button className="w-full mt-4 py-2.5 bg-white text-purple-700 font-bold rounded-xl text-sm hover:bg-purple-50 transition-colors">
                Ubah Guru Pengganti
              </button>
            </div>
          </div>

          {/* Daftar Murid Online */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-purple-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-purple-50">
              <h3 className="font-bold text-purple-900 flex items-center gap-2">
                <MonitorPlay size={20} className="text-emerald-500" /> 
                Murid Sedang Login (Web)
              </h3>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                {MOCK_CLASS_DATA.muridOnline.length} Online
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_CLASS_DATA.muridOnline.map((nama, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-200 rounded-xl transition-colors cursor-default">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200 relative">
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                    <UserCheck size={14} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{nama}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AcademicManagement;
