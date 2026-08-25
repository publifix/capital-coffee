const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function staggerRevealItems(panel) {
  if (reduceMotion) return;

  const items = panel.querySelectorAll("[data-menu-item]");
  items.forEach((item, i) => {
    item.style.transitionDelay = "0ms";
    item.style.opacity = "0";
    item.style.transform = "translateY(10px)";
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      items.forEach((item, i) => {
        item.style.transitionProperty = "opacity, transform";
        item.style.transitionDuration = "450ms";
        item.style.transitionTimingFunction = "var(--ease-capital)";
        item.style.transitionDelay = `${Math.min(i, 12) * 45}ms`;
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      });
    });
  });
}

export function initMenuAccordion() {
  const categories = document.querySelectorAll("[data-menu-category]");
  if (!categories.length) return;

  const triggers = Array.from(categories).map((cat) => cat.querySelector(".menu-category__trigger"));

  function closeAll(except) {
    triggers.forEach((trigger) => {
      if (trigger === except) return;
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      trigger.setAttribute("aria-expanded", "false");
      panel?.classList.remove("is-open");
    });
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      closeAll(trigger);

      if (isOpen) {
        trigger.setAttribute("aria-expanded", "false");
        panel?.classList.remove("is-open");
      } else {
        trigger.setAttribute("aria-expanded", "true");
        panel?.classList.add("is-open");
        if (panel) staggerRevealItems(panel);
      }
    });
  });

  // Open the first category by default so the section never looks empty.
  if (triggers[0]) {
    triggers[0].setAttribute("aria-expanded", "true");
    const firstPanel = document.getElementById(triggers[0].getAttribute("aria-controls"));
    firstPanel?.classList.add("is-open");
  }
}
