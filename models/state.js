/**
 * ============================================================
 * MODELS/STATE.JS
 * Konstanta konfigurasi game dan fungsi save/load data pemain.
 * ============================================================
 */

// ------------------------------------------------------------
// KONFIGURASI GAME — ubah nilai di sini untuk tweak gameplay
// ------------------------------------------------------------
const CFG = {
  SLOTS:      15,   // jumlah slot lineup
  BOARD:      24,   // jumlah kartu di papan
  TIMER:      50,   // detik per show
  GACHA_COST: 50,   // poin per gacha
  CYCLE:      17,   // panjang siklus oshi item
  MAX_ITEMS:  2,    // maksimal item balik 5 detik
  PTS_BASE:   100,  // poin dasar per show berhasil
  PTS_CARD:   10,   // poin per kartu masuk lineup
};

// ------------------------------------------------------------
// STORAGE KEYS
// ------------------------------------------------------------
const SK  = u => 'jkt48_v3_' + u;  // key data per user
const LK  = 'jkt48_last_v3';        // key user terakhir login

// ------------------------------------------------------------
// STATE DEFAULT — struktur data pemain baru
// ------------------------------------------------------------
function newState(username, oshiId) {
  return {
    username,
    oshiId,
    points:        0,
    totalPoints:   0,   // poin komulatif, tidak berkurang
    day:           1,
    showIdx:       0,
    maxShows:      randShows(),
    targetTeam:    randTeam(),
    sessionCount:  0,
    oshiItemGiven: false,
    items:         { flip5: 0 },
    collection:    {},        // { memberId: jumlahStok }
    successShows:  0,
    totalShows:    0,
    boardIds:      [],
    phase:         'jeda',   // 'jeda' | 'playing'
    isFirstTime:   true,
    version:       3,
  };
}

// ------------------------------------------------------------
// SAVE / LOAD
// ------------------------------------------------------------
function save(g) {
  try {
    localStorage.setItem(SK(g.username), JSON.stringify(g));
    localStorage.setItem(LK, g.username);
  } catch(e) { console.warn('Gagal simpan:', e); }
}

function load(u) {
  try {
    const r = localStorage.getItem(SK(u));
    return r ? JSON.parse(r) : null;
  } catch(e) { return null; }
}

function lastUser()  { return localStorage.getItem(LK) || null; }
function clearLast() { localStorage.removeItem(LK); }

function allUsers() {
  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('jkt48_v3_')) out.push(k.replace('jkt48_v3_', ''));
  }
  return out;
}

// ------------------------------------------------------------
// HELPER RANDOM
// ------------------------------------------------------------
function randShows() { return Math.floor(Math.random() * 3) + 1; }
function randTeam()  {
  const t = ['love', 'dream', 'passion'];
  return t[Math.floor(Math.random() * t.length)];
}
function rnd(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
