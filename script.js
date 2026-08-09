// ========================================
// KM26 PERFORMANCE
// SCRIPT DEFINITIVO
// ========================================

// ---------- Audios ----------
const motorSound = document.getElementById("motorSound");
const okSound = document.getElementById("okSound");
const whatsappSound = document.getElementById("whatsappSound");

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

    btn.addEventListener("click", () => {

        if (motorSound) {

            motorSound.currentTime = 0;
            motorSound.play().catch(() => {});

        }

        cerrarMenuMobile();

        const formulario = document.getElementById("formTurno");

        if (formulario) {

            formulario.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        }

    });

});

// ---------- Formulario: arma el mensaje y lo manda por WhatsApp ----------
const form = document.getElementById("formTurno");
const NUMERO_WHATSAPP_NEGOCIO = "5491151270218";

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const nombre = form.nombre.value.trim();
        const telefono = form.telefono.value.trim();
        const email = form.email.value.trim();
        const vehiculo = form.vehiculo.value.trim();
        const mensaje = form.mensaje.value.trim();

        if (!nombre || !telefono) {
            alert("Por favor completá al menos tu nombre y teléfono.");
            return;
        }

        let texto = "🔧 *Nueva solicitud de turno - KM26 Performance*\n\n";
        texto += `*Nombre:* ${nombre}\n`;
        texto += `*Teléfono:* ${telefono}\n`;
        if (email) texto += `*Email:* ${email}\n`;
        if (vehiculo) texto += `*Vehículo:* ${vehiculo}\n`;
        if (mensaje) texto += `*Mensaje:* ${mensaje}\n`;

        if (okSound) {
            okSound.currentTime = 0;
            okSound.play().catch(() => {});
        }

        const destino = `https://wa.me/${NUMERO_WHATSAPP_NEGOCIO}?text=${encodeURIComponent(texto)}`;

        setTimeout(() => {
            window.open(destino, "_blank");
        }, 500);

        form.reset();

    });

}

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

window.addEventListener("scroll", () => {

    if (!header) return;

    header.classList.toggle("header-scroll", window.scrollY > 80);

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
// WHATSAPP (sonido antes de abrir el chat)
// ========================================

const whatsappButtons = document.querySelectorAll(
    ".btn-whatsapp-top, .whatsapp-float"
);

whatsappButtons.forEach(btn => {

    btn.addEventListener("click", function (e) {

        // El link ya tiene el href correcto de wa.me,
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

console.log("KM26 Performance - Sitio cargado correctamente.");
