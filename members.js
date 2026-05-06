const MEMBERS = [
  // TEAM LOVE
  { id:'love01', name:'Alya Amanda', team:'love', img_closed:'assets/closed/love01.jpg', img_open:'assets/open/love01.jpg' },
  { id:'love02', name:'Anindya Ramadhani', team:'love', img_closed:'assets/closed/love02.jpg', img_open:'assets/open/love02.jpg' },
  { id:'love03', name:'Aurellia', team:'love', img_closed:'assets/closed/love03.jpg', img_open:'assets/open/love03.jpg' },
  { id:'love04', name:'Aurhel Alana', team:'love', img_closed:'assets/closed/love04.jpg', img_open:'assets/open/love04.jpg' },
  { id:'love05', name:'Cathleen Nixie', team:'love', img_closed:'assets/closed/love05.jpg', img_open:'assets/open/love05.jpg' },
  { id:'love06', name:'Celline Thefani', team:'love', img_closed:'assets/closed/love06.jpg', img_open:'assets/open/love06.jpg' },
  { id:'love07', name:'Cynthia Yaputera', team:'love', img_closed:'assets/closed/love07.jpg', img_open:'assets/open/love07.jpg' },
  { id:'love08', name:'Fiony Alveria', team:'love', img_closed:'assets/closed/love08.jpg', img_open:'assets/open/love08.jpg' },
  { id:'love09', name:'Fritzy Rosmerian', team:'love', img_closed:'assets/closed/love09.jpg', img_open:'assets/open/love09.jpg' },
  { id:'love10', name:'Grace Octaviani', team:'love', img_closed:'assets/closed/love10.jpg', img_open:'assets/open/love10.jpg' },
  { id:'love11', name:'Hillary Abigail', team:'love', img_closed:'assets/closed/love11.jpg', img_open:'assets/open/love11.jpg' },
  { id:'love12', name:'Indah Cahya', team:'love', img_closed:'assets/closed/love12.jpg', img_open:'assets/open/love12.jpg' },
  { id:'love13', name:'Jazzlyn Trisha', team:'love', img_closed:'assets/closed/love13.jpg', img_open:'assets/open/love13.jpg' },
  { id:'love14', name:'Michelle Alexandra', team:'love', img_closed:'assets/closed/love14.jpg', img_open:'assets/open/love14.jpg' },
  { id:'love15', name:'Nayla Suji', team:'love', img_closed:'assets/closed/love15.jpg', img_open:'assets/open/love15.jpg' },
  // TEAM DREAM
  { id:'drm01', name:'Adeline Wijaya', team:'dream', img_closed:'assets/closed/drm01.jpg', img_open:'assets/open/drm01.jpg' },
  { id:'drm02', name:'Chelsea Davina', team:'dream', img_closed:'assets/closed/drm02.jpg', img_open:'assets/open/drm02.jpg' },
  { id:'drm03', name:'Febriola Sinambela', team:'dream', img_closed:'assets/closed/drm03.jpg', img_open:'assets/open/drm03.jpg' },
  { id:'drm04', name:'Freya Jayawardhana', team:'dream', img_closed:'assets/closed/drm04.jpg', img_open:'assets/open/drm04.jpg' },
  { id:'drm05', name:'Gabriela Abigail', team:'dream', img_closed:'assets/closed/drm05.jpg', img_open:'assets/open/drm05.jpg' },
  { id:'drm06', name:'Gendis Mayrannisa', team:'dream', img_closed:'assets/closed/drm06.jpg', img_open:'assets/open/drm06.jpg' },
  { id:'drm07', name:'Gita Sekar Andarini', team:'dream', img_closed:'assets/closed/drm07.jpg', img_open:'assets/open/drm07.jpg' },
  { id:'drm08', name:'Greesella Adhalia', team:'dream', img_closed:'assets/closed/drm08.jpg', img_open:'assets/open/drm08.jpg' },
  { id:'drm09', name:'Helisma Putri', team:'dream', img_closed:'assets/closed/drm09.jpg', img_open:'assets/open/drm09.jpg' },
  { id:'drm10', name:'Jesslyn Elly', team:'dream', img_closed:'assets/closed/drm10.jpg', img_open:'assets/open/drm10.jpg' },
  { id:'drm11', name:'Marsha Lenathea', team:'dream', img_closed:'assets/closed/drm11.jpg', img_open:'assets/open/drm11.jpg' },
  { id:'drm12', name:'Nina Tutachia', team:'dream', img_closed:'assets/closed/drm12.jpg', img_open:'assets/open/drm12.jpg' },
  { id:'drm13', name:'Oline Manuel', team:'dream', img_closed:'assets/closed/drm13.jpg', img_open:'assets/open/drm13.jpg' },
  { id:'drm14', name:'Shabilqis Naila', team:'dream', img_closed:'assets/closed/drm14.jpg', img_open:'assets/open/drm14.jpg' },
  { id:'drm15', name:'All Member Dream', team:'dream', img_closed:'assets/closed/drm15.jpg', img_open:'assets/open/drm15.jpg' },
  // TEAM PASSION
  { id:'pas01', name:'Abigail Rachel', team:'passion', img_closed:'assets/closed/pas01.jpg', img_open:'assets/open/pas01.jpg' },
  { id:'pas02', name:'Angelina Christy', team:'passion', img_closed:'assets/closed/pas02.jpg', img_open:'assets/open/pas02.jpg' },
  { id:'pas03', name:'Catherina Vallencia', team:'passion', img_closed:'assets/closed/pas03.jpg', img_open:'assets/open/pas03.jpg' },
  { id:'pas04', name:'Cornelia Vanisa', team:'passion', img_closed:'assets/closed/pas04.jpg', img_open:'assets/open/pas04.jpg' },
  { id:'pas05', name:'Dena Natalia', team:'passion', img_closed:'assets/closed/pas05.jpg', img_open:'assets/open/pas05.jpg' },
  { id:'pas06', name:'Desy Natalia', team:'passion', img_closed:'assets/closed/pas06.jpg', img_open:'assets/open/pas06.jpg' },
  { id:'pas07', name:'Feni Fitriyanti', team:'passion', img_closed:'assets/closed/pas07.jpg', img_open:'assets/open/pas07.jpg' },
  { id:'pas08', name:'Jessica Chandra', team:'passion', img_closed:'assets/closed/pas08.jpg', img_open:'assets/open/pas08.jpg' },
  { id:'pas09', name:'Kathrina Irene', team:'passion', img_closed:'assets/closed/pas09.jpg', img_open:'assets/open/pas09.jpg' },
  { id:'pas10', name:'Lulu Salsabila', team:'passion', img_closed:'assets/closed/pas10.jpg', img_open:'assets/open/pas10.jpg' },
  { id:'pas11', name:'Michelle Levia', team:'passion', img_closed:'assets/closed/pas11.jpg', img_open:'assets/open/pas11.jpg' },
  { id:'pas12', name:'Mutiara Azzahra', team:'passion', img_closed:'assets/closed/pas12.jpg', img_open:'assets/open/pas12.jpg' },
  { id:'pas13', name:'Raisha Syifa', team:'passion', img_closed:'assets/closed/pas13.jpg', img_open:'assets/open/pas13.jpg' },
  { id:'pas14', name:'Ribka Budiman', team:'passion', img_closed:'assets/closed/pas14.jpg', img_open:'assets/open/pas14.jpg' },
  { id:'pas15', name:'Victoria Kimberly', team:'passion', img_closed:'assets/closed/pas15.jpg', img_open:'assets/open/pas15.jpg' },
];

const TEAM_LABEL = {
  love: 'Team Love',
  dream: 'Team Dream',
  passion: 'Team Passion',
};

const TEAM_COLOR = {
  love: '#FF69B4',
  dream: '#1E88E5',
  passion: '#FF6D00',
};

function imgC(m) {
  // SEMUA kartu tertutup pakai gambar card-back.jpg yang sama
  return 'assets/closed/card-back.jpg';
}

function imgO(m) {
  return m.img_open || `https://placehold.co/180x250/${TEAM_COLOR[m.team].replace('#', '')}/fff?text=${encodeURIComponent(m.name.split(' ')[0])}`;
}
