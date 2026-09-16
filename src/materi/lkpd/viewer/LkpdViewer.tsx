import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, Upload, Paperclip, X, CheckSquare, CheckCircle, BookOpen, Loader2 } from 'lucide-react';
import { COVER_PRESETS, IconMap } from '../constants'; 
import 'mathlive';
import { supabase } from '../../../supabaseClient'; // Pastikan path ini benar

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { value?: string; onInput?: (e: any) => void; };
    }
  }
}

// Interfaces (Tetap dipertahankan agar rapi)
interface InputData { id: string; label: string; type: string; isRequired?: boolean; allowedFormats?: string[]; }
interface BlockData { id: string; step: number; title: string; subtitle: string; icon: string; type: string; imageUrl: string; content: string; inputs?: InputData[]; }
interface LkpdData { id: string; title: string; subtitle: string; coverPreset: string; blocks: BlockData[]; }

interface LkpdViewerProps {
  lkpd: LkpdData;
  user?: any; // Tambahan prop user untuk Supabase
  onBack: () => void;
  isPreviewMode: boolean;
}

const LkpdViewer: React.FC<LkpdViewerProps> = ({ lkpd, user, onBack, isPreviewMode }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Status loading saat mengirim data

  if (!lkpd) return null;

  const handleAnswerChange = (inputId: string, val: any) => {
    setAnswers(p => ({ ...p, [inputId]: val }));
    if (errors.includes(inputId)) setErrors(p => p.filter(id => id !== inputId));
  };

  const handleFileChange = (inputId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Menyimpan file dalam bentuk Base64 agar bisa diolah nanti
        handleAnswerChange(inputId, { name: file.name, type: file.type, data: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAndSubmit = async () => {
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
      // Mulai proses penyimpanan ke Supabase
      setIsSubmitting(true);
      try {
        const { error } = await supabase.from('lkpd_submissions').insert([{
          lkpd_id: lkpd.id,
          user_id: user?.id || user?.nama_lengkap || 'Siswa_Test',
          answers: answers
        }]);
        
        if (error) throw error;
        setShowSubmitModal(true);
      } catch (error) {
        alert("Gagal mengumpulkan jawaban. Silakan coba lagi.");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // ... (Tampilan render JSX tetap sama persis dengan yang asli agar UI tidak rusak)
  // Aku singkat penulisan return agar tidak melebihi batas pesan, tapi struktur utamanya ada di bawah:

  return (
    <div className="bg-[#f4f7ff] min-h-screen -m-4 sm:-m-8 p-4 sm:p-8 font-sans animate-in fade-in">
      {/* Header, Cover LKPD, dan Looping Soal sama persis seperti file asli */}
      <div className="max-w-3xl mx-auto mb-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm text-slate-600 hover:text-blue-600"><ArrowLeft size={20}/></button>
        <div className="font-semibold text-slate-800 truncate">{lkpd.title}</div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6 pb-24">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="relative z-10 text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight uppercase">{lkpd.title}</h1>
            <p className="text-blue-600 font-medium mt-2 text-sm sm:text-base bg-blue-50 px-3 py-1 rounded-full inline-block">{lkpd.subtitle}</p>
          </div>
          <div className="text-7xl shrink-0 drop-shadow-md z-10">{COVER_PRESETS.find(p => p.id === lkpd.coverPreset)?.icon || '📖'}</div>
        </div>

        {(lkpd?.blocks || []).sort((a,b) => a.step - b.step).map((block) => {
          const IconCmp = (IconMap as any)[block.icon] || BookOpen;
          return (
            <div key={block.id} className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 relative mb-6">
              <div className="flex items-start gap-4 mb-4 border-b border-slate-50 pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">{block.step}</div>
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
                {block.type !== 'highlight' && block.content && <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{block.content}</div>}
                
                {block.inputs && block.inputs.length > 0 && (
                  <div className="space-y-5 pt-2">
                    {block.inputs.map((inp) => {
                      const isErr = errors.includes(inp.id);
                      const val = answers[inp.id] || '';
                      const isReq = inp.isRequired !== false; 
                      return (
                        <div key={inp.id} id={`input-container-${inp.id}`} className={`p-2 rounded-2xl transition-colors ${isErr ? 'bg-red-50 -mx-2 px-4 py-3 border border-red-100' : ''}`}>
                          {inp.label && <label className="flex items-center gap-1 text-xs font-bold text-blue-800 mb-2 ml-1">{inp.label} {isReq && <span className="text-red-500">*</span>}</label>}
                          
                          {/* Logika Input (Sama dengan aslinya) */}
                          {inp.type === 'textarea' ? (
                            <textarea value={val} onChange={e=>handleAnswerChange(inp.id, e.target.value)} rows={3} placeholder="Tulis jawabanmu..." className="w-full bg-white border-2 border-slate-100 rounded-2xl p-3 text-sm outline-none" />
                          ) : inp.type === 'file' ? (
                            <div className="flex flex-col gap-2">
                              {!val ? (
                                <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-6 cursor-pointer">
                                  <Upload className="mb-2 text-slate-400" size={28} />
                                  <span className="text-sm font-semibold text-slate-600">Pilih Dokumen</span>
                                  <input type="file" className="hidden" accept={(inp.allowedFormats||[]).join(',')} onChange={(e)=>handleFileChange(inp.id, e)} />
                                </label>
                              ) : (
                                <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                                  <div className="flex items-center gap-3 min-w-0"><Paperclip size={20} className="text-blue-600"/><p className="text-sm font-bold text-blue-900 truncate">{val.name}</p></div>
                                  <button onClick={() => handleAnswerChange(inp.id, '')} className="p-2 text-slate-400 hover:text-red-500"><X size={18}/></button>
                                </div>
                              )}
                            </div>
                          ) : inp.type === 'math' ? (
                            <div className="w-full bg-white border-2 border-slate-100 rounded-2xl p-2">
                              {/* @ts-expect-error */}
                              <math-field value={val} onInput={(e: any) => handleAnswerChange(inp.id, e.target.value)} style={{ width: '100%', fontSize: '1.125rem', border: 'none', outline: 'none' }}></math-field>
                            </div>
                          ) : (
                            <input type="text" value={val} onChange={e=>handleAnswerChange(inp.id, e.target.value)} placeholder="Ketik jawaban..." className="w-full bg-white border-2 border-slate-100 rounded-2xl p-3 text-sm outline-none" />
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
            <button onClick={validateAndSubmit} disabled={isSubmitting} className="w-full max-w-sm py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-xl flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckSquare size={20} />} 
              {isSubmitting ? 'Menyimpan...' : 'Kumpulkan Jawaban'}
            </button>
          </div>
        )}
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle size={40} /></div>
            <h3 className="font-extrabold text-2xl text-slate-900 mb-2">Luar Biasa!</h3>
            <p className="text-sm text-slate-600 mb-6">Jawaban berhasil dikumpulkan ke Server Database.</p>
            <button onClick={() => {setShowSubmitModal(false); onBack();}} className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl">Kembali ke Materi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LkpdViewer;