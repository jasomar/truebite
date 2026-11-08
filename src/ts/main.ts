import { inject } from "@vercel/analytics";
import '@fontsource-variable/fredoka/wght.css';
import '@fontsource-variable/nunito/wght.css';
import '../scss/main.scss';
import { initAuthModal } from './modules/auth-modal';
import { initBenefitsScroll } from './modules/benefits-scroll';
import { initFaq } from './modules/faq';
import { initNav } from './modules/nav';
import { initReveal } from './modules/reveal';
import { initStickyCta } from './modules/sticky-cta';

inject();

initNav();
initAuthModal();
initReveal();
initBenefitsScroll();
initFaq();
initStickyCta();
