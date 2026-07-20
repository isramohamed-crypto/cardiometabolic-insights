// ── Task toggle ─────────────────────────────────────────────
document.querySelectorAll('.task-list__item').forEach(item => {
  item.addEventListener('click', () => {
    const check = item.querySelector('.task-list__check');
    const isDone = item.classList.toggle('task-list__item--done');
    if (isDone) {
      check.textContent = '✓';
      check.classList.remove('task-list__check--empty');
    } else {
      check.textContent = '';
      check.classList.add('task-list__check--empty');
    }
    updateBadge();
  });
});

function updateBadge() {
  const total    = document.querySelectorAll('.task-list__item').length;
  const done     = document.querySelectorAll('.task-list__item--done').length;
  const remaining = total - done;
  const badge = document.querySelector('.badge--blue');
  if (badge) badge.textContent = `${remaining} remaining`;
}

// ── Bottom nav active state ──────────────────────────────────
document.querySelectorAll('.bottom-nav__item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.bottom-nav__item').forEach(i => i.classList.remove('bottom-nav__item--active'));
    item.classList.add('bottom-nav__item--active');
  });
});

// ── Top nav active state ─────────────────────────────────────
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('nav__link--active'));
    link.classList.add('nav__link--active');
  });
});

// ── Watch Now reels ──────────────────────────────────────────
(function () {
  var reels = [
    { id:0, tag:'Cardiovascular', title:'Why "I feel fine" is the most dangerous thing you can say', caption:'Silent risk: high LDL and blood pressure often have no symptoms. Early screening saves lives.', views:'142K', dur:'0:58', secs:58, bg:'linear-gradient(160deg,#5c3040 0%,#8a4558 55%,#2e1820 100%)' },
    { id:1, tag:'Nutrition', title:'3-ingredient oatmeal that lowers LDL cholesterol', caption:'Beta-glucan fiber in oats binds cholesterol in the gut. Aim for ½ cup dry oats daily.', views:'89K', dur:'0:45', secs:45, bg:'linear-gradient(160deg,#2a3d30 0%,#3d6145 55%,#151f18 100%)' },
    { id:2, tag:'Cardiovascular', title:'What happens to your arteries when LDL is high', caption:'Excess LDL builds plaque inside artery walls, narrowing blood flow over years.', views:'267K', dur:'1:12', secs:72, bg:'linear-gradient(160deg,#1e2c3a 0%,#2e4258 55%,#0d151e 100%)' },
    { id:3, tag:'Movement', title:'5-minute morning walk that changes your heart health', caption:'Even light daily movement lowers resting heart rate and reduces cardiovascular events.', views:'201K', dur:'0:52', secs:52, bg:'linear-gradient(160deg,#2a3520 0%,#435530 55%,#141a0f 100%)' },
    { id:4, tag:'Metabolic', title:'Blood sugar and your heart — what the research says', caption:'High glucose damages vessel walls over time, roughly doubling cardiac risk.', views:'118K', dur:'1:05', secs:65, bg:'linear-gradient(160deg,#3a2e18 0%,#6b5228 55%,#1c1509 100%)' },
    { id:5, tag:'Stress', title:'How chronic stress raises your cardiovascular risk', caption:'Cortisol spikes increase blood pressure and inflammation — key drivers of heart disease.', views:'93K', dur:'0:41', secs:41, bg:'linear-gradient(160deg,#2d2035 0%,#4a3460 55%,#160f1c 100%)' },
    { id:6, tag:'Diagnostics', title:'Reading your lipid panel — a plain-language guide', caption:'Total cholesterol, LDL, HDL, triglycerides — what each number means for your risk.', views:'154K', dur:'1:18', secs:78, bg:'linear-gradient(160deg,#1a2e35 0%,#274858 55%,#0a161b 100%)' },
    { id:7, tag:'Nutrition', title:'Mediterranean diet basics for heart health', caption:'Rich in olive oil, fish, and legumes — this pattern cuts cardiac events by up to 30%.', views:'312K', dur:'0:55', secs:55, bg:'linear-gradient(160deg,#352a14 0%,#6b5420 55%,#1a1409 100%)' }
  ];

  var playing = false, progress = 0, timer = null, currentId = 0;

  function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function buildCarousel() {
    var el = document.getElementById('reelCarousel');
    if (!el) return;
    reels.forEach(function (r) {
      var c = document.createElement('div');
      c.className = 'reel-card';
      c.innerHTML =
        '<div class="reel-bg" style="background:' + r.bg + '">' +
          '<div class="reel-badge"><div class="reel-views"><div class="reel-play-tri-sm"></div><span>' + r.views + '</span></div></div>' +
          '<div class="reel-dur">' + r.dur + '</div>' +
          '<div class="reel-play-btn"><div class="reel-play-tri"></div></div>' +
          '<div class="reel-meta">' +
            '<div class="reel-tag">' + r.tag + '</div>' +
            '<div class="reel-title-card">' + r.title + '</div>' +
          '</div>' +
        '</div>';
      c.addEventListener('click', function () { openModal(r.id); });
      el.appendChild(c);
    });
  }

  function openModal(id) {
    currentId = id;
    var r = reels[id];
    document.getElementById('reelTitle').textContent = r.title;
    document.getElementById('reelCaption').textContent = r.caption;
    document.getElementById('reelTotalTime').textContent = r.dur;
    var bg = document.getElementById('reelModalBg');
    bg.style.background = r.bg;
    bg.style.width = '100%';
    bg.style.height = '100%';
    resetThumbVote();
    resetProgress();
    buildRelated(id);
    document.getElementById('reelModal').classList.add('open');
  }

  function buildRelated(activeId) {
    var row = document.getElementById('reelRelatedRow');
    row.innerHTML = '';
    var count = 0;
    reels.forEach(function (r) {
      if (r.id === activeId) return;
      var w = document.createElement('div');
      w.className = 'reel-related-wrap';
      w.innerHTML =
        '<div class="reel-related-thumb" style="background:' + r.bg + '">' +
          '<div class="reel-related-play"><div class="reel-play-tri-xs"></div></div>' +
          '<div class="reel-related-dur">' + r.dur + '</div>' +
        '</div>' +
        '<div class="reel-related-label">' + r.title + '</div>';
      w.addEventListener('click', function () { openModal(r.id); });
      row.appendChild(w);
      count++;
    });
    document.getElementById('reelRelatedCount').textContent = count + ' videos';
  }

  function resetProgress() {
    clearInterval(timer); timer = null; playing = false; progress = 0;
    document.getElementById('reelProgressFill').style.width = '0%';
    document.getElementById('reelCurrentTime').textContent = '0:00';
    document.getElementById('reelPlayTri').style.display = 'block';
    document.getElementById('reelPauseIcon').style.display = 'none';
  }

  function setPlayState(state) {
    playing = state;
    document.getElementById('reelPlayTri').style.display = state ? 'none' : 'block';
    document.getElementById('reelPauseIcon').style.display = state ? 'flex' : 'none';
  }

  function togglePlay() {
    var r = reels[currentId];
    if (!playing) {
      setPlayState(true);
      timer = setInterval(function () {
        progress += 100 / (r.secs * 10);
        if (progress >= 100) { progress = 100; clearInterval(timer); timer = null; setPlayState(false); }
        document.getElementById('reelProgressFill').style.width = progress + '%';
        var elapsed = Math.round((progress / 100) * r.secs);
        var m = Math.floor(elapsed / 60), s = elapsed % 60;
        document.getElementById('reelCurrentTime').textContent = m + ':' + (s < 10 ? '0' : '') + s;
      }, 100);
    } else {
      clearInterval(timer); timer = null; setPlayState(false);
    }
  }

  function resetThumbVote() {
    document.getElementById('reelThumbUp').classList.remove('active');
    document.getElementById('reelThumbDown').classList.remove('active');
  }

  document.getElementById('reelPlay').addEventListener('click', togglePlay);

  document.getElementById('reelProgressBar').addEventListener('click', function (e) {
    var rect = this.getBoundingClientRect();
    var pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    progress = pct;
    document.getElementById('reelProgressFill').style.width = pct + '%';
    var r = reels[currentId];
    var elapsed = Math.round((pct / 100) * r.secs);
    var m = Math.floor(elapsed / 60), s = elapsed % 60;
    document.getElementById('reelCurrentTime').textContent = m + ':' + (s < 10 ? '0' : '') + s;
  });

  document.getElementById('reelClose').addEventListener('click', function () {
    clearInterval(timer); timer = null; playing = false;
    document.getElementById('reelModal').classList.remove('open');
  });

  document.getElementById('reelThumbUp').addEventListener('click', function () {
    var wasActive = this.classList.contains('active');
    resetThumbVote();
    if (!wasActive) { this.classList.add('active'); showToast('Got it — more like this'); }
  });

  document.getElementById('reelThumbDown').addEventListener('click', function () {
    var wasActive = this.classList.contains('active');
    resetThumbVote();
    if (!wasActive) { this.classList.add('active'); showToast('Got it — we\'ll show less of this'); }
  });

  document.getElementById('reelShare').addEventListener('click', function () { showToast('Link copied'); });
  document.getElementById('reelSave').addEventListener('click', function () { showToast('Saved to your reels'); });
  document.getElementById('savedLink').addEventListener('click', function (e) { e.preventDefault(); showToast('Opening saved reels…'); });

  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('chip--active'); });
      chip.classList.add('chip--active');
    });
  });

  buildCarousel();
})();
