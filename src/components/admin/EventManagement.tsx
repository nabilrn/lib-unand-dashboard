import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useEvents } from './events/hooks';
import { EventForm, EventFormValues } from './events/EventForm';
import { EventTable } from './events/EventTable';
import { EventDetailDialog } from './events/EventDetailDialog';
import { EventItem } from './events/types';
import { Skeleton } from '../ui/skeleton';

const EventManagement: React.FC = () => {
  const {
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
    setSearch,
    setPage,
    reload,
    createEvent,
    updateEvent,
    removeEvent,
  } = useEvents({ pageSize: 5 });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [viewing, setViewing] = useState<EventItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Persist values even if dialog accidentally closed: keep in state and only reset when explicitly saved or user clicks "Batal" setelah konfirmasi
  const [formValues, setFormValues] = useState<EventFormValues>({ title: '', location: '', date: '', time: '', thumbnail: null });
  // Track if user has unsaved changes to optionally confirm discard later (future use)
  const [dirty, setDirty] = useState(false);

  // Draft persistence (excluding File object). We store everything except thumbnail file.
  const DRAFT_KEY = 'admin_event_form_draft';

  // Load draft on first mount if not editing
  useEffect(() => {
    if (!editing) {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Only apply if current form empty (avoid overwriting user manual start)
          if (!formValues.title && !formValues.location && !formValues.date && !formValues.time) {
            setFormValues(v => ({ ...v, ...parsed }));
          }
        }
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft when values change (ignore if editing existing event)
  useEffect(() => {
    if (!editing) {
      const { title, location, date, time } = formValues;
      if (title || location || date || time) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, location, date, time }));
      }
    }
  }, [formValues, editing]);
  const openAdd = () => {
    setEditing(null);
    // Do NOT reset existing draft if already dirty; provide fresh only if all empty
    setFormValues(v => (dirty || v.title || v.location || v.date || v.time) ? v : { title: '', location: '', date: '', time: '', thumbnail: null });
    setDialogOpen(true);
  };

  const onEdit = (ev: EventItem) => {
    setEditing(ev);
    setFormValues({ title: ev.title, location: ev.location, date: ev.date, time: ev.time, thumbnail: null });
    setDirty(false);
    setDialogOpen(true);
  };

  const onView = (ev: EventItem) => {
    setViewing(ev);
    setDetailOpen(true);
  };

  const onDelete = async (ev: EventItem) => {
    try {
      await removeEvent(ev.id);
      toast.success('Event berhasil dihapus!');
      if (paginated.length === 1 && page > 1) setPage(page - 1);
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus event');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateEvent(editing.id, formValues);
        toast.success('Event berhasil diperbarui!');
      } else {
        await createEvent(formValues);
        toast.success('Event berhasil ditambahkan!');
      }
      setDialogOpen(false);
      setEditing(null);
      setFormValues({ title: '', location: '', date: '', time: '', thumbnail: null });
      setDirty(false);
      localStorage.removeItem(DRAFT_KEY);
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan event');
    } finally {
      setSubmitting(false);
    }
  };

  // We keep rendering structure and show skeletons instead of early return for smoother UX
  if (error) return <div className="text-red-500 text-sm p-4">{error}</div>;

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      {/* Breadcrumb dipindahkan ke header global */}

      <div className="space-y-1 mb-2">
        <h1 className="text-xl font-semibold tracking-tight text-emerald-900">Kelola Events</h1>
        <p className="text-sm text-emerald-600/80">Manajemen event perpustakaan</p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(o)=>{
        // When closing (o=false) do NOT clear form, just hide (persist)
        setDialogOpen(o);
      }}>
        <AnimatePresence>
          {dialogOpen && (
            <DialogContent wide className="w-[94%] md:w-[85%] lg:w-[60%] xl:w-[50%] max-w-[1500px] min-h-[420px] p-0">
              <motion.div
                key="event-form-modal"
                className="p-6"
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <DialogHeader className="mb-2">
                  <DialogTitle>{editing ? 'Edit Event' : 'Tambah Event Baru'}</DialogTitle>
                  <DialogDescription className="sr-only">Formulir untuk {editing ? 'mengubah' : 'menambahkan'} data event perpustakaan.</DialogDescription>
                </DialogHeader>
                <EventForm
                  values={formValues}
                  onChange={patch => { setFormValues(v => { const merged = { ...v, ...patch }; setDirty(true); return merged; }); }}
                  onSubmit={onSubmit}
                  submitting={submitting}
                  editing={!!editing}
                  onCancel={() => {
                    if (dirty) {
                      const confirmDiscard = confirm('Perubahan belum disimpan. Tutup tanpa menyimpan?');
                      if (!confirmDiscard) return;
                      localStorage.removeItem(DRAFT_KEY);
                      setFormValues({ title: '', location: '', date: '', time: '', thumbnail: null });
                      setDirty(false);
                    }
                    setDialogOpen(false);
                    setEditing(null);
                  }}
                />
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>

      <EventDetailDialog open={detailOpen} onOpenChange={setDetailOpen} event={viewing} onEdit={onEdit} />

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base font-semibold">Daftar Events</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari events..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm whitespace-nowrap"><Plus className="w-4 h-4 mr-1" />Tambah Event</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <EventTable events={paginated} onEdit={onEdit} onView={onView} />
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Menampilkan {startIndex + 1}-{Math.min(startIndex + pageSize, filtered.length)} dari {filtered.length} data</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" />Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next<ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventManagement;
