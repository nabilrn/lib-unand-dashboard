import React from 'react';
import { FileSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  height?: number | string;
  compact?: boolean;
  scale?: number;
  fillPercent?: number;
  maxWidthPx?: number;
  centerOffset?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak Ada Data',
  subtitle = 'Data untuk periode ini belum tersedia',
  height,
  compact = false,
  scale = 1,
  fillPercent = 0.7,
  maxWidthPx,
  centerOffset = 0
}) => {
  const clampedFill = Math.min(Math.max(fillPercent, 0.4), 0.8);
  let boxHeight: string;
  if (height) {
    boxHeight = typeof height === 'number' ? `${height * scale}px` : height;
  } else if (compact) {
    boxHeight = `clamp(120px, ${Math.round(clampedFill * 100)}%, ${Math.round(260 * scale)}px)`;
  } else {
    boxHeight = `clamp(200px, ${Math.round(clampedFill * 100)}%, ${Math.round(400 * scale)}px)`;
  }
  const maxWidth = maxWidthPx ? `${maxWidthPx}px` : (compact ? '55%' : '50%');

  return (
    <div
      className={
        `flex flex-col items-center justify-center text-center ${compact ? 'px-0 py-0' : 'px-2 py-3'} ` +
        `${compact ? 'w-full' : 'w-full h-full'}`
      }
      style={{ minHeight: compact ? undefined : 320, height: compact ? '100%' : undefined, transform: centerOffset ? `translateY(${centerOffset}px)` : undefined, transition: 'transform .3s ease' }}
    >
      <div style={{ height: boxHeight, maxWidth, width: '100%' }} className="flex items-center justify-center relative transition-all duration-300">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-emerald-200 bg-emerald-50 shadow-[6px_6px_0_0_rgba(5,46,22,0.18)]">
          <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-emerald-500" />
          <FileSearch className="h-12 w-12 text-emerald-700" />
        </div>
      </div>
      <h3 className="mt-2 text-[12px] font-black text-gray-700 tracking-wide">{title}</h3>
      <p className="text-[11px] font-medium text-gray-500 mt-0.5 max-w-[240px] leading-snug">{subtitle}</p>
    </div>
  );
};

export default EmptyState;
