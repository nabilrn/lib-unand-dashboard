import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { EventItem } from './types';
import { getImageUrl } from '../../../lib/media';
import { Calendar, Clock, MapPin, Pencil } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: EventItem | null;
  onEdit: (ev: EventItem) => void;
}

export const EventDetailDialog: React.FC<Props> = ({ open, onOpenChange, event, onEdit }) => {
  const dateString = event?.date || (event?.starts_at ? new Date(event.starts_at).toISOString().slice(0,10) : undefined);
  const timeString = event?.time || (event?.starts_at ? new Date(event.starts_at).toISOString().slice(11,16) : undefined);
  const createdAt = event?.created_at ? new Date(event.created_at) : null;
  const updatedAt = event?.updated_at ? new Date(event.updated_at) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent wide className="w-[92%] md:w-[70%] lg:w-[50%] xl:w-[42%] max-w-[760px] p-0 overflow-hidden bg-white">
        {event ? (
          <div className="p-6 md:p-7 space-y-6">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-lg font-semibold tracking-tight text-neutral-800">Detail Event</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-60 w-full flex-shrink-0">
                <div className="aspect-[4/3] w-full rounded-lg border bg-neutral-50 overflow-hidden flex items-center justify-center shadow-sm">
                  {event.thumbnail_path ? (
                    <img
                      src={getImageUrl(event.thumbnail_path)}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Tidak ada gambar</span>
                  )}
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Nama Event</p>
                  <p className="font-medium text-neutral-800 leading-snug">{event.title}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Lokasi</p>
                  <p className="text-neutral-700 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> {event.location || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Tanggal</p>
                  <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-600" /> {dateString ? new Date(dateString).toLocaleDateString('id-ID') : '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Waktu</p>
                  <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-600" /> {timeString || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Dibuat</p>
                  <p>{createdAt ? createdAt.toLocaleDateString('id-ID') : '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Diupdate</p>
                  <p>{updatedAt ? updatedAt.toLocaleDateString('id-ID') : '-'}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 px-6">Tutup</Button>
              <Button onClick={() => { if (event) { onEdit(event); onOpenChange(false); } }} className="h-9 px-6 inline-flex gap-2"><Pencil className="w-4 h-4" /> Edit</Button>
            </div>
          </div>
        ) : (
          <div className="p-8"><p className="text-sm text-muted-foreground">Memuat...</p></div>
        )}
      </DialogContent>
    </Dialog>
  );
};
