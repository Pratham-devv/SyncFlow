const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-20">
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Icon size={32} className="text-slate-300" />
      </div>
    )}
    {title && (
      <h3
        className="font-bold text-slate-600 text-base mb-1"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h3>
    )}
    {description && (
      <p className="text-slate-400 text-sm mb-4">{description}</p>
    )}
    {action}
  </div>
);

export default EmptyState;
