const CFG = {
  SLOTS: 15, BOARD: 24, TIMER: 50, GACHA_COST: 50,
  CYCLE: 17, MAX_ITEMS: 2, PTS_BASE: 100, PTS_CARD: 10, FINAL_DAY: 48
};

const SK = (u) => 'jkt48_v4_' + u;
const LK = 'jkt48_last_v4';

function newState(username, oshiId) {
  return {
    username: username,
    oshiId: oshiId,
    points: 0,
    totalPoints: 0,
    day: 1,
    showIdx: 0,
    maxShows: Math.floor(Math.random() * 3) + 1,
    targetTeam: ['love', 'dream', 'passion'][Math.floor(Math.random() * 3)],
    sessionCount: 0,
    oshiItemGiven: false,
    items: { flip5: 0 },
    collection: {},
    successShows: 0,
    totalShows: 0,
    boardIds: [],
    phase: 'jeda',
    isFirstTime: true,
    fullKabesha: 0,
    version: 4
  };
}

function save(g) {
  try {
    localStorage.setItem(SK(g.username), JSON.stringify(g));
    localStorage.setItem(LK, g.username);
  } catch(e) {
    console.warn('Gagal simpan:', e);
  }
}

function load(u) {
  try {
    // Cek versi baru dulu (v4)
    let r = localStorage.getItem(SK(u));
    if (r) {
      let data = JSON.parse(r);
      return data;
    }
    
    // Cek versi lama (v3) untuk kasih pesan maintenance
    let oldKey = 'jkt48_v3_' + u;
    let oldData = localStorage.getItem(oldKey);
    if (oldData) {
      let oldVersion = 'v3';
      // Panggil fungsi dari game.js
      if (typeof showMaintenanceApology === 'function') {
        showMaintenanceApology(oldVersion);
      }
      return null;
    }
    
    return null;
  } catch(e) {
    return null;
  }
}

function lastUser() {
  return localStorage.getItem(LK);
}

function clearLast() {
  localStorage.removeItem(LK);
}

function randShows(day) {
  if (day === CFG.FINAL_DAY) return 1;
  return Math.floor(Math.random() * 3) + 1;
}

function randTeam() {
  return ['love', 'dream', 'passion'][Math.floor(Math.random() * 3)];
}

function rnd(arr) {
  let a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}
