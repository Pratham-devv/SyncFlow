const AvatarGroup = ({ users = [], max = 3, size = 28 }) => {
  const visible = users.slice(0, max);
  const extra = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((u, i) => (
        <div
          key={u._id || i}
          className="rounded-full ring-2 ring-white bg-brand-100 flex items-center justify-center font-semibold text-brand-700 shrink-0 overflow-hidden"
          style={{ width: size, height: size, fontSize: size * 0.4 }}
          title={u.name || 'User'}
        >
          {(u.name || '?').charAt(0).toUpperCase()}
        </div>
      ))}
      {extra > 0 && (
        <div
          className="rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center font-semibold text-slate-500 shrink-0"
          style={{ width: size, height: size, fontSize: 10 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
