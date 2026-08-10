// ========================================
// KM26 PERFORMANCE
// SCRIPT DEFINITIVO
// ========================================

// ---------- Audios ----------
const motorSound = document.getElementById("motorSound");
const whatsappSound = document.getElementById("whatsappSound");
const todosLosAudios = [motorSound, whatsappSound].filter(Boolean);

// ========================================
// DESBLOQUEO DE AUDIO EN MOBILE
// ========================================
// Los navegadores de celular (Chrome/Safari Android e iOS) no dejan
// reproducir sonido con JS hasta que hubo una interacción real del
// usuario en la página, y a veces ni con eso alcanza si el audio no
// se "preparó" antes. Este truco (reproducir a volumen 0 y pausar de
// inmediato en el primer toque) deja los audios listos para sonar
// normalmente en el resto de la visita.

let audioDesbloqueado = false;

function desbloquearAudio() {

    if (audioDesbloqueado) return;
    audioDesbloqueado = true;

    todosLosAudios.forEach(audio => {

        const volumenOriginal = audio.volume;
        audio.volume = 0;

        audio.play()
            .then(() => {
                audio.pause();
                audio.currentTime = 0;
                audio.volume = volumenOriginal;
            })
            .catch(() => {
                audio.volume = volumenOriginal;
            });

    });

    document.removeEventListener("touchstart", desbloquearAudio);
    document.removeEventListener("click", desbloquearAudio);

}

document.addEventListener("touchstart", desbloquearAudio, { once: true });
document.addEventListener("click", desbloquearAudio, { once: true });

// ========================================
// MENÚ MOBILE (hamburguesa)
// ========================================

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {

    navToggle.addEventListener("click", () => {

        const abierto = mainNav.classList.toggle("open");
        navToggle.classList.toggle("open", abierto);
        navToggle.setAttribute("aria-expanded", abierto ? "true" : "false");

    });

}

function cerrarMenuMobile() {

    if (mainNav && mainNav.classList.contains("open")) {

        mainNav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");

    }

}

// ========================================
// BOTONES SOLICITAR TURNO
// ========================================

const botonesTurno = document.querySelectorAll("#btnTurno, #btnTurno2");

botonesTurno.forEach(btn => {

    btn.addEventListener("click", (e) => {

        e.preventDefault();
        e.stopImmediatePropagation();

        if (motorSound) {

            motorSound.currentTime = 0;
            motorSound.play().catch(() => {});

        }

        cerrarMenuMobile();

        const calendario = document.getElementById("calendarioTurno");

        if (calendario) {

            calendario.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        }

    });

});

// ---------- Scroll suave menú ----------
document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        const destino = document.querySelector(this.getAttribute("href"));

        if (!destino) return;

        e.preventDefault();

        cerrarMenuMobile();

        destino.scrollIntoView({
            behavior: "smooth"
        });

    });

});

// ========================================
// HEADER AL HACER SCROLL
// ========================================

const header = document.querySelector("header");
const whatsappFlotante = document.getElementById("whatsappFlotante");

window.addEventListener("scroll", () => {

    if (!header) return;

    header.classList.toggle("header-scroll", window.scrollY > 80);

    if (whatsappFlotante) {
        whatsappFlotante.classList.toggle("visible", window.scrollY > 500);
    }

});

// ========================================
// APARICIÓN DE SECCIONES
// ========================================

const revealItems = document.querySelectorAll(
    ".card, .marca, .foto, .pago-item, .titulo, .formulario"
);

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.15

});

revealItems.forEach(item => {

    revealObserver.observe(item);

});

// ========================================
// BOTONES SOCIALES (sonido antes de abrir el link)
// Reutilizamos el mismo sonido para WhatsApp e Instagram
// (no hay un audio dedicado para Instagram todavía).
// ========================================

const botonesSociales = document.querySelectorAll(
    ".btn-hero-secundario, .btn-cta-secundario, .whatsapp-float, .btn-social, .btn-confirmar-whatsapp"
);

botonesSociales.forEach(btn => {

    btn.addEventListener("click", function (e) {

        // El link ya tiene el href correcto (wa.me o instagram.com),
        // así que solo agregamos el sonido y dejamos
        // que el navegador abra el link con un pequeño delay.
        if (whatsappSound) {

            e.preventDefault();

            whatsappSound.pause();
            whatsappSound.currentTime = 0;
            whatsappSound.play().catch(() => {});

            const destino = btn.href;

            setTimeout(() => {
                window.open(destino, "_blank");
            }, 500);

        }

    });

});

// ========================================
// AÑO AUTOMÁTICO EN FOOTER
// ========================================

const year = document.getElementById("year");

if (year) {

    year.textContent = new Date().getFullYear();

}

// ========================================
// BOTÓN VOLVER ARRIBA (tecla Home)
// ========================================

window.addEventListener("keydown", (e) => {

    if (e.key === "Home") {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

});

// ========================================
// LIGHTBOX GALERÍA
// ========================================

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.querySelector(".lightbox-close");
const fotosGaleria = document.querySelectorAll(".foto img");

function abrirLightbox(img) {

    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";

}

function cerrarLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove("open");
    document.body.style.overflow = "";

}

fotosGaleria.forEach(img => {

    img.addEventListener("click", () => abrirLightbox(img));

});

if (lightboxClose) {
    lightboxClose.addEventListener("click", cerrarLightbox);
}

if (lightbox) {

    lightbox.addEventListener("click", (e) => {

        if (e.target === lightbox) cerrarLightbox();

    });

}

window.addEventListener("keydown", (e) => {

    if (e.key === "Escape") cerrarLightbox();

});

// ========================================
// PRELOAD DE IMAGEN PRINCIPAL
// ========================================

const portada = new Image();
portada.src = "images/portada.jpg";

// ========================================
// FIN
// ========================================

// ========================================
// PREGUNTAS FRECUENTES (acordeón)
// ========================================

document.querySelectorAll(".faq-pregunta").forEach(boton => {

    boton.addEventListener("click", () => {

        const item = boton.closest(".faq-item");
        const yaAbierto = item.classList.contains("abierto");

        document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("abierto"));

        if (!yaAbierto) {
            item.classList.add("abierto");
        }

    });

});


console.log("KM26 Performance - Sitio cargado correctamente.");
