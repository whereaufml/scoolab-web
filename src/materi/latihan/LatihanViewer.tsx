import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, CheckCircle2, Circle, Send, Loader2, AlertTriangle,
  BadgeCheck, ClipboardList, Info,
} from 'lucide-react';
import {
  getSubmission, submitJawaban, hitungSkorOtomatis,
  type LatihanSet, type JawabanSubmission,
} from '../../lib/latihanApi';

interface LatihanViewerProps {
  latihanItem: LatihanSet;
  lkpdDb: any[];
  user: { id: string; role: string; name?: string };
  onBack: () => void;
  /** true kalau ini guru sedang pratinjau — jawaban tidak disimpan ke database. */
  isPreviewMode?: boolean;
}

const LatihanViewer: React.FC<LatihanViewerProps> = ({ latihanItem, lkpdDb, user, onBack, isPreviewMode }) => {
  const [loading, setLoading] = useState(!isPreviewMode);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [submissionLama, setSubmissionLama] = useState<JawabanSubmission | null>(null);

  const [jawaban, setJawaban] = useState<Record<string, any>>({});
  const [mengirim, setMengirim] = useState(false);
  const [hasilPreview, setHasilPreview] = useState<{ benar: number; totalOtomatis: number; skor: number | null } | null>(null);

  // -------------------------------------------------------------------
  // Cek apakah siswa ini sudah pernah mengerjakan
  // -------------------------------------------------------------------
  useEffect(() => {
    if (isPreviewMode) { setLoading(false); return; }
    let batal = false;
    (async () => {
      try {
        const data = await getSubmission(latihanItem.id, user.id);
        if (!batal) setSubmissionLama(data);
      } catch (err) {
        if (!batal) setPesanError((err as Error).message);
      } finally {
        if (!batal) setLoading(false);
      }
    })();
    return () => { batal = true; };
  }, [latihanItem.id, user.id, isPreviewMode]);

  const daftarPrasyarat = useMemo(
    () => (lkpdDb || []).filter(l => latihanItem.prerequisiteLkpdIds.includes(l.id)),
    [lkpdDb, latihanItem.prerequisiteLkpdIds],
  );

  const semuaWajibTerjawab = latihanItem.questions
    .filter(q => q.isRequired)
    .every(q => String(jawaban[q.id] ?? '').trim() !== '');

  const ubahJawaban = (qId: string, val: any) => setJawaban(prev => ({ ...prev, [qId]: val }));

  // -------------------------------------------------------------------
  const handleKirim = async () => {
    if (!semuaWajibTerjawab) return alert('Masih ada soal wajib yang belum dijawab.');

    const { benar, totalOtomatis, skor } = hitungSkorOtomatis(latihanItem.questions, jawaban);

    if (isPreviewMode) {
      setHasilPreview({ benar, totalOtomatis, skor });
      return;
    }

    setMengirim(true);
    try {
      await submitJawaban({
        latihanId: latihanItem.id,
        siswaId: user.id,
        jawaban,
        skorOtomatis: skor,
        jumlahSoalOtomatis: totalOtomatis,
      });
      const dataBaru = await getSubmission(latihanItem.id, user.id);
      setSubmissionLama(dataBaru);
    } catch (err) {
      alert(`Gagal mengirim jawaban: ${(err as Error).message}`);
    } finally {
      setMengirim(false);
    }
  };

  // -------------------------------------------------------------------
  // TAMPILAN: SEDANG MEMUAT
  // -------------------------------------------------------------------
  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center gap-2 text-emerald-600">
        <Loader2 className="animate-spin" size={20} /> Memuat latihan…
      </div>
    );
  }

  // -------------------------------------------------------------------
  // TAMPILAN: SUDAH PERNAH DIKERJAKAN (siswa, bukan pratinjau)
  // -------------------------------------------------------------------
  if (submissionLama && !isPreviewMode) {
    return (
      <div className="animate-in fade-in max-w-3xl mx-auto pb-12">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18} /></button>
          <h2 className="text-xl font-bold text-slate-800">{latihanItem.title}</h2>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BadgeCheck size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Sudah kamu kerjakan</h3>
          <p className="text-sm text-slate-500 mt-1">
            Dikirim {new Date(submissionLama.submittedAt).toLocaleString('id-ID')}
          </p>

          {submissionLama.skorOtomatis !== null ? (
            <div className="mt-6">
              <p className="text-4xl font-bold text-emerald-600">{submissionLama.skorOtomatis}</p>
              <p className="text-xs text-slate-500 mt-1">
                dari {submissionLama.jumlahSoalOtomatis} soal yang dinilai otomatis
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-6">Latihan ini dinilai manual oleh gurumu.</p>
          )}

          {latihanItem.questions.some(q => q.type === 'essay') && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mt-4 inline-block">
              Soal uraian di paket ini menunggu penilaian guru.
            </p>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // TAMPILAN: HASIL PRATINJAU GURU (setelah klik "Lihat Hasil")
  // -------------------------------------------------------------------
  if (hasilPreview) {
    return (
      <div className="animate-in fade-in max-w-3xl mx-auto pb-12">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18} /></button>
          <h2 className="text-xl font-bold text-slate-800">Pratinjau Hasil</h2>
        </div>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl p-4 mb-6 flex items-start gap-2">
          <Info size={18} className="shrink-0 mt-0.5" />
          Ini simulasi tampilan yang dilihat siswa. Jawaban pratinjau ini tidak disimpan ke database.
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          {hasilPreview.skor !== null ? (
            <>
              <p className="text-4xl font-bold text-emerald-600">{hasilPreview.skor}</p>
              <p className="text-xs text-slate-500 mt-1">
                {hasilPreview.benar} benar dari {hasilPreview.totalOtomatis} soal otomatis
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">Tidak ada soal pilihan ganda/isian singkat untuk dinilai otomatis.</p>
          )}
        </div>
        <button onClick={() => setHasilPreview(null)} className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">
          Kembali ke Soal
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // TAMPILAN: FORM PENGERJAAN
  // -------------------------------------------------------------------
  return (
    <div className="animate-in fade-in max-w-3xl mx-auto pb-24">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200"><ArrowLeft size={18} /></button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{latihanItem.title}</h2>
          {isPreviewMode && <p className="text-xs font-semibold text-amber-600">Mode Pratinjau Guru — jawaban tidak akan tersimpan</p>}
        </div>
      </div>

      {pesanError && (
        <div className="p-4 mb-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-700 flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" /> {pesanError}
        </div>
      )}

      {latihanItem.desc && (
        <div className="bg-blue-50 border border-blue-100 text-blue-800 text-sm rounded-2xl p-4 mb-4">
          {latihanItem.desc}
        </div>
      )}

      {daftarPrasyarat.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-sm text-slate-600 flex items-start gap-2">
          <ClipboardList size={18} className="shrink-0 mt-0.5 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-700">Sebaiknya selesaikan dulu:</p>
            <ul className="list-disc list-inside mt-1">
              {daftarPrasyarat.map((l: any) => <li key={l.id}>{l.title}</li>)}
            </ul>
          </div>
        </div>
      )}

      {latihanItem.questions.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center text-slate-400 text-sm">
          Belum ada soal di paket latihan ini.
        </div>
      ) : (
        <div className="space-y-6">
          {latihanItem.questions.map((q, idx) => (
            <div key={q.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">Soal #{idx + 1}</span>
                {q.isRequired && <span className="text-[11px] font-semibold text-rose-500">Wajib dijawab</span>}
              </div>
              <p className="text-slate-800 font-medium mb-4 whitespace-pre-wrap">{q.content || '(Soal belum diisi)'}</p>

              {q.type === 'multiple_choice' && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const terpilih = jawaban[q.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => ubahJawaban(q.id, opt.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                          terpilih ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {terpilih ? <CheckCircle2 size={18} className="text-blue-500 shrink-0" /> : <Circle size={18} className="text-slate-300 shrink-0" />}
                        <span className="text-xs font-bold text-slate-400 w-5">{String.fromCharCode(65 + optIdx)}.</span>
                        <span className="text-sm">{opt.text || '(kosong)'}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'short_answer' && (
                <input
                  type="text"
                  value={jawaban[q.id] ?? ''}
                  onChange={e => ubahJawaban(q.id, e.target.value)}
                  placeholder="Ketik jawabanmu di sini"
                  className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              )}

              {q.type === 'essay' && (
                <textarea
                  value={jawaban[q.id] ?? ''}
                  onChange={e => ubahJawaban(q.id, e.target.value)}
                  placeholder="Tuliskan jawaban uraianmu di sini"
                  rows={5}
                  className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {latihanItem.questions.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 p-4 flex justify-center z-30">
          <button
            onClick={handleKirim}
            disabled={mengirim || !semuaWajibTerjawab}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-2xl shadow-lg flex items-center gap-2"
          >
            {mengirim ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {mengirim ? 'Mengirim…' : isPreviewMode ? 'Lihat Hasil (Pratinjau)' : 'Kirim Jawaban'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LatihanViewer;