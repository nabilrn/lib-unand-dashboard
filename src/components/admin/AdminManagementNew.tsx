import React, { useState } from 'react';
import { Users, Calendar, Home, Settings, LogOut, Plus, Edit, Trash2, BarChart3, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '../ui/breadcrumb';

interface Room {
  id: number;
  name: string;
  capacity: number;
  status: 'Aktif' | 'Maintenance';
}

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Planning' | 'Completed';
}

type ActivePage = 'dashboard' | 'rooms' | 'events' | 'settings';

const AdminManagement: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('admin_login_creds');
    localStorage.removeItem('admin_token');
    window.location.href = '/admin';
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Ringkasan & Statistik' },
    { id: 'rooms', label: 'Kelola Ruangan', icon: Home, description: 'Manajemen Ruangan' },
    { id: 'events', label: 'Kelola Events', icon: Calendar, description: 'Manajemen Event' },
    { id: 'settings', label: 'Pengaturan', icon: Settings, description: 'Konfigurasi Sistem' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-black text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-600">Library Management</p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as ActivePage)}
                className={`w-full flex items-start gap-3 px-6 py-4 text-left hover:bg-green-50 transition-colors border-l-4 ${
                  activePage === item.id 
                    ? 'bg-green-50 border-green-600 text-green-700' 
                    : 'border-transparent text-gray-700 hover:border-green-200'
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 ${activePage === item.id ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activePage === 'dashboard' && <DashboardContent />}
          {activePage === 'rooms' && <RoomManagementContent />}
          {activePage === 'events' && <EventManagementContent />}
          {activePage === 'settings' && <SettingsContent />}
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent: React.FC = () => {
  const stats = [
    { label: 'Total Ruangan', value: '12', icon: Home, color: 'text-green-600' },
    { label: 'Total Events', value: '8', icon: Calendar, color: 'text-blue-600' },
    { label: 'Ruangan Aktif', value: '10', icon: Home, color: 'text-emerald-600' },
    { label: 'Pengunjung Hari Ini', value: '124', icon: Users, color: 'text-purple-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di panel admin perpustakaan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Navigasi cepat ke menu utama</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto p-4 justify-start">
            <Home className="w-4 h-4" />
            Tambah Ruangan
          </Button>
          <Button variant="outline" className="h-auto p-4 justify-start">
            <Calendar className="w-4 h-4" />
            Buat Event
          </Button>
          <Button variant="outline" className="h-auto p-4 justify-start">
            <Settings className="w-4 h-4" />
            Pengaturan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Room Management Content Component
const RoomManagementContent: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: 'Ruang Baca Utama', capacity: 50, status: 'Aktif' },
    { id: 2, name: 'Ruang Diskusi A', capacity: 12, status: 'Aktif' },
    { id: 3, name: 'Ruang Seminar', capacity: 100, status: 'Maintenance' },
    { id: 4, name: 'Ruang Komputer', capacity: 20, status: 'Aktif' },
    { id: 5, name: 'Ruang Audio Visual', capacity: 30, status: 'Aktif' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newRoom, setNewRoom] = useState({ name: '', capacity: '', status: 'Aktif' as 'Aktif' | 'Maintenance' });

  const itemsPerPage = 3;

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

  const addRoom = () => {
    if (newRoom.name && newRoom.capacity) {
      const room: Room = {
        id: rooms.length + 1,
        name: newRoom.name,
        capacity: parseInt(newRoom.capacity),
        status: newRoom.status,
      };
      setRooms([...rooms, room]);
      setNewRoom({ name: '', capacity: '', status: 'Aktif' });
      setShowAddForm(false);
    }
  };

  const deleteRoom = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
      setRooms(rooms.filter(room => room.id !== id));
      // Reset to first page if current page becomes empty
      if (paginatedRooms.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb removed - now provided by global header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Kelola Ruangan</h1>
          <p className="text-muted-foreground">Manajemen ruangan perpustakaan</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Tutup Form' : 'Tambah Ruangan'}
        </Button>
      </div>

      {/* Add Room Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Ruangan Baru</CardTitle>
            <CardDescription>Silahkan isi form di bawah untuk menambah ruangan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Nama Ruangan"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Kapasitas"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
              />
              <div className="flex gap-2">
                <select
                  value={newRoom.status}
                  onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as 'Aktif' | 'Maintenance' })}
                  className="flex-1 px-3 py-2 border rounded-md"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <Button onClick={addRoom}>Simpan</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Ruangan</CardTitle>
          <CardDescription>
            Total {filteredRooms.length} ruangan ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ruangan..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Ruangan</TableHead>
                <TableHead>Kapasitas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.capacity} orang</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      room.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteRoom(room.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRooms.length)} dari {filteredRooms.length} data
              </p>
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
    </div>
  );
};

// Event Management Content Component
const EventManagementContent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    { id: 1, name: 'Workshop Digital Literacy', date: '2025-12-01', time: '14:30', location: 'Ruang Seminar', status: 'Upcoming' },
    { id: 2, name: 'Book Reading Session', date: '2025-12-05', time: '10:00', location: 'Ruang Baca', status: 'Upcoming' },
    { id: 3, name: 'Academic Writing Workshop', date: '2025-12-10', time: '09:00', location: 'Ruang Diskusi A', status: 'Planning' },
    { id: 4, name: 'Library Orientation', date: '2025-12-15', time: '13:00', location: 'Ruang Utama', status: 'Completed' },
    { id: 5, name: 'Research Methods Training', date: '2025-12-20', time: '15:00', location: 'Ruang Komputer', status: 'Planning' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    thumbnail: null as File | null
  });

  const itemsPerPage = 3;

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, thumbnail: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      setEvents([...events, {
        id: Date.now(),
        name: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        status: 'Planning'
      }]);

      setFormData({ title: '', location: '', date: '', time: '', thumbnail: null });
      setShowAddForm(false);
      alert('Event berhasil ditambahkan!');
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menambahkan event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEvent = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      setEvents(events.filter(event => event.id !== id));
      // Reset to first page if current page becomes empty
      if (paginatedEvents.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb removed - now provided by global header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Kelola Events</h1>
          <p className="text-muted-foreground">Manajemen event perpustakaan</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Tutup Form' : 'Tambah Event'}
        </Button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Event Baru</CardTitle>
            <CardDescription>Silahkan isi form di bawah untuk menambah event</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Judul Event</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Masukkan judul event"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Lokasi</label>
                  <Input
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Masukkan lokasi event"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal</label>
                  <Input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Waktu</label>
                  <Input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail/Gambar Event</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {formData.thumbnail && (
                  <p className="text-sm text-muted-foreground mt-2">File terpilih: {formData.thumbnail.name}</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Mengunggah...' : 'Simpan Event'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Events</CardTitle>
          <CardDescription>
            Total {filteredEvents.length} events ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari events..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Event</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'Planning' ? 'bg-gray-100 text-gray-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteEvent(event.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredEvents.length)} dari {filteredEvents.length} data
              </p>
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
    </div>
  );
};

// Settings Content Component
const SettingsContent: React.FC = () => {
  const [settings, setSettings] = useState({
    libraryName: 'Perpustakaan UNAND',
    contact: '+62 751 71891',
    openTime: '07:00',
    closeTime: '22:00',
    notifications: true,
    autoBackup: false
  });

  const handleSave = () => {
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-foreground">Pengaturan</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-semibold mb-2">Pengaturan</h1>
        <p className="text-muted-foreground">Konfigurasi sistem perpustakaan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Umum</CardTitle>
          <CardDescription>Konfigurasi dasar sistem perpustakaan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Nama Perpustakaan</label>
              <Input
                value={settings.libraryName}
                onChange={(e) => setSettings({ ...settings, libraryName: e.target.value })}
                placeholder="Masukkan nama perpustakaan"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Kontak</label>
              <Input
                value={settings.contact}
                onChange={(e) => setSettings({ ...settings, contact: e.target.value })}
                placeholder="+62 751 71891"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Jam Buka</label>
              <Input
                type="time"
                value={settings.openTime}
                onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Jam Tutup</label>
              <Input
                type="time"
                value={settings.closeTime}
                onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-medium">Preferensi Sistem</h3>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label htmlFor="notifications" className="text-sm font-medium">
                Aktifkan notifikasi email
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoBackup"
                checked={settings.autoBackup}
                onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label htmlFor="autoBackup" className="text-sm font-medium">
                Backup otomatis harian
              </label>
            </div>
          </div>
          
          <div className="pt-6">
            <Button onClick={handleSave}>
              Simpan Pengaturan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagement;
