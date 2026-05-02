/**
 * ============================================================
 * SCRIPTS/ROUTER.JS
 * Manajemen navigasi antar halaman (SPA).
 * ============================================================
 */

let currentPage = 'login';

// Pindah halaman utama (login/register tidak pakai topbar & nav)
function gotoPage(name) {
  document.querySelectorAll('.pv').forEach(p => {
    p.classList.toggle('active', p.id === 'page-' + name);
  });
  currentPage = name;

  const isAuth = ['login', 'register'].includes(name);
  document.getElementById('top-bar').style.display    = isAuth ? 'none' : 'flex';
  if (isAuth) {
    document.getElementById('bottom-nav').style.display = 'none';
  } else if (!G || G.phase !== 'playing') {
    document.getElementById('bottom-nav').style.display = 'flex';
  }

  // Timer hanya berjalan di halaman show
  if (name !== 'show') pauseTimer();

  // Hook per halaman
  if (name === 'show')    enterShow();
  if (name === 'kabesha') { buildAlbum(); }
  if (name === 'gacha')   enterGacha();
  if (name === 'profil')  enterProfil();
  if (name === 'jeda')    enterJeda();

  // Update highlight nav
  document.querySelectorAll('.bnb').forEach(b => {
    b.classList.toggle('active', b.dataset.p === name);
  });
}

// Klik tombol navigasi bawah — hanya boleh di fase jeda
function navTo(name) {
  if (G && G.phase === 'playing') return; // terkunci saat bermain
  gotoPage(name);
}
