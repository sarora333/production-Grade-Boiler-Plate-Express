// ── Home Button Click Feedback ──────────────────────────
const homeBtn = document.getElementById("homeBtn");

if (homeBtn) {
  homeBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Brief flash animation then navigate
    homeBtn.style.transition = "background 0.1s, box-shadow 0.1s";
    homeBtn.style.background = "rgba(124, 106, 255, 0.35)";
    homeBtn.style.boxShadow = "0 0 24px rgba(124,106,255,0.5)";

    setTimeout(() => {
      window.location.href = "/";
    }, 180);
  });
}

// ── Typing Effect on Port Number ────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Add a subtle cursor blink to the status badge
  const badge = document.querySelector(".status-badge");
  if (badge) {
    const cursor = document.createElement("span");
    cursor.textContent = "_";
    cursor.style.cssText = `
      font-family: 'JetBrains Mono', monospace;
      color: #3dffa0;
      animation: blink 1.1s step-end infinite;
      margin-left: 2px;
    `;
    badge.appendChild(cursor);
  }

  // Inject blink keyframes
  const style = document.createElement("style");
  style.textContent = `
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});

// ── Subtle Mouse Parallax on Hero Title ─────────────────
const heroTitle = document.querySelector(".hero-title");

if (heroTitle && window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy;

    const moveX = dx * 6;
    const moveY = dy * 4;

    heroTitle.style.transform = `translate(${moveX}px, ${moveY}px)`;
    heroTitle.style.transition = "transform 0.25s ease-out";
  });

  document.addEventListener("mouseleave", () => {
    heroTitle.style.transform = "translate(0, 0)";
  });
}

// ── Navbar scroll shadow ─────────────────────────────────
const navbar = document.querySelector(".navbar");

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = "0 2px 24px rgba(0,0,0,0.5)";
    } else {
      navbar.style.boxShadow = "none";
    }
  },
  { passive: true },
);
