/* ==========================================================================
   markdown.js
   Purpose:
   - Lightweight, safe Markdown → HTML renderer (offline-first)
   - Escapes raw HTML to prevent injection
   - Supports:
     - Headings (#, ##, ###)
     - Horizontal rules (---)
     - Unordered lists (- item)
     - Fenced code blocks (```lang)
     - Inline: images, links, code, bold, italic
   Notes:
   - Intentionally minimal and predictable (not full CommonMark)
   - Behavior preserved exactly from your original implementation
   ========================================================================== */

(function () {
  /* --------------------------------------------------------------------------
     Escaping helpers
     -------------------------------------------------------------------------- */

  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function escAttr(s) {
    return esc(s).replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }

  /* --------------------------------------------------------------------------
     Inline Markdown (single-line transforms)
     - IMPORTANT: escape first to block raw HTML injection
     - IMPORTANT: images before links to avoid mis-parsing
     -------------------------------------------------------------------------- */

  function inline(md) {
    // Escape first so raw HTML in post bodies can't inject markup.
    let s = esc(md);

    // Images FIRST: ![alt](url)
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) => {
      const a = escAttr(alt);
      const u = escAttr(url);
      return `<img src="${u}" alt="${a}" loading="lazy" decoding="async">`;
    });

    // Links: [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
      const t = text; // already escaped by esc()
      const u = escAttr(url);
      return `<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
    });

    // Inline code: `code`
    s = s.replace(/`([^`]+)`/g, (_m, p1) => `<code>${p1}</code>`);

    // Bold then italic
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    return s;
  }

  /* --------------------------------------------------------------------------
     Block Markdown (line-based parsing)
     -------------------------------------------------------------------------- */

  function toHtml(md) {
    const lines = String(md ?? "").replaceAll("\r\n", "\n").split("\n");

    let out = [];
    let inList = false;
    let inCode = false;
    let lang = "";

    const flushList = () => {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
    };

    for (const line of lines) {
      // Code fences
      const fence = line.match(/^```(\w+)?\s*$/);
      if (fence) {
        if (!inCode) {
          flushList();
          inCode = true;
          lang = fence[1] || "";
          out.push(`<pre><code data-lang="${escAttr(lang)}">`);
        } else {
          inCode = false;
          out.push("</code></pre>");
        }
        continue;
      }

      // Inside code block: escape raw and preserve newlines
      if (inCode) {
        out.push(esc(line) + "\n");
        continue;
      }

      // Horizontal rule
      if (/^\s*---\s*$/.test(line)) {
        flushList();
        out.push("<hr>");
        continue;
      }

      // Headings (#, ##, ###)
      const h = line.match(/^(#{1,3})\s+(.*)$/);
      if (h) {
        flushList();
        const lvl = h[1].length;
        out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`);
        continue;
      }

      // Unordered list
      const li = line.match(/^\s*-\s+(.*)$/);
      if (li) {
        if (!inList) {
          out.push("<ul>");
          inList = true;
        }
        out.push(`<li>${inline(li[1])}</li>`);
        continue;
      }

      // Blank line ends list/paragraph flow
      if (line.trim() === "") {
        flushList();
        continue;
      }

      // Paragraph
      flushList();
      out.push(`<p>${inline(line)}</p>`);
    }

    flushList();
    return out.join("\n");
  }

  // Public API
  window.Markdown = { toHtml };
})();
