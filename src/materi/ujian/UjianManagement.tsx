import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileBadge, Trash2, X, RotateCcw, Loader2 } from 'lucide-react';
import { generateId } from '../lkpd/constants';
import UjianBuilder from './UjianBuilder';
import UjianViewer from './UjianViewer';
import ReusableDeleteConfirmModal from "../../components/ReusableDeleteConfirmModal";
import { supabase } from '../../supabaseClient'; // Pastikan path ini benar

interface UjianManagementProps {
  role: string;
  materiId: string;
  user?: any;
  onBack: () => void;
}

const UjianManagement: React.FC<UjianManagementProps> = ({ role, materiId, user, onBack }) => {
  const [ujianDb, setUjianDb] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentView, setCurrentView] = useState<'list' | 'editor' | 'viewer'>('list');
  const [activeUjianId, setActiveUjianId] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTrashDrawer, setShowTrashDrawer] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  const fetchUjian = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('ujian').select('*').eq('materi_id', materiId);
      if (error) throw error;
      
      const formatted = data.map(u => ({
        id: u.id, materiId: u.materi_id, title: u.title, desc: u.desc, 
        duration: u.duration, questions: u.questions, isDeleted: u.is_deleted
      }));
      setUjianDb(formatted);
    } catch (error) {
      console.error("Gagal memuat ujian:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (materiId) fetchUjian();
  }, [materiId]);

  const activeUjianList = ujianDb.filter(u => !u.isDeleted);
  const trashedUjianList = ujianDb.filter(u => u.isDeleted);

  const handleCreateNew = async () => {
    const newUjian = {
      id: generateId('ujn'),
      materi_id: materiId,
      title: 'Ujian Baru',
      desc: 'Kerjakan ujian ini secara mandiri.',
      duration: 60,
      questions: [],
      is_deleted: false
    };

    try {
      await supabase.from('ujian').insert([newUjian]);
      await fetchUjian(); // Refresh
      setActiveUjianId(newUjian.id);
      setCurrentView('editor');
    } catch (error) {
      alert("Gagal membuat ujian baru");
    }
  };

  const handleSaveUjian = async (updated: any) => {
    try {
      await supabase.from('ujian').update({
        title: updated.title,
        desc: updated.desc,
        duration: updated.duration,
        questions: updated.questions
      }).eq('id', updated.id);
      
      alert('Ujian berhasil disimpan!');
      fetchUjian();
      setCurrentView('list');
      setActiveUjianId(null);
    } catch (error) {
      alert("Gagal menyimpan ujian");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await supabase.from('ujian').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', itemToDelete.id);
      fetchUjian();
    } catch (error) {
      alert("Gagal menghapus ujian");
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleRestore = async (id: string) => {
    try {
      await supabase.from('ujian').update({ is_deleted: false, deleted_at: null }).eq('id', id);
      fetchUjian();
    } catch (error) {
      alert("Gagal memulihkan ujian");
    }
  };

  if (currentView === 'editor' && activeUjianId) {
    const activeItem = ujianDb.find(u => u.id === activeUjianId);
    return <UjianBuilder ujianItem={activeItem} onSave={handleSaveUjian} onBack={() => { setCurrentView('list'); setActiveUjianId(null); }} />;
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
          <div><h2 className="text-xl sm:text-2xl font-bold text-slate-800">Ujian</h2></div>
        </div>
        {role === 'guru' && (
          <button onClick={handleCreateNew} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> Buat Ujian Baru</button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeUjianList.map(ujian => (
            <div key={ujian.id} onClick={() => {setActiveUjianId(ujian.id); setCurrentView(role === 'guru' ? 'editor' : 'viewer');}} className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4 cursor-pointer hover:border-indigo-400 group relative">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex justify-center items-center shrink-0"><FileBadge size={24}/></div>
              <div className="flex-1 pr-16">
                <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 truncate">{ujian.title}</h3>
                <p className="text-xs text-slate-500">{ujian.questions?.length || 0} Soal • Waktu: {ujian.duration} Menit</p>
              </div>
              {role === 'guru' && <button onClick={(e) => { e.stopPropagation(); setItemToDelete(ujian); setShowDeleteModal(true); }} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>}
            </div>
          ))}
          {activeUjianList.length === 0 && <div className="col-span-full p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">Belum ada ujian aktif.</div>}
        </div>
      )}

      {/* Komponen Sampah sama persis, hanya fungsinya yang memanggil handleRestore baru */}
      {role === 'guru' && trashedUjianList.length > 0 && (
        <div className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-40 animate-in slide-in-from-bottom-8">
          <button onClick={() => setShowTrashDrawer(true)} className="bg-slate-800 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="relative"><Trash2 size={24}/><span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-800">{trashedUjianList.length}</span></div>
            <span className="hidden sm:block text-sm font-semibold pr-2">Sampah Ujian</span>
          </button>
        </div>
      )}

      <ReusableDeleteConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} title="Hapus Paket Ujian?" desc={`Ujian "${itemToDelete?.title}" akan dipindahkan ke Lobby Sampah.`} />

      {showTrashDrawer && (
        <div className="fixed inset-0 bg-slate-900/50 flex justify-start z-50">
          <div className="bg-white border-r w-full max-w-sm h-full p-6 text-slate-800 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-2 font-bold"><Trash2 className="text-red-500"/><span>Sampah Ujian</span></div><button onClick={() => setShowTrashDrawer(false)}><X/></button></div>
              <div className="space-y-3">
                {trashedUjianList.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 border rounded-2xl flex flex-col gap-3">
                    <div><h4 className="font-bold text-sm line-through">{item.title}</h4></div>
                    <div className="flex justify-between items-center border-t pt-3">
                      <button onClick={() => handleRestore(item.id)} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1"><RotateCcw size={14}/> Pulihkan</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowTrashDrawer(false)} className="w-full py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl mt-6">Tutup Laci</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UjianManagement;