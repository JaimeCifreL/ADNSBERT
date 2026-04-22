async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    const res = await fetch(`${file}?v=${Date.now()}`, {
        cache: "no-store"
    });

    const text = await res.text();
    element.innerHTML = text;
}

window.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("header", "header.html");
    await loadComponent("footer", "footer.html");

    if (typeof initHeader === "function") {
        initHeader();
    }
});


(function enablePWA() {
    try {
        // Añadir manifest
        if (!document.querySelector('link[rel="manifest"]')) {
            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = 'manifest.json';
            document.head.appendChild(link);
        }

        // Añadir theme-color
        if (!document.querySelector('meta[name="theme-color"]')) {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = '#002079';
            document.head.appendChild(meta);
        }

        // Añadir iconos por defecto para evitar que el crawler/manifest use una imagen de la página
        if (!document.querySelector('link[rel="icon"]')) {
            const icon = document.createElement('link');
            icon.rel = 'icon';
            icon.href = 'styles/img/ADNSBERTpwa192.png';
            document.head.appendChild(icon);
        }

        if (!document.querySelector('link[rel="apple-touch-icon"]')) {
            const apple = document.createElement('link');
            apple.rel = 'apple-touch-icon';
            apple.href = 'styles/img/ADNSBERTpwa192.png';
            document.head.appendChild(apple);
        }

        // Registrar service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(reg => {
                        console.log('Service Worker registrado:', reg.scope);

                        // Si ya hay un SW en espera, pedir que se active
                        if (reg.waiting) {
                            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                        }

                        // Cuando se detecta una nueva instalación, pedir activación
                        reg.addEventListener('updatefound', () => {
                            const installing = reg.installing;
                            if (!installing) return;
                            installing.addEventListener('statechange', () => {
                                if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                                    // Hay una nueva versión: solicitar activación inmediata
                                    installing.postMessage({ type: 'SKIP_WAITING' });
                                }
                            });
                        });

                        // Cuando el nuevo SW toma el control, recargar la página para aplicar assets nuevos
                        navigator.serviceWorker.addEventListener('controllerchange', () => {
                            window.location.reload();
                        });

                        // Solicitar comprobación de actualización al registrar
                        reg.update();
                    })
                    .catch(err => console.warn('Registro SW falló:', err));
            });
        }
    } catch (e) {
        console.warn('Error habilitando PWA:', e);
    }
})();
