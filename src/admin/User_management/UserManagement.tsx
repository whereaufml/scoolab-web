import React, { useState } from 'react';
import {
  Users, Shield, GraduationCap, ChevronRight, X, UserSquare2, Key,
  Plus, Edit3, Trash2, Save, Phone, IdCard, BookOpen, AlertTriangle
} from 'lucide-react';

// --- TIPE DATA ---
type Role = 'admin' | 'guru' | 'siswa';

interface BaseUser {
  id: string;
  nama: string;
  usn: string;
  pass: string;
}
interface AdminUser extends BaseUser { role: 'admin'; kontak: string; }
interface GuruUser extends BaseUser { role: 'guru'; nip: string; }
interface SiswaUser extends BaseUser { role: 'siswa'; nim: string; kelas: string; }
type AnyUser = AdminUser | GuruUser | SiswaUser;

// --- DATA SEMENTARA ---
const INITIAL_USERS_DATA: { admin: AdminUser[]; guru: GuruUser[]; siswa: SiswaUser[] } = {
  admin: [{ id: 'a1', nama: 'Admin Utama', usn: 'admin_utama', pass: 'admin123', role: 'admin', kontak: '08123456789' }],
  guru: [{ id: 'g1', nama: 'Bpk. Budi Santoso', usn: 'budi_guru', pass: 'guru123', role: 'guru', nip: '198001012005011001' }],
  siswa: [{ id: 's1', nama: 'Andi Wijaya', usn: 'andi_siswa', pass: 'siswa123', role: 'siswa', nim: '2026001', kelas: '7A' }],
};

const emptyForm = { nama: '', usn: '', pass: '', kontak: '', nip: '', nim: '', kelas: '7A' };

const UserManagement: React.FC = () => {
  const [usersData, setUsersData] = useState(INITIAL_USERS_DATA);
  const [activeTab, setActiveTab] = useState<Role>('siswa');
  const [selectedUser, setSelectedUser] = useState<AnyUser | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);

  const [deleteTarget, setDeleteTarget] = useState<AnyUser | null>(null);

  const tabs: { id: Role; label: string; icon: any }[] = [
    { id: 'admin', label: 'Administrator', icon: Shield },
    { id: 'guru', label: 'Data Guru', icon: Users },
    { id: 'siswa', label: 'Data Siswa', icon: GraduationCap },
  ];

  const currentUsers = usersData[activeTab];

  // --- TAMBAH USER ---
  const openAddModal = () => {
    setAddForm(emptyForm);
    setShowAddModal(true);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.nama.trim() || !addForm.usn.trim() || !addForm.pass.trim()) {
      alert('Nama, username, dan kata sandi wajib diisi!');
      return;
    }

    const id = `${activeTab.charAt(0)}${Date.now()}`;

    if (activeTab === 'admin') {
      const newUser: AdminUser = { id, nama: addForm.nama, usn: addForm.usn, pass: addForm.pass, role: 'admin', kontak: addForm.kontak };
      setUsersData(prev => ({ ...prev, admin: [...prev.admin, newUser] }));
    } else if (activeTab === 'guru') {
      const newUser: GuruUser = { id, nama: addForm.nama, usn: addForm.usn, pass: addForm.pass, role: 'guru', nip: addForm.nip };
      setUsersData(prev => ({ ...prev, guru: [...prev.guru, newUser] }));
    } else {
      const newUser: SiswaUser = { id, nama: addForm.nama, usn: addForm.usn, pass: addForm.pass, role: 'siswa', nim: addForm.nim, kelas: addForm.kelas };
      setUsersData(prev => ({ ...prev, siswa: [...prev.siswa, newUser] }));
    }

    setShowAddModal(false);
  };

  // --- EDIT USER ---
  const openEditMode = (user: AnyUser) => {
    setEditForm({
      nama: user.nama,
      usn: user.usn,
      pass: user.pass,
      kontak: user.role === 'admin' ? user.kontak : '',
      nip: user.role === 'guru' ? user.nip : '',
      nim: user.role === 'siswa' ? user.nim : '',
      kelas: user.role === 'siswa' ? user.kelas : '7A',
    });
    setIsEditingProfile(true);
  };

  const handleSaveEdit = () => {
    if (!selectedUser) return;

    setUsersData(prev => {
      const list = prev[selectedUser.role] as AnyUser[];
      const updatedList = list.map(u => {
        if (u.id !== selectedUser.id) return u;
        if (u.role === 'admin') return { ...u, nama: editForm.nama, usn: editForm.usn, pass: editForm.pass, kontak: editForm.kontak };
        if (u.role === 'guru') return { ...u, nama: editForm.nama, usn: editForm.usn, pass: editForm.pass, nip: editForm.nip };
        return { ...u, nama: editForm.nama, usn: editForm.usn, pass: editForm.pass, nim: editForm.nim, kelas: editForm.kelas };
      });
      return { ...prev, [selectedUser.role]: updatedList };
    });

    setIsEditingProfile(false);
    setSelectedUser(null);
  };

  // --- HAPUS USER ---
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setUsersData(prev => ({
      ...prev,
      [deleteTarget.role]: (prev[deleteTarget.role] as AnyUser[]).filter(u => u.id !== deleteTarget.id),
    }));
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Manajemen Pengguna</h2>
          <p className="text-blue-600 text-sm mt-1">Kelola akses, profil, dan kata sandi pengguna sistem.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm w-fit"
        >
          <Plus size={16} /> Tambah {activeTab === 'admin' ? 'Admin' : activeTab === 'guru' ? 'Guru' : 'Siswa'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center p-5 rounded-2xl border transition-all duration-300 group ${
                isActive ? 'bg-blue-600 border-blue-700 text-white shadow-md' : 'bg-white border-blue-100 text-blue-800 hover:bg-blue-50'
              }`}
            >
              <div className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'bg-blue-500' : 'bg-blue-100'}`}>
                <Icon size={24} className={isActive ? 'text-white' : 'text-blue-600 group-hover:text-blue-800'} />
              </div>
              <div className="ml-4 text-left">
                <p className={`text-sm font-medium ${isActive ? 'text-blue-100' : 'text-blue-500'}`}>{tab.label}</p>
                <p className="text-2xl font-bold">{usersData[tab.id].length} Akun</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden mt-8">
        <div className="p-4 border-b border-blue-50 bg-blue-50/30">
          <h3 className="font-semibold text-blue-800 capitalize">Daftar {activeTab}</h3>
        </div>
        <div className="divide-y divide-blue-50">
          {currentUsers.length === 0 && (
            <p className="p-6 text-center text-sm text-blue-400">Belum ada data.</p>
          )}
          {currentUsers.map((user) => (
            <div key={user.id} className="w-full flex items-center p-4 hover:bg-blue-50 transition-all duration-300 group">
              <button onClick={() => setSelectedUser(user)} className="flex items-center flex-1 text-left">
                <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-bold transition-transform duration-300 group-hover:scale-110">
                  {user.nama.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4 text-left flex-1">
                  <p className="font-semibold text-blue-900 group-hover:text-blue-700 transition-colors">{user.nama}</p>
                  <p className="text-xs text-blue-500 font-medium">@{user.usn}</p>
                </div>
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => setSelectedUser(user)} className="flex items-center text-blue-400 group-hover:text-blue-600 p-2">
                  <ChevronRight size={20} />
                </button>
                <button onClick={() => setDeleteTarget(user)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL DETAIL / EDIT PROFIL --- */}
      {selectedUser && (
        <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-blue-600 p-6 relative">
              <button
                onClick={() => { setSelectedUser(null); setIsEditingProfile(false); }}
                className="absolute top-4 right-4 p-2 bg-blue-700/50 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl shadow-inner mx-auto mb-3 border-4 border-blue-300">
                {selectedUser.nama.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-center font-bold text-xl text-white">{selectedUser.nama}</h3>
              <p className="text-center text-blue-100 text-sm capitalize font-medium">{selectedUser.role}</p>
            </div>

            {!isEditingProfile ? (
              <div className="p-6 space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <UserSquare2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                  <div><p className="text-xs font-semibold text-blue-600">Username</p><p className="text-sm font-medium text-blue-950">{selectedUser.usn}</p></div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <Key className="text-blue-500 shrink-0 mt-0.5" size={20} />
                  <div><p className="text-xs font-semibold text-blue-600">Kata Sandi</p><p className="text-sm font-medium text-blue-950">{selectedUser.pass}</p></div>
                </div>

                {selectedUser.role === 'admin' && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <Phone className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <div><p className="text-xs font-semibold text-blue-600">Kontak</p><p className="text-sm font-medium text-blue-950">{selectedUser.kontak || '-'}</p></div>
                  </div>
                )}
                {selectedUser.role === 'guru' && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <IdCard className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <div><p className="text-xs font-semibold text-blue-600">NIP</p><p className="text-sm font-medium text-blue-950">{selectedUser.nip || '-'}</p></div>
                  </div>
                )}
                {selectedUser.role === 'siswa' && (
                  <>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                      <IdCard className="text-blue-500 shrink-0 mt-0.5" size={20} />
                      <div><p className="text-xs font-semibold text-blue-600">NIM</p><p className="text-sm font-medium text-blue-950">{selectedUser.nim || '-'}</p></div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                      <BookOpen className="text-blue-500 shrink-0 mt-0.5" size={20} />
                      <div><p className="text-xs font-semibold text-blue-600">Kelas</p><p className="text-sm font-medium text-blue-950">{selectedUser.kelas || '-'}</p></div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-6 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-blue-600 mb-1">Nama</label>
                  <input value={editForm.nama} onChange={e => setEditForm({ ...editForm, nama: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-600 mb-1">Username</label>
                  <input value={editForm.usn} onChange={e => setEditForm({ ...editForm, usn: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-600 mb-1">Kata Sandi</label>
                  <input value={editForm.pass} onChange={e => setEditForm({ ...editForm, pass: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                </div>
                {selectedUser.role === 'admin' && (
                  <div>
                    <label className="block text-xs font-semibold text-blue-600 mb-1">Kontak</label>
                    <input value={editForm.kontak} onChange={e => setEditForm({ ...editForm, kontak: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                  </div>
                )}
                {selectedUser.role === 'guru' && (
                  <div>
                    <label className="block text-xs font-semibold text-blue-600 mb-1">NIP</label>
                    <input value={editForm.nip} onChange={e => setEditForm({ ...editForm, nip: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                  </div>
                )}
                {selectedUser.role === 'siswa' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-blue-600 mb-1">NIM</label>
                      <input value={editForm.nim} onChange={e => setEditForm({ ...editForm, nim: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-blue-600 mb-1">Kelas</label>
                      <input value={editForm.kelas} onChange={e => setEditForm({ ...editForm, kelas: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="p-4 bg-blue-50/50 border-t border-blue-100 flex justify-end gap-2">
              {!isEditingProfile ? (
                <>
                  <button onClick={() => openEditMode(selectedUser)} className="px-4 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-sm font-bold rounded-xl transition-colors flex items-center gap-2">
                    <Edit3 size={16} /> Edit
                  </button>
                  <button onClick={() => { setSelectedUser(null); setIsEditingProfile(false); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">Tutup Profil</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl">Batal</button>
                  <button onClick={handleSaveEdit} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center gap-2">
                    <Save size={16} /> Simpan
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH USER --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-blue-100 pb-3">
              <h3 className="font-bold text-lg text-blue-900">Tambah {activeTab === 'admin' ? 'Admin' : activeTab === 'guru' ? 'Guru' : 'Siswa'} Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-blue-400 hover:text-blue-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-blue-600 mb-1">Nama Lengkap</label>
                <input value={addForm.nama} onChange={e => setAddForm({ ...addForm, nama: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-600 mb-1">Username</label>
                <input value={addForm.usn} onChange={e => setAddForm({ ...addForm, usn: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-600 mb-1">Kata Sandi</label>
                <input value={addForm.pass} onChange={e => setAddForm({ ...addForm, pass: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" required />
              </div>
              {activeTab === 'admin' && (
                <div>
                  <label className="block text-xs font-semibold text-blue-600 mb-1">Kontak</label>
                  <input value={addForm.kontak} onChange={e => setAddForm({ ...addForm, kontak: e.target.value })} placeholder="08xxxxxxxxxx" className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                </div>
              )}
              {activeTab === 'guru' && (
                <div>
                  <label className="block text-xs font-semibold text-blue-600 mb-1">NIP</label>
                  <input value={addForm.nip} onChange={e => setAddForm({ ...addForm, nip: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                </div>
              )}
              {activeTab === 'siswa' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-blue-600 mb-1">NIM</label>
                    <input value={addForm.nim} onChange={e => setAddForm({ ...addForm, nim: e.target.value })} className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-blue-600 mb-1">Kelas</label>
                    <input value={addForm.kelas} onChange={e => setAddForm({ ...addForm, kelas: e.target.value })} placeholder="7A" className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm" />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI HAPUS --- */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Akun?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Apakah kamu yakin ingin menghapus akun <strong>{deleteTarget.nama}</strong>? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Batal</button>
              <button onClick={handleConfirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;