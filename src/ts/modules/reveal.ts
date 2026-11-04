const STAGGER_MS = 70;

/**
 * Solo oculta lo que está debajo del área visible al cargar, así no hay parpadeo.
 * Sin JavaScript o con movimiento reducido, todo el contenido queda visible.
 */
export const initReveal = (): void => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          const element = entry.target as HTMLElement;
          element.style.transitionDelay = `${index * STAGGER_MS}ms`;
          element.classList.remove('is-pending');
          observer.unobserve(element);
        });
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('is-pending');
      observer.observe(element);
    }
  });
};
