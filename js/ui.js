/* ==========================================================================
   ui.js
   Purpose:
   - Small UI helpers used across pages
   - Safe HTML escaping
   - Date formatting
   - Lightweight toast notifications
   ========================================================================== */

(function () {
  window.UI = {
    /* ----------------------------------------------------------------------
       Escape unsafe characters for HTML output
       ---------------------------------------------------------------------- */
    esc(s) {
      return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    },

    /* ----------------------------------------------------------------------
       Format an ISO date string into a simple localized date
       ---------------------------------------------------------------------- */
    fmt(iso) {
      try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch {
        return iso;
      }
    },

    /* ----------------------------------------------------------------------
       Minimal toast popup (non-blocking)
       ---------------------------------------------------------------------- */
    toast(msg) {
      const d = document.createElement("div");

      d.style.position = "fixed";
      d.style.bottom = "16px";
      d.style.left = "50%";
      d.style.transform = "translateX(-50%)";
      d.style.padding = "10px 12px";
      d.style.background = "rgba(0,0,0,.86)";
      d.style.border = "1px solid #2a2a2a";
      d.style.color = "#e7e7e7";
      d.style.zIndex = "999";

      d.textContent = msg;

      document.body.appendChild(d);
      setTimeout(() => d.remove(), 2300);
    },
  };
})();
