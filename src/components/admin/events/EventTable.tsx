import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Edit, Eye } from 'lucide-react';
import { EventItem } from './types';
import { getImageUrl } from '../../../lib/media';

interface Props {
  events: EventItem[];
  onEdit: (ev: EventItem) => void;
  onView: (ev: EventItem) => void;
}

export const EventTable: React.FC<Props> = ({ events, onEdit, onView }) => {
  function statusBadge(ev: EventItem) {
    let eventDate: Date | null = null;
    if (ev.date && ev.time) {
      eventDate = new Date(`${ev.date}T${ev.time}`);
    } else if (ev.starts_at) {
      const d = new Date(ev.starts_at);
      if (!isNaN(d.getTime())) eventDate = d;
    }
    if (!eventDate || isNaN(eventDate.getTime())) return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">Unknown</span>;
    const now = new Date();
    if (eventDate > now) return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Upcoming</span>;
    return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Completed</span>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Thumbnail</TableHead>
          <TableHead>Judul Event</TableHead>
            <TableHead>Lokasi</TableHead>
          <TableHead>Tanggal & Waktu</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map(ev => (
          <TableRow key={ev.id}>
            <TableCell>
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {ev.thumbnail_path ? (
                  <img
                    src={getImageUrl(ev.thumbnail_path)}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-[10px] text-muted-foreground">No Img</span>
                )}
              </div>
            </TableCell>
            <TableCell className="font-medium">{ev.title}</TableCell>
            <TableCell>{ev.location}</TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{ev.date ? new Date(ev.date).toLocaleDateString('id-ID') : (ev.starts_at ? new Date(ev.starts_at).toLocaleDateString('id-ID') : '-')}</div>
                <div className="text-muted-foreground">{ev.time || (ev.starts_at ? new Date(ev.starts_at).toISOString().slice(11,16) : '-')}</div>
              </div>
            </TableCell>
            <TableCell>{statusBadge(ev)}</TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => onView(ev)}><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(ev)}><Edit className="w-4 h-4" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
