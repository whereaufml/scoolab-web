import React, { useState } from 'react';
import { 
  Users, UserCheck, BookOpen, Calendar, HelpCircle, 
  LayoutDashboard, Menu, X, ChevronRight 
} from 'lucide-react';

import AcademicManagement from '../admin/academic_management/AcademicManagement';
import HelpdeskManagement from '../admin/Helpdesk/HelpdeskManagement';
import OperationalManagement from '../admin/operational_management/OperationalManagement';
import UserManagement from '../admin/User_management/UserManagement';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dasbor Utama', icon: LayoutDashboard },
    { id: 'pengguna', label: 'Manajemen Pengguna', icon: Users },
    { id: 'akademik', label: 'Akademik & Kelas', icon: BookOpen },
    { id: 'jadwal', label: 'Operasional & Jadwal', icon: Calendar },
    { id: 'helpdesk', label: 'Helpdesk Siswa', icon: HelpCircle },
  ];

  const metricCards = [
    { title: 'Total Siswa Aktif', count: '342', icon: Users, color: 'text-blue-500', hoverColor: 'group-hover:text-blue-800' },
    { title: 'Total Guru Aktif', count: '28', icon: UserCheck, color: 'text-emerald-500', hoverColor: 'group-hover:text-emerald-800' },
    { title: 'Kelas Aktif (Presensi Buka)', count: '12', icon: BookOpen, color: 'text-amber-500', hoverColor: 'group-hover:text-amber-800' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar untuk Laptop & Layar Besar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <LayoutDashboard size={24} />
            Admin Scoolab
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} className={`transition-all duration-300 ease-in-out group-hover:scale-110 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-800'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Header & Navigasi Mobile */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 md:hidden text-center font-bold text-indigo-700">Admin Scoolab</div>
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-indigo-600 capitalize">Administrator</p>
            </div>
            <button onClick={onLogout} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors">
              Keluar
            </button>
          </div>
        </header>

        {/* Menu Mobile Melayang (Overlay) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 md:hidden animate-in fade-in">
            <div className="bg-white w-3/4 h-full p-6 shadow-xl animate-in slide-in-from-left">
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-bold text-indigo-700">Menu Admin</h1>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <nav className="space-y-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveMenu(item.id); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 group"
                    >
                      <Icon size={20} className={`transition-all duration-300 group-hover:scale-110 ${activeMenu === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-800'}`} />
                      <span className={activeMenu === item.id ? 'font-semibold text-indigo-700' : 'text-slate-600'}>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Area Konten Utama */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {activeMenu === 'dashboard' ? (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Ringkasan Sistem</h2>
                <p className="text-slate-500 text-sm mt-1">Pantau aktivitas sekolah secara langsung (Real-time).</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metricCards.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 cursor-pointer group hover:shadow-md hover:border-indigo-100 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-slate-500 text-sm font-medium mb-1">{metric.title}</p>
                          <h3 className="text-4xl font-bold text-slate-800">{metric.count}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl bg-slate-50 transition-all duration-300 group-hover:scale-110 ${metric.color} ${metric.hoverColor}`}>
                          <Icon size={28} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-sm text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Lihat detail</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeMenu === 'pengguna' ? (
            <UserManagement />
          ) : activeMenu === 'akademik' ? (
            <AcademicManagement />
          ) : activeMenu === 'jadwal' ? (
            <OperationalManagement />
          ) : activeMenu === 'helpdesk' ? (
            <HelpdeskManagement />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
