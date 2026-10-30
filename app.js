/**
 * DGE AUDIOVISUAL · INTERACTIVIDAD & EMBUDO DE CONVERSIÓN WHATSAPP
 * Sede Bucaramanga, Santander | WhatsApp: +57 320 835 3796
 */

document.addEventListener("DOMContentLoaded", () => {
  setupNavbar();
  setupPortfolioFilter();
  setupQuoteCalculator();
  setupVideoModal();
  updateLiveQuote(); // Inicializar cotización por defecto
});

/* --------------------------------------------------------------------------
   1. NAVEGACIÓN, MENÚ MÓVIL Y EFECTO SCROLL
   -------------------------------------------------------------------------- */
function setupNavbar() {
  const header = document.getElementById("mainHeader");
  const menuBtn = document.getElementById("mobileMenuBtn");
  const nav = document.getElementById("siteNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  // Toggle menú móvil
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", isOpen);
    });

    // Cerrar al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header translúcido al hacer scroll y detección de sección activa
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    let currentSection = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSection = sec.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. FILTRO DE PESTAÑAS EN PORTAFOLIO / SHOWREEL
   -------------------------------------------------------------------------- */
function setupPortfolioFilter() {
  const tabs = document.querySelectorAll(".portfolio-tabs .tab-btn");
  const cards = document.querySelectorAll(".portfolio-card");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        if (filter === "todos" || card.dataset.category === filter) {
          card.style.display = "block";
          card.style.opacity = "1";
        } else {
          card.style.display = "none";
          card.style.opacity = "0";
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   3. CALCULADORA DINÁMICA DE COTIZACIÓN & REDIRECCIÓN A WHATSAPP
   -------------------------------------------------------------------------- */
function formatCOP(num) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(num);
}

function updateLiveQuote() {
  const staySelect = document.getElementById("stayType");
  const locationSelect = document.getElementById("locationSelect");
  const selectedPackage = document.querySelector('input[name="basePackage"]:checked');
  const extraModels = document.getElementById("extraModels");
  const extraNight = document.getElementById("extraNight");
  const extraFast = document.getElementById("extraFast");

  const totalEl = document.getElementById("calcTotalPrice");
  const packageNameEl = document.getElementById("calcPackageName");
  const previewBox = document.getElementById("quoteWhatsappPreview");

  if (!selectedPackage || !totalEl) return;

  const stayTypeName = staySelect.value;
  const stayExtraCost = parseInt(staySelect.options[staySelect.selectedIndex].dataset.extra || 0);
  const locationName = locationSelect.value;
  const packageName = selectedPackage.value;
  let total = parseInt(selectedPackage.dataset.price || 0) + stayExtraCost;

  const extrasChosen = [];
  if (extraModels && extraModels.checked) {
    total += parseInt(extraModels.dataset.cost);
    extrasChosen.push("Pareja de Modelos");
  }
  if (extraNight && extraNight.checked) {
    total += parseInt(extraNight.dataset.cost);
    extrasChosen.push("Astrofotografía & Tomas Nocturnas");
  }
  if (extraFast && extraFast.checked) {
    total += parseInt(extraFast.dataset.cost);
    extrasChosen.push("Entrega Exprés 48h");
  }

  // Actualizar UI
  totalEl.textContent = `${formatCOP(total)} COP`;
  packageNameEl.textContent = `Paquete: ${packageName} · ${stayTypeName}`;

  // Redactar mensaje preformateado para WhatsApp
  const extrasString = extrasChosen.length > 0 ? extrasChosen.join(", ") : "Ninguno";
  const message = `🎬 *¡Hola DGE Audiovisual!* Estuve en su página web y quiero coordinar una producción:\n\n` +
    `🏡 *Propiedad:* ${stayTypeName}\n` +
    `📍 *Ubicación:* ${locationName}\n` +
    `📦 *Paquete Seleccionado:* ${packageName}\n` +
    `✨ *Módulos Extras:* ${extrasString}\n` +
    `💰 *Presupuesto Estimado:* ${formatCOP(total)} COP\n\n` +
    `¿Tienen disponibilidad en su agenda para coordinar fechas y detalles del rodaje?`;

  previewBox.textContent = `"${message.replace(/\n/g, ' ')}"`;
  previewBox.dataset.encodedMessage = encodeURIComponent(message);
}

function sendQuoteToWhatsapp() {
  const previewBox = document.getElementById("quoteWhatsappPreview");
  const encodedText = previewBox ? previewBox.dataset.encodedMessage : "";
  const whatsappUrl = `https://wa.me/573208353796?text=${encodedText}`;
  
  showToast("🚀 Abriendo WhatsApp con tu cotización...");
  window.open(whatsappUrl, "_blank");
}

function selectPackageForQuote(packageName, price) {
  const radios = document.querySelectorAll('input[name="basePackage"]');
  radios.forEach(r => {
    if (r.value === packageName) {
      r.checked = true;
    }
  });

  updateLiveQuote();

  const calcSection = document.getElementById("cotizador");
  if (calcSection) {
    calcSection.scrollIntoView({ behavior: "smooth" });
  }

  showToast(`✓ Paquete "${packageName}" seleccionado en el cotizador`);
}

/* --------------------------------------------------------------------------
   4. FORMULARIO DE CONTACTO DIRECTO
   -------------------------------------------------------------------------- */
function handleDirectContact(event) {
  event.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !phone) {
    showToast("⚠️ Por favor completa tu nombre y teléfono.");
    return;
  }

  const text = `🎬 *Nuevo Contacto desde la Web DGE*\n\n` +
    `👤 *Nombre / Alojamiento:* ${name}\n` +
    `📱 *WhatsApp:* ${phone}\n` +
    `📝 *Detalles de la propiedad:* ${message || "Deseo recibir asesoría para mi glamping."}\n\n` +
    `_Enviado desde el formulario oficial DGE_`;

  const url = `https://wa.me/573208353796?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
  showToast("🚀 Abriendo chat directo con Dirección de Producción...");
}

/* --------------------------------------------------------------------------
   5. REPRODUCTOR MODAL DE SHOWREEL
   -------------------------------------------------------------------------- */
function setupVideoModal() {
  const modal = document.getElementById("videoModalOverlay");
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });
}

function openVideoModal(title, location, desc) {
  const modal = document.getElementById("videoModalOverlay");
  const titleEl = document.getElementById("modalProjectTitle");
  const descEl = document.getElementById("modalProjectDesc");
  const player = document.getElementById("modalVideoPlayer");

  if (!modal) return;

  titleEl.textContent = `${title} · ${location}`;
  descEl.textContent = desc;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (player) {
    player.currentTime = 0;
    player.play().catch(() => {});
  }
}

function closeVideoModal() {
  const modal = document.getElementById("videoModalOverlay");
  const player = document.getElementById("modalVideoPlayer");

  if (!modal) return;

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (player) {
    player.pause();
  }
}

/* --------------------------------------------------------------------------
   6. NOTIFICACIONES TOAST EN PANTALLA
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}
