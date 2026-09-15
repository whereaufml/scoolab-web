import { useState, memo } from 'react';
import { ArrowLeft, Calculator, Settings, LogOut } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

const DashboardLayout = memo(({ user, activeServer, onChangeServer, onLogout, onBack, onChangePassword, children }: any) => {  
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"><ArrowLeft size={18} /></button>}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Calculator size={18} className="text-white" /></div>
              <span className="font-bold text-slate-800 hidden sm:block">SCOOLMATE</span>
            </div>
            {activeServer && <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg hidden md:block border border-blue-100">{activeServer.name}</span>}
          </div>
          <div className="flex items-center gap-3">
            {user.role === 'guru' && onChangeServer && !onBack && (
              <button onClick={onChangeServer} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors">
                <ArrowLeft size={14} className="inline mr-1"/>Lobby Server
              </button>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-blue-600 capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 border border-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button onClick={() => setShowSettings(true)} className="p-2 text-slate-400 hover:text-blue-600 rounded-xl transition-colors"><Settings size={20} /></button>
            <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><LogOut size={20} /></button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 relative">{children}</main>
      
      {/* Memanggil Modal Ganti Sandi */}
      <ChangePasswordModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSave={onChangePassword} />
    </div>
  );
});

export default DashboardLayout;
