import React, { useState } from 'react';
import {
  Users, Activity, BookOpen, Calendar, HelpCircle,
  LayoutDashboard, Menu, X
} from 'lucide-react';

// Path ini mengikuti struktur folder project kamu:
// AdminDashboard.tsx ada di src/dashboard, sedangkan tiap fitur admin
// punya foldernya sendiri di src/admin/*. Kalau kamu memindahkan/mengganti
// nama folder salah satu fitur, sesuaikan lagi baris importnya di sini.
import UserManagement from '../admin/User_management/UserManagement';
import AttendanceManagement from '../admin/academic_management/AttendanceManagement';
import AcademicManagement from '../admin/academic_management/AcademicManagement';
import ScheduleManagement from '../admin/operational_management/ScheduleManagement';
import HelpdeskManagement from '../admin/Helpdesk/HelpdeskManagement';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
  schedules: any[];
  setSchedules: React.Dispatch<React.SetStateAction<any[]>>;
  events: any[];
  setEvents: React.Dispatch<React.SetStateAction<any[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, schedules, setSchedules, events, setEvents }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Daftar 5 Fitur Utama beserta Tema Warnanya
  const menuItems = [
    { id: 'dashboard', label: 'Dasbor Utama', icon: LayoutDashboard, baseColor: 'text-slate-500', activeColor: 'bg-slate-100 text-slate-800 border-l-4 border-slate-500' },
    { id: 'akun', label: 'Manajemen Akun', icon: Users, baseColor: 'text-blue-500', activeColor: 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' },
    { id: 'presensi', label: 'Presensi & Absensi', icon: Activity, baseColor: 'text-pink-500', activeColor: 'bg-pink-50 text-pink-700 border-l-4 border-pink-500' },
    { id: 'kelas', label: 'Manajemen Kelas', icon: BookOpen, baseColor: 'text-emerald-500', activeColor: 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' },
    { id: 'jadwal', label: 'Manajemen Jadwal', icon: Calendar, baseColor: 'text-purple-500', activeColor: 'bg-purple-50 text-purple-700 border-l-4 border-purple-500' },
    { id: 'helpdesk', label: 'Helpdesk Keluhan', icon: HelpCircle, baseColor: 'text-amber-500', activeColor: 'bg-amber-50 text-amber-700 border-l-4 border-amber-500' },
  ];

  const metricCards = [
    { title: 'Total Siswa Aktif', count: '342', icon: Users, color: 'text-blue-500' },
    { title: 'Siswa Hadir Hari Ini', count: '330', icon: Activity, color: 'text-pink-500' },
    { title: 'Kelas Aktif', count: '12', icon: BookOpen, color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Laptop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard size={24} className="text-indigo-600" />
            Admin Scoolab
          </h1>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 transition-all duration-300 group ${
                  isActive ? `${item.activeColor} font-bold` : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                <Icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? '' : item.baseColor}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Drawer Sidebar Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[80%] bg-white h-full flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <LayoutDashboard size={24} className="text-indigo-600" />
                Admin Scoolab
              </h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveMenu(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-6 py-3 transition-all duration-300 ${
                      isActive ? `${item.activeColor} font-bold` : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    <Icon size={20} className={isActive ? '' : item.baseColor} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-indigo-600 capitalize mb-3">Administrator</p>
              <button onClick={onLogout} className="w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors">Keluar</button>
            </div>
          </aside>
        </div>
      )}

      {/* Header & Area Utama */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <button className="md:hidden p-2 text-slate-500" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
          <div className="flex-1 md:hidden text-center font-bold text-slate-800">Admin Scoolab</div>
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-indigo-600 capitalize">Administrator</p>
            </div>
            <button onClick={onLogout} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors">Keluar</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {activeMenu === 'dashboard' ? (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Ringkasan Sistem</h2>
                <p className="text-slate-500 text-sm mt-1">Pantau status sekolah secara keseluruhan.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metricCards.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-slate-500 text-sm font-medium mb-1">{metric.title}</p>
                          <h3 className="text-4xl font-bold text-slate-800">{metric.count}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl bg-slate-50 ${metric.color}`}><Icon size={28} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeMenu === 'akun' ? (
            <UserManagement />
          ) : activeMenu === 'presensi' ? (
            <AttendanceManagement />
          ) : activeMenu === 'kelas' ? (
            <AcademicManagement />
          ) : activeMenu === 'jadwal' ? (
            <ScheduleManagement schedules={schedules} setSchedules={setSchedules} events={events} setEvents={setEvents} />
          ) : activeMenu === 'helpdesk' ? (
            <HelpdeskManagement />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;