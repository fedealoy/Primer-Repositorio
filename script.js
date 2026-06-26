const body = document.body;
const lockScreen = document.querySelector("#lockScreen");
const openStoryButton = document.querySelector("#openStory");
const siteShell = document.querySelector("#siteShell");
const particlesLayer = document.querySelector("#particles");
const heroImage = document.querySelector(".parallax-image");
const surpriseButton = document.querySelector("#surpriseButton");
const surpriseMessage = document.querySelector("#surpriseMessage");
const confettiLayer = document.querySelector("#confettiLayer");
const counterElements = {
  years: document.querySelector('[data-counter="years"]'),
  months: document.querySelector('[data-counter="months"]'),
  days: document.querySelector('[data-counter="days"]'),
  hours: document.querySelector('[data-counter="hours"]'),
  minutes: document.querySelector('[data-counter="minutes"]'),
  seconds: document.querySelector('[data-counter="seconds"]')
};

const relationshipStart = new Date(2025, 7, 14, 21, 0, 0);

body.classList.add("is-locked");

// Keeps the layout polished before the final personal photos are added.
document.querySelectorAll("img").forEach(image => {
  image.addEventListener("error", () => {
    image.classList.add("image-missing");
  });

  if (image.complete && image.naturalWidth === 0) {
    image.classList.add("image-missing");
  }
});

// Opens the lock screen and reveals the story underneath.
openStoryButton.addEventListener("click", () => {
  lockScreen.classList.add("is-unlocking");
  openStoryButton.disabled = true;

  window.setTimeout(() => {
    lockScreen.classList.add("is-open");
    siteShell.classList.add("is-visible");
    body.classList.remove("is-locked");
  }, 720);

  window.setTimeout(() => {
    lockScreen.setAttribute("aria-hidden", "true");
  }, 1300);
});

// Reveals each story element as it enters the viewport.
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -70px 0px"
  }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.setProperty("--delay", `${Math.min(index * 45, 220)}ms`);
  revealObserver.observe(element);
});

// Creates subtle floating light particles for the hero.
function createParticles() {
  if (!particlesLayer) return;

  const particleCount = 28;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const size = 2 + Math.random() * 5;

    particle.className = "particle";
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--left", `${Math.random() * 100}%`);
    particle.style.setProperty("--top", `${Math.random() * 100}%`);
    particle.style.setProperty("--duration", `${3.5 + Math.random() * 5}s`);
    particle.style.setProperty("--delay", `${Math.random() * -6}s`);
    fragment.appendChild(particle);
  }

  particlesLayer.appendChild(fragment);
}

// Adds a restrained parallax effect to the hero image.
function updateHeroParallax() {
  if (!heroImage) return;

  const offset = window.scrollY * 0.18;
  heroImage.style.setProperty("--parallax", `${offset}px`);
}

window.addEventListener("scroll", updateHeroParallax, { passive: true });

// Calculates calendar-aware elapsed time since the relationship started.
function getElapsedTime(start, end) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  let hours = end.getHours() - start.getHours();
  let minutes = end.getMinutes() - start.getMinutes();
  let seconds = end.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += previousMonth.getDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

function updateCounter() {
  const now = new Date();
  const elapsed = getElapsedTime(relationshipStart, now);

  Object.entries(elapsed).forEach(([key, value]) => {
    if (counterElements[key]) {
      counterElements[key].textContent = String(Math.max(value, 0)).padStart(key === "years" || key === "months" || key === "days" ? 1 : 2, "0");
    }
  });
}

// Launches a soft silver-lilac confetti burst.
function launchConfetti() {
  if (!confettiLayer) return;

  const colors = ["#ffffff", "#c0c0c0", "#ded2f4", "#f1ecfb", "#111111"];
  const fragment = document.createDocumentFragment();
  const pieceCount = 88;

  confettiLayer.replaceChildren();

  for (let index = 0; index < pieceCount; index += 1) {
    const piece = document.createElement("span");
    const width = 5 + Math.random() * 8;
    const height = 8 + Math.random() * 14;
    const drift = -90 + Math.random() * 180;
    const spin = 240 + Math.random() * 720;

    piece.className = "confetti-piece";
    piece.style.setProperty("--x", `${Math.random() * 100}%`);
    piece.style.setProperty("--w", `${width}px`);
    piece.style.setProperty("--h", `${height}px`);
    piece.style.setProperty("--r", `${Math.random() * 180}deg`);
    piece.style.setProperty("--drift", `${drift}px`);
    piece.style.setProperty("--spin", `${spin}deg`);
    piece.style.setProperty("--fall", `${2.2 + Math.random() * 1.8}s`);
    piece.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
    piece.style.animationDelay = `${Math.random() * 0.45}s`;
    fragment.appendChild(piece);
  }

  confettiLayer.appendChild(fragment);

  window.setTimeout(() => {
    confettiLayer.replaceChildren();
  }, 4600);
}

surpriseButton.addEventListener("click", () => {
  launchConfetti();
  surpriseButton.disabled = true;

  window.setTimeout(() => {
    surpriseMessage.classList.add("is-visible");
  }, 900);
});

createParticles();
updateHeroParallax();
updateCounter();
window.setInterval(updateCounter, 1000);
