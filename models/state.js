const CFG = {
  SLOTS:      15,
  BOARD:      24,
  TIMER:      50,
  GACHA_COST: 50,
  CYCLE:      17,
  MAX_ITEMS:  2,
  PTS_BASE:   100,
  PTS_CARD:   10,
};

const SK = function(u) { return 'jkt48_v3_' + u; };
const LK = 'jkt48_last_v3';

function newState(username, oshiId) {
  return {
    username:      username,
    oshiId:        oshiId,
    points:        0,
    totalPoints:   0,
    day:           1,
    showIdx:       0,
    maxShows:      randShows(),
    targetTeam:    randTeam(),
    sessionCount:  0,
    oshiItemGiven: false,
    items:         { flip5: 0 },
    collection:    {},
    successShows:  0,
    totalShows:    0,
    boardIds:      [],
    phase:         'jeda',
    isFirstTime:   true,
    fullKabesha:   0,
    version:       3,
  };
}


function save(g) {
  try {
    localStorage.setItem(SK(g.username), JSON.stringify(g));
    localStorage.setItem(LK, g.username);
    // Simpan ke cloud (background)
    if (typeof saveToCloud === 'function') saveToCloud(g);
  } catch(e) { console.warn('Gagal simpan:', e); }
}


async function loadPlayer(u) {
  try {
    if (typeof loadFromCloud === 'function') {
      var cloudData = await loadFromCloud(u);
      if (cloudData) {
        localStorage.setItem(SK(u), JSON.stringify(cloudData));
        return cloudData;
      }
    }
  } catch(e) { console.warn('Cloud load gagal:', e); }
  // Fallback localStorage
  try {
    var r = localStorage.getItem(SK(u));
    return r ? JSON.parse(r) : null;
  } catch(e) { return null; }
}


function load(u) {
  try {
    var r = localStorage.getItem(SK(u));
    return r ? JSON.parse(r) : null;
  } catch(e) { return null; }
}

function lastUser()  { return localStorage.getItem(LK) || null; }
function clearLast() { localStorage.removeItem(LK); }

function allUsers() {
  var out = [];
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k && k.startsWith('jkt48_v3_')) out.push(k.replace('jkt48_v3_', ''));
  }
  return out;
}

function randShows() { return Math.floor(Math.random() * 3) + 1; }
function randTeam() {
  var t = ['love', 'dream', 'passion'];
  return t[Math.floor(Math.random() * t.length)];
}
function rnd(arr) {
  var a = [...arr];
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}
