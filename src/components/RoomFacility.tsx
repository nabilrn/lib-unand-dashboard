import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import React from "react";
import { getDemoRooms } from "../data/demoData";
import { getImageUrl } from "../lib/media";
import { useLocale } from "../i18n/LocaleContext";

interface Room {
  id: number;
  name: string;
  description: string;
  photo_path: string;
}

const RoomImage: React.FC<{ url: string; alt: string; className?: string; }> = ({ url, alt, className }) => (
  <img
    src={url}
    alt={alt}
    loading="lazy"
    className={className}
    style={{ objectFit: 'cover' }}
    onError={(e) => {
      (e.target as HTMLImageElement).style.visibility = 'hidden';
    }}
  />
);

export default function RoomFacility() {
  const { locale, t } = useLocale();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const rooms = useMemo<Room[]>(() => getDemoRooms(locale).map(room => ({ ...room })), [locale]);

  useEffect(() => {
    if (rooms.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % rooms.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [rooms.length]);

  useEffect(() => {
    setCurrentImageIndex((current) => Math.min(current, Math.max(0, rooms.length - 1)));
  }, [rooms.length]);

  const currentRoom = rooms[currentImageIndex];

  return (
    <div className="h-full min-h-0 relative overflow-hidden grid grid-rows-[auto_minmax(0,1fr)]">
      <div className="pb-[clamp(7px,1vh,12px)] relative z-10">
        <h3 className="text-gray-900 text-[clamp(14px,1.05vw,18px)] font-black flex items-center gap-2">
          <div className="w-3 h-3 bg-[#16a34a]"></div>
          {t('facility.title')}
        </h3>
      </div>

      <div className="relative z-10 min-h-0 grid grid-rows-[minmax(126px,1fr)_auto] gap-[clamp(8px,1.1vh,12px)]">
        <div className="w-full min-h-0 relative overflow-hidden border-2 border-[#0f7a46] bg-gray-100 shadow-[3px_3px_0px_0px_#052e16]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <RoomImage
                url={getImageUrl(currentRoom?.photo_path) || ''}
                alt={currentRoom?.name || ''}
                className="absolute inset-0 w-full h-full grayscale-[8%] contrast-[1.03] saturate-[0.92]"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute right-2 top-2 flex gap-1 border-2 border-[#052e16] bg-white px-1.5 py-1 shadow-[2px_2px_0px_0px_#052e16]">
            {rooms.map((_, index) => (
              <button
                aria-label={t('facility.imageButton', { index: index + 1 })}
                key={index}
                className={`h-2.5 w-2.5 border border-[#052e16] transition-colors duration-200 ${
                  index === currentImageIndex ? 'bg-[#16a34a]' : 'bg-white hover:bg-emerald-100'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${currentImageIndex}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-0 border-l-4 border-[#16a34a] pl-3 py-0.5"
          >
            <h4 className="font-black text-gray-900 text-[clamp(14px,1.05vw,18px)] leading-snug line-clamp-1">
              {currentRoom?.name}
            </h4>
            <p className="text-gray-700 text-[clamp(11px,0.86vw,14px)] leading-snug line-clamp-3 mt-1">
              {currentRoom?.description}
            </p>
            <div className="mt-[clamp(6px,0.9vh,10px)] flex items-center gap-2 text-[#047857] font-black text-[clamp(10px,0.78vw,12px)]">
              <span className="inline-block h-2 w-2 bg-[#16a34a]" />
              {t('facility.roomProgress', { current: currentImageIndex + 1, total: rooms.length })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
