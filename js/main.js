// APower Group — page behavior

// ---------- Language toggle (English / 中文) ----------
const root = document.documentElement;
const langBtn = document.getElementById("langBtn");

function setLang(lang) {
  root.dataset.lang = lang;
  root.lang = lang === "zh" ? "zh-Hans" : "en";
  langBtn.innerHTML = lang === "zh" ? '<span class="lb-long">English</span><span class="lb-short">EN</span>' : "中文";
  try { localStorage.setItem("lang", lang); } catch (e) { /* storage blocked: fine */ }
}

let savedLang = null;
try { savedLang = localStorage.getItem("lang"); } catch (e) {}
const urlLang = new URLSearchParams(location.search).get("lang"); // ?lang=en opens in English
// Default is Chinese; ?lang=en or the visitor's own choice overrides it.
setLang((urlLang || savedLang || "zh") === "en" ? "en" : "zh");

langBtn.addEventListener("click", () => setLang(root.dataset.lang === "zh" ? "en" : "zh"));

// ---------- Dark / light mode (dark is the default) ----------
const themeBtn = document.getElementById("themeBtn");
const themeMeta = document.querySelector('meta[name="theme-color"]');
function setTheme(theme) {
  if (theme === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
  themeMeta.content = theme === "light" ? "#ffffff" : "#0a1422";
  themeBtn.setAttribute("aria-pressed", theme === "light");
  try { localStorage.setItem("theme", theme); } catch (e) {}
}
themeBtn.addEventListener("click", () => setTheme(root.dataset.theme === "light" ? "dark" : "light"));
themeMeta.content = root.dataset.theme === "light" ? "#ffffff" : "#0a1422";

// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const header = document.querySelector(".site-header");
menuBtn.addEventListener("click", () => {
  const open = header.classList.toggle("menu-open");
  menuBtn.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".main-nav a").forEach(a =>
  a.addEventListener("click", () => {
    header.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// ---------- Photos: load if the file exists, otherwise keep the placeholder ----------
document.querySelectorAll("[data-photo]").forEach(slot => {
  const src = slot.dataset.photo;
  const img = new Image();
  img.alt = slot.dataset.alt || "";
  img.loading = "lazy";
  img.onload = () => { slot.innerHTML = ""; slot.appendChild(img); };
  img.onerror = () => {
    if (slot.classList.contains("g-item")) {
      slot.classList.add("g-empty");
      slot.innerHTML = "<div><b>+</b>" + src.replace("images/", "") + "</div>";
    }
  };
  img.src = src;
});

// ---------- Quote form (Google Form) ----------
const QUOTE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScD1XEBeZkAzw8eGSuMf6O2_K_hce1AIdRLiZXCssK3qjlkRw/viewform?embedded=true";
const quoteLink = document.getElementById("quoteFormLink");
if (quoteLink && QUOTE_FORM_URL) {
  quoteLink.href = QUOTE_FORM_URL.replace(/[?&]embedded=true/, "").replace(/\?$/, "");
  quoteLink.target = "_blank";
  quoteLink.rel = "noopener";
} else {
  const note = document.getElementById("quoteFormNote");
  if (note) note.hidden = true;
  if (quoteLink) quoteLink.innerHTML = '<span lang="en">Call (718) 886-4980</span><span lang="zh">致电 (718) 886-4980</span>';
}

// ---------- Fade sections in as you scroll ----------
const revealEls = document.querySelectorAll(".section-head, .card, .brands-block, .tech-card, .about-panel, .area-cards, .quote-card, .map-wrap");
if ("IntersectionObserver" in window) {
  revealEls.forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}

// ---------- Videos: only play while on screen (saves phone data) ----------
const videos = document.querySelectorAll(".tech-card video");
if ("IntersectionObserver" in window) {
  videos.forEach(v => { v.removeAttribute("autoplay"); v.pause(); });
  const vo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { const p = e.target.play(); if (p) p.catch(() => {}); }
      else e.target.pause();
    });
  }, { threshold: 0.25 });
  videos.forEach(v => vo.observe(v));
}

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
