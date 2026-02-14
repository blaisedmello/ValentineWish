// script/main.js

let musicStarted = false;

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
}

function initStartGate() {
  const btn = document.getElementById("startBtn");
  const overlay = document.getElementById("startOverlay");
  const music = document.getElementById("bgMusic");

  if (!btn || !overlay || !music) {
    console.warn("Start gate missing: ensure #startBtn, #startOverlay, and #bgMusic exist in index.html");
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

// Animation Timeline
const animationTimeline = () => {
  // Helper: wrap each character in a span, preserving spaces
  function wrapCharsPreserveSpaces(el) {
    if (!el) return;

    if (!el.dataset.originalText) {
      el.dataset.originalText = el.textContent;
    }

    const chars = el.dataset.originalText.split("");
    el.innerHTML = chars
      .map((ch) => (ch === " " ? `<span class="space">&nbsp;</span>` : `<span>${ch}</span>`))
      .join("");
  }

  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  wrapCharsPreserveSpaces(textBoxChars);
  wrapCharsPreserveSpaces(hbd);

  // Ensure spans start hidden so the "typing" shows
  TweenMax.set(".hbd-chatbox span", { visibility: "hidden", opacity: 1 });
  TweenMax.set(".wish-hbd span", { visibility: "hidden", opacity: 1 });

  // Photos
  const finalValentine = document.getElementById("finalValentine");

  const ideaTextTrans = { opacity: 0, y: -20, rotationX: 5, skewX: "15deg" };
  const ideaTextTransLeave = { opacity: 0, y: 20, rotationY: 5, skewX: "-15deg" };

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

    // ✅ chatbox "typing" reveal
    .staggerTo(".hbd-chatbox span", 0.06, { visibility: "visible" }, 0.01)

    .to(".fake-btn", 0.1, { backgroundColor: "rgb(127, 206, 248)" })
    .to(".four", 0.5, { scale: 0.2, opacity: 0, y: -150 }, "+=0.7")

    .from(".idea-1", 0.7, { ...ideaTextTrans, onStart: startMusic })
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")

    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")

    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, { scale: 1.08, x: 8, backgroundColor: "rgb(21, 161, 237)", color: "#fff" })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.2")

    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.2")

    .from(".idea-5", 0.7, { rotationX: 15, rotationZ: -10, skewY: "-5deg", y: 50, z: 10, opacity: 0 }, "+=0.5")
    .to(".idea-5 span", 0.7, { rotation: 90, x: 8 }, "+=0.4")
    .to(".idea-5", 0.7, { scale: 0.2, opacity: 0 }, "+=1.6")

    .staggerFrom(".idea-6 span", 0.8, { scale: 1.8, opacity: 0, rotation: 10, ease: Expo.easeOut }, 0.2)
    .staggerTo(".idea-6 span", 0.8, { scale: 1.8, opacity: 0, rotation: -10, ease: Expo.easeOut }, 0.2, "+=1")

    .staggerFromTo(".baloons img", 2.5, { opacity: 0.9, y: 1400 }, { opacity: 1, y: -1000 }, 0.2)

    // ✅ Photo crossfade sequence: photo1 -> photo2 -> vector
    .addLabel("photosIn", "-=2")

    .to(".photo-1", 1.0, { opacity: 1, scale: 1, ease: Power2.easeOut }, "photosIn")
    .to(".photo-1", 1.0, { opacity: 0, scale: 1.03, ease: Power2.easeInOut }, "+=1.2")
    .to(".photo-2", 1.0, { opacity: 1, scale: 1, ease: Power2.easeOut }, "-=1.0")

    .to(".photo-2", 1.0, { opacity: 0, scale: 1.03, ease: Power2.easeInOut }, "+=1.2")
    .to(".photo-final", 1.0, { opacity: 1, scale: 1, ease: Power2.easeOut }, "-=1.0")

    // ✅ wish text reveal (fixes "doesn't show up")
    .staggerTo(".wish-hbd span", 0.001, { visibility: "visible" }, 0)
    .staggerFrom(".wish-hbd span", 0.7, {
      opacity: 0,
      y: -40,
      rotation: 120,
      skewX: "20deg",
      ease: Elastic.easeOut.config(1, 0.5),
    }, 0.06)

    // show final valentine line ONLY at the end
    .to("#finalValentine", 0.9, { opacity: 1, y: 0, ease: Power2.easeOut }, "+=0.2")

    // ✅ Softer circle animation (more movement + bigger scale)
    .staggerFromTo(".eight svg", 2.4,
      { visibility: "visible", opacity: 0, scale: 0.4, y: 30 },
      { opacity: 0.55, scale: 10, y: -120, yoyo: true, repeat: 1, ease: Power2.easeInOut },
      0.22
    )

    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(".last-smile", 0.5, { rotation: 90 }, "+=1");

  // Replay
  const replyBtn = document.getElementById("replay");
  if (replyBtn) {
    replyBtn.addEventListener("click", () => {
      const music = document.getElementById("bgMusic");
      if (music) {
        music.pause();
        music.currentTime = 0;
      }
      musicStarted = false;
      tl.restart();
    });
  }
};

window.addEventListener("DOMContentLoaded", () => {
  initStartGate();
});
