import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initSmoothScroll() {
  if (reduceMotion) return;

  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    touchMultiplier: 1.1,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

export function initHeroParallax() {
  if (reduceMotion) return;

  const media = document.querySelector("[data-parallax] img");
  const hero = document.querySelector(".hero");
  if (!media || !hero) return;

  gsap.to(media, {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

export function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  let hidden = false;
  const hide = () => {
    if (hidden) return;
    hidden = true;
    preloader.classList.add("is-hidden");
    window.setTimeout(() => preloader.remove(), 600);
  };

  if (document.readyState === "complete") {
    hide();
    return;
  }

  window.addEventListener("load", hide, { once: true });
  window.setTimeout(hide, 1200);
}
