
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Support both IDs and CSS classes.
  const menuToggle = document.querySelector("#menu-toggle, .menu-toggle");
  const navLinks = document.querySelector("#nav-links, .nav-links");
  const themeToggle = document.querySelector("#theme-toggle, .theme-toggle");
  const themeLabel = document.querySelector(".theme-toggle-label");
  const themeIcon = document.querySelector(".theme-toggle-icon");
  const currentYear = document.getElementById("current-year");

  // Keep footer year current.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // -------------------------------
  // MOBILE NAVIGATION MENU
  // -------------------------------
  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  if (menuToggle && navLinks) {
    // Ensure the initial state is correct.
    menuToggle.setAttribute(
      "aria-expanded",
      String(navLinks.classList.contains("is-open"))
    );

    menuToggle.setAttribute(
      "aria-label",
      navLinks.classList.contains("is-open")
        ? "Close navigation menu"
        : "Open navigation menu"
    );

    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = navLinks.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    // Close the menu after selecting a navigation link.
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close when tapping outside the menu.
    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("is-open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close with the Escape key.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  // -------------------------------
  // THEME SWITCH
  // -------------------------------
  function updateThemeButton() {
    if (!themeToggle) return;

    const isCybersecurityTheme = body.classList.contains("hacking-theme");

    if (themeLabel) {
      themeLabel.textContent = isCybersecurityTheme
        ? "Professional Blue Theme"
        : "Cybersecurity Theme";
    }

    if (themeIcon) {
      themeIcon.textContent = isCybersecurityTheme ? "◈" : "◐";
    }

    themeToggle.setAttribute(
      "aria-label",
      isCybersecurityTheme
        ? "Switch to Professional Blue theme"
        : "Switch to Cybersecurity theme"
    );

    themeToggle.setAttribute(
      "aria-pressed",
      String(isCybersecurityTheme)
    );
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", (event) => {
      event.preventDefault();

      body.classList.toggle("hacking-theme");
      updateThemeButton();
      drawNetworkIfReady();
    });
  }

  updateThemeButton();

  // -------------------------------
  // ANIMATED NETWORK BACKGROUND
  // -------------------------------
  const canvas = document.getElementById("network-background");
  const context = canvas ? canvas.getContext("2d") : null;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = null;
  let lastFrame = 0;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const particleCount = () =>
    Math.min(85, Math.max(30, Math.floor((width * height) / 20000)));

  function getAccentColor() {
    return body.classList.contains("hacking-theme")
      ? "255, 75, 75"
      : "69, 217, 255";
  }

  function drawNetworkIfReady() {
    if (canvas && context && width > 0 && height > 0) {
      drawNetwork();
    }
  }

  function resizeCanvas() {
    if (!canvas || !context) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    particles = Array.from({ length: particleCount() }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 1.5 + 1.1
    }));

    drawNetwork();
  }

  function drawNetwork() {
    if (!canvas || !context) return;

    context.clearRect(0, 0, width, height);

    const color = getAccentColor();
    const maxDistance = Math.min(170, width * 0.22);

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      // Connecting lines.
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.42;

          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(${color}, ${opacity})`;
          context.lineWidth = 1.15;
          context.stroke();
        }
      }

      // Network nodes.
      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      context.fillStyle = `rgba(${color}, 0.9)`;
      context.shadowBlur = 7;
      context.shadowColor = `rgba(${color}, 0.7)`;
      context.fill();
      context.shadowBlur = 0;
    }
  }

  function animate(timestamp) {
    if (reducedMotion.matches) {
      drawNetwork();
      animationFrame = null;
      return;
    }

    // Limit animation to approximately 30 FPS.
    if (timestamp - lastFrame < 33) {
      animationFrame = requestAnimationFrame(animate);
      return;
    }

    lastFrame = timestamp;

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -1;
      }

      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -1;
      }

      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));
    });

    drawNetwork();
    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    if (!canvas || !context) return;

    if (reducedMotion.matches) {
      drawNetwork();
      return;
    }

    lastFrame = 0;
    animationFrame = requestAnimationFrame(animate);
  }

  if (canvas && context) {
    window.addEventListener("resize", () => {
      resizeCanvas();
      startAnimation();
    });

    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", startAnimation);
    }

    resizeCanvas();
    startAnimation();
  }
});
