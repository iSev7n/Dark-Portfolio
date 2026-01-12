document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  const featured = [
    {
      title: "Desktop4Kids OS",
      thumb: "assets/projects/desktop4kids.png",
      desc: "Electron-based desktop simulation for a safe, offline-first kid-friendly computer experience. Features a full desktop environment, window manager, multi-user accounts, sandboxed filesystem API, and built-in apps like File Explorer, Media Center, Notepad, Calculator, Paint, Settings, and a recoverable Trash system.",
      tags: ["Electron", "Desktop UI", "Offline-first", "Local AI Tutor", "Window Manager", "Filesystem API"],
      links: [
        { label: "Repo", href: "https://github.com/iSev7n/Desktop4kids-OS" }
      ]
    },
    {
      title: "Genesis Script v2",
      desc: "A custom scripting language inspired by biblical terminology and designed for clarity, safety, and experimentation. Built as a complete language toolchain with a tokenizer, parser, interpreter, transpiler, CLI tools, and tests. Refactored and security-hardened with a clean, modular architecture. Uses the .gs file format.",
      tags: ["Language Design", "Interpreter", "Parser", "CLI Tools", "JavaScript"],
      links: [
        { label: "Repo", href: "https://github.com/iSev7n/Genesis-Script-v2" }
      ]
    },
    {
      title: "Dark Portfolio (Website Template)",
      thumb: "assets/projects/dark-portfolio.png",
      desc: "A clean, docs-style static portfolio template built with vanilla HTML, CSS, and JavaScript. Includes Posts (JSON + Markdown renderer), docs-style post view with sidebar tree, Projects grid, Music page with playlist embed, RSS feed support, theming, and a system-style UI layout.",
      tags: ["HTML", "CSS", "JavaScript", "Static Site", "Markdown", "RSS", "Docs-style UI"],
      links: [
        { label: "Repo", href: "https://github.com/iSev7n/Dark-Portfolio" }
      ]
    }
  ];

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

  const more = [
    {
      title: "GitHub Profile",
      desc: "More projects, experiments, and active development work.",
      tags: ["GitHub", "Open Source"],
      links: [{ label: "Open", href: "https://github.com/iSev7n" }]
    }
  ];

  function thumbBlock(item) {
    // If no thumb provided, show a clean placeholder block
    if (!item.thumb) {
      return `<div class="proj-thumb proj-thumb--placeholder" aria-hidden="true"></div>`;
    }
    return `
      <div class="proj-thumb">
        <img src="${UI.esc(item.thumb)}" alt="${UI.esc(item.title)} thumbnail" loading="lazy">
      </div>
    `;
  }

  function card(item) {
    const tags = (item.tags || [])
      .map(t => `<span class="tag">${UI.esc(t)}</span>`)
      .join(" ");

    const links = (item.links || [])
      .map(
        l =>
          `<a class="btnlink" href="${UI.esc(l.href)}" target="_blank" rel="noopener">${UI.esc(l.label)}</a>`
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

  app.innerHTML = `
    <div class="prose" style="margin-top:18px">
      <h2 style="margin:0 0 8px">Projects</h2>
      <p class="muted" style="margin:0">
        Selected work across web apps, dashboards, and commercial HTML5 games.
      </p>
    </div>

    <div class="prose" style="margin-top:14px">
      <h3 style="margin:0 0 10px">Featured</h3>
      <div class="repo-grid">
        ${featured.map(card).join("")}
      </div>
    </div>

    <div class="prose" style="margin-top:14px">
      <h3 style="margin:0 0 10px">Games (Commercial)</h3>
      <div class="repo-grid">
        ${games.map(card).join("")}
      </div>
    </div>

    <div class="prose" style="margin-top:14px">
      <h3 style="margin:0 0 10px">More</h3>
      <div class="repo-grid">
        ${more.map(card).join("")}
      </div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    .repo-grid{
      display:grid;
      grid-template-columns:repeat(3, 1fr);
      gap:14px;
    }
    @media (max-width: 1100px){ .repo-grid{ grid-template-columns:repeat(2,1fr); } }
    @media (max-width: 700px){ .repo-grid{ grid-template-columns:1fr; } }

    .proj-card{
      transition: transform .15s ease, border-color .15s ease, background .15s ease;
    }
    .proj-card:hover{
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
      background: color-mix(in srgb, var(--panel2) 85%, var(--accent) 6%);
    }

    .proj-thumb{
      margin-top:10px;
      border:1px solid var(--border);
      border-radius:8px;
      overflow:hidden;
      background: var(--panel);
      box-shadow: 0 10px 24px rgba(0,0,0,.18);
    }
    .proj-thumb img{
      width:100%;
      height:140px;
      object-fit:cover;
      object-position:center;
      display:block;
    }

    .proj-thumb--placeholder{
      height:140px;
      background:
        radial-gradient(circle at 30% 25%, rgba(99,163,255,.25), transparent 55%),
        radial-gradient(circle at 70% 70%, rgba(176,132,255,.22), transparent 55%),
        color-mix(in srgb, var(--panel2) 80%, #000);
    }

    .btnlink{
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:7px 10px;
      border:1px solid var(--border);
      background: color-mix(in srgb, var(--panel) 70%, transparent);
      color: var(--text);
      border-radius:6px;
      font-weight:700;
      font-size:12px;
    }
    .btnlink:hover{
      border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
      background: color-mix(in srgb, var(--accent) 10%, var(--panel2));
    }
  `;
  document.head.appendChild(style);
});
