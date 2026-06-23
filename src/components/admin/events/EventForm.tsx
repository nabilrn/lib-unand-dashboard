import React, { useMemo, useState, useCallback } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { DatePicker } from '../../ui/date-picker';
import { TimePicker } from '../../ui/time-picker';
import { Upload, X } from 'lucide-react';

export interface EventFormValues {
  title: string;
  location: string;
  date: string;
  time: string;
  thumbnail: File | null;
}

interface Props {
  values: EventFormValues;
  onChange: (patch: Partial<EventFormValues>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  editing: boolean;
  onCancel: () => void;
}

export const EventForm: React.FC<Props> = ({ values, onChange, onSubmit, submitting, editing, onCancel }) => {
  const [dragOver, setDragOver] = useState(false);

  // Compute progress: count filled simple fields (title, location, date, time, thumbnail)
  const progress = useMemo(() => {
    let filled = 0;
    if (values.title) filled++;
    if (values.location) filled++;
    if (values.date) filled++;
    if (values.time) filled++;
    if (values.thumbnail) filled++;
    return Math.round((filled / 5) * 100);
  }, [values]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onChange({ thumbnail: file });
      }
    }
  }, [onChange]);

  // Format datetime for display
  const formatDateTime = () => {
    if (values.date && values.time) {
      const dateObj = new Date(`${values.date}T${values.time}`);
      return dateObj.toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return '';
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[12px] font-medium text-gray-600">
          <span>{editing ? 'Edit Event' : 'Draft Baru'}</span>
          <span>{progress}% lengkap</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: progress + '%' }} />
        </div>
      </div>

      {/* Top Row - Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-emerald-800">Judul Event</label>
          <Input 
            required 
            value={values.title} 
            onChange={e => onChange({ title: e.target.value })} 
            placeholder="Masukkan judul event..."
            className="h-11"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-emerald-800">Lokasi</label>
          <Input 
            required 
            value={values.location} 
            onChange={e => onChange({ location: e.target.value })} 
            placeholder="Contoh: Auditorium Lt. 2"
            className="h-11"
          />
        </div>
      </div>

      {/* Middle Row - DateTime and Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* DateTime Pickers - 1/3 width */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-emerald-800">Jadwal Event</label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal</label>
              <DatePicker
                value={values.date}
                onChange={(date) => onChange({ date })}
                placeholder="Pilih tanggal event"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Waktu</label>
              <TimePicker
                value={values.time}
                onChange={(time) => onChange({ time })}
                placeholder="Pilih waktu event"
              />
            </div>
          </div>
          {formatDateTime() && (
            <div className="text-[12px] font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
              📅 {formatDateTime()}
            </div>
          )}
        </div>

        {/* Image Upload - 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <label className="block text-sm font-semibold text-emerald-800">Thumbnail Event</label>
          
          <div
            className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
              dragOver 
                ? 'border-emerald-500 bg-emerald-50' 
                : 'border-emerald-300 bg-emerald-50/30'
            } ${values.thumbnail ? 'h-48' : 'h-40'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {values.thumbnail ? (
              <div className="relative w-full h-full">
                <img
                  src={URL.createObjectURL(values.thumbnail)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onChange({ thumbnail: null })}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded">
                  {values.thumbnail.name}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-emerald-600 p-6">
                <Upload className="w-8 h-8 mb-3" />
                <p className="font-semibold mb-1">Drop gambar di sini</p>
                <p className="text-[12px] text-emerald-500 text-center mb-3">atau klik untuk browse file</p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => onChange({ thumbnail: e.target.files?.[0] || null })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-[10px] text-emerald-400 text-center">
                  Format: JPG, PNG, WebP<br/>
                  Max: 5MB
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-emerald-100">
        <Button 
          type="submit" 
          disabled={submitting} 
          className="flex-1 h-11 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Menyimpan...' : (editing ? 'Perbarui Event' : 'Simpan Event')}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="px-8 h-11 font-semibold"
        >
          Batal
        </Button>
      </div>
    </form>
  );
};
