/* =====================================================================
   script.js
   Comportamento do site: menu mobile, ano no rodapé, slider de
   depoimentos e validação do formulário de contato.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initFooterYear();
  initTestimonialSlider();
  initContactForm();
});

/* ---------------------------------------------------------------------
   Menu mobile: abre/fecha a navegação e fecha ao clicar em um link
--------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------------------
   Ano atual no rodapé (mantém o copyright sempre correto)
--------------------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById("anoAtual");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------
   Slider de depoimentos: troca por botões, indicadores (dots)
   e avanço automático a cada 7s (pausa ao interagir).
--------------------------------------------------------------------- */
function initTestimonialSlider() {
  const track = document.getElementById("testimonialTrack");
  const dotsWrap = document.getElementById("testimonialDots");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.querySelectorAll(".testimonial"));
  let current = 0;
  let autoplayId = null;

  // Cria um indicador (dot) para cada depoimento
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Ir para depoimento ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goToSlide(index) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(() => goToSlide(current + 1), 7000);
  }
  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
  }

  prevBtn?.addEventListener("click", () => { goToSlide(current - 1); startAutoplay(); });
  nextBtn?.addEventListener("click", () => { goToSlide(current + 1); startAutoplay(); });

  goToSlide(0);
  startAutoplay();
}

/* ---------------------------------------------------------------------
   Formulário de contato: validação simples no cliente.
   Não há backend neste template — troque o "envio simulado" abaixo
   pela sua integração real (fetch para uma API, serviço de e-mail,
   Formspree, etc.) quando for publicar o site.
--------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form) return;

  const fields = {
    nome: { el: form.nome, validate: (v) => v.trim().length >= 2, message: "Digite seu nome completo." },
    email: { el: form.email, validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: "Digite um e-mail válido." },
    mensagem: { el: form.mensagem, validate: (v) => v.trim().length >= 10, message: "Escreva uma mensagem com pelo menos 10 caracteres." },
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;

    Object.entries(fields).forEach(([name, field]) => {
      const row = field.el.closest(".form-row");
      const errorEl = form.querySelector(`[data-error-for="${name}"]`);
      const valid = field.validate(field.el.value);

      row.classList.toggle("has-error", !valid);
      if (errorEl) errorEl.textContent = valid ? "" : field.message;
      if (!valid) isValid = false;
    });

    if (!isValid) {
      status.textContent = "";
      return;
    }

    // Envio simulado — substitua pela sua integração real de envio.
    status.textContent = "Mensagem enviada! Retorno em breve.";
    form.reset();
  });

  // Remove o erro assim que a pessoa começa a corrigir o campo
  Object.values(fields).forEach((field) => {
    field.el.addEventListener("input", () => {
      field.el.closest(".form-row").classList.remove("has-error");
    });
  });
}
