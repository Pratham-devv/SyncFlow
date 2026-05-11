const StatCard = ({ label, value, icon: Icon, bgColor, iconColor }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
    <div className="p-2.5 rounded-xl shrink-0" style={{ background: bgColor }}>
      <Icon size={20} style={{ color: iconColor }} />
    </div>
    <div className="min-w-0">
      <div className="text-xs text-slate-500 font-medium truncate">{label}</div>
      <div
        className="text-lg font-bold text-slate-900 leading-tight"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {value}
      </div>
    </div>
  </div>
);

export default StatCard;
