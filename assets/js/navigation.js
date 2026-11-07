export function initNavigation() {
  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#primary-nav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const panels = [...document.querySelectorAll(".page-panel")];
  const homeStrip = document.querySelector(".home-strip");

  function closeMenu() {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Abrir menú");
  }

  function showPanel(id, updateHash = true) {
    const target = panels.find(panel => panel.id === id);
    if (!target) return;
    panels.forEach(panel => {
      const active = panel === target;
      panel.classList.toggle("is-current", active);
      panel.setAttribute("aria-hidden", String(!active));
    });
    homeStrip?.classList.toggle("is-current", id === "inicio");
    navLinks.forEach(link => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    closeMenu();
    if (updateHash && location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav?.classList.toggle("is-open", open);
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href")?.slice(1);
      if (!panels.some(panel => panel.id === id)) return;
      event.preventDefault();
      showPanel(id);
    });
  });

  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
  const initial = location.hash.slice(1);
  showPanel(panels.some(panel => panel.id === initial) ? initial : "inicio", false);
}
