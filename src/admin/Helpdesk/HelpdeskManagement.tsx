import React, { useState } from 'react';
import { MessageSquare, Send, User, CheckCircle2, ShieldAlert } from 'lucide-react';

// Struktur Data Tiruan untuk Helpdesk
const INITIAL_THREADS = [
  {
    id: 't1',
    studentName: 'Siswa Satu (8A)',
    status: 'menunggu', // menunggu | selesai
    messages: [
      {
        id: 'm1',
        isAdmin: false,
        text: 'Halo Bapak/Ibu Admin, saya mengalami kendala saat mencoba mengerjakan Latihan Bab 2. Tombol mulainya tidak bisa ditekan padahal saya sudah membaca materinya sampai selesai. Apakah ada perbaikan sistem? Terima kasih banyak sebelumnya.',
      }
    ]
  },
  {
    id: 't2',
    studentName: 'Siswa Tiga (9C)',
    status: 'selesai',
    messages: [
      {
        id: 'm2',
        isAdmin: false,
        text: 'Permisi, sandi saya tiba-tiba tidak bisa digunakan di HP baru.',
      },
      {
        id: 'm3',
        isAdmin: true,
        text: 'Halo Siswa Tiga, sistem mendeteksi akunmu login di 2 perangkat berbeda. Sesuai aturan keamanan, silakan gunakan tombol "Izinkan Perangkat Baru & Keluar" saat peringatan muncul ya.',
      }
    ]
  }
];

const HelpdeskManagement: React.FC = () => {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [replyingThreadId, setReplyingThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fungsi memperluas teks yang panjang
  const toggleExpand = (msgId: string) => {
    setExpandedMessageId(expandedMessageId === msgId ? null : msgId);
  };

  // Fungsi mengirim balasan Admin
  const handleSendReply = (threadId: string) => {
    if (!replyText.trim()) return;

    setThreads(prevThreads => 
      prevThreads.map(thread => {
        if (thread.id === threadId) {
          return {
            ...thread,
            status: 'selesai',
            messages: [
              ...thread.messages,
              {
                id: `reply-${Date.now()}`,
                isAdmin: true,
                text: replyText,
              }
            ]
          };
        }
        return thread;
      })
    );
    setReplyText('');
    setReplyingThreadId(null);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-orange-900 flex items-center gap-2">
            <MessageSquare className="text-orange-600" />
            Helpdesk Siswa
          </h2>
          <p className="text-orange-700 text-sm mt-1">
            Bantu selesaikan kendala teknis dan pertanyaan dari siswa.
          </p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <ShieldAlert size={18} />
          {threads.filter(t => t.status === 'menunggu').length} Pesan Menunggu
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-orange-200 overflow-hidden">
        {threads.map((thread, index) => (
          <div key={thread.id} className={`p-6 ${index !== threads.length - 1 ? 'border-b-2 border-dashed border-orange-100' : ''}`}>
            
            {/* Header Diskusi */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-orange-900 font-bold">
                <User size={18} className="text-orange-500" />
                {thread.studentName}
              </div>
              {thread.status === 'selesai' && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 size={14} /> Selesai
                </span>
              )}
            </div>

            {/* Area Gelembung Chat */}
            <div className="space-y-4">
              {thread.messages.map((msg) => {
                const isExpanded = expandedMessageId === msg.id;
                
                return (
                  <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      onClick={() => !msg.isAdmin && toggleExpand(msg.id)}
                      className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl cursor-pointer transition-all duration-300 shadow-sm ${
                        msg.isAdmin 
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm' 
                          : 'bg-amber-50 text-slate-800 border border-amber-200 hover:border-amber-400 rounded-tl-sm'
                      }`}
                    >
                      <p className={`text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {msg.text}
                      </p>
                      {!msg.isAdmin && (
                        <p className="text-[10px] text-amber-500 mt-2 font-semibold">
                          {isExpanded ? 'Tutup teks' : 'Klik untuk melihat selengkapnya / membalas'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tombol Buka Kolom Balasan */}
            {thread.status === 'menunggu' && replyingThreadId !== thread.id && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setReplyingThreadId(thread.id)}
                  className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 font-bold text-sm rounded-xl transition-colors"
                >
                  Balas Pesan Ini
                </button>
              </div>
            )}

            {/* Kolom Input Balasan Admin */}
            {replyingThreadId === thread.id && (
              <div className="mt-4 flex items-end gap-2 animate-in fade-in slide-in-from-top-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Ketik balasan untuk siswa..."
                  className="flex-1 min-h-[80px] p-3 bg-white border-2 border-orange-200 focus:border-orange-500 rounded-2xl text-sm outline-none resize-none transition-colors"
                />
                <button 
                  onClick={() => handleSendReply(thread.id)}
                  className="p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl transition-colors shadow-md group"
                >
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpdeskManagement;
