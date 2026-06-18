const TEAM_PLACEHOLDER = 'assets/team-placeholder.png';

const teams = [
  {
    name: 'Lambda Squad',
    image: TEAM_PLACEHOLDER,
    detailUrl: '#teams/lambda-squad',
  },
  {
    name: 'Black Mesa Raiders',
    image: TEAM_PLACEHOLDER,
    detailUrl: '#teams/black-mesa-raiders',
  },
  {
    name: 'HECU Vanguard',
    image: TEAM_PLACEHOLDER,
    detailUrl: '#teams/hecu-vanguard',
  },
  {
    name: 'Xen Strike Force',
    image: TEAM_PLACEHOLDER,
    detailUrl: '#teams/xen-strike-force',
  },
  {
    name: 'Crowbar Elite',
    image: TEAM_PLACEHOLDER,
    detailUrl: '#teams/crowbar-elite',
  },
];

const AUTOPLAY_MS = 3000;
const TEAM_ANIM_OUT_MS = 350;
const TEAM_ANIM_IN_MS = 550;

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
const teamDetailsEl = document.querySelector('.team-showcase__details');
const teamDetailBtn = document.querySelector('.team-showcase__btn');
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');

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
    teamDetailBtn.href = team.detailUrl;
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

  trackEl.innerHTML = slides.map((slide, index) => `
    <button
      class="carousel__slide"
      data-index="${index}"
      data-border="${slide.border}"
      aria-label="Slide ${index + 1}: ${slide.alt}"
      style="z-index: ${index + 1}"
    >
      <div class="slide-card slide-card--${slide.border}">
        <div class="slide-card__border">
          <div class="slide-card__image">
            <img loading="lazy" src="${slide.thumb}" alt="${slide.alt}" />
          </div>
        </div>
      </div>
    </button>
  `).join('');

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
initTeamLightbox();

function initTeamLightbox() {
  if (!teamFrameEl || !teamLightboxEl || !lightboxImageEl || !lightboxCaptionEl) return;

  const closeTriggers = teamLightboxEl.querySelectorAll('[data-close-lightbox]');

  function openLightbox() {
    const team = teams[current];
    if (!team) return;

    lightboxImageEl.src = team.image;
    lightboxImageEl.alt = `${team.name} team image`;
    lightboxCaptionEl.textContent = team.name;
    teamLightboxEl.hidden = false;
    teamLightboxEl.classList.add('is-open');
    pauseAutoplay();
  }

  function closeLightbox() {
    teamLightboxEl.classList.remove('is-open');
    resumeAutoplay();

    window.setTimeout(() => {
      if (!teamLightboxEl.classList.contains('is-open')) {
        teamLightboxEl.hidden = true;
        lightboxImageEl.src = '';
      }
    }, 0);
  }

  teamFrameEl.addEventListener('click', openLightbox);

  closeTriggers.forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && teamLightboxEl.classList.contains('is-open')) {
      closeLightbox();
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
initCountdown();

function initCountdown() {
  const targetDate = new Date('2026-08-12T08:00:00+07:00');
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
