export function initContact(content) {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  const emailLabel = document.querySelector("#contact-email-label");
  const submit = document.querySelector("#contact-submit");
  const email = content?.organization?.email?.trim() || "";
  const socials = content?.organization?.socials || {};
  const socialRoot = document.querySelector("#social-links");
  const names = { instagram: "Instagram", facebook: "Facebook", youtube: "YouTube", tiktok: "TikTok" };
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailLabel.textContent = email;
    const link = document.createElement("a");
    link.href = `mailto:${email}`; link.textContent = email; link.className = "contact-email-link";
    emailLabel.replaceChildren(link);
  } else {
    emailLabel.textContent = "Correo pendiente de configurar";
    submit.disabled = true;
    submit.title = "Configura un correo oficial válido en assets/data/site-content.json";
    submit.classList.add("is-disabled");
  }
  Object.entries(names).forEach(([key, label]) => {
    const url = socials[key]?.trim();
    if (!url) return;
    try {
      const parsed = new URL(url);
      if (!["https:", "http:"].includes(parsed.protocol)) return;
      const a = document.createElement("a");
      a.className = "social-link"; a.href = parsed.href; a.textContent = label;
      a.target = "_blank"; a.rel = "noopener noreferrer"; a.setAttribute("aria-label", `${label}, abre en una pestaña nueva`);
      socialRoot.append(a);
    } catch (_) { /* Se omite cualquier URL no válida. */ }
  });
  if (!socialRoot.children.length) {
    const message = document.createElement("span");
    message.className = "small-note"; message.textContent = "Redes sociales pendientes de configurar.";
    socialRoot.append(message);
  }
  form?.addEventListener("submit", event => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.classList.add("is-error");
      status.textContent = "No hay un correo oficial válido configurado. Edita assets/data/site-content.json antes de habilitar el contacto.";
      return;
    }
    if (!form.reportValidity()) {
      status.classList.add("is-error");
      status.textContent = "Revisa los campos obligatorios y corrige los datos indicados.";
      return;
    }
    const data = new FormData(form);
    const subject = String(data.get("subject")).trim();
    const body = [
      `Nombre: ${String(data.get("name")).trim()}`,
      `Correo de respuesta: ${String(data.get("email")).trim()}`,
      "",
      "Mensaje:",
      String(data.get("message")).trim()
    ].join("\n");
    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Se abrirá tu aplicación de correo con el mensaje preparado. Revísalo y pulsa Enviar en esa aplicación.";
    window.location.href = mailto;
  });
}
