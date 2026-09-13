import React, { useState } from 'react';
import { Users, Shield, GraduationCap, ChevronRight, X, UserSquare2, Key, Info } from 'lucide-react';

// Struktur data tiruan yang diperbarui (3 Admin, 3 Guru, 5 Siswa)
const MOCK_USERS_DATA = {
  admin: [
    { id: 'a1', nama: 'Admin Utama', usn: 'admin_utama', pass: 'admin123', role: 'admin', kontak: '08123456789' },
    { id: 'a2', nama: 'Admin IT Sistem', usn: 'admin_it', pass: 'admin123', role: 'admin', kontak: '08129876543' },
    { id: 'a3', nama: 'Admin Kurikulum', usn: 'admin_kur', pass: 'admin123', role: 'admin', kontak: '08121122334' },
  ],
  guru: [
    { id: 'g1', nama: 'Guru Satu (Matematika)', usn: 'Guru 1', pass: 'guru123', role: 'guru', nip: '198001012005011001' },
    { id: 'g2', nama: 'Guru Dua (IPA)', usn: 'Guru 2', pass: 'guru123', role: 'guru', nip: '198202022006022002' },
    { id: 'g3', nama: 'Guru Tiga (Bahasa)', usn: 'Guru 3', pass: 'guru123', role: 'guru', nip: '198503032008032003' },
  ],
  siswa: [
    { id: 's1', nama: 'Siswa Satu', usn: 'Siswa 1', pass: 'siswa123', role: 'siswa', nim: '2026001', kelas: 'Kelas 8A' },
    { id: 's2', nama: 'Siswa Dua', usn: 'Siswa 2', pass: 'siswa123', role: 'siswa', nim: '2026002', kelas: 'Kelas 8A' },
    { id: 's3', nama: 'Siswa Tiga', usn: 'Siswa 3', pass: 'siswa123', role: 'siswa', nim: '2026003', kelas: 'Kelas 8B' },
    { id: 's4', nama: 'Siswa Empat', usn: 'Siswa 4', pass: 'siswa123', role: 'siswa', nim: '2026004', kelas: 'Kelas 8B' },
    { id: 's5', nama: 'Siswa Lima', usn: 'Siswa 5', pass: 'siswa123', role: 'siswa', nim: '2026005', kelas: 'Kelas 8A' },
  ],
};

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'admin' | 'guru' | 'siswa'>('siswa');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Komponen untuk 3 kotak bagian atas
  const tabs = [
    { id: 'admin', label: 'Administrator', icon: Shield, count: MOCK_USERS_DATA.admin.length },
    { id: 'guru', label: 'Data Guru', icon: Users, count: MOCK_USERS_DATA.guru.length },
    { id: 'siswa', label: 'Data Siswa', icon: GraduationCap, count: MOCK_USERS_DATA.siswa.length },
  ];

  const currentUsers = MOCK_USERS_DATA[activeTab];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-900">Manajemen Pengguna</h2>
        <p className="text-emerald-600 text-sm mt-1">Kelola akses, profil, dan kata sandi pengguna sistem.</p>
      </div>

      {/* 3 Kotak Pemilihan Kategori */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center p-5 rounded-2xl border transition-all duration-300 group ${
                isActive 
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' 
                  : 'bg-white border-emerald-100 text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <div className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'bg-emerald-400/50' : 'bg-emerald-100'}`}>
                <Icon size={24} className={isActive ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-800'} />
              </div>
              <div className="ml-4 text-left">
                <p className={`text-sm font-medium ${isActive ? 'text-emerald-100' : 'text-emerald-500'}`}>{tab.label}</p>
                <p className="text-2xl font-bold">{tab.count} Akun</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Daftar Pengguna */}
      <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden mt-8">
        <div className="p-4 border-b border-emerald-50 bg-emerald-50/30">
          <h3 className="font-semibold text-emerald-800 capitalize">Daftar {activeTab}</h3>
        </div>
        <div className="divide-y divide-emerald-50">
          {currentUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="w-full flex items-center p-4 hover:bg-emerald-50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-700 font-bold transition-transform duration-300 group-hover:scale-110">
                {user.nama.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4 text-left flex-1">
                <p className="font-semibold text-emerald-900 group-hover:text-emerald-700 transition-colors">{user.nama}</p>
                <p className="text-xs text-emerald-500 font-medium">@{user.usn}</p>
              </div>
              <div className="flex items-center text-emerald-400 group-hover:text-emerald-600 transition-all duration-300 group-hover:translate-x-1">
                <span className="text-xs font-medium mr-2 opacity-0 group-hover:opacity-100 transition-opacity">Lihat Detail</span>
                <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal Detail Profil */}
      {selectedUser && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Header Modal */}
            <div className="bg-emerald-500 p-6 relative">
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-2 bg-emerald-600/50 text-white rounded-full hover:bg-emerald-600 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-emerald-500 font-bold text-3xl shadow-inner mx-auto mb-3 border-4 border-emerald-300">
                {selectedUser.nama.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-center font-bold text-xl text-white">{selectedUser.nama}</h3>
              <p className="text-center text-emerald-100 text-sm capitalize font-medium">{selectedUser.role}</p>
            </div>

            {/* Isi Detail Modal */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <UserSquare2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs font-semibold text-emerald-600">Username</p>
                  <p className="text-sm font-medium text-emerald-950">{selectedUser.usn}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <Key className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs font-semibold text-emerald-600">Kata Sandi</p>
                  <p className="text-sm font-medium text-emerald-950">{selectedUser.pass}</p>
                </div>
              </div>

              {/* Tampilan Kondisional Berdasarkan Peran */}
              {selectedUser.role === 'siswa' && (
                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <Info className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-xs font-semibold text-emerald-600">NIM & Kelas</p>
                    <p className="text-sm font-medium text-emerald-950">{selectedUser.nim} • {selectedUser.kelas}</p>
                  </div>
                </div>
              )}

              {selectedUser.role === 'guru' && (
                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <Info className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-xs font-semibold text-emerald-600">NIP (Nomor Induk Pegawai)</p>
                    <p className="text-sm font-medium text-emerald-950">{selectedUser.nip}</p>
                  </div>
                </div>
              )}

            </div>
            
            <div className="p-4 bg-emerald-50/50 border-t border-emerald-100 flex justify-end">
              <button onClick={() => setSelectedUser(null)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors">
                Tutup Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 

