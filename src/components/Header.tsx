import {
  Sun,
  Phone,
  Clock,
  Wifi,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  Wind,
  CloudFog
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { useSettings } from "../context/SettingsContext";
import { getLibraryQuotes, getLibraryWeather } from "../data/demoData";
import { useLocale } from "../i18n/LocaleContext";
import { toBrowserLocale } from "../i18n/locales";
import { getImageUrl } from "../lib/media";

export default function Header() {
  const { quote: configuredFallbackQuote } = useSettings();
  const { locale, setLocale, localeOptions, t } = useLocale();
  const browserLocale = toBrowserLocale(locale);
  const quotes = useMemo(() => getLibraryQuotes(locale), [locale]);
  const weather = useMemo(() => getLibraryWeather(locale), [locale]);
  const fallbackQuote = configuredFallbackQuote || t('app.fallbackQuote');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quoteLoading = false;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const tempC = weather.tempC;
  const weatherDesc = weather.description;
  const isLoadingWeather = false;
  const weatherError = null;
  const weatherId = weather.weatherId;
  const iconCode = weather.iconCode;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if library is open using schedule
      setIsLibraryOpen(isOpenAt(now));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotation interval
  useEffect(()=>{
    if(!quotes.length) return; // no interval if no quotes
    const id = setInterval(()=>{
      setQuoteIndex(i => (i+1) % quotes.length);
    }, 30000); // 30 detik
    return ()=>clearInterval(id);
  },[quotes]);

  useEffect(() => {
    setQuoteIndex((current) => Math.min(current, Math.max(0, quotes.length - 1)));
  }, [quotes.length]);

  // Weather icon resolver
  function pickWeatherIcon(id: number | null, isDay: boolean) {
    if (id == null) return Sun;
    if (id >= 200 && id < 300) return CloudLightning; // Thunderstorm
    if (id >= 300 && id < 400) return CloudDrizzle;   // Drizzle
    if (id >= 500 && id < 600) return CloudRain;      // Rain
    if (id >= 600 && id < 700) return Snowflake;      // Snow
    if (id >= 700 && id < 750) return CloudFog;       // Mist / Fog
    if (id === 751 || id === 761 || id === 762) return Wind; // Sand/dust
    if (id === 771 || id === 781) return Wind;        // Squall / Tornado
    if (id === 800) return Sun;                       // Clear
    if (id > 800 && id < 900) return isDay ? CloudSun : Cloud; // Clouds
    return Sun;
  }

  const isDay = iconCode ? iconCode.includes('d') : true;
  const WeatherIcon = pickWeatherIcon(weatherId, isDay);

  // Menghilangkan semua card/border/shadow: konten akan inline transparan.
  // Kita pakai spacer dengan border-r tipis untuk pemisah antar kelompok.

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(browserLocale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(browserLocale, {
      weekday: "long",
      year: "numeric",
      month: "long", 
      day: "numeric",
    });
  };

  // Library weekly schedule (WIB). 0: Sunday (Closed assumed)
  // Use 24h times in HH:MM for parsing.
  const WEEKLY_SCHEDULE: Record<number, { open: string; close: string } | null> = {
    0: null,
    1: { open: '07:30', close: '18:00' }, // Senin
    2: { open: '07:30', close: '18:00' }, // Selasa
    3: { open: '07:30', close: '18:00' }, // Rabu
    4: { open: '07:30', close: '18:00' }, // Kamis
    5: { open: '07:30', close: '16:30' }, // Jumat
    6: { open: '09:00', close: '16:00' }  // Sabtu
  };

  function parseTimeToMinutes(t: string) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  function isOpenAt(date: Date) {
    const day = date.getDay();
    const schedule = WEEKLY_SCHEDULE[day];
    if (!schedule) return false;
    const minutes = date.getHours() * 60 + date.getMinutes();
    return minutes >= parseTimeToMinutes(schedule.open) && minutes < parseTimeToMinutes(schedule.close);
  }

  const today = currentTime.getDay();
  const todaySchedule = WEEKLY_SCHEDULE[today];
  const todayHoursLabel = todaySchedule ? `${todaySchedule.open} - ${todaySchedule.close} WIB` : t('header.closed');
  const fullScheduleLabel = t('header.scheduleFull');

  return (
    <div className="flex h-full min-w-0 items-center justify-between px-[clamp(6px,0.8vw,12px)] gap-[clamp(10px,1.4vw,22px)] select-none">
      {/* Kiri: Logo + Judul */}
      <div className="flex items-center gap-[clamp(8px,1vw,14px)] min-w-0 flex-[1_1_auto]">
        <div className="h-[clamp(40px,5.4vh,54px)] w-[clamp(40px,5.4vh,54px)] flex items-center justify-center flex-shrink-0">
          <img
            src={getImageUrl('/images/unand.png')}
            alt={t('header.logoAlt')}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="leading-tight min-w-0">
          <h1 className="text-[clamp(18px,1.55vw,28px)] font-black text-gray-800 tracking-tight whitespace-nowrap truncate">{t('app.title')}</h1>
          <p className="hidden md:block text-[clamp(12px,0.95vw,17px)] font-semibold text-green-600 tracking-tight truncate max-w-[min(42vw,620px)] transition-opacity duration-500" title={(quotes[quoteIndex]||fallbackQuote)}>
            {quoteLoading && !quotes.length ? t('header.quoteLoading') : (quotes[quoteIndex] || fallbackQuote)}
          </p>
        </div>
      </div>

      {/* Tengah: QR & Jam Layanan */}
      <div className="hidden 2xl:flex items-center gap-[clamp(14px,1.3vw,24px)] flex-shrink-0">
        {/* QR besar tanpa card */}
        <div className="flex items-center gap-2.5">
          <div className="h-[clamp(44px,5.2vh,58px)] w-[clamp(44px,5.2vh,58px)] bg-white border border-green-600/40 p-0.5 flex items-center justify-center rounded-sm">
            <ImageWithFallback
              src={getImageUrl('/images/iqqr.jpg') || ''}
              alt={t('header.qrAlt')}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="leading-tight text-sm">
            <div className="font-black text-gray-800 text-[clamp(12px,0.82vw,14px)]">{t('header.instagram')}</div>
            <a
              href="https://www.instagram.com/lib.unand"
              target="_blank"
              rel="noreferrer"
              className="text-green-600 font-bold hover:underline text-[clamp(11px,0.78vw,13px)]"
            >@lib.unand</a>
          </div>
        </div>
        <div className="h-10 w-px bg-green-300/60" />
        {/* Jam layanan */}
        <div className="flex items-center gap-2 relative group">
          <Clock className="w-5 h-5 text-green-600" />
          <div className="leading-tight">
            <div className="font-black text-gray-800 text-[clamp(12px,0.82vw,14px)]">{t('header.serviceHours')}</div>
            <div className="text-green-600 font-bold text-[clamp(11px,0.78vw,13px)] tracking-wide">{todayHoursLabel}</div>
          </div>
          <div className="absolute hidden group-hover:block z-20 top-full left-0 mt-1 w-max max-w-[300px] text-[11px] bg-white/95 backdrop-blur border border-green-300 shadow-sm px-2 py-1 text-gray-700 rounded-sm">
            {fullScheduleLabel}
          </div>
        </div>
      </div>

      {/* Kanan: Cuaca, Waktu, Kontak, Status */}
      <div className="flex items-center gap-[clamp(10px,1.1vw,20px)] flex-shrink-0">
        {/* Cuaca */}
        <div className="hidden md:flex items-center gap-2">
          <WeatherIcon className={`w-6 h-6 ${weatherId === 800 ? 'text-yellow-500' : 'text-emerald-600'}`} />
          <div className="leading-tight">
            {isLoadingWeather && <div className="text-gray-500 font-semibold text-sm">--°C</div>}
            {!isLoadingWeather && weatherError && <div className="text-red-600 font-semibold text-sm">{t('weather.error')}</div>}
            {!isLoadingWeather && !weatherError && (
              <>
                <div className="text-gray-800 font-black text-[clamp(14px,1vw,18px)]">{tempC != null ? `${tempC}°C` : '--°C'}</div>
                <div className="text-green-600 font-bold hidden 2xl:block text-[11px] leading-snug">{weatherDesc || t('weather.generic')}</div>
              </>
            )}
          </div>
        </div>
        <div className="h-8 w-px bg-green-300/60 hidden md:block" />
        {/* Waktu */}
        <div className="flex flex-col justify-center leading-tight text-right">
          <div className="font-black text-[clamp(18px,1.28vw,22px)] tracking-tight text-gray-800">{formatTime(currentTime)}</div>
          <div className="hidden lg:block text-[11px] text-green-700 font-semibold">{formatDate(currentTime)}</div>
        </div>
        <div className="h-8 w-px bg-green-300/60 hidden xl:block" />
        {/* Kontak */}
        <div className="hidden xl:flex items-center gap-2 leading-tight text-gray-700">
          <Phone className="w-4 h-4 text-green-600" />
          <div className="text-[12px]">
            <a href="https://lib.unand.ac.id" target="_blank" rel="noreferrer" className="font-black text-gray-800 hover:underline text-[12px]">lib.unand.ac.id</a>
            <div className="text-green-600 font-bold text-[12px]">library@univ.ac.id</div>
          </div>
        </div>
        <div className="h-8 w-px bg-green-300/60 hidden xl:block" />
        <div className="hidden xl:flex items-center gap-1 border-2 border-[#052e16] bg-white px-1 py-1 shadow-[2px_2px_0px_0px_#052e16]">
          {localeOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              aria-label={`${t('header.languageLabel')}: ${option.label}`}
              onClick={() => setLocale(option.code)}
              className={`px-1.5 py-0.5 text-[10px] font-black transition-colors ${
                option.code === locale ? 'bg-[#16a34a] text-white' : 'text-gray-800 hover:bg-emerald-50'
              }`}
            >
              {option.shortLabel}
            </button>
          ))}
        </div>
        <div className="h-8 w-px bg-green-300/60 hidden xl:block" />
        {/* Status */}
        <div className="flex items-center gap-2 leading-tight">
          <Wifi className="w-4 h-4 text-green-600" />
          <div className="flex items-center gap-1">
            <span className={`inline-block w-2 h-2 rounded-full ${isLibraryOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-black text-gray-800 text-[12px]">{t('header.status')}</span>
            <span className={`font-bold text-[12px] ${isLibraryOpen ? 'text-green-600' : 'text-red-600'}`}>{isLibraryOpen ? t('header.open') : t('header.closed')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
