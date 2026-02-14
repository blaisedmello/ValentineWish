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
      await music.play();  // permission
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

    // Cache original so replay doesn't ruin it
    if (!el.dataset.originalText) el.dataset.originalText = el.textContent;

    const chars = el.dataset.originalText.split("");
    el.innerHTML = chars
      .map((ch) => (ch === " " ? `<span class="space">&nbsp;</span>` : `<span>${ch}</span>`))
      .join("");
  }

  const textBox = document.querySelector(".hbd-chatbox");
  const wishH3 = document.querySelector(".wish-hbd");

  wrapCharsPreserveSpaces(textBox);
  wrapCharsPreserveSpaces(wishH3);

  // Ensure spans start hidden so the "typing" shows
  TweenMax.set(".hbd-chatbox span", { visibility: "hidden", opacity: 1 });
  TweenMax.set(".wish-hbd span", { visibility: "hidden", opacity: 1 });

  // Photos + wish lines start hidden (scenes will show them)
  TweenMax.set([".photo-1", ".photo-2", ".photo-3"], { opacity: 0, scale: 1.03 });
  TweenMax.set([".wish-hbd", "#wishText", "#finalValentine"], { opacity: 0, y: 10 });

  const ideaTextTrans = { opacity: 0, y: -20, rotationX: 5, skewX: "15deg" };
  const ideaTextTransLeave = { opacity: 0, y: 20, rotationY: 5, skewX: "-15deg" };

  const tl = new TimelineMax();

  // ---- Intro
  tl.to(".container", 0.1, { visibility: "visible" })
    .from(".one", 0.7, { opacity: 0, y: 10 })
    .from(".two", 0.4, { opacity: 0, y: 10 })
    .to(".one", 0.7, { opacity: 0, y: 10 }, "+=2.5")
    .to(".two", 0.7, { opacity: 0, y: 10 }, "-=1")
    .from(".three", 0.7, { opacity: 0, y: 10 })
    .to(".three", 0.7, { opacity: 0, y: 10 }, "+=2");

  // ==========================================================
  // SCENE A: Photo1 + Chatbox ONLY
  // ==========================================================
  tl.addLabel("sceneA")
    .to(".photo-1", 0.9, { opacity: 1, scale: 1, ease: Power2.easeOut }, "sceneA")
    .to(".photo-2", 0.01, { opacity: 0 }, "sceneA")
    .to(".photo-3", 0.01, { opacity: 0 }, "sceneA")

    .from(".four", 0.7, { scale: 0.2, opacity: 0 }, "sceneA")
    .from(".fake-btn", 0.3, { scale: 0.2, opacity: 0 })

    // Chatbox typing
    .staggerTo(".hbd-chatbox span", 0.06, { visibility: "visible" }, 0.01)
    .to(".fake-btn", 0.1, { backgroundColor: "rgb(127, 206, 248)" })

    // End Scene A: hide chatbox + photo1 together
    .to(".four", 0.7, { opacity: 0, y: -150, scale: 0.9, ease: Power2.easeInOut }, "+=0.8")
    .to(".photo-1", 0.7, { opacity: 0, scale: 1.05, ease: Power2.easeInOut }, "-=0.7");

  // ==========================================================
  // SCENE B: Photo2 + Ideas ONLY
  // ==========================================================
  tl.addLabel("sceneB")
    .to(".photo-2", 0.9, { opacity: 1, scale: 1, ease: Power2.easeOut }, "sceneB")
    .to(".photo-1", 0.01, { opacity: 0 }, "sceneB")
    .to(".photo-3", 0.01, { opacity: 0 }, "sceneB")

    .from(".idea-1", 0.7, { ...ideaTextTrans, onStart: startMusic }, "sceneB")
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.2")

    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.0")

    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.08,
      x: 8,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff",
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.1")

    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.0")

    .from(".idea-5", 0.7, {
      rotationX: 15,
      rotationZ: -10,
      skewY: "-5deg",
      y: 50,
      z: 10,
      opacity: 0,
    }, "+=0.3")
    .to(".idea-5 span", 0.6, { rotation: 90, x: 8 }, "+=0.25")
    .to(".idea-5", 0.7, { scale: 0.2, opacity: 0 }, "+=1.2")

    .staggerFrom(".idea-6 span", 0.8, {
      scale: 1.8,
      opacity: 0,
      rotation: 10,
      ease: Expo.easeOut,
    }, 0.2)
    .staggerTo(".idea-6 span", 0.8, {
      scale: 1.8,
      opacity: 0,
      rotation: -10,
      ease: Expo.easeOut,
    }, 0.2, "+=1.0")

    .staggerFromTo(".baloons img", 2.5, { opacity: 0.9, y: 1400 }, { opacity: 1, y: -1000 }, 0.2)

    // End Scene B: hide photo2 (so next scene is clean)
    .to(".photo-2", 0.8, { opacity: 0, scale: 1.05, ease: Power2.easeInOut }, "+=0.1");

  // ==========================================================
  // SCENE C: Photo3 + Wish (h3 then h5) then Final Valentine ONLY
  // ==========================================================
  tl.addLabel("sceneC")
    .to(".photo-3", 1.0, { opacity: 1, scale: 1, ease: Power2.easeOut }, "sceneC")
    .to(".photo-1", 0.01, { opacity: 0 }, "sceneC")
    .to(".photo-2", 0.01, { opacity: 0 }, "sceneC")

    // Make sure the H3 letter spans can animate (they are inside h3)
    .staggerTo(".wish-hbd span", 0.001, { visibility: "visible" }, 0, "sceneC+=0.2")
    .to(".wish-hbd", 0.01, { opacity: 1, y: 0 }, "sceneC+=0.2") // reveal container
    .staggerFrom(".wish-hbd span", 0.6, {
      opacity: 0,
      y: -30,
      rotation: 90,
      ease: Elastic.easeOut.config(1, 0.55),
    }, 0.05, "sceneC+=0.25")

    // ✅ h5 should come AFTER h3
    .to("#wishText", 0.9, { opacity: 1, y: 0, ease: Power2.easeOut }, "+=0.5")

    // hold
    .to({}, 1.1, {})

    // ✅ fade out h3 + h5 before final-valentine
    .to([".wish-hbd", "#wishText"], 0.9, { opacity: 0, y: -20, ease: Power2.easeInOut })

    // show final valentine line
    .to("#finalValentine", 1.1, { opacity: 1, y: 0, ease: Power2.easeOut }, "+=0.25");

  // ==========================================================
  // Soft circles: bigger scale + more movement
  // ==========================================================
  tl.staggerFromTo(
    ".eight svg",
    2.6,
    { visibility: "visible", opacity: 0, scale: 0.35, y: 40 },
    { opacity: 0.6, scale: 12, y: -180, yoyo: true, repeat: 1, ease: Power2.easeInOut },
    0.22,
    "+=0.2"
  );

  // Outro
  tl.staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(".last-smile", 0.5, { rotation: 90 }, "+=1");

  // Replay
  const replay = document.getElementById("replay");
  if (replay) {
    replay.addEventListener("click", () => {
      const music = document.getElementById("bgMusic");
      if (music) {
        music.pause();
        music.currentTime = 0;
      }
      musicStarted = false;

      // Reset dynamic text spans visibility
      TweenMax.set(".hbd-chatbox span", { visibility: "hidden", opacity: 1 });
      TweenMax.set(".wish-hbd span", { visibility: "hidden", opacity: 1 });

      // Reset photos + wish texts
      TweenMax.set([".photo-1", ".photo-2", ".photo-3"], { opacity: 0, scale: 1.03 });
      TweenMax.set([".wish-hbd", "#wishText", "#finalValentine"], { opacity: 0, y: 10 });

      tl.restart();
    });
  }
};
// hi
window.addEventListener("DOMContentLoaded", () => {
  initStartGate();
});
