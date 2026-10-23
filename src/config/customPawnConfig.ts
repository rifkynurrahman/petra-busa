/**
 * =========================================================================
 * KONFIGURASI PION 3D KUSTOM (CUSTOM 3D PAWN PNG)
 * =========================================================================
 * Anda dapat memasukkan desain pion PNG buatan Anda sendiri di sini!
 * 
 * CARA MENGGUNAKAN:
 * 1. Simpan file PNG Anda di folder `public/` (contoh: `public/pion_kudus_3d.png`).
 * 2. Ganti nilai `CUSTOM_PAWN_IMAGE_URL` di bawah ini dengan nama file tersebut.
 * 3. Anda juga bisa mengunggah / mengganti file PNG langsung melalui tombol
 *    "Unggah PNG Kustom" di menu "PION" saat permainan berjalan!
 */

export const CUSTOM_PAWN_IMAGE_URL: string = '';

// Pengaturan ukuran dan efek 3D pion
export const PAWN_3D_SETTINGS = {
  // Skala ukuran pion (1.0 = normal, 1.2 = lebih besar & gagah)
  scale: 1.15,
  // Warna pedestal dasar koin (emas Adat Kudus)
  pedestalColor: '#D97706',
  pedestalBorder: '#FDE68A',
  // Aktifkan bayangan 3D realistis
  castShadow: true,
  // Teks label di bawah pion kustom
  customPawnName: 'Pion Kustom 3D',
};
