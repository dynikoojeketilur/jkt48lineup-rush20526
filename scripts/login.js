/**
 * ============================================================
 * SCRIPTS/LOGIN.JS
 * Fungsi login dan register pemain.
 * ============================================================
 */

// Bangun daftar oshi di halaman register
function buildOshiList() {
  const el = document.getElementById('oshi-list');
  el.innerHTML = '';
  MEMBERS.forEach(m => {
    const d = document.createElement('div');
    d.className = 'oi';
    d.dataset.id = m.id;
    d.innerHTML = `
      <span class="oi-name">${m.name}</span>
      <span class="ob ob-${m.team}">${TEAM_LABEL[m.team]}</span>`;
    d.onclick = () => {
      el.querySelectorAll('.oi').forEach(x => x.classList.remove('selected'));
      d.classList.add('selected');
    };
    el.appendChild(d);
  });
}


function doLogin() {
  const u   = document.getElementById('li-u').value.trim();
  const err = document.getElementById('li-err');
  err.style.display = 'none';

  if (!u) {
    err.textContent = 'Masukkan username!';
    err.style.display = 'block';
    return;
  }
  const saved = load(u);
  if (!saved) {
    err.textContent = 'Username tidak ditemukan. Daftar dulu ya 😊';
    err.style.display = 'block';
    return;
  }
  G = saved;
  window.G = G;
  enterGame();
}


function doRegister() {
  const u   = document.getElementById('re-u').value.trim();
  const sel = document.getElementById('oshi-list').querySelector('.oi.selected');
  const err = document.getElementById('re-err');
  err.style.display = 'none';

  if (!u || u.length < 3) {
    err.textContent = 'Username minimal 3 karakter!';
    err.style.display = 'block';
    return;
  }
  if (!sel) {
    err.textContent = 'Pilih oshi kamu dulu!';
    err.style.display = 'block';
    return;
  }
  if (load(u)) {
    err.textContent = 'Username sudah ada. Coba nama lain atau langsung login.';
    err.style.display = 'block';
    return;
  }

  G = newState(u, sel.dataset.id);
  window.G = G;
  save(G);
  enterGame();
}


function enterGame() {
  if (G.phase === 'playing') {
    G.phase = 'jeda';
    save(G);
  }
  updateHUD();
  buildAlbum();
  gotoPage('jeda');
}

