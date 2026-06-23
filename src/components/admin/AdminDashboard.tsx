import React, { useEffect, useState, useMemo } from 'react';
import { BarChart3, PieChart as PieIcon, Layers, Users, BookOpen, Calendar, Home, Quote } from 'lucide-react';
import { chartConfigs } from '../visitor/config';
import { loadChartData } from '../visitor/data';
import type { ChartConfig } from '../visitor/types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

// Select the most relevant 5 charts for admin overview
const DASHBOARD_CHART_IDS = ['weekly','monthly','topFacultiesMonth','topBooksMonth','bookStats'] as const;
type DashboardChartId = typeof DASHBOARD_CHART_IDS[number];

interface LoadedChart { id: string; data: any[]; loading?: boolean; error?: string; config: ChartConfig; }

const colorPalette = ['#10B981','#3B82F6','#6366F1','#F59E0B','#EF4444','#0EA5E9','#8B5CF6','#84CC16','#F97316','#EC4899'];

const AdminDashboard: React.FC = () => {
  const configs = useMemo(()=> chartConfigs.filter(c => DASHBOARD_CHART_IDS.includes(c.id as DashboardChartId)), []);
  const [charts, setCharts] = useState<LoadedChart[]>(configs.map(c => ({ id: c.id, data: [], loading: true, config: c })));

  useEffect(()=>{
    let cancelled = false;
    (async()=>{
      const results = await Promise.all(configs.map(async c => {
        try {
          const res = await loadChartData(c);
          return { id: c.id, data: res.data, loading: false, config: c } as LoadedChart;
        } catch (e:any) {
          return { id: c.id, data: [], loading: false, error: e?.message || 'Gagal memuat', config: c } as LoadedChart;
        }
      }));
      if(!cancelled) setCharts(results);
    })();
    return () => { cancelled = true; };
  },[configs]);

  const quickNavigate = (target: string) => {
    // Integrasi sederhana: simpan target dan redirect ke /admin (diasumsikan layout membaca state/menu)
    localStorage.setItem('admin_quick_target', target);
    window.dispatchEvent(new CustomEvent('admin:navigate', { detail: target }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-emerald-900 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-600" /> Dashboard</h1>
        <p className="text-sm text-emerald-700/80">Ringkasan aktivitas perpustakaan & akses cepat</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction label="Kelola Ruangan" icon={Home} onClick={()=>quickNavigate('rooms')} />
        <QuickAction label="Kelola Events" icon={Calendar} onClick={()=>quickNavigate('events')} />
        <QuickAction label="Manajemen Quote" icon={Quote} onClick={()=>quickNavigate('quotes')} />
        <QuickAction label="Statistik Pengunjung" icon={Users} onClick={()=>document.getElementById('chart-weekly')?.scrollIntoView({ behavior:'smooth' })} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {charts.map(ch => (
          <ChartCard key={ch.id} chart={ch} className={
            ch.id === 'weekly' ? 'xl:col-span-6' :
            ch.id === 'monthly' ? 'xl:col-span-6' :
            ch.id === 'bookStats' ? 'xl:col-span-4' :
            ch.id === 'topFacultiesMonth' ? 'xl:col-span-4' :
            ch.id === 'topBooksMonth' ? 'xl:col-span-4' : 'xl:col-span-4'
          } />
        ))}
      </div>
    </div>
  );
};

const QuickAction: React.FC<{ label: string; icon: any; onClick: ()=>void; }> = ({ label, icon:Icon, onClick }) => (
  <button onClick={onClick} className="group flex items-center gap-3 rounded-lg border border-emerald-200/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-left shadow-sm hover:shadow-md transition-all hover:border-emerald-300">
    <span className="p-2 rounded-md bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Icon className="w-4 h-4" /></span>
    <span className="text-sm font-medium text-emerald-900 group-hover:text-emerald-800">{label}</span>
  </button>
);

const ChartCard: React.FC<{ chart: LoadedChart; className?: string; }> = ({ chart, className }) => {
  const { id, config, data, loading, error } = chart;
  return (
    <div id={`chart-${id}`} className={`rounded-xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-4 flex flex-col shadow-sm ${className || ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-emerald-900 leading-tight">{config.title}</h3>
          {config.subtitle && <p className="text-[11px] text-emerald-600/80 mt-0.5">{config.subtitle}</p>}
        </div>
        {loading && <span className="text-[10px] px-2 py-1 rounded bg-emerald-50 text-emerald-600 animate-pulse">Loading</span>}
        {!loading && error && <span className="text-[10px] px-2 py-1 rounded bg-red-50 text-red-600">Fallback</span>}
      </div>
      <div className="flex-1 min-h-[180px]">
        {loading ? <SkeletonLines /> : <ChartRenderer config={config} data={data} />}
      </div>
    </div>
  );
};

const SkeletonLines = () => (
  <div className="flex flex-col gap-3 h-full justify-center">
    {[...Array(4)].map((_,i)=>(<div key={i} className="h-3 w-full bg-emerald-100/60 rounded animate-pulse" style={{ width: `${80 - i*10}%` }} />))}
  </div>
);

const ChartRenderer: React.FC<{ config: ChartConfig; data: any[]; }> = ({ config, data }) => {
  if(config.id === 'bookStats') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {data.slice(0,4).map((d,i)=>(
          <div key={i} className="p-3 rounded-lg border border-emerald-100 bg-white/60">
            <p className="text-[11px] text-emerald-600/80 mb-1 font-medium">{d.category}</p>
            <p className="text-lg font-semibold text-emerald-900">{d.total.toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>
    );
  }
  if(!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-emerald-600/70">Tidak ada data</div>;
  }
  switch(config.id){
    case 'weekly':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey={config.xKey || 'date'} tick={{ fontSize:10 }} axisLine={false} tickLine={false} />
            <YAxis width={28} tick={{ fontSize:10 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#10b9810d' }} />
            <Bar dataKey={config.dataKey || 'total'} radius={[4,4,0,0]} fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'monthly':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <XAxis dataKey={config.xKey || 'month'} tick={{ fontSize:10 }} axisLine={false} tickLine={false} />
            <YAxis width={28} tick={{ fontSize:10 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area dataKey={config.dataKey || 'total'} stroke="#10B981" fill="#10B98122" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      );
    case 'topBooksMonth':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="title" innerRadius={40} outerRadius={80} paddingAngle={2}>
              {data.map((_,i)=>(<Cell key={i} fill={colorPalette[i % colorPalette.length]} />))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    case 'topFacultiesMonth':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart data={data.slice(0,8).map((d,i)=>({ ...d, fill: colorPalette[i % colorPalette.length] }))} innerRadius={20} outerRadius={90} startAngle={90} endAngle={-270}>
            <RadialBar background dataKey={config.dataKey || 'total'} cornerRadius={4} />
            <PolarAngleAxis type="number" domain={[0, Math.max(...data.map((d:any)=>d.total || d[config.dataKey || 'total']))]} tick={false} />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      );
    default:
      return <div className="h-full flex items-center justify-center text-xs">Tipe chart tidak didukung</div>;
  }
};

export default AdminDashboard;
