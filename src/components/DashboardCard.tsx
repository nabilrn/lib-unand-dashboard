import React from 'react';
import { cn } from './ui/utils';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact';
  innerClassName?: string;
  offset?: number;
  shadowColor?: string;
  borderWidth?: number;
  borderColor?: string; // new: allow customizing border color
}

export function DashboardCard({
  children,
  className,
  variant = 'default',
  innerClassName,
  offset = 10,
  shadowColor,
  borderWidth = 2,
  borderColor = '#15803d'
}: DashboardCardProps) {
  const paddingDefault = 'p-[clamp(12px,1.35vh,22px)]';
  const paddingCompact = 'p-[clamp(10px,1.05vh,16px)]';
  const innerPadding = variant === 'compact' ? paddingCompact : paddingDefault;
  // If shadowColor not explicitly provided, use the borderColor (so App.tsx doesn't need to set it)
  const effectiveShadowColor = shadowColor ?? borderColor;

  return (
    <div className={cn('relative h-full min-h-0 w-full', className)}>
      {/* Solid rectangle shadow - di bawah panel putih */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          transform: `translate(${Math.min(offset, 5)}px, ${Math.min(offset, 5)}px)`,
          backgroundColor: effectiveShadowColor,
          zIndex: 0 // ✅ Gunakan zIndex 0, bukan -1
        }}
      />
      {/* White panel - di atas shadow */}
      <div
        className={cn(
          'relative h-full min-h-0 bg-white border-solid'
        )}
        style={{
          borderWidth: `${borderWidth}px`,
          borderColor: borderColor,
          zIndex: 1 // ✅ Pastikan panel putih di atas shadow
        }}
      >
        <div className={cn('h-full min-h-0', innerPadding, innerClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
