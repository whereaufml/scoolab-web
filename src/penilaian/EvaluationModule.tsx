import React, { useState } from 'react';
import { Award, TrendingUp, CheckCircle2, AlertCircle, Sparkles, User, FileText } from 'lucide-react';

interface EvaluationModuleProps {
  role: 'siswa' | 'guru';
  userData: any;
}

const EvaluationModule: React.FC<EvaluationModuleProps> = ({ role, userData }) => {
  const [selectedStudent, setSelectedStudent] = useState('Siswa 1');

  // Data tiruan rekap nilai siswa
  const studentGrades = [
    { type: 'LKPD 1: Konsep Dasar SPLDV', score: 85, status: 'Tuntas', date: '10 Sep 2026' },
    { type: 'Latihan Soal Metode Grafik', score: 90, status: 'Tuntas', date: '12 Sep 2026' },
    { type: 'Asesmen / Ujian Bab 1', score: 78, status: 'Tuntas', date: '14 Sep 2026' },
  ];

  // Data tiruan rekap kelas untuk Guru
  const classSummary = [
    { name: 'Siswa 1', lkpd: 85, latihan: 90, asesmen: 78, progress: 'Baik' },
    { name: 'Siswa 2', lkpd: 92, latihan: 88, asesmen: 85, progress: 'Sangat Baik' },
    { name: 'Siswa 3', lkpd: 70, latihan: 65, asesmen: 60, progress: 'Perlu Perhatian' },
    { name: 'Siswa 4', lkpd: 88, latihan: 85, asesmen: 80, progress: 'Baik' },
    { name: 'Siswa 5', lkpd: 95, latihan: 92, asesmen: 90, progress: 'Sangat Baik' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Halaman dengan Nuansa Marun */}
      <div className="bg-gradient-to-r from-rose-900 to-red-950 p-6 md:p-8 rounded-3xl text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <Award size={28} className="text-rose-200" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Evaluasi & Perkembangan Belajar</h2>
            <p className="text-rose-200 text-sm">
              {role === 'siswa' 
                ? `Rekap jejak belajar dan analisis kemampuan untuk @${userData.name}` 
                : 'Pantauan rekapitulasi nilai dan kemajuan seluruh siswa kelas'}
            </p>
          </div>
        </div>
      </div>

      {/* --- KONDISI 1: TAMPILAN UNTUK SISWA --- */}
      {role === 'siswa' && (
        <div className="space-y-6">
          {/* Kartu Ringkasan Kemampuan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-rose-50 text-rose-800 rounded-2xl flex items-center justify-center font-bold text-xl">
                84
              </div>
              <div>
                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Rata-Rata Nilai</p>
                <h3 className="text-lg font-bold text-slate-800">Kategori Baik</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-rose-50 text-rose-800 rounded-2xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Perkembangan</p>
                <h3 className="text-lg font-bold text-slate-800">+12% dari pekan lalu</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-rose-50 text-rose-800 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} className="text-rose-800" />
              </div>
              <div>
                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Status Tugas</p>
                <h3 className="text-lg font-bold text-slate-800">Semua Tuntas</h3>
              </div>
            </div>
          </div>

          {/* Tabel Nilai LKPD, Latsol, Asesmen */}
          <div className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-hidden">
            <div className="p-5 border-b border-rose-50 bg-rose-50/30 flex items-center justify-between">
              <h3 className="font-bold text-rose-950 flex items-center gap-2">
                <FileText size={18} className="text-rose-800" /> Rincian Nilai Tugas & Evaluasi
              </h3>
            </div>
            <div className="divide-y divide-rose-50">
              {studentGrades.map((item, index) => (
                <div key={index} className="p-4 md:p-5 flex items-center justify-between hover:bg-rose-50/20 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-800">{item.type}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Dikerjakan pada: {item.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-rose-100 text-rose-900 font-bold text-sm rounded-full">
                      {item.score} Poin
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kotak Saran Pembelajaran Berikutnya */}
          <div className="bg-rose-950 text-white p-6 md:p-8 rounded-3xl shadow-md relative overflow-hidden">
            <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-rose-900/40 pointer-events-none" />
            <div className="flex items-start gap-3 relative z-10">
              <div className="p-3 bg-rose-900 rounded-2xl text-rose-200">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Saran Pembelajaran Berikutnya</h4>
                <p className="text-rose-200 text-sm leading-relaxed">
                  Pemahamanmu pada konsep dasar SPLDV sudah sangat baik. Untuk meningkatkan kemampuan analisis, disarankan mencoba latihan tambahan terkait <strong>Metode Substitusi dan Eliminasi</strong> sebelum masuk ke asesmen bab berikutnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- KONDISI 2: TAMPILAN UNTUK GURU --- */}
      {role === 'guru' && (
        <div className="space-y-6">
          {/* Filter/Pilih Siswa atau Ringkasan Kelas */}
          <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-rose-50">
              <div>
                <h3 className="font-bold text-rose-950 text-lg">Rekapitulasi Nilai Kelas</h3>
                <p className="text-slate-500 text-sm">Analisis pencapaian seluruh siswa terdaftar.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Pilih Siswa:</span>
                <select 
                  value={selectedStudent} 
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl text-sm font-semibold text-rose-950 outline-none focus:ring-2 focus:ring-rose-800/20"
                >
                  {classSummary.map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tabel Ringkasan Nilai Siswa */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-rose-100 text-xs font-bold text-rose-900 uppercase bg-rose-50/50">
                    <th className="p-3 rounded-l-xl">Nama Siswa</th>
                    <th className="p-3">Nilai LKPD</th>
                    <th className="p-3">Latihan Soal</th>
                    <th className="p-3">Asesmen</th>
                    <th className="p-3 rounded-r-xl">Status Progres</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50 text-sm">
                  {classSummary.map((row, idx) => (
                    <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                      <td className="p-3 font-semibold text-slate-800 flex items-center gap-2">
                        <User size={16} className="text-rose-800" /> {row.name}
                      </td>
                      <td className="p-3 font-medium text-slate-600">{row.lkpd}</td>
                      <td className="p-3 font-medium text-slate-600">{row.latihan}</td>
                      <td className="p-3 font-medium text-slate-600">{row.asesmen}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          row.progress === 'Sangat Baik' ? 'bg-emerald-100 text-emerald-800' :
                          row.progress === 'Baik' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {row.progress}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Saran Tindak Lanjut Guru */}
          <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-6">
            <h4 className="font-bold text-rose-950 mb-3 flex items-center gap-2">
              <AlertCircle size={18} className="text-rose-800" /> Rencana Tindak Lanjut Pembelajaran Kelas
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Sebagian besar siswa telah menguasai materi dasar. Namun, terdapat beberapa siswa yang memerlukan sesi pengayaan (*remedial* / bimbingan khusus) terutama pada pemecahan soal cerita SPLDV.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2.5 bg-rose-900 hover:bg-rose-950 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                Unduh Rekap Nilai (CSV)
              </button>
              <button className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-900 text-sm font-semibold rounded-xl transition-colors">
                Kirim Catatan Evaluasi ke Siswa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationModule;
