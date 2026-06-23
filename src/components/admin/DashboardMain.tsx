import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Calendar, MapPin, Settings, RefreshCw, BarChart3, Home, Quote, Layers } from 'lucide-react';
import { chartConfigs } from '../visitor/config';
import { loadChartData } from '../visitor/data';
import type { ChartConfig } from '../visitor/types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, AreaChart, Area, PieChart, Pie, Cell, Tooltip, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import EmptyState from '../EmptyState';
import { demoRooms, getDemoEvents, todayVisitorTotal } from '../../data/demoData';

const DASHBOARD_CHART_IDS = ['weekly','monthly','topFacultiesMonth','topBooksMonth','bookStats'] as const;
const palette = ['#10B981','#3B82F6','#6366F1','#F59E0B','#EF4444','#0EA5E9','#8B5CF6','#84CC16','#F97316','#EC4899'];

interface LoadedChart { id: string; config: ChartConfig; data: any[]; loading: boolean; error?: string; }

const DashboardMain: React.FC = () => {
  const [stats] = useState({
    visitors: todayVisitorTotal,
    events: getDemoEvents().length,
    rooms: demoRooms.length,
    system: 'Aktif',
    loading: false,
  });

  const configs = useMemo(()=> chartConfigs.filter(c => (DASHBOARD_CHART_IDS as readonly string[]).includes(c.id)), []);
  const [charts, setCharts] = useState<LoadedChart[]>(configs.map(c=>({ id:c.id, config:c, data:[], loading:true })));
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      const loaded = await Promise.all(configs.map(async c => {
        try { const res = await loadChartData(c); return { id:c.id, config:c, data:res.data, loading:false } as LoadedChart; }
        catch(e:any){ return { id:c.id, config:c, data:[], loading:false, error:e?.message||'Gagal' }; }
      }));
      if(!cancelled) setCharts(loaded);
    })();
    return ()=>{ cancelled=true; };
  },[configs]);

  const quick = (target:string)=> window.dispatchEvent(new CustomEvent('admin:navigate',{ detail:target }));

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-emerald-900 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-600" /> Dashboard Admin</h1>
        <p className="text-sm text-emerald-700/80">Selamat datang di panel admin perpustakaan</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Pengunjung" value={stats.loading ? '...' : stats.visitors.toLocaleString('id-ID')} icon={Users} accent="text-blue-600" />
        <StatCard title="Events Aktif" value={stats.loading ? '...' : stats.events} icon={Calendar} accent="text-green-600" />
        <StatCard title="Ruangan Tersedia" value={stats.loading ? '...' : stats.rooms} icon={MapPin} accent="text-purple-600" />
        <StatCard title="Status Sistem" value={stats.system} icon={Settings} accent="text-orange-600" />
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction label="Kelola Ruangan" icon={MapPin} onClick={()=>quick('rooms')} />
        <QuickAction label="Kelola Events" icon={Calendar} onClick={()=>quick('events')} />
        <QuickAction label="Manajemen Quote" icon={Quote} onClick={()=>quick('quotes')} />
        <QuickAction label="Refresh Data" icon={RefreshCw} onClick={()=>window.location.reload()} />
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 xl:grid-cols-12">
        {charts.map(ch => (
          <ChartBox key={ch.id} chart={ch} className={
            ch.id==='weekly' || ch.id==='monthly' ? 'xl:col-span-6' : 'xl:col-span-4'
          } />
        ))}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title:string; value:any; icon:any; accent:string; }> = ({ title,value,icon:Icon,accent }) => (
  <Card className="border-emerald-100/70 bg-white/70 backdrop-blur-sm shadow-sm">
    <CardHeader className="pb-1"><div className="flex items-center justify-between"><CardTitle className="text-[11px] font-medium text-emerald-600/80 uppercase tracking-wide">{title}</CardTitle><Icon className={`w-4 h-4 ${accent}`} /></div></CardHeader>
    <CardContent><div className={`text-xl font-semibold ${accent}`}>{value}</div></CardContent>
  </Card>
);

const QuickAction: React.FC<{ label:string; icon:any; onClick:()=>void; }> = ({ label, icon:Icon, onClick }) => (
  <button onClick={onClick} className="group flex items-center gap-3 rounded-lg border border-emerald-200/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-left shadow-sm hover:shadow-md transition-all hover:border-emerald-300">
    <span className="p-2 rounded-md bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Icon className="w-4 h-4" /></span>
    <span className="text-sm font-medium text-emerald-900 group-hover:text-emerald-800">{label}</span>
  </button>
);

const ChartBox: React.FC<{ chart: LoadedChart; className?: string; }> = ({ chart, className }) => {
  const { config, data, loading, error } = chart;
  const isEmpty = !loading && (!data || data.length === 0);
  return (
    <div className={`rounded-xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-4 flex flex-col shadow-sm ${className||''}`}> 
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-emerald-900 leading-tight">{config.title}</h3>
          {config.subtitle && <p className="text-[11px] text-emerald-600/80 mt-0.5">{config.subtitle}</p>}
        </div>
        {loading && <span className="text-[10px] px-2 py-1 rounded bg-emerald-50 text-emerald-600 animate-pulse">Loading</span>}
        {!loading && error && <span className="text-[10px] px-2 py-1 rounded bg-red-50 text-red-600">Fallback</span>}
      </div>
      <div className="flex-1 min-h-[180px] flex items-stretch">
        {loading && <div className="flex-1"><SkeletonChart /></div>}
        {!loading && isEmpty && (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              compact
              title="Tidak Ada Data"
              subtitle="Belum tersedia"
              centerOffset={-4}
              scale={0.6}
              maxWidthPx={160}
            />
          </div>
        )}
        {!loading && !isEmpty && <RenderChart config={config} data={data} />}
      </div>
    </div>
  );
};

const SkeletonChart = () => (
  <div className="flex flex-col gap-3 h-full justify-center">
    {[...Array(4)].map((_,i)=>(<div key={i} className="h-3 w-full bg-emerald-100/60 rounded animate-pulse" style={{ width: `${90 - i*15}%` }} />))}
  </div>
);

const RenderChart: React.FC<{ config: ChartConfig; data: any[]; }> = ({ config, data }) => {
  if(config.id==='bookStats') {
    // Present KPIs in a centered, balanced flex rather than simple grid for cleaner look
    return (
      <div className="h-full flex items-center gap-6">
        {data.slice(0,4).map((d,i)=>(
          <div key={i} className="flex flex-col items-start justify-center border rounded-md px-6 py-5 bg-white/50 min-w-[140px]">
            <p className="text-[11px] font-semibold tracking-wide text-emerald-600/80 mb-1">{d.category}</p>
            <p className="text-xl font-bold text-emerald-900 tabular-nums">{d.total?.toLocaleString?.('id-ID') || d.total}</p>
          </div>
        ))}
      </div>
    );
  }
  // Data empty handled by ChartBox with EmptyState
  switch(config.id){
    case 'weekly':
      return <ResponsiveContainer width="100%" height={200}><BarChart data={data}><XAxis dataKey={config.xKey||'date'} tick={{ fontSize:10 }} axisLine={false} tickLine={false} /><YAxis width={28} tick={{ fontSize:10 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill:'#10b9810d' }} /><Bar dataKey={config.dataKey||'total'} radius={[4,4,0,0]} fill="#10B981" /></BarChart></ResponsiveContainer>;
    case 'monthly':
      return <ResponsiveContainer width="100%" height={200}><AreaChart data={data}><XAxis dataKey={config.xKey||'month'} tick={{ fontSize:10 }} axisLine={false} tickLine={false} /><YAxis width={28} tick={{ fontSize:10 }} axisLine={false} tickLine={false} /><Tooltip /><Area dataKey={config.dataKey||'total'} stroke="#10B981" fill="#10B98122" strokeWidth={2} /></AreaChart></ResponsiveContainer>;
    case 'topBooksMonth':
      return <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={data} dataKey="total" nameKey="title" innerRadius={40} outerRadius={80} paddingAngle={2}>{data.map((_,i)=>(<Cell key={i} fill={palette[i%palette.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer>;
    case 'topFacultiesMonth': {
      const enriched = data.slice(0,8).map((d,i)=>({ ...d, fill: palette[i%palette.length] }));
      const maxVal = Math.max(...enriched.map((d:any)=> d.total || d[config.dataKey||'total'] || 0), 0);
      return (
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart data={enriched} innerRadius={22} outerRadius={92} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey={config.dataKey||'total'} cornerRadius={4} />
                <PolarAngleAxis type="number" domain={[0, maxVal || 1]} tick={false} />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 max-h-24 overflow-y-auto pr-1">
            {enriched.map((d:any,i:number)=>(
              <div key={i} className="flex items-center gap-2 text-[10.5px] leading-tight">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background:d.fill }} />
                <span className="text-emerald-900 font-medium truncate" title={`${d.fakultas}: ${d.total}`}>{d.fakultas} <span className="text-neutral-500 font-normal">({d.total})</span></span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    default:
      return <div className="h-full flex items-center justify-center text-xs">Tipe chart tidak didukung</div>;
  }
};

export default DashboardMain;
