import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Clock, Link as LinkIcon, Image as ImageIcon, Video } from 'lucide-react';
import { generateId } from '../lkpd/constants';

interface UjianBuilderProps {
  ujianItem: any;
  onSave: (updated: any) => void;
  onBack: () => void;
}

const UjianBuilder: React.FC<UjianBuilderProps> = ({ ujianItem, onSave, onBack }) => {
  const [questions, setQuestions] = useState<any[]>(ujianItem.questions || []);
  const [title, setTitle] = useState(ujianItem.title);
  const [desc, setDesc] = useState(ujianItem.desc);
  const [duration, setDuration] = useState(ujianItem.duration || 60);

  const addQuestion = (type: 'multiple_choice' | 'essay') => {
    const newQ: any = { id: generateId('q'), type, content: '', fileUrl: '' };
    if (type === 'multiple_choice') {
      newQ.options = [{ id: generateId('opt'), text: '', isCorrect: false }, { id: generateId('opt'), text: '', isCorrect: false }];
    }
    setQuestions([...questions, newQ]);
  };

  const updateQuestion = (qId: string, field: string, val: any) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, [field]: val } : q));
  };

  const handleSaveAll = () => {
    onSave({ ...ujianItem, title, desc, duration, questions });
    alert('Ujian berhasil disimpan!');
    onBack();
  };

  return (
    <div className="animate-in fade-in max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18}/></button>
          <h2 className="text-xl font-bold text-slate-800">Editor Ujian</h2>
        </div>
        <button onClick={handleSaveAll} className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl">Simpan Ujian</button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Judul Ujian</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Petunjuk Pengerjaan</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-indigo-500" rows={2} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Durasi Pengerjaan (Menit)</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
            <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full pl-10 p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-indigo-500" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">Soal #{idx + 1} ({q.type === 'essay' ? 'Uraian' : 'Pilihan Ganda'})</span>
              <button onClick={() => setQuestions(questions.filter(item => item.id !== q.id))} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
            </div>

            <textarea placeholder="Pertanyaan (Gunakan tanda $ untuk rumus MTK)..." value={q.content} onChange={e => updateQuestion(q.id, 'content', e.target.value)} className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none mb-2 focus:border-indigo-500" rows={3} />
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button title="Gambar" className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md"><ImageIcon size={16}/></button>
                <button title="Video" className="p-1.5 text-slate-500 hover:text-red-500 rounded-md"><Video size={16}/></button>
              </div>
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input type="text" placeholder="URL Lampiran Media (Opsional)..." value={q.fileUrl || ''} onChange={e => updateQuestion(q.id, 'fileUrl', e.target.value)} className="w-full pl-8 p-2 border border-slate-200 bg-slate-50 rounded-lg text-xs outline-none focus:border-indigo-500" />
              </div>
            </div>

            {q.type === 'multiple_choice' && (
              <div className="space-y-2 mt-4">
                {q.options.map((opt: any, optIdx: number) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button onClick={() => updateQuestion(q.id, 'options', q.options.map((o:any) => ({...o, isCorrect: o.id === opt.id})))} className={`p-2 rounded-lg border shrink-0 ${opt.isCorrect ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 border-slate-200'}`}><CheckCircle2 size={16}/></button>
                    <input type="text" value={opt.text} onChange={e => updateQuestion(q.id, 'options', q.options.map((o:any) => o.id === opt.id ? {...o, text: e.target.value} : o))} placeholder={`Pilihan ${optIdx + 1}`} className="flex-1 p-2 border border-slate-200 bg-slate-50 rounded-lg text-sm outline-none focus:border-indigo-500" />
                  </div>
                ))}
                <button onClick={() => updateQuestion(q.id, 'options', [...q.options, { id: generateId('opt'), text: '', isCorrect: false }])} className="text-xs text-indigo-600 font-semibold mt-2 px-2">+ Tambah Pilihan</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3 mt-6">
        <button onClick={() => addQuestion('multiple_choice')} className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-semibold transition-colors"><Plus size={14} className="inline mr-1"/> Pilihan Ganda</button>
        <button onClick={() => addQuestion('essay')} className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-semibold transition-colors"><Plus size={14} className="inline mr-1"/> Uraian</button>
      </div>
    </div>
  );
};

export default UjianBuilder;
