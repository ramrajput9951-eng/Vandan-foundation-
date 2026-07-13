/* ==========================================================================
   VANDAN FOUNDATION SEVA TRUST — Script
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar scroll state + active link ---------- */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 110;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));

    const backTop = document.getElementById('backTop');
    backTop.classList.toggle('show', window.scrollY > 500);
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinksWrap.classList.toggle('open');
    const open = navLinksWrap.classList.contains('open');
    navToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  navLinksWrap.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinksWrap.classList.remove('open');
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  /* ---------- Dark / light mode ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('vfst-theme');
  if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('vfst-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem('vfst-theme', 'dark');
    }
  });

  /* ---------- Back to top ---------- */
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.num[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.getAttribute('data-count');
      const suffix = el.getAttribute('data-suffix') || '';
      let cur = 0;
      const step = Math.max(target / 90, 1);
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target.toLocaleString() + suffix; return; }
        el.textContent = Math.floor(cur).toLocaleString() + suffix;
        requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Donation progress bar ---------- */
  const progressFill = document.getElementById('progressFill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressFill.style.width = progressFill.getAttribute('data-width');
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  if (progressFill) progressObserver.observe(progressFill);

  /* ---------- About tabs ---------- */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.about-copy, .tabs-wrap');
      const target = btn.getAttribute('data-tab');
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      group.querySelector(`#${target}`).classList.add('active');
    });
  });

  /* ---------- Projects filter ---------- */
  document.querySelectorAll('.proj-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.proj-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.proj-card').forEach(card => {
        card.style.display = (filter === 'all' || card.getAttribute('data-status') === filter) ? '' : 'none';
      });
    });
  });

  /* ---------- Gallery filter + lightbox ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  document.querySelectorAll('.gallery-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        item.style.display = (filter === 'all' || item.getAttribute('data-cat') === filter) ? '' : 'none';
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  let currentGalleryIndex = 0;
  const visibleItems = () => Array.from(galleryItems).filter(i => i.style.display !== 'none');

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      currentGalleryIndex = visibleItems().indexOf(item);
      openLightbox();
    });
  });
  function openLightbox() {
    const items = visibleItems();
    const img = items[currentGalleryIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
  }
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.getElementById('lightboxPrev').addEventListener('click', () => {
    const items = visibleItems();
    currentGalleryIndex = (currentGalleryIndex - 1 + items.length) % items.length;
    openLightbox();
  });
  document.getElementById('lightboxNext').addEventListener('click', () => {
    const items = visibleItems();
    currentGalleryIndex = (currentGalleryIndex + 1) % items.length;
    openLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
  });

  /* ---------- Donation amount selector ---------- */
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmount = document.getElementById('customAmount');
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      customAmount.value = btn.getAttribute('data-amount');
    });
  });
  customAmount.addEventListener('input', () => amountBtns.forEach(b => b.classList.remove('active')));

  document.getElementById('donateForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const amt = customAmount.value || '0';
    alert(`Thank you! Redirecting to secure payment gateway for ₹${amt}. (Payment gateway integration placeholder)`);
  });

  /* ---------- Testimonial slider (auto) ---------- */
  const track = document.getElementById('testTrack');
  const dotsWrap = document.getElementById('testDots');
  const slides = track.children.length;
  let testIndex = 0;
  for (let i = 0; i < slides; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => { testIndex = i; updateSlider(); });
    dotsWrap.appendChild(dot);
  }
  function updateSlider() {
    track.style.transform = `translateX(-${testIndex * 100}%)`;
    dotsWrap.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === testIndex));
  }
  setInterval(() => { testIndex = (testIndex + 1) % slides; updateSlider(); }, 5000);

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      document.querySelectorAll('.faq-item').forEach(item => {
        item.style.display = (cat === 'all' || item.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  });

  /* ---------- Volunteer form submit ---------- */
document.getElementById('bookingForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('fname').value;
  const phone = document.getElementById('fphone').value;
  const guests = document.getElementById('fguests').value;
  const msg = document.getElementById('fmsg').value;

  const text = `Hi Waffle Co.! I'd like to book a table.%0A%0A`
    + `Name: ${encodeURIComponent(name)}%0A`
    + `Mobile: ${encodeURIComponent(phone)}%0A`
    + `Guests: ${encodeURIComponent(guests)}%0A`
    + (msg ? `Message: ${encodeURIComponent(msg)}%0A` : '');

  window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
});

  /* ---------- File input label update ---------- */
  document.querySelectorAll('.field-file input[type="file"]').forEach(input => {
    input.addEventListener('change', () => {
      const label = input.closest('.field-file').querySelector('.file-label');
      label.textContent = input.files.length ? input.files[0].name : label.getAttribute('data-default');
    });
  });

});
