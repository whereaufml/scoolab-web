// =====================================================================
//  LAPISAN API — MODUL LATIHAN SOAL
//  ⚠️ TARUH FILE INI DI:  src/lib/latihanApi.ts
//     BUKAN di src/materi/latihan/ — kalau salah taruh folder, import
//     '../supabaseClient' di bawah ini akan gagal, dan LatihanBuilder /
//     LatihanManagement / LatihanViewer ikut error karena tidak
//     ketemu '../../lib/latihanApi'.
//
//  Satu-satunya tempat yang bicara langsung ke tabel latihan_sets,
//  latihan_questions, dan latihan_submissions. LatihanManagement,
//  LatihanBuilder, dan LatihanViewer semua memanggil fungsi dari sini,
//  bukan menulis query Supabase sendiri-sendiri.
// =====================================================================

import { supabase } from '../supabaseClient';

// ---------------------------------------------------------------------
// TIPE DATA
// ---------------------------------------------------------------------
export type TipeSoal = 'multiple_choice' | 'short_answer' | 'essay';

export interface OpsiJawaban {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface SoalLatihan {
  id: string;
  type: TipeSoal;
  content: string;
  isRequired?: boolean;
  options?: OpsiJawaban[];       // hanya untuk multiple_choice
  correctAnswer?: string;        // hanya untuk short_answer
}

export interface LatihanSet {
  id: string;
  materiId: string;
  title: string;
  desc: string;
  prerequisiteLkpdIds: string[];
  isDeleted: boolean;
  deletedAt: string | null;
  dibuatOleh: string | null;
  questions: SoalLatihan[];
}

export interface JawabanSubmission {
  id: string;
  latihanId: string;
  siswaId: string;
  jawaban: Record<string, any>;
  skorOtomatis: number | null;
  jumlahSoalOtomatis: number | null;
  status: 'terkirim' | 'dinilai';
  submittedAt: string;
}

const SELECT_LATIHAN = `
  id, materi_id, title, deskripsi, prerequisite_lkpd_ids, is_deleted, deleted_at, dibuat_oleh,
  latihan_questions ( id, urutan, tipe, konten, wajib, opsi, kunci_jawaban )
`;

function rowKeLatihan(row: any): LatihanSet {
  const soal: SoalLatihan[] = (row.latihan_questions ?? [])
    .slice()
    .sort((a: any, b: any) => a.urutan - b.urutan)
    .map((q: any) => ({
      id: q.id,
      type: q.tipe,
      content: q.konten,
      isRequired: q.wajib,
      options: q.opsi ?? undefined,
      correctAnswer: q.kunci_jawaban ?? undefined,
    }));

  return {
    id: row.id,
    materiId: row.materi_id,
    title: row.title,
    desc: row.deskripsi,
    prerequisiteLkpdIds: row.prerequisite_lkpd_ids ?? [],
    isDeleted: row.is_deleted,
    deletedAt: row.deleted_at,
    dibuatOleh: row.dibuat_oleh,
    questions: soal,
  };
}

// ---------------------------------------------------------------------
// BACA DATA
// ---------------------------------------------------------------------
export async function getLatihanByMateri(materiId: string): Promise<LatihanSet[]> {
  const { data, error } = await supabase
    .from('latihan_sets')
    .select(SELECT_LATIHAN)
    .eq('materi_id', materiId)
    .eq('is_deleted', false)
    .order('created_at');
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowKeLatihan);
}

export async function getTrashedLatihan(materiId: string): Promise<LatihanSet[]> {
  const { data, error } = await supabase
    .from('latihan_sets')
    .select(SELECT_LATIHAN)
    .eq('materi_id', materiId)
    .eq('is_deleted', true)
    .order('deleted_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowKeLatihan);
}

// ---------------------------------------------------------------------
// TULIS DATA — PAKET LATIHAN
// ---------------------------------------------------------------------
export async function createLatihan(params: {
  materiId: string;
  title: string;
  desc: string;
  prerequisiteLkpdIds: string[];
  guruId: string;
}): Promise<LatihanSet> {
  const { data, error } = await supabase
    .from('latihan_sets')
    .insert([{
      materi_id: params.materiId,
      title: params.title,
      deskripsi: params.desc,
      prerequisite_lkpd_ids: params.prerequisiteLkpdIds,
      dibuat_oleh: params.guruId,
    }])
    .select(SELECT_LATIHAN)
    .single();
  if (error) throw new Error(error.message);
  return rowKeLatihan(data);
}

/**
 * Simpan judul/deskripsi lalu ganti seluruh daftar soal sekaligus.
 * Strategi hapus-lalu-insert-ulang dipakai karena jumlah soal per paket
 * biasanya kecil (belasan), jadi lebih sederhana dan aman daripada
 * menyinkronkan baris satu per satu (insert/update/delete terpisah).
 */
export async function saveLatihan(latihan: LatihanSet): Promise<void> {
  const { error: errMeta } = await supabase
    .from('latihan_sets')
    .update({ title: latihan.title, deskripsi: latihan.desc })
    .eq('id', latihan.id);
  if (errMeta) throw new Error(errMeta.message);

  const { error: errDel } = await supabase
    .from('latihan_questions')
    .delete()
    .eq('latihan_id', latihan.id);
  if (errDel) throw new Error(errDel.message);

  if (latihan.questions.length > 0) {
    const baris = latihan.questions.map((q, i) => ({
      id: q.id,
      latihan_id: latihan.id,
      urutan: i,
      tipe: q.type,
      konten: q.content,
      wajib: !!q.isRequired,
      opsi: q.options ?? null,
      kunci_jawaban: q.correctAnswer ?? null,
    }));
    const { error: errIns } = await supabase.from('latihan_questions').insert(baris);
    if (errIns) throw new Error(errIns.message);
  }
}

export async function softDeleteLatihan(id: string): Promise<void> {
  const { error } = await supabase
    .from('latihan_sets')
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function restoreLatihan(id: string): Promise<void> {
  const { error } = await supabase
    .from('latihan_sets')
    .update({ is_deleted: false, deleted_at: null })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------
// PENGERJAAN SISWA
// ---------------------------------------------------------------------
export async function getSubmission(latihanId: string, siswaId: string): Promise<JawabanSubmission | null> {
  const { data, error } = await supabase
    .from('latihan_submissions')
    .select('id, latihan_id, siswa_id, jawaban, skor_otomatis, jumlah_soal_otomatis, status, submitted_at')
    .eq('latihan_id', latihanId)
    .eq('siswa_id', siswaId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    id: data.id,
    latihanId: data.latihan_id,
    siswaId: data.siswa_id,
    jawaban: data.jawaban,
    skorOtomatis: data.skor_otomatis,
    jumlahSoalOtomatis: data.jumlah_soal_otomatis,
    status: data.status,
    submittedAt: data.submitted_at,
  };
}

export async function submitJawaban(params: {
  latihanId: string;
  siswaId: string;
  jawaban: Record<string, any>;
  skorOtomatis: number | null;
  jumlahSoalOtomatis: number;
}): Promise<void> {
  const { error } = await supabase
    .from('latihan_submissions')
    .upsert(
      [{
        latihan_id: params.latihanId,
        siswa_id: params.siswaId,
        jawaban: params.jawaban,
        skor_otomatis: params.skorOtomatis,
        jumlah_soal_otomatis: params.jumlahSoalOtomatis,
        submitted_at: new Date().toISOString(),
      }],
      { onConflict: 'latihan_id,siswa_id' },
    );
  if (error) throw new Error(error.message);
}

/**
 * Hitung skor otomatis untuk soal pilihan ganda & isian singkat.
 * Esai tidak dihitung di sini karena butuh penilaian manual guru.
 */
export function hitungSkorOtomatis(questions: SoalLatihan[], jawaban: Record<string, any>) {
  let benar = 0;
  let totalOtomatis = 0;

  for (const q of questions) {
    if (q.type === 'multiple_choice') {
      totalOtomatis++;
      const kunci = q.options?.find(o => o.isCorrect)?.id;
      if (kunci && jawaban[q.id] === kunci) benar++;
    } else if (q.type === 'short_answer') {
      totalOtomatis++;
      const kunci = (q.correctAnswer ?? '').trim().toLowerCase();
      const jwb = String(jawaban[q.id] ?? '').trim().toLowerCase();
      if (kunci && jwb === kunci) benar++;
    }
  }

  return {
    benar,
    totalOtomatis,
    skor: totalOtomatis > 0 ? Math.round((benar / totalOtomatis) * 100) : null,
  };
}