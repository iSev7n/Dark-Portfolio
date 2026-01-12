document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const cfg = window.SITE_CONFIG || {};

  const playlist = {
    name: (cfg.nowPlaying && cfg.nowPlaying.title) || "Main Playlist",
    desc: (cfg.nowPlaying && cfg.nowPlaying.desc) || "My go-to background playlist for coding and deep focus.",
    ytListId: (cfg.music && cfg.music.ytListId) || "PLY2pabb5IMzATuTdV4NeEDaZY5rpEYngu",
    open: (cfg.music && cfg.music.open) || "https://music.youtube.com/playlist?list=PLY2pabb5IMzATuTdV4NeEDaZY5rpEYngu"
  };

  app.innerHTML = `
    <div class="prose section-accent" style="margin-top:18px">
      <h2 style="margin:0 0 10px">Music</h2>
      <p class="muted" style="margin:0">
        Background soundtracks for building, thinking, and long sessions.
      </p>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="card-b">
        <div style="display:flex; justify-content:space-between; gap:14px; flex-wrap:wrap">
          <div>
            <div style="font-weight:800; display:flex; gap:10px; align-items:center">
              <span class="emoji">🎧</span>
              ${UI.esc(playlist.name)}
            </div>
            <div class="footer" style="margin-top:6px; color:var(--muted)">
              ${UI.esc(playlist.desc)}
            </div>
            <div class="footer" style="margin-top:10px">
              <a class="openbtn" href="${UI.esc(playlist.open)}" target="_blank" rel="noopener">
                Open in YouTube Music
              </a>
            </div>
          </div>
        </div>

        <div class="music-embed">
          <iframe
            src="https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlist.ytListId)}"
            title="YouTube playlist player"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <style>
      .music-embed{
        margin-top:14px;
        position:relative;
        width:100%;
        padding-top:56.25%;
        border-radius:12px;
        overflow:hidden;
        border:1px solid var(--border);
        background:var(--panel);
      }

      .music-embed iframe{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
      }
    </style>
  `;
});
