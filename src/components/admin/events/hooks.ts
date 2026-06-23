import { useCallback, useEffect, useState } from 'react';
import { EventItem } from './types';
import { loadEvents, createEvent as createLocalEvent, updateEvent as updateLocalEvent, deleteEvent as deleteLocalEvent } from './localStore';

interface UseEventsOptions {
  pageSize?: number;
}

export function useEvents(opts: UseEventsOptions = {}) {
  const pageSize = opts.pageSize ?? 5;
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadEvents();
      setEvents(data);
    } catch (e: any) {
      setError(e.message || 'Gagal memuat events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = events.filter(ev =>
    ev.title.toLowerCase().includes(search.toLowerCase()) ||
    ev.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  // CRUD wrappers
  async function createEvent(data: { title: string; location: string; date: string; time: string; thumbnail?: File | null; }) {
    try {
      let useMultipart = false;
      let body: FormData | Record<string, any>;
      if (data.thumbnail) {
        useMultipart = true;
        const fd = new FormData();
        fd.append('title', data.title);
        fd.append('location', data.location);
        fd.append('date', data.date);
        fd.append('time', data.time);
        fd.append('file', data.thumbnail); // uploadThumbnail picks first file
        body = fd;
      } else {
        body = { title: data.title, location: data.location, date: data.date, time: data.time };
      }
      const created = await createLocalEvent(body as any);
      if (!created.date || !created.time) {
        created.date = data.date;
        created.time = data.time;
      }
      setEvents(prev => [created, ...prev]);
      return created;
    } catch (e: any) {
      throw e;
    }
  }

  async function updateEvent(id: number, data: { title: string; location: string; date: string; time: string; thumbnail?: File | null; }) {
    let useMultipart = false;
    let body: FormData | Record<string, any>;
    if (data.thumbnail) {
      useMultipart = true;
      const fd = new FormData();
      fd.append('title', data.title);
      fd.append('location', data.location);
      fd.append('date', data.date);
      fd.append('time', data.time);
      fd.append('file', data.thumbnail);
      body = fd;
    } else {
      body = { title: data.title, location: data.location, date: data.date, time: data.time };
    }
    const updated = await updateLocalEvent(id, body as any);
    if (!updated.date || !updated.time) {
      updated.date = data.date;
      updated.time = data.time;
    }
    setEvents(prev => prev.map(ev => ev.id === id ? updated : ev));
    return updated;
  }

  async function removeEvent(id: number) {
    await deleteLocalEvent(id);
    setEvents(prev => prev.filter(ev => ev.id !== id));
  }

  return {
    // state
    events,
    loading,
    error,
    search,
    page,
    pageSize,
    filtered,
    paginated,
    totalPages,
    startIndex,
    // setters
    setSearch,
    setPage,
    reload: load,
    // operations
    createEvent,
    updateEvent,
    removeEvent,
  };
}
