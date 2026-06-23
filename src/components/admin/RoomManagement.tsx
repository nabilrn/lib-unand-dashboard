import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { getImageUrl } from '../../lib/media';
import { demoRooms } from '../../data/demoData';
import toast, { Toaster } from 'react-hot-toast';

interface Room {
  id: number;
  name: string;
  description: string;
  photo_path: string;
  created_at: string;
  updated_at: string;
}

const emptyForm = {
  name: '',
  description: '',
  thumbnail: null as File | null,
};

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(() => demoRooms.map(room => ({ ...room })));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(emptyForm);

  const itemsPerPage = 5;

  const progress = useMemo(() => {
    let filled = 0;
    if (formData.name) filled++;
    if (formData.description) filled++;
    if (formData.thumbnail || editingRoom?.photo_path) filled++;
    return Math.round((filled / 3) * 100);
  }, [formData, editingRoom]);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

  const resetForm = () => {
    setFormData(emptyForm);
    setDialogOpen(false);
    setEditingRoom(null);
  };

  const openAddDialog = () => {
    setEditingRoom(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      thumbnail: null,
    });
    setDialogOpen(true);
  };

  const handleViewDetail = (room: Room) => {
    setViewingRoom(room);
    setDetailDialogOpen(true);
  };

  const getPreviewUrl = () => {
    if (formData.thumbnail) return URL.createObjectURL(formData.thumbnail);
    return editingRoom?.photo_path ? getImageUrl(editingRoom.photo_path) : undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      const photoPath = formData.thumbnail
        ? URL.createObjectURL(formData.thumbnail)
        : editingRoom?.photo_path || '/images/demo/room-reading.svg';

      if (editingRoom) {
        setRooms(prev => prev.map(room => room.id === editingRoom.id ? {
          ...room,
          name: formData.name,
          description: formData.description,
          photo_path: photoPath,
          updated_at: now,
        } : room));
        toast.success('Ruangan berhasil diperbarui!');
      } else {
        setRooms(prev => [{
          id: Date.now(),
          name: formData.name,
          description: formData.description,
          photo_path: photoPath,
          created_at: now,
          updated_at: now,
        }, ...prev]);
        toast.success('Ruangan berhasil ditambahkan!');
      }

      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    setRooms(prev => prev.filter(room => room.id !== id));
    toast.success('Ruangan berhasil dihapus!');
    if (paginatedRooms.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, thumbnail: file }));
  };

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />

      <div className="space-y-1 mb-2">
        <h1 className="text-xl font-semibold tracking-tight text-emerald-900">Kelola Ruangan</h1>
        <p className="text-sm text-emerald-600/80">Manajemen fasilitas dan ruangan perpustakaan</p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent wide className="w-[94%] md:w-[85%] lg:w-[60%] xl:w-[50%] max-w-[1100px] p-0">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[12px] font-medium text-gray-600">
                <span>{editingRoom ? 'Edit Ruangan' : 'Draft Ruangan Baru'}</span>
                <span>{progress}% lengkap</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: progress + '%' }} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-emerald-800">Nama Ruangan</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama ruangan"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-emerald-800">Deskripsi</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Masukkan deskripsi ruangan"
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-emerald-800">Foto Ruangan</label>
                  <div className="relative border-2 border-dashed rounded-xl border-emerald-300 bg-emerald-50/30 h-56 overflow-hidden">
                    {getPreviewUrl() ? (
                      <img src={getPreviewUrl()} alt="Preview ruangan" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-emerald-600 p-6">
                        <p className="font-semibold mb-1">Pilih gambar ruangan</p>
                        <p className="text-[12px] text-emerald-500 text-center mb-3">JPG, PNG, WebP</p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-emerald-100">
                <Button type="submit" disabled={isSubmitting} className="flex-1 h-11 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Menyimpan...' : (editingRoom ? 'Perbarui Ruangan' : 'Simpan Ruangan')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="px-8 h-11 font-semibold">Batal</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="mt-2">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base font-semibold">Daftar Ruangan</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari ruangan..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={openAddDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-1" disabled={isSubmitting}>
                <Plus className="w-4 h-4" />Tambah Ruangan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRooms.map(room => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        {room.photo_path ? (
                          <img
                            src={getImageUrl(room.photo_path)}
                            alt={room.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-[10px] text-muted-foreground">No Img</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{room.description || '-'}</TableCell>
                    <TableCell>{new Date(room.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetail(room)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(room)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Ruangan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus ruangan "{room.name}"? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(room.id)} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRooms.length)} dari {filteredRooms.length} data</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent wide className="w-[92%] md:w-[70%] lg:w-[50%] xl:w-[42%] max-w-[760px] p-0 overflow-hidden bg-white">
          {viewingRoom ? (
            <div className="p-6 md:p-7 space-y-6">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-lg font-semibold tracking-tight text-neutral-800">Detail Ruangan</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-7">
                <div className="md:w-56 w-full flex-shrink-0">
                  <div className="aspect-[4/3] w-full rounded-lg border bg-neutral-50 overflow-hidden flex items-center justify-center shadow-sm">
                    {viewingRoom.photo_path ? (
                      <img
                        src={getImageUrl(viewingRoom.photo_path)}
                        alt={viewingRoom.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">Tidak ada gambar</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Nama Ruangan</p>
                    <p className="font-medium text-neutral-800 leading-snug">{viewingRoom.name}</p>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Deskripsi</p>
                    <p className="text-neutral-700 whitespace-pre-line leading-relaxed text-sm">{viewingRoom.description || '-'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Dibuat</p>
                    <p>{viewingRoom.created_at ? new Date(viewingRoom.created_at).toLocaleDateString('id-ID') : '-'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Diupdate</p>
                    <p>{viewingRoom.updated_at ? new Date(viewingRoom.updated_at).toLocaleDateString('id-ID') : '-'}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)} className="h-9 px-6">Tutup</Button>
                <Button onClick={() => { handleEdit(viewingRoom); setDetailDialogOpen(false); }} className="h-9 px-6">Edit</Button>
              </div>
            </div>
          ) : (
            <div className="p-8"><p className="text-sm text-muted-foreground">Memuat...</p></div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomManagement;
