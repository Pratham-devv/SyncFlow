const Badge = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}
  >
    {children}
  </span>
);

export default Badge;
