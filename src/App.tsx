import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import VisitorCounter from './components/VisitorCounter';
import RoomFacility from './components/RoomFacility';
import DashboardMain from './components/DashboardMain';
import DashboardCard from './components/DashboardCard';
import AdminLogin from './components/AdminLogin';
import { useLocale } from './i18n/LocaleContext';

const isLandscapeViewport = () => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= window.innerHeight;
};

function useLandscapeViewport() {
  const [isLandscape, setIsLandscape] = useState(isLandscapeViewport);

  useEffect(() => {
    const update = () => setIsLandscape(isLandscapeViewport());
    update();

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return isLandscape;
}

function LandscapeOnlyMessage() {
  const { t } = useLocale();

  return (
    <div className="grid h-[100dvh] place-items-center overflow-hidden bg-[#f3f4f6] p-6">
      <div role="alert" aria-live="polite" className="border-2 border-[#052e16] bg-white px-6 py-4 text-center shadow-[6px_6px_0px_0px_#052e16]">
        <p className="text-[clamp(1.6rem,7vw,3rem)] font-black leading-none tracking-tight text-gray-900">
          {t('app.landscapeOnly')}
        </p>
      </div>
    </div>
  );
}

function HomePage() {
  const isLandscape = useLandscapeViewport();

  if (!isLandscape) {
    return <LandscapeOnlyMessage />;
  }

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col relative bg-[#f3f4f6]">
      <div className="flex-1 min-h-0 flex flex-col px-[clamp(12px,1.7vw,26px)] py-[clamp(8px,1.2vh,16px)]">
        <div className="w-full max-w-none mx-auto grid grid-rows-[clamp(68px,8.2vh,88px)_minmax(0,1fr)] gap-[clamp(10px,1.45vh,20px)] h-full min-h-0">
          <div className="min-h-0">
            <DashboardCard 
              variant="compact" 
              innerClassName="py-[clamp(8px,1vh,12px)]"
              offset={4}
            >
              <Header />
            </DashboardCard>
          </div>

          <div className="grid grid-cols-[minmax(282px,23vw)_minmax(0,1fr)] gap-[clamp(12px,1.45vw,24px)] overflow-hidden min-h-0 pr-1 pb-1">
            <div className="grid grid-rows-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-[clamp(12px,1.45vh,20px)] h-full min-h-0">
              <DashboardCard 
                variant="compact"
                offset={4}
              >
                <VisitorCounter />
              </DashboardCard>
              <DashboardCard 
                variant="compact"
                offset={4}
              >
                <RoomFacility />
              </DashboardCard>
            </div>

            <DashboardCard 
              variant="default" 
              innerClassName="pt-[clamp(12px,1.35vh,20px)]"
              offset={5}
            >
              <DashboardMain />
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/*" element={<AdminLogin />} />
    </Routes>
  );
}
