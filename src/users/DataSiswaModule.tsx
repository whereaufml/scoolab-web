import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
// Perbaikan Error 2: Jalur impor diperbaiki menjadi '../supabaseClient'
import { supabase } from '../supabaseClient'; 

interface DataSiswaModuleProps {
  classId: string;
  onBack: () => void;
  // usersDb dihapus karena kita mengambil data langsung dari Supabase
}

const DataSiswaModule: React.FC<DataSiswaModuleProps> = ({ classId, onBack }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data siswa dari Supabase berdasarkan kelas
  useEffect(() => {
    const fetchStudentsFromSupabase = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'siswa')
          .eq('kelas_id', classId)
          .order('nama_lengkap', { ascending: true });

        if (error) throw error;
        setStudents(data || []);
      } catch (error: any) {
        console.error('Gagal memuat data siswa:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (classId) {
      fetchStudentsFromSupabase();
    }
  }, [classId]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full">
      <button onClick={onBack} className="mb-4 sm:mb-6 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors">
        <ArrowLeft size={14} /> Kembali ke Dashboard
      </button>
      
      <div className="mb-4 sm:mb-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Data Siswa Terdaftar</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Pantau akun siswa di kelas ini dari database.</p>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
          <Users size={24} className="sm:w-7 sm:h-7" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-4 sm:px-6 py-4">Nama Lengkap</th>
                <th className="px-4 sm:px-6 py-4">Username</th>
                <th className="px-4 sm:px-6 py-4">NISN</th>
                <th className="px-4 sm:px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 size={32} className="mx-auto mb-3 animate-spin text-blue-500"/>
                    Memuat data siswa dari Supabase...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-800">{s.nama_lengkap}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-blue-600 font-medium">@{s.username}</td>
                    <td className="px-4 sm:px-6 py-4 font-mono text-xs">{s.nisn || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1.5 rounded-md text-[10px] font-bold">AKTIF</span>
                    </td>
                  </tr>
                ))
              ) : (
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