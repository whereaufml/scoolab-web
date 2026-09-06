import React, { useState } from 'react';
import {
  Eye, ArrowLeft, Check, Settings, Trash2, BookOpen, CheckSquare, X, Plus
} from 'lucide-react';

import { COVER_PRESETS, IconMap, generateId } from '../constants'; 
import LkpdViewer from '../viewer/LkpdViewer';

interface InputData {
  id: string;
  label: string;
  type: string;
  isRequired?: boolean;
  allowedFormats?: string[];
}

interface BlockData {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  icon: string;
  type: string;
  imageUrl: string;
  content: string;
  inputs?: InputData[];
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

interface LkpdBuilderProps {
  lkpd: LkpdData;
  onSave: (data: LkpdData) => void;
  onBack: () => void;
}

const LkpdBuilder: React.FC<LkpdBuilderProps> = ({ lkpd, onSave, onBack }) => {
  const [formData, setFormData] = useState<LkpdData>(lkpd);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const handleUpdateBlock = (blockId: string, updates: Partial<BlockData>) => {
    setFormData((p) => ({ ...p, blocks: (p.blocks || []).map((b) => b.id === blockId ? { ...b, ...updates } : b) }));
  };

  const handleAddBlock = () => {
    const currentBlocks = formData.blocks || []; // Mencegah error jika blocks kosong
    const newStep = currentBlocks.length > 0 ? Math.max(...currentBlocks.map((b) => b.step)) + 1 : 1;
    
    const newBlock: BlockData = { 
      id: generateId('blk'), 
      step: newStep, 
      title: 'Langkah Baru', 
      subtitle: '', 
      icon: 'PenTool', 
      type: 'input_group', 
      imageUrl: '', 
      content: 'Instruksi pertanyaan...', 
      inputs: [{ id: generateId('inp'), label: 'Pertanyaan:', type: 'text' }] 
    };
    
    setFormData((p) => ({ ...p, blocks: [...(p.blocks || []), newBlock] }));
  };

  const handleDeleteBlock = (blockId: string) => {
    setFormData((p) => ({ ...p, blocks: (p.blocks || []).filter((b) => b.id !== blockId) }));
  };

  const addInputToBlock = (blockId: string) => {
    setFormData((p) => ({ 
      ...p, 
      blocks: (p.blocks || []).map((b) => b.id === blockId ? { 
        ...b, 
        inputs: [...(b.inputs||[]), { id: generateId('inp'), label: 'Label pertanyaan baru', type: 'text', isRequired: true, allowedFormats: ['image/*', '.pdf'] }] 
      } : b) 
    }));
  };

  const removeInputFromBlock = (blockId: string, inputId: string) => {
    setFormData((p) => ({ 
      ...p, 
      blocks: (p.blocks || []).map((b) => b.id === blockId ? { 
        ...b, 
        inputs: (b.inputs || []).filter((i) => i.id !== inputId) 
      } : b) 
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
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-40 mb-6">
        <button onClick={onBack} className="w-full sm:w-auto flex items-center justify-center gap-2 text-slate-600 hover:text-blue-600 font-medium text-sm px-4 py-2 bg-slate-50 rounded-xl"><ArrowLeft size={18}/> Kembali</button>
        <div className="font-bold text-slate-800 text-center flex-1">LKPD Editor</div>
        <div className="w-full sm:w-auto flex items-center justify-center gap-2">
          <button onClick={() => setIsPreview(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold text-sm px-4 py-2 rounded-xl"><Eye size={18}/> Preview</button>
          <button onClick={() => onSave(formData)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold text-sm px-5 py-2 rounded-xl shadow-md"><Check size={18}/> Simpan</button>
        </div>
      </div>

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
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                  {COVER_PRESETS.find((p: any) => p.id === formData.coverPreset)?.icon || '📖'}
                </div>
              </div>
            </div>
          </div>
        </div>

{(formData.blocks || []).sort((a: BlockData, b: BlockData) => a.step - b.step).map((block: BlockData) => (          <div key={block.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative group">
            <button onClick={() => handleDeleteBlock(block.id)} className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
            
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 pr-10">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200 shrink-0">{block.step}</span>
              <input type="text" value={block.title} onChange={e => handleUpdateBlock(block.id, {title: e.target.value})} className="font-bold text-lg text-slate-800 border-b-2 border-transparent hover:border-slate-300 focus:border-blue-500 outline-none bg-transparent w-full transition-colors" placeholder="Judul Langkah..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Sub-Judul</label>
                <input type="text" value={block.subtitle} onChange={e => handleUpdateBlock(block.id, {subtitle: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 bg-slate-50" placeholder="Kutipan/Opsional..." />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Pilih Ikon Layar</label>
                <div className="flex gap-2 items-center">
                  <select value={block.icon} onChange={e => handleUpdateBlock(block.id, {icon: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:border-blue-500">
                    {Object.keys(IconMap).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    {React.createElement((IconMap as any)[block.icon] || BookOpen, { size: 16 })}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Tipe Blok</label>
                <select value={block.type} onChange={e => handleUpdateBlock(block.id, {type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:border-blue-500 mb-1">
                  <option value="text">Teks / Penjelasan</option>
                  <option value="highlight">Kotak Info / Penting</option>
                  <option value="input_group">Teks + Kotak Isian</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5 flex items-center gap-1">Konten / Teks Utama</label>
              <textarea rows={4} value={block.content} onChange={e => handleUpdateBlock(block.id, {content: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-y outline-none focus:border-blue-500 bg-slate-50" placeholder="Ketik penjelasan soal atau instruksi materi di sini..." />
            </div>

            {block.type === 'input_group' && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2"><CheckSquare size={14}/> Daftar Form Isian</span>
                  <button onClick={() => addInputToBlock(block.id)} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm w-fit">+ Tambah Isian</button>
                </div>
                <div className="space-y-4">
                  {(block.inputs||[]).map((inp: InputData, iIdx: number) => (
                    <div key={inp.id} className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="hidden sm:block text-xs text-slate-400 font-bold px-1">{iIdx+1}.</span>
                        <input type="text" value={inp.label} onChange={e => {
                          const newInps = [...(block.inputs || [])]; newInps[iIdx].label = e.target.value; handleUpdateBlock(block.id, {inputs: newInps});
                        }} className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-400 bg-slate-50 w-full font-semibold text-slate-700" placeholder="Label pertanyaan..." />
                        <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                          <select value={inp.type} onChange={e => {
                            const newInps = [...(block.inputs || [])]; newInps[iIdx].type = e.target.value; handleUpdateBlock(block.id, {inputs: newInps});
                          }} className="flex-1 sm:w-36 px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-400 cursor-pointer">
                            <option value="text">Teks Pendek</option>
                            <option value="textarea">Paragraf Panjang</option>
                            <option value="file">Unggah File</option>
                            <option value="math">Matematika (Keyboard)</option>
                          </select>
                          <button onClick={() => removeInputFromBlock(block.id, inp.id)} className="p-2 bg-red-50 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-colors shadow-sm"><X size={16}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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