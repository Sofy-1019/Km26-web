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

const botonesTurno = document.querySelectorAll("#btnTurno, #btnTurno2, #btnTurnoMobile");

botonesTurno.forEach(btn => {

    btn.addEventListener("click", () => {

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

            entry.target.style.transition = ".7s ease";
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

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
    ".btn-whatsapp-top, .whatsapp-float, .btn-instagram-top, .btn-call-top"
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

// ========================================
// UBICAR LOGO Y BOTONES SOBRE LA FOTO
// ========================================
// Como la foto ahora se ve completa (object-fit:contain, sin recortar
// nada), calculamos en JS dónde queda realmente la persiana y la pared
// dentro del recuadro, para que el logo y los botones caigan siempre
// en el lugar correcto sin importar el tamaño de pantalla.

function ubicarSobreLaFoto() {

    const hero = document.querySelector(".hero");
    const logo = document.querySelector(".hero-logo");
    const botones = document.querySelector(".hero-buttons-bottom");

    if (!hero || !logo) return;

    const contenedorAncho = hero.clientWidth;
    const contenedorAlto = hero.clientHeight;

    // Tamaño real de portada.jpg
    const fotoAncho = 1536;
    const fotoAlto = 1024;

    const escala = Math.min(contenedorAncho / fotoAncho, contenedorAlto / fotoAlto);
    const anchoVisible = fotoAncho * escala;
    const altoVisible = fotoAlto * escala;

    const margenX = (contenedorAncho - anchoVisible) / 2;
    const margenY = (contenedorAlto - altoVisible) / 2;

    // Logo: centrado sobre la persiana (29.8% del ancho de la foto),
    // en la franja de pared antes de que empiece la apertura (10% del alto).
    let logoX = margenX + anchoVisible * 0.298;
    let logoY = margenY + altoVisible * 0.10;

    // Seguro: que el logo nunca pueda quedar cortado por ningún borde,
    // ni tapado por el header, sea cual sea el cálculo de arriba.
    const mitadLogo = logo.offsetWidth / 2 || 100;
    logoX = Math.min(Math.max(logoX, mitadLogo + 8), contenedorAncho - mitadLogo - 8);

    const headerEl = document.querySelector("header");
    const alturaHeader = headerEl ? headerEl.offsetHeight : 80;
    logoY = Math.max(logoY, alturaHeader + 10);

    logo.style.left = logoX + "px";
    logo.style.top = logoY + "px";

    // Botones: centrados sobre la pared entre la ventana y la puerta
    // (66.6% del ancho, 68% del alto), solo cuando están visibles
    // (en mobile/tablet se ocultan y no hace falta calcular nada).
    if (botones && getComputedStyle(botones).display !== "none") {

        let botonesX = margenX + anchoVisible * 0.72;
        let botonesY = margenY + altoVisible * 0.87;

        const mitadBotones = botones.offsetWidth / 2 || 150;
        botonesX = Math.min(Math.max(botonesX, mitadBotones + 8), contenedorAncho - mitadBotones - 8);
        botonesY = Math.min(botonesY, contenedorAlto - botones.offsetHeight - 12);

        botones.style.left = botonesX + "px";
        botones.style.top = botonesY + "px";

    }

}

window.addEventListener("load", ubicarSobreLaFoto);
window.addEventListener("resize", ubicarSobreLaFoto);
document.addEventListener("DOMContentLoaded", ubicarSobreLaFoto);
ubicarSobreLaFoto();

console.log("KM26 Performance - Sitio cargado correctamente.");
