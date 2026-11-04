const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * Muestra los beneficios uno por uno al hacer scroll, marca el actual y cambia
 * la foto y el contador. Sin JavaScript o con movimiento reducido, todos quedan
 * visibles desde el inicio.
 */
export const initBenefitsScroll = (): void => {
  const items = [...document.querySelectorAll<HTMLElement>('[data-benefit]')];
  const photos = [...document.querySelectorAll<HTMLElement>('[data-benefit-photo]')];
  const progress = document.querySelector<HTMLElement>('[data-benefits-progress]');
  const counter = document.querySelector<HTMLElement>('[data-benefits-counter]');
  const bar = document.querySelector<HTMLElement>('[data-benefits-bar]');
  if (items.length === 0 || !progress || !counter || !bar) return;

  const setCurrent = (index: number): void => {
    counter.textContent = `${pad(index + 1)} / ${pad(items.length)}`;
    bar.style.transform = `scaleX(${(index + 1) / items.length})`;
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    photos.forEach((photo, i) => photo.classList.toggle('is-active', i === index));
  };

  progress.hidden = false;
  setCurrent(0);

  // El beneficio actual es el que cruza la línea central de la pantalla.
  const currentObserver = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => setCurrent(items.indexOf(entry.target as HTMLElement)));
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  items.forEach((item) => currentObserver.observe(item));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          entry.target.classList.remove('is-pending');
          revealObserver.unobserve(entry.target);
        });
    },
    { rootMargin: '0px 0px -25% 0px' },
  );

  items.forEach((item) => {
    // Lo que ya está en pantalla o arriba de ella no se oculta, para evitar parpadeos.
    if (item.getBoundingClientRect().top > window.innerHeight) {
      item.classList.add('is-pending');
      revealObserver.observe(item);
    }
  });
};
