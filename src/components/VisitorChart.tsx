import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarAngleAxis, AreaChart, Area, LabelList } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, BookOpen, Library } from 'lucide-react';
import EventsGrid from './EventsGrid';
import Leaderboard from './Leaderboard';
import { useVisitorData } from './visitor/useVisitorData';
import { ChartConfig } from './visitor/types';
import EmptyState from './EmptyState';
import { useLocale } from '../i18n/LocaleContext';
import { toBrowserLocale } from '../i18n/locales';

export default function VisitorChart() {
  const { locale, t } = useLocale();
  const browserLocale = toBrowserLocale(locale);
  const { chartConfigs, chartIndex: currentChartIndex, setChartIndex: setCurrentChartIndex, status: connectionStatus, lastUpdated, data: chartData } = useVisitorData();

  const handleSliderClick = (index: number) => {
    setCurrentChartIndex(index);
  };

  const currentConfig: ChartConfig | undefined = chartConfigs[currentChartIndex];
  const currentData = currentConfig ? (chartData[currentConfig.id] || []) : [];

  const getStatusInfo = () => {
    switch (connectionStatus) {
  case 'connected': return { icon: <Activity className="w-3.5 h-3.5" strokeWidth={2.6} />, text: t('chart.statusCurrent'), badgeClass: 'bg-[#16a34a] text-white border-[#052e16]' };
  case 'connecting': return { icon: <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />, text: t('chart.loading'), badgeClass: 'bg-[#ca8a04] text-white border-[#052e16]' };
  case 'mock': return { icon: <Activity className="w-3.5 h-3.5" strokeWidth={2.6} />, text: t('chart.statusCurrent'), badgeClass: 'bg-[#16a34a] text-white border-[#052e16]' };
  case 'error': return { icon: <Activity className="w-3.5 h-3.5" strokeWidth={2.6} />, text: t('chart.statusCurrent'), badgeClass: 'bg-[#16a34a] text-white border-[#052e16]' };
      default: return { icon: null, text: '', badgeClass: '' };
    }
  };
  const status = getStatusInfo();

  const renderChart = () => {
    if (!currentConfig) return null;

    if (currentConfig.type === 'events') return <EventsGrid />;
    if (currentConfig.type === 'leaderboard') {
      return (
        <Leaderboard
          title={currentConfig.title}
            subtitle={currentConfig.subtitle}
            data={currentData}
            type={currentConfig.subtype as 'visitors' | 'borrowers'}
        />
      );
    }

    // When data empty we return null; outer container will show compact EmptyState
    if (!currentData.length) return null;

    const commonProps = { data: currentData, margin: { top: 8, right: 18, left: 8, bottom: 4 } };

    switch (currentConfig.type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={currentConfig.xKey} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <Line type="monotone" dataKey={currentConfig.dataKey} stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}>
              {currentConfig.id === 'yearly' && (
                <LabelList dataKey={currentConfig.dataKey} position="top" className="fill-gray-700" formatter={(v:any)=> (typeof v==='number'? v.toLocaleString(browserLocale): v)} content={(props:any)=>{
                  const { x, y, value } = props;
                  if (value == null) return null;
                  return <text x={x} y={y - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#065f46" style={{ paintOrder: 'stroke' }} stroke="#ffffff" strokeWidth={2}>{typeof value==='number'? value.toLocaleString(browserLocale): value}</text>;
                }} />
              )}
            </Line>
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="visitorsArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={currentConfig.xKey} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <Area type="monotone" dataKey={currentConfig.dataKey} stroke="#059669" strokeWidth={2.5} fill="url(#visitorsArea)" activeDot={{ r: 5, strokeWidth: 2, stroke: '#065F46' }} >
              {currentConfig.id === 'monthly' && (
                <LabelList dataKey={currentConfig.dataKey} position="top" formatter={(v:any)=> (typeof v==='number'? v.toLocaleString(browserLocale): v)} content={(props:any)=>{
                  const { x, y, value } = props;
                  if (value == null) return null;
                  return <text x={x} y={y - 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#047857" stroke="#ffffff" strokeWidth={2} style={{ paintOrder: 'stroke' }}>{typeof value==='number'? value.toLocaleString(browserLocale): value}</text>;
                }} />
              )}
            </Area>
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={currentConfig.xKey} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <Bar dataKey={currentConfig.dataKey} fill="#10B981" radius={[4, 4, 0, 0]}>
              <LabelList dataKey={currentConfig.dataKey} content={(props: any) => {
                const { x, y, width, value } = props;
                if (value == null) return null;
                const labelY = (y || 0) - 6; // naik sedikit di atas bar
                const display = typeof value === 'number' ? value.toLocaleString(browserLocale) : value;
                return (
                  <text
                    x={(x || 0) + (width || 0) / 2}
                    y={labelY < 8 ? 10 : labelY}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={700}
                    fill="#065f46"
                    stroke="#ffffff"
                    strokeWidth={2}
                    style={{ paintOrder: 'stroke' }}
                  >
                    {display}
                  </text>
                );
              }} />
            </Bar>
          </BarChart>
        );
      case 'horizontalBar':
        return (
          <BarChart {...commonProps} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey={currentConfig.xKey} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={120} />
            <Bar dataKey={currentConfig.dataKey} fill="#10B981" radius={[0, 4, 4, 0]}>
              <LabelList dataKey={currentConfig.dataKey} content={(props: any) => {
                const { x, y, width, height, value } = props;
                if (value == null) return null;
                const display = typeof value === 'number' ? value.toLocaleString(browserLocale) : value;
                return (
                  <text
                    x={(x || 0) + (width || 0) + 6}
                    y={(y || 0) + (height || 0) / 2 + 3}
                    textAnchor="start"
                    fontSize={10}
                    fontWeight={700}
                    fill="#065f46"
                    stroke="#ffffff"
                    strokeWidth={2}
                    style={{ paintOrder: 'stroke' }}
                  >
                    {display}
                  </text>
                );
              }} />
            </Bar>
          </BarChart>
        );
      case 'pie': {
        const totalValue = currentData.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
        const pieData = currentData.map((item: any) => ({ ...item, percentage: totalValue ? parseFloat((((item.total || 0) / totalValue) * 100).toFixed(1)) : 0 }));
  const labelAccessor = (item: any) => item.fakultas || item.title || item.name || t('chart.genericItem');
        const isBookPie = currentConfig.id.startsWith('topBooks');
        const legendSlice = Math.min(pieData.length, isBookPie ? 10 : 8);
        const innerRadius = isBookPie ? (currentConfig.id === 'topBooksAllTime' ? '28%' : currentConfig.id === 'topBooksYear' ? '35%' : '32%') : '35%';
        return (
          <div className="h-full min-h-0 grid grid-cols-[minmax(240px,0.9fr)_minmax(280px,1.1fr)] items-stretch gap-[clamp(12px,1.4vw,24px)]">
            <div className="min-h-0 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ percentage }) => (typeof percentage === 'number' && percentage >= 8 ? `${Math.round(percentage)}%` : '')} outerRadius="65%" innerRadius={innerRadius} paddingAngle={1} dataKey="total" stroke="#000" strokeWidth={1.5}>
                    {pieData.map((entry: any, index: number) => (<Cell key={index} fill={entry.fill} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="min-h-0 w-full">
              <div className="h-full min-h-0 flex flex-col">
                <h3 className="text-xs font-black text-gray-900 mb-2 flex-shrink-0">{isBookPie ? t('chart.topBorrowedBooks') : t('chart.topFaculties')}</h3>
                {isBookPie ? (
                  <div className="min-h-0 flex-1 overflow-hidden pr-1 space-y-1">
                    {pieData.slice(0, legendSlice).map((item: any, idx: number) => (
                      <div key={idx} className="flex min-h-[23px] items-center gap-2 border border-black/25 bg-white px-1.5 py-1 shadow-[1px_1px_0px_0px_rgba(5,46,22,0.45)]">
                        <div className="w-3 h-3 border border-black/40" style={{ backgroundColor: item.fill }} />
                        <div className="flex-1 min-w-0 truncate text-[11px] font-bold text-gray-700" title={labelAccessor(item)}>{labelAccessor(item)}</div>
                        <div className="text-[11px] font-black text-gray-800 tabular-nums">{item.total}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1 lg:gap-2 min-h-0 flex-1 overflow-hidden">
                    {pieData.slice(0, legendSlice).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-1 border border-black/25 bg-white p-1 shadow-[1px_1px_0px_0px_rgba(5,46,22,0.45)]">
                        <div className="w-2 h-2 lg:w-3 lg:h-3 border border-black/40 flex-shrink-0" style={{ backgroundColor: item.fill }} />
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] lg:text-xs font-bold text-gray-700 truncate" title={labelAccessor(item)}>{labelAccessor(item)}</div>
                          <div className="text-[10px] lg:text-xs text-gray-600 font-bold">{typeof item.percentage === 'number' ? item.percentage.toFixed(1) : '0.0'}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2 border border-black/30 bg-emerald-50 p-2 shadow-[2px_2px_0px_0px_rgba(5,46,22,0.45)] flex-shrink-0">
                  <div className="text-center">
                    <div className="text-xs font-black text-gray-700">{t('chart.total', { value: totalValue.toLocaleString(browserLocale) })}</div>
                    {!isBookPie && <div className="text-xs text-gray-600 font-bold">{pieData.length > legendSlice && t('chart.moreItems', { value: pieData.length - legendSlice })}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'radialBar': {
  // expect items: { fakultas, total, fill? } -> build concentric progress rings with grey tracks + colored partial arcs
        const colors = ['#10B981','#3B82F6','#F59E0B','#EF4444','#6366F1','#06B6D4','#84CC16','#EC4899'];
        const raw = currentData.slice(0, 10);
        const totalAll = raw.reduce((s:number,r:any)=>s + (r.total || 0),0) || 1;
        // Build percentage dataset (0-100). We'll use PolarAngleAxis domain to fix scaling.
        const ringsBase = raw.map((d:any,i:number)=>{
          const val = d.total || 0;
          const share = (val / totalAll) * 100;
          return {
            name: d.fakultas || d.name || `${t('chart.genericItem')} ${i + 1}`,
            value: parseFloat(share.toFixed(2)), // 0-100 for angle length
            uv: val,                               // absolute total for legend
            percentage: share,
            fill: d.fill || colors[i % colors.length]
          };
        });
        // For chart: ascending so biggest becomes outermost ring.
        const ringsForChart = [...ringsBase].sort((a,b)=>a.value - b.value);
        // For legend: descending so biggest listed first.
        const ringsForLegend = [...ringsBase].sort((a,b)=>b.value - a.value);
        return (
          <div className="h-full min-h-0 w-full grid grid-cols-[minmax(260px,1.15fr)_minmax(260px,0.85fr)] items-stretch gap-[clamp(12px,1.6vw,28px)]">
            <div className="min-h-0 w-full flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center" style={{ maxWidth: '620px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius={12}
                    outerRadius="100%"
                    barSize={14}
                    data={ringsForChart}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0,100]} tick={false} />
                    <RadialBar dataKey="value" background={{ fill: '#e5e7eb' }} cornerRadius={14}>
                      {ringsForChart.map((entry:any, idx:number)=>(<Cell key={idx} fill={entry.fill} />))}
                    </RadialBar>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="min-h-0 w-full flex flex-col lg:pl-2">
              <h3 className="text-sm font-black text-gray-900 mb-3">{t('chart.facultyVisits')}</h3>
              <ul className="min-h-0 flex-1 overflow-hidden pr-1 space-y-1.5">
                {ringsForLegend.map((item:any,i:number)=>( 
                  <li key={i} className="flex items-center gap-3">
                    <span className="inline-block w-4 h-4 rounded-sm border border-black/40" style={{ backgroundColor: item.fill }} />
                    <span className="flex-1 min-w-0 truncate text-[13px] font-bold text-gray-900" title={item.name}>{item.name}</span>
                    <span className="text-[12px] font-black text-gray-800 tabular-nums">{item.uv.toLocaleString(browserLocale)}</span>
                    <span className="text-[12px] font-bold text-gray-500 tabular-nums">{item.percentage.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border border-black/30 bg-emerald-50 px-3 py-1.5 text-center shadow-[2px_2px_0px_0px_rgba(5,46,22,0.45)]">
                <div className="text-sm font-black text-gray-700">{t('chart.total', { value: totalAll.toLocaleString(browserLocale) })}</div>
              </div>
            </div>
          </div>
        );
      }
      case 'kpi':
        if (!currentData.length) {
          return (
            <div className="h-full flex items-center justify-center">
              <EmptyState
                compact
                title={t('chart.emptyTitle')}
                subtitle={t('chart.emptyCollection')}
                height={220}
                maxWidthPx={300}
              />
            </div>
          );
        }
        return (
          <div className="h-full min-h-0 grid grid-cols-[minmax(420px,0.95fr)_minmax(320px,0.62fr)] items-center gap-[clamp(24px,4vw,72px)] px-[clamp(28px,5vw,92px)] py-[clamp(16px,3vh,42px)]">
            <div className="min-h-0 grid gap-[clamp(18px,3vh,34px)]">
              {currentData.map((item: any, index: number) => {
                const isUniqueTitle = item.metricKey === 'uniqueTitles';
                const Icon = isUniqueTitle ? BookOpen : Library;
                const accentClass = isUniqueTitle ? 'text-[#15803d]' : 'text-[#2563eb]';
                const borderClass = isUniqueTitle ? 'border-[#15803d]' : 'border-[#2563eb]';
                const description = isUniqueTitle ? t('chart.differentBookTitles') : t('chart.physicalDigitalResources');

                return (
                  <div key={index} className={`border-l-[10px] ${borderClass} bg-white pl-[clamp(16px,2vw,28px)] py-[clamp(8px,1.4vh,16px)]`}>
                    <div className="flex items-center gap-[clamp(10px,1.2vw,18px)]">
                      <Icon className={`h-[clamp(34px,3vw,54px)] w-[clamp(34px,3vw,54px)] ${accentClass}`} strokeWidth={2.4} />
                      <div className="min-w-0">
                        <h3 className="text-[clamp(22px,2vw,36px)] font-black leading-none text-gray-900">{item.category || item.period}</h3>
                        <div className="mt-2 flex items-center gap-2">
                          <div className={`h-3.5 w-3.5 ${isUniqueTitle ? 'bg-[#16a34a]' : 'bg-[#3b82f6]'}`} />
                          <span className="text-[clamp(13px,1.05vw,18px)] font-black text-gray-600">{description}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-[clamp(10px,1.4vh,18px)] font-mono tabular-nums text-[clamp(4.4rem,7.3vw,8.8rem)] font-black leading-[0.82] tracking-[-0.08em] ${accentClass}`}>
                      {(item.total || 0).toLocaleString(browserLocale)}
                    </div>
                  </div>
                );
              })}
            </div>
            {currentData.length > 1 && (
                <div className="w-full border-2 border-[#052e16] bg-emerald-50 p-[clamp(16px,2.3vw,34px)] shadow-[6px_6px_0px_0px_#052e16]">
                  <div className="text-left">
                  <div className="text-[clamp(20px,1.65vw,30px)] font-black leading-tight text-gray-900">{t('chart.collectionSummary')}</div>
                  <div className="mt-[clamp(14px,2vh,24px)] grid gap-[clamp(14px,1.8vh,22px)]">
                    <div className="border-b-2 border-[#052e16] pb-[clamp(10px,1.4vh,16px)]">
                      <div className="text-[clamp(14px,1.05vw,18px)] font-black text-green-700">{t('chart.catalogDiversity')}</div>
                      <div className="mt-1 text-[clamp(24px,2.4vw,44px)] font-black leading-none text-gray-900">
                        {t('chart.uniquePercent', { value: ((currentData[0]?.total / currentData[1]?.total) * 100 || 0).toLocaleString(browserLocale, { maximumFractionDigits: 1 }) })}
                      </div>
                    </div>
                    <div>
                      <div className="text-[clamp(14px,1.05vw,18px)] font-black text-blue-700">{t('chart.averageCopies')}</div>
                      <div className="mt-1 text-[clamp(24px,2.4vw,44px)] font-black leading-none text-gray-900">
                        {t('chart.copiesPerTitle', { value: Math.round((currentData[1]?.total / currentData[0]?.total) || 0).toLocaleString(browserLocale) })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
      <div className="relative z-10 flex items-center justify-between gap-4 pb-[clamp(6px,0.9vh,10px)]">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={`title-${currentChartIndex}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }}>
              <h2 className="truncate text-gray-900 font-black text-[clamp(16px,1.2vw,21px)]">{currentConfig?.title}</h2>
              <p className="text-[clamp(11px,0.88vw,14px)] text-[#047857] mt-0.5 font-bold truncate">{currentConfig?.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className={`inline-flex items-center gap-1.5 border-2 px-2.5 py-1 text-[clamp(10px,0.78vw,12px)] shadow-[2px_2px_0px_0px_#052e16] font-black ${status.badgeClass}`}>
            {status.icon}
            {status.text}
          </div>
          <div className="text-[11px] text-gray-600 mt-1 font-bold">{t('chart.position', { current: currentChartIndex + 1, total: chartConfigs.length })}</div>
        </div>
      </div>
      <div className="relative z-10 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={`chart-${currentChartIndex}`} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ duration: 0.35, ease: 'easeInOut' }} className="h-full w-full p-[clamp(4px,0.8vh,12px)]">
            {currentConfig?.type === 'events' ? (
              <div className="h-full w-full overflow-hidden">{renderChart()}</div>
            ) : currentConfig?.type === 'leaderboard' ? (
              <div className="h-full w-full overflow-hidden">{renderChart()}</div>
            ) : currentConfig?.type === 'kpi' || currentConfig?.type === 'pie' || currentConfig?.type === 'radialBar' ? (
              renderChart()
            ) : (!currentData.length ? (
              <div className="w-full h-full flex items-center justify-center">
                <EmptyState
                  compact
                  title={t('chart.emptyTitle')}
                  subtitle={t('chart.emptyPeriod')}
                  height={260}
                  maxWidthPx={300}
                  scale={1.2}
                  centerOffset={-40}
                />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">{renderChart() || <div />}</ResponsiveContainer>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="relative z-10 flex items-end justify-between gap-4 border-t border-black/15 pt-[clamp(5px,0.7vh,8px)]">
        <div className="min-w-0">
          <div className="text-[clamp(12px,0.95vw,16px)] font-black text-[#047857]">{t('chart.analyticsTitle')}</div>
          <div className="text-[11px] text-gray-700 font-bold">
            {lastUpdated ? (
              <>
                {t('chart.updatedAt', { time: lastUpdated.toLocaleTimeString(browserLocale) })}
              </>
            ) : t('chart.initializing')}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex justify-center gap-1">
          {chartConfigs.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSliderClick(index)}
              className={`h-2 w-2 transition-colors duration-200 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                index === currentChartIndex 
                  ? 'bg-[#16a34a] border-[#052e16]' 
                  : 'bg-gray-300 border-gray-500 hover:bg-gray-400'
              }`}
              aria-label={t('chart.goToChart', { index: index + 1 })}
            />
          ))}
          </div>
          <div className="hidden xl:flex gap-2 text-[10px] font-black text-gray-700">
            <span>{t('chart.scheduled')}</span>
            <span>{t('chart.rotation')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
