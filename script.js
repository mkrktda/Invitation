(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const gate = $("#invitationGate");
  const openButton = $("#openInvitation");
  const weddingSong = $("#weddingSong");
  const songToggle = $("#songToggle");
  const toast = $("#toast");
  const SONG_VOLUME = 0.42;
  let toastTimer = 0;
  let petalsTimer = 0;
  let songFadeFrame = 0;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function setSongUI(isPlaying) {
    if (!songToggle) return;
    songToggle.classList.toggle("is-playing", isPlaying);
    songToggle.setAttribute("aria-pressed", String(isPlaying));
    songToggle.setAttribute("aria-label", isPlaying ? "Pause Kalyana Kacheri" : "Play Kalyana Kacheri");
    songToggle.setAttribute("title", isPlaying ? "Pause Kalyana Kacheri" : "Play Kalyana Kacheri");
  }

  function fadeSongTo(targetVolume, duration = 1400) {
    if (!weddingSong) return;
    window.cancelAnimationFrame(songFadeFrame);
    const initialVolume = weddingSong.volume;
    const startedAt = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      weddingSong.volume = initialVolume + (targetVolume - initialVolume) * eased;
      if (progress < 1) songFadeFrame = window.requestAnimationFrame(step);
    };

    songFadeFrame = window.requestAnimationFrame(step);
  }

  async function playWeddingSong({ restart = false, quiet = false } = {}) {
    if (!weddingSong) return;
    try {
      if (restart || weddingSong.ended) weddingSong.currentTime = 0;
      weddingSong.volume = 0.03;
      await weddingSong.play();
      setSongUI(true);
      fadeSongTo(SONG_VOLUME, 1800);
    } catch (error) {
      setSongUI(false);
      if (!quiet) showToast("Tap the music button to play the wedding song.");
      console.info("Audio playback was blocked by the browser:", error);
    }
  }

  function pauseWeddingSong() {
    if (!weddingSong) return;
    window.cancelAnimationFrame(songFadeFrame);
    weddingSong.pause();
    setSongUI(false);
  }

  function toggleWeddingSong() {
    if (!weddingSong) return;
    if (weddingSong.paused || weddingSong.ended) {
      playWeddingSong({ restart: weddingSong.ended });
    } else {
      pauseWeddingSong();
    }
  }

  songToggle?.addEventListener("click", toggleWeddingSong);
  weddingSong?.addEventListener("play", () => setSongUI(true));
  weddingSong?.addEventListener("pause", () => setSongUI(false));
  weddingSong?.addEventListener("ended", () => {
    weddingSong.currentTime = 0;
    playWeddingSong({ restart: true, quiet: true });
  });
  weddingSong?.addEventListener("error", () => {
    setSongUI(false);
    showToast("The wedding song could not be loaded on this browser.");
  });

  function releaseGate() {
    if (!gate || gate.classList.contains("is-open")) return;
    gate.classList.add("is-open");
    playWeddingSong({ restart: true, quiet: true });
    startPetals();

    // Keep the page still while the heavy temple doors complete their swing.
    window.setTimeout(
      () => document.body.classList.remove("is-locked"),
      reducedMotion ? 40 : 2240
    );
    window.setTimeout(() => gate.remove(), reducedMotion ? 80 : 2880);
  }

  openButton?.addEventListener("click", releaseGate);
  openButton?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") releaseGate();
  });

  // A useful preview/development shortcut: append ?open=1 to skip the entrance.
  const params = new URLSearchParams(window.location.search);
  if (params.get("open") === "1") {
    gate?.remove();
    document.body.classList.remove("is-locked");
    window.setTimeout(startPetals, 500);
  }

  // Countdown to the start of Muhurtham: 10:25 AM IST on 7 September 2026.
  const weddingTime = new Date("2026-09-07T10:25:00+05:30").getTime();
  const countdownNodes = {
    days: $("#days"),
    hours: $("#hours"),
    minutes: $("#minutes"),
    seconds: $("#seconds")
  };

  function updateCountdown() {
    const distance = weddingTime - Date.now();
    if (distance <= 0) {
      const countdown = $("#countdown");
      if (countdown) countdown.innerHTML = "<div><strong>Today</strong><span>With love & blessings</span></div>";
      return;
    }
    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (countdownNodes.days) countdownNodes.days.textContent = String(days).padStart(2, "0");
    if (countdownNodes.hours) countdownNodes.hours.textContent = String(hours).padStart(2, "0");
    if (countdownNodes.minutes) countdownNodes.minutes.textContent = String(minutes).padStart(2, "0");
    if (countdownNodes.seconds) countdownNodes.seconds.textContent = String(seconds).padStart(2, "0");
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Scroll reveal.
  const revealItems = $$('[data-reveal]');
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
      if (item.hasAttribute("data-scroll-unroll")) item.classList.add("is-unrolled");
    });
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (entry.target.hasAttribute("data-scroll-unroll")) {
            window.setTimeout(() => entry.target.classList.add("is-unrolled"), 120);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
      observer.observe(item);
    });
  }

  // Header and mobile menu.
  const header = $("#siteHeader");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  function syncHeader() {
    header?.classList.toggle("is-scrolled", window.scrollY > 28);
  }
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  function closeMenu() {
    navLinks?.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open menu");
  }

  navToggle?.addEventListener("click", () => {
    const opening = !navLinks?.classList.contains("is-open");
    navLinks?.classList.toggle("is-open", opening);
    navToggle.classList.toggle("is-open", opening);
    navToggle.setAttribute("aria-expanded", String(opening));
    navToggle.setAttribute("aria-label", opening ? "Close menu" : "Open menu");
  });
  $$("a", navLinks || document.createElement("div")).forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!navLinks?.classList.contains("is-open")) return;
    if (!navLinks.contains(event.target) && !navToggle?.contains(event.target)) closeMenu();
  });

  // Gentle falling jasmine/rose petals. Limited count keeps mobile performance smooth.
  function addPetal() {
    const layer = $("#petals");
    if (!layer || document.hidden || reducedMotion) return;
    const petal = document.createElement("i");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${Math.round((Math.random() - 0.5) * 220)}px`);
    petal.style.setProperty("--spin", `${Math.round(360 + Math.random() * 720)}deg`);
    petal.style.animationDuration = `${8 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 1.4}s`;
    petal.style.transform = `scale(${0.55 + Math.random() * 0.8}) rotate(${Math.random() * 180}deg)`;
    layer.appendChild(petal);
    window.setTimeout(() => petal.remove(), 18000);
  }

  function startPetals() {
    if (petalsTimer || reducedMotion) return;
    for (let i = 0; i < 8; i += 1) window.setTimeout(addPetal, i * 190);
    petalsTimer = window.setInterval(addPetal, 1050);
  }

  // Share helpers.
  const inviteTitle = "Manikantan & Saranya — Wedding Invitation";
  const inviteText = "With the blessings of our families, you are lovingly invited to the wedding of Dr. Manikantan R. Nair and Dr. Saranya R. Nair on Monday, 7 September 2026.";

  async function shareInvitation({ whatsappOnly = false } = {}) {
    const url = window.location.protocol === "file:" ? "" : window.location.href.split("#")[0];
    const combined = `${inviteText}${url ? `\n\n${url}` : ""}`;

    if (!whatsappOnly && navigator.share) {
      try {
        await navigator.share({ title: inviteTitle, text: inviteText, url: url || undefined });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    if (whatsappOnly || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)) {
      window.open(`https://wa.me/?text=${encodeURIComponent(combined)}`, "_blank", "noopener");
      return;
    }

    try {
      await navigator.clipboard.writeText(combined);
      showToast("Invitation text and link copied.");
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(combined)}`, "_blank", "noopener");
    }
  }

  [$("#shareInvite"), $("#quickShare")].filter(Boolean).forEach((button) => {
    button.addEventListener("click", () => shareInvitation());
  });
  [$("#footerShare")].filter(Boolean).forEach((button) => {
    button.addEventListener("click", () => shareInvitation({ whatsappOnly: true }));
  });

  // RSVP is intentionally serverless: the response is composed into a WhatsApp message.
  const rsvpForm = $("#rsvpForm");
  const formNote = $("#formNote");
  rsvpForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!rsvpForm.reportValidity()) return;

    const data = new FormData(rsvpForm);
    const name = String(data.get("guestName") || "").trim();
    const attendance = String(data.get("attendance") || "");
    const guestCount = String(data.get("guestCount") || "1");
    const celebration = String(data.get("eventChoice") || "");
    const blessing = String(data.get("guestMessage") || "").trim();

    const message = [
      "Namaskaram! RSVP for Manikantan & Saranya's wedding",
      "",
      `Name: ${name}`,
      `Response: ${attendance}`,
      `Guests: ${guestCount}`,
      `Celebration: ${celebration}`,
      blessing ? `Blessing: ${blessing}` : "",
      "",
      "Wedding date: Monday, 7 September 2026"
    ].filter(Boolean).join("\n");

    if (formNote) formNote.textContent = "Opening WhatsApp with your RSVP…";
    window.open(`https://wa.me/917025671618?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    window.setTimeout(() => {
      if (formNote) formNote.textContent = "Please tap Send in WhatsApp to complete your RSVP.";
    }, 700);
  });

})();
