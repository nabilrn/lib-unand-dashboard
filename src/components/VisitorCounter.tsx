import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { todayVisitorTotal } from "../data/demoData";
import { useLocale } from "../i18n/LocaleContext";
import { toBrowserLocale } from "../i18n/locales";

const getInitialCount = () => {
  const hour = new Date().getHours();
  if (hour >= 8 && hour <= 11) return todayVisitorTotal - 18;
  if (hour >= 12 && hour <= 16) return todayVisitorTotal;
  if (hour >= 17 && hour <= 20) return todayVisitorTotal - 34;
  return Math.max(42, todayVisitorTotal - 126);
};

export default function VisitorCounter() {
  const { locale, t } = useLocale();
  const browserLocale = toBrowserLocale(locale);
  const [visitorCount, setVisitorCount] = useState<number>(getInitialCount);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((current) => {
        const hour = new Date().getHours();
        const pace = hour >= 8 && hour <= 16 ? 3 : hour >= 17 && hour <= 20 ? 2 : 1;
        const next = current + (Math.floor(Math.random() * pace) - (hour > 20 ? 1 : 0));
        return Math.max(32, Math.min(286, next));
      });
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatLastUpdated = () => {
    const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (diff < 60) return t('visitorCounter.secondsAgo', { value: diff });
    if (diff < 3600) return t('visitorCounter.minutesAgo', { value: Math.floor(diff / 60) });
    return lastUpdated.toLocaleTimeString(browserLocale);
  };

  return (
    <div className="h-full min-h-0 relative overflow-hidden grid grid-rows-[auto_minmax(0,1fr)]">
      <div className="relative z-10 pb-[clamp(4px,0.7vh,8px)]">
        <h3 className="text-gray-900 text-[clamp(13px,1vw,16px)] font-black flex items-center gap-2 tracking-tight">
          <div className="w-3 h-3 bg-[#16a34a]" />
          {t('visitorCounter.title')}
          <Activity className="w-4 h-4 text-[#16a34a]" strokeWidth={2.4} />
        </h3>
      </div>
      <div className="min-h-0 flex items-center justify-center relative z-10">
        <div className="text-center w-full">
          <div className="font-mono tabular-nums text-[clamp(4rem,12.6vh,7.7rem)] font-black leading-[0.82] tracking-[-0.08em] text-[#16a34a]">
            {visitorCount.toLocaleString(browserLocale)}
          </div>
          <div className="text-[clamp(11px,0.9vw,14px)] text-gray-700 mt-[clamp(6px,0.8vh,10px)] font-black tracking-tight">{t('visitorCounter.recorded')}</div>
          <div className="text-[clamp(11px,0.85vw,13px)] text-gray-500 mt-1 font-semibold tracking-tight">
            {t('visitorCounter.updatedAgo', { time: formatLastUpdated() })}
          </div>
          <div className="mx-auto mt-[clamp(8px,1.1vh,14px)] inline-flex items-center justify-center gap-2 border-2 border-[#052e16] bg-[#16a34a] px-3 py-1.5 text-[clamp(11px,0.82vw,13px)] text-white shadow-[3px_3px_0px_0px_#052e16]">
            <Activity className="w-3.5 h-3.5" strokeWidth={2.6} />
            <span className="font-black">{t('visitorCounter.activeTraffic')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
