/* =====================================================
   SAIF NBET — PORTFOLIO
   script.js — Interactions, animations, particles
   ===================================================== */

'use strict';

/* =====================================================
   PRELOADER
   ===================================================== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('done');
    // Animate stats after preloader (handled by new stats observer)
  }, 1800);
});

/* =====================================================
   CUSTOM CURSOR
   ===================================================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

// Only enable on desktop
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  const lerp = (a, b, t) => a + (b - a) * t;

  const animateCursor = () => {
    followerX = lerp(followerX, mouseX, 0.12);
    followerY = lerp(followerY, mouseY, 0.12);
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Hover state
  document.querySelectorAll('a, button, .project-card, .contact-method').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
}

/* =====================================================
   NAVBAR — SCROLL & ACTIVE LINK
   ===================================================== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scroll class
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active section highlight
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 140;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

/* =====================================================
   MOBILE HAMBURGER MENU
   ===================================================== */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksContainer.classList.toggle('open');
  document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
});

// Close on link click
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* =====================================================
   TYPING ANIMATION
   ===================================================== */
const typingEl = document.getElementById('typing-text');
const words = ['Flutter Developer', 'Mobile Engineer', 'Cross-Platform Specialist', 'Dart Craftsman'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 120;

function type() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    typingEl.textContent = currentWord.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentWord.length) {
      isDeleting = true;
      typingDelay = 2200; // Pause at end
    } else {
      typingDelay = 90;
    }
  } else {
    typingEl.textContent = currentWord.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingDelay = 400;
    } else {
      typingDelay = 50;
    }
  }

  setTimeout(type, typingDelay);
}

// Start after preloader
setTimeout(type, 2200);

/* =====================================================
   PARTICLE BACKGROUND
   ===================================================== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particlesArr = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.7 ? '#7b5ea7' : '#00d4ff';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particlesArr.push(new Particle());
}

// Connect nearby particles with lines
function connectParticles() {
  for (let i = 0; i < particlesArr.length; i++) {
    for (let j = i + 1; j < particlesArr.length; j++) {
      const dx = particlesArr[i].x - particlesArr[j].x;
      const dy = particlesArr[i].y - particlesArr[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 120) * 0.12;
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particlesArr[i].x, particlesArr[i].y);
        ctx.lineTo(particlesArr[j].x, particlesArr[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArr.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}

animateParticles();

/* =====================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ===================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger effect for grouped items
      const delay = entry.target.closest('.projects-grid, .skills-grid, .about-stats')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
        : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

/* =====================================================
   SKILL BARS (trigger when visible)
   ===================================================== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(el => skillObserver.observe(el));

/* =====================================================
   COUNTER ANIMATION (stats)
   ===================================================== */
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

/* =====================================================
   CONTACT FORM — MAILTO FALLBACK
   ===================================================== */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    // Open mailto link
    const subject = encodeURIComponent('Portfolio Contact — ' + name);
    const body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      message
    );
    window.location.href = 'mailto:nbetsaif@gmail.com?subject=' + subject + '&body=' + body;

    // Visual feedback
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

/* =====================================================
   SMOOTH ANCHOR SCROLL (extra safety)
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =====================================================
   NAVBAR HIDE ON SCROLL DOWN / SHOW ON SCROLL UP
   ===================================================== */
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = currentScrollY;
}, { passive: true });

/* Add transition to navbar transform */
navbar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, padding 0.3s ease, backdrop-filter 0.3s ease';

/* =====================================================
   EXTRA DYNAMIC POP EFFECTS
   ===================================================== */

// Split section titles into animated characters
document.querySelectorAll('.section-title').forEach(title => {
  const text = title.textContent;
  title.textContent = '';
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${i * 0.03}s`;
    title.appendChild(span);
  });
});

const titleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      titleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.section-title').forEach(el => titleObserver.observe(el));

// Stat counter with ring burst + particle fly-out on completion
function animateCountersWithBurst() {
  document.querySelectorAll('.stat-card').forEach(card => {
    const el = card.querySelector('.stat-number');
    if (!el) return;
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Burst effect on completion
        card.classList.add('pop');
        spawnParticles(card);
      }
    };
    requestAnimationFrame(tick);
  });
}

function spawnParticles(card) {
  const rect = card.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.className = 'stat-burst';
    const angle = (Math.PI * 2 * i) / 6;
    const dist = 40 + Math.random() * 20;
    p.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--by', `${Math.sin(angle) * dist}px`);
    p.style.left = '50%';
    p.style.top = '50%';
    card.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

// Trigger stat burst when stats section is visible (replaces old animateCounters call)
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCountersWithBurst();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const aboutStatsEl = document.querySelector('.about-stats');
if (aboutStatsEl) statsObserver.observe(aboutStatsEl);

/* =====================================================
   ABOUT SECTION — ENHANCED ANIMATIONS
   ===================================================== */

// Trigger staggered text + stat reveals
const aboutTextObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      aboutTextObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.about-text').forEach(el => aboutTextObserver.observe(el));
document.querySelectorAll('.stat-card').forEach(el => aboutTextObserver.observe(el));

// Trigger tag/info-row stagger on the profile card
const aboutCardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      aboutCardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.about-card').forEach(el => aboutCardObserver.observe(el));

// 3D tilt + magnetic glow on profile card
const aboutCard = document.querySelector('.about-card');
if (aboutCard && window.innerWidth > 768) {
  aboutCard.addEventListener('mousemove', (e) => {
    const rect = aboutCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    aboutCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    aboutCard.style.setProperty('--mouse-x', `${x}px`);
    aboutCard.style.setProperty('--mouse-y', `${y}px`);
  });

  aboutCard.addEventListener('mouseleave', () => {
    aboutCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
}
