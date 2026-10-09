(() => {
  function initSite() {
    const body = document.body;
    const menuToggle = document.getElementById("menu-toggle") || document.querySelector(".menu-toggle");
    const navLinks = document.getElementById("nav-links") || document.querySelector(".nav-links");
    const themeToggle = document.getElementById("theme-toggle") || document.querySelector(".theme-toggle");
    const themeLabel = document.querySelector(".theme-toggle-label");
    const themeIcon = document.querySelector(".theme-toggle-icon");
    const currentYear = document.getElementById("current-year");

    if (currentYear) currentYear.textContent = new Date().getFullYear();

    // Mobile navigation: CSS uses .nav-links.is-open.
    function closeMenu() {
      if (!menuToggle || !navLinks) return;
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    if (menuToggle && navLinks) {
      menuToggle.setAttribute("aria-expanded", String(navLinks.classList.contains("is-open")));
      menuToggle.setAttribute("aria-label", navLinks.classList.contains("is-open") ? "Close navigation menu" : "Open navigation menu");
      menuToggle.addEventListener("click", (event) => {
        event.preventDefault();
        const isOpen = navLinks.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      });
      navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
      document.addEventListener("click", (event) => {
        if (navLinks.classList.contains("is-open") && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
          menuToggle.focus();
        }
      });
    }

    // Theme button toggles CSS variables declared in body.hacking-theme.
    function updateThemeButton() {
      if (!themeToggle) return;
      const cyber = body.classList.contains("hacking-theme");
      if (themeLabel) themeLabel.textContent = cyber ? "Professional Blue Theme" : "Cybersecurity Theme";
      if (themeIcon) themeIcon.textContent = cyber ? "◈" : "◐";
      themeToggle.setAttribute("aria-label", cyber ? "Switch to Professional Blue theme" : "Switch to Cybersecurity theme");
      themeToggle.setAttribute("aria-pressed", String(cyber));
    }

    const canvas = document.getElementById("network-background");
    const ctx = canvas ? canvas.getContext("2d") : null;
    let width = 0, height = 0, particles = [], animationFrame = null, lastFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function accentRGB() { return body.classList.contains("hacking-theme") ? "255, 75, 75" : "69, 217, 255"; }
    function drawNetwork() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, width, height);
      const color = accentRGB();
      const maxDistance = Math.min(185, width * 0.24);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${color}, ${(1 - distance / maxDistance) * 0.52})`;
            ctx.lineWidth = 1.3; ctx.stroke();
          }
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 1)`; ctx.shadowBlur = 10; ctx.shadowColor = `rgba(${color}, 0.85)`; ctx.fill(); ctx.shadowBlur = 0;
      }
    }
    function resizeCanvas() {
      if (!canvas || !ctx) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.floor(width * ratio); canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(100, Math.max(34, Math.floor((width * height) / 17500)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.6 + 1.25
      }));
      drawNetwork();
    }
    function animate(timestamp) {
      if (reducedMotion.matches) { drawNetwork(); animationFrame = null; return; }
      if (timestamp - lastFrame < 33) { animationFrame = requestAnimationFrame(animate); return; }
      lastFrame = timestamp;
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x)); p.y = Math.max(0, Math.min(height, p.y));
      });
      drawNetwork(); animationFrame = requestAnimationFrame(animate);
    }
    function startAnimation() {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
      if (!canvas || !ctx) return;
      if (reducedMotion.matches) { drawNetwork(); return; }
      lastFrame = 0; animationFrame = requestAnimationFrame(animate);
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", (event) => {
        event.preventDefault();
        body.classList.toggle("hacking-theme");
        updateThemeButton();
        drawNetwork();
      });
    }
    updateThemeButton();

    if (canvas && ctx) {
      window.addEventListener("resize", () => { resizeCanvas(); startAnimation(); });
      if (typeof reducedMotion.addEventListener === "function") reducedMotion.addEventListener("change", startAnimation);
      resizeCanvas(); startAnimation();
    }
  }

  // Works whether loaded with defer or injected after DOMContentLoaded.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initSite, { once: true });
  else initSite();
})();
