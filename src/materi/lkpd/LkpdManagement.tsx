import React, { useState } from 'react';
import { ArrowLeft, Plus, FileText, Trash2, X, RotateCcw } from 'lucide-react';

// Sesuaikan path import ini jika letak file berbeda
import { generateId } from './constants'; 
import LkpdBuilder from './builder/LkpdBuilder';
import LkpdViewer from './viewer/LkpdViewer';

// 1. KITA IMPORT DATANYA DI SINI
import { INITIAL_LKPD } from './data/lkpdData'; 

// Import komponen Modal dari file utama
import { ReusableDeleteConfirmModal } from '../../portal_pembelajaran_scoolab';

// --- Definisi Tipe Data ---
interface BlockData {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  icon: string;
  type: string;
  imageUrl: string;
  content: string;
  inputs?: any[];
}

interface LkpdData {
  id: string;
  materiId: string;
  title: string;
  subtitle: string;
  coverPreset: string;
  isDeleted: boolean;
  deletedAt: string | null;
  blocks: BlockData[];
}

interface LkpdManagementProps {
  role: string;
  materiId: string;
  lkpdDb: LkpdData[];
  setLkpdDb: React.Dispatch<React.SetStateAction<LkpdData[]>>;
  onBack: () => void;
}

// --- Komponen Utama ---
const LkpdManagement: React.FC<LkpdManagementProps> = ({ role, materiId, lkpdDb, setLkpdDb, onBack }) => {
  const [currentView, setCurrentView] = useState<string>('list'); // list, editor, viewer
  const [activeLkpdId, setActiveLkpdId] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showTrashDrawer, setShowTrashDrawer] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<LkpdData | null>(null);

  // 2. KITA GABUNGKAN DATA CONTOH DENGAN DATABASE ASLI AGAR MUNCUL DI LAYAR
  // @ts-ignore - Mengabaikan error tipe sementara jika struktur data sedikit berbeda
  const testDb = [...INITIAL_LKPD, ...lkpdDb];

  // Pastikan data contoh (id: 'lkpd_1') selalu lolos filter dan muncul di list
  const materiLkpdAll = testDb.filter((l) => l.materiId === materiId || l.id === 'lkpd_1');
  const activeLkpdList = materiLkpdAll.filter((l) => !l.isDeleted);
  const trashedLkpdList = materiLkpdAll.filter((l) => l.isDeleted);

  const handleCreateNew = () => {
    const newLkpd: LkpdData = { 
      id: generateId('lkpd'), materiId, title: 'LKPD Baru', subtitle: 'Deskripsi singkat...', 
      coverPreset: 'math', isDeleted: false, deletedAt: null, blocks: [] 
    };
    setLkpdDb((p) => [...p, newLkpd]);
    setActiveLkpdId(newLkpd.id);
    setCurrentView('editor');
  };

  const handleSaveLkpd = (updatedData: LkpdData) => {
    setLkpdDb((p) => p.map((l) => l.id === updatedData.id ? updatedData : l));
    setCurrentView('list'); 
    setActiveLkpdId(null);
  };

  const requestDelete = (e: React.MouseEvent, lkpd: LkpdData) => { 
    e.stopPropagation(); 
    setItemToDelete(lkpd); 
    setShowDeleteModal(true); 
  };
  
  const confirmDelete = () => {
    if (itemToDelete) {
      setLkpdDb((p) => p.map((l) => l.id === itemToDelete.id ? { ...l, isDeleted: true, deletedAt: new Date().toISOString() } : l));
    }
    setShowDeleteModal(false); 
    setItemToDelete(null);
  };
  
  const handleRestore = (id: string) => { 
    setLkpdDb((p) => p.map((l) => l.id === id ? { ...l, isDeleted: false, deletedAt: null } : l)); 
  };

  // 3. AMBIL DATA DARI testDb AGAR VIEWER BISA MEMBACA DATA CONTOH
  if (currentView === 'editor') {
    const activeData = testDb.find((l) => l.id === activeLkpdId);
    if (!activeData) return null;
    return <LkpdBuilder lkpd={activeData} onSave={handleSaveLkpd} onBack={() => setCurrentView('list')} />;
  }
  
  if (currentView === 'viewer') {
    const activeData = testDb.find((l) => l.id === activeLkpdId);
    if (!activeData) return null;
    return <LkpdViewer lkpd={activeData} onBack={() => setCurrentView('list')} isPreviewMode={false} />;
  }

  return (
    <div className="animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18}/></button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Manajemen LKPD</h2>
            <p className="text-slate-500 text-sm">Lembar Kerja Peserta Didik untuk materi ini.</p>
          </div>
        </div>
        {role === 'guru' && (
          <button onClick={handleCreateNew} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
            <Plus size={16} /> Buat LKPD Baru
          </button>
        )}
      </div>

      {activeLkpdList.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center bg-white">
          <FileText size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="font-medium text-slate-600">Belum ada LKPD di materi ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeLkpdList.map(lkpd => (
            <div key={lkpd.id} onClick={() => { setActiveLkpdId(lkpd.id); setCurrentView(role === 'guru' ? 'editor' : 'viewer'); }} className="bg-white p-5 border border-slate-200 hover:border-blue-400 rounded-2xl cursor-pointer group shadow-sm flex items-center gap-4 relative">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0"><FileText size={24}/></div>
              <div className="flex-1 min-w-0 pr-8">
                <h3 className="font-bold text-slate-800 truncate group-hover:text-blue-600">{lkpd.title}</h3>
                <p className="text-xs text-slate-500 truncate">{lkpd.subtitle}</p>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">{lkpd.blocks?.length || 0} Langkah / Blok</div>
              </div>
              {role === 'guru' && (
                <button onClick={(e) => requestDelete(e, lkpd)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {role === 'guru' && trashedLkpdList.length > 0 && (
        <div className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-40 animate-in slide-in-from-bottom-8">
          <button onClick={() => setShowTrashDrawer(true)} className="bg-slate-800 hover:bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 transition-colors">
            <div className="relative"><Trash2 size={24}/><span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-800">{trashedLkpdList.length}</span></div>
            <span className="hidden sm:block text-sm font-semibold pr-2">Sampah LKPD</span>
          </button>
        </div>
      )}

      <ReusableDeleteConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} title="Hapus LKPD?" desc={`LKPD "${itemToDelete?.title}" akan dipindahkan ke Lobby Sampah khusus LKPD.`} />

      {/* Drawer Sampah LKPD */}
      {showTrashDrawer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-start z-50 animate-in fade-in">
          <div className="bg-white border-r border-slate-200 w-full max-w-sm h-full p-6 text-slate-800 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 font-bold text-lg"><Trash2 size={20} className="text-red-500"/><span>Sampah LKPD</span></div>
                <button onClick={() => setShowTrashDrawer(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="space-y-3">
                {trashedLkpdList.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3 group">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.subtitle}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                      <span className="text-[10px] text-red-500 font-medium">Sisa: 30 hari</span>
                      <button onClick={() => handleRestore(item.id)} className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"><RotateCcw size={14}/> Pulihkan</button>
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

export default LkpdManagement;
