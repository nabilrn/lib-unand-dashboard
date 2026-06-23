import VisitorChart from './VisitorChart';
import { BarChart3 } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';

export default function DashboardMain() {
  const { t } = useLocale();

  return (
    <div className="h-full min-h-0 w-full grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
      <div className="flex items-center justify-between mb-[clamp(6px,0.85vh,12px)] pb-[clamp(6px,0.85vh,10px)] border-b-2 border-black/20">
        <h2 className="font-black text-gray-900 flex items-center gap-2 text-[clamp(16px,1.18vw,21px)]">
          <BarChart3 className="w-5 h-5 text-[#16a34a]" strokeWidth={2.5} />
          {t('main.title')}
        </h2>

        <div className="hidden lg:flex items-center gap-2 text-[11px] font-black text-gray-800">
          <span className="border-2 border-[#052e16] bg-white px-2 py-1 shadow-[2px_2px_0px_0px_#052e16]">
            {t('main.rotation')}
          </span>
          <span className="border-2 border-[#052e16] bg-[#16a34a] px-2 py-1 text-white shadow-[2px_2px_0px_0px_#052e16]">
            {t('main.analytics')}
          </span>
        </div>
      </div>

      <div className="min-h-0 relative overflow-hidden">
        <VisitorChart />
      </div>
    </div>
  );
}
