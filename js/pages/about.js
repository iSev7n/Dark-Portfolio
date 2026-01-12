/* ==========================================================================
   js/pages/about.js
   Purpose:
   - Renders the About page (main prose + right-side cards)
   - Sections:
     - About prose (left)
     - Pinned links (right)
     - Snapshot highlights (right)
     - Last updated (right)
     - Now Playing (right)
   Dependencies:
   - window.SITE_CONFIG
   - UI.esc()
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // Config + mount
  // --------------------------------------------------------------------------
  const cfg = window.SITE_CONFIG;

  // Config-driven “Now Playing” card (with safe fallback)
  const np = cfg.nowPlaying || {
    title: "Main Playlist",
    desc: "My go-to background playlist for coding and deep focus.",
    href: "music.html",
  };

  const app = document.getElementById("app");

  // --------------------------------------------------------------------------
  // Data: Snapshot highlights
  // --------------------------------------------------------------------------
  const highlights = [
    { label: "Primary stack", value: "HTML • CSS • JavaScript • Electron" },
    { label: "Focus", value: "System-style UIs • Offline-first • UI architecture" },
    { label: "Recent work", value: "Desktop4Kids OS • Genesis Script v2" },
    { label: "Education", value: "Business Admin (Entrepreneurship) • Upper Iowa University" },
  ];

  // --------------------------------------------------------------------------
  // Data: Pinned links
  // --------------------------------------------------------------------------
  const pinned = [
    {
      title: "Desktop4Kids OS",
      desc: "Electron desktop simulation for a safe, offline-first learning environment.",
      href: "projects.html",
      external: false,
    },
    {
      title: "Genesis Script v2",
      desc: "A beginner-friendly scripting language with a full toolchain (tokenizer → parser → interpreter).",
      href: "projects.html",
      external: false,
    },
    {
      title: "My GitHub",
      desc: "Repos, experiments, and long-term builds.",
      href: "https://github.com/iSev7n",
      external: true,
    },
  ];

  // NOTE: This object existed previously but was not used by the template.
  // Kept as a labeled placeholder for future expansion (no behavior impact).
  const nowPlaying = {
    title: "Main Playlist",
    desc: "My go-to background playlist for coding and deep focus.",
    href: "music.html",
  };
  void nowPlaying; // prevents “unused” warnings in some editors

  // --------------------------------------------------------------------------
  // Helper: render list items with optional last-row styling
  // --------------------------------------------------------------------------
  const renderList = (items, renderRow) =>
    items
      .map((item, i) => {
        const isLast = i === items.length - 1;
        return renderRow(item, isLast);
      })
      .join("");

  // --------------------------------------------------------------------------
  // Render (markup intentionally unchanged)
  // --------------------------------------------------------------------------
  app.innerHTML = `
    <div class="about-grid">
      <section class="prose section-accent">
        <h2 style="margin:0 0 10px">About</h2>

        <p style="margin:0 0 14px">
          I’m <strong>Thomas Davis</strong> — I build desktop-style environments, offline-first tools, and clean UI systems that
          make complex workflows feel simple.
        </p>

        <p class="muted" style="margin:0 0 14px; line-height:1.7">
          I’m drawn to projects that behave like products: predictable, fast, and calm to use. A lot of my work is
          intentionally offline or offline-capable because security matters, reliability matters, and if the internet
          disappears you should still be able to access the information that matters.
        </p>

        <p class="muted" style="margin:0 0 14px; line-height:1.7">
          I love building system-style experiences: desktop environments, window managers, file explorers, browsers,
          chat systems, dashboards, and internal tools. I also enjoy creating things from scratch — custom programming
          languages, lightweight CMS-style setups, reusable web templates, and UI frameworks that stay maintainable as
          they grow.
        </p>

        <div style="margin-top:16px">
          <div style="font-weight:700; margin-bottom:10px">Things I build</div>
          <ul style="margin:0; padding-left:18px; line-height:1.75">
            <li>Desktop & web apps that simplify real workflows (tools, dashboards, automation)</li>
            <li>Offline-first systems for security, reliability, and local control</li>
            <li>UI architecture: reusable components, theming, layout systems, responsive design</li>
            <li>Custom tooling: parsers, interpreters, CLIs, and developer-friendly workflows</li>
            <li>Smart Microsoft Office solutions (Excel/Docs) that push beyond typical templates</li>
          </ul>
        </div>

        <div style="margin-top:16px">
          <div style="font-weight:700; margin-bottom:10px">Interests</div>
          <div class="skills-wrap">
            <span class="skill-pill">Offline-first architecture</span>
            <span class="skill-pill">Desktop-style UI systems</span>
            <span class="skill-pill">Security-minded design</span>
            <span class="skill-pill">Dashboards & automation</span>
            <span class="skill-pill">Custom languages & toolchains</span>
            <span class="skill-pill">Web templates & UI kits</span>
            <span class="skill-pill">Electronics & system design</span>
            <span class="skill-pill">AI tools (practical use)</span>
          </div>
        </div>

        <hr />

        <p class="muted" style="margin:0; line-height:1.7">
          If you want to see what I’ve built, head to <a href="projects.html">Projects</a>.
          If you want to see how I think, check <a href="posts.html">Posts</a>.
        </p>
      </section>

      <aside class="sidecards">

        <div class="card">
          <div class="card-h">📌 Pinned</div>
          <div class="card-b">
            ${renderList(
              pinned,
              (p, isLast) => `
              <div style="padding:10px 0; ${isLast ? "" : "border-bottom:1px solid var(--border)"}">
                <div style="font-weight:700">
                  <a href="${UI.esc(p.href)}" ${p.external ? `target="_blank" rel="noopener"` : ""}>
                    ${UI.esc(p.title)}
                  </a>
                </div>
                <div class="small" style="margin-top:6px; line-height:1.6">${UI.esc(p.desc)}</div>
              </div>
            `
            )}
          </div>
        </div>

        <div class="card">
          <div class="card-h">⚙️ Snapshot</div>
          <div class="card-b">
            ${renderList(
              highlights,
              (h, isLast) => `
              <div class="row" style="padding:8px 0; ${isLast ? "" : "border-bottom:1px solid var(--border)"}">
                <div class="small">${UI.esc(h.label)}:</div>
                <div class="small" style="text-align:right">${UI.esc(h.value)}</div>
              </div>
            `
            )}
          </div>
        </div>

        <div class="card">
          <div class="card-h">🧾 Last Updated</div>
          <div class="card-b">
            <div class="row">
              <div class="small">Updated:</div>
              <div class="small">${new Date().toISOString().slice(0,10)} • ${new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-h">🎵 Now Playing</div>
          <div class="card-b">
            <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start">
              <div style="min-width:0">
                <div style="font-weight:800; display:flex; gap:8px; align-items:center">
                  <span class="emoji" aria-hidden="true">🎧</span>
                  <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
                    ${UI.esc(np.title)}
                  </span>
                </div>
                <div class="small" style="margin-top:6px; line-height:1.6">
                  ${UI.esc(np.desc)}
                </div>
              </div>

              <a class="openbtn" href="${UI.esc(np.href)}">Open</a>
            </div>

            <div class="small" style="margin-top:10px; color:var(--dim)">
              YouTube Music playlist available on the Music page.
            </div>
          </div>
        </div>

        
      </aside>
    </div>
  `;
});
