/* ==========================================================================
   js/pages/posts.js
   Purpose:
   - Renders the Posts index page (table)
   - Supports:
     - Sorting (newest / oldest / title)
     - Live filtering (title / summary / tags)
     - Reading-time estimate
     - Row-click navigation (without breaking normal links)
   Dependencies:
   - window.Data.getPosts()
   - window.UI (esc, fmt)
      

   Upgrades as of FEB2026:
   - Year filter dropdown
   - Clickable tag chips (adds/removes filter)
   - Keeps: sort + live search + reading time + row click
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");
  const posts = await Data.getPosts();

  // Build filter data
  const years = Array.from(
    new Set(posts.map(p => (p.date || "").slice(0, 4)).filter(Boolean))
  ).sort((a, b) => b.localeCompare(a));

  const allTags = Array.from(
    new Set(posts.flatMap(p => p.tags || []).map(t => String(t).trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  let activeTag = ""; // single tag filter (simple + clean)

  app.innerHTML = `
    <div class="toolbar">
      <div class="left">
        <div class="select">
          <span class="emoji">⇅</span>
          <select id="order" aria-label="Order posts">
            <option value="new">Order: Newest</option>
            <option value="old">Order: Oldest</option>
            <option value="title">Order: Title</option>
          </select>
        </div>

        <div class="select">
          <span class="emoji">🗓️</span>
          <select id="year" aria-label="Filter by year">
            <option value="">Year: All</option>
            ${years.map(y => `<option value="${UI.esc(y)}">${UI.esc(y)}</option>`).join("")}
          </select>
        </div>

        <div class="count" id="count" aria-live="polite"></div>
      </div>

      <div class="search">
        <span class="emoji">⌕</span>
        <input id="q" placeholder="Filter by title, summary, tag" aria-label="Filter posts" />
      </div>
    </div>

    <div class="tagbar" id="tagbar" aria-label="Tags"></div>

    <table class="table posts-table">
      <thead>
        <tr>
          <th>Posts</th>
          <th class="datehead">Date</th>
        </tr>
      </thead>
      <tbody id="rows"></tbody>
    </table>
  `;

  const rows = document.getElementById("rows");
  const order = document.getElementById("order");
  const q = document.getElementById("q");
  const year = document.getElementById("year");
  const count = document.getElementById("count");
  const tagbar = document.getElementById("tagbar");

  function iconFor(p) {
    const t = (p.tags || []).join(" ").toLowerCase();
    if (t.includes("ml") || t.includes("ai")) return "🧊";
    if (t.includes("tool") || t.includes("tui")) return "🧰";
    if (t.includes("style") || t.includes("design")) return "🎨";
    if (t.includes("notes")) return "🗒️";
    if (t.includes("personal")) return "🧑‍💻";
    if (t.includes("language") || t.includes("parser") || t.includes("interpreter")) return "🧠";
    if (t.includes("architecture") || t.includes("systems")) return "🧱";
    return "📝";
  }

  function words(str) {
    return (str || "")
      .replace(/[`#>*_~\-]/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }

  function readingTimeMinutes(p) {
    const w = words(p.body);
    if (!w) return null;
    return Math.max(1, Math.round(w / 220));
  }

function renderTagbar() {
  const expanded = tagbar.classList.contains("open");

  const toggleChip = `
    <button class="tagchip tag-toggle ${expanded ? "active" : ""}" data-toggle="1">
      ${expanded ? "Hide tags" : "All tags"}
    </button>
  `;

  const chips = allTags.map(t => `
    <button class="tagchip ${activeTag === t ? "active" : ""}" data-tag="${UI.esc(t)}">
      ${UI.esc(t)}
    </button>
  `).join("");

  tagbar.innerHTML = toggleChip + `<div class="tag-list">${chips}</div>`;

  // Toggle chip behavior:
  const toggleBtn = tagbar.querySelector("[data-toggle]");
  toggleBtn.addEventListener("click", () => {
    // always clear the active tag filter when hitting "All tags"
    activeTag = "";
    render();

    // toggle tag list visibility on BOTH desktop and mobile
    tagbar.classList.toggle("open");
    renderTagbar();
  });

  // Tag click behavior
  tagbar.querySelectorAll("[data-tag]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTag = btn.getAttribute("data-tag") || "";
      render();
      renderTagbar();
    });
  });
}

  function render() {
    const query = (q.value || "").toLowerCase().trim();
    let list = posts.slice();

    // Year filter
    if (year.value) {
      list = list.filter(p => (p.date || "").startsWith(year.value));
    }

    // Tag filter (single tag)
    if (activeTag) {
      list = list.filter(p => (p.tags || []).map(String).includes(activeTag));
    }

    // Sort
    if (order.value === "old") list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    if (order.value === "new") list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    if (order.value === "title") list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    // Search filter
    if (query) {
      list = list.filter((p) => {
        const hay = (p.title + " " + (p.summary || "") + " " + (p.tags || []).join(" ")).toLowerCase();
        return hay.includes(query);
      });
    }

    count.textContent = `${list.length} post${list.length === 1 ? "" : "s"}${activeTag ? ` • tag: ${activeTag}` : ""}`;

    if (!list.length) {
      rows.innerHTML = `
        <tr class="post-row">
          <td colspan="2">
            <div class="empty">
              <div style="font-weight:700">No matches</div>
              <div class="footer" style="margin-top:6px">Try a different keyword, tag, or year.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    rows.innerHTML = list
      .map((p, i) => {
        const tags = (p.tags || []).slice(0, 6);
        const rt = readingTimeMinutes(p);
        const href = `post.html?slug=${encodeURIComponent(p.slug)}`;

return `
  <tr class="post-row fade-in" style="animation-delay:${Math.min(i * 18, 180)}ms" data-href="${UI.esc(href)}">
    
    <td>
      <div class="post-title">
        <span class="emoji">${iconFor(p)}</span>
        <div class="post-main" data-date="${UI.esc(UI.fmt(p.date))}">
          
          ${p.thumb ? `
            <div class="post-thumb">
              <img src="${UI.esc(new URL(String(p.thumb).replace(/^\/+/, ""), document.baseURI))}" alt="" loading="lazy">
            </div>
          ` : ""}

          <a class="post-link" href="${UI.esc(href)}">${UI.esc(p.title)}</a>

          ${p.summary
            ? `<div class="post-summary">${UI.esc(p.summary)}</div>`
            : `<div class="post-summary muted">No summary yet.</div>`}

          <div class="post-meta">
            ${rt ? `<span class="meta-pill">${rt} min read</span>` : ""}
            ${tags.map((t) => `<span class="meta-pill">${UI.esc(t)}</span>`).join("")}
          </div>

        </div>
      </div>
    </td>

    <td class="datecol">
      ${UI.esc(UI.fmt(p.date))}
    </td>

  </tr>
`;
      })
      .join("");

    rows.querySelectorAll(".post-row[data-href]").forEach((tr) => {
      tr.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        const href = tr.getAttribute("data-href");
        if (href) window.location.href = href;
      });
    });
  }
  

  // Events
  order.addEventListener("change", render);
  year.addEventListener("change", render);
  q.addEventListener("input", render);

  // Initial
  renderTagbar();
  render();
});