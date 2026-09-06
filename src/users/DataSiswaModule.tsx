import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';

// Mendefinisikan tipe data untuk database siswa agar TypeScript mengenalinya
export interface StudentData {
  id: string;
  pass: string;
  classId: string;
}

export interface UsersDb {
  siswa: Record<string, StudentData>;
  guru: Record<string, any>;
}

interface DataSiswaModuleProps {
  classId: string;
  usersDb: UsersDb;
  onBack: () => void;
}

const DataSiswaModule: React.FC<DataSiswaModuleProps> = ({ classId, usersDb, onBack }) => {
  // Mengubah object data siswa menjadi array dan menyaring berdasarkan ID kelas
  const students = Object.entries(usersDb.siswa)
    .map(([name, data]) => ({ name, ...data }))
    .filter(s => s.classId === classId);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full">
      <button onClick={onBack} className="mb-4 sm:mb-6 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors">
        <ArrowLeft size={14} /> Kembali ke Dashboard
      </button>
      
      {/* Penyesuaian padding dan ukuran font otomatis antara HP dan Laptop (sm:) */}
      <div className="mb-4 sm:mb-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Data Siswa Terdaftar</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Pantau akun dan kata sandi siswa di kelas ini.</p>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
          <Users size={24} className="sm:w-7 sm:h-7" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* overflow-x-auto memastikan tabel tidak rusak di HP dan bisa digeser */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-4 sm:px-6 py-4">Nama Siswa</th>
                <th className="px-4 sm:px-6 py-4">ID Akun</th>
                <th className="px-4 sm:px-6 py-4">Kata Sandi Saat Ini</th>
                <th className="px-4 sm:px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length > 0 ? students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-bold text-slate-800">{s.name}</td>
                  <td className="px-4 sm:px-6 py-4 font-mono text-xs">{s.id}</td>
                  <td className="px-4 sm:px-6 py-4 font-mono text-xs text-blue-600 font-medium">
                    <span className="bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1">{s.pass}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1.5 rounded-md text-[10px] font-bold">AKTIF</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <Users size={32} className="mx-auto mb-3 opacity-50"/>
                    Belum ada siswa yang tergabung di kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataSiswaModule;
