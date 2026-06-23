import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  /** Optional footer (centered at bottom) */
  footer?: React.ReactNode;
  /** Whether to show decorative blurred color blobs */
  decorations?: boolean;
  /** Max width for inner panel */
  maxWidthClass?: string;
  /** Additional className for outer wrapper */
  className?: string;
}

/**
 * AdminLayout: full screen centered container for admin auth pages.
 * Separates structural layout from form implementation so future pages
 * (e.g. ForgotPassword, 2FA) reuse consistent chrome.
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  footer,
  decorations = false,
  maxWidthClass = 'max-w-md',
  className = ''
}) => {
  return (
    <div className={
      'min-h-screen w-full relative flex items-center justify-center px-4 py-10 bg-neutral-50 font-sans ' +
      className
    }>
      {/* Subtle patterned background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.08),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(5,150,105,0.08),transparent_65%)]" />
      {decorations && (
        <div className="pointer-events-none absolute inset-0 opacity-40 select-none mix-blend-overlay">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl" />
        </div>
      )}
      <div className={`relative z-10 w-full ${maxWidthClass}`}>
        <div className="relative rounded-2xl border border-emerald-900/10 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_4px_-2px_rgba(0,0,0,0.06)] px-8 py-10">
          {/* Header brand small */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <img src="/images/unand.png" alt="Logo" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-xl font-black tracking-tight text-emerald-700 leading-tight">Library Admin</h1>
                <p className="text-[11px] font-semibold text-emerald-600/80 uppercase tracking-wider">Secure Access</p>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
      {footer && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-medium text-gray-500 tracking-wide">
          {footer}
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
