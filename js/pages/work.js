document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  const items = [
    {
      role: "Sensor Control Officer (Sensor Manager Cell)",
      org: "U.S. Army (13th MDB) • Shaw AFB, SC",
      period: "Mar 2024 – Present",
      bullets: [
        "Leads, trains, and mentors a team supporting ballistic missile defense operations with an emphasis on readiness and mission execution.",
        "Subject Matter Expert (SME) on C2BMC and AN/TPY-2 radar operations, supporting planning, coordination, and operational decision-making.",
        "Supports leadership-focused reporting and transparent readiness tracking to improve operational awareness and prioritization."
      ]
    },
    {
      role: "Early Warning System Manager (Sensor Manager Cell)",
      org: "U.S. Army (11th MDB) • Ramstein AB, Germany",
      period: "Feb 2020 – Mar 2024",
      bullets: [
        "Maintained continuous operations for AN/TPY-2 radar missions across two locations while supporting separate mission sets.",
        "Revised and implemented operational checklist improvements to increase reliability and reduce execution risk.",
        "Generated and distributed daily status reports reviewed at senior-leader level to support readiness awareness and planning.",
        "Supervised and accounted for $2M+ in communications equipment with zero loss or damage.",
        "Selected as Unit Security Manager, ensuring secure handling of systems and verifying clearance requirements for 20+ personnel."
      ]
    },
    {
      role: "Early Warning Operator / Patriot Crew Member",
      org: "U.S. Army • Fort Sill, OK",
      period: "Sep 2016 – Feb 2020",
      bullets: [
        "Supported real-time air and missile defense operations through surveillance, data analysis, and tactical communications.",
        "Managed accountability for $500K+ in communications and electronic equipment with 100% property control.",
        "Delivered technical training to personnel, supporting certification and improved team capability.",
        "Worked with tactical data links (including Link-16) and systems integration processes in secure environments."
      ]
    }
  ];

  const education = [
    {
      degree: "Bachelor of Business Administration (BBA)",
      school: "Upper Iowa University",
      focus: "Business Administration • Entrepreneurship Focus",
      date: "Expected May 2026"
    },
    {
      degree: "Associate’s Degree",
      school: "Upper Iowa University",
      focus: "Business Administration",
      date: "Completed May 2024"
    }
  ];

  const skills = [
    "Leadership & Team Development",
    "Systems Operations & Reliability",
    "Secure Communications",
    "Real-Time Data Monitoring",
    "Operational Reporting & Dashboards",
    "Process Improvement",
    "Technical Documentation",
    "Cross-Functional Coordination"
  ];

  app.innerHTML = `
    <div class="prose section-accent" style="margin-top:18px">
      <h2 style="margin:0 0 10px">Work</h2>
      <p class="muted" style="margin:0">
        Professional experience focused on leadership, systems operations, secure communications, and readiness reporting.
      </p>
    </div>

    ${items.map(w => `
      <div class="card" style="margin-top:14px">
        <div class="card-h">
          <div>${UI.esc(w.role)} • ${UI.esc(w.org)}</div>
          <div class="datecol">${UI.esc(w.period)}</div>
        </div>
        <div class="card-b">
          <ul style="margin:0; padding-left:18px; line-height:1.7">
            ${w.bullets.map(b => `<li>${UI.esc(b)}</li>`).join("")}
          </ul>
        </div>
      </div>
    `).join("")}

    <div class="prose section-accent" style="margin-top:18px">
      <h3 style="margin:0 0 10px">Education</h3>
      <div class="muted" style="margin:0 0 10px">
        Business education with an entrepreneurship focus, supporting product thinking and long-term project execution.
      </div>
    </div>

    ${education.map(e => `
      <div class="card edu-card" style="margin-top:14px">
        <div class="card-h">
          <div>
            <strong>${UI.esc(e.degree)}</strong> • ${UI.esc(e.school)}
          </div>
          <div class="datecol">${UI.esc(e.date)}</div>
        </div>
        <div class="card-b">
          <div class="footer" style="color:var(--muted); line-height:1.6">
            ${UI.esc(e.focus)}
          </div>
        </div>
      </div>
    `).join("")}

    <div class="prose section-accent" style="margin-top:18px">
      <h3 style="margin:0 0 12px">Key Skills</h3>
      <div class="skills-wrap">
        ${skills.map(s => `<span class="skill-pill">${UI.esc(s)}</span>`).join("")}
      </div>
    </div>
  `;
});
