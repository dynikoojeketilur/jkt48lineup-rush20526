function updateHUD() {
  if (!G) return;
  document.getElementById('hd').textContent = G.day;
  document.getElementById('hdMax').textContent = CFG.FINAL_DAY;
  document.getElementById('hs').textContent = G.showIdx + 1;
  document.getElementById('hms').textContent = G.maxShows;
  document.getElementById('hp').textContent = G.points;
  document.getElementById('cy').textContent = ((G.sessionCount - 1) % 17) + 1;
  document.getElementById('item-cnt').textContent = G.items.flip5;
  let tb = document.getElementById('target-banner');
  let namaTarget = { love:'Itadaki💗Love', dream:'Dream Bakudan', passion:'Passion 200%' };
  tb.textContent = namaTarget[G.targetTeam];
  tb.className = 'target-banner team-' + G.targetTeam;
  document.getElementById('btn-item').disabled = G.items.flip5 <= 0;
  document.getElementById('gacha-pts').textContent = G.points;
  document.getElementById('btn-gacha').disabled = G.points < CFG.GACHA_COST;
}

let albFilter = 'all';
function filtAlbum(t, btn) {
  albFilter = t;
  document.querySelectorAll('.afb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  buildAlbum();
}

function buildAlbum() {
  let g = document.getElementById('album-grid');
  if (!g) return;
  g.innerHTML = '';
  MEMBERS.filter(m => albFilter === 'all' || m.team === albFilter).forEach(m => {
    let stock = G.collection[m.id] || 0;
    let locked = stock === 0;
    let isOshi = m.id === G.oshiId;
    let d = document.createElement('div');
    d.className = 'ac team-' + m.team + (locked ? ' locked' : '');
    d.innerHTML = `<img src="${!locked ? imgO(m) : 'https://placehold.co/180x250/222/555?text=?'}" onerror="this.src='https://placehold.co/180x250/222/555?text=?'"><div class="ac-footer"><span class="an">${m.name}</span>${stock > 1 ? `<span class="ad">×${stock}</span>` : ''}</div>${isOshi ? '<div class="acrown">👑</div>' : ''}`;
    g.appendChild(d);
  });
  let allOwned = MEMBERS.every(m => (G.collection[m.id] || 0) > 0);
  let hasDup = MEMBERS.some(m => (G.collection[m.id] || 0) > 1);
  document.getElementById('btn-exchange').disabled = !(allOwned && hasDup && G.items.flip5 === 0);
}

function doExchange() {
  let allOwned = MEMBERS.every(m => (G.collection[m.id] || 0) > 0);
  if (!allOwned) { showToast('Kumpulkan semua member dulu!'); return; }
  let hasDup = MEMBERS.some(m => (G.collection[m.id] || 0) > 1);
  if (!hasDup) { showToast('Tidak ada duplikat!'); return; }
  if (G.items.flip5 > 0) { showToast('Pakai dulu Balik 5 Detik di show!'); return; }
  let gained = 0;
  MEMBERS.forEach(m => {
    let s = G.collection[m.id] || 0;
    if (s > 1) { gained++; G.collection[m.id] = s - 1; }
    else if (s === 1) { G.collection[m.id] = 0; }
  });
  let add = Math.min(gained, CFG.MAX_ITEMS - G.items.flip5);
  G.items.flip5 = Math.min(G.items.flip5 + add, CFG.MAX_ITEMS);
  G.fullKabesha = (G.fullKabesha || 0) + 1;
  save(G); updateHUD(); buildAlbum();
  showToast(`Album ditukar! +${add} Item. Full Member ke-${G.fullKabesha}!`);
}

let gachaAnim = false;
function onGachaClick() {
  if (!G || G.points < CFG.GACHA_COST || gachaAnim) return;
  G.points -= CFG.GACHA_COST;
  gachaAnim = true;
  let ca = document.getElementById('gacha-card-area');
  let rn = document.getElementById('gacha-rname');
  ca.innerHTML = `<div class="g-spin">✦</div>`;
  rn.textContent = '...';
  let m = MEMBERS[Math.floor(Math.random() * MEMBERS.length)];
  G.collection[m.id] = (G.collection[m.id] || 0) + 1;
  save(G); updateHUD(); buildAlbum();
  setTimeout(() => {
    ca.innerHTML = `<img src="${imgO(m)}" onerror="this.src='https://placehold.co/180x250/333/fff?text=?'"><div class="gts team-${m.team}">${TEAM_LABEL[m.team]}</div>`;
    rn.textContent = m.name;
    rn.className = 'tt-' + m.team;
    document.getElementById('gacha-pts').textContent = G.points;
    document.getElementById('btn-gacha').disabled = G.points < CFG.GACHA_COST;
    gachaAnim = false;
  }, 700);
}

function enterProfil() {
  if (!G) return;
  let oshi = MEMBERS.find(m => m.id === G.oshiId);
  let avg = G.totalShows > 0 ? Math.floor(G.totalPoints / G.totalShows) : 0;
  document.getElementById('pr-name').textContent = G.username.toUpperCase();
  document.getElementById('pr-oshi').textContent = oshi ? oshi.name + ' (' + TEAM_LABEL[oshi.team] + ')' : '-';
  document.getElementById('pr-pts').textContent = G.points;
  document.getElementById('pr-day').textContent = G.day;
  document.getElementById('pr-ok').textContent = G.successShows;
  document.getElementById('pr-tot').textContent = G.totalShows;
  document.getElementById('pr-col').textContent = MEMBERS.filter(m => (G.collection[m.id] || 0) > 0).length;
  document.getElementById('pr-avg').textContent = avg;
  document.getElementById('pr-cycle').textContent = ((G.sessionCount - 1) % 17) + 1 + ' / 17';
  document.getElementById('pr-target').textContent = `${G.day} / ${CFG.FINAL_DAY}`;
}

function enterJeda() {
  updateHUD();
  document.getElementById('bottom-nav').style.display = 'flex';
  let title = document.getElementById('jeda-title');
  let desc = document.getElementById('jeda-desc');
  let hint = document.getElementById('jeda-hint');
  let stats = document.getElementById('jeda-stats');
  if (G.isFirstTime) {
    title.textContent = 'JKT48 LINE UP RUSH';
    desc.textContent = 'Ayoo mulai susun line up show!!';
    document.getElementById('btn-mulai').textContent = 'MULAI';
    hint.textContent = 'Pertama kali? Langsung main deh!';
    stats.style.display = 'none';
  } else {
    title.textContent = 'SELAMAT DATANG KEMBALI!';
    desc.textContent = `Hari ${G.day} · Show ${G.showIdx + 1}/${G.maxShows}`;
    document.getElementById('btn-mulai').textContent = 'MULAI LANJUT';
    hint.textContent = 'Kumpulkan member dan kumpulkan poin!';
    stats.style.display = 'grid';
    document.getElementById('jst-day').textContent = G.day;
    document.getElementById('jst-show').textContent = G.successShows;
    document.getElementById('jst-pts').textContent = G.points;
    document.getElementById('jst-col').textContent = MEMBERS.filter(m => (G.collection[m.id] || 0) > 0).length;
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

function showToast(msg, dur=3000) {
  let el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
}
