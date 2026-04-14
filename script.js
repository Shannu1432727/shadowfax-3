/* ============================================================
   SAKTHI DENTAL CLINIC — script.js
   Handles: navbar, theme, mobile menu, slider, scroll
   animations, counters, form validation, FAQ accordion
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Loading Overlay ─────────────────────────────────────── */
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    setTimeout(() => overlay.classList.add('hidden'), 1600);
  }

  /* ── Sticky Navbar ───────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── Active Nav Link ─────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Dark / Light Mode Toggle ────────────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('sakthi-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sakthi-theme', next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }

  /* ── Mobile Menu ─────────────────────────────────────────── */
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Testimonial Slider ──────────────────────────────────── */
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let current = 0, autoSlide;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (track && slides.length) {
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));
    goTo(0);
    autoSlide = setInterval(() => goTo(current + 1), 5000);
    function resetAuto() { clearInterval(autoSlide); autoSlide = setInterval(() => goTo(current + 1), 5000); }
  }

  /* ── Scroll Reveal Animations ────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Animated Counters ───────────────────────────────────── */
  const counterEls = document.querySelectorAll('.counter-num');
  let countersStarted = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.innerHTML = Math.floor(cur).toLocaleString() + '<span>' + suffix + '</span>';
      if (cur >= target) clearInterval(timer);
    }, 16);
  }

  if (counterEls.length) {
    const counterObs = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting) && !countersStarted) {
        countersStarted = true;
        counterEls.forEach(animateCounter);
      }
    }, { threshold: 0.3 });
    counterEls.forEach(el => counterObs.observe(el));
  }

  /* ── FAQ Accordion ───────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(fi => fi.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* ── Contact Form Validation ─────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    const fields = {
      name:    { el: form.querySelector('#name'),    msg: form.querySelector('#name-error'),    validate: v => v.trim().length >= 2 },
      email:   { el: form.querySelector('#email'),   msg: form.querySelector('#email-error'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      phone:   { el: form.querySelector('#phone'),   msg: form.querySelector('#phone-error'),   validate: v => /^[0-9+\-\s]{7,15}$/.test(v.trim()) },
      message: { el: form.querySelector('#message'), msg: form.querySelector('#message-error'), validate: v => v.trim().length >= 10 }
    };

    function validateField(key) {
      const f = fields[key];
      if (!f.el) return true;
      const valid = f.validate(f.el.value);
      f.el.parentElement.classList.toggle('error', !valid);
      f.el.classList.toggle('error', !valid);
      return valid;
    }

    Object.keys(fields).forEach(key => {
      const f = fields[key];
      if (f.el) {
        f.el.addEventListener('blur', () => validateField(key));
        f.el.addEventListener('input', () => {
          if (f.el.classList.contains('error')) validateField(key);
        });
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const allValid = Object.keys(fields).map(validateField).every(Boolean);
      if (allValid) {
        const success = document.getElementById('form-success');
        if (success) { success.style.display = 'block'; }
        form.reset();
        setTimeout(() => { if (success) success.style.display = 'none'; }, 6000);
      }
    });
  }

  /* ── Scroll To Top ───────────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Smooth Scroll for Anchor Links ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
// existing code above...

// ===== FLOATING GALLERY =====
const galleryImages = document.querySelectorAll(".floating-gallery img");

if (galleryImages.length > 0) {
  let current = 0;

  setInterval(() => {
    galleryImages[current].classList.remove("active");
    current = (current + 1) % galleryImages.length;
    galleryImages[current].classList.add("active");
  }, 1000);
}
setTimeout(() => overlay.classList.add('hidden'), 5000);

// your existing code above...

window.addEventListener("load", function () {
  const overlay = document.getElementById("loading-overlay");

  setTimeout(function () {
    if (overlay) {
      overlay.style.display = "none"; // safer than class
    }
  }, 5000);
});
// ===== INTRO SLIDER =====
const introImages = document.querySelectorAll(".intro-img");

if (introImages.length > 0) {
  let i = 0;

  const slider = setInterval(() => {
    introImages[i].classList.remove("active");
    i = (i + 1) % introImages.length;
    introImages[i].classList.add("active");
  }, 1000); // change every 1 sec

  // Hide after 5 seconds
  setTimeout(() => {
    document.getElementById("intro-slider").style.display = "none";
    clearInterval(slider);
  }, 5000);
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// show popup after ads
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// show popup only once
window.addEventListener("load", () => {
  const alreadyShown = localStorage.getItem("popupShown");

  if (!alreadyShown) {
    setTimeout(() => {
      const popup = document.getElementById("popup");
      if (popup) popup.style.display = "flex";

      // mark as shown
      localStorage.setItem("popupShown", "true");
    }, 5000); // after ads
  }
});

function sendMessage() {
  const input = document.getElementById("user-input");
  const chat = document.getElementById("chat-body");

  let userText = input.value.trim();
  if (userText === "") return;

  // show user message
  chat.innerHTML += `<p><b>You:</b> ${userText}</p>`;

  // dummy replies
  let reply = "Sorry, I didn't understand.";

  if (userText.toLowerCase().includes("appointment")) {
    reply = "You can book an appointment from contact page.";
  } else if (userText.toLowerCase().includes("time")) {
    reply = "We are open 9AM to 7PM.";
  } else if (userText.toLowerCase().includes("location")) {
    reply = "We are located in Hosur, Tamil Nadu.";
  }

  // bot reply
  setTimeout(() => {
    chat.innerHTML += `<p><b>Bot:</b> ${reply}</p>`;
    chat.scrollTop = chat.scrollHeight;
  }, 500);

  input.value = "";
}