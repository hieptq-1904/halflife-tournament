const teams = [
  {
    name: 'Smurf Legion',
    image: 'assets/team-1.png',
    logo: 'assets/team-logo-1.png',
    detailUrl: '#teams/smurf-legion',
    slogan: 'Born to dominate',
    members: ['Vũ Đình Cường', 'Hàn Văn Huy', 'Nguyễn Đức Việt'],
  },
  {
    name: 'Infinity',
    image: 'assets/team-2.png',
    logo: 'assets/team-logo-2.png',
    detailUrl: '#teams/infinity',
    slogan: 'No Pain, No gain',
    members: ['Trần Văn Mỹ', 'Nguyễn Mạnh Tiến', 'Nguyễn Thanh Long'],
  },
  {
    name: 'HTS',
    image: 'assets/team-3.png',
    logo: 'assets/team-logo-3.png',
    detailUrl: '#teams/hts',
    slogan: 'One Tap, No Talk',
    members: ['Lê Văn Hội', 'Nguyễn Văn Thành', 'Nguyễn Đình Phước Sơn'],
  },
  {
    name: '404',
    image: 'assets/team-4.png',
    logo: 'assets/team-logo-4.png',
    detailUrl: '#teams/404',
    slogan: 'No Trace',
    members: ['Đồng Xuân Đông', 'Nguyễn Công Khanh', 'Bùi Hữu Thắng'],
  },
  {
    name: 'Bụi 3',
    image: 'assets/team-5.png',
    logo: 'assets/team-logo-5.png',
    detailUrl: '#teams/bui-3',
    slogan: 'Sinh ra để cầm súng',
    members: ['Hoàng Việt An', 'Vũ Việt Anh', 'Trần Quang Hiệp'],
  },
];

const AUTOPLAY_MS = 3000;
const TEAM_ANIM_OUT_MS = 350;
const TEAM_ANIM_IN_MS = 550;
const TEAMS_SLIDE_MS = 550;

const slides = [
  {
    bg: 'https://plus.unsplash.com/premium_photo-1661901234139-d833950e05e0?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://plus.unsplash.com/premium_photo-1661901234139-d833950e05e0?q=80&w=500&auto=format&fit=crop',
    alt: 'Tactical military equipment',
    border: 'blue',
  },
  {
    bg: 'https://images.unsplash.com/photo-1569242840510-9fe6f0112cee?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1569242840510-9fe6f0112cee?q=80&w=500&auto=format&fit=crop',
    alt: 'Soldiers in tactical gear',
    border: 'cyan',
  },
  {
    bg: 'https://images.unsplash.com/photo-1571795184552-5f1df723de54?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1571795184552-5f1df723de54?q=80&w=500&auto=format&fit=crop',
    alt: 'Soldiers in military transport',
    border: 'orange',
  },
  {
    bg: 'https://images.unsplash.com/photo-1500252185289-40ca85eb23a7?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1500252185289-40ca85eb23a7?q=80&w=500&auto=format&fit=crop',
    alt: 'Fighter jets in formation',
    border: 'blue',
  },
  {
    bg: 'https://images.unsplash.com/photo-1595472968262-48209bf5b390?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1595472968262-48209bf5b390?q=80&w=500&auto=format&fit=crop',
    alt: 'Soldier with assault rifle',
    border: 'cyan',
  },
];

const bgEl = document.querySelector('.hero__bg-image');
const carousel = document.getElementById('carousel');
const trackEl = document.querySelector('.carousel__track');
const teamFrameEl = document.getElementById('teamImageTrigger');
const teamLightboxEl = document.getElementById('teamLightbox');
const lightboxImageEl = document.querySelector('.lightbox__image');
const lightboxCaptionEl = document.getElementById('lightbox-caption');
const teamImageEl = document.querySelector('.team-showcase__image');
const teamNameEl = document.querySelector('.team-showcase__name');
const teamLogoEl = document.querySelector('.team-showcase__logo');
const teamDetailsEl = document.querySelector('.team-showcase__details');
const teamDetailBtn = document.querySelector('.team-showcase__btn');
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');

let teamsSliderControl = null;
let slideEls = [];
let current = 0;
let autoplayTimer = null;
let autoplayPauseCount = 0;

function pauseAutoplay() {
  autoplayPauseCount += 1;
  if (autoplayPauseCount === 1) stopAutoplay();
}

function resumeAutoplay() {
  autoplayPauseCount = Math.max(0, autoplayPauseCount - 1);
  if (autoplayPauseCount === 0) startAutoplay();
}

function bindPauseOnHover(el) {
  if (!el) return;
  el.addEventListener('mouseenter', pauseAutoplay);
  el.addEventListener('mouseleave', resumeAutoplay);
}

function updateCarousel() {
  slideEls.forEach((slide, i) => {
    const isActive = i === current;
    slide.classList.toggle('is-active', isActive);
    slide.style.zIndex = isActive ? 20 : i + 1;
  });

  if (bgEl && slides[current]) {
    bgEl.style.backgroundImage = `url('${slides[current].bg}')`;
  }
}

function renderTeam(index, skipExit = false) {
  const team = teams[index];
  if (!team || !teamImageEl || !teamNameEl || !teamDetailsEl || !teamDetailBtn) return;

  const playEnter = () => {
    teamImageEl.src = team.image;
    teamImageEl.alt = `${team.name} team banner`;
    teamNameEl.textContent = team.name;
    if (teamLogoEl) {
      if (team.logo) {
        teamLogoEl.src = team.logo;
        teamLogoEl.alt = `${team.name} team logo`;
        teamLogoEl.hidden = false;
      } else {
        teamLogoEl.hidden = true;
        teamLogoEl.removeAttribute('src');
      }
    }
    teamDetailBtn.href = '#teams';
    teamImageEl.classList.remove('is-fading');

    teamDetailsEl.classList.remove('is-sliding-out', 'is-sliding-in');
    void teamDetailsEl.offsetWidth;
    teamDetailsEl.classList.add('is-sliding-in');

    window.setTimeout(() => {
      teamDetailsEl.classList.remove('is-sliding-in');
    }, TEAM_ANIM_IN_MS + 150);
  };

  if (skipExit) {
    playEnter();
    return;
  }

  teamImageEl.classList.add('is-fading');
  teamDetailsEl.classList.remove('is-sliding-in');
  teamDetailsEl.classList.add('is-sliding-out');

  window.setTimeout(() => {
    teamDetailsEl.classList.remove('is-sliding-out');
    playEnter();
  }, TEAM_ANIM_OUT_MS);
}

function goTo(index, skipExit = false) {
  current = ((index % slides.length) + slides.length) % slides.length;
  updateCarousel();
  renderTeam(current, skipExit);
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    goTo(current + 1);
  }, AUTOPLAY_MS);
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

function buildCarousel() {
  if (!trackEl) return;

  trackEl.innerHTML = slides.map((slide, index) => {
    const team = teams[index];
    return `
    <button
      class="carousel__slide"
      data-index="${index}"
      data-border="${slide.border}"
      aria-label="Slide ${index + 1}: ${team?.name || slide.alt}"
      style="z-index: ${index + 1}"
    >
      <div class="slide-card slide-card--${slide.border}">
        <div class="slide-card__border">
          <div class="slide-card__image">
            <img loading="lazy" src="${team?.image || slide.thumb}" alt="${team?.name || slide.alt}" />
          </div>
        </div>
      </div>
    </button>
  `;
  }).join('');

  slideEls = document.querySelectorAll('.carousel__slide');

  slideEls.forEach((slide) => {
    slide.addEventListener('click', () => {
      goTo(parseInt(slide.dataset.index, 10));
      startAutoplay();
    });
  });
}

bindPauseOnHover(teamFrameEl);
bindPauseOnHover(teamDetailBtn);

let lightboxResumeFn = null;

function openTeamLightbox(teamIndex, useLogo = false) {
  const team = teams[teamIndex];
  if (!team || !teamLightboxEl || !lightboxImageEl || !lightboxCaptionEl) return;

  const imageSrc = useLogo && team.logo ? team.logo : team.image;
  lightboxImageEl.src = imageSrc;
  lightboxImageEl.alt = `${team.name} ${useLogo ? 'team logo' : 'team image'}`;
  lightboxCaptionEl.textContent = team.name;
  teamLightboxEl.hidden = false;
  teamLightboxEl.classList.add('is-open');
  teamLightboxEl.classList.toggle('is-logo-view', useLogo && !!team.logo);
  lightboxImageEl.classList.toggle('lightbox__image--logo', useLogo && !!team.logo);
}

function closeTeamLightbox() {
  if (!teamLightboxEl) return;

  teamLightboxEl.classList.remove('is-open');
  teamLightboxEl.classList.remove('is-logo-view');

  if (lightboxResumeFn) {
    lightboxResumeFn();
    lightboxResumeFn = null;
  }

  window.setTimeout(() => {
    if (!teamLightboxEl.classList.contains('is-open')) {
      teamLightboxEl.hidden = true;
      if (lightboxImageEl) {
        lightboxImageEl.src = '';
        lightboxImageEl.classList.remove('lightbox__image--logo');
      }
    }
  }, 0);
}

function openTeamLightboxWithPause(teamIndex, pauseFn, resumeFn, useLogo = false) {
  lightboxResumeFn = resumeFn;
  pauseFn();
  openTeamLightbox(teamIndex, useLogo);
}

initTeamLightbox();

function initTeamLightbox() {
  if (!teamFrameEl || !teamLightboxEl) return;

  const closeTriggers = teamLightboxEl.querySelectorAll('[data-close-lightbox]');

  teamFrameEl.addEventListener('click', () => {
    openTeamLightboxWithPause(current, pauseAutoplay, resumeAutoplay);
  });

  closeTriggers.forEach((el) => {
    el.addEventListener('click', closeTeamLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && teamLightboxEl.classList.contains('is-open')) {
      closeTeamLightbox();
    }
  });
}

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

document.querySelectorAll('.nav__links a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

buildCarousel();
goTo(0, true);
startAutoplay();
initTeamsSlider();
initHeroViewDetail();
let openSubmitPopup = null;

initGiftVideoPopup();
initSubmitPopup();
initRegisterForm();
initNavSpy();
initCountdown();

const PLAYER_PLACEHOLDER = 'assets/team-placeholder.svg';

function getPlayerImage(fullName) {
  return `assets/players/${encodeURIComponent(fullName)}.png`;
}

const playersByRank = [
  {
    rank: 'S',
    desc: 'The most elite warriors.',
    players: [
      {
        ingame: 'Dong Tien Sinh',
        fullName: 'Đồng Xuân Đông',
        slogan: 'Bôi xấu đối thủ, ngủ với đối tác',
        intro: 'Vũ Điệu Tử Thần',
        stats: { skill: 5, tactics: 1, luck: 2, stealth: 2 },
      },
      {
        ingame: 'Hoi Le',
        fullName: 'Lê Văn Hội',
        slogan: 'N/A',
        intro: 'N/A',
        stats: { skill: 4, tactics: 3, luck: 2, stealth: 2 },
      },
      {
        ingame: 'zT_Tz',
        fullName: 'Vũ Đình Cường',
        slogan: 'Nỗi sợ hãi của đối thủ là niềm vui của bản thân.',
        intro: 'Cao bồi miền Tây, bắn súng 2 tay, xì gà hút ngược.',
        stats: { skill: 4, tactics: 2, luck: 3, stealth: 3 },
      },
      {
        ingame: 'Thanh',
        fullName: 'Nguyễn Văn Thành',
        slogan: 'Just Thanh',
        intro: 'N/A',
        stats: { skill: 4, tactics: 2, luck: 2, stealth: 2 },
      },
    ],
  },
  {
    rank: 'A',
    desc: 'The most dependable right-hands.',
    players: [
      {
        ingame: 'TH True milk',
        fullName: 'Hàn Văn Huy',
        slogan: 'Anh em vui vẻ là được',
        intro: 'Bảng thành tính ấn tượng, chuyên gia bán độ. Ai có yêu cầu xin in bóc riêng nhá =))',
        stats: { skill: 4, tactics: 1, luck: 2, stealth: 3 },
      },
      {
        ingame: 'loc coc',
        fullName: 'Hoàng Việt An',
        slogan: 'Hiding....',
        intro: 'Đố anh bắt được em',
        stats: { skill: 3, tactics: 5, luck: 2, stealth: 5 },
      },
      {
        ingame: 'Titanic',
        fullName: 'Nguyễn Công Khanh',
        slogan: 'Đi Tìm Niềm Vui',
        intro: 'N/A',
        stats: { skill: 4, tactics: 3, luck: 2, stealth: 4 },
      },
      {
        ingame: 'Doan Chi Binh',
        fullName: 'Trần Văn Mỹ',
        slogan: 'Một phát vào đầu, bay màu trận đấu',
        intro: 'Đơn giản là Pro',
        stats: { skill: 3, tactics: 3, luck: 2, stealth: 4 },
      },
    ],
  },
  {
    rank: 'B',
    desc: 'The silent warriors.',
    players: [
      {
        ingame: 'Khoi',
        fullName: 'Vũ Việt Anh',
        slogan: 'Cầm súng và bắn như một người Hải Phòng "gốc"',
        intro: 'Vua trò chơi',
        stats: { skill: 3, tactics: 3, luck: 2, stealth: 3 },
      },
      {
        ingame: 'Wick',
        fullName: 'Nguyễn Mạnh Tiến',
        slogan: 'N/A',
        intro: 'N/A',
        stats: { skill: 3, tactics: 3, luck: 2, stealth: 3 },
      },
      {
        ingame: 'Bach_ho',
        fullName: 'Nguyễn Đức Việt',
        slogan: 'Đến là đón',
        intro: 'Thích va chạm',
        stats: { skill: 3, tactics: 2, luck: 2, stealth: 3 },
      },
      {
        ingame: 'Tabu',
        fullName: 'Bùi Hữu Thắng',
        slogan: 'Cục ta cục tác',
        intro: 'Bắn không thua ai nhưng gáy phải promax',
        stats: { skill: 3, tactics: 2, luck: 4, stealth: 3 },
      },
    ],
  },
  {
    rank: 'C',
    desc: 'The suicide bomb carriers.',
    players: [
      {
        ingame: 'RongXanh',
        fullName: 'Nguyễn Thanh Long',
        slogan: 'Rồng Xanh khạc lửa – Sấy ngửa kẻ thù',
        intro: 'Rồng Xanh xứ Nghệ - Chất Nghệ kiên cường, sấy nát mọi chiến trường',
        stats: { skill: 2, tactics: 1, luck: 3, stealth: 3 },
      },
      {
        ingame: 'Nguoi Viet Trym Tay',
        fullName: 'Trần Quang Hiệp',
        slogan: 'One Shoot - One Kill',
        intro: 'Trym to không lo chết đói',
        stats: { skill: 2, tactics: 3, luck: 2, stealth: 4 },
      },
      {
        ingame: 'Son_Chip_chip',
        fullName: 'Nguyễn Đình Phước Sơn',
        slogan: 'Quota 5 phút',
        intro: 'Đẹp trai siêu cấp vũ trụ',
        stats: { skill: 2, tactics: 1, luck: 5, stealth: 3 },
      },
    ],
  },
];

const playerRadarStats = playersByRank.reduce((acc, rank) => {
  rank.players.forEach((player) => {
    acc[player.ingame] = player.stats;
  });
  return acc;
}, {});

function formatPlayerSlogan(slogan) {
  if (!slogan || slogan === 'N/A') return 'N/A';
  return `"${slogan}"`;
}

function renderPlayerCard(player) {
  const avatar = getPlayerImage(player.fullName);
  const slogan = formatPlayerSlogan(player.slogan);
  const intro = player.intro === 'N/A' ? 'N/A' : player.intro;

  return `
    <article class="player-card">
      <div class="player-card__avatar-wrap">
        <img src="${avatar}" alt="${player.ingame} avatar" class="player-card__avatar" loading="lazy" onerror="this.onerror=null;this.src='${PLAYER_PLACEHOLDER}'" />
        <div class="player-card__tooltip">
          <div class="player-card__tooltip-image">
            <img src="${avatar}" alt="${player.ingame} profile" loading="lazy" onerror="this.onerror=null;this.src='${PLAYER_PLACEHOLDER}'" />
          </div>
          <div class="player-card__tooltip-info">
            <p class="player-card__tooltip-name">${player.fullName}</p>
            <p class="player-card__tooltip-nick">${player.ingame}</p>
            <p class="player-card__tooltip-slogan">${slogan}</p>
            <p class="player-card__tooltip-intro">${intro}</p>
          </div>
        </div>
      </div>
      <p class="player-card__nick">${player.ingame}</p>
    </article>
  `;
}

function renderPlayersRank(rankData) {
  const badgeClass = `players-rank__badge--${rankData.rank.toLowerCase()}`;

  const gridClass = rankData.players.length < 4
    ? 'players-grid players-grid--centered'
    : 'players-grid';

  return `
    <section class="players-rank">
      <header class="players-rank__header">
        <span class="players-rank__badge ${badgeClass}">RANK ${rankData.rank}</span>
        <p class="players-rank__desc">${rankData.desc}</p>
      </header>
      <div class="${gridClass}">
        ${rankData.players.map(renderPlayerCard).join('')}
      </div>
    </section>
  `;
}

function initPlayersSection() {
  const container = document.getElementById('playersRanks');
  if (!container) return;

  container.innerHTML = playersByRank.map(renderPlayersRank).join('');
}

const PLAYER_RADAR_LABELS = ['Skill', 'Tactics', 'Luck', 'Hiding'];
const PLAYER_RADAR_KEYS = ['skill', 'tactics', 'luck', 'stealth'];
const PLAYER_RADAR_MAX = 5;

function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function buildPlayerRadarSvg(stats) {
  const size = 190;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.31;
  const axisCount = PLAYER_RADAR_KEYS.length;
  const angles = PLAYER_RADAR_KEYS.map((_, i) => (360 / axisCount) * i);

  let grid = '';
  for (let level = 1; level <= PLAYER_RADAR_MAX; level += 1) {
    const r = (maxR * level) / PLAYER_RADAR_MAX;
    const points = angles
      .map((angle) => {
        const point = polarToCartesian(cx, cy, r, angle);
        return `${point.x},${point.y}`;
      })
      .join(' ');
    grid += `<polygon points="${points}" class="player-radar__grid" />`;
  }

  let axes = '';
  angles.forEach((angle) => {
    const point = polarToCartesian(cx, cy, maxR, angle);
    axes += `<line x1="${cx}" y1="${cy}" x2="${point.x}" y2="${point.y}" class="player-radar__axis" />`;
  });

  const dataPoints = PLAYER_RADAR_KEYS.map((key, index) => {
    const value = Math.min(PLAYER_RADAR_MAX, Math.max(1, stats[key] ?? 1));
    const r = (maxR * value) / PLAYER_RADAR_MAX;
    return polarToCartesian(cx, cy, r, angles[index]);
  });
  const dataPoly = dataPoints.map((point) => `${point.x},${point.y}`).join(' ');

  let dots = '';
  dataPoints.forEach((point) => {
    dots += `<circle cx="${point.x}" cy="${point.y}" r="3" class="player-radar__dot" />`;
  });

  let labels = '';
  PLAYER_RADAR_LABELS.forEach((label, index) => {
    const point = polarToCartesian(cx, cy, maxR + 18, angles[index]);
    const anchor = index === 1 ? 'start' : index === 3 ? 'end' : 'middle';
    labels += `<text x="${point.x}" y="${point.y}" class="player-radar__label" text-anchor="${anchor}" dominant-baseline="middle">${label}</text>`;
  });

  return `
    <svg class="player-radar" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Player stats radar chart">
      ${grid}
      ${axes}
      <polygon points="${dataPoly}" class="player-radar__shape" />
      ${dots}
      ${labels}
    </svg>
  `;
}

function initPlayerRadarCharts() {
  document.querySelectorAll('.player-card__tooltip').forEach((tooltip) => {
    const nick = tooltip.querySelector('.player-card__tooltip-nick')?.textContent.trim();
    const stats = nick ? playerRadarStats[nick] : null;
    if (!stats) return;

    const infoEl = tooltip.querySelector('.player-card__tooltip-info');
    if (!infoEl || tooltip.querySelector('.player-card__tooltip-chart')) return;

    const chartEl = document.createElement('div');
    chartEl.className = 'player-card__tooltip-chart';
    chartEl.innerHTML = buildPlayerRadarSvg(stats);
    tooltip.appendChild(chartEl);
  });
}

initPlayersSection();
initPlayerRadarCharts();

const tournamentGroupRounds = [
  {
    round: 1,
    date: '24/06/2026',
    leg: 'First Leg',
    matches: [
      { home: 'Smurf Legion', away: '404', score: { home: 2, away: 0 } },
      { home: 'Infinity', away: 'Bụi 3' },
    ],
    skip: 'HTS',
  },
  {
    round: 2,
    date: '25/06/2026',
    leg: 'First Leg',
    matches: [
      { home: 'Bụi 3', away: 'Smurf Legion' },
      { home: '404', away: 'Infinity' },
    ],
    skip: 'HTS',
  },
  {
    round: 3,
    date: '26/06/2026',
    leg: 'First Leg',
    matches: [
      { home: '404', away: 'Bụi 3' },
      { home: 'Smurf Legion', away: 'Infinity' },
    ],
    skip: 'HTS',
  },
  {
    round: 4,
    date: '29/06/2026',
    leg: 'First Leg',
    matches: [
      { home: 'Bụi 3', away: 'HTS' },
      { home: 'Infinity', away: 'HTS' },
    ],
    skip: 'Smurf Legion, 404',
  },
  {
    round: 5,
    date: '30/06/2026',
    leg: 'First Leg',
    matches: [
      { home: 'HTS', away: 'Smurf Legion' },
      { home: 'HTS', away: '404' },
    ],
    skip: 'Infinity, Bụi 3',
  },
  {
    round: 6,
    date: '01/07/2026',
    leg: 'Return Leg',
    matches: [
      { home: '404', away: 'Smurf Legion' },
      { home: 'Bụi 3', away: 'Infinity' },
    ],
    skip: 'HTS',
  },
  {
    round: 7,
    date: '02/07/2026',
    leg: 'Return Leg',
    matches: [
      { home: 'Smurf Legion', away: 'HTS' },
      { home: 'Infinity', away: '404' },
    ],
    skip: 'Bụi 3',
  },
  {
    round: 8,
    date: '03/07/2026',
    leg: 'Return Leg',
    matches: [
      { home: 'HTS', away: 'Bụi 3' },
      { home: 'Infinity', away: 'Smurf Legion' },
    ],
    skip: '404',
  },
  {
    round: 9,
    date: '06/07/2026',
    leg: 'Return Leg',
    matches: [
      { home: 'Bụi 3', away: '404' },
      { home: 'HTS', away: 'Infinity' },
    ],
    skip: 'Smurf Legion',
  },
  {
    round: 10,
    date: '07/07/2026',
    leg: 'Return Leg',
    matches: [
      { home: 'Smurf Legion', away: 'Bụi 3' },
      { home: '404', away: 'HTS' },
    ],
    skip: 'Infinity',
  },
];

const tournamentTeamByName = Object.fromEntries(teams.map((team) => [team.name, team]));

function renderTournamentTeamSide(teamName, side) {
  const team = tournamentTeamByName[teamName];
  const logoHtml = team?.logo
    ? `<img class="match__team-logo" src="${team.logo}" alt="" loading="lazy" />`
    : '';
  const nameHtml = `<span class="match__team-name">${teamName}</span>`;
  const content = side === 'home' ? `${nameHtml}${logoHtml}` : `${logoHtml}${nameHtml}`;

  return `
    <div class="match__side match__side--${side}">
      ${content}
    </div>
  `;
}

function renderTournamentSkipTeams(skipText) {
  return skipText
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => {
      const team = tournamentTeamByName[name];
      const logoHtml = team?.logo
        ? `<img class="match__team-logo" src="${team.logo}" alt="" loading="lazy" />`
        : '';

      return `<span class="match__skip-team"><span class="match__team-name">${name}</span>${logoHtml}</span>`;
    })
    .join('');
}

function renderTournamentRound(roundData) {
  const matchesHtml = roundData.matches
    .map((match) => {
      const hasScore = Boolean(match.score);
      const homeScore = hasScore ? Number(match.score.home) : null;
      const awayScore = hasScore ? Number(match.score.away) : null;
      const homeIsWinner = hasScore && homeScore > awayScore;
      const awayIsWinner = hasScore && awayScore > homeScore;

      return `
        <div class="match match--group${hasScore ? ' match--has-result' : ''}">
          <div class="match__row">
            ${renderTournamentTeamSide(match.home, `home${homeIsWinner ? ' match__side--winner' : awayIsWinner ? ' match__side--loser' : ''}`)}
            <span class="match__vs">VS</span>
            ${renderTournamentTeamSide(match.away, `away${awayIsWinner ? ' match__side--winner' : homeIsWinner ? ' match__side--loser' : ''}`)}
          </div>
          ${
            hasScore
              ? `<div class="match__result" aria-label="Result ${homeScore} to ${awayScore}">
                   <span class="match__result-score">${homeScore}&nbsp;-&nbsp;${awayScore}</span>
                 </div>`
              : ''
          }
        </div>
      `;
    })
    .join('');

  const skipHtml = roundData.skip ? `
    <div class="match match--group match--bye">
      <div class="match__skip-teams">${renderTournamentSkipTeams(roundData.skip)}</div>
      <span class="match__skip-divider" aria-hidden="true"></span>
      <span class="match__vs">SKIP</span>
    </div>
  ` : '';

  return `
    <article class="tournament-round" role="listitem">
      <header class="tournament-round__meta">
        <span class="tournament-round__badge">ROUND ${roundData.round}</span>
        <span class="tournament-round__date">${roundData.date}</span>
        <span class="tournament-round__time">${roundData.leg}</span>
      </header>
      <div class="tournament-round__matches">
        ${matchesHtml}
        ${skipHtml}
      </div>
    </article>
  `;
}

function initTournamentChart() {
  const grid = document.getElementById('tournamentGroupGrid');
  if (!grid) return;

  grid.innerHTML = tournamentGroupRounds.map(renderTournamentRound).join('');
}

initTournamentChart();

const leaderboardRows = [
  { rank: 1, team: 'Smurf Legion', win: 1, lose: 0, gw: 2, gl: 0, hs: 2 },
  { rank: 2, team: 'Infinity', win: 0, lose: 0, gw: 0, gl: 0, hs: 0 },
  { rank: 3, team: 'HTS', win: 0, lose: 0, gw: 0, gl: 0, hs: 0 },
  { rank: 4, team: 'Bụi 3', win: 0, lose: 0, gw: 0, gl: 0, hs: 0 },
  { rank: 5, team: '404', win: 0, lose: 1, gw: 0, gl: 2, hs: -2 },
];

function classForHsValue(value) {
  if (value > 0) return 'leaderboard-table__cell--pos';
  if (value < 0) return 'leaderboard-table__cell--neg';
  return 'leaderboard-table__cell--zero';
}

function initLeaderboard() {
  const body = document.getElementById('leaderboardBody');
  if (!body) return;

  const sorted = [...leaderboardRows].sort((a, b) => a.rank - b.rank);
  body.innerHTML = sorted
    .map((row) => {
      const topClass = row.rank === 1 ? ' leaderboard-table__row--top' : '';
      const hsClass = classForHsValue(row.hs);
      const team = tournamentTeamByName[row.team];
      const logoHtml = team?.logo
        ? `<img class="leaderboard-table__team-logo" src="${team.logo}" alt="" loading="lazy" />`
        : '';
      return `
        <tr class="leaderboard-table__row${topClass}">
          <td class="leaderboard-table__td leaderboard-table__td--rank">
            <span class="leaderboard-table__rank-badge">${row.rank}</span>
          </td>
          <td class="leaderboard-table__td leaderboard-table__td--team">
            <span class="leaderboard-table__team">
              ${logoHtml}
              ${row.team}
            </span>
          </td>
          <td class="leaderboard-table__td">${row.win}</td>
          <td class="leaderboard-table__td">${row.lose}</td>
          <td class="leaderboard-table__td">${row.gw}</td>
          <td class="leaderboard-table__td">${row.gl}</td>
          <td class="leaderboard-table__td ${hsClass}">${row.hs}</td>
        </tr>
      `;
    })
    .join('');
}

initLeaderboard();

function initRegisterForm() {
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('registerSubmitBtn');
  const nameInput = document.getElementById('registerName');
  const emailInput = document.getElementById('registerEmail');
  const nameError = document.getElementById('registerNameError');
  const emailError = document.getElementById('registerEmailError');

  if (!form || !submitBtn || !nameInput || !emailInput || !nameError || !emailError) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(input, errorEl, message) {
    input.classList.add('is-invalid');
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError(input, errorEl) {
    input.classList.remove('is-invalid');
    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (!value) {
      showError(nameInput, nameError, 'Please enter your name.');
      return false;
    }
    clearError(nameInput, nameError);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      showError(emailInput, emailError, 'Please enter your email address.');
      return false;
    }
    if (!emailPattern.test(value)) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('is-invalid')) validateName();
  });

  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid')) validateEmail();
  });

  function onSubmit(event) {
    event.preventDefault();
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    if (!isNameValid || !isEmailValid) return;
    openSubmitPopup?.();
  }

  form.addEventListener('submit', onSubmit);
  submitBtn.addEventListener('click', onSubmit);
}

const SUBMIT_LOCK_MS = 15000;

function initSubmitPopup() {
  const popup = document.getElementById('submitPopup');
  const lockEl = document.getElementById('submitLock');
  const toastEl = document.getElementById('submitToast');
  const progressBarEl = document.getElementById('submitToastProgress');
  const audioEl = document.getElementById('submitAudio');

  if (!popup || !lockEl || !toastEl || !progressBarEl) return;

  let isOpening = false;
  let isLocked = false;
  let lockTimer = null;
  let lockStartedAt = 0;

  function blockInteraction(event) {
    if (!isLocked) return;
    event.preventDefault();
    event.stopPropagation();
  }

  function resetToastProgress() {
    progressBarEl.style.transition = 'none';
    progressBarEl.style.transform = 'scaleX(1)';
  }

  function startToastProgress() {
    resetToastProgress();
    void progressBarEl.offsetWidth;
    progressBarEl.style.transition = `transform ${SUBMIT_LOCK_MS}ms linear`;
    progressBarEl.style.transform = 'scaleX(0)';
  }

  function showSubmitToast() {
    toastEl.hidden = false;
    toastEl.classList.add('is-visible', 'is-locked');
    startToastProgress();
  }

  function hideSubmitToast() {
    toastEl.classList.remove('is-visible', 'is-locked');
    toastEl.hidden = true;
    resetToastProgress();
  }

  function startSubmitLock() {
    isLocked = true;
    isOpening = true;
    lockStartedAt = Date.now();

    lockEl.hidden = false;
    lockEl.setAttribute('aria-hidden', 'false');
    showSubmitToast();
    document.body.classList.add('is-submit-locked');

    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    }

    window.clearTimeout(lockTimer);
    lockTimer = window.setTimeout(endSubmitLock, SUBMIT_LOCK_MS);
  }

  function endSubmitLock() {
    const elapsed = Date.now() - lockStartedAt;
    if (elapsed < SUBMIT_LOCK_MS) {
      lockTimer = window.setTimeout(endSubmitLock, SUBMIT_LOCK_MS - elapsed);
      return;
    }

    isLocked = false;
    isOpening = false;

    lockEl.hidden = true;
    lockEl.setAttribute('aria-hidden', 'true');
    hideSubmitToast();
    document.body.classList.remove('is-submit-locked');
  }

  function closeSubmitPopup() {
    if (isOpening || isLocked) return;
    popup.classList.remove('is-open', 'is-animating');
    popup.hidden = true;
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
  }

  openSubmitPopup = () => {
    window.setTimeout(() => {
      popup.hidden = false;
      popup.classList.add('is-open', 'is-animating');
      startSubmitLock();

      const dialog = popup.querySelector('.submit-popup__dialog');
      if (dialog) {
        dialog.addEventListener('animationend', () => {
          popup.classList.remove('is-animating');
        }, { once: true });
      }
    }, 0);
  };

  ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'wheel', 'keydown', 'keyup', 'contextmenu'].forEach((eventName) => {
    lockEl.addEventListener(eventName, blockInteraction, true);
  });

  popup.querySelectorAll('[data-close-submit]').forEach((el) => {
    el.addEventListener('click', closeSubmitPopup);
  });

  document.addEventListener('keydown', (event) => {
    if (isLocked) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key === 'Escape' && popup.classList.contains('is-open')) {
      closeSubmitPopup();
    }
  }, true);
}

function initGiftVideoPopup() {
  const btn = document.getElementById('claimGiftBtn');
  const popup = document.getElementById('giftVideoPopup');
  const video = popup?.querySelector('.video-popup__player');

  if (!btn || !popup || !video) return;

  function openPopup(event) {
    event.preventDefault();
    popup.hidden = false;
    popup.classList.add('is-open');
    video.currentTime = 0;
    video.play().catch(() => {});
    navLinks?.classList.remove('open');
  }

  function closePopup() {
    popup.classList.remove('is-open');
    video.pause();
    video.currentTime = 0;
    popup.hidden = true;
  }

  btn.addEventListener('click', openPopup);

  popup.querySelectorAll('[data-close-video]').forEach((el) => {
    el.addEventListener('click', closePopup);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup.classList.contains('is-open')) {
      closePopup();
    }
  });
}

function initNavSpy() {
  const nav = document.querySelector('.nav');
  const links = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
  const sections = links
    .map((link) => {
      const id = link.getAttribute('href').slice(1);
      return { link, section: document.getElementById(id) };
    })
    .filter(({ section }) => section);

  if (!sections.length) return;

  function updateActiveLink() {
    const navOffset = (nav?.offsetHeight ?? 0) + 80;
    let activeId = sections[0].section.id;

    sections.forEach(({ section }) => {
      if (section.getBoundingClientRect().top <= navOffset) {
        activeId = section.id;
      }
    });

    sections.forEach(({ link, section }) => {
      const isActive = section.id === activeId;
      link.classList.toggle('is-active', isActive);
      link.toggleAttribute('aria-current', isActive);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();
}

function initTeamsSlider() {
  const sliderEl = document.getElementById('teamsSlider');
  const trackEl = document.querySelector('.teams-slider__track');
  const dotsEl = document.querySelector('.teams-slider__dots');
  const prevBtn = document.querySelector('.teams-slider__arrow--prev');
  const nextBtn = document.querySelector('.teams-slider__arrow--next');

  if (!sliderEl || !trackEl || !dotsEl) return;

  let currentTeam = 0;
  let trackPos = 1;
  let isTransitioning = false;
  let teamTimer = null;
  let teamPauseCount = 0;
  let slideEls = [];
  let dotEls = [];

  function renderTeamSlide(team, teamIndex, { isClone = false } = {}) {
    return `
      <article
        class="teams-slider__slide${isClone ? ' teams-slider__slide--clone' : ''}"
        data-team-index="${teamIndex}"
        role="group"
        aria-roledescription="slide"
        aria-label="${teamIndex + 1} of ${teams.length}: ${team.name}"
        aria-hidden="true"
      >
        <button type="button" class="teams-slider__image-wrap" aria-label="View ${team.name} team image">
          <img class="teams-slider__image" src="${team.image}" alt="${team.name} team photo" loading="lazy" />
        </button>
        <div class="teams-slider__info">
          <div class="teams-slider__heading">
            ${team.logo ? `
              <button type="button" class="teams-slider__logo-wrap" aria-label="View ${team.name} team logo">
                <img class="teams-slider__logo" src="${team.logo}" alt="${team.name} team logo" loading="lazy" />
              </button>
            ` : ''}
            <h3 class="teams-slider__name">${team.name}</h3>
          </div>
          <p class="teams-slider__slogan">&ldquo;${team.slogan}&rdquo;</p>
          <p class="teams-slider__members-label">// Squad Members</p>
          <ul class="teams-slider__members">
            ${team.members.map((member, i) => `
              <li class="teams-slider__member${i === 0 ? ' teams-slider__member--captain' : ''}">
                <span class="teams-slider__member-index">${String(i + 1).padStart(2, '0')}</span>
                <span class="teams-slider__member-name">
                  <span>${member}</span>
                  ${i === 0 ? '<span class="teams-slider__captain-badge">CAPTAIN</span>' : ''}
                </span>
              </li>
            `).join('')}
          </ul>
        </div>
      </article>
    `;
  }

  function renderSlides() {
    const lastTeam = teams[teams.length - 1];
    const firstTeam = teams[0];

    trackEl.innerHTML = [
      renderTeamSlide(lastTeam, teams.length - 1, { isClone: true }),
      ...teams.map((team, index) => renderTeamSlide(team, index)),
      renderTeamSlide(firstTeam, 0, { isClone: true }),
    ].join('');

    dotsEl.innerHTML = teams.map((team, index) => `
      <button
        type="button"
        class="teams-slider__dot${index === 0 ? ' is-active' : ''}"
        data-index="${index}"
        role="tab"
        aria-label="${team.name}"
        aria-selected="${index === 0 ? 'true' : 'false'}"
      ></button>
    `).join('');

    slideEls = trackEl.querySelectorAll('.teams-slider__slide');
    dotEls = dotsEl.querySelectorAll('.teams-slider__dot');

    trackEl.querySelectorAll('.teams-slider__info').forEach((infoEl) => {
      infoEl.addEventListener('mouseenter', pauseTeamAutoplay);
      infoEl.addEventListener('mouseleave', resumeTeamAutoplay);
    });

    trackEl.querySelectorAll('.teams-slider__image-wrap').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slide = btn.closest('.teams-slider__slide');
        if (!slide) return;
        const index = parseInt(slide.dataset.teamIndex, 10);
        openTeamLightboxWithPause(index, pauseTeamAutoplay, resumeTeamAutoplay);
      });
    });

    trackEl.querySelectorAll('.teams-slider__logo-wrap').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slide = btn.closest('.teams-slider__slide');
        if (!slide) return;
        const index = parseInt(slide.dataset.teamIndex, 10);
        openTeamLightboxWithPause(index, pauseTeamAutoplay, resumeTeamAutoplay, true);
      });
    });

    trackEl.addEventListener('transitionend', (event) => {
      if (event.target !== trackEl || event.propertyName !== 'transform') return;

      if (trackPos === teams.length + 1) {
        setTrackPosition(1, false);
      } else if (trackPos === 0) {
        setTrackPosition(teams.length, false);
      }

      isTransitioning = false;
    });
  }

  function updateDotsAndAria() {
    dotEls.forEach((dot, i) => {
      const isActive = i === currentTeam;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    slideEls.forEach((slide) => {
      const teamIndex = parseInt(slide.dataset.teamIndex, 10);
      const isClone = slide.classList.contains('teams-slider__slide--clone');
      slide.setAttribute('aria-hidden', !isClone && teamIndex === currentTeam ? 'false' : 'true');
    });
  }

  function setTrackPosition(pos, animate = true) {
    trackEl.style.transition = animate
      ? `transform ${TEAMS_SLIDE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
      : 'none';
    trackEl.style.transform = `translate3d(-${pos * 100}%, 0, 0)`;
    trackPos = pos;
  }

  function goToTeam(target) {
    if (isTransitioning) return;

    target = ((target % teams.length) + teams.length) % teams.length;

    if (target === currentTeam) {
      setTrackPosition(target + 1, false);
      updateDotsAndAria();
      return;
    }

    const forward = (target - currentTeam + teams.length) % teams.length;
    const backward = (currentTeam - target + teams.length) % teams.length;
    const endPos = forward <= backward
      ? trackPos + forward
      : trackPos - backward;

    isTransitioning = true;
    currentTeam = target;
    setTrackPosition(endPos, true);
    updateDotsAndAria();
  }

  function goNext() {
    goToTeam((currentTeam + 1) % teams.length);
  }

  function goPrev() {
    goToTeam((currentTeam - 1 + teams.length) % teams.length);
  }

  function startTeamAutoplay() {
    stopTeamAutoplay();
    teamTimer = setInterval(goNext, AUTOPLAY_MS);
  }

  function stopTeamAutoplay() {
    if (teamTimer) {
      clearInterval(teamTimer);
      teamTimer = null;
    }
  }

  function pauseTeamAutoplay() {
    teamPauseCount += 1;
    if (teamPauseCount === 1) stopTeamAutoplay();
  }

  function resumeTeamAutoplay() {
    teamPauseCount = Math.max(0, teamPauseCount - 1);
    if (teamPauseCount === 0) startTeamAutoplay();
  }

  renderSlides();
  setTrackPosition(1, false);
  updateDotsAndAria();

  dotEls.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToTeam(parseInt(dot.dataset.index, 10));
      startTeamAutoplay();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goPrev();
      startTeamAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goNext();
      startTeamAutoplay();
    });
  }

  startTeamAutoplay();

  teamsSliderControl = {
    goToTeam,
    restartAutoplay: startTeamAutoplay,
  };
}

function initHeroViewDetail() {
  if (!teamDetailBtn) return;

  teamDetailBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (teamsSliderControl) {
      teamsSliderControl.goToTeam(current);
      teamsSliderControl.restartAutoplay();
    }

    const teamsSection = document.getElementById('teams');
    if (!teamsSection) return;

    const navHeight = document.querySelector('.nav')?.offsetHeight ?? 0;
    const top = teamsSection.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

function initCountdown() {
  const targetDate = new Date('2026-06-24T12:00:00+07:00');
  const countdownEl = document.getElementById('countdown-timer');
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (!countdownEl || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const diff = targetDate.getTime() - Date.now();

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      countdownEl.classList.add('is-ended');
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
}
