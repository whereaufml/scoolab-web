import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { generateId } from '../lkpd/constants';

interface LatihanBuilderProps {
  latihanItem: any;
  onSave: (updatedLatihan: any) => void;
  onBack: () => void;
}

const LatihanBuilder: React.FC<LatihanBuilderProps> = ({ latihanItem, onSave, onBack }) => {
  const [questions, setQuestions] = useState<any[]>(latihanItem.questions || []);
  const [title, setTitle] = useState(latihanItem.title);
  const [desc, setDesc] = useState(latihanItem.desc);

  const addQuestion = (type: 'multiple_choice' | 'short_answer' | 'essay') => {
    const newQ: any = {
      id: generateId('q'),
      type,
      content: '',
      isRequired: false, // Default: soal tidak wajib dijawab
    };
    if (type === 'multiple_choice') {
      newQ.options = [
        { id: generateId('opt'), text: '', isCorrect: false },
        { id: generateId('opt'), text: '', isCorrect: false },
        { id: generateId('opt'), text: '', isCorrect: false },
        { id: generateId('opt'), text: '', isCorrect: false }
      ];
    } else if (type === 'short_answer') {
      newQ.correctAnswer = '';
    }
    setQuestions([...questions, newQ]);
  };

  const updateQuestionContent = (qId: string, val: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, content: val } : q));
  };

  const toggleRequired = (qId: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, isRequired: !q.isRequired } : q));
  };

  const updateOptionText = (qId: string, optId: string, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id !== qId) return q;
      const updatedOpts = q.options.map((opt: any) => opt.id === optId ? { ...opt, text } : opt);
      return { ...q, options: updatedOpts };
    }));
  };

  const setCorrectOption = (qId: string, optId: string) => {
    setQuestions(questions.map(q => {
      if (q.id !== qId) return q;
      const updatedOpts = q.options.map((opt: any) => ({ ...opt, isCorrect: opt.id === optId }));
      return { ...q, options: updatedOpts };
    }));
  };

  const deleteQuestion = (qId: string) => {
    setQuestions(questions.filter(q => q.id !== qId));
  };

  const handleSaveAll = () => {
    onSave({
      ...latihanItem,
      title,
      desc,
      questions
    });
    alert('Paket latihan berhasil disimpan!');
    onBack();
  };

  return (
    <div className="animate-in fade-in max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18}/></button>
          <h2 className="text-xl font-bold text-slate-800">Editor Paket Latihan</h2>
        </div>
        <button onClick={handleSaveAll} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm">Simpan Perubahan</button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Judul Latihan</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Petunjuk Pengerjaan</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-blue-500" rows={2} />
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">Soal #{idx + 1} ({q.type.replace('_', ' ').toUpperCase()})</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600">
                  <input type="checkbox" checked={q.isRequired || false} onChange={() => toggleRequired(q.id)} className="w-4 h-4 text-blue-600 rounded" />
                  Wajib dijawab
                </label>
                <button onClick={() => deleteQuestion(q.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={16}/></button>
              </div>
            </div>

            <textarea placeholder="Tuliskan pertanyaan atau soal di sini (mendukung format teks/rumus)..." value={q.content} onChange={e => updateQuestionContent(q.id, e.target.value)} className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-blue-500 mb-4" rows={3} />

            {q.type === 'multiple_choice' && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-600 mb-2">Pilihan Jawaban (Klik ikon centang untuk menandai jawaban benar):</p>
                {q.options.map((opt: any, optIdx: number) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button type="button" onClick={() => setCorrectOption(q.id, opt.id)} className={`p-2.5 rounded-xl border transition-colors ${opt.isCorrect ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 text-slate-300 border-slate-200 hover:text-slate-500'}`}><CheckCircle2 size={16}/></button>
                    <span className="text-xs font-bold text-slate-500 w-6">{String.fromCharCode(65 + optIdx)}.</span>
                    <input type="text" value={opt.text} onChange={e => updateOptionText(q.id, opt.id, e.target.value)} placeholder={`Teks pilihan ${String.fromCharCode(65 + optIdx)}`} className="flex-1 p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-blue-500" />
                  </div>
                ))}
              </div>
            )}

            {q.type === 'short_answer' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Kunci Jawaban Singkat</label>
                <input type="text" value={q.correctAnswer || ''} onChange={e => setQuestions(questions.map(item => item.id === q.id ? { ...item, correctAnswer: e.target.value } : item))} placeholder="Contoh: x=4, y=2" className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-blue-500" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        <button onClick={() => addQuestion('multiple_choice')} className="px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs rounded-xl flex items-center gap-2 border border-blue-200"><Plus size={14}/> Tambah Pilihan Ganda</button>
        <button onClick={() => addQuestion('short_answer')} className="px-4 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-semibold text-xs rounded-xl flex items-center gap-2 border border-emerald-200"><Plus size={14}/> Tambah Isian Singkat</button>
        <button onClick={() => addQuestion('essay')} className="px-4 py-2.5 bg-purple-50 text-purple-600 hover:bg-purple-100 font-semibold text-xs rounded-xl flex items-center gap-2 border border-purple-200"><Plus size={14}/> Tambah Uraian</button>
      </div>
    </div>
  );
};

export default LatihanBuilder;
