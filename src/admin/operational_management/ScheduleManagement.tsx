import React, { useState } from 'react';
import { Calendar, Clock, Megaphone, Plus, Trash2, X, CalendarX, MegaphoneOff } from 'lucide-react';

// --- TIPE DATA ---
interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  targetClass: string;
}

interface EventItem {
  id: string;
  date: string;
  title: string;
  description: string;
  target: 'Semua (Guru & Murid)' | 'Khusus Guru' | 'Khusus Murid';
}

interface ScheduleManagementProps {
  schedules: ScheduleItem[];
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
}

const GRADES = [7, 8, 9];
const CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const ALL_CLASS_OPTIONS = GRADES.flatMap(g => CLASSES.map(c => `Kelas ${g}${c}`));

const ScheduleManagement: React.FC<ScheduleManagementProps> = ({ schedules, setSchedules, events, setEvents }) => {
  const [activeTab, setActiveTab] = useState<'jadwal' | 'event'>('jadwal');

  // State Modal Tambah Jadwal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newDay, setNewDay] = useState('Senin');
  const [newTime, setNewTime] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newClass, setNewClass] = useState(ALL_CLASS_OPTIONS[0]);

  // State Modal Tambah Event
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventTarget, setNewEventTarget] = useState<EventItem['target']>('Semua (Guru & Murid)');

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || !newSubject || !newTeacher) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    const newItem: ScheduleItem = {
      id: `sch_${Date.now()}`,
      day: newDay,
      time: newTime,
      subject: newSubject,
      teacher: newTeacher,
      targetClass: newClass,
    };

    setSchedules(prev => [...prev, newItem]);
    setShowScheduleModal(false);
    setNewTime(''); 
    setNewSubject(''); 
    setNewTeacher('');
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventDate || !newEventTitle || !newEventDesc) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    const newEv: EventItem = {
      id: `ev_${Date.now()}`,
      date: newEventDate,
      title: newEventTitle,
      description: newEventDesc,
      target: newEventTarget,
    };

    setEvents(prev => [...prev, newEv]);
    setShowEventModal(false);
    setNewEventDate(''); 
    setNewEventTitle(''); 
    setNewEventDesc('');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in">
      {/* Header Utama */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
            <Calendar className="text-indigo-600" />
            Manajemen Jadwal & Event Sekolah
          </h2>
          <p className="text-slate-500 text-sm mt-1">Atur jadwal pelajaran harian guru dan siarkan pengumuman event.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('jadwal')} 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'jadwal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'}`}
          >
            Jadwal Mengajar
          </button>
          <button 
            onClick={() => setActiveTab('event')} 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'event' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'}`}
          >
            Event & Pengumuman
          </button>
        </div>
      </div>

      {/* Tab 1: Jadwal Mengajar */}
      {activeTab === 'jadwal' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" /> Daftar Jadwal Harian
            </h3>
            <button 
              onClick={() => setShowScheduleModal(true)} 
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus size={16} /> Tambah Jadwal Baru
            </button>
          </div>

          {schedules.length === 0 ? (
            <div className="bg-white border border-dashed border-indigo-200 rounded-3xl p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-400 rounded-2xl flex items-center justify-center mb-3">
                <CalendarX size={28} />
              </div>
              <p className="font-semibold text-slate-700">Belum ada jadwal mengajar</p>
              <p className="text-sm text-slate-400 mt-1">Klik "Tambah Jadwal Baru" untuk membuat jadwal pertama.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((sch) => (
                <div key={sch.id} className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">{sch.day} • {sch.time}</span>
                    <h4 className="font-bold text-slate-800 text-lg mt-2">{sch.subject} ({sch.targetClass})</h4>
                    <p className="text-xs text-slate-500 font-medium">Pengajar: <span className="text-indigo-600 font-bold">{sch.teacher}</span></p>
                  </div>
                  <button 
                    onClick={() => setSchedules(prev => prev.filter(s => s.id !== sch.id))} 
                    className="p-2 text-slate-400 hover:text-red-600 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Event & Pengumuman */}
      {activeTab === 'event' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Megaphone size={20} className="text-indigo-600" /> Siaran Pengumuman & Event
            </h3>
            <button 
              onClick={() => setShowEventModal(true)} 
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus size={16} /> Buat Pengumuman Baru
            </button>
          </div>

          {events.length === 0 ? (
            <div className="bg-white border border-dashed border-indigo-200 rounded-3xl p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-400 rounded-2xl flex items-center justify-center mb-3">
                <MegaphoneOff size={28} />
              </div>
              <p className="font-semibold text-slate-700">Belum ada event atau pengumuman</p>
              <p className="text-sm text-slate-400 mt-1">Klik "Buat Pengumuman Baru" untuk menyiarkan info pertama.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full">{ev.date}</span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">Target: {ev.target}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg mt-1">{ev.title}</h4>
                    <p className="text-xs text-slate-600">{ev.description}</p>
                  </div>
                  <button 
                    onClick={() => setEvents(prev => prev.filter(e => e.id !== ev.id))} 
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Tambah Jadwal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">Tambah Jadwal Mengajar</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSchedule} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hari</label>
                <select value={newDay} onChange={e => setNewDay(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Jam (Contoh: 08:00 - 09:30)</label>
                <input type="text" value={newTime} onChange={e => setNewTime(e.target.value)} placeholder="08:00 - 09:30" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mata Pelajaran</label>
                <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Matematika" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Guru Pengajar</label>
                <input type="text" value={newTeacher} onChange={e => setNewTeacher(e.target.value)} placeholder="Bpk. Budi Santoso" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Kelas</label>
                <select value={newClass} onChange={e => setNewClass(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  {ALL_CLASS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl">Simpan Jadwal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Event */}
      {showEventModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">Buat Event / Pengumuman Baru</h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
                <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Event / Pengumuman</label>
                <input type="text" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="Contoh: Ujian Tengah Semester" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Detail</label>
                <textarea value={newEventDesc} onChange={e => setNewEventDesc(e.target.value)} placeholder="Rincian pengumuman..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none h-20" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Siaran</label>
                <select value={newEventTarget} onChange={e => setNewEventTarget(e.target.value as EventItem['target'])} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  <option value="Semua (Guru & Murid)">Semua (Guru & Murid)</option>
                  <option value="Khusus Guru">Khusus Guru</option>
                  <option value="Khusus Murid">Khusus Murid</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEventModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl">Publikasikan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
