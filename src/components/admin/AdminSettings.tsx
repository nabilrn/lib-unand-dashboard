import React, { useState } from 'react';
import { useSettings, DEFAULT_QUOTE } from '../../context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
// Breadcrumb removed; handled globally in header

const AdminSettings: React.FC = () => {
  const { quote, setQuote, resetQuote } = useSettings();
  const [settings, setSettings] = useState({
    libraryName: 'Perpustakaan UNAND',
    contact: '+62 751 71891',
    openTime: '07:00',
    closeTime: '22:00',
    notifications: true,
    autoBackup: false,
    quoteDraft: quote
  });

  const handleSave = () => {
    setQuote(settings.quoteDraft);
    alert('Pengaturan berhasil disimpan (lokal)');
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb dipindahkan ke header */}

      <div>
        <h1 className="text-2xl font-semibold">Pengaturan</h1>
        <p className="text-muted-foreground">Konfigurasi sistem perpustakaan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Umum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nama Perpustakaan</label>
              <Input
                value={settings.libraryName}
                onChange={(e) => setSettings({ ...settings, libraryName: e.target.value })}
                placeholder="Masukkan nama perpustakaan"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Kutipan Header</label>
              <Input
                value={settings.quoteDraft}
                onChange={(e) => setSettings({ ...settings, quoteDraft: e.target.value })}
                placeholder="Masukkan kutipan motivasi"
              />
              <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                <button type="button" onClick={() => setSettings(s => ({ ...s, quoteDraft: DEFAULT_QUOTE }))} className="underline text-green-600 hover:text-green-700">Reset default</button>
                <span>• Disimpan di browser (localStorage)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kontak</label>
              <Input
                value={settings.contact}
                onChange={(e) => setSettings({ ...settings, contact: e.target.value })}
                placeholder="+62 751 71891"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Jam Buka</label>
              <Input
                type="time"
                value={settings.openTime}
                onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Jam Tutup</label>
              <Input
                type="time"
                value={settings.closeTime}
                onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">Preferensi Sistem</h3>
            
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
          
          <div className="pt-4">
            <Button onClick={handleSave}>
              Simpan Pengaturan
            </Button>
            <Button variant="outline" className="ml-2" type="button" onClick={() => { resetQuote(); setSettings(s => ({ ...s, quoteDraft: DEFAULT_QUOTE })); }}>
              Pulihkan Kutipan Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;