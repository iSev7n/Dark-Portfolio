/* ==========================================================================
   js/pages/experience.js
   Purpose:
   - Renders the Experience page (timeline card)
   Dependencies:
   - UI.esc()
   Notes:
   - No behavioral changes (same HTML + same timeline data)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // Mount
  // --------------------------------------------------------------------------
  const app = document.getElementById("app");

  // --------------------------------------------------------------------------
  // Timeline data (order matters)
  // --------------------------------------------------------------------------
  const timeline = [
    {
      when: "2024 – Present",
      what: "Senior Web & Systems Developer (Leadership Role)",
      detail:
        "Designs and maintains high-fidelity web-based dashboards and internal tools focused on real-time data visibility, readiness tracking, and decision support. Leads small teams, translates complex operational requirements into usable interfaces, and enforces clean architecture and maintainable code standards.",
    },
    {
      when: "2018 – Present",
      what: "Independent Web & Game Developer",
      detail:
        "Developed multiple production-ready browser games and applications using HTML, CSS, and JavaScript. Projects include educational platforms, operating-system-style web UIs, real-time simulations, and interactive dashboards. Experience publishing commercial products and maintaining long-term codebases.",
    },
    {
      when: "2020 – 2024",
      what: "Systems Engineer & Application Developer",
      detail:
        "Built and maintained mission-critical software interfaces, data pipelines, and visualization tools. Refactored legacy workflows into modern, streamlined systems. Produced leadership-level reporting dashboards and automated data validation processes to reduce human error and improve reliability.",
    },
    {
      when: "2016 – 2020",
      what: "Technical Operations & Network Systems Specialist",
      detail:
        "Worked hands-on with complex technical systems, secure networks, and real-time data flows. Developed strong foundations in troubleshooting, documentation, process improvement, and system reliability — skills now applied directly to software engineering and UI architecture.",
    },
  ];

  // --------------------------------------------------------------------------
  // Render (markup intentionally unchanged)
  // --------------------------------------------------------------------------
  app.innerHTML = `
    <div class="prose" style="margin-top:18px">
      <h2 style="margin:0 0 10px">Experience</h2>
      <p class="muted">
        A blend of professional software development, systems engineering, and leadership —
        focused on building reliable, user-centric digital products.
      </p>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="card-b">
        ${timeline
          .map(
            (t, i) => `
          <div style="
            display:flex;
            gap:16px;
            padding:12px 0;
            border-bottom:${i === timeline.length - 1 ? "none" : "1px solid var(--border)"}
          ">
            <div class="datecol experience-date">
              ${UI.esc(t.when)}
            </div>
            <div>
              <div style="font-weight:700; margin-bottom:4px">
                ${UI.esc(t.what)}
              </div>
              <div class="footer" style="line-height:1.6">
                ${UI.esc(t.detail)}
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
});
