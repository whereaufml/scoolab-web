import React, { useState } from 'react';
import { 
  BookOpen, Users, ArrowLeft, Trash2, Plus, Edit3, 
  UserX, AlertTriangle, ChevronRight
} from 'lucide-react';

// Data Tiruan
const MOCK_USERS = [
  { id: 'u1', name: 'Bpk. Budi Santoso', role: 'Guru', subject: 'Matematika' },
  { id: 'u2', name: 'Andi Wijaya', role: 'Siswa', class: '7A' },
];

const GRADES = [7, 8, 9];
const CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const AcademicManagement: React.FC = () => {
  const [view, setView] = useState<'main' | 'users' | 'classes' | 'class_detail'>('main');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  
  // State untuk Tong Sampah & Konfirmasi
  const [showTrash, setShowTrash] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, target: string | null}>({isOpen: false, target: null});
  const [trashItems, setTrashItems] = useState([
    { id: 't1', name: 'Siti Aminah (Siswa)', deletedAt: '12 Sep 2026', expireDays: 28 }
  ]);

  const handleOpenClass = (grade: number, cls: string) => {
    setSelectedGrade(grade);
    setSelectedClass(cls);
    setView('class_detail');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 relative min-h-[80vh]">
      {/* Header Halaman */}
      <div className="mb-6 flex items-center gap-4">
        {view !== 'main' && (
          <button onClick={() => setView('main')} className="p-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-indigo-900">
            {view === 'main' ? 'Manajemen Terpadu' : 
             view === 'users' ? 'Daftar Murid & Guru' : 
             view === 'classes' ? 'Manajemen Ruang Kelas' : 
             `Kelas ${selectedGrade}${selectedClass}`}
          </h2>
          <p className="text-indigo-600 text-sm mt-1">Kelola data keanggotaan dan struktur kelas akademik.</p>
        </div>
      </div>

      {/* --- TAMPILAN 1: MENU UTAMA (2 KOTAK) --- */}
      {view === 'main' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => setView('users')} className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left group">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Daftar Murid & Guru</h3>
            <p className="text-slate-500 text-sm">Tambah, edit, atau hapus profil siswa dan guru pengajar secara manual.</p>
          </button>

          <button onClick={() => setView('classes')} className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left group">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Manajemen Kelas</h3>
            <p className="text-slate-500 text-sm">Atur jenjang kelas (A-I), tentukan wali kelas, dan kelompokkan siswa.</p>
          </button>
        </div>
      )}

      {/* --- TAMPILAN 2: DAFTAR MURID & GURU --- */}
      {view === 'users' && (
        <div className="bg-white rounded-3xl shadow-sm border border-indigo-100 overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
            <h3 className="font-bold text-indigo-900">Semua Pengguna</h3>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl flex items-center gap-2">
              <Plus size={16} /> Tambah Data
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_USERS.map(u => (
              <div key={u.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">{u.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.role} {u.subject ? `• ${u.subject}` : `• Kelas ${u.class}`}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={18} /></button>
                  <button onClick={() => setDeleteConfirm({isOpen: true, target: u.name})} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAMPILAN 3: MANAJEMEN KELAS --- */}
      {view === 'classes' && (
        <div className="space-y-8 animate-in fade-in">
          {GRADES.map(grade => (
            <div key={grade} className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm">
              <h3 className="text-xl font-bold text-indigo-900 mb-4 border-b border-indigo-50 pb-2">Jenjang Kelas {grade}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CLASSES.map(cls => (
                  <button 
                    key={cls} 
                    onClick={() => handleOpenClass(grade, cls)}
                    className="py-4 px-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-2xl font-bold text-lg transition-colors flex justify-between items-center group"
                  >
                    <span>{grade}{cls}</span>
                    <ChevronRight size={18} className="opacity-50 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- TAMPILAN 4: DETAIL KELAS --- */}
      {view === 'class_detail' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          <div className="md:col-span-1">
            <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-md">
              <p className="text-indigo-200 text-sm mb-1">Wali Kelas Saat Ini</p>
              <h3 className="text-xl font-bold mb-4">Ibu Ratna Susanti</h3>
              <button className="w-full py-2 bg-white text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-50">Edit Wali Kelas</button>
            </div>
          </div>
          <div className="md:col-span-2 bg-white border border-indigo-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Daftar Anggota Kelas</h3>
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">+ Tambah Siswa</button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700">1. Andi Wijaya</span>
                <button onClick={() => setDeleteConfirm({isOpen: true, target: 'Andi Wijaya (dari kelas)'})} className="text-red-500 hover:text-red-700 p-1"><UserX size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TOMBOL TONG SAMPAH (POJOK KIRI BAWAH) --- */}
      <div className="fixed md:absolute bottom-6 left-6 z-40">
        <button 
          onClick={() => setShowTrash(!showTrash)}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl transition-transform hover:scale-105"
        >
          <Trash2 size={20} className="text-rose-400" />
          <span className="font-bold text-sm hidden md:inline">Tong Sampah</span>
          <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{trashItems.length}</span>
        </button>

        {/* Laci Tong Sampah */}
        {showTrash && (
          <div className="absolute bottom-16 left-0 w-80 bg-white border border-slate-200 shadow-2xl rounded-3xl p-5 animate-in slide-in-from-bottom-4">
            <h4 className="font-bold text-slate-800 mb-1">Barang Dihapus</h4>
            <p className="text-xs text-slate-500 mb-4">Akan dihapus permanen dalam 30 hari.</p>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {trashItems.map(item => (
                <div key={item.id} className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                  <p className="font-semibold text-sm text-slate-800">{item.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-rose-500 font-bold">{item.expireDays} hari tersisa</span>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Pulihkan</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL KONFIRMASI HAPUS --- */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Data?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Apakah kamu yakin ingin menghapus <strong>{deleteConfirm.target}</strong>? Data akan dipindahkan ke Tong Sampah selama 30 hari sebelum dihapus permanen.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({isOpen: false, target: null})} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Batal</button>
              <button onClick={() => setDeleteConfirm({isOpen: false, target: null})} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AcademicManagement;
