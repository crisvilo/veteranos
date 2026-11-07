const STORAGE_KEY = "fv-theme";
export function initTheme() {
  const button = document.querySelector("#theme-toggle");
  const root = document.documentElement;
  const apply = (theme) => {
    root.dataset.theme = theme;
    const dark = theme === "dark";
    button?.setAttribute("aria-pressed", String(dark));
    button?.setAttribute("aria-label", dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
    const label = button?.querySelector(".theme-label");
    if (label) label.textContent = dark ? "Oscuro" : "Claro";
    const icon = button?.querySelector(".theme-icon");
    if (icon) icon.textContent = dark ? "☼" : "◐";
  };
  apply(root.dataset.theme || "light");
  button?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (_) { /* El tema sigue funcionando sin almacenamiento. */ }
  });
}
