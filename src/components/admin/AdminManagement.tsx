import React, { useState } from 'react';
import { Users, Calendar, Home, Settings, LogOut, Plus, Edit, Trash2, BarChart3 } from 'lucide-react';

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
  location: string;
  status: 'Upcoming' | 'Planning' | 'Completed';
}

type ActivePage = 'dashboard' | 'rooms' | 'events' | 'settings';

const AdminManagement: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: 'Ruang Baca Utama', capacity: 50, status: 'Aktif' },
    { id: 2, name: 'Ruang Diskusi A', capacity: 12, status: 'Aktif' },
    { id: 3, name: 'Ruang Seminar', capacity: 100, status: 'Maintenance' },
  ]);

  const [events, setEvents] = useState<Event[]>([
    { id: 1, name: 'Workshop Digital Literacy', date: '15 Oct 2025', location: 'Ruang Seminar', status: 'Upcoming' },
    { id: 2, name: 'Book Reading Session', date: '18 Oct 2025', location: 'Ruang Baca', status: 'Upcoming' },
    { id: 3, name: 'Academic Writing Workshop', date: '22 Oct 2025', location: 'Ruang Diskusi A', status: 'Planning' },
  ]);

  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newRoom, setNewRoom] = useState<{ name: string; capacity: string; status: 'Aktif' | 'Maintenance' }>({ name: '', capacity: '', status: 'Aktif' });
  const [newEvent, setNewEvent] = useState<{ name: string; date: string; location: string; status: Event['status']; time: string; thumbnail: File | null }>({ 
    name: '', date: '', location: '', status: 'Planning', time: '14:30', thumbnail: null 
  });

  const handleLogout = () => {
    localStorage.removeItem('admin_login_creds');
    window.location.href = '/admin';
  };

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
      setShowAddRoom(false);
    }
  };

  const addEvent = () => {
    if (newEvent.name && newEvent.date && newEvent.location) {
      const event: Event = {
        id: events.length + 1,
        name: newEvent.name,
        date: newEvent.date,
        location: newEvent.location,
        status: newEvent.status,
      };
      setEvents([...events, event]);
      setNewEvent({ name: '', date: '', location: '', status: 'Planning', time: '14:30', thumbnail: null });
      setShowAddEvent(false);
      alert('Event berhasil ditambahkan!');
    }
  };

  const deleteRoom = (id: number) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-black text-gray-800">Admin Management Panel</h1>
              <p className="text-sm text-gray-600">Library Management System</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow neo-card-shadow-sm">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-bold text-gray-800">Total Ruangan</h3>
                <p className="text-2xl font-black text-green-600">{rooms.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow neo-card-shadow-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-800">Total Events</h3>
                <p className="text-2xl font-black text-blue-600">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow neo-card-shadow-sm">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-emerald-600" />
              <div>
                <h3 className="font-bold text-gray-800">Ruangan Aktif</h3>
                <p className="text-2xl font-black text-emerald-600">
                  {rooms.filter(r => r.status === 'Aktif').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow neo-card-shadow-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-bold text-gray-800">Events Upcoming</h3>
                <p className="text-2xl font-black text-purple-600">
                  {events.filter(e => e.status === 'Upcoming').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Room Management */}
          <div className="bg-white rounded-lg shadow neo-card-shadow-sm">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                  <Home className="w-5 h-5 text-green-600" />
                  Kelola Ruangan
                </h2>
                <button
                  onClick={() => setShowAddRoom(!showAddRoom)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg font-bold hover:bg-green-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>
            </div>

            {/* Add Room Form */}
            {showAddRoom && (
              <div className="p-4 bg-gray-50 border-b">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nama Ruangan"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Kapasitas"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newRoom.status}
                      onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as 'Aktif' | 'Maintenance' })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                    <button
                      onClick={addRoom}
                      className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg font-bold hover:bg-green-700 transition"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4">
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {rooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm">{room.name}</h3>
                      <p className="text-xs text-gray-600">Kapasitas: {room.capacity} orang</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        room.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {room.status}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteRoom(room.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Management */}
          <div className="bg-white rounded-lg shadow neo-card-shadow-sm">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Kelola Events
                </h2>
                <button
                  onClick={() => setShowAddEvent(!showAddEvent)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>
            </div>

            {/* Add Event Form */}
            {showAddEvent && (
              <div className="p-4 bg-gray-50 border-b">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nama Event"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Lokasi"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewEvent({ ...newEvent, thumbnail: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newEvent.status}
                      onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as Event['status'] })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Planning">Planning</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      onClick={addEvent}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4">
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm">{event.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                        <span>📅 {event.date}</span>
                        <span>📍 {event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'Planning' ? 'bg-gray-100 text-gray-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {event.status}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="mt-8 bg-white rounded-lg shadow neo-card-shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Pengaturan Cepat
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Library</label>
                <input
                  type="text"
                  defaultValue="University Library"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kontak</label>
                <input
                  type="text"
                  defaultValue="+62 751 71891"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition text-sm">
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
