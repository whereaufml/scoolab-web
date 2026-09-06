import React, { useState } from 'react';
import {
  ArrowLeft,
  Lightbulb,
  Upload,
  Paperclip,
  X,
  CheckSquare,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { COVER_PRESETS, IconMap } from '../constants'; // Pastikan path ini benar
import 'mathlive';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        onInput?: (e: any) => void;
      };
    }
  }
}
// 1. Mendefinisikan Tipe Data (Interfaces)
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
  title: string;
  subtitle: string;
  coverPreset: string;
  blocks: BlockData[];
}

interface LkpdViewerProps {
  lkpd: LkpdData;
  onBack: () => void;
  isPreviewMode: boolean;
}

// 2. Menerapkan Tipe pada Props Komponen
const LkpdViewer: React.FC<LkpdViewerProps> = ({ lkpd, onBack, isPreviewMode }) => {
  // 3. Menerapkan Tipe pada State
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  if (!lkpd) return null;

  // 4. Menerapkan Tipe pada Parameter Fungsi
  const handleAnswerChange = (inputId: string, val: any) => {
    setAnswers(p => ({ ...p, [inputId]: val }));
    if (errors.includes(inputId)) setErrors(p => p.filter(id => id !== inputId));
  };

  const handleFileChange = (inputId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAnswerChange(inputId, { name: file.name, type: file.type, size: file.size, file: file });
    }
  };

  const validateAndSubmit = () => {
    if (isPreviewMode) return;
    let missing: string[] = [];
    lkpd.blocks.forEach((b) => {
      if (b.inputs) {
        b.inputs.forEach((i) => {
          if (i.isRequired !== false && !answers[i.id]) missing.push(i.id);
        });
      }
    });
    
    if (missing.length > 0) {
      setErrors(missing);
      const firstMissing = document.getElementById(`input-container-${missing[0]}`);
      if (firstMissing) firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setShowSubmitModal(true);
    }
  };

  return (
    <div className="bg-[#f4f7ff] min-h-screen -m-4 sm:-m-8 p-4 sm:p-8 font-sans animate-in fade-in">
      <div className="max-w-3xl mx-auto mb-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm text-slate-600 hover:text-blue-600">
          <ArrowLeft size={20}/>
        </button>
        <div className="font-semibold text-slate-800 truncate">{lkpd.title}</div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6 pb-24">
        
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="relative z-10 text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight uppercase">{lkpd.title}</h1>
            <p className="text-blue-600 font-medium mt-2 text-sm sm:text-base bg-blue-50 px-3 py-1 rounded-full inline-block">{lkpd.subtitle}</p>
          </div>
          <div className="text-7xl shrink-0 drop-shadow-md z-10">
            {COVER_PRESETS.find(p => p.id === lkpd.coverPreset)?.icon || '📖'}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        </div>

        {(lkpd?.blocks || []).sort((a,b) => a.step - b.step).map((block) => {
          // 5. Penanganan tipe Ikon Dinamis
          const IconCmp = (IconMap as any)[block.icon] || BookOpen;
          
          return (
            <div key={block.id} className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 relative mb-6">
              <div className="flex items-start gap-4 mb-4 border-b border-slate-50 pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                  {block.step}
                </div>
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">{block.title}</h3>
                    {block.subtitle && <p className="text-xs font-bold text-blue-600 mt-0.5">{block.subtitle}</p>}
                  </div>
                  <IconCmp size={28} className="text-slate-400 mt-1" />
                </div>
              </div>

              <div className="pl-0 sm:pl-14 space-y-4">
                
                {block.type === 'highlight' && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                    <Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{block.content}</div>
                  </div>
                )}

                {block.type !== 'highlight' && block.content && (
                  <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {block.content}
                  </div>
                )}

                {block.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={block.imageUrl} 
                      alt="Ilustrasi LKPD" 
                      className="rounded-2xl max-w-full h-auto border border-slate-200 shadow-sm" 
                      // 6. Perbaikan Tipe Event pada element Gambar
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => { 
                        (e.currentTarget as HTMLImageElement).style.display = 'none'; 
                      }} 
                    />
                  </div>
                )}

                {block.inputs && block.inputs.length > 0 && (
                  <div className="space-y-5 pt-2">
                    {block.inputs.map((inp) => {
                      const isErr = errors.includes(inp.id);
                      const val = answers[inp.id] || '';
                      const isReq = inp.isRequired !== false; 
                      
                      return (
                      <div key={inp.id} id={`input-container-${inp.id}`} className={`p-2 rounded-2xl transition-colors ${isErr ? 'bg-red-50 -mx-2 px-4 py-3 border border-red-100' : ''}`}>
                        {inp.label && (
                          <label className="flex items-center gap-1 text-xs font-bold text-blue-800 mb-2 ml-1">
                            {inp.label} 
                            {isReq && <span className="text-red-500" title="Wajib Diisi">*</span>}
                            {isErr && <span className="text-red-600 ml-2 text-[10px] bg-red-100 px-2 py-0.5 rounded-full animate-pulse">Wajib diisi!</span>}
                          </label>
                        )}
                       {inp.type === 'textarea' ? (
  <textarea value={val} onChange={e=>handleAnswerChange(inp.id, e.target.value)} rows={3} placeholder="Tulis jawabanmu di sini..." className={`w-full bg-white border-2 ${isErr?'border-red-300 focus:border-red-500':'border-slate-100 focus:border-blue-400'} rounded-2xl p-3 text-sm text-slate-800 outline-none transition-colors resize-none shadow-inner`} />
) : inp.type === 'file' ? (
  <div className="flex flex-col gap-2">
    {!val ? (
      <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed ${isErr?'border-red-300 bg-red-50':'border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-400'} rounded-2xl p-6 cursor-pointer transition-colors group`}>
        <Upload className={`mb-2 ${isErr?'text-red-400':'text-slate-400 group-hover:text-blue-500 transition-colors'}`} size={28} />
        <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">Pilih / Ambil Foto & Dokumen</span>
        <span className="text-[10px] text-slate-400 mt-1 text-center max-w-xs leading-relaxed">Mendukung Kamera HP.<br/>Format Diizinkan: {(inp.allowedFormats && inp.allowedFormats.length > 0 ? inp.allowedFormats : ['Semua']).join(', ')}</span>
        <input type="file" className="hidden" accept={(inp.allowedFormats||[]).join(',')} onChange={(e)=>handleFileChange(inp.id, e)} />
      </label>
    ) : (
      <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm"><Paperclip size={20}/></div>
          <div className="min-w-0 pr-4">
            <p className="text-sm font-bold text-blue-900 truncate">{val.name}</p>
            <p className="text-[10px] text-blue-600 font-medium mt-0.5">Berhasil dipilih, siap diunggah.</p>
          </div>
        </div>
        <button onClick={() => handleAnswerChange(inp.id, '')} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shrink-0 shadow-sm border border-transparent hover:border-red-100" title="Hapus File"><X size={18}/></button>
      </div>
    )}
  </div>
) : inp.type === 'math' ? (
  <div className={`w-full bg-white border-2 ${isErr?'border-red-300':'border-slate-100 hover:border-blue-400'} rounded-2xl p-2 transition-colors shadow-inner overflow-hidden flex items-center`}>
    {/* @ts-expect-error: math-field adalah elemen kustom dari mathlive */}
    <math-field
      value={val}
      onInput={(e: any) => handleAnswerChange(inp.id, e.target.value)}
      style={{ width: '100%', fontSize: '1.125rem', border: 'none', outline: 'none', backgroundColor: 'transparent' }}
    >
    {/* @ts-expect-error */}
    </math-field>
  </div>
) : (
  <input type="text" value={val} onChange={e=>handleAnswerChange(inp.id, e.target.value)} placeholder="Ketik jawaban singkat di sini..." className={`w-full bg-white border-2 ${isErr?'border-red-300 focus:border-red-500':'border-slate-100 focus:border-blue-400'} rounded-2xl p-3 text-sm text-slate-800 outline-none transition-colors shadow-inner`} />
)}
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {!isPreviewMode && (
          <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-10">
            <button onClick={validateAndSubmit} className="w-full max-w-sm py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transform transition-transform active:scale-95">
              <CheckSquare size={20} /> Kumpulkan Jawaban
            </button>
          </div>
        )}
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle size={40} />
            </div>
            <h3 className="font-extrabold text-2xl text-slate-900 mb-2">Luar Biasa!</h3>
            <p className="text-sm text-slate-600 mb-6">Jawaban dan file kerjamu berhasil dikumpulkan. Teruskan semangat belajarmu!</p>
            <button onClick={() => {setShowSubmitModal(false); onBack();}} className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-md transition-all">
              Kembali ke Materi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LkpdViewer;