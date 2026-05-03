/**
 * ============================================================
 * SCRIPTS/UI.JS
 * HUD, toast notifikasi, album kabesha, gacha, profil,
 * leaderboard, dan halaman jeda.
 * ============================================================
 */

// ── HUD (top bar info) ───────────────────────────────────────
function updateHUD() {
  if (!G) return;
  const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  set('hd',  G.day);
  set('hs',  G.showIdx + 1);
  set('hms', G.maxShows);
  set('hp',  G.points);
  set('cy',  ((G.sessionCount - 1) % 17) + 1);
  set('item-cnt', G.items.flip5);

  var tb = document.getElementById('target-banner');
  if (tb) {
    var namaTarget = {
      love:    'Itadaki💗Love',
      dream:   'Dream Bakudan',
      passion: 'Passion 200%',
    };
    tb.textContent = namaTarget[G.targetTeam];
    tb.className   = 'target-banner team-' + G.targetTeam;
  }

  const ib = document.getElementById('btn-item');
  if (ib) ib.disabled = G.items.flip5 <= 0;

  const set2 = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  set2('gacha-pts', G.points);
  const gb = document.getElementById('btn-gacha');
  if (gb) gb.disabled = G.points < CFG.GACHA_COST;
}

// ── TOAST NOTIFIKASI ─────────────────────────────────────────
let toastTO = null;
function showToast(msg, dur = 3000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTO);
  toastTO = setTimeout(() => el.classList.remove('show'), dur);
}

// ── JEDA PAGE ────────────────────────────────────────────────
function enterJeda() {
  updateHUD();
  document.getElementById('bottom-nav').style.display = 'flex';

  const title = document.getElementById('jeda-title');
  const desc  = document.getElementById('jeda-desc');
  const hint  = document.getElementById('jeda-hint');
  const stats = document.getElementById('jeda-stats');
  const btn   = document.getElementById('btn-mulai');

  if (G.isFirstTime) {
    title.textContent = 'JKT48 LINE UP RUSH';
    desc.textContent  = 'Ayoo mulai susun line up show!!';
    btn.textContent   = 'MULAI';
    hint.textContent  = 'Pertama kali? Langsung main deh!';
    stats.style.display = 'none';
  } else {
    title.textContent = 'SELAMAT DATANG KEMBALI!';
    desc.textContent  = `Hari ${G.day} · Show ${G.showIdx + 1}/${G.maxShows}`;
    btn.textContent   = 'MULAI LANJUT';
    hint.textContent  = 'Lihat kabesha atau gacha dulu sambil istirahat!';
    stats.style.display = 'grid';
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    set('jst-day',  G.day);
    set('jst-show', G.successShows);
    set('jst-pts',  G.points);
    set('jst-col',  MEMBERS.filter(m => (G.collection[m.id] || 0) > 0).length);
  }
}

function doMulai() {
  G.phase = 'playing';
  if (G.isFirstTime) G.isFirstTime = false;
  save(G);
  document.getElementById('bottom-nav').style.display = 'none';
  startSession();
  gotoPage('show');
}

// ── ALBUM KABESHA ────────────────────────────────────────────
let albFilter = 'all';

function filtAlbum(t, btn) {
  albFilter = t;
  document.querySelectorAll('.afb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  buildAlbum();
}

function buildAlbum() {
  if (!G) return;
  const g = document.getElementById('album-grid');
  if (!g) return;
  g.innerHTML = '';

  MEMBERS.filter(m => albFilter === 'all' || m.team === albFilter).forEach(m => {
    const stock  = G.collection[m.id] || 0;
    const locked = stock === 0;
    const isOshi = m.id === G.oshiId;

    const d = document.createElement('div');
    d.className = 'ac team-' + m.team + (locked ? ' locked' : '');
    d.innerHTML = `
      <img src="${locked ? imgC(m) : imgO(m)}" alt="${m.name}"
           onerror="this.src='https://placehold.co/180x250/222/555?text=?'">
      <div class="ac-footer">
        <span class="an">${m.name}</span>
        ${stock > 1 ? `<span class="ad">×${stock}</span>` : ''}
      </div>
      ${isOshi ? '<div class="acrown">👑</div>' : ''}`;
    g.appendChild(d);
  });

  const allOwned = MEMBERS.every(m => (G.collection[m.id] || 0) > 0);
  const hasDup   = MEMBERS.some(m  => (G.collection[m.id] || 0) > 1);
  const btn = document.getElementById('btn-exchange');
  // Tombol aktif hanya kalau item balik 5 detik HABIS (0)
  if (btn) btn.disabled = !(allOwned && hasDup && G.items.flip5 === 0);
}

function doExchange() {
  const allOwned = MEMBERS.every(m => (G.collection[m.id] || 0) > 0);
  if (!allOwned) { showToast('Kumpulkan semua member dulu!'); return; }
  const hasDup = MEMBERS.some(m => (G.collection[m.id] || 0) > 1);
  if (!hasDup) { showToast('Tidak ada duplikat!'); return; }

  // Kurangi 1 dari yang duplikat, yang cuma 1x ikut hilang
  let gained = 0;
  MEMBERS.forEach(m => {
    const s = G.collection[m.id] || 0;
    if (s > 1) {
      gained++;
      G.collection[m.id] = s - 1; // kurangi 1, sisanya tetap
    } else if (s === 1) {
      G.collection[m.id] = 0; // yang cuma 1x ikut hilang
    }
  });

  const add = Math.min(gained, CFG.MAX_ITEMS - G.items.flip5);
  G.items.flip5 = Math.min(G.items.flip5 + add, CFG.MAX_ITEMS);
  G.fullKabesha = (G.fullKabesha || 0) + 1;

  save(G);
  updateHUD();
  buildAlbum();
  showToast(`Album ditukar! +${add} Item. Full Member ke-${G.fullKabesha}!`);
}

// ── GACHA ────────────────────────────────────────────────────
let gachaAnim = false;

function enterGacha() {
  const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  set('gacha-pts', G ? G.points : 0);
  const gb = document.getElementById('btn-gacha');
  if (gb) gb.disabled = !G || G.points < CFG.GACHA_COST;
}

function onGachaClick() {
  if (!G || G.points < CFG.GACHA_COST || gachaAnim) return;
  G.points -= CFG.GACHA_COST;
  gachaAnim = true;

  const ca = document.getElementById('gacha-card-area');
  const rn = document.getElementById('gacha-rname');
  ca.innerHTML = `<div class="g-spin">✦</div>`;
  rn.textContent = '...';
  rn.className = '';

  const m = MEMBERS[Math.floor(Math.random() * MEMBERS.length)];
  G.collection[m.id] = (G.collection[m.id] || 0) + 1;
  save(G);
  updateHUD();
  buildAlbum();

  setTimeout(() => {
    ca.innerHTML = `
      <img src="${imgO(m)}" alt="${m.name}"
           onerror="this.src='https://placehold.co/180x250/333/fff?text=?'">
      <div class="gts team-${m.team}">${TEAM_LABEL[m.team]}</div>`;
    rn.textContent = m.name;
    rn.className   = 'tt-' + m.team;
    gachaAnim = false;
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    set('gacha-pts', G.points);
    const gb = document.getElementById('btn-gacha');
    if (gb) gb.disabled = G.points < CFG.GACHA_COST;
  }, 700);
}

// ── PROFIL ───────────────────────────────────────────────────
function enterProfil() {
  if (!G) return;
  const oshi = MEMBERS.find(m => m.id === G.oshiId);
  const set  = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

  set('pr-name', G.username.toUpperCase());
  set('pr-oshi', oshi ? oshi.name + ' (' + TEAM_LABEL[oshi.team] + ')' : '-');
  set('pr-pts',  G.points);
  set('pr-day',  G.day);
  set('pr-ok',   G.successShows);
  set('pr-tot',  G.totalShows);
  set('pr-col',  MEMBERS.filter(m => (G.collection[m.id] || 0) > 0).length);

  const siklus = ((G.sessionCount - 1) % 17) + 1;
  set('pr-cycle', siklus + ' / 17');
  const statusEl = document.getElementById('pr-cycle-status');
  if (statusEl) {
    if (siklus === 17) {
      statusEl.textContent = 'Siklus selesai!';
      statusEl.style.color = 'var(--gold)';
    } else {
      statusEl.textContent = `(${17 - siklus} sesi lagi)`;
      statusEl.style.color = 'var(--muted)';
    }
  }

  buildLeaderboard();
}

// ── LEADERBOARD — load dari Firebase cloud ───────────────────
async function buildLeaderboard() {
  const el = document.getElementById('lb-list');
  if (!el) return;
  el.innerHTML = '<div style="color:var(--muted);font-size:.75rem;text-align:center;padding:10px">Memuat...</div>';

  // Coba load dari cloud Firebase
  var allData = [];
  try {
    if (typeof loadAllPlayers === 'function') {
      allData = await loadAllPlayers();
    }
  } catch(e) {
    console.warn('loadAllPlayers gagal:', e);
  }

  // Fallback ke localStorage kalau cloud kosong/gagal
  if (!allData || allData.length === 0) {
    allData = allUsers()
      .map(function(u) {
        try {
          var r = localStorage.getItem('jkt48_v3_' + u);
          return r ? JSON.parse(r) : null;
        } catch(e) { return null; }
      })
      .filter(Boolean);
  }

  var users = allData
    .map(function(s) {
      return s ? {
        name:  s.username,
        pts:   s.totalPoints || s.points || 0,
        shows: s.successShows || 0,
        full:  s.fullKabesha || 0
      } : null;
    })
    .filter(Boolean)
    .sort(function(a, b) { return b.pts - a.pts; })
    .slice(0, 10);

  if (users.length === 0) {
    el.innerHTML = '<div style="color:var(--muted);font-size:.75rem;text-align:center;padding:10px">Belum ada pemain</div>';
    return;
  }

  var medals = ['gold-r', 'silver-r', 'bronze-r'];
  el.innerHTML = users.map(function(u, i) {
    var rank = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
    var nameDisplay = u.name === G.username
      ? u.name + ' (kamu)'
      : u.name.charAt(0) + '*'.repeat(u.name.length - 1);
    return '<div class="lb-row">' +
      '<div class="lb-rank ' + (medals[i] || '') + '">' + rank + '</div>' +
      '<div class="lb-name">' + nameDisplay + '</div>' +
      '<div>' +
        '<div class="lb-pts">' + u.pts + ' poin</div>' +
        '<div class="lb-shows">' + u.shows + ' show</div>' +
        '<div class="lb-shows">Full Member: ' + u.full + ' x</div>' +
      '</div>' +
    '</div>';
  }).join('');
}
