import React, { createContext, useCallback, useContext, useState } from 'react';
import { AlertTriangle, CheckCircle2, ImagePlus, Loader2, X } from 'lucide-react';
import { api } from '../../services/api';
import { MediaAsset } from '../../types';

interface ToastItem {
  id: number;
  type: 'success' | 'error';
  message: string;
}

const ToastContext = createContext<{ notify: (type: 'success' | 'error', message: string) => void }>({
  notify: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notify = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-lg border shadow-md text-xs font-medium ${
              t.type === 'success'
                ? 'bg-emerald-950 text-emerald-50 border-emerald-800'
                : 'bg-red-950 text-red-50 border-red-800'
            }`}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-slate-400 hover:text-white cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  busy = false,
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer disabled:opacity-60"
          >
            {busy ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CloudinaryImageField({
  label,
  folder,
  value,
  onChange,
}: {
  label: string;
  folder: string;
  value?: MediaAsset;
  onChange: (asset: MediaAsset) => void;
}) {
  const { notify } = useToast();
  const [uploading, setUploading] = useState(false);

  const current: MediaAsset = value || { public_id: '', secure_url: '', alt: '' };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const asset = await api.uploadImage(file, folder, current.alt || label, current.public_id || undefined);
      onChange(asset);
      notify('success', 'Image uploaded and optimized successfully.');
    } catch (err: any) {
      notify('error', err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 border border-slate-200 rounded-lg p-3.5 bg-slate-50">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {current.secure_url ? (
          <img
            src={current.secure_url}
            alt={current.alt || label}
            referrerPolicy="no-referrer"
            className="w-24 h-16 object-cover rounded border border-slate-200 bg-white shrink-0"
          />
        ) : (
          <div className="w-24 h-16 rounded border border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 shrink-0">
            <ImagePlus className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 w-full space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 cursor-pointer">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
              <span>{uploading ? 'Uploading...' : current.secure_url ? 'Replace Image' : 'Upload to Cloudinary'}</span>
              <input type="file" accept="image/*" className="sr-only" onChange={handleFile} disabled={uploading} />
            </label>
          </div>
          <input
            type="text"
            value={current.alt}
            onChange={(e) => onChange({ ...current, alt: e.target.value })}
            placeholder="Image alt text (for SEO & accessibility)"
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-700"
          />
        </div>
      </div>
    </div>
  );
}
