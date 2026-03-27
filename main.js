/* ========================
   CLIPPIE WEBSITE — main.js
   ======================== */

// ── Mobile burger menu ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });
}

// ── Navbar scroll shadow (Throttled) ──
const navbar = document.querySelector('.navbar');
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      if (navbar) {
        navbar.style.boxShadow = window.scrollY > 20
          ? '0 2px 20px rgba(59,110,245,0.12)'
          : 'none';
      }
      scrollTimeout = null;
    }, 50);
  }
}, { passive: true });

// ── Intersection Observer for fade-up animations ──
const fadeEls = document.querySelectorAll('.fade-up');
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeEls.forEach(el => observer.observe(el));

// ── FAQ Accordion ──
const faqButtons = document.querySelectorAll('.faq-q');
faqButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-a.open').forEach(a => {
      if (a !== answer) a.classList.remove('open');
    });
    document.querySelectorAll('.faq-q.open').forEach(b => {
      if (b !== btn) b.classList.remove('open');
    });

    answer.classList.toggle('open');
    btn.classList.toggle('open');
  });
});

// ── Counter Animation Utility ──
function animateValue(obj, start, end, duration, format = true) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    obj.innerHTML = format ? value.toLocaleString() : value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// ── Trigger Counters when in viewport ──
const counters = [
  { id: 'countNum', target: 2840, duration: 1500 },
  { id: 'indexDlCount', target: 2840, duration: 1500 }
];

// ── GitHub API Download Counter & Latest Download Link ──
let cachedExeUrl = null;

async function fetchGitHubDownloads() {
  const GITHUB_API = 'https://api.github.com/repos/Gangula-Sandaru/clippie/releases';
  
  try {
    const response = await fetch(GITHUB_API);
    if (!response.ok) return;
    const releases = await response.json();
    
    let total = 0;
    let latestExe = null;
    let latestVersion = null;

    releases.forEach((rel, index) => {
      if (rel.assets) {
        rel.assets.forEach(asset => total += (asset.download_count || 0));
        
        if (index === 0) {
          latestVersion = rel.tag_name;
          // Priority for .exe files
          const exeAsset = rel.assets.find(a => a.name.toLowerCase().endsWith('.exe'));
          if (exeAsset) {
            latestExe = exeAsset.browser_download_url;
            cachedExeUrl = latestExe;
          }
        }
      }
    });

    if (total > 0) {
      counters.forEach(c => {
        const el = document.getElementById(c.id);
        if (el) c.target = total;
      });
    }

    if (latestExe) {
      document.querySelectorAll('.latest-dl-link').forEach(link => {
        link.href = latestExe;
        link.setAttribute('download', '');
      });
      
      const vLabel = document.querySelector('.dl-version');
      if (vLabel) vLabel.textContent = `Version ${latestVersion} — Windows 10/11`;
    }

  } catch (error) {
    console.warn('API Fetch failed:', error);
  }
}

// Global click handler to ensure download starts even if link hasn't updated yet
document.addEventListener('click', (e) => {
  const dlLink = e.target.closest('.latest-dl-link');
  if (dlLink && cachedExeUrl && dlLink.href !== cachedExeUrl) {
    e.preventDefault();
    window.location.href = cachedExeUrl;
  }
});

fetchGitHubDownloads();

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const config = counters.find(c => c.id === entry.target.id);
      if (config) {
        animateValue(entry.target, 0, config.target, config.duration);
        counterObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => {
  const el = document.getElementById(c.id);
  if (el) counterObserver.observe(el);
});

// ── Smooth active nav highlight ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) link.classList.add('active');
});
