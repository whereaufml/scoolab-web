import { memo } from 'react';

const DashboardCard = memo(({ icon: Icon, title, desc, color, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
      <Icon size={28} />
    </div>
    <h3 className="font-semibold text-slate-800 text-lg mb-1">{title}</h3>
    <p className="text-slate-500 text-sm">{desc}</p>
  </div>
));

export default DashboardCard;
