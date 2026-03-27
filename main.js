/* ========================
   CLIPPIE WEBSITE — main.js
   ======================== */

// ── Mobile burger menu ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// ── Navbar scroll shadow ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 2px 20px rgba(59,110,245,0.12)'
      : 'none';
  }
});

// ── Intersection Observer for fade-up animations ──
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => observer.observe(el));

// ── FAQ Accordion ──
const faqButtons = document.querySelectorAll('.faq-q');
faqButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('open'));

    if (!isOpen) {
      answer.classList.add('open');
      btn.classList.add('open');
    }
  });
});

// ── Stagger .qf-item animations ──
document.querySelectorAll('.qf-item').forEach((el, i) => {
  el.style.animationDelay = `${i * 0.1}s`;
});

// ── Smooth active nav highlight ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) link.classList.add('active');
});
