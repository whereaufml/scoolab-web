// =====================================================================
//  LAPISAN API PROFIL & KELAS
//  Semua halaman (AcademicManagement, UserManagement, dan nanti dashboard
//  guru/siswa) memanggil fungsi dari file ini — bukan menulis query
//  Supabase masing-masing. Jadi kalau nama kolom berubah, cukup satu file
//  ini yang diperbaiki, tidak perlu menyisir semua komponen.
// =====================================================================

import { supabase } from '../supabaseClient';

// ---------------------------------------------------------------------
// TIPE DATA
// ---------------------------------------------------------------------
export type Role = 'admin' | 'guru' | 'siswa';

export interface Profile {
  id: string;
  role: Role;
  username: string | null;

  // Identitas diri
  nama_lengkap: string;
  nama_panggilan: string | null;
  nisn: string | null;
  nip: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;   // format 'YYYY-MM-DD'
  jenis_kelamin: string | null;
  agama: string | null;
  no_telepon: string | null;
  foto_url: string | null;

  // Akademik
  kelas_id: string | null;
  mata_pelajaran: string | null;

  // Domisili
  alamat_jalan: string | null;
  alamat_rt: string | null;
  alamat_rw: string | null;
  alamat_kelurahan: string | null;
  alamat_kecamatan: string | null;
  alamat_kota: string | null;
  alamat_provinsi: string | null;

  is_deleted: boolean;
  deleted_at: string | null;

  // Hasil join (bukan kolom asli tabel)
  kelas?: { id: string; nama_tampilan: string; tingkat: number; rombel: string } | null;
}

export interface Kelas {
  id: string;
  tingkat: number;
  rombel: string;
  nama_tampilan: string;
  tahun_ajaran: string;
  wali_kelas_id: string | null;
  is_archived: boolean;
  wali_kelas?: { id: string; nama_lengkap: string } | null;
}

/** Data yang diisi lewat form. Semua opsional kecuali yang wajib di DB. */
export type ProfileForm = Partial<Omit<Profile, 'id' | 'kelas' | 'is_deleted' | 'deleted_at'>> & {
  role: Role;
  nama_lengkap: string;
};

const SELECT_PROFIL = `
  id, role, username, nama_lengkap, nama_panggilan, nisn, nip,
  tempat_lahir, tanggal_lahir, jenis_kelamin, agama, no_telepon, foto_url,
  kelas_id, mata_pelajaran,
  alamat_jalan, alamat_rt, alamat_rw, alamat_kelurahan, alamat_kecamatan,
  alamat_kota, alamat_provinsi,
  is_deleted, deleted_at,
  kelas:classes!profiles_kelas_id_fkey ( id, nama_tampilan, tingkat, rombel )
`;

// ---------------------------------------------------------------------
// BACA DATA
// ---------------------------------------------------------------------

/** Ambil semua profil aktif. Bisa disaring per peran. */
export async function getProfiles(role?: Role): Promise<Profile[]> {
  let q = supabase
    .from('profiles')
    .select(SELECT_PROFIL)
    .eq('is_deleted', false)
    .order('nama_lengkap');

  if (role) q = q.eq('role', role);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Profile[];
}

/** Ambil siswa di satu kelas. Inilah yang nanti dipakai dashboard guru. */
export async function getProfilesByKelas(kelasId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(SELECT_PROFIL)
    .eq('role', 'siswa')
    .eq('kelas_id', kelasId)
    .eq('is_deleted', false)
    .order('nama_lengkap');

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Profile[];
}

/** Isi Tong Sampah: profil yang sudah dihapus tapi belum permanen. */
export async function getDeletedProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(SELECT_PROFIL)
    .eq('is_deleted', true)
    .order('deleted_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Profile[];
}

export async function getClasses(): Promise<Kelas[]> {
  const { data, error } = await supabase
    .from('classes')
    .select('id, tingkat, rombel, nama_tampilan, tahun_ajaran, wali_kelas_id, is_archived, wali_kelas:profiles!fk_wali_kelas ( id, nama_lengkap )')
    .order('tingkat')
    .order('rombel');

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Kelas[];
}

// ---------------------------------------------------------------------
// TULIS DATA
// ---------------------------------------------------------------------

/**
 * Buat akun baru (Auth + profil) lewat Edge Function `create-user`.
 * Tidak bisa langsung insert ke tabel karena akun Auth-nya harus dibuat
 * dengan service role key yang hanya ada di server.
 */
export async function createProfile(
  username: string,
  password: string,
  profile: ProfileForm,
): Promise<Profile> {
  const { data, error } = await supabase.functions.invoke('create-user', {
    body: { username, password, profile: bersihkan(profile) },
  });

  // Edge Function mengirim pesan error di body, bukan di error.message,
  // jadi keduanya perlu dicek.
  if (error) {
    const pesanServer = (data as any)?.error;
    throw new Error(pesanServer || error.message);
  }
  if ((data as any)?.error) throw new Error((data as any).error);

  return (data as any).profile as Profile;
}

export async function updateProfile(id: string, patch: Partial<ProfileForm>): Promise<void> {
  const { error } = await supabase.from('profiles').update(bersihkan(patch)).eq('id', id);
  if (error) throw new Error(error.message);
}

/** Hapus = pindahkan ke Tong Sampah (masih bisa dipulihkan). */
export async function softDeleteProfile(id: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function restoreProfile(id: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ is_deleted: false, deleted_at: null })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/** Hapus permanen: akun Auth ikut dihapus, tidak bisa dibatalkan. */
export async function hardDeleteProfile(id: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('delete-user', {
    body: { userId: id },
  });
  if (error) throw new Error((data as any)?.error || error.message);
  if ((data as any)?.error) throw new Error((data as any).error);
}

/** Ubah kata sandi orang lain — hanya bisa dilakukan admin lewat Edge Function. */
export async function resetPassword(id: string, passwordBaru: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('create-user', {
    body: { mode: 'reset-password', userId: id, password: passwordBaru },
  });
  if (error) throw new Error((data as any)?.error || error.message);
  if ((data as any)?.error) throw new Error((data as any).error);
}

// ---------------------------------------------------------------------
// KELAS
// ---------------------------------------------------------------------

export async function setWaliKelas(kelasId: string, guruId: string | null): Promise<void> {
  const { error } = await supabase
    .from('classes')
    .update({ wali_kelas_id: guruId })
    .eq('id', kelasId);
  if (error) throw new Error(error.message);
}

/** Masukkan siswa ke kelas (cukup ubah kelas_id di profilnya). */
export async function assignSiswaKeKelas(siswaId: string, kelasId: string | null): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ kelas_id: kelasId })
    .eq('id', siswaId);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------
// BANTUAN
// ---------------------------------------------------------------------

/**
 * Ubah string kosong jadi null sebelum dikirim ke database.
 * Perlu karena kolom UNIQUE (nisn, nip) akan bentrok kalau diisi ''
 * lebih dari satu baris, sedangkan NULL boleh berulang.
 */
function bersihkan<T extends Record<string, any>>(obj: T): T {
  const hasil: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    hasil[k] = typeof v === 'string' && v.trim() === '' ? null : v;
  }
  return hasil as T;
}
