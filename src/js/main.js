import "../styles/main.css";
import { initHeaderScroll, initMobileNav } from "./nav.js";
import { initMenuAccordion } from "./accordion.js";
import { initScrollReveal } from "./reveal.js";
import { initSmoothScroll, initHeroParallax, initPreloader } from "./motion.js";

function init() {
  initPreloader();
  initHeaderScroll();
  initMobileNav();
  initMenuAccordion();
  initScrollReveal();
  initSmoothScroll();
  initHeroParallax();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
