(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const currentEl = document.getElementById('current-slide');
  const upBtn = document.querySelector('.nav-up');
  const downBtn = document.querySelector('.nav-down');
  let activeIndex = 0;

  function setActive(index) {
    activeIndex = index;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    if (currentEl) currentEl.textContent = String(index + 1).padStart(2, '0');
    if (upBtn) upBtn.disabled = index === 0;
    if (downBtn) downBtn.disabled = index === slides.length - 1;
    history.replaceState(null, '', '#slide-' + (index + 1));
  }

  const ratios = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      ratios.set(entry.target, entry.intersectionRatio);
    });
    let bestSlide = null;
    let bestRatio = 0;
    slides.forEach((s) => {
      const r = ratios.get(s) || 0;
      if (r > bestRatio) {
        bestRatio = r;
        bestSlide = s;
      }
    });
    if (bestSlide && bestRatio > 0.2) {
      const idx = slides.indexOf(bestSlide);
      if (idx !== -1) setActive(idx);
    }
  }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });

  slides.forEach((s) => observer.observe(s));

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      slides[idx].scrollIntoView({ behavior: 'smooth' });
    });
  });

  function goTo(delta) {
    const next = Math.min(Math.max(activeIndex + delta, 0), slides.length - 1);
    slides[next].scrollIntoView({ behavior: 'smooth' });
  }

  if (upBtn) upBtn.addEventListener('click', () => goTo(-1));
  if (downBtn) downBtn.addEventListener('click', () => goTo(1));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      goTo(1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goTo(-1);
    }
  });

  setActive(0);
})();
