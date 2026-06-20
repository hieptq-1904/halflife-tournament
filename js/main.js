const TEAM_PLACEHOLDER = 'assets/team-placeholder.svg';

const teams = [
  {
    name: 'Lambda Squad',
    image: TEAM_PLACEHOLDER,
    detailUrl: '#teams/lambda-squad',
    slogan: 'Resonance cascade — không ai quay đầu',
    members: ['Nguyễn Minh Tuấn', 'Trần Đức Anh', 'Lê Hoàng Nam'],
  },
  {
    name: 'Black Mesa Raiders',
    image: TEAM_PLACEHOLDER,
    detailUrl: '#teams/black-mesa-raiders',
    slogan: 'Black Mesa không bao giờ ngủ',
    members: ['Phạm Quốc Huy', 'Võ Thành Đạt', 'Bùi Minh Khang'],
  },
  {
    name: 'HECU Vanguard',
    image: TEAM_PLACEHOLDER,
    detailUrl: '#teams/hecu-vanguard',
    slogan: 'Tiên phong — quyết thắng',
    members: ['Đặng Văn Phong', 'Nguyễn Thị Mai', 'Trương Bảo Long'],
  },
  {
    name: 'Xen Strike Force',
    image: TEAM_PLACEHOLDER,
    detailUrl: '#teams/xen-strike-force',
    slogan: 'Vượt qua portal, không giới hạn',
    members: ['Hoàng Gia Bảo', 'Đinh Quang Minh', 'Nguyễn Hữu Kiện'],
  },
  {
    name: 'Crowbar Elite',
    image: TEAM_PLACEHOLDER,
    detailUrl: '#teams/crowbar-elite',
    slogan: 'Crowbar giải quyết mọi thứ',
    members: ['Lý Văn Tài', 'Phan Minh Đức', 'Vũ Thanh Tùng'],
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

let lightboxResumeFn = null;

function openTeamLightbox(teamIndex) {
  const team = teams[teamIndex];
  if (!team || !teamLightboxEl || !lightboxImageEl || !lightboxCaptionEl) return;

  lightboxImageEl.src = team.image;
  lightboxImageEl.alt = `${team.name} team image`;
  lightboxCaptionEl.textContent = team.name;
  teamLightboxEl.hidden = false;
  teamLightboxEl.classList.add('is-open');
}

function closeTeamLightbox() {
  if (!teamLightboxEl) return;

  teamLightboxEl.classList.remove('is-open');

  if (lightboxResumeFn) {
    lightboxResumeFn();
    lightboxResumeFn = null;
  }

  window.setTimeout(() => {
    if (!teamLightboxEl.classList.contains('is-open')) {
      teamLightboxEl.hidden = true;
      if (lightboxImageEl) lightboxImageEl.src = '';
    }
  }, 0);
}

function openTeamLightboxWithPause(teamIndex, pauseFn, resumeFn) {
  lightboxResumeFn = resumeFn;
  pauseFn();
  openTeamLightbox(teamIndex);
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
          <h3 class="teams-slider__name">${team.name}</h3>
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
