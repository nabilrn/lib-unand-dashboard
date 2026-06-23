import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import toast, { Toaster } from 'react-hot-toast';
import { libraryQuotes } from '../../data/demoData';

interface QuoteItem {
  id: number;
  quote: string;
  created_at?: string;
  updated_at?: string;
}

const QuoteManagement: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteItem[]>(() => libraryQuotes.map((quote, index) => ({
    id: index + 1,
    quote,
    created_at: '2026-06-01T08:00:00.000Z',
    updated_at: '2026-06-20T08:00:00.000Z',
  })));
  const [loading] = useState(false);
  const [editing, setEditing] = useState<QuoteItem | null>(null);
  const [viewing, setViewing] = useState<QuoteItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [draft, setDraft] = useState('');
  const [deleting, setDeleting] = useState<QuoteItem | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => quotes.filter(q => q.quote.toLowerCase().includes(search.toLowerCase())), [quotes, search]);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const startIndex = (page - 1) * pageSize;

  const startEdit = (q: QuoteItem) => {
    setEditing(q);
    setIsAdd(false);
    setDraft(q.quote);
    setDialogOpen(true);
  };

  const startAdd = () => {
    setEditing(null);
    setIsAdd(true);
    setDraft('');
    setDialogOpen(true);
  };

  const openView = (q: QuoteItem) => { setViewing(q); };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) { toast.error('Quote tidak boleh kosong'); return; }
    if (draft.length < 8) { toast.error('Quote terlalu pendek'); return; }
    if (draft.length > 500) { toast.error('Maksimal 500 karakter'); return; }
    setUpdating(true);
    try {
      const now = new Date().toISOString();
      if (isAdd) {
        setQuotes(prev => [{ id: Date.now(), quote: draft.trim(), created_at: now, updated_at: now }, ...prev]);
        toast.success('Quote baru ditambahkan');
      } else if (editing) {
        setQuotes(prev => prev.map(q => q.id === editing.id ? { ...q, quote: draft.trim(), updated_at: now } : q));
        toast.success('Quote berhasil diperbarui');
      }
      setDialogOpen(false);
      setEditing(null);
      setIsAdd(false);
      setDraft('');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    if (!deleting) return;
    setQuotes(prev => prev.filter(q => q.id !== deleting.id));
    toast.success('Quote dihapus');
    setDeleting(null);
  };

  return (
    <div className="space-y-3 -mt-1">
      <Toaster position="top-right" />
  <div className="space-y-1 mb-1">
        <h1 className="text-xl font-semibold tracking-tight text-emerald-900">Manajemen Quote</h1>
        <p className="text-sm text-emerald-600/80">Kelola kutipan motivasi yang tampil di sistem</p>
      </div>
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base font-semibold">Daftar Quotes</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="w-full sm:w-72">
              <Input placeholder="Cari quote..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button size="sm" onClick={startAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"><Plus className="w-4 h-4" />Tambah</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead className="text-right w-32">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">Tidak ada data</TableCell></TableRow>
                )}
                {paginated.map((q, idx) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium text-sm">{startIndex + idx + 1}</TableCell>
                    <TableCell className="text-sm">
                      <div className="line-clamp-2 whitespace-pre-line max-w-3xl">{q.quote}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => openView(q)}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(q)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleting(q)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Menampilkan {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} dari {filtered.length} data</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
                <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditing(null); setIsAdd(false); } }}>
        <DialogContent wide className="w-[95%] md:w-[70%] lg:w-[55%] xl:w-[45%] max-w-[900px] p-0">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[12px] font-medium text-gray-600">
                <span>{isAdd ? 'Quote Baru' : 'Edit Quote'}</span>
                <span>{draft.length}/500</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: Math.min(100, (draft.length / 500) * 100) + '%' }} />
              </div>
            </div>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-emerald-800">Isi Quote</label>
                <Textarea value={draft} onChange={e => setDraft(e.target.value)} required rows={6} maxLength={500} placeholder="Tulis quote motivasi..." className="resize-none" />
                <p className="text-[11px] mt-1 text-gray-500">Gunakan kalimat singkat berdampak. Maks 500 karakter.</p>
              </div>
              <div className="flex gap-4 pt-6 border-t border-emerald-100">
                <Button type="submit" disabled={updating} className="flex-1 h-11 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">{updating ? 'Menyimpan...' : (isAdd ? 'Tambahkan Quote' : 'Simpan Perubahan')}</Button>
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); setEditing(null); setIsAdd(false); }} className="px-8 h-11 font-semibold">Batal</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={(o) => { if (!o) setViewing(null); }}>
        <DialogContent wide className="w-[90%] md:w-[55%] lg:w-[42%] xl:w-[36%] max-w-[640px] p-0 overflow-hidden bg-white">
          {viewing ? (
            <div className="p-6 md:p-7 space-y-6">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-lg font-semibold tracking-tight text-neutral-800">Detail Quote</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="rounded-lg border bg-neutral-50 px-4 py-4 leading-relaxed whitespace-pre-line text-neutral-800 shadow-sm">
                  {viewing.quote}
                </div>
                <div className="grid grid-cols-2 gap-4 text-[12px] text-neutral-600">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-neutral-700">ID</p>
                    <p>#{viewing.id}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-neutral-700">Panjang</p>
                    <p>{viewing.quote.length} karakter</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <Button variant="outline" onClick={() => setViewing(null)} className="h-9 px-6">Tutup</Button>
                <Button onClick={() => { startEdit(viewing); setViewing(null); }} className="h-9 px-6">Edit</Button>
              </div>
            </div>
          ) : (
            <div className="p-8"><p className="text-sm text-muted-foreground">Memuat...</p></div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => { if (!o) setDeleting(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Quote</AlertDialogTitle>
            <AlertDialogDescription>Yakin ingin menghapus quote ini? Tindakan tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuoteManagement;
