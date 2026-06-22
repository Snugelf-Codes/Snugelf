(function () {
  const root = document.documentElement;
  const defaultTheme = root.dataset.defaultTheme || "light";
  const savedTheme = localStorage.getItem("snugelf-theme");
  root.dataset.theme = savedTheme || defaultTheme;

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("snugelf-theme", next);
    });
  });

  const communityForm = document.querySelector("[data-community-form]");
  if (communityForm) {
    const textarea = communityForm.querySelector("textarea");
    communityForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!textarea.value.trim()) {
        textarea.focus();
        return;
      }
      const note = textarea.value.trim();
      let savedNotes = [];
      try {
        savedNotes = JSON.parse(localStorage.getItem("snugelf-community-notes") || "[]");
      } catch (error) {
        localStorage.removeItem("snugelf-community-notes");
      }
      if (!Array.isArray(savedNotes)) savedNotes = [];
      const notes = [note, ...savedNotes.filter((savedNote) => savedNote !== note)].slice(0, 8);
      localStorage.setItem("snugelf-community-note", note);
      localStorage.setItem("snugelf-community-notes", JSON.stringify(notes));
      window.location.href = "dashboard.html";
    });
  }

  const confessForm = document.querySelector("[data-confession-form]");
  if (confessForm) {
    confessForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const textarea = confessForm.querySelector("textarea");
      const submitButton = confessForm.querySelector("button");
      const formStatus = confessForm.querySelector("[data-form-status]");
      const confession = textarea.value.trim();
      if (!confession) {
        textarea.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "SENDING...";
      formStatus.textContent = "";

      try {
        const response = await fetch(confessForm.action, {
          method: "POST",
          body: new FormData(confessForm),
          headers: { Accept: "application/json" }
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Could not send confession");

        textarea.value = "";
        textarea.placeholder = "sent. the void received it.";
        formStatus.textContent = "Sent. No email app, no drama.";
      } catch (error) {
        formStatus.textContent = "Could not send right now. Check the Web3Forms key or internet.";
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "CONFESS >";
      }
    });
  }

  const communityTile = document.querySelector(".tile-green .mini-bubble");
  if (communityTile) {
    const savedCommunity = localStorage.getItem("snugelf-community-note");
    let userNotes = [];
    try {
      userNotes = JSON.parse(localStorage.getItem("snugelf-community-notes") || "[]");
    } catch (error) {
      localStorage.removeItem("snugelf-community-notes");
    }
    const quotes = userNotes.length ? userNotes : [savedCommunity || "Pray for Gaza"];

    const savedQuoteIndex = Number(localStorage.getItem("snugelf-community-index") || "0");
    let quoteIndex = Number.isFinite(savedQuoteIndex) ? savedQuoteIndex % quotes.length : 0;
    const setQuote = () => {
      communityTile.classList.add("quote-swap");
      window.setTimeout(() => {
        communityTile.textContent = `"${quotes[quoteIndex]}"`;
        communityTile.classList.remove("quote-swap");
      }, 170);
      localStorage.setItem("snugelf-community-index", String(quoteIndex));
      quoteIndex = (quoteIndex + 1) % quotes.length;
    };

    setQuote();
    window.setInterval(setQuote, 30000);
  }

  const musicWidget = document.querySelector("[data-music-widget]");
  if (musicWidget) {
    const title = musicWidget.querySelector("[data-track-title]");
    const artist = musicWidget.querySelector("[data-track-artist]");
    const status = musicWidget.querySelector("[data-track-status]");
    const time = musicWidget.querySelector("[data-track-time]");
    const progress = musicWidget.querySelector("[data-track-progress]");
    const config = window.SNUGELF_CONFIG || {};
    const username = config.lastfmUsername || "snugelf";
    const apiKey = config.lastfmApiKey || localStorage.getItem("snugelf-lastfm-key") || "";
    const fallbackDuration = 252;
    let activeTrack = {
      key: "Kansas::Point of Know Return",
      startedAt: Date.now() - 165000,
      duration: fallbackDuration,
      nowPlaying: false
    };

    const formatTime = (seconds) => {
      const safeSeconds = Math.max(0, Math.floor(seconds));
      const minutes = Math.floor(safeSeconds / 60);
      const remainder = String(safeSeconds % 60).padStart(2, "0");
      return `${minutes}:${remainder}`;
    };

    const saveTrackClock = () => {
      localStorage.setItem("snugelf-track-clock", JSON.stringify(activeTrack));
    };

    const restoreTrackClock = (key, duration) => {
      try {
        const saved = JSON.parse(localStorage.getItem("snugelf-track-clock") || "null");
        if (saved && saved.key === key && Number.isFinite(saved.startedAt)) return saved.startedAt;
      } catch (error) {
        localStorage.removeItem("snugelf-track-clock");
      }
      return Date.now() - 15000;
    };

    const updateProgress = () => {
      const duration = activeTrack.duration || fallbackDuration;
      const elapsed = activeTrack.nowPlaying
        ? Math.min(duration, (Date.now() - activeTrack.startedAt) / 1000)
        : duration;
      const percent = Math.min(100, Math.max(0, (elapsed / duration) * 100));
      progress.style.width = `${percent}%`;
      time.textContent = `${formatTime(elapsed)} / ${formatTime(duration)}`;
      if (activeTrack.nowPlaying && elapsed >= duration - 1) {
        activeTrack.startedAt = Date.now();
        saveTrackClock();
      }
    };

    const setTrack = (track, source) => {
      const name = track.name || "Point of Know Return";
      const artistName = track.artist || "Kansas";
      const rawDuration = Number(track.duration || 0);
      const duration = rawDuration > 1000
        ? Math.round(rawDuration / 1000)
        : rawDuration > 45
          ? Math.round(rawDuration)
          : fallbackDuration;
      const key = `${artistName}::${name}`;

      title.textContent = name;
      artist.textContent = artistName;
      status.textContent = track.nowPlaying ? `playing now via ${source}` : `last scrobbled via ${source}`;

      activeTrack = {
        key,
        startedAt: track.nowPlaying ? restoreTrackClock(key, duration) : Date.now() - duration * 1000,
        duration,
        nowPlaying: Boolean(track.nowPlaying)
      };
      saveTrackClock();
      updateProgress();
    };

    const parseLastfmTrack = (track) => ({
      name: track && track.name,
      artist: track && (typeof track.artist === "string" ? track.artist : track.artist && (track.artist["#text"] || track.artist.name)),
      duration: track && Number(track.duration || 0),
      nowPlaying: Boolean(track && track["@attr"] && track["@attr"].nowplaying)
    });

    async function getOfficialRecentTrack() {
      if (!apiKey) return null;
      const url = new URL("https://ws.audioscrobbler.com/2.0/");
      url.search = new URLSearchParams({
        method: "user.getrecenttracks",
        user: username,
        api_key: apiKey,
        format: "json",
        limit: "1"
      });
      const response = await fetch(url);
      if (!response.ok) throw new Error("Last.fm request failed");
      const data = await response.json();
      const track = data.recenttracks && data.recenttracks.track && data.recenttracks.track[0];
      return track && parseLastfmTrack(track);
    }

    async function getProxyRecentTrack() {
      const response = await fetch(`https://lastfm-last-played.biancarosa.com.br/${encodeURIComponent(username)}/latest-song`);
      if (!response.ok) throw new Error("public Last.fm proxy failed");
      const data = await response.json();
      if (data && data.track) return parseLastfmTrack(data.track);
      return null;
    }

    async function refreshTrack() {
      try {
        const track = await getOfficialRecentTrack();
        if (track) {
          setTrack(track, "Last.fm / YT Music scrobble");
          return;
        }
        const proxyTrack = await getProxyRecentTrack();
        if (proxyTrack) {
          setTrack(proxyTrack, "public Last.fm bridge");
          return;
        }
        throw new Error("no music source configured");
      } catch (error) {
        status.textContent = "live source waiting; demo clock is moving";
        activeTrack.nowPlaying = true;
        updateProgress();
      }
    }

    updateProgress();
    refreshTrack();
    window.setInterval(updateProgress, 1000);
    window.setInterval(refreshTrack, 30000);
  }
})();
