// ========================================
// KM26 PERFORMANCE
// SCRIPT DEFINITIVO
// ========================================

// ---------- Audios ----------
const motorSound = document.getElementById("motorSound");
const okSound = document.getElementById("okSound");
const whatsappSound = document.getElementById("whatsappSound");
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

        const formulario = document.getElementById("formTurno");

        if(formulario){

            formulario.scrollIntoView({

                behavior:"smooth",
                block:"start"

            });

        }

    });

});

// ---------- Formulario ----------
const form = document.getElementById("formTurno");

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        if (okSound) {
            okSound.currentTime = 0;
            okSound.play().catch(() => {});
        }

        alert("¡Turno solicitado correctamente! Nos comunicaremos con vos a la brevedad.");

        form.reset();

    });

}

// ---------- Scroll suave menú ----------
document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        const destino = document.querySelector(this.getAttribute("href"));

        if (!destino) return;

        e.preventDefault();

        destino.scrollIntoView({
            behavior: "smooth"
        });

    });

});// ========================================
// HEADER AL HACER SCROLL
// ========================================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 80) {

        header.style.background = "rgba(0,0,0,.92)";
        header.style.backdropFilter = "blur(10px)";
        header.style.boxShadow = "0 8px 30px rgba(0,0,0,.35)";

    } else {

        header.style.background = "transparent";
        header.style.backdropFilter = "none";
        header.style.boxShadow = "none";

    }

});

// ========================================
// CONTADORES ANIMADOS
// ========================================

const counters = document.querySelectorAll(".stat h2");

const animateCounter = (counter) => {

    const target = Number(counter.dataset.target);

    if (!target) return;

    let value = 0;

    const step = Math.max(1, Math.ceil(target / 120));

    const timer = setInterval(() => {

        value += step;

        if (value >= target) {

            value = target;
            clearInterval(timer);

        }

        counter.textContent = "+" + value;

    }, 15);

};

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        animateCounter(entry.target);

        counterObserver.unobserve(entry.target);

    });

}, {

    threshold: 0.5

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});

// ========================================
// APARICIÓN DE SECCIONES
// ========================================

const revealItems = document.querySelectorAll(
".card, .marca, .foto, .stat, .titulo, .formulario"
);

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            entry.target.style.transition = ".7s";

        }

    });

}, {

    threshold: 0.15

});

revealItems.forEach(item => {

    item.style.opacity = "0";
    item.style.transform = "translateY(40px)";

    revealObserver.observe(item);

});// ========================================
// WHATSAPP
// ========================================

const whatsappButtons = document.querySelectorAll(
".btn-whatsapp-top, .whatsapp-float"
);

const telefono = "5491151270218"; // <-- CAMBIAR POR TU NÚMERO

const mensaje =
"Hola KM26 Performance. Quisiera consultar por un turno para mi vehículo.";

whatsappButtons.forEach(btn => {

    btn.addEventListener("click", function(e){

        e.preventDefault();

        if (whatsappSound) {

            whatsappSound.pause();
            whatsappSound.currentTime = 0;

            whatsappSound.play().catch(() => {});

        }

        setTimeout(() => {

            window.open(

                `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,

                "_blank"

            );

        }, 600);

    });

});


// ========================================
// AÑO AUTOMÁTICO EN FOOTER
// ========================================

const year = document.getElementById("year");

if(year){

    year.textContent = new Date().getFullYear();

}

// ========================================
// BOTÓN VOLVER ARRIBA
// ========================================

const volverArriba = () =>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};

window.addEventListener("keydown",(e)=>{

    if(e.key==="Home"){

        volverArriba();

    }

});

// ========================================
// PRELOAD DE IMAGEN PRINCIPAL
// ========================================

const portada = new Image();

portada.src="img/portada.jpg";

// ========================================
// FIN
// ========================================

console.log("KM26 Performance - Sitio cargado correctamente.");