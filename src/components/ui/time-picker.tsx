import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from './utils';

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  format12?: boolean; // 12-hour format with AM/PM
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Pilih waktu',
  disabled = false,
  className,
  format12 = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse time value
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 12, minutes: 0, period: 'AM' };
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    if (format12) {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return { hours: displayHours, minutes, period };
    }
    
    return { hours, minutes, period: 'AM' };
  };

  const { hours, minutes, period } = parseTime(value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const formatDisplayTime = () => {
    if (!value) return '';
    
    const { hours, minutes, period } = parseTime(value);
    if (format12) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const updateTime = (newHours: number, newMinutes: number, newPeriod?: string) => {
    let finalHours = newHours;
    
    if (format12 && newPeriod) {
      if (newPeriod === 'PM' && newHours !== 12) {
        finalHours = newHours + 12;
      } else if (newPeriod === 'AM' && newHours === 12) {
        finalHours = 0;
      }
    }
    
    const timeString = `${finalHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    onChange?.(timeString);
  };

  const incrementHours = () => {
    const maxHours = format12 ? 12 : 23;
    const minHours = format12 ? 1 : 0;
    const newHours = hours >= maxHours ? minHours : hours + 1;
    updateTime(newHours, minutes, period);
  };

  const decrementHours = () => {
    const maxHours = format12 ? 12 : 23;
    const minHours = format12 ? 1 : 0;
    const newHours = hours <= minHours ? maxHours : hours - 1;
    updateTime(newHours, minutes, period);
  };

  const incrementMinutes = () => {
    const newMinutes = minutes >= 59 ? 0 : minutes + 1;
    updateTime(hours, newMinutes, period);
  };

  const decrementMinutes = () => {
    const newMinutes = minutes <= 0 ? 59 : minutes - 1;
    updateTime(hours, newMinutes, period);
  };

  const togglePeriod = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    updateTime(hours, minutes, newPeriod);
  };

  const quickTimes = [
    { label: '09:00', value: '09:00' },
    { label: '10:00', value: '10:00' },
    { label: '11:00', value: '11:00' },
    { label: '13:00', value: '13:00' },
    { label: '14:00', value: '14:00' },
    { label: '15:00', value: '15:00' },
    { label: '16:00', value: '16:00' },
    { label: '19:00', value: '19:00' },
  ];

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full h-11 px-3 py-2 text-left border border-emerald-600/30 rounded-xl bg-white/60 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all',
          disabled && 'opacity-50 cursor-not-allowed',
          'flex items-center justify-between'
        )}
      >
        <span className={cn(
          'text-sm font-medium',
          !value && 'text-emerald-400/70'
        )}>
          {value ? formatDisplayTime() : placeholder}
        </span>
        <Clock className="w-4 h-4 text-emerald-600" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl border border-emerald-200 shadow-xl z-[60] p-4">
          {/* Time Spinners */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={incrementHours}
                className="p-1 hover:bg-emerald-50 rounded transition-colors"
              >
                <ChevronUp className="w-4 h-4 text-emerald-600" />
              </button>
              <div className="w-16 h-12 flex items-center justify-center bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-lg font-bold text-emerald-800">
                  {hours.toString().padStart(2, '0')}
                </span>
              </div>
              <button
                type="button"
                onClick={decrementHours}
                className="p-1 hover:bg-emerald-50 rounded transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            <span className="text-2xl font-bold text-emerald-600 pb-8">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={incrementMinutes}
                className="p-1 hover:bg-emerald-50 rounded transition-colors"
              >
                <ChevronUp className="w-4 h-4 text-emerald-600" />
              </button>
              <div className="w-16 h-12 flex items-center justify-center bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-lg font-bold text-emerald-800">
                  {minutes.toString().padStart(2, '0')}
                </span>
              </div>
              <button
                type="button"
                onClick={decrementMinutes}
                className="p-1 hover:bg-emerald-50 rounded transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            {/* AM/PM Toggle */}
            {format12 && (
              <div className="flex flex-col items-center ml-2">
                <div className="h-6" /> {/* Spacer */}
                <button
                  type="button"
                  onClick={togglePeriod}
                  className="w-12 h-12 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {period}
                </button>
                <div className="h-6" /> {/* Spacer */}
              </div>
            )}
          </div>

          {/* Quick Time Selection */}
          <div className="border-t border-emerald-100 pt-4">
            <h4 className="text-xs font-semibold text-emerald-700 mb-2">Waktu Populer</h4>
            <div className="grid grid-cols-4 gap-2">
              {quickTimes.map((time) => (
                <button
                  key={time.value}
                  type="button"
                  onClick={() => {
                    onChange?.(time.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                    value === time.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  )}
                >
                  {format12 ? formatDisplayTime() : time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Current Time Button */}
          <div className="border-t border-emerald-100 pt-3 mt-3">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                onChange?.(currentTime);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              Gunakan Waktu Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};