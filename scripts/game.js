/**
 * ============================================================
 * SCRIPTS/GAME.JS — Logika inti permainan
 * ============================================================
 */

let filledSlots  = [];
let flippedSet   = new Set();
let revealActive = false;
let timerInterval = null;
let timeLeft      = 0;
let timerPaused   = false;
let shuffleCount  = 0;

function startSession() {
  G.sessionCount++;
  shuffleCount = 0;
  if (((G.sessionCount - 1) % CFG.CYCLE) === 0) G.oshiItemGiven = false;
  filledSlots  = [];
  flippedSet   = new Set();
  revealActive = false;
  buildLineup();
  buildBoard();
  document.getElementById('timer-display').style.display = 'flex';
  updateHUD();
  save(G);
  startTimer();
 
}

function buildLineup() {
  var g = document.getElementById('lineup-grid');
  g.innerHTML = '';
  for (var i = 1; i <= CFG.SLOTS; i++) {
    var d = document.createElement('div');
    d.className = 'ls';
    d.id = 'ls' + i;
    d.innerHTML = '<span class="sn">' + i + '</span>';
    g.appendChild(d);
  }
  document.getElementById('slot-count').textContent = '0 / 15';
}

function trimLineupSlots() {
  for (var i = filledSlots.length + 1; i <= CFG.SLOTS; i++) {
    var el = document.getElementById('ls' + i);
    if (el) el.style.display = 'none';
  }
}

function buildBoard() {
  var targetAll = rnd(MEMBERS.filter(function(m) { return m.team === G.targetTeam; }));
  var others    = rnd(MEMBERS.filter(function(m) { return m.team !== G.targetTeam; }));
  var pool;
  var roll = Math.random();
  if (roll < 0.15) {
    // 15% — 16 kartu target (mudah, jarang)
    pool = rnd(targetAll.slice(0,16).concat(others.slice(0,8)));
  } else if (roll < 0.40) {
    // 25% — 12 kartu target
    pool = rnd(targetAll.slice(0,12).concat(others.slice(0,12)));
  } else if (roll < 0.70) {
    // 30% — 8 kartu target (harus shuffle)
    pool = rnd(targetAll.slice(0,8).concat(others.slice(0,16)));
  } else {
    // 35% — hanya 5 kartu target (sangat susah)
    pool = rnd(targetAll.slice(0,5).concat(others.slice(0,19)));
  }
  G.boardIds = pool.slice(0, CFG.BOARD).map(function(m) { return m.id; });
  renderBoard();
}

function renderBoard() {
  var g = document.getElementById('card-grid');
  g.innerHTML = '';
  G.boardIds.forEach(function(mid, idx) {
    var m       = MEMBERS.find(function(x) { return x.id === mid; });
    var inLU    = filledSlots.includes(mid);
    var flipped = flippedSet.has(idx) || revealActive;
    var div = document.createElement('div');
    div.className = 'kc' + (flipped ? ' flipped' : '') + (inLU ? ' in-lineup' : '');
    div.id = 'kc' + idx;
    div.innerHTML =
      '<div class="cf cf-front">' +
        '<div class="front-inner">' +
          '<div class="clm">JKT<span>48</span></div>' +
          '<div class="csec">?</div>' +
        '</div>' +
      '</div>' +
      '<div class="cf cf-back team-' + m.team + '">' +
        '<img src="' + imgO(m) + '" alt="' + m.name + '" loading="lazy" onerror="this.src=\'https://placehold.co/180x250/333/fff?text=?\'">' +
        '</div>' +
      '</div>';
    if (!inLU) {
      div.addEventListener('click', (function(i, id, member, el) {
        return function() { onCard(i, id, member, el); };
      })(idx, mid, m, div));
    }
    g.appendChild(div);
  });
}

function onCard(idx, mid, member, el) {
  if (filledSlots.includes(mid)) return;
  var alreadyOpen = el.classList.contains('flipped');

  if (!alreadyOpen) {
    el.classList.add('flipped');
    flippedSet.add(idx);

    // Cek bonus oshi
    if (mid === G.oshiId && !G.oshiItemGiven) {
      var cyclePos = (G.sessionCount - 1) % CFG.CYCLE;
      if (cyclePos !== CFG.CYCLE - 1) {
        G.oshiItemGiven = true;
        giveOshiItem();
      }
    }

    if (member.team !== G.targetTeam) {
      // Salah tim → tutup kembali
      el.classList.add('wp');
      setTimeout(function() {
        el.classList.remove('flipped', 'wp');
        flippedSet.delete(idx);
      }, 800);
    } else {
      // Sesuai tim → tampil dulu 600ms, baru masuk lineup
      el.classList.add('cp');
      setTimeout(function() {
        el.classList.remove('cp');
        addToLineup(mid, member, el);
      }, 600);
    }
  }
}

function addToLineup(mid, member, el) {
  if (filledSlots.length >= CFG.SLOTS || filledSlots.includes(mid)) return;
  filledSlots.push(mid);
  el.classList.add('in-lineup');
  var slotEl = document.getElementById('ls' + filledSlots.length);
  if (slotEl) {
    slotEl.classList.add('filled', 'team-' + member.team);
    slotEl.innerHTML =
      '<img src="' + imgO(member) + '" alt="' + member.name + '" onerror="this.src=\'https://placehold.co/60x80/333/fff?text=?\'">' +
      '<div class="ls-name">' + member.name.split(' ')[0] + '</div>';
  }
  document.getElementById('slot-count').textContent = filledSlots.length + ' / 15';;
  G.collection[mid] = (G.collection[mid] || 0) + 1;
  save(G);
  if (filledSlots.length >= 15) onSuccess();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft    = CFG.TIMER;
  timerPaused = false;
  renderTimer();
  timerInterval = setInterval(function() {
    if (timerPaused) return;
    timeLeft--;
    renderTimer();
    var td = document.getElementById('timer-display');
    if (timeLeft <= 10) td.classList.add('urgent');
    else td.classList.remove('urgent');
    if (timeLeft <= 0) onFail();
  }, 1000);
}

function stopTimer()   { clearInterval(timerInterval); }
function pauseTimer()  { timerPaused = true; document.getElementById('timer-display').classList.remove('urgent'); }
function resumeTimer() { if (currentPage === 'show') timerPaused = false; }
function renderTimer() { document.getElementById('timer-display').textContent = timeLeft; }

function onSuccess() {
  stopTimer();
  trimLineupSlots();
  G.successShows++;
  G.totalShows++;
  var pts = CFG.PTS_BASE + filledSlots.length * CFG.PTS_CARD;
  G.points += pts;
  G.totalPoints = (G.totalPoints || 0) + pts;
  G.showIdx++;
  if (G.showIdx >= G.maxShows) {
    G.day++;
    G.showIdx  = 0;
    G.maxShows = randShows();
  }
  G.targetTeam = randTeam();
 save(G);
  updateHUD();
  buildAlbum();
  buildLeaderboard();
  document.getElementById('ov-pts').textContent = pts;
  var ov = document.getElementById('overlay-overture');
  ov.classList.add('show');
  document.getElementById('btn-ov-next').onclick = function() {
    ov.classList.remove('show');
    goJeda();
  };
}

function onFail() {
  stopTimer();
  G.totalShows++;
  G.day++;
  G.showIdx    = 0;
  G.maxShows   = randShows();
  G.targetTeam = randTeam();
  save(G);
  var ov = document.getElementById('overlay-cancel');
  ov.classList.add('show');
  document.getElementById('btn-cancel-next').onclick = function() {
    ov.classList.remove('show');
    goJeda();
  };
}

function goJeda() {
  G.phase = 'jeda';
  save(G);
  document.getElementById('timer-display').style.display = 'none';
  document.getElementById('timer-display').classList.remove('urgent');
  document.getElementById('bottom-nav').style.display = 'flex';
  gotoPage('jeda');
}

function revealOneTarget() {
  var targetIdx = G.boardIds.findIndex(function(mid) {
    var m = MEMBERS.find(function(x) { return x.id === mid; });
    return m && m.team === G.targetTeam && !filledSlots.includes(mid);
  });
  if (targetIdx !== -1) {
    var el = document.getElementById('kc' + targetIdx);
    if (el && !el.classList.contains('flipped')) {
      el.classList.add('flipped');
      flippedSet.add(targetIdx);
    }
  }
}

function shuffleBoard() {
  flippedSet = new Set();
  shuffleCount++;
  var remaining = MEMBERS.filter(function(m) { return !filledSlots.includes(m.id); });
  var target    = rnd(remaining.filter(function(m) { return m.team === G.targetTeam; }));
  var others    = rnd(remaining.filter(function(m) { return m.team !== G.targetTeam; }));
  var pool;
  var roll = Math.random();
  if (roll < 0.33) {
    pool = rnd(target.slice(0,16).concat(others.slice(0,8)));
  } else if (roll < 0.66) {
    pool = rnd(target.slice(0,15).concat(others.slice(0,9)));
  } else {
    pool = rnd(target.slice(0,14).concat(others.slice(0,10)));
  }
  G.boardIds = pool.slice(0, CFG.BOARD).map(function(m) { return m.id; });
  renderBoard();

}

function giveOshiItem() {
  if (G.items.flip5 >= CFG.MAX_ITEMS) {
    showToast('Oshi ditemukan! (Item sudah maks 2)');
    return;
  }
  G.items.flip5 = Math.min(G.items.flip5 + 1, CFG.MAX_ITEMS);
  save(G);
  updateHUD();
  showToast('Oshi ditemukan! Item Balik 5 Detik +1');
}

function useFlip5() {
  if (G.items.flip5 <= 0) { showToast('Item habis!'); return; }
  G.items.flip5--;
  save(G);
  updateHUD();
  revealActive = true;
  document.querySelectorAll('.kc:not(.in-lineup)').forEach(function(c) {
    c.classList.add('flipped');
  });
  showToast('Semua kartu terbuka 5 detik!');
  setTimeout(function() {
    revealActive = false;
    G.boardIds.forEach(function(mid, i) {
      var el = document.getElementById('kc' + i);
      if (!el || filledSlots.includes(mid)) return;
      if (!flippedSet.has(i)) el.classList.remove('flipped');
    });
  }, 5000);
}

function enterShow() {
  updateHUD();
  if (G && G.phase === 'playing') resumeTimer();
}
