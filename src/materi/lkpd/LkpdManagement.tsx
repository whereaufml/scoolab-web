import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, Trash2, X, RotateCcw, Loader2 } from 'lucide-react';
import { generateId } from './constants'; 
import LkpdBuilder from './builder/LkpdBuilder';
import LkpdViewer from './viewer/LkpdViewer';
import ReusableDeleteConfirmModal from "../../components/ReusableDeleteConfirmModal";
import { supabase } from '../../supabaseClient'; // Path disesuaikan

interface BlockData { id: string; step: number; title: string; subtitle: string; icon: string; type: string; imageUrl: string; content: string; inputs?: any[]; }
interface LkpdData { id: string; materiId: string; title: string; subtitle: string; coverPreset: string; isDeleted: boolean; deletedAt: string | null; blocks: BlockData[]; }

interface LkpdManagementProps {
  role: string;
  materiId: string;
  user?: any; // Tambahan agar Viewer tahu siapa yang mengerjakan
  onBack: () => void;
}

const LkpdManagement: React.FC<LkpdManagementProps> = ({ role, materiId, user, onBack }) => {
  const [lkpdDb, setLkpdDb] = useState<LkpdData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('list'); 
  const [activeLkpdId, setActiveLkpdId] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showTrashDrawer, setShowTrashDrawer] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<LkpdData | null>(null);

  const fetchLkpd = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('lkpd').select('*').eq('materi_id', materiId);
      if (error) throw error;
      
      const formatted = data.map(d => ({
        id: d.id, materiId: d.materi_id, title: d.title, subtitle: d.subtitle,
        coverPreset: d.cover_preset, blocks: d.blocks || [], isDeleted: d.is_deleted, deletedAt: d.deleted_at
      }));
      setLkpdDb(formatted);
    } catch (error) {
      console.error("Gagal memuat LKPD:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (materiId) fetchLkpd();
  }, [materiId]);

  const activeLkpdList = lkpdDb.filter((l) => !l.isDeleted);
  const trashedLkpdList = lkpdDb.filter((l) => l.isDeleted);

  const handleCreateNew = async () => {
    const newLkpd = { 
      id: generateId('lkpd'), materi_id: materiId, title: 'LKPD Baru', subtitle: 'Deskripsi singkat...', 
      cover_preset: 'math', blocks: [], is_deleted: false
    };
    try {
      await supabase.from('lkpd').insert([newLkpd]);
      fetchLkpd();
      setActiveLkpdId(newLkpd.id);
      setCurrentView('editor');
    } catch (error) {
      alert("Gagal membuat LKPD.");
    }
  };

  const handleSaveLkpd = async (updatedData: LkpdData) => {
    try {
      await supabase.from('lkpd').update({
        title: updatedData.title, subtitle: updatedData.subtitle, 
        cover_preset: updatedData.coverPreset, blocks: updatedData.blocks
      }).eq('id', updatedData.id);
      
      alert("Berhasil disimpan!");
      fetchLkpd();
      setCurrentView('list'); 
      setActiveLkpdId(null);
    } catch (error) {
      alert("Gagal menyimpan LKPD.");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await supabase.from('lkpd').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', itemToDelete.id);
      fetchLkpd();
    } catch (error) {
      alert("Gagal menghapus.");
    }
    setShowDeleteModal(false); 
    setItemToDelete(null);
  };
  
  const handleRestore = async (id: string) => { 
    try {
      await supabase.from('lkpd').update({ is_deleted: false, deleted_at: null }).eq('id', id);
      fetchLkpd();
    } catch (error) {
      alert("Gagal memulihkan.");
    }
  };

  if (currentView === 'editor' && activeLkpdId) {
    const activeData = lkpdDb.find((l) => l.id === activeLkpdId);
    if (!activeData) return null;
    return <LkpdBuilder lkpd={activeData} onSave={handleSaveLkpd} onBack={() => setCurrentView('list')} />;
  }
  
  if (currentView === 'viewer' && activeLkpdId) {
    const activeData = lkpdDb.find((l) => l.id === activeLkpdId);
    if (!activeData) return null;
    return <LkpdViewer lkpd={activeData} user={user || {id: 'siswa_x', nama_lengkap: 'Siswa'}} onBack={() => setCurrentView('list')} isPreviewMode={false} />;
  }

  return (
    <div className="animate-in fade-in relative min-h-[60vh] pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18}/></button>
          <div><h2 className="text-2xl font-bold text-slate-800">Manajemen LKPD</h2><p className="text-slate-500 text-sm">Lembar Kerja Peserta Didik</p></div>
        </div>
        {role === 'guru' && <button onClick={handleCreateNew} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"><Plus size={16} /> Buat LKPD Baru</button>}
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-12"><Loader2 className="animate-spin text-blue-500 mb-2" size={32} /></div>
      ) : activeLkpdList.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center bg-white"><FileText size={48} className="mx-auto mb-3 text-slate-300" /><p className="font-medium text-slate-600">Belum ada LKPD di materi ini.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeLkpdList.map(lkpd => (
            <div key={lkpd.id} onClick={() => { setActiveLkpdId(lkpd.id); setCurrentView(role === 'guru' ? 'editor' : 'viewer'); }} className="bg-white p-5 border border-slate-200 hover:border-blue-400 rounded-2xl cursor-pointer group shadow-sm flex items-center gap-4 relative">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0"><FileText size={24}/></div>
              <div className="flex-1 min-w-0 pr-8">
                <h3 className="font-bold text-slate-800 truncate group-hover:text-blue-600">{lkpd.title}</h3>
                <p className="text-xs text-slate-500 truncate">{lkpd.subtitle}</p>
              </div>
              {role === 'guru' && <button onClick={(e) => { e.stopPropagation(); setItemToDelete(lkpd); setShowDeleteModal(true); }} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>}
            </div>
          ))}
        </div>
      )}

      {role === 'guru' && trashedLkpdList.length > 0 && (
        <div className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-40 animate-in slide-in-from-bottom-8">
          <button onClick={() => setShowTrashDrawer(true)} className="bg-slate-800 hover:bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700"><div className="relative"><Trash2 size={24}/><span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-800">{trashedLkpdList.length}</span></div><span className="hidden sm:block text-sm font-semibold pr-2">Sampah LKPD</span></button>
        </div>
      )}

      <ReusableDeleteConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} title="Hapus LKPD?" desc={`LKPD "${itemToDelete?.title}" akan dipindahkan ke Sampah.`} />

      {/* Drawer Sampah (Sama dengan aslinya, menggunakan fungsi handleRestore) */}
      {showTrashDrawer && (
        <div className="fixed inset-0 bg-slate-900/50 flex justify-start z-50">
          <div className="bg-white border-r border-slate-200 w-full max-w-sm h-full p-6 text-slate-800 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-2 font-bold"><Trash2 size={20} className="text-red-500"/><span>Sampah LKPD</span></div><button onClick={() => setShowTrashDrawer(false)}><X size={20}/></button></div>
              <div className="space-y-3">
                {trashedLkpdList.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 border rounded-2xl flex flex-col gap-3">
                    <div><h4 className="font-bold text-sm line-through">{item.title}</h4></div>
                    <button onClick={() => handleRestore(item.id)} className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1"><RotateCcw size={14}/> Pulihkan</button>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowTrashDrawer(false)} className="w-full py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl mt-6">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LkpdManagement;