import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, PenTool, Trash2, X, RotateCcw, FileBadge, Loader2, AlertTriangle } from 'lucide-react';
import LatihanBuilder from './LatihanBuilder';
import LatihanViewer from './LatihanViewer';
import ReusableDeleteConfirmModal from '../../components/ReusableDeleteConfirmModal';

import {
  getLatihanByMateri, getTrashedLatihan, createLatihan,
  saveLatihan, softDeleteLatihan, restoreLatihan,
  type LatihanSet,
} from '../../lib/latihanApi';

interface LatihanManagementProps {
  role: string;
  materiId: string;
  lkpdDb: any[];
  user: { id: string; role: string; name?: string };
  onBack: () => void;
}

const LatihanManagement: React.FC<LatihanManagementProps> = ({ role, materiId, lkpdDb, user, onBack }) => {
  const [currentView, setCurrentView] = useState<'list' | 'editor' | 'viewer'>('list');
  const [activeLatihanId, setActiveLatihanId] = useState<string | null>(null);

  const [latihanList, setLatihanList] = useState<LatihanSet[]>([]);
  const [trashList, setTrashList] = useState<LatihanSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesanError, setPesanError] = useState<string | null>(null);

  // State pembuatan latihan baru
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<string[]>([]);
  const [membuat, setMembuat] = useState(false);

  // State hapus sementara
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTrashDrawer, setShowTrashDrawer] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<LatihanSet | null>(null);

  // -------------------------------------------------------------------
  const muatData = useCallback(async () => {
    setLoading(true);
    setPesanError(null);
    try {
      const [aktif, sampah] = await Promise.all([
        getLatihanByMateri(materiId),
        getTrashedLatihan(materiId),
      ]);
      setLatihanList(aktif);
      setTrashList(sampah);
    } catch (err) {
      setPesanError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [materiId]);

  useEffect(() => { muatData(); }, [muatData]);

  const availableLkpd = lkpdDb?.filter(l => l.materiId === materiId && !l.isDeleted) || [];

  const togglePrerequisite = (id: string) => {
    setSelectedPrerequisites(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  // -------------------------------------------------------------------
  const handleCreateNew = async () => {
    if (!newTitle.trim()) return;
    if (!user?.id) return alert('Sesi pengguna tidak ditemukan. Coba muat ulang halaman.');

    setMembuat(true);
    try {
      const baru = await createLatihan({
        materiId,
        title: newTitle.trim(),
        desc: 'Kerjakan soal-soal berikut dengan teliti dan jujur ya!',
        prerequisiteLkpdIds: selectedPrerequisites,
        guruId: user.id,
      });
      setLatihanList(prev => [...prev, baru]);
      setNewTitle('');
      setSelectedPrerequisites([]);
      setShowAddModal(false);
      setActiveLatihanId(baru.id);
      setCurrentView('editor');
    } catch (err) {
      alert(`Gagal membuat latihan: ${(err as Error).message}`);
    } finally {
      setMembuat(false);
    }
  };

  const handleCardClick = (latId: string) => {
    setActiveLatihanId(latId);
    setCurrentView(role === 'guru' ? 'editor' : 'viewer');
  };

  // --- Hapus & Pulihkan ---
  const requestDelete = (e: React.MouseEvent, lat: LatihanSet) => {
    e.stopPropagation();
    setItemToDelete(lat);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await softDeleteLatihan(itemToDelete.id);
      await muatData();
    } catch (err) {
      alert(`Gagal menghapus: ${(err as Error).message}`);
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    try { await restoreLatihan(id); await muatData(); }
    catch (err) { alert(`Gagal memulihkan: ${(err as Error).message}`); }
  };

  // -------------------------------------------------------------------
  if (currentView === 'editor' && activeLatihanId) {
    const activeItem = latihanList.find(l => l.id === activeLatihanId);
    if (!activeItem) { setCurrentView('list'); return null; }
    return (
      <LatihanBuilder
        latihanItem={activeItem}
        onSave={async (updated) => {
          await saveLatihan(updated);
          await muatData();
        }}
        onBack={() => { setCurrentView('list'); setActiveLatihanId(null); }}
      />
    );
  }

  if (currentView === 'viewer' && activeLatihanId) {
    const activeItem = latihanList.find(l => l.id === activeLatihanId);
    if (!activeItem) { setCurrentView('list'); return null; }
    return (
      <LatihanViewer
        latihanItem={activeItem}
        lkpdDb={lkpdDb}
        user={user || { id: 'siswa_1', role: 'siswa' }}
        isPreviewMode={role === 'guru'}
        onBack={() => { setCurrentView('list'); setActiveLatihanId(null); }}
      />
    );
  }

  // -------------------------------------------------------------------
  return (
    <div className="animate-in fade-in relative">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18} /></button>
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

      {pesanError && (
        <div className="p-4 mb-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-700 flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Data gagal dimuat.</p>
            <p className="mt-0.5">{pesanError}</p>
            <button onClick={muatData} className="mt-2 font-bold underline">Coba lagi</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-12 flex items-center justify-center gap-2 text-emerald-600">
          <Loader2 className="animate-spin" size={20} /> Memuat latihan…
        </div>
      ) : latihanList.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center">
          <p className="font-semibold text-slate-700">Belum ada latihan soal di bab ini.</p>
          <p className="text-sm text-slate-400 mt-1">
            {role === 'guru' ? 'Tekan tombol "Buat Latihan" untuk membuat yang pertama.' : 'Latihan akan muncul di sini setelah guru membuatnya.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {latihanList.map(lat => (
            <div key={lat.id} onClick={() => handleCardClick(lat.id)} className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4 cursor-pointer hover:border-emerald-400 transition-all relative group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex justify-center items-center shrink-0"><PenTool size={24} /></div>
              <div className="flex-1 pr-8">
                <h3 className="font-bold text-slate-800 truncate group-hover:text-emerald-600">{lat.title}</h3>
                <p className="text-xs text-slate-500">{lat.questions.length} Soal</p>
                {lat.prerequisiteLkpdIds.length > 0 && (
                  <span className="inline-block mt-2 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-md font-semibold">
                    Mewajibkan {lat.prerequisiteLkpdIds.length} LKPD
                  </span>
                )}
              </div>

              {role === 'guru' && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveLatihanId(lat.id); setCurrentView('viewer'); }}
                    className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl"
                    title="Pratinjau sebagai Siswa"
                  >
                    <FileBadge size={18} />
                  </button>
                  <button onClick={(e) => requestDelete(e, lat)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl" title="Hapus Latihan">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Floating Trash Button */}
      {role === 'guru' && trashList.length > 0 && (
        <div className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-40 animate-in slide-in-from-bottom-8">
          <button onClick={() => setShowTrashDrawer(true)} className="bg-slate-800 hover:bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 transition-colors">
            <div className="relative">
              <Trash2 size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-800">
                {trashList.length}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-semibold pr-2">Sampah Latihan</span>
          </button>
        </div>
      )}

      {/* Modal Buat Latihan Baru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Latihan Soal Baru</h3>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Judul Paket Latihan" className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl mb-4 text-sm outline-none focus:border-emerald-500" />

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
              <button onClick={handleCreateNew} disabled={membuat} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-xl flex items-center gap-2">
                {membuat && <Loader2 size={14} className="animate-spin" />}
                {membuat ? 'Membuat…' : 'Simpan & Buat Soal'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ReusableDeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Hapus Latihan Soal?"
        desc={`Latihan "${itemToDelete?.title}" akan dipindahkan ke Tong Sampah.`}
      />

      {/* Drawer Tong Sampah */}
      {showTrashDrawer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-start z-50 animate-in fade-in">
          <div className="bg-white border-r border-slate-200 w-full max-w-sm h-full p-6 text-slate-800 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Trash2 size={20} className="text-red-500" />
                  <span>Sampah Latihan</span>
                </div>
                <button onClick={() => setShowTrashDrawer(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                {trashList.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3 group">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.questions.length} Soal</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                      <span className="text-[10px] text-red-500 font-medium">Bisa dipulihkan kapan saja</span>
                      <button onClick={() => handleRestore(item.id)} className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                        <RotateCcw size={14} /> Pulihkan
                      </button>
                    </div>
                  </div>
                ))}
                {trashList.length === 0 && <p className="text-xs text-slate-400 text-center py-6">Tong sampah kosong.</p>}
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