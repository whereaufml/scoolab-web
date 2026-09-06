import React, { useState } from 'react';
import { ArrowLeft, Plus, FileBadge, Trash2, X, RotateCcw } from 'lucide-react';
import { generateId } from '../lkpd/constants';
import UjianBuilder from './UjianBuilder';
import UjianViewer from './UjianViewer';
import { ReusableDeleteConfirmModal } from '../../portal_pembelajaran_scoolab';

interface UjianManagementProps {
  role: string;
  materiId: string;
  ujianDb: any[];
  setUjianDb: React.Dispatch<React.SetStateAction<any[]>>;
  user?: any;
  onBack: () => void;
}

const UjianManagement: React.FC<UjianManagementProps> = ({ role, materiId, ujianDb, setUjianDb, user, onBack }) => {
  const [currentView, setCurrentView] = useState<'list' | 'editor' | 'viewer'>('list');
  const [activeUjianId, setActiveUjianId] = useState<string | null>(null);
  
  // State untuk Laci Sampah dan Modal Hapus
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showTrashDrawer, setShowTrashDrawer] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  // Memisahkan data aktif dan data sampah
  const materiUjianAll = ujianDb?.filter(u => u.materiId === materiId) || [];
  const activeUjianList = materiUjianAll.filter(u => !u.isDeleted);
  const trashedUjianList = materiUjianAll.filter(u => u.isDeleted);

  const handleCreateNew = () => {
    const newUjian = {
      id: generateId('ujn'),
      materiId,
      title: 'Ujian Baru',
      desc: 'Kerjakan ujian ini secara mandiri.',
      duration: 60,
      isDeleted: false,
      questions: []
    };
    setUjianDb(prev => [...prev, newUjian]);
    setActiveUjianId(newUjian.id);
    setCurrentView('editor');
  };

  const handleCardClick = (id: string) => {
    setActiveUjianId(id);
    setCurrentView(role === 'guru' ? 'editor' : 'viewer');
  };

  // --- Fungsi Hapus & Pulihkan ---
  const requestDelete = (e: React.MouseEvent, ujian: any) => {
    e.stopPropagation(); 
    setItemToDelete(ujian);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setUjianDb(prev => prev.map(u => 
        u.id === itemToDelete.id ? { ...u, isDeleted: true, deletedAt: new Date().toISOString() } : u
      ));
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleRestore = (id: string) => {
    setUjianDb(prev => prev.map(u => u.id === id ? { ...u, isDeleted: false, deletedAt: null } : u));
  };

  if (currentView === 'editor' && activeUjianId) {
    const activeItem = ujianDb.find(u => u.id === activeUjianId);
    return <UjianBuilder ujianItem={activeItem} onSave={(updated) => { setUjianDb(prev => prev.map(item => item.id === updated.id ? updated : item)); }} onBack={() => { setCurrentView('list'); setActiveUjianId(null); }} />;
  }

  if (currentView === 'viewer' && activeUjianId) {
    const activeItem = ujianDb.find(u => u.id === activeUjianId);
    return <UjianViewer ujianItem={activeItem} user={user || { id: 'siswa_1', role: 'siswa' }} onBack={() => { setCurrentView('list'); setActiveUjianId(null); }} />;
  }

  return (
    <div className="animate-in fade-in relative min-h-[60vh] pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18}/></button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Ujian</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Sesi penilaian akhir untuk materi ini.</p>
          </div>
        </div>
        {role === 'guru' && (
          <button onClick={handleCreateNew} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm">
            <Plus size={16} /> Buat Ujian Baru
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeUjianList.map(ujian => (
          <div key={ujian.id} onClick={() => handleCardClick(ujian.id)} className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4 cursor-pointer hover:border-indigo-400 transition-all group relative">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex justify-center items-center shrink-0"><FileBadge size={24}/></div>
            <div className="flex-1 pr-16">
              <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 truncate">{ujian.title}</h3>
              <p className="text-xs text-slate-500">{ujian.questions?.length || 0} Soal • Waktu: {ujian.duration} Menit</p>
            </div>
            
            {role === 'guru' && (
              <button onClick={(e) => requestDelete(e, ujian)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={18}/>
              </button>
            )}
          </div>
        ))}
        {activeUjianList.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">Belum ada ujian aktif.</div>
        )}
      </div>

      {/* --- Floating Button Trash Drawer --- */}
      {role === 'guru' && trashedUjianList.length > 0 && (
        <div className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-40 animate-in slide-in-from-bottom-8">
          <button onClick={() => setShowTrashDrawer(true)} className="bg-slate-800 hover:bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 transition-colors">
            <div className="relative">
              <Trash2 size={24}/>
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-800">
                {trashedUjianList.length}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-semibold pr-2">Sampah Ujian</span>
          </button>
        </div>
      )}

      {/* --- Modal Konfirmasi Hapus --- */}
      <ReusableDeleteConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={confirmDelete} 
        title="Hapus Paket Ujian?" 
        desc={`Ujian "${itemToDelete?.title}" akan dipindahkan ke Lobby Sampah.`} 
      />

      {/* --- Drawer Laci Sampah --- */}
      {showTrashDrawer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-start z-50 animate-in fade-in">
          <div className="bg-white border-r border-slate-200 w-full max-w-sm h-full p-6 text-slate-800 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Trash2 size={20} className="text-red-500"/>
                  <span>Sampah Ujian</span>
                </div>
                <button onClick={() => setShowTrashDrawer(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="space-y-3">
                {trashedUjianList.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 truncate line-through">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.questions?.length || 0} Soal</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                      <span className="text-[10px] text-red-500 font-medium">Sisa: 30 hari</span>
                      <button onClick={() => handleRestore(item.id)} className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                        <RotateCcw size={14}/> Pulihkan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowTrashDrawer(false)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl mt-6">Tutup Laci</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UjianManagement;
