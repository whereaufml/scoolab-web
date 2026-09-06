import React, { useState } from 'react';
import { 
  Calculator, LogOut, Plus, ArrowRight, FolderArchive, Key, Layers, Sigma, X 
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
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px]"></div>
        <div className="absolute -left-10 bottom-10 opacity-20 text-blue-300"><Layers size={220} /></div>
        <div className="absolute -right-10 top-20 opacity-20 text-blue-300"><Sigma size={240} /></div>
      </div>
      
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Calculator size={18} className="text-white" /></div>
            <span className="font-bold text-white tracking-tight text-lg">SCOOLMATE</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-100">{user.name}</p>
              <p className="text-xs text-blue-400 capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600/30 border border-blue-400/30 text-blue-200 rounded-full flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-1" title="Keluar Akun">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 w-full relative z-10 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2"><Key size={12} /> Server Kelas Guru</span>
            <h1 className="text-3xl font-extrabold text-white">Lobby Kelas Pembelajaran</h1>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 w-fit"><Plus size={16}/> Tambah Kelas</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeClasses.map(c => (
            <div key={c.id} onClick={() => onSelectServer(c.id)} className="bg-slate-900/90 border border-slate-700/80 hover:border-blue-500 rounded-3xl p-6 transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <h3 className="font-bold text-xl text-white mb-1 group-hover:text-blue-300 transition-colors">{c.name}</h3>
              <p className="text-xs text-slate-400 mb-6">{c.subject} • {c.year}</p>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2">Masuk Server Kelas <ArrowRight size={14}/></button>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="max-w-6xl mx-auto px-4 pb-6 w-full flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-4 z-10">
        <div>&copy; 2026 SCOOLAB - Pembelajaran Long-Term Server</div>
        <button onClick={() => setShowArchiveDrawer(true)} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 rounded-xl transition-all flex items-center gap-2 font-medium">
          <FolderArchive size={16} />
          <span>Gudang Arsip Kelas ({archivedClasses.length})</span>
        </button>
      </footer>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">Kelas Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nama Kelas</label>
                <input value={newClassName} onChange={e=>setNewClassName(e.target.value)} placeholder="Contoh: Kelas 8C" className="w-full border border-slate-700 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Mata Pelajaran</label>
                <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Agama">Agama</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tahun Ajar</label>
                <input type="text" value={newYear} onChange={(e) => setNewYear(e.target.value)} placeholder="Contoh: 2026/2027" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={()=>setShowAddModal(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Batal</button>
              <button onClick={()=>{onAddClass({id:generateId('cls'), subject:newSubject, name:newClassName, year:newYear, studentCount:0, isArchived:false}); setShowAddModal(false); setNewClassName('');}} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showArchiveDrawer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-end z-50 animate-in fade-in">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 text-white flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-lg"><FolderArchive size={20} /><span>Gudang Arsip Kelas</span></div>
                <button onClick={() => setShowArchiveDrawer(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="mb-6">
                <h3 className="text-slate-400 font-semibold text-sm mb-3">Kelas Aktif (Bisa diarsipkan)</h3>
                {activeClasses.length === 0 ? (
                  <div className="text-slate-600 text-xs italic">Tidak ada kelas aktif.</div>
                ) : (
                  <div className="space-y-3">
                    {activeClasses.map(cls => (
                      <div key={cls.id} className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{cls.name}</h4>
                          <p className="text-xs text-slate-400">Mapel: {cls.subject} • {cls.year}</p>
                        </div>
                        <button onClick={() => onArchiveClass(cls.id)} className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/50 rounded-xl text-xs font-semibold transition-all">Arsipkan</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-slate-400 font-semibold text-sm mb-3">Kelas Terarsip (Non-aktif)</h3>
                {archivedClasses.length === 0 ? (
                  <div className="text-center text-slate-600 py-4 text-xs italic">Belum ada kelas yang diarsipkan.</div>
                ) : (
                  <div className="space-y-3">
                    {archivedClasses.map((cls) => (
                      <div key={cls.id} className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-between opacity-70">
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{cls.name}</h4>
                          <p className="text-xs text-slate-400">Mapel: {cls.subject} • {cls.year}</p>
                        </div>
                        <button onClick={() => onRestoreClass(cls.id)} className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white rounded-xl text-xs font-semibold transition-all">Pulihkan</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setShowArchiveDrawer(false)} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl mt-6 transition-colors">Tutup Arsip</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherServerLobby;
