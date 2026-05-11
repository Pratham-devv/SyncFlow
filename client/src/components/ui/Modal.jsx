import { X } from 'lucide-react';

const Modal = ({ open, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className={`bg-white w-full ${maxWidth} rounded-2xl border border-slate-200 flex flex-col overflow-hidden`}
        style={{ maxHeight: '90vh', boxShadow: '0 25px 60px rgba(0,0,0,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <h3
              className="font-bold text-slate-900 text-lg"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {/* Body */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
