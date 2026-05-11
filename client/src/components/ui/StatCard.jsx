const StatCard = ({ label, value, icon: Icon, bgColor, iconColor }) => (
  <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-4 flex items-center gap-4 hover:shadow-md dark:hover:shadow-black/20 transition-shadow duration-200">
    <div className="p-2.5 rounded-xl shrink-0" style={{ background: bgColor }}>
      <Icon size={20} style={{ color: iconColor }} />
    </div>
    <div className="min-w-0">
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{label}</div>
      <div
        className="text-lg font-bold text-slate-900 dark:text-white leading-tight"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {value}
      </div>
    </div>
  </div>
);

export default StatCard;
