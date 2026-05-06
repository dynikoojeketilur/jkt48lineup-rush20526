let filledSlots = [], flippedSet = new Set(), revealActive = false;
let timerInterval = null, timeLeft = 0, timerPaused = false, shuffleCount = 0;

function startSession() {
  G.sessionCount++;
  let isCycleDay = (G.day % CFG.CYCLE === 0);
  
  // NOTIF PENGINGAT ITEM (1 hari sebelum siklus 17)
  let daysUntilCycle = CFG.CYCLE - (G.day % CFG.CYCLE);
  if (G.items.flip5 > 0 && daysUntilCycle === 1 && !isCycleDay) {
    showToast('⚠️ PERINGATAN! Item "Balik 5 Detik" masih tersisa ' + G.items.flip5 + ' buah. Besok siklus Oshi akan reset! Gunakan sekarang juga! ⏰', 5000);
  }
  
  if (isCycleDay) G.oshiItemGiven = false;
  shuffleCount = 0;
  filledSlots = [];
  flippedSet = new Set();
  revealActive = false;
  buildLineup();
  buildBoard();
  document.getElementById('timer-display').style.display = 'flex';
  updateHUD();
  save(G);
  startTimer();
}

function buildLineup() {
  let g = document.getElementById('lineup-grid');
  g.innerHTML = '';
  for (let i = 1; i <= CFG.SLOTS; i++) {
    let d = document.createElement('div');
    d.className = 'ls';
    d.id = 'ls' + i;
    d.innerHTML = '<span class="sn">' + i + '</span>';
    g.appendChild(d);
  }
  document.getElementById('slot-count').textContent = '0 / 15';
}

function buildBoard() {
  let targetAll = rnd(MEMBERS.filter(m => m.team === G.targetTeam));
  let others = rnd(MEMBERS.filter(m => m.team !== G.targetTeam));
  let roll = Math.random();
  let pool;
  if (roll < 0.15) pool = rnd(targetAll.slice(0,16).concat(others.slice(0,8)));
  else if (roll < 0.40) pool = rnd(targetAll.slice(0,12).concat(others.slice(0,12)));
  else if (roll < 0.70) pool = rnd(targetAll.slice(0,8).concat(others.slice(0,16)));
  else pool = rnd(targetAll.slice(0,5).concat(others.slice(0,19)));
  G.boardIds = pool.slice(0, CFG.BOARD).map(m => m.id);
  renderBoard();
}

function renderBoard() {
  let g = document.getElementById('card-grid');
  g.innerHTML = '';
  G.boardIds.forEach((mid, idx) => {
    let m = MEMBERS.find(x => x.id === mid);
    let inLU = filledSlots.includes(mid);
    let flipped = flippedSet.has(idx) || revealActive;
    let div = document.createElement('div');
    div.className = 'kc' + (flipped ? ' flipped' : '') + (inLU ? ' in-lineup' : '');
    div.id = 'kc' + idx;
    div.innerHTML = `<div class="cf cf-front"><div class="front-inner"><div class="clm">JKT<span>48</span></div><div class="csec">?</div></div></div><div class="cf cf-back team-${m.team}"><img src="${imgO(m)}" onerror="this.src='https://placehold.co/180x250/333/fff?text=?'"><div class="cbf"><div class="cb-name">${m.name}</div></div></div>`;
    if (!inLU) div.addEventListener('click', () => onCard(idx, mid, m, div));
    g.appendChild(div);
  });
}

function onCard(idx, mid, member, el) {
  if (filledSlots.includes(mid)) return;
  let alreadyOpen = el.classList.contains('flipped');
  if (!alreadyOpen) {
    el.classList.add('flipped');
    flippedSet.add(idx);
    let isCycleDay = (G.day % CFG.CYCLE === 0);
    if (mid === G.oshiId && !G.oshiItemGiven && isCycleDay) {
      G.oshiItemGiven = true;
      giveOshiItem();
    }
    if (member.team !== G.targetTeam) {
      el.classList.add('wp');
      setTimeout(() => { el.classList.remove('flipped', 'wp'); flippedSet.delete(idx); }, 800);
    } else {
      el.classList.add('cp');
      setTimeout(() => { el.classList.remove('cp'); addToLineup(mid, member, el); }, 600);
    }
  }
}

function addToLineup(mid, member, el) {
  if (filledSlots.length >= CFG.SLOTS || filledSlots.includes(mid)) return;
  filledSlots.push(mid);
  el.classList.add('in-lineup');
  let slotEl = document.getElementById('ls' + filledSlots.length);
  if (slotEl) {
    slotEl.classList.add('filled', 'team-' + member.team);
    slotEl.innerHTML = `<img src="${imgO(member)}" onerror="this.src='https://placehold.co/60x80/333/fff?text=?'"><div class="ls-name">${member.name.split(' ')[0]}</div>`;
  }
  document.getElementById('slot-count').textContent = filledSlots.length + ' / 15';
  G.collection[mid] = (G.collection[mid] || 0) + 1;
  save(G);
  if (filledSlots.length >= CFG.SLOTS) onSuccess();
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

function shuffleBoard() {
  flippedSet = new Set();
  shuffleCount++;
  let remaining = MEMBERS.filter(m => !filledSlots.includes(m.id));
  let target = rnd(remaining.filter(m => m.team === G.targetTeam));
  let others = rnd(remaining.filter(m => m.team !== G.targetTeam));
  let pool;
  let roll = Math.random();
  if (roll < 0.33) pool = rnd(target.slice(0,16).concat(others.slice(0,8)));
  else if (roll < 0.66) pool = rnd(target.slice(0,15).concat(others.slice(0,9)));
  else pool = rnd(target.slice(0,14).concat(others.slice(0,10)));
  G.boardIds = pool.slice(0, CFG.BOARD).map(m => m.id);
  renderBoard();
}

function useFlip5() {
  if (G.items.flip5 <= 0) { showToast('Item habis!'); return; }
  G.items.flip5--;
  save(G);
  updateHUD();
  revealActive = true;
  document.querySelectorAll('.kc:not(.in-lineup)').forEach(c => c.classList.add('flipped'));
  showToast('Semua kartu terbuka 5 detik!');
  setTimeout(() => {
    revealActive = false;
    G.boardIds.forEach((mid, i) => {
      let el = document.getElementById('kc' + i);
      if (!el || filledSlots.includes(mid)) return;
      if (!flippedSet.has(i)) el.classList.remove('flipped');
    });
  }, 5000);
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = CFG.TIMER;
  timerPaused = false;
  renderTimer();
  timerInterval = setInterval(() => {
    if (timerPaused) return;
    timeLeft--;
    renderTimer();
    let td = document.getElementById('timer-display');
    if (timeLeft <= 10) td.classList.add('urgent');
    else td.classList.remove('urgent');
    if (timeLeft <= 0) onFail();
  }, 1000);
}

function stopTimer() { clearInterval(timerInterval); }
function pauseTimer() { timerPaused = true; }
function resumeTimer() { if (currentPage === 'show') timerPaused = false; }
function renderTimer() { document.getElementById('timer-display').textContent = timeLeft; }

function onSuccess() {
  stopTimer();
  G.successShows++;
  G.totalShows++;
  let pts = CFG.PTS_BASE + filledSlots.length * CFG.PTS_CARD;
  G.points += pts;
  G.totalPoints = (G.totalPoints || 0) + pts;
  G.showIdx++;
  if (G.showIdx >= G.maxShows) {
    G.day++;
    if (G.day > CFG.FINAL_DAY) { endGameAndReset(); return; }
    G.showIdx = 0;
    G.maxShows = randShows(G.day);
  }
  G.targetTeam = randTeam();
  save(G);
  updateHUD();
  buildAlbum();
  document.getElementById('ov-pts').textContent = pts;
  let ov = document.getElementById('overlay-overture');
  ov.classList.add('show');
  document.getElementById('btn-ov-next').onclick = () => { ov.classList.remove('show'); goJeda(); };
}

function onFail() {
  stopTimer();
  G.totalShows++;
  G.day++;
  if (G.day > CFG.FINAL_DAY) { endGameAndReset(); return; }
  G.showIdx = 0;
  G.maxShows = randShows(G.day);
  G.targetTeam = randTeam();
  save(G);
  let ov = document.getElementById('overlay-cancel');
  ov.classList.add('show');
  document.getElementById('btn-cancel-next').onclick = () => { ov.classList.remove('show'); goJeda(); };
}

function goJeda() {
  G.phase = 'jeda';
  save(G);
  document.getElementById('timer-display').style.display = 'none';
  document.getElementById('timer-display').classList.remove('urgent');
  document.getElementById('bottom-nav').style.display = 'flex';
  gotoPage('jeda');
  
  // Notif pengingat item saat di lobby (jika ada item dan besok siklus 17)
  let daysUntilCycle = CFG.CYCLE - (G.day % CFG.CYCLE);
  if (G.items.flip5 > 0 && daysUntilCycle === 1) {
    setTimeout(() => {
      showToast('⚠️ Peringatan! Kamu masih punya ' + G.items.flip5 + ' item "Balik 5 Detik". Gunakan sebelum siklus Oshi reset besok! ⏰', 5000);
    }, 500);
  }
}

function endGameAndReset() {
  stopTimer();
  let avgPoints = G.totalShows > 0 ? Math.floor(G.totalPoints / G.totalShows) : 0;
  let oshiName = MEMBERS.find(m => m.id === G.oshiId)?.name || "Oshi-mu";
  let message = "", isHighScore = false;
  
  if (avgPoints >= 200) {
    message = `✨ Luar biasa! ✨\nKamu berhasil mencapai rata-rata ${avgPoints} poin per show!\n${oshiName} bangga padamu! Terus pertahankan semangat JKT48! 🎉`;
    isHighScore = true;
  } else if (avgPoints >= 150) {
    message = `👍 Bagus sekali! 👍\nRata-rata ${avgPoints} poin per show.\n${oshiName} bilang: "Kamu hebat, lain kali pasti lebih baik lagi!" 💪`;
  } else if (avgPoints >= 100) {
    message = `😊 Tetap semangat! 😊\nRata-rata ${avgPoints} poin per show.\n${oshiName} bilang: "Jangan menyerah! Terus belajar dan latihan ya!" 🌟`;
  } else {
    message = `💪 Kamu pasti bisa! 💪\nRata-rata ${avgPoints} poin per show.\n${oshiName} bilang: "Setiap perjuangan itu berharga. Lain kali kita latihan bareng ya!" 🫶`;
  }
  
  let shareText = `🎮 JKT48 LINE UP RUSH - 48 HARI THEATER 🎮\n\n📊 PENCAPAIAN SAYA:\n✅ ${G.successShows} show berhasil\n⭐ Total ${G.totalPoints} poin\n📅 Menyelesaikan ${CFG.FINAL_DAY} hari\n📈 Rata-rata ${avgPoints} poin/show\n\n${oshiName} bilang: ${message.split('\n')[0]}\n\n#JKT48 #LineUpRush #TheaterGame`;
  
  let finalMessage = message + `\n\n📊 Statistik akhir:\n✅ ${G.successShows} show berhasil\n⭐ Total ${G.totalPoints} poin\n📅 Mencapai hari ke-${CFG.FINAL_DAY}`;
  
  let modal = document.createElement('div');
  modal.id = 'endgame-modal';
  modal.className = 'endgame-modal';
  modal.innerHTML = `
    <div class="endgame-content ${isHighScore ? 'highscore' : ''}">
      <div class="endgame-icon">${isHighScore ? '🏆' : '🌸'}</div>
      <div class="endgame-title">PERJALANAN ${CFG.FINAL_DAY} HARI SELESAI!</div>
      <div class="endgame-message">${finalMessage.replace(/\n/g,'<br>')}</div>
      <div class="endgame-oshi">~ ${oshiName} ~</div>
      <div class="endgame-buttons">
        <button class="endgame-btn share-btn" onclick="shareToMedsos('${shareText.replace(/'/g, "\\'")}')">📱 BAGIKAN KE MEDSOS</button>
        <button class="endgame-btn reset-btn" onclick="doCompleteReset()">MULAI LAGI 🎮</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
}

function shareToMedsos(text) {
  if (navigator.share) {
    navigator.share({
      title: 'JKT48 LINE UP RUSH - Pencapaian 48 Hari!',
      text: text,
    }).catch(err => {
      console.log('Share cancelled:', err);
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Teks berhasil disalin! Tempelkan ke medsos favoritmu ✨');
  }).catch(() => {
    showToast('Gagal menyalin, silakan screenshot manual ya 📸');
  });
}

function doCompleteReset() {
  let modal = document.getElementById('endgame-modal');
  if (modal) modal.remove();
  let oshiId = G.oshiId;
  let username = G.username;
  localStorage.removeItem(SK(username));
  G = newState(username, oshiId);
  window.G = G;
  save(G);
  updateHUD();
  buildAlbum();
  gotoPage('jeda');
  showToast("Perjalanan baru dimulai! Semangat! 🎵");
}

function showMaintenanceApology(oldVersion) {
  let modal = document.createElement('div');
  modal.id = 'maintenance-modal';
  modal.className = 'endgame-modal';
  modal.innerHTML = `
    <div class="endgame-content">
      <div class="endgame-icon">🔧</div>
      <div class="endgame-title">MOHON MAAF 🙏</div>
      <div class="endgame-message">
        Kami mohon maaf atas gangguan teknis sebelumnya.<br><br>
        Data versi <strong>${oldVersion}</strong> tidak dapat digunakan setelah maintenance.<br><br>
        Semua pemain harus <strong>mengumpulkan member dan poin dari awal lagi</strong>.<br><br>
        Terima kasih atas pengertiannya! 🙇
      </div>
      <div class="endgame-oshi">~ JKT48 Operation Team ~</div>
      <button class="endgame-btn reset-btn" onclick="clearOldDataAndReset()">MULAI BARU 🎮</button>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
}

function showMaintenanceAnnouncement() {
  let modal = document.createElement('div');
  modal.id = 'maintenance-modal';
  modal.className = 'endgame-modal';
  modal.innerHTML = `
    <div class="endgame-content">
      <div class="endgame-icon">🔧</div>
      <div class="endgame-title">PENGUMUMAN MENGENAI MAINTENANCE</div>
      <div class="endgame-message">
        Kepada seluruh pemain yang sudah bermain game JKT48 Line Up Rush🙏<br>
        Kami telah melakukan maintenance pada game<br>
        <strong>JKT48 LINE UP RUSH</strong> versi terbaru!<br><br>
        ✨ Fitur baru:<br>
        • Batas 48 hari dengan reset otomatis<br>
        • Pesan spesial dari Oshi di akhir game<br>
        • Tombol bagikan pencapaian ke medsos<br>
        • Ada hadiah 1 item pembantu di hari ke 17<br><br>

        Untuk yang kemarin sudah mengumpulkan point dengan sangat banyak, mohon maaf karena 
        data pemain sebelum maintenence tidak dapat digunakan lagi, jadi pemain mengumpulkan semuanya dari awal lagi🙏<br><br>
        Kami tidak menyangka kalau game ini di awal rilis banyak yang memainkannya, maka dari itu 
        kami ingin mengucapkan Terima kasih untuk yang sudah banyak yang memainkan game ini😇🙏.
        
      </div>
      <div class="endgame-oshi">~ Dydrmwn & Team ~</div>
      <button class="endgame-btn reset-btn" onclick="closeMaintenanceModal()">TUTUP</button>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
}

function closeMaintenanceModal() {
  let modal = document.getElementById('maintenance-modal');
  if (modal) modal.remove();
}

function clearOldDataAndReset() {
  let modal = document.getElementById('maintenance-modal');
  if (modal) modal.remove();
  
  let keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key && (key.startsWith('jkt48_v3_') || key.startsWith('jkt48_v4_'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  localStorage.removeItem('jkt48_last_v3');
  localStorage.removeItem('jkt48_last_v4');
  
  showToast("Data lama telah dibersihkan. Silakan daftar akun baru!");
  gotoPage('login');
}

function enterShow() { updateHUD(); if (G && G.phase === 'playing') resumeTimer(); }