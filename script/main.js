// main.js

let musicStarted = false;

// ✅ Edit these timestamps to sync lyrics with your song (seconds)
const lyrics = [
  { time: 12.0, text: "kaise haathon ko sanbhaale" },
  { time: 16.5, text: "mere haathon mein" },
  { time: 32.0, text: "jab tak neend na aaye" },
  { time: 45.0, text: "..." }
];

function syncLyrics() {
  const music = document.getElementById("bgMusic");
  const display = document.getElementById("lyricsDisplay");
  if (!music || !display) return;

  let lastIndex = -1;

  function update() {
    const t = music.currentTime;

    // find active lyric index
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      const start = lyrics[i].time;
      const end = (i === lyrics.length - 1) ? Number.POSITIVE_INFINITY : lyrics[i + 1].time;
      if (t >= start && t < end) {
        idx = i;
        break;
      }
    }

    if (idx !== -1 && idx !== lastIndex) {
      lastIndex = idx;
      display.style.opacity = 0;
      // fade swap
      setTimeout(() => {
        display.textContent = lyrics[idx].text;
        display.style.opacity = 1;
      }, 150);
    }

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/**
 * Plays background music (called when .idea-1 starts).
 * Works because audio permission is granted by the Start button click.
 */
function startMusic() {
  if (musicStarted) return;
  musicStarted = true;

  const music = document.getElementById("bgMusic");
  if (!music) return;

  music.volume = 0.6;

  const p = music.play();
  if (p && typeof p.catch === "function") {
    p.catch((e) => {
      console.log("Music play blocked:", e);
      musicStarted = false;
    });
  }

  // start syncing once music begins
  syncLyrics();
}

/**
 * Tap to start gate (autoplay restriction safe)
 */
function initStartGate() {
  const btn = document.getElementById("startBtn");
  const overlay = document.getElementById("startOverlay");
  const music = document.getElementById("bgMusic");

  if (!btn || !overlay || !music) {
    console.warn("Missing start gate elements");
    return;
  }

  btn.addEventListener("click", async () => {
    try {
      music.volume = 0.6;
      await music.play();
      music.pause();
      music.currentTime = 0;
    } catch (e) {
      console.log("Audio permission step failed:", e);
    }

    overlay.style.display = "none";
    animationTimeline();
  });
}

// Helper: wrap each character in a span, preserving spaces
function wrapCharsPreserveSpaces(el) {
  if (!el) return;

  // store original so replay doesn't break text
  if (!el.dataset.originalText) {
    el.dataset.originalText = el.textContent;
  }

  const chars = el.dataset.originalText.split("");
  el.innerHTML = chars
    .map((ch) => (ch === " " ? '<span class="space">&nbsp;</span>' : `<span>${ch}</span>`))
    .join("");
}

// Animation Timeline
function animationTimeline() {
  // Split chars that need to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  wrapCharsPreserveSpaces(textBoxChars);
  wrapCharsPreserveSpaces(hbd);

  // ✅ ensure spans start hidden (otherwise sometimes they never appear)
  TweenMax.set(".hbd-chatbox span", { visibility: "hidden", opacity: 1 });
  TweenMax.set(".wish-hbd span", { visibility: "hidden", opacity: 1 });

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg",
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg",
  };

  const tl = new TimelineMax();

  tl.to(".container", 0.1, { visibility: "visible" })
    .from(".one", 0.7, { opacity: 0, y: 10 })
    .from(".two", 0.4, { opacity: 0, y: 10 })
    .to(".one", 0.7, { opacity: 0, y: 10 }, "+=2.5")
    .to(".two", 0.7, { opacity: 0, y: 10 }, "-=1")
    .from(".three", 0.7, { opacity: 0, y: 10 })
    .to(".three", 0.7, { opacity: 0, y: 10 }, "+=2")
    .from(".four", 0.7, { scale: 0.2, opacity: 0 })
    .from(".fake-btn", 0.3, { scale: 0.2, opacity: 0 })

    // ✅ Chatbox letters appear
    .staggerTo(".hbd-chatbox span", 0.035, { visibility: "visible" }, 0.01)

    .to(".fake-btn", 0.1, { backgroundColor: "rgb(127, 206, 248)" })
    .to(".four", 0.5, { scale: 0.2, opacity: 0, y: -150 }, "+=0.7")

    // ✅ start music when idea-1 starts
    .from(".idea-1", 0.7, { ...ideaTextTrans, onStart: startMusic })
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.12,
      x: 10,
      backgroundColor: "rgba(255,255,255,0.15)",
      color: "#fff",
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")

    .from(".idea-5", 0.7, {
      rotationX: 15,
      rotationZ: -10,
      skewY: "-5deg",
      y: 50,
      z: 10,
      opacity: 0,
    }, "+=0.5")
    .to(".idea-5 span", 0.7, { rotation: 90, x: 8 }, "+=0.4")
    .to(".idea-5", 0.7, { scale: 0.2, opacity: 0 }, "+=2")

    // idea-6 lines
    .staggerFrom(".idea-6 span", 0.8, {
      scale: 1.4,
      opacity: 0,
      y: 20,
      ease: Power1.easeOut,
    }, 0.25)
    .staggerTo(".idea-6 span", 0.8, {
      opacity: 0,
      y: -20,
      ease: Power1.easeIn,
    }, 0.25, "+=1.2")

    // balloons
    .staggerFromTo(".baloons img", 2.5, { opacity: 0.9, y: 1400 }, { opacity: 1, y: -1000 }, 0.2)

    // image
    .from(".girl-dp", 0.6, { scale: 2.2, opacity: 0, y: 10 }, "-=2.2")

    // ✅ Wish headline letters show + animate
    .staggerTo(".wish-hbd span", 0.001, { visibility: "visible" }, 0)
    .staggerFrom(".wish-hbd span", 0.7, {
      opacity: 0,
      y: -30,
      rotation: 30,
      ease: Power2.easeOut,
    }, 0.04)
    .staggerFromTo(".wish-hbd span", 0.5, { opacity: 0.85 }, { opacity: 1 }, 0.03, "party")
    .from(".wish h5", 0.6, { opacity: 0, y: 10 }, "party")

    // ✅ Softer “circles” (bigger scale + more movement)
    .staggerFromTo(".eight svg", 2.6,
      { visibility: "visible", opacity: 0, scale: 0.3, y: 20 },
      { opacity: 0.55, scale: 12, y: -120, yoyo: true, repeat: 1, ease: Power1.easeInOut },
      0.2
    )

    .staggerFrom(".nine p", 1.0, ideaTextTrans, 1.1)
    .to(".last-smile", 0.5, { rotation: 90 }, "+=1");

  // Replay
  const replyBtn = document.getElementById("replay");
  if (replyBtn) {
    replyBtn.onclick = () => {
      const music = document.getElementById("bgMusic");
      if (music) {
        music.pause();
        music.currentTime = 0;
      }
      musicStarted = false;
      tl.restart();
    };
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initStartGate();
});
