import { initTheme } from "./theme.js";
import { initNavigation } from "./navigation.js";
import { initGallery } from "./gallery.js";

async function loadContent() {
  try {
    const response = await fetch("assets/data/site-content.json");
    if (!response.ok) throw new Error("No se pudo cargar site-content.json");
    const data = await response.json();
    const org = data.organization || {};
    const fields = {
      "#hero-tagline": org.tagline, "#hero-intro": org.intro,
      "#about-description": org.description, "#about-history": org.history,
      "#about-objectives": org.objectives, "#mission-text": org.mission,
      "#vision-text": org.vision
    };
    Object.entries(fields).forEach(([selector, value]) => {
      const node = document.querySelector(selector);
      if (node && typeof value === "string") node.textContent = value;
    });

    // Admite listas de objetos, listas de texto y el formato antiguo en texto.
    function renderDetails(selector, items, fallbackTitle) {
      const container = document.querySelector(selector);
      if (!container) return;
      let normalized = [];
      if (Array.isArray(items)) {
        normalized = items.map((item) => {
          if (typeof item === "string") return { title: "", description: item };
          if (item && typeof item === "object") {
            return { title: String(item.title || item.name || ""), description: String(item.description || item.text || "") };
          }
          return null;
        }).filter((item) => item && (item.title.trim() || item.description.trim()));
      } else if (typeof items === "string" && items.trim()) {
        normalized = items.split(/\n+/).map((line) => line.replace(/^\s*[•*-]\s*/, "").trim()).filter(Boolean).map((line) => {
          const separator = line.indexOf(":");
          return separator > 0 && separator < 65
            ? { title: line.slice(0, separator).trim(), description: line.slice(separator + 1).trim() }
            : { title: "", description: line };
        });
      }
      if (!normalized.length) return; // Conserva las tarjetas incluidas en HTML como respaldo.
      const fragment = document.createDocumentFragment();
      normalized.forEach((item) => {
        const card = document.createElement("article");
        card.className = "detail-item";
        if (item.title) {
          const heading = document.createElement("h4");
          heading.textContent = item.title;
          card.appendChild(heading);
        }
        const paragraph = document.createElement("p");
        paragraph.textContent = item.description;
        card.appendChild(paragraph);
        fragment.appendChild(card);
      });
      container.replaceChildren(fragment);
    }
    renderDetails("#principles-text", org.principles, "los principios");
    renderDetails("#values-text", org.values, "los valores");
    document.title = `${org.name || "Asociación de Veteranos de la Fuerza Pública de Buenavista, Córdoba"} | Sitio institucional`;
  } catch (error) {
    console.error(error);
    const status = document.querySelector("#form-status");
    if (status) status.textContent = "No se pudo cargar la configuración institucional. Revisa assets/data/site-content.json.";
  }
}
initTheme();
initNavigation();
document.querySelector("#current-year").textContent = String(new Date().getFullYear());
loadContent();
initGallery();
