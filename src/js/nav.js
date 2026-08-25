const HEADER_SOLID_THRESHOLD = 60;
const HEADER_HIDE_THRESHOLD = 140;

export function initHeaderScroll() {
  const header = document.getElementById("site-header");
  const progress = document.getElementById("scroll-progress");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;

    header.classList.toggle("header--solid", y > HEADER_SOLID_THRESHOLD);

    const mobileNavOpen = document.getElementById("mobile-nav")?.classList.contains("is-open");
    if (!mobileNavOpen) {
      const scrollingDown = y > lastY;
      const pastThreshold = y > HEADER_HIDE_THRESHOLD;
      header.classList.toggle("header--hidden", scrollingDown && pastThreshold);
    }

    if (progress) {
      progress.style.transform = `scaleX(${fraction})`;
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}

export function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const close = document.getElementById("nav-close");
  const overlay = document.getElementById("mobile-nav");
  if (!toggle || !overlay) return;

  const closeTriggers = overlay.querySelectorAll("[data-nav-close]");

  function openMenu() {
    overlay.classList.add("is-open");
    overlay.classList.remove("translate-x-full");
    overlay.classList.add("translate-x-0");
    overlay.setAttribute("aria-hidden", "false");
    overlay.removeAttribute("inert");
    toggle.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("overflow-hidden");
  }

  function closeMenu() {
    overlay.classList.remove("is-open");
    overlay.classList.remove("translate-x-0");
    overlay.classList.add("translate-x-full");
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("inert", "");
    toggle.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("overflow-hidden");
  }

  // Start closed and out of the tab/hit-test order.
  overlay.setAttribute("inert", "");

  toggle.addEventListener("click", () => {
    const isOpen = overlay.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  close?.addEventListener("click", closeMenu);

  closeTriggers.forEach((el) => el.addEventListener("click", closeMenu));

  // Tap on the overlay's own background (not a link/button) also closes it.
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });
}
