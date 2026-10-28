import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#193525] text-white px-4.5 py-3 rounded-xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200 max-w-md">
      <CheckCircle2 className="w-5 h-5 text-[#F5CD45] shrink-0" />
      <span className="text-xs font-medium leading-snug">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-md transition-colors ml-auto cursor-pointer"
      >
        <X className="w-4 h-4 text-[#DCE5D5]" />
      </button>
    </div>
  );
};
