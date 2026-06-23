import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Calendar, 
  Quote,
  LogOut,
  User
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb';
import DashboardMain from './DashboardMain';
import RoomManagement from './RoomManagement';
import EventManagement from './EventManagement';
import QuoteManagement from './QuoteManagement';
// Skeleton removed for page transition; using spinner loader instead

const AdminManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [transitioning, setTransitioning] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Get user info from localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  // Check local session on component mount
  React.useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('admin_token');
      setIsTokenValid(Boolean(token));
    };

    checkToken();
  }, []);

  // Redirect to login if token is invalid
  React.useEffect(() => {
    if (isTokenValid === false) {
      navigate('/admin');
    }
  }, [isTokenValid, navigate]);

  // Listener untuk quick navigate event dari dashboard (QuickAction) - harus sebelum conditional returns agar urutan hooks konsisten
  React.useEffect(()=>{
    const handler = (e: Event) => {
      const detail: any = (e as CustomEvent).detail;
      if(!detail) return;
      const target = String(detail);
      if(['dashboard','rooms','events','quotes'].includes(target)) {
        setActivePage(target);
      }
    };
    window.addEventListener('admin:navigate', handler as EventListener);
    return () => window.removeEventListener('admin:navigate', handler as EventListener);
  },[]);

  // Show loading while checking token
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Return null if redirecting
  if (isTokenValid === false) {
    return null;
  }

  const doLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_remember');
    localStorage.removeItem('admin_token_data');
    toast.success('Logout berhasil!');
    setTimeout(() => navigate('/admin'), 800);
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'rooms', label: 'Kelola Ruangan', icon: MapPin },
    { key: 'events', label: 'Kelola Events', icon: Calendar },
    { key: 'quotes', label: 'Manajemen Quote', icon: Quote },
  ];

  // Get user info for display
  const getUsername = () => {
    const username = localStorage.getItem('admin_username');
    if (username) return username;
    
    const userInfo = localStorage.getItem('admin_user');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.username || 'Administrator';
      } catch {
        return 'Administrator';
      }
    }
    return 'Administrator';
  };

  return (
  <div className="bg-neutral-50 text-neutral-800">
    <Toaster position="top-right" />
    {/* Fixed Sidebar (hybrid) */}
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-emerald-900/10 flex flex-col flex-shrink-0">
        <div className="px-5 py-4 border-b border-emerald-900/10 flex items-center gap-3">
          <img src="/images/unand.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-base font-black tracking-tight text-emerald-800 leading-tight">Library Admin</h1>
            <p className="text-[10px] font-semibold text-emerald-600/80 uppercase tracking-wider">Control Panel</p>
          </div>
        </div>
        <nav className="p-4 flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        if (activePage === item.key) return;
                        setTransitioning(true);
                        // Small delay to show skeleton shimmer
                        setTimeout(() => {
                          setActivePage(item.key);
                          setTransitioning(false);
                        }, 250);
                      }}
                      className={`group w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all font-medium border ${
                        activePage === item.key
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white/40 text-neutral-700 border-neutral-200 hover:border-emerald-400/60 hover:bg-emerald-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${activePage === item.key ? 'text-white' : 'text-emerald-700 group-hover:text-emerald-800'}`} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-neutral-200/80 text-[11px] text-neutral-500 leading-tight">
            <div className="font-semibold text-neutral-600">Status</div>
            <div className="mt-1 flex flex-col gap-0.5">
              <span>Sesi: <span className={`font-semibold ${isTokenValid ? 'text-emerald-600' : 'text-red-600'}`}>{isTokenValid ? 'Aktif' : 'Tidak aktif'}</span></span>
              <span className="truncate">User: {getUsername()}</span>
            </div>
          </div>
        <div className="p-4 border-t border-neutral-200/80">
          <button
            onClick={() => setLogoutOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-600/10 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Right side: header bar + content (scroll container) */}
      <div className="ml-64 h-screen flex flex-col">
        <header className="h-16 px-8 flex items-center justify-between bg-white/80 backdrop-blur border-b border-emerald-900/10 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-[12px] font-medium">
            <Breadcrumb>
              <BreadcrumbList className="text-[12px]">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="text-emerald-700 hover:text-emerald-800">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                {activePage !== 'dashboard' && <BreadcrumbSeparator />}
                {activePage !== 'dashboard' && (
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" className="text-neutral-700 font-semibold">
                      {activePage === 'rooms' && 'Kelola Ruangan'}
                      {activePage === 'events' && 'Kelola Events'}
                      {activePage === 'quotes' && 'Manajemen Quote'}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-900/10 rounded-full shadow-sm">
              <User className="w-4 h-4 text-emerald-700" />
              <span className="text-sm font-medium text-emerald-800">{getUsername()}</span>
            </div>
          </div>
        </header>
  <main className="flex-1 p-8 relative overflow-y-auto">
          {transitioning && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg">
              <div className="flex flex-col items-center gap-3" aria-live="polite" aria-busy="true">
                <div className="h-12 w-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-emerald-700">Memuat halaman...</p>
              </div>
            </div>
          )}
          <div className={transitioning ? 'opacity-0' : 'opacity-100 transition-opacity duration-150'}>
            {activePage === 'dashboard' && <DashboardMain />}
            {activePage === 'rooms' && <RoomManagement />}
            {activePage === 'events' && <EventManagement />}
            {activePage === 'quotes' && <QuoteManagement />}
          </div>
        </main>
      </div>
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin keluar dari panel admin? Sesi Anda akan diakhiri dan perlu login kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={doLogout} className="bg-red-600 hover:bg-red-600/90">Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminManagement;
