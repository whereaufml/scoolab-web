import React, { useState } from 'react';
import { Eye, ArrowLeft, Check, Settings, Trash2, Plus, Loader2 } from 'lucide-react';
import { COVER_PRESETS, generateId } from '../constants';
import LkpdViewer from '../viewer/LkpdViewer';

// Interfaces...
interface InputData { id: string; label: string; type: string; isRequired?: boolean; allowedFormats?: string[]; }
interface BlockData { id: string; step: number; title: string; subtitle: string; icon: string; type: string; imageUrl: string; content: string; inputs?: InputData[]; }
interface LkpdData { id: string; materiId: string; title: string; subtitle: string; coverPreset: string; isDeleted: boolean; deletedAt: string | null; blocks: BlockData[]; }

interface LkpdBuilderProps {
  lkpd: LkpdData;
  onSave: (data: LkpdData) => Promise<void>; // Menyesuaikan agar tahu kapan loading selesai
  onBack: () => void;
}

const TIPE_BLOK_OPTIONS = [
  { value: 'instruction', label: 'Instruksi / Bacaan' },
  { value: 'input_group', label: 'Isian Jawaban Siswa' },
];

const TIPE_INPUT_OPTIONS = [
  { value: 'text', label: 'Teks singkat' },
  { value: 'number', label: 'Angka' },
  { value: 'file', label: 'Unggah file' },
];

const LkpdBuilder: React.FC<LkpdBuilderProps> = ({ lkpd, onSave, onBack }) => {
  const [formData, setFormData] = useState<LkpdData>(lkpd);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false); // State Loading 

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  // Seluruh fungsi pengelola Blok (handleAddBlock, handleDeleteBlock) tetap sama persis!
  const handleUpdateBlock = (blockId: string, updates: Partial<BlockData>) => { setFormData((p) => ({ ...p, blocks: (p.blocks || []).map((b) => b.id === blockId ? { ...b, ...updates } : b) })); };
  const handleAddBlock = () => { const currentBlocks = formData.blocks || []; const newStep = currentBlocks.length > 0 ? Math.max(...currentBlocks.map((b) => b.step)) + 1 : 1; const newBlock: BlockData = { id: generateId('blk'), step: newStep, title: 'Langkah Baru', subtitle: '', icon: 'PenTool', type: 'input_group', imageUrl: '', content: 'Instruksi pertanyaan...', inputs: [{ id: generateId('inp'), label: 'Pertanyaan:', type: 'text' }] }; setFormData((p) => ({ ...p, blocks: [...(p.blocks || []), newBlock] })); };
  const handleDeleteBlock = (blockId: string) => { setFormData((p) => ({ ...p, blocks: (p.blocks || []).filter((b) => b.id !== blockId) })); };
  const addInputToBlock = (blockId: string) => { setFormData((p) => ({ ...p, blocks: (p.blocks || []).map((b) => b.id === blockId ? { ...b, inputs: [...(b.inputs||[]), { id: generateId('inp'), label: 'Label pertanyaan baru', type: 'text', isRequired: true, allowedFormats: ['image/*', '.pdf'] }] } : b) })); };
  const removeInputFromBlock = (blockId: string, inputId: string) => { setFormData((p) => ({ ...p, blocks: (p.blocks || []).map((b) => b.id === blockId ? { ...b, inputs: (b.inputs || []).filter((i) => i.id !== inputId) } : b) })); };
  const updateInputField = (blockId: string, inputId: string, updates: Partial<InputData>) => {
    setFormData((p) => ({
      ...p,
      blocks: (p.blocks || []).map((b) => b.id === blockId
        ? { ...b, inputs: (b.inputs || []).map((i) => i.id === inputId ? { ...i, ...updates } : i) }
        : b),
    }));
  };

  if (isPreview) {
    return (
      <div className="bg-slate-50 min-h-screen relative">
        <div className="bg-slate-900 text-white p-3 text-center text-sm font-bold flex justify-center items-center gap-4 sticky top-0 z-[60] shadow-md">
           <Eye size={18} /> Mode Pratinjau (Preview) 
           <button onClick={() => setIsPreview(false)} className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">Tutup Preview</button>
        </div>
        <LkpdViewer lkpd={formData} onBack={() => setIsPreview(false)} isPreviewMode={true} />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen -m-4 sm:-m-8 p-4 sm:p-8 animate-in fade-in">
      {/* Tampilan Header Editor */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-40 mb-6">
        <button onClick={onBack} className="w-full sm:w-auto flex items-center justify-center gap-2 text-slate-600 hover:text-blue-600 font-medium text-sm px-4 py-2 bg-slate-50 rounded-xl"><ArrowLeft size={18}/> Kembali</button>
        <div className="font-bold text-slate-800 text-center flex-1">LKPD Editor</div>
        <div className="w-full sm:w-auto flex items-center justify-center gap-2">
          <button onClick={() => setIsPreview(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold text-sm px-4 py-2 rounded-xl"><Eye size={18}/> Preview</button>
          {/* Tombol Simpan Terhubung ke API */}
          <button onClick={handleSaveClick} disabled={isSaving} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold text-sm px-5 py-2 rounded-xl shadow-md disabled:bg-blue-400">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18}/>} 
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* Bagian Body Form (Sama persis seperti file asli agar UI Editor tidak rusak) */}
      <div className="max-w-4xl mx-auto space-y-6 pb-48">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-4 border-b border-slate-100 pb-3"><Settings size={18}/> Pengaturan Header LKPD</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Judul Utama</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sub-Judul</label>
              <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 focus:bg-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preset Ikon Gambar Latar</label>
              <div className="flex items-center gap-3">
                <select value={formData.coverPreset} onChange={e => setFormData({...formData, coverPreset: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white outline-none focus:border-blue-500 cursor-pointer">
                  {COVER_PRESETS.map((p: any) => <option key={p.id} value={p.id}>{p.label} ({p.icon})</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {(formData.blocks || []).sort((a: BlockData, b: BlockData) => a.step - b.step).map((block: BlockData) => (
          <div key={block.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative group">
            <button onClick={() => handleDeleteBlock(block.id)} className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 pr-10">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200 shrink-0">{block.step}</span>
              <input type="text" value={block.title} onChange={e => handleUpdateBlock(block.id, {title: e.target.value})} className="font-bold text-lg text-slate-800 border-b-2 border-transparent hover:border-slate-300 focus:border-blue-500 outline-none bg-transparent w-full transition-colors" placeholder="Judul Langkah..." />
            </div>

            {/* Pengaturan dasar blok: sub-judul, jenis blok, gambar pendukung, dan konten/instruksi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Sub-judul langkah</label>
                <input type="text" value={block.subtitle} onChange={e => handleUpdateBlock(block.id, { subtitle: e.target.value })} placeholder="Opsional" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis blok</label>
                <select value={block.type} onChange={e => handleUpdateBlock(block.id, { type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 focus:bg-white cursor-pointer">
                  {TIPE_BLOK_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">URL gambar pendukung (opsional)</label>
                <input type="text" value={block.imageUrl} onChange={e => handleUpdateBlock(block.id, { imageUrl: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 focus:bg-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Konten / instruksi</label>
                <textarea value={block.content} onChange={e => handleUpdateBlock(block.id, { content: e.target.value })} rows={3} placeholder="Tuliskan instruksi atau bacaan untuk langkah ini..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 focus:bg-white" />
              </div>
            </div>

            {/* Kolom jawaban siswa — hanya relevan kalau jenis blok "Isian Jawaban Siswa" */}
            {block.type === 'input_group' && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-600 mb-3">Kolom Jawaban Siswa</p>
                <div className="space-y-2">
                  {(block.inputs || []).map((inp) => (
                    <div key={inp.id} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <input
                        type="text"
                        value={inp.label}
                        onChange={e => updateInputField(block.id, inp.id, { label: e.target.value })}
                        placeholder="Label pertanyaan"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                      />
                      <select
                        value={inp.type}
                        onChange={e => updateInputField(block.id, inp.id, { type: e.target.value })}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white cursor-pointer"
                      >
                        {TIPE_INPUT_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 px-1 whitespace-nowrap">
                        <input type="checkbox" checked={inp.isRequired ?? true} onChange={e => updateInputField(block.id, inp.id, { isRequired: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
                        Wajib
                      </label>
                      <button onClick={() => removeInputFromBlock(block.id, inp.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0" title="Hapus kolom ini">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {(block.inputs || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">Belum ada kolom jawaban. Tambahkan minimal satu.</p>
                  )}
                </div>
                <button onClick={() => addInputToBlock(block.id)} className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  <Plus size={14} /> Tambah kolom jawaban
                </button>
              </div>
            )}
          </div>
        ))}

        <button onClick={handleAddBlock} className="w-full py-5 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 rounded-3xl font-bold flex items-center justify-center gap-2 transition-colors text-sm">
          <Plus size={20} /> Tambah Langkah / Blok Baru
        </button>
      </div>
    </div>
  );
};

export default LkpdBuilder;