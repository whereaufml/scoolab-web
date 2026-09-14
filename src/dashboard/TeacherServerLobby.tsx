import React, { useState } from 'react';
import { 
  Calculator, LogOut, Plus, ArrowRight, FolderArchive, Key, Layers, Sigma, X, Calendar, Clock
} from 'lucide-react';

// Sesuaikan jalur ini ke tempat file constants.ts kamu berada
import { generateId } from '../materi/lkpd/constants';

// --- Definisi Tipe Data ---
export interface ClassData {
  id: string;
  subject: string;
  name: string;
  year: string;
  isArchived: boolean;
  studentCount: number;
}

interface TeacherServerLobbyProps {
  user: { name: string; role: string; id: string };
  classes: ClassData[];
  onSelectServer: (id: string) => void;
  onLogout: () => void;
  onAddClass: (newClass: ClassData) => void;
  onArchiveClass: (id: string) => void;
  onRestoreClass: (id: string) => void;
}

const TeacherServerLobby: React.FC<TeacherServerLobbyProps> = ({ 
  user, classes, onSelectServer, onLogout, onAddClass, onArchiveClass, onRestoreClass 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showArchiveDrawer, setShowArchiveDrawer] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newSubject, setNewSubject] = useState('Matematika');
  const [newYear, setNewYear] = useState('2026/2027');

  const activeClasses = classes.filter(c => !c.isArchived);
  const archivedClasses = classes.filter(c => c.isArchived);
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden flex flex-col justify-between font-sans">
      
      {/* Background Latar Terang */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -left-10 bottom-10 opacity-10 text-blue-500"><Layers size={220} /></div>
        <div className="absolute -right-10 top-20 opacity-10 text-blue-500"><Sigma size={240} /></div>
      </div>
      
      {/* Header Cerah */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
              <Calculator size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-blue-900 tracking-tight text-lg">SCOOLMATE</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-blue-950">{user.name}</p>
              <p className="text-xs text-blue-600 font-semibold capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 border border-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1" title="Keluar Akun">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 w-full relative z-10 flex-grow">
        
        {/* KOTAK JADWAL GURU (Nuansa Biru) */}
        <div className="bg-blue-600 border border-blue-500 p-5 md:p-6 rounded-3xl shadow-xl shadow-blue-200 flex flex-col md:flex-row md:items-center gap-4 mb-10 animate-in fade-in slide-in-from-top-4">
          <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm">
            <Calendar size={28} />
          </div>
          <div className="flex-1 text-white">
            <h3 className="text-lg font-bold mb-3 md:mb-2">Jadwal Mengajar Hari Ini: Senin, 14 September 2026</h3>
            <div className="flex flex-col sm:flex-row gap-3 text-sm font-medium">
              <div className="flex items-center gap-2 bg-blue-700/50 px-3 py-2 rounded-xl border border-blue-500/50 backdrop-blur-sm">
                <Clock size={16} className="text-blue-200 shrink-0" /> 
                <span>08:00 - 09:30 | Matematika (Kelas 8A)</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-700/50 px-3 py-2 rounded-xl border border-blue-500/50 backdrop-blur-sm">
                <Clock size={16} className="text-blue-200 shrink-0" /> 
                <span>10:00 - 11:30 | Matematika (Kelas 8B)</span>
              </div>
            </div>
          </div>
          {/* Tombol Dummy */}
          <button className="mt-2 md:mt-0 px-4 py-3 md:py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-sm font-bold rounded-xl md:ml-auto w-full md:w-auto text-center transition-colors shadow-sm">
            Edit Jadwal
          </button>
        </div>

        {/* Header Bagian Server */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 shadow-sm"><Key size={12} /> Server Kelas Guru</span>
            <h1 className="text-3xl font-extrabold text-blue-950">Lobby Kelas Pembelajaran</h1>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 w-fit transition-colors"><Plus size={18}/> Tambah Kelas</button>
        </div>

        {/* Grid Server Kelas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeClasses.map(c => (
            <div key={c.id} onClick={() => onSelectServer(c.id)} className="bg-white border-2 border-transparent hover:border-blue-400 rounded-3xl p-6 transition-all duration-300 cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full group-hover:scale-110 transition-transform -z-0"></div>
              
              <div className="relative z-10">
                <h3 className="font-extrabold text-2xl text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">{c.name}</h3>
                <p className="text-sm font-semibold text-slate-500 mb-6">{c.subject} • {c.year}</p>
                <button className="w-full py-3 bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                  Masuk Server <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Footer Terang */}
      <footer className="max-w-6xl mx-auto px-4 pb-6 w-full flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-medium pt-4 z-10 gap-4">
        <div>&copy; 2026 SCOOLAB - Pembelajaran Long-Term Server</div>
        <button onClick={() => setShowArchiveDrawer(true)} className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl transition-all flex items-center gap-2 font-bold shadow-sm">
          <FolderArchive size={16} />
          <span>Gudang Arsip Kelas ({archivedClasses.length})</span>
        </button>
      </footer>

      {/* MODAL TAMBAH KELAS (Disesuaikan Terang) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold text-xl text-blue-950 mb-6 flex items-center gap-2">
              <Plus size={24} className="text-blue-600" /> Kelas Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Kelas</label>
                <input value={newClassName} onChange={e=>setNewClassName(e.target.value)} placeholder="Contoh: Kelas 8C" className="w-full border border-slate-200 bg-slate-50 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Mata Pelajaran</label>
                <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none">
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Agama">Agama</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tahun Ajar</label>
                <input type="text" value={newYear} onChange={(e) => setNewYear(e.target.value)} placeholder="Contoh: 2026/2027" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={()=>setShowAddModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">Batal</button>
              <button onClick={()=>{onAddClass({id:generateId('cls'), subject:newSubject, name:newClassName, year:newYear, studentCount:0, isArchived:false}); setShowAddModal(false); setNewClassName('');}} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER ARSIP KELAS (Disesuaikan Terang) */}
      {showArchiveDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-end z-50 animate-in fade-in">
          <div className="bg-slate-50 border-l border-slate-200 w-full max-w-md h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2 text-amber-700 font-extrabold text-lg"><FolderArchive size={20} /><span>Gudang Arsip Kelas</span></div>
                <button onClick={() => setShowArchiveDrawer(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"><X size={20}/></button>
              </div>
              
              <div className="mb-8">
                <h3 className="text-slate-500 font-bold text-sm mb-4">Kelas Aktif (Bisa diarsipkan)</h3>
                {activeClasses.length === 0 ? (
                  <div className="text-slate-500 text-xs font-medium italic">Tidak ada kelas aktif.</div>
                ) : (
                  <div className="space-y-3">
                    {activeClasses.map(cls => (
                      <div key={cls.id} className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-800">{cls.name}</h4>
                          <p className="text-xs font-semibold text-slate-500">Mapel: {cls.subject} • {cls.year}</p>
                        </div>
                        <button onClick={() => onArchiveClass(cls.id)} className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition-all">Arsipkan</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-slate-500 font-bold text-sm mb-4">Kelas Terarsip (Non-aktif)</h3>
                {archivedClasses.length === 0 ? (
                  <div className="text-center text-slate-400 py-6 text-sm font-medium bg-slate-100/50 rounded-2xl border border-dashed border-slate-300">Belum ada kelas yang diarsipkan.</div>
                ) : (
                  <div className="space-y-3">
                    {archivedClasses.map((cls) => (
                      <div key={cls.id} className="p-4 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between opacity-80">
                        <div>
                          <h4 className="font-bold text-slate-700">{cls.name}</h4>
                          <p className="text-xs font-semibold text-slate-500">Mapel: {cls.subject} • {cls.year}</p>
                        </div>
                        <button onClick={() => onRestoreClass(cls.id)} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold transition-all shadow-sm">Pulihkan</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button onClick={() => setShowArchiveDrawer(false)} className="w-full py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl mt-6 transition-colors shadow-sm">Tutup Gudang Arsip</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherServerLobby;
