import React, { useState } from 'react';
import { ArrowLeft, Plus, PenTool, Trash2, X, RotateCcw } from 'lucide-react';
import { generateId } from '../lkpd/constants';
import LatihanBuilder from './LatihanBuilder';
import LatihanViewer from './LatihanViewer';

// Pastikan komponen Modal ini sudah ada di file utama Anda (sama seperti di LKPD)
import { ReusableDeleteConfirmModal } from '../../portal_pembelajaran_scoolab';

interface LatihanManagementProps {
  role: string;
  materiId: string;
  latihanDb: any[];
  setLatihanDb: React.Dispatch<React.SetStateAction<any[]>>;
  lkpdDb: any[];
  user?: any;
  onBack: () => void;
}

const LatihanManagement: React.FC<LatihanManagementProps> = ({ role, materiId, latihanDb, setLatihanDb, lkpdDb, user, onBack }) => {
  const [currentView, setCurrentView] = useState<'list' | 'editor' | 'viewer'>('list');
  const [activeLatihanId, setActiveLatihanId] = useState<string | null>(null);
  
  // State untuk pembuatan Latihan
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<string[]>([]);
  
  // State untuk fitur Hapus Sementara (Soft Delete)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showTrashDrawer, setShowTrashDrawer] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  // Memisahkan data aktif dan data yang dihapus (Trash)
  const availableLkpd = lkpdDb?.filter(l => l.materiId === materiId && !l.isDeleted) || [];
  const materiLatihanAll = latihanDb?.filter(l => l.materiId === materiId) || [];
  const activeLatihanList = materiLatihanAll.filter(l => !l.isDeleted);
  const trashedLatihanList = materiLatihanAll.filter(l => l.isDeleted);

  const togglePrerequisite = (id: string) => {
    setSelectedPrerequisites(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleCreateNew = () => {
    if (!newTitle.trim()) return;
    const newLatihan = {
      id: generateId('lat'),
      materiId,
      title: newTitle.trim(),
      desc: 'Kerjakan soal-soal berikut dengan teliti dan jujur ya!',
      isDeleted: false,
      deletedAt: null,
      prerequisiteLkpdIds: selectedPrerequisites,
      questions: []
    };
    setLatihanDb(prev => [...prev, newLatihan]);
    setNewTitle('');
    setSelectedPrerequisites([]);
    setShowAddModal(false);
    setActiveLatihanId(newLatihan.id);
    setCurrentView('editor');
  };

  const handleCardClick = (latId: string) => {
    setActiveLatihanId(latId);
    if (role === 'guru') {
      setCurrentView('editor');
    } else {
      setCurrentView('viewer');
    }
  };

  // --- Fungsi Hapus & Pulihkan ---
  const requestDelete = (e: React.MouseEvent, lat: any) => {
    e.stopPropagation(); // Mencegah klik menembus ke card (agar tidak membuka editor)
    setItemToDelete(lat);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setLatihanDb(prev => prev.map(l => 
        l.id === itemToDelete.id 
          ? { ...l, isDeleted: true, deletedAt: new Date().toISOString() } 
          : l
      ));
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleRestore = (id: string) => {
    setLatihanDb(prev => prev.map(l => 
      l.id === id 
        ? { ...l, isDeleted: false, deletedAt: null } 
        : l
    ));
  };
  // --------------------------------

  if (currentView === 'editor' && activeLatihanId) {
    const activeItem = latihanDb.find(l => l.id === activeLatihanId);
    return (
      <LatihanBuilder 
        latihanItem={activeItem} 
        onSave={(updated) => {
          setLatihanDb(prev => prev.map(item => item.id === updated.id ? updated : item));
        }} 
        onBack={() => { setCurrentView('list'); setActiveLatihanId(null); }} 
      />
    );
  }

  if (currentView === 'viewer' && activeLatihanId) {
    const activeItem = latihanDb.find(l => l.id === activeLatihanId);
    return (
      <LatihanViewer 
        latihanItem={activeItem} 
        lkpdDb={lkpdDb} 
        user={user || { id: 'siswa_1', role: 'siswa' }} 
        onBack={() => { setCurrentView('list'); setActiveLatihanId(null); }} 
      />
    );
  }

  return (
    <div className="animate-in fade-in relative">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18}/></button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Latihan Soal</h2>
            <p className="text-slate-500 text-sm">Evaluasi pemahaman siswa di bab ini.</p>
          </div>
        </div>
        {role === 'guru' && (
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2">
            <Plus size={16} /> Buat Latihan
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeLatihanList.map(lat => (
          <div key={lat.id} onClick={() => handleCardClick(lat.id)} className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4 cursor-pointer hover:border-emerald-400 transition-all relative group">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex justify-center items-center shrink-0"><PenTool size={24}/></div>
            <div className="flex-1 pr-8">
              <h3 className="font-bold text-slate-800 truncate group-hover:text-emerald-600">{lat.title}</h3>
              <p className="text-xs text-slate-500">{lat.questions?.length || 0} Soal</p>
              {lat.prerequisiteLkpdIds?.length > 0 && (
                <span className="inline-block mt-2 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-md font-semibold">
                  Mewajibkan {lat.prerequisiteLkpdIds.length} LKPD
                </span>
              )}
            </div>
            
            {/* Tombol Hapus (Hanya muncul saat di-hover dan role adalah guru) */}
            {role === 'guru' && (
              <button 
                onClick={(e) => requestDelete(e, lat)} 
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* --- Floating Button Trash Drawer --- */}
      {role === 'guru' && trashedLatihanList.length > 0 && (
        <div className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-40 animate-in slide-in-from-bottom-8">
          <button onClick={() => setShowTrashDrawer(true)} className="bg-slate-800 hover:bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 transition-colors">
            <div className="relative">
              <Trash2 size={24}/>
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-800">
                {trashedLatihanList.length}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-semibold pr-2">Sampah Latihan</span>
          </button>
        </div>
      )}

      {/* Modal Pembuatan Latihan Baru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Latihan Soal Baru</h3>
            <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Judul Paket Latihan" className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl mb-4 text-sm outline-none focus:border-emerald-500" />
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">Prasyarat LKPD (Opsional)</label>
              {availableLkpd.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada LKPD di materi ini.</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                  {availableLkpd.map((lkpd: any) => (
                    <label key={lkpd.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer p-2 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100">
                      <input type="checkbox" checked={selectedPrerequisites.includes(lkpd.id)} onChange={() => togglePrerequisite(lkpd.id)} className="w-4 h-4 text-emerald-600 rounded" />
                      <span className="truncate">{lkpd.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl">Batal</button>
              <button onClick={handleCreateNew} className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl">Simpan & Buat Soal</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal Konfirmasi Hapus --- */}
      <ReusableDeleteConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={confirmDelete} 
        title="Hapus Latihan Soal?" 
        desc={`Latihan "${itemToDelete?.title}" akan dipindahkan ke Lobby Sampah.`} 
      />

      {/* --- Drawer Laci Sampah (Sama seperti LKPD) --- */}
      {showTrashDrawer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-start z-50 animate-in fade-in">
          <div className="bg-white border-r border-slate-200 w-full max-w-sm h-full p-6 text-slate-800 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Trash2 size={20} className="text-red-500"/>
                  <span>Sampah Latihan</span>
                </div>
                <button onClick={() => setShowTrashDrawer(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="space-y-3">
                {trashedLatihanList.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3 group">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.questions?.length || 0} Soal</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                      <span className="text-[10px] text-red-500 font-medium">Sisa: 30 hari</span>
                      <button onClick={() => handleRestore(item.id)} className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                        <RotateCcw size={14}/> Pulihkan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowTrashDrawer(false)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl mt-6">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatihanManagement;
