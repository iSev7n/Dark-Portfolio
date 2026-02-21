/* ==========================================================================
   FILE: js/pages/music.js
   PURPOSE: Music page using a Spotify Playlist embed

   EXPECTS:
   - <div id="app"></div>
   - window.SITE_CONFIG exists
   - UI.esc() optional (fallback included)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const cfg = window.SITE_CONFIG || {};

  const esc = (s) =>
    window.UI && typeof UI.esc === "function" ? UI.esc(s) : String(s ?? "");

  // -----------------------------
  // Config
  // -----------------------------
  const musicCfg = cfg.music || {};
  const spotifyUrl = musicCfg.spotifyPlaylistUrl || musicCfg.spotifyUrl || "";
  const spotifyId = musicCfg.spotifyPlaylistId || musicCfg.spotifyId || "";

  // Accept either full URL or playlist ID
  const playlistId =
    spotifyId || (spotifyUrl.match(/playlist\/([a-zA-Z0-9]+)/) || [])[1] || "";

  const openUrl =
    musicCfg.open ||
    spotifyUrl ||
    (playlistId ? `https://open.spotify.com/playlist/${playlistId}` : "");

  const embedUrl = playlistId
    ? `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`
    : "";

  const title = cfg.nowPlaying?.title || "Main Playlist";
  const desc =
    cfg.nowPlaying?.desc ||
    "My go-to background playlist for coding and deep focus.";

  // -----------------------------
  // Render
  // -----------------------------
  app.innerHTML = `
    <div class="prose section-accent" style="margin-top:18px">
      <h2 style="margin:0 0 10px">Music</h2>
      <p class="muted" style="margin:0">
        Background soundtracks for building, thinking, and long sessions.
      </p>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="card-b">

        <div class="music-head">
          <div class="music-meta">
            <div class="music-title">
              <span class="emoji">🎧</span>
              <span>${esc(title)}</span>
            </div>
            <div class="music-desc">${esc(desc)}</div>
          </div>

          ${
            openUrl
              ? `<div class="music-actions">
                   <a class="openbtn" href="${esc(
                     openUrl
                   )}" target="_blank" rel="noopener">Open in Spotify</a>
                 </div>`
              : ""
          }
        </div>

        <div class="music-embed spotify">
          ${
            embedUrl
              ? `
                <iframe
                  src="${esc(embedUrl)}"
                  width="100%"
                  height="352"
                  frameborder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify playlist embed"
                ></iframe>
              `
              : `
                <div class="music-empty">
                  <div style="font-weight:800; font-size:14px;">Spotify playlist not set</div>
                  <div class="muted" style="margin-top:6px; font-size:12px; line-height:1.6;">
                    In <code>js/config.js</code>, set:
                    <br/>
                    <code>music.spotifyPlaylistUrl</code> = your playlist link
                  </div>
                </div>
              `
          }
        </div>

      </div>
    </div>
  `;
});