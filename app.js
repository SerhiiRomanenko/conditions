document.getElementById('year').textContent = new Date().getFullYear();

const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const viewport = carousel.querySelector('[data-carousel-viewport]');
  const slides = [...carousel.querySelectorAll('.work-slide')];
  const currentLabel = carousel.querySelector('[data-carousel-current]');
  const totalLabel = carousel.querySelector('[data-carousel-total]');
  const progress = carousel.querySelector('[data-carousel-progress]');
  const progressBar = carousel.querySelector('[role="progressbar"]');
  let activeIndex = 0;
  let ticking = false;

  if (slides.length) {
    totalLabel.textContent = String(slides.length).padStart(2, '0');
    progressBar.setAttribute('aria-valuemax', String(slides.length));

    const setActive = (index) => {
      activeIndex = Math.max(0, Math.min(slides.length - 1, index));
      currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
      progress.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
      progressBar.setAttribute('aria-valuenow', String(activeIndex + 1));
    };

    const goTo = (index) => {
      const nextIndex = (index + slides.length) % slides.length;
      viewport.scrollTo({
        left: slides[nextIndex].offsetLeft - slides[0].offsetLeft,
        behavior: 'smooth'
      });
      setActive(nextIndex);
    };

    carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => goTo(activeIndex - 1));
    carousel.querySelector('[data-carousel-next]').addEventListener('click', () => goTo(activeIndex + 1));
    viewport.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        let nearest = 0;
        let distance = Infinity;
        slides.forEach((slide, index) => {
          const delta = Math.abs(slide.offsetLeft - slides[0].offsetLeft - viewport.scrollLeft);
          if (delta < distance) { distance = delta; nearest = index; }
        });
        setActive(nearest);
        ticking = false;
      });
    }, { passive: true });
    viewport.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(activeIndex + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(activeIndex - 1); }
    });

    setActive(0);
  }
}
