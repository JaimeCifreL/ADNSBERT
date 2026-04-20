function initHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    function updateHeaderOnScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        if (currentScroll <= 0) {
            header.classList.remove("hidden");
            lastScrollTop = 0;
            return;
        }

        if (currentScroll > lastScrollTop) {
            header.classList.add("hidden");
        } else {
            header.classList.remove("hidden");
        }

        lastScrollTop = currentScroll;
    }

    updateHeaderOnScroll();
    window.addEventListener("scroll", updateHeaderOnScroll);
    // --- Mobile menu toggle: injects a button and toggles `nav-open` on header ---
    const headerContainer = header.querySelector('.header-container');
    const nav = header.querySelector('.nav');
    if (headerContainer && nav) {
        const btn = document.createElement('button');
        btn.className = 'mobile-menu-toggle';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Abrir menú');
        btn.innerHTML = '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="0" width="20" height="2" rx="1" fill="currentColor"/><rect y="6" width="20" height="2" rx="1" fill="currentColor"/><rect y="12" width="20" height="2" rx="1" fill="currentColor"/></svg>';
        // place button at the end of header-container
        headerContainer.appendChild(btn);

        function toggleNav() {
            const isOpen = header.classList.toggle('nav-open');
            btn.setAttribute('aria-expanded', String(isOpen));
        }

        btn.addEventListener('click', toggleNav);

        // close menu when clicking outside or pressing Escape
        document.addEventListener('click', (e) => {
            if (!isOpenElement(header, e.target) && header.classList.contains('nav-open')) {
                header.classList.remove('nav-open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && header.classList.contains('nav-open')) {
                header.classList.remove('nav-open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });

        function isOpenElement(root, target) {
            return root.contains(target) || target === btn;
        }
    }
}