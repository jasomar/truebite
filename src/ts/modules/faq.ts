const OPEN_MS = 320;
const CLOSE_MS = 220;
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

/**
 * Abre y cierra las preguntas frecuentes animando la altura real del <details>.
 * Si se vuelve a tocar a mitad de la animación, parte desde la altura actual y se
 * invierte sin saltos. Sin JavaScript o con movimiento reducido, se usa el
 * comportamiento nativo del navegador.
 */
export const initFaq = (): void => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll<HTMLDetailsElement>('.faq__item').forEach((details) => {
    const summary = details.querySelector('summary');
    const answer = summary?.nextElementSibling as HTMLElement | null;
    if (!summary || !answer) return;

    let animation: Animation | null = null;
    details.classList.toggle('is-open', details.open);

    const closedHeight = (): number => summary.offsetHeight + (details.offsetHeight - details.clientHeight);

    summary.addEventListener('click', (event) => {
      event.preventDefault();

      const startHeight = details.offsetHeight;
      animation?.cancel();
      details.style.overflow = 'hidden';

      const opening = !details.open || details.classList.contains('is-closing');
      details.classList.toggle('is-open', opening);
      details.classList.toggle('is-closing', !opening);

      let endHeight: number;
      if (opening) {
        details.open = true;
        endHeight = details.offsetHeight;
        answer.animate(
          [
            { opacity: 0, transform: 'translateY(-0.25rem)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: OPEN_MS, easing: EASE_OUT },
        );
      } else {
        endHeight = closedHeight();
      }

      animation = details.animate(
        { height: [`${startHeight}px`, `${endHeight}px`] },
        { duration: opening ? OPEN_MS : CLOSE_MS, easing: opening ? EASE_OUT : EASE_IN },
      );

      animation.onfinish = () => {
        animation = null;
        if (!opening) {
          details.open = false;
          details.classList.remove('is-closing');
        }
        details.style.overflow = '';
      };
    });
  });
};
