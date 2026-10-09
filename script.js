document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.querySelector(".theme-toggle-label");
  const themeIcon = document.querySelector(".theme-toggle-icon");
  const currentYear = document.getElementById("current-year");

  // Keep footer year current.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation menu.
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("is-open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }

  // Theme switch.
  function updateThemeButton() {
    if (!themeToggle || !themeLabel || !themeIcon) return;

    const isHackingTheme = body.classList.contains("hacking-theme");

    themeLabel.textContent = isHackingTheme
      ? "Professional Blue Theme"
      : "Cybersecurity Theme";

    themeIcon.textContent = isHackingTheme ? "◈" : "◐";

    themeToggle.setAttribute(
      "aria-label",
      isHackingTheme
        ? "Switch to Professional Blue theme"
        : "Switch to Cybersecurity theme"
    );

    themeToggle.setAttribute("aria-pressed", String(isHackingTheme));
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("hacking-theme");
      updateThemeButton();
    });
  }

  updateThemeButton();

  // Animated network background.
  const canvas = document.getElementById("network-background");
  const context = canvas ? canvas.getContext("2d") : null;

  if (!canvas || !context) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = null;
  let lastFrame = 0;

  const particleCount = () =>
    Math.min(85, Math.max(30, Math.floor((width * height) / 20000)));

  function resizeCanvas() {
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

  function getAccentColor() {
    return body.classList.contains("hacking-theme")
      ? "255, 75, 75"
      : "69, 217, 255";
  }

  function drawNetwork() {
    context.clearRect(0, 0, width, height);

    const color = getAccentColor();
    const maxDistance = Math.min(170, width * 0.22);

    // Draw brighter connecting lines.
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

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

      // Draw brighter network nodes.
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

      // Reset shadow so it does not affect connecting lines.
      context.shadowBlur = 0;
    }
  }

  function animate(timestamp) {
    if (reducedMotion.matches) {
      drawNetwork();
      animationFrame = null;
      return;
    }

    // Limit animation to approximately 30 frames per second.
    if (timestamp - lastFrame < 33) {
      animationFrame = requestAnimationFrame(animate);
      return;
    }

    lastFrame = timestamp;

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

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

    if (reducedMotion.matches) {
      drawNetwork();
      return;
    }

    lastFrame = 0;
    animationFrame = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    startAnimation();
  });

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", startAnimation);
  }

  resizeCanvas();
  startAnimation();
});
2. style.css — background aur caption ka fix
Apni existing CSS ko delete mat karna. File ke bilkul end mein ye code paste karo.

css

/* ===== CLEARER TECH BACKGROUND ===== */

.tech-background {
  opacity: 0.32;
}

.circuit-lines {
  stroke-width: 2;
  opacity: 1;
}

.circuit-nodes {
  opacity: 1;
  filter: drop-shadow(0 0 5px var(--accent));
}

.tech-symbols {
  opacity: 1;
  stroke-width: 2.5;
}

#network-background {
  opacity: 0.62;
}

/* ===== PROFILE CAPTION ALIGNMENT ===== */

.profile-caption {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-width: 0;
  padding: 14px 6px 8px;
  color: var(--muted);
  font-size: 0.77rem;
  font-weight: 650;
  line-height: 1.4;
}

.profile-caption-dot {
  flex: 0 0 8px;
}

/* Prevent caption text from overflowing on small screens */
@media (max-width: 480px) {
  .profile-caption {
    gap: 7px;
    padding-inline: 3px;
    font-size: 0.7rem;
  }
}
