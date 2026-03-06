const root = document.documentElement;
document.body.classList.add("js-enabled");

const STORAGE_THEME_KEY = "cv-theme";

const themeMap = {
  sombre: {
    bg: "#0a111b",
    text: "#f4f6fb",
    muted: "#b7c0d3",
    primary: "#c7f36b",
    primaryContrast: "#0f1805",
    accentSoft: "rgba(177, 206, 255, 0.1)",
    surface: "rgba(13, 19, 32, 0.9)",
    surfaceGlass: "rgba(16, 23, 37, 0.82)",
    surfaceStrong: "rgba(10, 15, 26, 0.96)",
    border: "rgba(169, 188, 220, 0.18)",
    borderStrong: "rgba(207, 221, 244, 0.38)",
    focus: "#b8d7ff",
    chipBg: "rgba(245, 248, 255, 0.03)",
    chipBgHover: "rgba(245, 248, 255, 0.08)",
    chipText: "#edf2fb"
  },
  nuit: {
    bg: "#081018",
    text: "#f5f7fc",
    muted: "#c1cbdf",
    primary: "#9fc4ff",
    primaryContrast: "#091321",
    accentSoft: "rgba(159, 196, 255, 0.12)",
    surface: "rgba(11, 18, 31, 0.92)",
    surfaceGlass: "rgba(13, 21, 35, 0.84)",
    surfaceStrong: "rgba(8, 13, 24, 0.98)",
    border: "rgba(168, 194, 236, 0.2)",
    borderStrong: "rgba(216, 227, 247, 0.42)",
    focus: "#c6ddff",
    chipBg: "rgba(245, 248, 255, 0.035)",
    chipBgHover: "rgba(245, 248, 255, 0.09)",
    chipText: "#eef3fc"
  },
  contraste: {
    bg: "#070d15",
    text: "#ffffff",
    muted: "#d7e0f0",
    primary: "#d6ff71",
    primaryContrast: "#0d1704",
    accentSoft: "rgba(214, 255, 113, 0.12)",
    surface: "rgba(8, 13, 23, 0.96)",
    surfaceGlass: "rgba(10, 15, 26, 0.88)",
    surfaceStrong: "rgba(5, 9, 17, 0.99)",
    border: "rgba(214, 226, 245, 0.26)",
    borderStrong: "rgba(240, 246, 255, 0.52)",
    focus: "#ffe082",
    chipBg: "rgba(245, 248, 255, 0.05)",
    chipBgHover: "rgba(245, 248, 255, 0.1)",
    chipText: "#ffffff"
  }
};

const cssTokenMap = {
  bg: "--bg",
  text: "--text",
  muted: "--text-muted",
  primary: "--primary",
  primaryContrast: "--primary-contrast",
  accentSoft: "--accent-soft",
  surface: "--surface",
  surfaceGlass: "--surface-glass",
  surfaceStrong: "--surface-strong",
  border: "--border",
  borderStrong: "--border-strong",
  focus: "--focus",
  chipBg: "--chip-bg",
  chipBgHover: "--chip-bg-hover",
  chipText: "--chip-text"
};

function applyTheme(themeName) {
  const palette = themeMap[themeName] || themeMap.sombre;

  Object.entries(cssTokenMap).forEach(([token, cssVar]) => {
    const value = palette[token];
    if (value) {
      root.style.setProperty(cssVar, value);
    }
  });

  const options = document.querySelectorAll(".theme-option");
  options.forEach((option) => {
    const isActive = option.dataset.theme === themeName;
    option.classList.toggle("active", isActive);
    option.setAttribute("aria-pressed", String(isActive));
  });

  try {
    localStorage.setItem(STORAGE_THEME_KEY, themeName);
  } catch {
    // No-op if storage is unavailable.
  }
}

(function initTheme() {
  let savedTheme = "sombre";
  try {
    const fromStorage = localStorage.getItem(STORAGE_THEME_KEY);
    if (fromStorage && themeMap[fromStorage]) {
      savedTheme = fromStorage;
    }
  } catch {
    // Ignore storage errors and keep default.
  }

  applyTheme(savedTheme);

  const options = document.querySelectorAll(".theme-option");
  options.forEach((option) => {
    option.addEventListener("click", () => {
      const name = option.dataset.theme;
      if (!name) return;
      applyTheme(name);
    });
  });
})();

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("primary-menu");
const menuLinks = document.querySelectorAll(".menu a");

function closeMenu() {
  if (!menu || !menuToggle) return;
  menu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!menu.classList.contains("open")) return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(".top-nav")) return;
    closeMenu();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
      closeMenu();
    }
  });
}

const timelineToggles = document.querySelectorAll(".item-toggle");
timelineToggles.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const card = button.closest(".timeline-item");
    if (!card) return;

    const isOpen = card.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const skillChips = document.querySelectorAll(".skill-chip");
const projectCards = document.querySelectorAll("#projets .project-card");
const filterStatus = document.getElementById("filter-status");
let activeSkillChip = null;

function setFilter(filter, sourceChip = null) {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const tags = card.dataset.tags || "";
    const visible = filter === "all" || tags.includes(filter);

    card.classList.toggle("hidden", !visible);
    card.setAttribute("aria-hidden", String(!visible));
    card.setAttribute("tabindex", visible ? "0" : "-1");

    if (visible) visibleCount += 1;
  });

  filterButtons.forEach((btn) => {
    const active = btn.dataset.filter === filter;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  skillChips.forEach((chip) => {
    const active = chip === sourceChip;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-pressed", String(active));
  });

  activeSkillChip = sourceChip;

  if (filterStatus) {
    const label = filter === "all" ? "toutes les catégories" : `catégorie ${filter}`;
    filterStatus.textContent = `${visibleCount} réalisation(s) visible(s) pour ${label}.`;
  }
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter || "all", null));
});

skillChips.forEach((chip) => {
  chip.setAttribute("aria-pressed", "false");
  chip.addEventListener("click", () => {
    const shouldClear = activeSkillChip === chip;
    setFilter(chip.dataset.filter || "all", shouldClear ? null : chip);
  });
});

const revealTargets = document.querySelectorAll(".reveal");

function setVisibleIfInViewport(el) {
  const rect = el.getBoundingClientRect();
  if (rect.top <= window.innerHeight * 0.92) {
    el.classList.add("visible");
  }
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx * 40, 260)}ms`;
    setVisibleIfInViewport(el);
    observer.observe(el);
  });
} else {
  revealTargets.forEach((el) => el.classList.add("visible"));
}

const sections = document.querySelectorAll("main section, footer.section");
const topNav = document.querySelector(".top-nav");

function updateActiveMenu() {
  const point = window.scrollY + 140;

  sections.forEach((section) => {
    const inRange = point >= section.offsetTop && point < section.offsetTop + section.offsetHeight;
    if (!inRange) return;

    const id = section.getAttribute("id");
    menuLinks.forEach((link) => {
      const target = link.getAttribute("href");
      const active = target === `#${id}`;
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  });
}

function updateProgress() {
  const el = document.querySelector(".scroll-progress");
  if (!el) return;

  const scrollTop = window.scrollY;
  const full = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = full > 0 ? (scrollTop / full) * 100 : 0;
  el.style.width = `${ratio}%`;

  if (topNav) {
    topNav.classList.toggle("scrolled", scrollTop > 8);
  }
}

window.addEventListener(
  "scroll",
  () => {
    updateActiveMenu();
    updateProgress();
  },
  { passive: true }
);

const detailPage = document.getElementById("detail-page");
const detailCard = document.querySelector(".detail-card");
const detailKicker = document.getElementById("detail-kicker");
const detailTitle = document.getElementById("detail-title");
const detailBody = document.getElementById("detail-body");
const detailCloseBtn = document.getElementById("detail-close");
const detailSlots = document.getElementById("detail-slots");
const detailSlotFields = {
  context: document.getElementById("detail-context"),
  role: document.getElementById("detail-role"),
  objectives: document.getElementById("detail-objectives"),
  deliverables: document.getElementById("detail-deliverables"),
  tools: document.getElementById("detail-tools"),
  impact: document.getElementById("detail-impact")
};
const detailCloseTriggers = document.querySelectorAll("[data-close-detail]");
const interactiveItems = document.querySelectorAll(".interactive-item[data-detail-title]");

let lastFocusedElement = null;
let timelineOpenSnapshot = [];

function isControlClick(target, item) {
  const control = target.closest("a, button, .filter-btn, .skill-chip, .item-toggle, [data-close-detail], .menu-toggle");
  if (!control) return false;

  const isDetailButton = control.classList.contains("interactive-item") && control.hasAttribute("data-detail-title");
  if (isDetailButton && control === item) return false;

  return true;
}

function openDetail(item) {
  if (!detailPage || !detailTitle || !detailBody || !detailCard) return;

  const opensAsSheet = Boolean(item.closest("#formations") || item.closest("#projets"));

  detailKicker.textContent = item.dataset.detailKicker || "Détail";
  detailTitle.textContent = item.dataset.detailTitle || "Élément";
  detailBody.textContent = item.dataset.detailBody || "Aucun détail disponible.";

  const detailEntries = [
    ["context", item.dataset.detailContext],
    ["role", item.dataset.detailRole],
    ["objectives", item.dataset.detailObjectives],
    ["deliverables", item.dataset.detailDeliverables],
    ["tools", item.dataset.detailTools],
    ["impact", item.dataset.detailImpact]
  ];

  let hasDetailSlot = false;
  detailEntries.forEach(([key, value]) => {
    const field = detailSlotFields[key];
    const wrapper = document.getElementById(`detail-slot-${key}-wrap`);
    if (!field || !wrapper) return;

    if (value) {
      field.textContent = value;
      wrapper.hidden = false;
      hasDetailSlot = true;
    } else {
      field.textContent = "";
      wrapper.hidden = true;
    }
  });

  if (detailSlots) {
    detailSlots.hidden = !hasDetailSlot;
  }

  detailPage.classList.toggle("mode-sheet", opensAsSheet);
  if (detailCloseBtn) {
    detailCloseBtn.setAttribute(
      "aria-label",
      opensAsSheet ? "Fermer le volet de détail" : "Fermer la fiche détail"
    );
  }

  lastFocusedElement = document.activeElement;
  detailPage.classList.add("open");
  detailPage.setAttribute("aria-hidden", "false");
  document.body.classList.add("detail-open");

  if (detailCloseBtn) {
    detailCloseBtn.focus();
  } else {
    detailCard.focus();
  }
}

function closeDetail() {
  if (!detailPage) return;

  detailPage.classList.remove("open");
  detailPage.classList.remove("mode-sheet");
  detailPage.setAttribute("aria-hidden", "true");
  document.body.classList.remove("detail-open");

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

function prepareForPrint() {
  if (!timelineOpenSnapshot.length) {
    timelineOpenSnapshot = Array.from(timelineToggles).map((button) => {
      const card = button.closest(".timeline-item");
      return card ? card.classList.contains("open") : false;
    });
  }

  closeDetail();
  closeMenu();

  timelineToggles.forEach((button) => {
    const card = button.closest(".timeline-item");
    if (!card) return;
    card.classList.add("open");
    button.setAttribute("aria-expanded", "true");
  });
}

function restoreAfterPrint() {
  if (!timelineOpenSnapshot.length) return;

  timelineToggles.forEach((button, index) => {
    const card = button.closest(".timeline-item");
    if (!card) return;

    const shouldOpen = Boolean(timelineOpenSnapshot[index]);
    card.classList.toggle("open", shouldOpen);
    button.setAttribute("aria-expanded", String(shouldOpen));
  });

  timelineOpenSnapshot = [];
}

const printBtn = document.getElementById("print-cv");
if (printBtn) {
  printBtn.addEventListener("click", () => {
    prepareForPrint();
    window.print();
  });
}

window.addEventListener("beforeprint", prepareForPrint);
window.addEventListener("afterprint", restoreAfterPrint);

const copyBtn = document.getElementById("copy-email");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const email = copyBtn.dataset.email || "";
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      copyBtn.textContent = "Email copié";
      setTimeout(() => {
        copyBtn.textContent = "Copier l'email";
      }, 1800);
    } catch {
      copyBtn.textContent = "Copie impossible";
    }
  });
}

interactiveItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    if (isControlClick(event.target, item)) return;
    if (item.classList.contains("hidden")) return;
    openDetail(item);
  });

  item.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("button, a")) return;

    event.preventDefault();
    if (item.classList.contains("hidden")) return;
    openDetail(item);
  });
});

detailCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeDetail);
});

window.addEventListener("keydown", (event) => {
  if (!detailPage || !detailPage.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeDetail();
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = detailPage.querySelectorAll(
    "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
  );

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

updateActiveMenu();
updateProgress();
setFilter("all", null);












