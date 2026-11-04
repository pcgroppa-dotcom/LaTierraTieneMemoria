const header = document.querySelector("[data-header]");
const progressBar = document.querySelector(".progress span");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const toast = document.querySelector("[data-toast]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = `scaleX(${progress})`;

  const darkSections = document.querySelectorAll(".rewe, .rights, .present, .legal, .timeline-item-dark, .timeline-item-verde");
  const headerCenter = header.getBoundingClientRect().height / 2;
  const overDark = [...darkSections].some((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= headerCenter && rect.bottom >= headerCenter;
  });
  header.classList.toggle("is-dark", overDark);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
});

nav.addEventListener("click", (event) => {
  if (!event.target.matches("a")) return;
  menuButton.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
});

const revealItems = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8%" },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll(".contrast-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".contrast-item");
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    item.classList.toggle("is-open", !open);
  });
});

const coordinateStage = document.querySelector("[data-coordinate-stage]");
const latitude = document.querySelector("[data-live-lat]");
const longitude = document.querySelector("[data-live-lon]");

coordinateStage.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;
  const bounds = coordinateStage.getBoundingClientRect();
  const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
  const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
  coordinateStage.style.setProperty("--coord-x", `${x * 100}%`);
  coordinateStage.style.setProperty("--coord-y", `${y * 100}%`);

  const lat = 41.3496 + (0.5 - y) * 0.05;
  const lon = 71.509 + (x - 0.5) * 0.07;
  latitude.textContent = `${lat.toFixed(4)}° S`;
  longitude.textContent = `${lon.toFixed(4)}° O`;
});

coordinateStage.addEventListener("pointerleave", () => {
  coordinateStage.style.setProperty("--coord-x", "65%");
  coordinateStage.style.setProperty("--coord-y", "58%");
  latitude.textContent = "41.3496° S";
  longitude.textContent = "71.5090° O";
});

const typeOutput = document.querySelector("[data-type-output]");
const weightInput = document.querySelector("[data-weight]");
const opszInput = document.querySelector("[data-opsz]");
const weightOutput = document.querySelector("[data-weight-output]");
const opszOutput = document.querySelector("[data-opsz-output]");

function updateTypeLab() {
  typeOutput.style.setProperty("--lab-weight", weightInput.value);
  typeOutput.style.setProperty("--lab-opsz", opszInput.value);
  weightOutput.value = weightInput.value;
  weightOutput.textContent = weightInput.value;
  opszOutput.value = opszInput.value;
  opszOutput.textContent = Number(opszInput.value).toFixed(1);
}

weightInput.addEventListener("input", updateTypeLab);
opszInput.addEventListener("input", updateTypeLab);

document.querySelector("[data-reset-type]").addEventListener("click", () => {
  weightInput.value = 720;
  opszInput.value = 40;
  typeOutput.textContent = "El territorio también es memoria.";
  updateTypeLab();
});

typeOutput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") event.preventDefault();
});

updateTypeLab();
