import { getDemoEvents } from '../../../data/demoData';
import { EventItem } from './types';

let eventStore: EventItem[] = getDemoEvents().map(event => ({ ...event }));

const toPlainPayload = (payload: FormData | Record<string, any>) => {
  if (payload instanceof FormData) {
    const file = payload.get('file');
    return {
      title: String(payload.get('title') || ''),
      location: String(payload.get('location') || ''),
      date: String(payload.get('date') || ''),
      time: String(payload.get('time') || ''),
      thumbnail_path: file instanceof File ? URL.createObjectURL(file) : undefined,
    };
  }

  return {
    title: String(payload.title || ''),
    location: String(payload.location || ''),
    date: String(payload.date || ''),
    time: String(payload.time || ''),
    thumbnail_path: payload.thumbnail_path,
  };
};

const withStartsAt = (item: EventItem): EventItem => {
  const date = item.date || new Date().toISOString().slice(0, 10);
  const time = item.time || '09:00';
  return {
    ...item,
    date,
    time,
    starts_at: `${date}T${time}:00.000`,
    updated_at: new Date().toISOString(),
  };
};

export async function loadEvents(): Promise<EventItem[]> {
  return eventStore.map(event => ({ ...event }));
}

export async function createEvent(payload: FormData | Record<string, any>): Promise<EventItem> {
  const data = toPlainPayload(payload);
  const created = withStartsAt({
    id: Date.now(),
    title: data.title,
    location: data.location,
    date: data.date,
    time: data.time,
    thumbnail_path: data.thumbnail_path || '/images/demo/event-literacy.svg',
    created_at: new Date().toISOString(),
  });

  eventStore = [created, ...eventStore];
  return { ...created };
}

export async function updateEvent(id: number, payload: FormData | Record<string, any>): Promise<EventItem> {
  const data = toPlainPayload(payload);
  const existing = eventStore.find(event => event.id === id);
  if (!existing) throw new Error('Event tidak ditemukan');

  const updated = withStartsAt({
    ...existing,
    title: data.title,
    location: data.location,
    date: data.date,
    time: data.time,
    thumbnail_path: data.thumbnail_path || existing.thumbnail_path,
  });

  eventStore = eventStore.map(event => event.id === id ? updated : event);
  return { ...updated };
}

export async function deleteEvent(id: number): Promise<void> {
  eventStore = eventStore.filter(event => event.id !== id);
}
