/* ==========================================================================
   layout.js
   Purpose:
   - Renders shared layout pieces used across pages:
     1) Topbar (brand, nav, icons, theme toggle)
     2) Hero (avatar, greeting, social icons, tabs)
   Notes:
   - Keep functions global because pages call them directly.
   - No behavior changes: same markup, same IDs/classes, same theme logic.
   ========================================================================== */

/* ==========================================================================
   TOPBAR
   - Pulls GitHub + RSS links from SITE_CONFIG.links
   - Uses ICONS map if present (icons.js)
   - Theme button toggles html[data-theme] and persists to localStorage
   ========================================================================== */
function renderTopbar() {
  const cfg = window.SITE_CONFIG;
  const el = document.getElementById("topbar");

  // Find specific links by icon key
  const gh = (cfg.links || []).find((l) => l.icon === "github");
  const rss = (cfg.links || []).find((l) => l.icon === "rss");

  // Icon fallbacks (if ICONS not loaded)
  const ghSvg = window.ICONS && window.ICONS.github ? window.ICONS.github : "GitHub";
  const rssSvg = window.ICONS && window.ICONS.rss ? window.ICONS.rss : "RSS";

  // IMPORTANT: Markup intentionally unchanged
  el.innerHTML = `
    <div class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="index.html" title="Home">
          <span class="sig">${UI.esc(cfg.signature || cfg.siteName)}</span>
        </a>

        <div class="topnav">
          <a href="index.html">about</a>
          <a href="posts.html">posts</a>
          <a href="projects.html">projects</a>
          <span class="sep">|</span>

          <a class="topico" href="${UI.esc(gh?.href || "#")}" target="_blank" rel="noopener"
             title="GitHub" aria-label="GitHub">${ghSvg}</a>

          <a class="topico" href="${UI.esc(rss?.href || "rss.xml")}"
             title="RSS" aria-label="RSS">${rssSvg}</a>

          <button id="themeBtn" class="topbtn" title="Toggle theme" aria-label="Toggle theme">○</button>
        </div>
      </div>
    </div>
  `;

  // Theme toggle wiring
  const btn = document.getElementById("themeBtn");
  if (!btn) return;

  // Updates the button symbol based on current theme
  const setIcon = () => {
    const t = document.documentElement.getAttribute("data-theme") || "dark";
    btn.textContent = t === "light" ? "◑" : "○";
  };

  setIcon();

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);

    setIcon();
  });
}

/* ==========================================================================
   HERO
   - Renders avatar + greeting
   - Renders social icon row from SITE_CONFIG.links
   - Renders tab row from SITE_CONFIG.tabs
   - activeTabKey highlights the active tab
   ========================================================================== */
function renderHero(activeTabKey) {
  const cfg = window.SITE_CONFIG;
  const el = document.getElementById("hero");

  // Social icons row
  const icons = (cfg.links || [])
    .map((l) => {
      const svg = window.ICONS && window.ICONS[l.icon] ? window.ICONS[l.icon] : "";
      return `<a href="${UI.esc(l.href)}" class="ico" title="${UI.esc(l.title || "")}">${svg}</a>`;
    })
    .join("");

  // Tabs row
  const tabs = (cfg.tabs || [])
    .map((t) => {
      const isActive = t.key === activeTabKey;
      return `<a class="tab ${isActive ? "active" : ""}" href="${UI.esc(t.href)}"><span class="ticon">${UI.esc(
        t.emoji || "▣"
      )}</span>${UI.esc(t.label)}</a>`;
    })
    .join("");

  // IMPORTANT: Markup intentionally unchanged
  el.innerHTML = `
    <div class="hero">
      <div class="avatar avatar-img">
        <img src="assets/me.png" alt="${UI.esc(cfg.siteName)}">
      </div>
      <div class="hi"><span class="wave">👋</span>Hi, I'm ${UI.esc(cfg.siteName)}!</div>
      <div class="iconrow">${icons}</div>
      <div class="tabs">${tabs}</div>
    </div>
  `;
}
