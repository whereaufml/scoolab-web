import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, FileText, PenTool, ClipboardList, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar
import LkpdManagement from './lkpd/LkpdManagement';
import LatihanManagement from './latihan/LatihanManagement';
import UjianManagement from './ujian/UjianManagement';
import { generateId } from './lkpd/constants'; 
import ReusableDeleteConfirmModal from "../components/ReusableDeleteConfirmModal";

export interface MateriData {
  id: string;
  classId: string;
  title: string;
  desc: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

const MateriModule = ({
  role, classId, lkpdDb, latihanDb, setLatihanDb, 
  user, onBack, onOpenMateriDetail, activeMateriId 
}: any) => {
  const [materiData, setMateriData] = useState<MateriData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materiToDelete, setMateriToDelete] = useState<MateriData | null>(null);
  const [newTitle, setNewTitle] = useState(''); 
  const [newDesc, setNewDesc] = useState('');
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null);

  // Mengambil data dari Supabase
  const fetchMateri = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('materi')
        .select('*')
        .eq('class_id', classId)
        .eq('is_deleted', false);
      
      if (error) throw error;
      
      // Menyesuaikan nama kolom DB dengan format di React
      const formattedData = data.map(item => ({
        id: item.id,
        classId: item.class_id,
        title: item.title,
        desc: item.desc,
        isDeleted: item.is_deleted,
        deletedAt: item.deleted_at
      }));
      setMateriData(formattedData);
    } catch (error) {
      console.error("Gagal memuat materi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (classId) fetchMateri();
  }, [classId]);

  const activeMateri = materiData.find((m: any) => m.id === activeMateriId);

  const handleAddSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!newTitle.trim()) return; 
    
    const newMateri = { 
      id: generateId('mat'), 
      class_id: classId, 
      title: newTitle.trim(), 
      desc: newDesc.trim() 
    };

    try {
      const { error } = await supabase.from('materi').insert([newMateri]);
      if (error) throw error;
      
      setNewTitle(''); 
      setNewDesc(''); 
      setShowAddModal(false); 
      fetchMateri(); // Refresh data
    } catch (error) {
      alert("Gagal menambah materi.");
    }
  };
  
  const requestDelete = (e: React.MouseEvent, materi: MateriData) => { 
    e.stopPropagation(); setMateriToDelete(materi); setShowDeleteModal(true); 
  };
  
  const confirmDelete = async () => { 
    if (!materiToDelete) return;
    try {
      const { error } = await supabase
        .from('materi')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', materiToDelete.id);
      
      if (error) throw error;
      
      setShowDeleteModal(false); 
      setMateriToDelete(null); 
      fetchMateri(); // Refresh data
    } catch (error) {
      alert("Gagal menghapus materi.");
    }
  };

  // Tampilan Sub-Modul
  if (activeMateri) {
if (activeSubModule === 'lkpd') {
  return <LkpdManagement role={role} materiId={activeMateri.id} user={user} onBack={() => setActiveSubModule(null)} />;
}    if (activeSubModule === 'latihan') return <LatihanManagement role={role} materiId={activeMateri.id} latihanDb={latihanDb} setLatihanDb={setLatihanDb} lkpdDb={lkpdDb} onBack={() => setActiveSubModule(null)} />;
    // UjianManagement sekarang mandiri, tidak butuh prop ujianDb
    if (activeSubModule === 'ujian') return <UjianManagement role={role} materiId={activeMateri.id} user={user} onBack={() => setActiveSubModule(null)} />;

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4">
        <button onClick={onBack} className="mb-6 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"><ArrowLeft size={14} /> Daftar Materi</button>
        <div className="mb-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">{activeMateri.title}</h2>
          <p className="text-slate-500 text-sm mt-1">{activeMateri.desc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div onClick={() => setActiveSubModule('lkpd')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-400 cursor-pointer group transition-all">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4"><FileText size={28} /></div>
            <h3 className="font-semibold text-slate-800 text-lg mb-1">LKPD</h3>
          </div>
          <div onClick={() => setActiveSubModule('latihan')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-400 cursor-pointer group transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4"><PenTool size={28} /></div>
            <h3 className="font-semibold text-slate-800 text-lg mb-1">Latihan Soal</h3>
          </div>
          <div onClick={() => setActiveSubModule('ujian')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-rose-400 cursor-pointer group transition-all">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4"><ClipboardList size={28} /></div>
            <h3 className="font-semibold text-slate-800 text-lg mb-1">Asesmen</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Materi Pembelajaran</h2><p className="text-slate-500 text-sm mt-1">Daftar modul untuk kelas ini.</p></div>
        {role === 'guru' && <button onClick={() => setShowAddModal(true)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2"><Plus size={16} /> Tambah Materi</button>}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12"><Loader2 className="animate-spin text-blue-500 mb-2" size={32} /><p className="text-slate-500 text-sm">Memuat materi...</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materiData.map((materi: any) => (
            <div key={materi.id} onClick={() => onOpenMateriDetail(materi.id)} className="bg-white p-5 border border-slate-200 hover:border-blue-400 rounded-3xl cursor-pointer group shadow-sm flex items-start gap-4 relative">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center shrink-0"><BookOpen size={24} /></div>
              <div className="flex-1 min-w-0 pr-8">
                <h3 className="font-bold text-slate-800 truncate group-hover:text-blue-600">{materi.title}</h3>
                <p className="text-xs text-slate-500 mb-3 truncate">{materi.desc}</p>
              </div>
              {role === 'guru' && <button onClick={(e) => requestDelete(e, materi)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>}
            </div>
          ))}
        </div>
      )}

      <ReusableDeleteConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} title="Hapus Materi?" desc={`Materi "${materiToDelete?.title}" akan dipindahkan ke Lobby Sampah.`} />

      {/* Modal Tambah tetap sama */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Materi Baru</h3>
                <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Judul" className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl mb-3 text-sm outline-none focus:border-blue-500" />
                <textarea value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="Deskripsi" className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl mb-4 text-sm outline-none focus:border-blue-500" />
                <div className="flex justify-end gap-2">
                    <button onClick={()=>setShowAddModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl">Batal</button>
                    <button onClick={handleAddSubmit} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl">Simpan</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MateriModule;