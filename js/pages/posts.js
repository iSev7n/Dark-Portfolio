document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");
  const posts = await Data.getPosts();

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

        <div class="count" id="count" aria-live="polite"></div>
      </div>

      <div class="search">
        <span class="emoji">⌕</span>
        <input id="q" placeholder="Filter by title, summary, tag" aria-label="Filter posts" />
      </div>
    </div>

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
  const count = document.getElementById("count");

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
    return (str || "").replace(/[`#>*_~\-]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  }

  function readingTimeMinutes(p) {
    const w = words(p.body);
    if (!w) return null;
    return Math.max(1, Math.round(w / 220));
  }

  function render() {
    const query = (q.value || "").toLowerCase().trim();
    let list = posts.slice();

    if (order.value === "old") list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    if (order.value === "new") list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    if (order.value === "title") list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    if (query) {
      list = list.filter((p) => {
        const hay = (p.title + " " + (p.summary || "") + " " + (p.tags || []).join(" ")).toLowerCase();
        return hay.includes(query);
      });
    }

    count.textContent = `${list.length} post${list.length === 1 ? "" : "s"}`;

    if (!list.length) {
      rows.innerHTML = `
        <tr class="post-row">
          <td colspan="2">
            <div class="empty">
              <div style="font-weight:700">No matches</div>
              <div class="footer" style="margin-top:6px">Try a different keyword or clear the filter.</div>
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
          <tr class="post-row fade-in" style="animation-delay:${Math.min(i * 18, 180)}ms" data-href="${UI.esc(
            href
          )}">
            <td>
              <div class="post-title">
                <span class="emoji">${iconFor(p)}</span>
                  <div class="post-main">
                    ${p.thumb ? `
                      <div class="post-thumb">
                        <img src="${UI.esc("/" + String(p.thumb).replace(/^\/+/, ""))}" alt="" loading="lazy">
                      </div>
                    ` : ""}

                    <a class="post-link" href="${UI.esc(href)}">${UI.esc(p.title)}</a>

                    ${
                      p.summary
                        ? `<div class="post-summary">${UI.esc(p.summary)}</div>`
                        : `<div class="post-summary muted">No summary yet.</div>`
                    }

                    <div class="post-meta">
                      ${rt ? `<span class="meta-pill">${rt} min read</span>` : ""}
                      ${tags.map((t) => `<span class="meta-pill">${UI.esc(t)}</span>`).join("")}
                    </div>
                  </div>
              </div>
            </td>
            <td class="datecol">${UI.fmt(p.date)}</td>
          </tr>
        `;
      })
      .join("");

    // Make the whole row clickable (but let links still work normally)
    rows.querySelectorAll(".post-row[data-href]").forEach((tr) => {
      tr.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (a) return;
        const href = tr.getAttribute("data-href");
        if (href) window.location.href = href;
      });
    });
  }

  order.addEventListener("change", render);
  q.addEventListener("input", render);
  render();
});
