============================================================
PANDUAN FOLDER ASSETS
============================================================

Taruh foto member di folder ini:

  assets/
  ├── closed/   ← foto TERTUTUP (kartu belum dibuka)
  │              Ukuran ideal: 180x250 px
  └── open/     ← foto TERBUKA (kabesha / foto full)
                 Ukuran ideal: 180x250 px

Nama file harus SAMA PERSIS dengan yang ada di data/members.js
Contoh default:
  assets/closed/love01.jpg  ← Freya (tertutup)
  assets/open/love01.jpg    ← Freya (terbuka)

Kalau nama file berbeda, edit data/members.js bagian:
  img_closed: 'assets/closed/namafile.jpg'
  img_open:   'assets/open/namafile.jpg'

Jika file belum ada → game otomatis tampil placeholder.

CATATAN:
  Buka game lewat Live Server di VS Code (bukan dobel klik
  file HTML) agar gambar lokal bisa tampil di browser.
============================================================
