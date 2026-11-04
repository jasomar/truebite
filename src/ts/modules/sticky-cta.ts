/** Oculta el botón fijo de móvil mientras otro botón principal de pedido está en pantalla. */
export const initStickyCta = (): void => {
  const bar = document.querySelector<HTMLElement>('[data-sticky-cta]');
  const targets = document.querySelectorAll<HTMLElement>('[data-primary-cta]');
  if (!bar || targets.length === 0) return;

  const visible = new Set<Element>();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    bar.classList.toggle('is-hidden', visible.size > 0);
  });

  targets.forEach((target) => observer.observe(target));
};
