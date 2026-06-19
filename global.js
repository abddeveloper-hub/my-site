/**
 * global.js
 * Cinematic interactions, ambient sound design, and seamless page transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------------------- */
  /* 1. SEAMLESS PAGE TRANSITIONS */
  /* -------------------------------------------------------------------------- */
  const shutter = document.querySelector('.page-transition-shutter');
  if (shutter) {
    // Reveal the current page by fading out the shutter
    setTimeout(() => {
      shutter.classList.add('hidden');
    }, 100);
  }



  /* -------------------------------------------------------------------------- */
  /* 2. MAGNETIC INTERACTIONS */
  /* -------------------------------------------------------------------------- */
  const magneticElements = document.querySelectorAll('.nav-links a, .mag-btn, .project-card, .t-btn, .play-btn, .arch-btn, .mag-btn-dark');
  
  if (!prefersReducedMotion) magneticElements.forEach(el => {
    // Add a transition to smooth out the return to origin
    el.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    
    el.addEventListener('mousemove', (e) => {
      // Temporarily remove transition so it sticks tightly to cursor
      el.style.transition = 'none';
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const xPull = x * 0.3; // Pull strength
      const yPull = y * 0.3;
      el.style.transform = `translate(${xPull}px, ${yPull}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      // Restore transition for smooth snap back
      el.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transform = `translate(0px, 0px)`;
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3. SOUND DESIGN (Web Audio API) */
  /* -------------------------------------------------------------------------- */
  const soundToggle = document.getElementById('sound-toggle');
  let audioCtx;
  let ambientOsc1, ambientOsc2, ambientGain, lfo;
  // Use session storage to persist sound state across page loads
  let isSoundOn = false;
  try {
    isSoundOn = sessionStorage.getItem('abd_sound_on') === 'true';
  } catch {
    isSoundOn = false;
  }

  function initAudio() {
    if (audioCtx) return true;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    audioCtx = new AudioContext();
    
    // Ambient Drone (Deep cinematic hum)
    ambientOsc1 = audioCtx.createOscillator();
    ambientOsc2 = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();
    
    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.value = 432; // Harmonic resonance
    ambientOsc1.frequency.value = 432; // Solfeggio frequency (A4=432Hz)
    ambientOsc2.type = 'triangle';
    ambientOsc2.frequency.value = 434; // Slight detune for phasing
    
    // LFO for slow volume swelling
    lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // 10s cycle
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.05;
    
    lfo.connect(lfoGain);
    lfoGain.connect(ambientGain.gain);
    
    ambientGain.gain.value = isSoundOn ? 0.3 : 0;
    
    ambientOsc1.connect(ambientGain);
    ambientOsc2.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);
    
    ambientOsc1.start();
    ambientOsc2.start();
    lfo.start();
    return true;
  }

  function toggleSound(e) {
    if (e) e.preventDefault();
    if (!audioCtx && !initAudio()) {
      if (soundToggle) soundToggle.innerHTML = '[ Sound: Unavailable ]';
      return;
    }
    
    if (audioCtx.state === 'suspended') audioCtx.resume();

    isSoundOn = !isSoundOn;
    try {
      sessionStorage.setItem('abd_sound_on', isSoundOn);
    } catch {}
    
    if (soundToggle) soundToggle.innerHTML = isSoundOn ? '[ Sound: On ]' : '[ Sound: Off ]';
    
    // Smooth volume fade
    ambientGain.gain.setTargetAtTime(isSoundOn ? 0.3 : 0, audioCtx.currentTime, 1.5);
  }

  // Restore sound state visually if it was enabled on previous page
  if (isSoundOn && soundToggle) {
    soundToggle.innerHTML = '[ Sound: On ]';
    // Audio context requires user interaction to resume in most browsers, 
    // so we can only init and resume if the user interacts with the document.
    const resumeOnInteraction = () => {
      if (!initAudio()) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      document.removeEventListener('click', resumeOnInteraction);
    };
    document.addEventListener('click', resumeOnInteraction);
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', toggleSound);
  }

  // Hover ticks
  const hoverTargets = document.querySelectorAll('a, button');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      if (!isSoundOn || !audioCtx) return;
      if (audioCtx.state === 'suspended') return;
      
      const tick = audioCtx.createOscillator();
      const tickGain = audioCtx.createGain();
      tick.type = 'triangle';
      tick.frequency.setValueAtTime(800, audioCtx.currentTime);
      tick.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);
      
      tickGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      tickGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      
      tick.connect(tickGain);
      tickGain.connect(audioCtx.destination);
      tick.start();
      tick.stop(audioCtx.currentTime + 0.05);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 4. CUSTOM CURSOR */
  /* -------------------------------------------------------------------------- */
  const curDot = document.getElementById('cursor-dot');
  const curRing = document.getElementById('cursor-ring');
  const curText = document.getElementById('cursor-text');
  if (curDot && curRing) {
    let cx = -100, cy = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
    
    (function cursorLoop() {
      requestAnimationFrame(cursorLoop);
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      curDot.style.left = cx + 'px';
      curDot.style.top = cy + 'px';
      curRing.style.left = rx + 'px';
      curRing.style.top = ry + 'px';
      if(curText) {
        curText.style.left = rx + 'px';
        curText.style.top = ry + 'px';
      }
    })();

    document.querySelectorAll('a, button, .hi-letter').forEach(el => {
      el.addEventListener('mouseenter', () => {
          curRing.style.width = '64px';
        curRing.style.height = '64px';
        curRing.style.background = 'rgba(255, 255, 255, 0.1)';
        curRing.style.backdropFilter = 'blur(4px)';
        curRing.style.mixBlendMode = 'difference';
        curRing.style.border = 'none';
        curRing.style.opacity = '1';
        curDot.style.opacity = '0';
      });
      el.addEventListener('mouseleave', () => {
        curRing.style.width = '36px';
        curRing.style.height = '36px';
        curRing.style.background = 'transparent';
        curRing.style.mixBlendMode = 'normal';
        curRing.style.border = '1px solid rgba(255,107,61,0.5)';
        curRing.style.opacity = '0.7';
        curDot.style.opacity = '1';
        curDot.style.background = 'var(--ember)';
      });
      el.addEventListener('mousedown', () => {
        curRing.style.transform = 'translate(-50%, -50%) scale(0.8)';
      });
      el.addEventListener('mouseup', () => {
        curRing.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });

    document.querySelectorAll('.project-card').forEach(card => {
      if(!curText) return;
      card.addEventListener('mouseenter', () => {
        curText.style.opacity = '1';
        curDot.style.opacity = '0';
        curRing.style.width = '70px';
        curRing.style.height = '70px';
        curRing.style.background = 'var(--glass)';
        curRing.style.borderColor = 'var(--glass)';
      });
      card.addEventListener('mouseleave', () => {
        curText.style.opacity = '0';
        curDot.style.opacity = '1';
        curRing.style.background = 'transparent';
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 5. SCROLL PARALLAX, PROGRESS & REVEALS */
  /* -------------------------------------------------------------------------- */
  const parallaxSlow = document.querySelectorAll('.parallax-slow');
  const parallaxFast = document.querySelectorAll('.parallax-fast');
  const skewElems = document.querySelectorAll('.project-visual, .hero-name, .skew-elem');
  const scrollProg = document.getElementById('scroll-prog');
  const reveals = document.querySelectorAll('.reveal');

  let lastY = window.scrollY;
  let velY = 0;

  if (skewElems.length > 0) {
    skewElems.forEach(el => el.classList.add('skew-elem'));
    function skewLoop() {
      velY *= 0.9; // Friction
      const skew = Math.max(-10, Math.min(10, velY * 0.15));
      skewElems.forEach(el => el.style.transform = `skewY(${skew}deg)`);
      requestAnimationFrame(skewLoop);
    }
    requestAnimationFrame(skewLoop);
  }

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    velY = y - lastY;
    lastY = y;

    parallaxSlow.forEach(el => el.style.transform = `translateY(${y * 0.12}px)`);
    parallaxFast.forEach(el => el.style.transform = `translateY(${y * 0.28}px)`);
    
    if (scrollProg) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
      scrollProg.style.width = progress + '%';
    }
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(el => revealObserver.observe(el));
  }

  /* -------------------------------------------------------------------------- */
  /* 6. RIPPLE EFFECT */
  /* -------------------------------------------------------------------------- */
  document.querySelectorAll('a, button').forEach(el => {
    el.classList.add('ripple-host');
    el.addEventListener('click', e => {
      const rect = el.getBoundingClientRect();
      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      const size = Math.max(rect.width, rect.height) * 2;
      wave.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
      el.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove());
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 7. EASTER EGGS (ACTION & MATRIX) */
  /* -------------------------------------------------------------------------- */
  let konamiAction = 'ACTION';
  let konamiMatrix = 'MATRIX';
  let actIdx = 0, matIdx = 0;
  window.addEventListener('keydown', e => {
    const key = e.key.toUpperCase();
    
    // ACTION
    if (key === konamiAction[actIdx]) {
      actIdx++;
      if (actIdx === konamiAction.length) {
        actIdx = 0;
        document.body.classList.add('easter-egg-active');
        setTimeout(() => document.body.classList.remove('easter-egg-active'), 2000);
      }
    } else { actIdx = 0; }
    
    // MATRIX
    if (key === konamiMatrix[matIdx]) {
      matIdx++;
      if (matIdx === konamiMatrix.length) {
        matIdx = 0;
        if (window.startMatrix) window.startMatrix();
      }
    } else { matIdx = 0; }
  });

  /* -------------------------------------------------------------------------- */
  /* 8. COMPONENT OBSERVERS (Stats & Process) */
  /* -------------------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const statObs = new IntersectionObserver((entries, observer) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const c = e.target;
        c.classList.add('visible');
        if (!c.dataset.count) return;
        
        const t = +c.dataset.count;
        const suf = c.dataset.suffix || '';
        const v = c.querySelector('.stat-value');
        let n = 0;
        const step = Math.ceil(t / 40);
        
        const iv = setInterval(() => {
          n = Math.min(n + step, t);
          if (v) v.textContent = n + suf;
          if (n >= t) clearInterval(iv);
        }, 35);
        
        observer.unobserve(c);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.stat-cell').forEach(el => statObs.observe(el));

    const pObs = new IntersectionObserver((entries, observer) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.process-step').forEach(el => pObs.observe(el));
  }

  /* -------------------------------------------------------------------------- */
  /* 9. NAVBAR SCROLL STATE */
  /* -------------------------------------------------------------------------- */
  const nb = document.getElementById('navbar');
  if (nb) {
    window.addEventListener('scroll', () => {
      nb.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* -------------------------------------------------------------------------- */
  /* 10. MOBILE MENU OVERLAY */
  /* -------------------------------------------------------------------------- */
  const mobileToggle = document.querySelector('.nav-mobile');
  if (mobileToggle) {
    mobileToggle.setAttribute('role', 'button');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-controls', 'mobile-menu');

    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.id = 'mobile-menu';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="mobile-menu-inner">
        <button class="mobile-close" type="button">[ Close ]</button>
        <ul class="mobile-nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="work.html">Work</a></li>
          <li><a href="lab.html">The Lab</a></li>
          <li><a href="social.html">Social Hub</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
    `;
    document.body.appendChild(overlay);

    const style = document.createElement('style');
    style.textContent = `
      .mobile-menu-overlay {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(11, 13, 18, 0.98); backdrop-filter: blur(20px);
        z-index: 9999; display: flex; flex-direction: column;
        justify-content: center; align-items: center;
        opacity: 0; pointer-events: none; transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .mobile-menu-overlay.active {
        opacity: 1; pointer-events: auto;
      }
      .mobile-close {
        position: absolute; top: 2rem; right: 2rem;
        background: none; border: none; color: #8a93a6;
        font-family: 'Space Mono', monospace; font-size: 0.8rem;
        text-transform: uppercase; letter-spacing: 0.2em; cursor: pointer;
      }
      .mobile-nav-links {
        list-style: none; text-align: center; display: flex; flex-direction: column; gap: 2.5rem;
      }
      .mobile-nav-links a {
        font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(2rem, 8vw, 3rem);
        color: #f3f1ec; text-decoration: none; transition: color 0.3s;
      }
      .mobile-nav-links a:hover {
        color: #ff6b3d;
      }
    `;
    document.head.appendChild(style);

    const closeBtn = overlay.querySelector('.mobile-close');
    const openMenu = () => {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      mobileToggle.setAttribute('aria-expanded', 'true');
      closeBtn.focus();
    };
    const closeMenu = () => {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      mobileToggle.setAttribute('aria-expanded', 'false');
    };

    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      openMenu();
    });

    closeBtn.addEventListener('click', closeMenu);
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 11. PAGE TRANSITIONS (SHUTTER EFFECT) */
  /* -------------------------------------------------------------------------- */
  const shutterStyle = document.createElement('style');
  shutterStyle.textContent = `
    .global-shutter {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: #050608; z-index: 10000; pointer-events: none;
      transform: scaleY(1); transform-origin: bottom;
      transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .global-shutter.open {
      transform: scaleY(0); transform-origin: top;
    }
  `;
  document.head.appendChild(shutterStyle);

  const globalShutter = document.createElement('div');
  globalShutter.className = 'global-shutter';
  document.body.appendChild(globalShutter);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      globalShutter.classList.add('open');
    });
  });

  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');
    
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || target === '_blank') return;
    
    e.preventDefault();
    
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    if (mobileOverlay) mobileOverlay.classList.remove('active');

    globalShutter.style.transformOrigin = 'bottom';
    globalShutter.classList.remove('open');
    
    setTimeout(() => {
      window.location.href = href;
    }, 700);
  });

  /* -------------------------------------------------------------------------- */
  /* 12. CYBERPUNK TEXT DECODING */
  /* -------------------------------------------------------------------------- */
  const chars = '!<>-_\\\\/[]{}-=+*^?#_';
  
  function decodeText(element) {
    if(element.dataset.decoded === 'true') return;
    element.dataset.decoded = 'true';

    const originalText = element.getAttribute('data-glitch') || element.innerText;
    if(!element.hasAttribute('data-glitch')) element.setAttribute('data-glitch', originalText);
    
    let iteration = 0;
    
    const interval = setInterval(() => {
      element.innerText = originalText
        .split('')
        .map((letter, index) => {
          if(letter === ' ') return ' ';
          if (index < iteration) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      if (iteration >= originalText.length) {
        clearInterval(interval);
        element.innerText = originalText;
      }
      iteration += 1 / 2; 
    }, 40);
  }

  const decodeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) decodeText(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.glitch-text').forEach(el => decodeObs.observe(el));

});

