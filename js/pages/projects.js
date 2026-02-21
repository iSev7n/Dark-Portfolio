/* ==========================================================================
   Projects Page
   - Category-based layout: Featured, Software, Games, Web Development, All Other
   - Uses UI.esc() for safe HTML output
   - Injects small page-specific CSS for the projects grid/cards
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  // --------------------------------------------------------------------------
  // Data
  // --------------------------------------------------------------------------

  // Featured: Desktop4Kids OS, Nightlamp
  const featured = [
    {
      title: "Desktop4Kids OS",
      thumb: "assets/projects/desktop4kids.png",
      desc: "Electron-based desktop simulation for a safe, offline-first kid-friendly computer experience. Features a full desktop environment, window manager, multi-user accounts, sandboxed filesystem API, and built-in apps like File Explorer, Media Center, Notepad, Calculator, Paint, Settings, and a recoverable Trash system.",
      tags: ["Electron", "Desktop UI", "Offline-first", "Local AI Tutor", "Window Manager", "Filesystem API"],
      links: [{ label: "Repo", href: "https://github.com/iSev7n/Desktop4kids-OS" }]
    },
    {
      title: "Nightlamp Bible",
      thumb: "assets/projects/nightlamp.png",
      desc: "Fast, offline-first Scripture reader designed for focused study, highlighting, note-taking, and bookmarking. Built as a Progressive Web App (PWA) and runs smoothly on desktop and mobile.",
      tags: ["HTML", "CSS", "JavaScript", "PWA", "Offline-first"],
      links: [{ label: "Repo", href: "https://github.com/iSev7n/Nightlamp-Bible" }]
    }
  ];

  // Software: Desktop4Kids OS, Night Lamp, Linux-Healthcheck
  const software = [
    {
      title: "Desktop4Kids OS",
      thumb: "assets/projects/desktop4kids.png",
      desc: "Electron-based desktop simulation for a safe, offline-first kid-friendly computer experience.",
      tags: ["Electron", "Desktop UI", "Offline-first"],
      links: [{ label: "Repo", href: "https://github.com/iSev7n/Desktop4kids-OS" }]
    },
    {
      title: "Nightlamp Bible",
      thumb: "assets/projects/nightlamp.png",
      desc: "Offline-first Bible reader with a focused UI for highlighting, notes, and bookmarks.",
      tags: ["HTML", "CSS", "JavaScript", "PWA"],
      links: [{ label: "Repo", href: "https://github.com/iSev7n/Nightlamp-Bible" }]
    },
    {
      title: "Linux Healthcheck",
      thumb: "assets/projects/linux-healthcheck.png",
      desc: "A Linux healthcheck tool with quick/deep checks (SMART, temps, top processes) and exportable reports for easy system diagnostics.",
      tags: ["Linux", "Diagnostics", "Healthcheck", "Reports"],
      links: [{ label: "Repo", href: "https://github.com/iSev7n/Linux-Healthcheck" }]
    }
  ];

  // Games: Space Shooter, Matching Game, Math Game
  const games = [
    {
      title: "Space Shooter (Codecanyon)",
      thumb: "assets/projects/space-shooter.png",
      desc: "A polished browser-based space shooter with a clean UI, responsive gameplay, and production-ready structure.",
      tags: ["Game", "HTML5", "JavaScript"],
      links: [{ label: "Buy", href: "https://codecanyon.net/item/space-shooter/54220768" }]
    },
    {
      title: "Matching Game (Codecanyon)",
      thumb: "assets/projects/matching-game.png",
      desc: "A mobile-friendly matching game with progression, animations, and a clean codebase ready for reskinning.",
      tags: ["Game", "Mobile", "HTML5"],
      links: [{ label: "Buy", href: "https://codecanyon.net/item/matching-game/54256571" }]
    },
    {
      title: "Math Game (Codecanyon)",
      thumb: "assets/projects/math-game.png",
      desc: "An educational math game with progression and rewards, designed to be easy to customize and expand.",
      tags: ["Game", "Education", "HTML5"],
      links: [{ label: "Buy", href: "https://codecanyon.net/item/math-game/54249549" }]
    }
  ];

  // Web Development: Dark Portfolio, E-Commerce
  const webdev = [
    {
      title: "Dark Portfolio (Website Template)",
      thumb: "assets/projects/dark-portfolio.png",
      desc: "A clean docs-style static portfolio template built with vanilla HTML, CSS, and JavaScript. Includes Posts (JSON + Markdown renderer), docs-style post view with sidebar tree, Projects grid, Music page with playlist embed, RSS feed support, theming, and a system-style UI layout.",
      tags: ["HTML", "CSS", "JavaScript", "Static Site", "Markdown", "RSS"],
      links: [{ label: "Repo", href: "https://github.com/iSev7n/Dark-Portfolio" }]
    },
    {
      title: "E-Commerce Template",
      thumb: "assets/projects/ecommerce-template.png",
      desc: "Modern e-commerce website template with product grid layout, smooth UI, and a solid base for expanding into a full storefront.",
      tags: ["HTML", "CSS", "JavaScript", "Template"],
      links: [{ label: "Repo", href: "https://github.com/iSev7n/ecommerce-template" }]
    }
  ];

  // All Other: GitHub Profile, Genesis Script v2
  const allOther = [
    {
      title: "GitHub Profile",
      thumb: "assets/projects/github-profile.png",
      desc: "More projects, experiments, and active development work.",
      tags: ["GitHub", "Open Source"],
      links: [{ label: "Open", href: "https://github.com/iSev7n" }]
    },
    {
      title: "Genesis Script v2",
      desc: "A custom scripting language inspired by biblical terminology and designed for clarity, safety, and experimentation. Built as a complete language toolchain with a tokenizer, parser, interpreter, transpiler, CLI tools, and tests. Refactored and security-hardened with a clean, modular architecture. Uses the .gs file format.",
      tags: ["Language Design", "Interpreter", "Parser", "CLI Tools", "JavaScript"],
      links: [{ label: "Repo", href: "https://github.com/iSev7n/Genesis-Script-v2" }]
    }
  ];

  // --------------------------------------------------------------------------
  // UI Helpers
  // --------------------------------------------------------------------------

  function thumbBlock(item) {
    if (!item.thumb) {
      return `<div class="proj-thumb proj-thumb--placeholder" aria-hidden="true"></div>`;
    }

    return `
      <div class="proj-thumb">
        <img
          src="${UI.esc(item.thumb)}"
          alt="${UI.esc(item.title)} thumbnail"
          loading="lazy"
        >
      </div>
    `;
  }

  function card(item) {
    const tags = (item.tags || [])
      .map((t) => `<span class="tag">${UI.esc(t)}</span>`)
      .join(" ");

    const links = (item.links || [])
      .map(
        (l) =>
          `<a class="btnlink" href="${UI.esc(l.href)}" target="_blank" rel="noopener">${UI.esc(
            l.label
          )}</a>`
      )
      .join("");

    return `
      <div class="card proj-card">
        <div class="card-b">
          <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start">
            <div style="font-weight:800; font-size:15px">${UI.esc(item.title)}</div>
          </div>

          ${thumbBlock(item)}

          <div class="footer" style="margin-top:10px; color:var(--muted); line-height:1.55">
            ${UI.esc(item.desc || "")}
          </div>

          <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:8px">
            ${tags}
          </div>

          <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap">
            ${links}
          </div>
        </div>
      </div>
    `;
  }

  function section(title, items) {
    return `
      <div class="prose" style="margin-top:14px">
        <h3 class="projects-section-title">${UI.esc(title)}</h3>
        <div class="repo-grid">
          ${items.map(card).join("")}
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Render Page
  // --------------------------------------------------------------------------
  app.innerHTML = `
    <div class="prose projects-intro">
      <h2 class="projects-title">Projects</h2>
      <p class="muted projects-subtitle">
        Organized by category so it stays clean and easy to build on.
      </p>
    </div>

    ${section("Featured", featured)}
    ${section("Software", software)}
    ${section("Games", games)}
    ${section("Web Development", webdev)}
    ${section("All Other", allOther)}
  `;
});
