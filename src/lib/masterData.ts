// =====================================================================
//  DATA MASTER UNTUK DROPDOWN FORM
//  Dipakai bersama oleh AcademicManagement.tsx dan UserManagement.tsx
//  supaya pilihannya selalu sama di kedua halaman.
// =====================================================================

export const TINGKAT_OPTIONS = [
  { value: 7, label: 'VII (Kelas 7)' },
  { value: 8, label: 'VIII (Kelas 8)' },
  { value: 9, label: 'IX (Kelas 9)' },
];

export const ROMBEL_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

export const JENIS_KELAMIN_OPTIONS = ['Laki-laki', 'Perempuan'];

export const AGAMA_OPTIONS = [
  'Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu', 'Lainnya',
];

export const PROVINSI_OPTIONS = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi',
  'Sumatera Selatan', 'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung',
  'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta',
  'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan',
  'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara', 'Gorontalo',
  'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya',
  'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan',
];

// Daftar kota/kabupaten per provinsi.
// Provinsi yang belum terdaftar di sini akan otomatis menampilkan input
// ketik-bebas, jadi form tetap bisa dipakai. Tambahkan sendiri kalau perlu.
export const KOTA_BY_PROVINSI: Record<string, string[]> = {
  'Jawa Timur': [
    'Kab. Bangkalan', 'Kab. Banyuwangi', 'Kab. Blitar', 'Kab. Bojonegoro',
    'Kab. Bondowoso', 'Kab. Gresik', 'Kab. Jember', 'Kab. Jombang',
    'Kab. Kediri', 'Kab. Lamongan', 'Kab. Lumajang', 'Kab. Madiun',
    'Kab. Magetan', 'Kab. Malang', 'Kab. Mojokerto', 'Kab. Nganjuk',
    'Kab. Ngawi', 'Kab. Pacitan', 'Kab. Pamekasan', 'Kab. Pasuruan',
    'Kab. Ponorogo', 'Kab. Probolinggo', 'Kab. Sampang', 'Kab. Sidoarjo',
    'Kab. Situbondo', 'Kab. Sumenep', 'Kab. Trenggalek', 'Kab. Tuban',
    'Kab. Tulungagung', 'Kota Batu', 'Kota Blitar', 'Kota Kediri',
    'Kota Madiun', 'Kota Malang', 'Kota Mojokerto', 'Kota Pasuruan',
    'Kota Probolinggo', 'Kota Surabaya',
  ],
  'Jawa Tengah': [
    'Kab. Banjarnegara', 'Kab. Banyumas', 'Kab. Batang', 'Kab. Blora',
    'Kab. Boyolali', 'Kab. Brebes', 'Kab. Cilacap', 'Kab. Demak',
    'Kab. Grobogan', 'Kab. Jepara', 'Kab. Karanganyar', 'Kab. Kebumen',
    'Kab. Kendal', 'Kab. Klaten', 'Kab. Kudus', 'Kab. Magelang',
    'Kab. Pati', 'Kab. Pekalongan', 'Kab. Pemalang', 'Kab. Purbalingga',
    'Kab. Purworejo', 'Kab. Rembang', 'Kab. Semarang', 'Kab. Sragen',
    'Kab. Sukoharjo', 'Kab. Tegal', 'Kab. Temanggung', 'Kab. Wonogiri',
    'Kab. Wonosobo', 'Kota Magelang', 'Kota Pekalongan', 'Kota Salatiga',
    'Kota Semarang', 'Kota Surakarta', 'Kota Tegal',
  ],
  'Jawa Barat': [
    'Kab. Bandung', 'Kab. Bandung Barat', 'Kab. Bekasi', 'Kab. Bogor',
    'Kab. Ciamis', 'Kab. Cianjur', 'Kab. Cirebon', 'Kab. Garut',
    'Kab. Indramayu', 'Kab. Karawang', 'Kab. Kuningan', 'Kab. Majalengka',
    'Kab. Pangandaran', 'Kab. Purwakarta', 'Kab. Subang', 'Kab. Sukabumi',
    'Kab. Sumedang', 'Kab. Tasikmalaya', 'Kota Bandung', 'Kota Banjar',
    'Kota Bekasi', 'Kota Bogor', 'Kota Cimahi', 'Kota Cirebon',
    'Kota Depok', 'Kota Sukabumi', 'Kota Tasikmalaya',
  ],
  'DKI Jakarta': [
    'Kota Jakarta Barat', 'Kota Jakarta Pusat', 'Kota Jakarta Selatan',
    'Kota Jakarta Timur', 'Kota Jakarta Utara', 'Kab. Kepulauan Seribu',
  ],
  'DI Yogyakarta': [
    'Kab. Bantul', 'Kab. Gunungkidul', 'Kab. Kulon Progo', 'Kab. Sleman',
    'Kota Yogyakarta',
  ],
  'Banten': [
    'Kab. Lebak', 'Kab. Pandeglang', 'Kab. Serang', 'Kab. Tangerang',
    'Kota Cilegon', 'Kota Serang', 'Kota Tangerang', 'Kota Tangerang Selatan',
  ],
  'Bali': [
    'Kab. Badung', 'Kab. Bangli', 'Kab. Buleleng', 'Kab. Gianyar',
    'Kab. Jembrana', 'Kab. Karangasem', 'Kab. Klungkung', 'Kab. Tabanan',
    'Kota Denpasar',
  ],
};

// Batas tahun untuk dropdown tanggal lahir
export const TAHUN_LAHIR_OPTIONS = (() => {
  const sekarang = new Date().getFullYear();
  const daftar: number[] = [];
  for (let t = sekarang; t >= sekarang - 70; t--) daftar.push(t);
  return daftar;
})();

export const BULAN_OPTIONS = [
  { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' }, { value: 4, label: 'April' },
  { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' }, { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
];

/** Berapa hari dalam satu bulan, sudah memperhitungkan tahun kabisat. */
export const jumlahHari = (bulan: number, tahun: number): number => {
  if (!bulan || !tahun) return 31;
  return new Date(tahun, bulan, 0).getDate();
};

/** '2011-04-09' -> '9 April 2011' */
export const formatTanggal = (iso?: string | null): string => {
  if (!iso) return '-';
  const [t, b, h] = iso.split('-').map(Number);
  const namaBulan = BULAN_OPTIONS.find(x => x.value === b)?.label ?? '';
  return `${h} ${namaBulan} ${t}`;
};

/** Gabungkan kolom-kolom alamat jadi satu baris yang enak dibaca. */
export const formatAlamat = (p: {
  alamat_jalan?: string | null; alamat_rt?: string | null; alamat_rw?: string | null;
  alamat_kelurahan?: string | null; alamat_kecamatan?: string | null;
  alamat_kota?: string | null; alamat_provinsi?: string | null;
}): string => {
  const rtrw = [p.alamat_rt && `RT ${p.alamat_rt}`, p.alamat_rw && `RW ${p.alamat_rw}`]
    .filter(Boolean).join('/');
  return [
    p.alamat_jalan, rtrw,
    p.alamat_kelurahan && `Kel. ${p.alamat_kelurahan}`,
    p.alamat_kecamatan && `Kec. ${p.alamat_kecamatan}`,
    p.alamat_kota, p.alamat_provinsi,
  ].filter(Boolean).join(', ') || '-';
};
