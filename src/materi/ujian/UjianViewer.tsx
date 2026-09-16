import React, { useState, useEffect } from 'react';
import { Clock, Send, FileText, Image as ImageIcon, ArrowLeft, Loader2 } from 'lucide-react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { supabase } from '../../supabaseClient'; // Pastikan path ini benar

interface UjianViewerProps {
  ujianItem: any;
  user: any;
  onBack: () => void;
}

const UjianViewer: React.FC<UjianViewerProps> = ({ ujianItem, user, onBack }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ujianItem.duration * 60);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleAutoSubmit(); // Otomatis mengirim ke DB saat waktu habis
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [isSubmitted, timeLeft]);

  // Fungsi khusus untuk menyimpan ke Supabase
  const submitToDatabase = async (finalAnswers: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('ujian_submissions').insert([{
        ujian_id: ujianItem.id,
        user_id: user.id || user.nama, // Ganti jika kamu punya ID khusus siswa
        answers: finalAnswers
      }]);
      if (error) throw error;
      setIsSubmitted(true);
    } catch (error) {
      alert("Gagal mengumpulkan ujian ke server. Mohon jangan keluar halaman ini, hubungi guru!");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    alert("Waktu habis! Jawaban Anda sedang dikumpulkan...");
    await submitToDatabase(answers);
  };

  const handleBackClick = () => {
    if (!isSubmitted) {
      const confirmLeave = window.confirm("PERINGATAN! Anda sedang dalam sesi ujian. Jika Anda keluar, waktu akan terus berjalan. Yakin ingin keluar?");
      if (!confirmLeave) return;
    }
    onBack();
  };

  const handleSubmit = async () => {
    const unanswered = ujianItem.questions?.filter((q: any) => {
      if (q.type === 'multiple_choice') return !answers[q.id];
      if (q.type === 'essay') return !answers[q.id]?.text?.trim(); 
      return true;
    }) || [];

    if (unanswered.length > 0) {
      alert(`Peringatan! Masih ada ${unanswered.length} soal yang belum dijawab. Harap jawab SEMUA soal.`);
      return; 
    }

    if (window.confirm("Yakin ingin mengumpulkan ujian sekarang?")) {
      await submitToDatabase(answers);
    }
  };

  const handleImageUpload = (qId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], imageUrl: reader.result } }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isSubmitted) {
    return (
      <div className="p-6 sm:p-8 text-center max-w-md mx-auto bg-slate-800 text-slate-200 rounded-3xl border border-slate-700 shadow-xl mt-12 animate-in fade-in">
        <FileText size={40} className="mx-auto mb-4 text-emerald-400" />
        <h3 className="font-bold text-xl mb-2 text-white">Ujian Selesai</h3>
        <p className="text-sm text-slate-400 mb-6">Jawaban Anda telah direkam dengan aman ke sistem (*Database*). Silakan menunggu hasil evaluasi dari guru.</p>
        <button onClick={onBack} className="w-full sm:w-auto px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-xl">Kembali ke Menu</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 overflow-y-auto">
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <button onClick={handleBackClick} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl shrink-0"><ArrowLeft size={20}/></button>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-slate-100 truncate">{ujianItem.title}</h2>
              <p className="text-xs text-slate-400 truncate">{user?.nama_lengkap || 'Siswa'} • {ujianItem.questions?.length} Soal</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-mono text-sm sm:text-lg font-bold shrink-0 ${timeLeft < 300 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
            <Clock size={18} />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-6 sm:py-8 space-y-6">
        {/* Konten soal ujian (Sama dengan aslinya) */}
        {ujianItem.questions?.map((q: any, idx: number) => (
          <div key={q.id} className="bg-slate-800 p-5 sm:p-6 rounded-3xl border border-slate-700 shadow-xl">
            <span className="inline-block px-3 py-1 bg-slate-700 text-slate-300 text-xs font-bold rounded-lg mb-4">Soal {idx + 1}</span>
            <p className="text-sm sm:text-base font-medium text-slate-100 mb-4"><Latex>{q.content}</Latex></p>

            {q.type === 'multiple_choice' && (
              <div className="space-y-3">
                {q.options.map((opt: any, optIdx: number) => (
                  <label key={opt.id} className={`flex items-start sm:items-center gap-3 p-3 sm:p-4 rounded-2xl border cursor-pointer ${answers[q.id] === opt.id ? 'bg-indigo-600/20 border-indigo-500 text-indigo-100' : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
                    <input type="radio" name={q.id} checked={answers[q.id] === opt.id} onChange={() => setAnswers({ ...answers, [q.id]: opt.id })} className="mt-1 sm:mt-0 w-4 h-4 accent-indigo-500 shrink-0" />
                    <span className="text-sm">{String.fromCharCode(65 + optIdx)}. <Latex>{opt.text}</Latex></span>
                  </label>
                ))}
              </div>
            )}

            {q.type === 'essay' && (
              <div className="space-y-4">
                <textarea value={answers[q.id]?.text || ''} onChange={(e) => setAnswers({ ...answers, [q.id]: { ...answers[q.id], text: e.target.value } })} placeholder="Ketik jawaban Anda..." className="w-full p-4 border border-slate-700 bg-slate-900/50 text-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 min-h-[100px]" />
                <div className="p-4 border border-dashed border-slate-600 rounded-xl bg-slate-900/30 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-indigo-400 hover:text-indigo-300 w-fit">
                      <ImageIcon size={18} /> <span className="font-semibold">Unggah Foto Coretan (Opsional)</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(q.id, e)} className="hidden" />
                    </label>
                  </div>
                  {answers[q.id]?.imageUrl && (
                    <div className="relative inline-block w-fit">
                      <img src={answers[q.id].imageUrl} alt="Bukti Hitungan" className="h-24 sm:h-32 rounded-lg border border-slate-600 object-cover" />
                      <button onClick={() => setAnswers({ ...answers, [q.id]: { ...answers[q.id], imageUrl: null } })} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full text-xs">X</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full mt-4 sm:mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          {isSubmitting ? 'Mengirim ke Server...' : 'Selesaikan Ujian & Kirim Jawaban'}
        </button>
      </div>
    </div>
  );
};

export default UjianViewer;