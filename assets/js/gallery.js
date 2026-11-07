const INTERVAL_MS = 5500;
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

export async function initGallery() {
  const els = {
    search: document.querySelector("#gallery-search"),
    category: document.querySelector("#gallery-category"),
    image: document.querySelector("#active-image"),
    title: document.querySelector("#active-title"),
    description: document.querySelector("#active-description"),
    activeCategory: document.querySelector("#active-category"),
    counter: document.querySelector("#stage-counter"),
    rail: document.querySelector("#thumbnail-rail"),
    prev: document.querySelector("#gallery-prev"),
    next: document.querySelector("#gallery-next"),
    play: document.querySelector("#play-toggle"),
    resultCount: document.querySelector("#gallery-result-count"),
    empty: document.querySelector("#gallery-empty"),
    reset: document.querySelector("#reset-gallery"),
    open: document.querySelector("#open-viewer"),
    dialog: document.querySelector("#image-viewer"),
    viewerImage: document.querySelector("#viewer-image"),
    viewerTitle: document.querySelector("#viewer-title"),
    viewerDescription: document.querySelector("#viewer-description"),
    viewerCounter: document.querySelector("#viewer-counter"),
    viewerClose: document.querySelector("#close-viewer"),
    viewerPrev: document.querySelector("#viewer-prev"),
    viewerNext: document.querySelector("#viewer-next"),
    stage: document.querySelector("#gallery-stage")
  };
  let all = [];
  try {
    const response = await fetch("assets/data/gallery.json");
    if (!response.ok) throw new Error("No se pudo cargar gallery.json");
    all = await response.json();
    if (!Array.isArray(all) || all.length !== 40) throw new Error("La galería debe contener exactamente 40 registros.");
  } catch (error) {
    console.error(error);
    els.resultCount.textContent = "No se pudo cargar la galería";
    els.empty.hidden = false;
    els.empty.firstChild.textContent = "No se pudo cargar el archivo de la galería. Revisa assets/data/gallery.json.";
    return;
  }
  all.sort((a, b) => a.order - b.order);
  const categories = [...new Set(all.map(item => item.category).filter(Boolean))].sort();
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category; option.textContent = category;
    els.category.append(option);
  });
  let filtered = [...all];
  let activeId = all[0].id;
  let timer = null;
  let playing = !reducedMotion;
  let lastFocused = null;

  const currentIndex = () => Math.max(0, filtered.findIndex(item => item.id === activeId));
  const current = () => filtered[currentIndex()] || null;
  const setPlayButton = () => {
    els.play.setAttribute("aria-pressed", String(!playing));
    els.play.innerHTML = playing ? "Ⅱ <span>Pausar carrusel</span>" : "▶ <span>Reanudar carrusel</span>";
  };
  const stopTimer = () => { if (timer !== null) window.clearInterval(timer); timer = null; };
  const startTimer = () => {
    stopTimer();
    if (!playing || filtered.length < 2 || els.dialog.open || document.hidden) return;
    timer = window.setInterval(() => selectByOffset(1, false), INTERVAL_MS);
  };
  const updateViewer = item => {
    if (!item) return;
    els.viewerImage.src = item.src; els.viewerImage.alt = item.alt || item.title;
    els.viewerTitle.textContent = item.title; els.viewerDescription.textContent = item.description;
    els.viewerCounter.textContent = `${String(currentIndex()+1).padStart(2,"0")} / ${String(filtered.length).padStart(2,"0")}`;
  };
  const render = () => {
    const item = current();
    els.empty.hidden = filtered.length > 0;
    els.stage.hidden = filtered.length === 0;
    els.resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "fotografía" : "fotografías"}`;
    els.rail.replaceChildren();
    filtered.forEach((photo, index) => {
      const button = document.createElement("button");
      button.className = "thumbnail";
      button.type = "button";
      button.setAttribute("aria-label", `Mostrar fotografía ${index+1}: ${photo.title}`);
      button.setAttribute("aria-current", String(photo.id === activeId));
      const image = document.createElement("img");
      image.src = photo.src; image.alt = ""; image.loading = "lazy"; image.width = 192; image.height = 124;
      const number = document.createElement("span"); number.textContent = String(index+1).padStart(2,"0");
      button.append(image, number);
      button.addEventListener("click", () => { activeId = photo.id; render(); startTimer(); });
      els.rail.append(button);
      if (photo.id === activeId) requestAnimationFrame(() => button.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reducedMotion ? "auto" : "smooth" }));
    });
    if (!item) return;
    els.image.src = item.src; els.image.alt = item.alt || item.title;
    els.title.textContent = item.title; els.description.textContent = item.description;
    els.activeCategory.textContent = item.category;
    els.counter.textContent = `${String(currentIndex()+1).padStart(2,"0")} / ${String(filtered.length).padStart(2,"0")}`;
    if (els.dialog.open) updateViewer(item);
  };
  function selectByOffset(offset, userAction = true) {
    if (!filtered.length) return;
    const next = (currentIndex() + offset + filtered.length) % filtered.length;
    activeId = filtered[next].id;
    render();
    if (userAction) startTimer();
  }
  const applyFilters = () => {
    const term = els.search.value.trim().toLocaleLowerCase("es");
    const category = els.category.value;
    filtered = all.filter(item => {
      const searchable = [item.title, item.description, item.category, ...(item.tags || [])].join(" ").toLocaleLowerCase("es");
      return (!term || searchable.includes(term)) && (!category || item.category === category);
    });
    if (!filtered.some(item => item.id === activeId)) activeId = filtered[0]?.id || null;
    render(); startTimer();
  };
  els.search.addEventListener("input", applyFilters);
  els.category.addEventListener("change", applyFilters);
  els.reset.addEventListener("click", () => { els.search.value = ""; els.category.value = ""; applyFilters(); els.search.focus(); });
  els.prev.addEventListener("click", () => selectByOffset(-1));
  els.next.addEventListener("click", () => selectByOffset(1));
  els.play.addEventListener("click", () => { playing = !playing; setPlayButton(); startTimer(); });
  els.open.addEventListener("click", () => {
    if (!current() || typeof els.dialog.showModal !== "function") return;
    lastFocused = document.activeElement;
    updateViewer(current());
    els.dialog.showModal(); document.body.classList.add("viewer-open"); stopTimer(); els.viewerClose.focus();
  });
  const closeViewer = () => {
    if (!els.dialog.open) return;
    els.dialog.close(); document.body.classList.remove("viewer-open");
    lastFocused?.focus?.(); startTimer();
  };
  els.viewerClose.addEventListener("click", closeViewer);
  els.dialog.addEventListener("click", event => { if (event.target === els.dialog) closeViewer(); });
  els.dialog.addEventListener("close", () => { document.body.classList.remove("viewer-open"); startTimer(); });
  els.viewerPrev.addEventListener("click", () => selectByOffset(-1));
  els.viewerNext.addEventListener("click", () => selectByOffset(1));
  document.addEventListener("keydown", event => {
    if (els.dialog.open) {
      if (event.key === "ArrowLeft") { event.preventDefault(); selectByOffset(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); selectByOffset(1); }
      return;
    }
    const tag = document.activeElement?.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    if (event.key === "ArrowLeft") selectByOffset(-1);
    if (event.key === "ArrowRight") selectByOffset(1);
  });
  document.addEventListener("visibilitychange", () => document.hidden ? stopTimer() : startTimer());
  els.stage.addEventListener("mouseenter", stopTimer);
  els.stage.addEventListener("mouseleave", startTimer);
  els.stage.addEventListener("focusin", stopTimer);
  els.stage.addEventListener("focusout", startTimer);
  setPlayButton(); render(); startTimer();
}
