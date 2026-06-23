import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import VisitorCounter from './components/VisitorCounter';
import RoomFacility from './components/RoomFacility';
import DashboardMain from './components/DashboardMain';
import DashboardCard from './components/DashboardCard';
import AdminLogin from './components/AdminLogin';

function HomePage() {

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
