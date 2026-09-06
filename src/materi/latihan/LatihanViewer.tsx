import React, { useState } from 'react';
import { ArrowLeft, Lock, CheckCircle2, Send } from 'lucide-react';
interface LatihanViewerProps {
  latihanItem: any;
  lkpdDb: any[];
  user: any;
  onBack: () => void;
}

const LatihanViewer: React.FC<LatihanViewerProps> = ({ latihanItem, user, onBack }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const prerequisiteIds = latihanItem.prerequisiteLkpdIds || [];
  const uncompletedPrerequisites = prerequisiteIds.filter((lkpdId: string) => {
    const savedSubmissions = localStorage.getItem(`scool_lkpd_sub_${lkpdId}`);
    if (!savedSubmissions) return true;
    const subs = JSON.parse(savedSubmissions);
    return !subs[user.id];
  });

  const isLocked = user.role === 'siswa' && uncompletedPrerequisites.length > 0;

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers({ ...answers, [qId]: val });
  };

  const handleSubmit = () => {
    // Mengecek apakah ada soal wajib yang terlewat
    const unansweredRequired = latihanItem.questions?.filter((q: any) => {
      if (!q.isRequired) return false;
      const answer = answers[q.id];
      return !answer || answer.trim() === '';
    });

    if (unansweredRequired && unansweredRequired.length > 0) {
      alert(`Mohon periksa kembali! Ada ${unansweredRequired.length} soal wajib (bertanda *) yang belum kamu jawab.`);
      return;
    }

    if (window.confirm("Apakah kamu yakin ingin mengumpulkan jawaban latihan ini?")) {
      setIsSubmitted(true);
      localStorage.setItem(`scool_lat_sub_${latihanItem.id}_${user.id}`, JSON.stringify(answers));
    }
  };

  if (isLocked) {
    return (
      <div className="p-8 text-center max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm mt-12">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={28} />
        </div>
        <h3 className="font-bold text-xl text-slate-800 mb-2">Latihan Masih Terkunci</h3>
        <p className="text-sm text-slate-500 mb-6">Kamu harus menyelesaikan LKPD prasyarat yang ditentukan oleh guru terlebih dahulu sebelum dapat membuka latihan soal ini.</p>
        <button onClick={onBack} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">Kembali</button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18}/></button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{latihanItem.title}</h2>
          <p className="text-xs text-slate-500">{latihanItem.desc}</p>
        </div>
      </div>

      {isSubmitted && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 flex items-center gap-3">
          <CheckCircle2 size={24} />
          <div>
            <h4 className="font-bold text-sm">Jawaban Berhasil Dikirim!</h4>
            <p className="text-xs">Terima kasih sudah mengerjakan latihan soal ini dengan jujur.</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {latihanItem.questions?.map((q: any, idx: number) => (
          <div key={q.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg mb-3">
              Soal #{idx + 1}
              {/* Tanda bintang merah jika wajib dijawab */}
              {q.isRequired && <span className="text-red-500 ml-1 font-bold text-sm">*</span>}
            </span>
            <p className="text-sm font-medium text-slate-800 mb-4 whitespace-pre-line">{q.content}</p>

            {q.type === 'multiple_choice' && (
              <div className="space-y-2">
                {q.options.map((opt: any, optIdx: number) => (
                  <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${answers[q.id] === opt.id ? 'bg-blue-50 border-blue-500 text-blue-900' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                    <input type="radio" name={q.id} checked={answers[q.id] === opt.id} onChange={() => handleAnswerChange(q.id, opt.id)} className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-500 w-5">{String.fromCharCode(65 + optIdx)}.</span>
                    <span className="text-sm">{opt.text}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === 'short_answer' && (
              <input type="text" value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} disabled={isSubmitted} placeholder="Tulis jawaban singkat di sini..." className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-blue-500" />
            )}

            {q.type === 'essay' && (
              <textarea value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} disabled={isSubmitted} placeholder="Tuliskan langkah dan jawaban lengkap di sini..." className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-blue-500" rows={4} />
            )}
          </div>
        ))}
      </div>

      {!isSubmitted && (
        <button onClick={handleSubmit} className="w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm">
          <Send size={16} /> Submit Jawaban
        </button>
      )}
    </div>
  );
};

export default LatihanViewer;
