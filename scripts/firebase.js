/**
 * ============================================================
 * SCRIPTS/FIREBASE.JS
 * Koneksi ke Firebase Firestore untuk menyimpan data pemain.
 * Data tersimpan di cloud, tidak hilang meski game diupdate.
 * ============================================================
 */

// Firebase Config — jangan diubah
const firebaseConfig = {
  apiKey:            "AIzaSyDbuRNC8X_05gG0alpwU4lWmUoVENF3Eos",
  authDomain:        "jkt48lineup-rush20526.firebaseapp.com",
  projectId:         "jkt48lineup-rush20526",
  storageBucket:     "jkt48lineup-rush20526.firebasestorage.app",
  messagingSenderId: "810799172204",
  appId:             "1:810799172204:web:33ea6997b5f2d552756649",
  measurementId:     "G-H3MT82MHQZ"
};

// Inisialisasi Firebase (pakai CDN, tidak perlu npm)
const _fbApp = firebase.initializeApp(firebaseConfig);
const _db    = firebase.firestore(_fbApp);

// Simpan data pemain ke cloud (background, tidak blocking)
function saveToCloud(state) {
  try {
    _db.collection('players').doc(state.username).set(state)
      .catch(function(e) { console.warn('Cloud save gagal:', e); });
  } catch(e) {
    console.warn('saveToCloud error:', e);
  }
}

// Load data pemain dari cloud
async function loadFromCloud(username) {
  try {
    var snap = await _db.collection('players').doc(username).get();
    if (snap.exists) return snap.data();
    return null;
  } catch(e) {
    console.warn('loadFromCloud gagal:', e);
    return null;
  }
}

// Load semua pemain untuk leaderboard
async function loadAllPlayers() {
  try {
    var snap = await _db.collection('players').get();
    return snap.docs.map(function(d) { return d.data(); });
  } catch(e) {
    console.warn('loadAllPlayers gagal:', e);
    return [];
  }
}
