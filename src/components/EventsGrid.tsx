import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { getDemoEvents } from '../data/demoData';
import { getImageUrl } from '../lib/media';
import { useLocale } from '../i18n/LocaleContext';
import { toBrowserLocale } from '../i18n/locales';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  thumbnail_path: string;
  endDate: Date;
  status: 'upcoming' | 'today' | 'tomorrow' | 'passed';
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const EventImage: React.FC<{ filePath: string; alt: string; className?: string; }> = ({ filePath, alt, className }) => {
  const url = getImageUrl(filePath);
  if (!url) return null;
  return (
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
};

const transformEventData = (event: ReturnType<typeof getDemoEvents>[number], browserLocale: string): Event => {
  const now = new Date();
  const eventDate = new Date(event.starts_at || `${event.date}T${event.time}:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

  let status: Event['status'] = 'upcoming';
  if (eventDay.getTime() === today.getTime()) {
    status = 'today';
  } else if (eventDay.getTime() === tomorrow.getTime()) {
    status = 'tomorrow';
  } else if (eventDate < now) {
    status = 'passed';
  }

  return {
    id: event.id,
    title: event.title,
    date: eventDate.toLocaleDateString(browserLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    time: eventDate.toLocaleTimeString(browserLocale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    location: event.location,
    thumbnail_path: event.thumbnail_path || '',
    endDate: eventDate,
    status,
    countdown: event.countdown || { days: 0, hours: 0, minutes: 0, seconds: 0 }
  };
};

export default function EventsGrid() {
  const { locale, t } = useLocale();
  const browserLocale = toBrowserLocale(locale);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const updateEvents = () => {
      setEvents(getDemoEvents(locale).map((event) => transformEventData(event, browserLocale)));
    };

    updateEvents();
    const interval = setInterval(() => {
      updateEvents();
    }, 60000);
    return () => clearInterval(interval);
  }, [browserLocale, locale]);

  const formatCountdown = (countdown: { days: number; hours: number; minutes: number; seconds: number }): string => {
    const { days, hours, minutes } = countdown;

    if (days > 0) {
      return t('events.countdown.days', { days, hours, minutes });
    } else if (hours > 0) {
      return t('events.countdown.hours', { hours, minutes });
    } else {
      return t('events.countdown.minutes', { minutes });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'today':
        return 'bg-red-500 text-white';
      case 'tomorrow':
        return 'bg-orange-500 text-white';
      case 'passed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'today':
        return t('events.status.today');
      case 'tomorrow':
        return t('events.status.tomorrow');
      case 'passed':
        return t('events.status.passed');
      default:
        return t('events.status.upcoming');
    }
  };

  return (
    <div className="grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
      <div className="flex items-center justify-between mb-[clamp(8px,1vh,12px)]">
        <h2 className="font-black text-gray-900">
          {t('events.title')}
        </h2>
        <div className="flex gap-2 text-[11px] font-black">
          <Badge className="border-2 border-[#052e16] bg-[#16a34a] text-white shadow-[2px_2px_0px_0px_#052e16]">
            {t('events.status.upcoming')}
          </Badge>
          <Badge className="border-2 border-[#052e16] bg-white text-gray-900 shadow-[2px_2px_0px_0px_#052e16]">
            {t('events.count', { value: events.length })}
          </Badge>
        </div>
      </div>

      <div className="grid min-h-0 grid-cols-4 gap-[clamp(8px,1vw,14px)] overflow-hidden">
        <AnimatePresence>
          {events.slice(0, 4).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="group bg-white border-2 border-[#15803d] shadow-[4px_4px_0px_0px_#052e16] hover:shadow-[5px_5px_0px_0px_#064e3b] transform transition-all duration-300 hover:translate-x-0.5 hover:translate-y-0.5 h-full min-h-0 flex flex-col overflow-hidden"
            >
              <div className="relative min-h-0 overflow-hidden flex-[1.05] bg-gray-100">
                <EventImage
                  filePath={event.thumbnail_path}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2">
                  <Badge className={`text-[10px] px-2 py-0.5 border border-[#052e16] shadow-[2px_2px_0px_0px_#052e16] font-bold ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                  </Badge>
                </div>

                <div className="absolute top-2 right-2 bg-black text-white text-[10px] px-2 py-1 shadow-[2px_2px_0px_0px_#16a34a] font-bold tracking-wide">
                  {formatCountdown(event.countdown)}
                </div>
              </div>

              <div className="bg-white p-[clamp(8px,1vh,12px)] border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors text-[clamp(13px,0.95vw,16px)] leading-snug tracking-tight">
                  {event.title}
                </h3>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-gray-700 text-[clamp(11px,0.78vw,13px)]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{event.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-[clamp(11px,0.78vw,13px)]">
                    <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="font-semibold truncate" title={event.location}>{event.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-2 flex justify-between items-center text-xs text-gray-600 px-2 flex-shrink-0">
        <div className="flex gap-4">
          <span>{t('events.total', { value: events.length })}</span>
          <span>{t('events.allScheduled')}</span>
        </div>
        <div className="text-green-600">
          {t('events.autoUpdated')}
        </div>
      </div>
    </div>
  );
}
