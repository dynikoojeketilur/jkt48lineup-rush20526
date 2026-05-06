

function doLogout() {
  if (!confirm('Log out? Progress tersimpan, bisa masuk lagi kapan saja 👋')) return;
  stopTimer();
  clearLast();
  G = null;
  window.G = null;
  document.getElementById('li-u').value = '';
  document.getElementById('li-err').style.display = 'none';
  gotoPage('login');
}
