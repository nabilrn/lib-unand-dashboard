import { Trophy, User } from 'lucide-react';
import EmptyState from './EmptyState';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { toBrowserLocale } from '../i18n/locales';

interface LeaderboardItem {
  rank: number;
  member_name: string;
  member_id: string;
  faculty: string;
  total: number;
  label?: string; // For books: title, for others: visits/loans
}

interface LeaderboardProps {
  title: string;
  subtitle: string;
  data: LeaderboardItem[];
  type: 'visitors' | 'borrowers';
}

// Responsive 5x2 Grid Component that adapts cards to container size
function ResponsiveFiveByTwo({ items, metricLabel, browserLocale }: { items: LeaderboardItem[], metricLabel: string, browserLocale: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState({ width: 144, height: 144 });

  useLayoutEffect(() => {
    const updateTileSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableWidth = rect.width;
        const availableHeight = rect.height;
        
        // Calculate tile dimensions for 5 columns, 2 rows with gaps
        const gapSize = 8; // 0.5rem = 8px
        const tileWidth = (availableWidth - (4 * gapSize)) / 5;
        const tileHeight = (availableHeight - gapSize) / 2;
        
        // Use the smaller dimension to maintain square aspect ratio
        const finalSize = Math.min(tileWidth, tileHeight);
        
        setTileSize({
          width: Math.max(finalSize, 60), // Minimum 60px
          height: Math.max(finalSize, 60)
        });
      }
    };

    updateTileSize();

    const resizeObserver = new ResizeObserver(updateTileSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const getCardColor = (rank: number) => {
    switch (rank) {
      case 1: return '#facc15';
      case 2: return '#d1d5db';
      case 3: return '#d97706';
      default: return '#16a34a';
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <div 
        className="grid gap-2 w-full h-full"
        style={{
          gridTemplateColumns: `repeat(5, ${tileSize.width}px)`,
          gridTemplateRows: `repeat(2, ${tileSize.height}px)`,
          justifyContent: 'center',
          alignContent: 'center'
        }}
      >
        {items.map((item) => (
          <CardTile 
            key={`${item.member_id}-${item.rank}`}
            item={item}
            metricLabel={metricLabel}
            browserLocale={browserLocale}
            color={getCardColor(item.rank)}
            tileSize={tileSize}
          />
        ))}
      </div>
    </div>
  );
}

// Utility function to convert text to proper case (capitalize first letter of each word)
function toProperCase(text: string): string {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

// Individual Card Component with dynamic scaling
function CardTile({ item, metricLabel, browserLocale, color, tileSize }: {
  item: LeaderboardItem;
  metricLabel: string;
  browserLocale: string;
  color: string;
  tileSize: { width: number; height: number };
}) {
  // Scale font sizes based on tile size
  const baseFontScale = Math.min(tileSize.width, tileSize.height) / 144; // 144px is our base size
  const totalFontSize = Math.max(12, 24 * baseFontScale);
  const nameFontSize = Math.max(9, 12 * baseFontScale);
  const detailFontSize = Math.max(8, 11 * baseFontScale);
  const rankFontSize = Math.max(8, 10 * baseFontScale);
  const labelFontSize = Math.max(7, 9 * baseFontScale);

  return (
    <div 
  className="relative select-none rounded-sm overflow-hidden border-2 border-[#15803d] shadow-[4px_4px_0_0_#052e16] group transition-transform duration-200 ease-out hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_0_#064e3b]"
      style={{
        background: color,
        width: tileSize.width,
        height: tileSize.height
      }}
    >
      {/* Rank Badge */}
      <div 
        className="absolute top-1 right-1 bg-black text-white px-1 py-0.5 font-bold leading-none"
        style={{ fontSize: rankFontSize }}
      >
        #{item.rank}
      </div>
      
      {/* Total and Label */}
      <div className="absolute top-2 left-2 leading-none">
        <div 
          className="font-black tracking-tight text-black"
          style={{ fontSize: totalFontSize }}
        >
          {item.total.toLocaleString(browserLocale)}
        </div>
        <div 
          className="font-extrabold uppercase tracking-wide mt-0.5 text-black"
          style={{ fontSize: labelFontSize }}
        >
          {metricLabel}
        </div>
      </div>
      
      {/* Member Info */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] flex flex-col gap-0.5 text-center">
        <div 
          className="font-black text-black truncate"
          style={{ fontSize: nameFontSize }}
          title={item.member_name}
        >
          {toProperCase(item.member_name)}
        </div>
        <div 
          className="font-extrabold text-black tracking-wide"
          style={{ fontSize: detailFontSize }}
        >
          {item.member_id}
        </div>
        <div 
          className="font-extrabold text-black truncate tracking-wide"
          style={{ fontSize: detailFontSize }}
          title={item.faculty}
        >
          {item.faculty}
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard({ title, subtitle, data, type }: LeaderboardProps) {
  const { locale, t } = useLocale();
  const browserLocale = toBrowserLocale(locale);
  // Ambil hanya 10 teratas
  const items = data.slice(0, 10);
  const metricLabel = type === 'borrowers' ? t('leaderboard.loans') : t('leaderboard.visits');
  const isEmpty = items.length === 0;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between mb-2 pb-1.5 border-b border-black/20">
        <div>
          <h2 className="text-sm font-black text-gray-900 flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5 text-[#15803d]" strokeWidth={2.4} />
            {title}
          </h2>
          <p className="text-[10px] text-gray-600 font-semibold">{subtitle}</p>
        </div>
        <div className="flex gap-1 text-[9px] font-black">
          <span className="inline-flex items-center gap-1 border border-[#052e16] bg-[#facc15] px-1.5 py-0.5 text-black shadow-[1px_1px_0px_0px_#052e16]">
            <Trophy className="w-2.5 h-2.5" strokeWidth={2.4} /> {t('leaderboard.topTen')}
          </span>
          <span className="inline-flex items-center gap-1 border border-[#052e16] bg-[#16a34a] px-1.5 py-0.5 text-white shadow-[1px_1px_0px_0px_#052e16]">
            <User className="w-2.5 h-2.5" strokeWidth={2.4} /> {type === 'visitors' ? t('leaderboard.member') : t('leaderboard.borrower')}
          </span>
        </div>
      </div>

      {/* Responsive 5x2 Grid - Cards adapt to container size */}
      <div className="flex-1 relative">
        {isEmpty ? (
          <div className="w-full h-full flex items-center justify-center">
            <EmptyState
              compact
              title={t('leaderboard.emptyTitle')}
              subtitle={t('leaderboard.emptySubtitle')}
              height={260}
              maxWidthPx={320}
              scale={1.2}
              centerOffset={-20}
            />
          </div>
        ) : (
          <ResponsiveFiveByTwo items={items} metricLabel={metricLabel} browserLocale={browserLocale} />
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 mt-1.5 pt-1 border-t border-black/20 flex justify-between items-center text-[9px] text-gray-600">
        <div className="flex gap-2"><span>{t('leaderboard.topPerformance')}</span><span>{t('leaderboard.dailyRanking')}</span></div>
        <div className="text-green-700 font-bold">{t('leaderboard.updatedDaily')}</div>
      </div>
    </div>
  );
}
