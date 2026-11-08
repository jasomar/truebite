/**
 * Marca como actual el beneficio que cruza el centro de la pantalla y cambia la foto
 * fija de la izquierda. La foto nueva entra barriendo desde abajo al bajar y desde
 * arriba al subir, para que el movimiento siga la dirección del scroll.
 * Sin JavaScript todos los beneficios se ven completos y solo la primera foto.
 */
export const initBenefitsScroll = (): void => {
  const section = document.querySelector<HTMLElement>('[data-benefits]');
  const stage = document.querySelector<HTMLElement>('[data-benefits-stage]');
  const items = [...document.querySelectorAll<HTMLElement>('[data-benefit]')];
  const photos = [...document.querySelectorAll<HTMLElement>('[data-benefit-photo]')];
  if (!section || !stage || items.length === 0) return;

  let current = -1;

  const setCurrent = (index: number): void => {
    if (index === current || index < 0) return;
    stage.dataset.direction = index > current ? 'down' : 'up';
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    photos.forEach((photo, i) => {
      // La foto anterior queda debajo, visible, mientras la nueva la cubre.
      photo.classList.toggle('is-previous', i === current);
      photo.classList.toggle('is-active', i === index);
    });
    current = index;
  };

  section.classList.add('is-enhanced');
  setCurrent(0);

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => setCurrent(items.indexOf(entry.target as HTMLElement)));
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  items.forEach((item) => observer.observe(item));
};
