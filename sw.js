// Service worker de KM26 Performance.
// Objetivo único: hacer que la app se pueda "instalar" en el celular/compu
// y que abra más rápido la segunda vez. A propósito NO cachea nada de
// Firebase/Firestore/Auth — esos pedidos siempre van directo a la red,
// para que los datos sigan siendo en tiempo real como corresponde.

const NOMBRE_CACHE = "km26-panel-v1";

const ARCHIVOS_APP_SHELL = [
    "/panel-firebase.html",
    "/manifest.json",
    "/images/icon-192.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(NOMBRE_CACHE).then((cache) => cache.addAll(ARCHIVOS_APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((nombres) =>
            Promise.all(nombres.filter((n) => n !== NOMBRE_CACHE).map((n) => caches.delete(n)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {

    const url = new URL(event.request.url);

    // Cualquier cosa que no sea un simple GET del propio dominio, o que vaya
    // hacia Firebase/Google, se deja pasar directo a la red sin tocar nada.
    const esFirebaseOGoogle =
        url.hostname.includes("firestore.googleapis.com") ||
        url.hostname.includes("firebaseio.com") ||
        url.hostname.includes("firebasestorage.googleapis.com") ||
        url.hostname.includes("googleapis.com") ||
        url.hostname.includes("gstatic.com") ||
        url.hostname.includes("google.com");

    if (event.request.method !== "GET" || esFirebaseOGoogle) {
        return;
    }

    // Para el resto (el archivo del panel, el manifest, el ícono): primero
    // intenta la red (para tener siempre la versión más nueva), y si no hay
    // conexión, usa lo que haya guardado en caché como respaldo.
    event.respondWith(
        fetch(event.request)
            .then((respuestaRed) => {
                const copia = respuestaRed.clone();
                caches.open(NOMBRE_CACHE).then((cache) => cache.put(event.request, copia));
                return respuestaRed;
            })
            .catch(() => caches.match(event.request))
    );

});
