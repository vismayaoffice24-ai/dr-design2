/**
 * Dr. Jithin Lal – Clinic Website Core Engine
 * Handles animations, curtain page transitions, 3D card tilt, scroll reveals,
 * mobile drawer, dark theme, and WhatsApp appointment integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageTransition();
  initThemeToggle();
  initMobileNav();
  initActiveNavLink();
  initProgressBar();
  initMouseGlow();
  initCard3DTilt();
  initScrollReveal();
  initFormHandlers();
});

/* ==========================================================================
   1. Curtain Page Transition (Animation #5)
   ========================================================================== */
function initPageTransition() {
  const cur = document.getElementById('cur');
  if (!cur) return;

  // On page load, play exit animation to reveal the page
  cur.classList.remove('cur-entering');
  cur.classList.add('cur-leaving');

  // Handle browser back-forward cache (bfcache)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      cur.classList.remove('cur-entering');
      cur.classList.add('cur-leaving');
    }
  });

  // Intercept local internal page links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip anchor-only, external, mailto, tel, wa.me, or target="_blank"
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('https://wa.me') ||
      link.target === '_blank' ||
      link.hasAttribute('download')
    ) {
      return;
    }

    // Skip if user holds modifier keys
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Verify it's an internal HTML link
    const targetUrl = new URL(link.href, window.location.href);
    const isSameOrigin = (window.location.protocol === 'file:' && link.href.startsWith('file:')) || (targetUrl.origin === window.location.origin);
    if (!isSameOrigin) return;

    // If clicking current page without hash change
    if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && !targetUrl.hash) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    cur.classList.remove('cur-leaving');
    void cur.offsetWidth; // Force reflow
    cur.classList.add('cur-entering');

    setTimeout(() => {
      window.location.href = link.href;
    }, 380);
  });
}

/* ==========================================================================
   2. Light / Dark Theme Support
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Saved or preferred theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }

  updateToggleIcon();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggleBtn) return;
    const isDark = root.getAttribute('data-theme') === 'dark' ||
      (!root.getAttribute('data-theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mb');
  const links = document.getElementById('lk');
  if (!menuBtn || !links) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuBtn.textContent = isOpen ? '✕' : '☰';
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (links.classList.contains('open') && !links.contains(e.target) && !menuBtn.contains(e.target)) {
      links.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = '☰';
    }
  });

  // Close when a link inside mobile nav is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = '☰';
    });
  });
}

/* ==========================================================================
   4. Active Navigation Link Detection
   ========================================================================== */
function initActiveNavLink() {
  const links = document.querySelectorAll('.links a:not(.btn)');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(a => {
    const linkPath = a.getAttribute('href');
    if (!linkPath) return;

    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      a.classList.add('on');
    } else {
      a.classList.remove('on');
    }
  });
}

/* ==========================================================================
   5. Top Scroll Progress Bar (Animation #6a)
   ========================================================================== */
function initProgressBar() {
  const bar = document.getElementById('bar');
  if (!bar) return;

  function updateBar() {
    const doc = document.documentElement;
    const totalHeight = doc.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
}

/* ==========================================================================
   6. Cursor Glow Following Mouse (Animation #6b - Desktop Only)
   ========================================================================== */
function initMouseGlow() {
  const glow = document.getElementById('glow');
  if (!glow) return;

  // Check for fine pointer (mouse / trackpad)
  if (!window.matchMedia('(pointer: fine)').matches) {
    glow.style.display = 'none';
    return;
  }

  let rafId = null;
  let mouseX = -999, mouseY = -999;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        glow.style.left = mouseX + 'px';
        glow.style.top = mouseY + 'px';
        rafId = null;
      });
    }
  }, { passive: true });
}

/* ==========================================================================
   7. 3D Card Tilt On Mouse Hover (Animation #8 - Desktop Only)
   ========================================================================== */
function initCard3DTilt() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const tiltCards = document.querySelectorAll('.card.tilt, .tilt');
  tiltCards.forEach(card => {
    let bounds;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease';
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = mouseX / bounds.width - 0.5;
      const yPct = mouseY / bounds.height - 0.5;

      const tiltX = -yPct * 12; // tilt around X axis
      const tiltY = xPct * 12;  // tilt around Y axis

      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    }

    function onMouseLeave() {
      card.style.transition = 'transform 0.4s ease-out, box-shadow 0.3s ease';
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
      bounds = null;
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/* ==========================================================================
   8. Scroll Reveal & Number Counter (Animations #7 & #10)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.rv');
  if (!revealElements.length) return;

  function countUp(el) {
    if (el.hasAttribute('data-counted')) return;
    el.setAttribute('data-counted', 'true');

    const target = parseInt(el.getAttribute('data-n'), 10);
    if (isNaN(target)) return;

    const duration = 1400; // ms
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(target * eased);

      el.textContent = currentVal;
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(updateCount);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');

          // Trigger number counter if element or descendant has data-n
          const counter = entry.target.hasAttribute('data-n') ? entry.target : entry.target.querySelector('[data-n]');
          if (counter) {
            countUp(counter);
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, index) => {
      // Stagger transition delay
      el.style.transitionDelay = `${(index % 4) * 85}ms`;
      observer.observe(el);
    });
  } else {
    // Fallback if no IntersectionObserver
    revealElements.forEach(el => {
      el.classList.add('in');
      const counter = el.querySelector('[data-n]');
      if (counter) counter.textContent = counter.getAttribute('data-n');
    });
  }
}

/* ==========================================================================
   9. Form Handlers & WhatsApp Pre-fill Integration
   ========================================================================== */
function initFormHandlers() {
  const apptForm = document.getElementById('appointment-form');
  const contactForm = document.getElementById('contact-form');

  if (apptForm) {
    apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmission(apptForm, 'appointment');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmission(contactForm, 'contact');
    });
  }

  function handleFormSubmission(form, type) {
    const name = form.elements['name']?.value?.trim() || '';
    const phone = form.elements['phone']?.value?.trim() || '';
    const email = form.elements['email']?.value?.trim() || 'Not specified';
    const date = form.elements['date']?.value || 'Next Available';
    const time = form.elements['time']?.value || 'Standard Hours';
    const visitType = form.elements['visit_type']?.value || 'Consultation';
    const reason = form.elements['reason']?.value?.trim() || 'General Nephrology Consultation';

    // Simple validation check
    if (!name || !phone) {
      alert('Please fill in your name and contact phone number.');
      return;
    }

    // Consent check
    const consent = form.querySelector('input[name="consent"]');
    if (consent && !consent.checked) {
      alert('Please agree to the privacy policy to proceed with booking.');
      return;
    }

    // Build pre-filled WhatsApp message
    let msg = `*Appointment Request for Dr. Jithin Lal*\n`;
    if (type === 'contact') {
      msg = `*Message for Dr. Jithin Lal (Amrutha Hospital)*\n`;
    }
    msg += `------------------------------------\n`;
    msg += `• *Name:* ${name}\n`;
    msg += `• *Phone:* ${phone}\n`;
    if (email !== 'Not specified') msg += `• *Email:* ${email}\n`;
    if (type === 'appointment') {
      msg += `• *Preferred Date:* ${date}\n`;
      msg += `• *Preferred Time:* ${time}\n`;
      msg += `• *Visit Type:* ${visitType}\n`;
    }
    msg += `• *Reason / Symptoms:* ${reason}\n`;
    msg += `------------------------------------\n`;
    msg += `_Sent via Dr. Jithin Lal Website_`;

    const rawWaPhone = (typeof CLINIC_CONFIG !== 'undefined' && CLINIC_CONFIG.whatsappRaw) ? CLINIC_CONFIG.whatsappRaw : '9745866333';
    const waPhone = rawWaPhone.startsWith('91') ? rawWaPhone : `91${rawWaPhone}`;
    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;

    // Show status box
    const okBox = form.querySelector('.ok');
    if (okBox) {
      okBox.innerHTML = `<strong>Thank you, ${name}!</strong> Opening WhatsApp to confirm your details with Dr. Jithin Lal’s clinic desk...`;
      okBox.style.display = 'block';
      okBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Open WhatsApp
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      form.reset();
    }, 600);
  }
}
