

// const b = document.body
// const h = document.querySelector("#h")
// const unit = 1.75
// const audioElement = document.querySelector("#a")
// const btnElement = document.querySelector(".button5")
// const tapeElement = document.querySelector(".c")
// const circleElement = document.querySelectorAll(".circle")[1]
// const waveElement = document.querySelector(".waves")
// // =================================
// const mouseDown = () => b.addEventListener('mousemove', moveFunc)
// const mouseUp = () => b.removeEventListener('mousemove', moveFunc)
// const moveFunc = (e) => {
//     let x = e.pageX / window.innerWidth - 0.5
//     let y = e.pageY / window.innerHeight - 0.5

//     h.style.transform = `
//         perspective(${400 * unit}vmin)
//         rotateX(${ y * 20 + 66}deg)
//         rotateZ(${ -x * 420 + 40}deg)
//         translateZ(${-16 * unit}vmin)
//     `
// }
// const playRadio = () => {
//     btnElement.removeEventListener("click", playRadio)
//     audioElement.currentTime = 0
//     audioElement.play()
//     setTimeout(() => waveElement.classList.add('is-wave-playing'), 1100);
//     toggleStyles()

// }
// const stopRadio = () => {
//     btnElement.addEventListener("click", playRadio)
//     audioElement.pause()
//     waveElement.classList.remove('is-wave-playing')
//     toggleStyles()
// }
// const toggleStyles = () => {
//     btnElement.classList.toggle('is-button-pressed')
//     tapeElement.classList.toggle('is-c-close')
//     circleElement.classList.toggle('cr')

// }

// h.addEventListener('mousedown', mouseDown)
// b.addEventListener('mouseup', mouseUp)
// btnElement.addEventListener("click", playRadio)
// audioElement.addEventListener('ended', stopRadio)


/*
  Multi-track Walkman
  - Gold button (.button5) = PLAY / START
  - Eject button (.button2) = STOP + load next track
*/



/*
  Multi-track Walkman - Clean State Machine

  - Gold button  (.button5) = PLAY (only when STOPPED)
  - Eject button (.button2) = STOP + load next track
  - Button7      (.button7) = NEXT track
  - Button6      (.button6) = PREVIOUS track

  States: STOPPED (0) or PLAYING (1)
*/

// ============================
// AUDIO CONTEXT FOR CLICK SOUNDS
// ============================
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Small noise burst for mechanical "clack"
function createNoiseBurst(ctx, duration = 0.07) {
  const sampleRate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    // white noise, a bit tamed
    data[i] = (Math.random() * 2 - 1) * 0.6;
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  return src;
}


function playClickSound(type) {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  if (type === "play") {
    // Mechanical button press - two-tone click
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const noise = createNoiseBurst(ctx, 0.06);
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

   filter.type = "highpass";
    filter.frequency.setValueAtTime(900, now);
    filter.Q.value = 4;

    // First click (press down)
    osc1.type = "square";
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(200, now + 0.03);

    // Second click (mechanism engage)
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(400, now + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(100, now + 0.06);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.005);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.02);
    osc1.stop(now + 0.15);
    osc2.stop(now + 0.15);

  } else if (type === "eject") {
    // Mechanical eject - chunky spring release
    const osc = ctx.createOscillator();
    const noise = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "bandpass";
    filter.frequency.value = 400;
    filter.Q.value = 2;

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.05);
    osc.frequency.linearRampToValueAtTime(200, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);

    noise.type = "triangle";
    noise.frequency.setValueAtTime(60, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.01);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(filter);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    noise.start(now);
    osc.stop(now + 0.25);
    noise.stop(now + 0.25);

  } else if (type === "nav") {
    // Lighter nav tick for prev/next
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }
}

// ============================
// DOM ELEMENTS
// ============================
const b = document.body;
const h = document.querySelector("#h");
const unit = 1.75;

const audioElement = document.querySelector("#a");
const btnPlay  = document.querySelector(".button5");
const btnEject = document.querySelector(".button2");
const btnPrev  = document.querySelector(".button6");
const btnNext  = document.querySelector(".button7");

const tapeElement   = document.querySelector(".c");
const circleElement = document.querySelectorAll(".circle")[1];
const waveElement   = document.querySelector(".waves");

// ============================
// PLAYLIST
// ============================
// put your tracks here
const tracks = [
  "https://rawcdn.githack.com/ricardoolivaalonso/Codepen/a7164cf6992d98ab75ca79465024dcd182dd1bdf/Walkman/audio.mp3",
  "./assets/saiyaara.mp3",
  "./assets/mere_mehboob_qayamat.mp3",
  "./assets/mere_samne_wali_khidki.mp3",

];

// shuffle once at startup so order is random
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
shuffleArray(tracks);

// ============================
// STATE MACHINE - ONLY TWO STATES
// ============================
const STATE = { STOPPED: 0, PLAYING: 1 };
let currentState = STATE.STOPPED;
let currentTrackIndex = 0;

// ============================
// TRACK LOADING
// ============================
function loadTrack(index) {
  if (!tracks.length) return;

  const len = tracks.length;
  currentTrackIndex = ((index % len) + len) % len; // wrap around safely

  audioElement.src = tracks[currentTrackIndex];
  audioElement.load();
}

// ============================
// VISUAL STATE
// ============================
function enterPlayingVisual() {
  btnPlay.classList.add("is-button-pressed");
  tapeElement.classList.add("is-c-close");
  circleElement.classList.add("cr");
  setTimeout(() => waveElement.classList.add("is-wave-playing"), 1100);
  
}

function enterStoppedVisual() {
  btnPlay.classList.remove("is-button-pressed");
  tapeElement.classList.remove("is-c-close");
  circleElement.classList.remove("cr");
  waveElement.classList.remove("is-wave-playing");
}

// brief press animation for prev / next
function flashNavButton(btn) {
  btn.classList.add("is-nav-pressed");
  setTimeout(() => btn.classList.remove("is-nav-pressed"), 250);
}

// ============================
// STATE TRANSITIONS
// ============================
function transitionTo(newState) {
  if (currentState === newState) return;

  currentState = newState;

  if (newState === STATE.PLAYING) {
    audioElement.currentTime = 0;
    audioElement.play();
    enterPlayingVisual();
  } else {
    audioElement.pause();
    enterStoppedVisual();
  }
}

// ============================
// BUTTON HANDLERS
// ============================
function handlePlay() {
  if (currentState === STATE.STOPPED) {
    playClickSound("play");
    transitionTo(STATE.PLAYING);
  }
  // If already playing, do nothing (like a real Walkman without separate STOP).
}

function handleEject() {
  playClickSound("eject");
  // Always stop first
  transitionTo(STATE.STOPPED);
  // Load next track, but don't auto-play
  loadTrack(currentTrackIndex + 1);
}

function handleTrackEnd() {
  // Song finished naturally
  transitionTo(STATE.STOPPED);
  // optional: auto-next
  // loadTrack(currentTrackIndex + 1);
  // transitionTo(STATE.PLAYING);
}

function goToTrack(offset) {
  if (!tracks.length) return;

  loadTrack(currentTrackIndex + offset);

  // If we're already playing, continue playing new track
  if (currentState === STATE.PLAYING) {
    audioElement.currentTime = 0;
    audioElement.play();
  }
}

function handleNext() {
  playClickSound("nav");
  flashNavButton(btnNext);
  goToTrack(1);
}

function handlePrev() {
  playClickSound("nav");
  flashNavButton(btnPrev);
  goToTrack(-1);
}

// ============================
// CAMERA / MOUSE MOVEMENT
// ============================
const mouseDown = () => b.addEventListener("mousemove", moveFunc);
const mouseUp   = () => b.removeEventListener("mousemove", moveFunc);

const moveFunc = (e) => {
  const x = e.pageX / window.innerWidth - 0.5;
  const y = e.pageY / window.innerHeight - 0.5;
  h.style.transform = `
    perspective(${400 * unit}vmin)
    rotateX(${y * 20 + 66}deg)
    rotateZ(${-x * 420 + 40}deg)
    translateZ(${-16 * unit}vmin)
  `;
};

// ============================
// EVENT LISTENERS
// ============================
h.addEventListener("mousedown", mouseDown);
b.addEventListener("mouseup", mouseUp);

btnPlay.addEventListener("click",  handlePlay);
btnEject.addEventListener("click", handleEject);
btnNext.addEventListener("click",  handleNext);
btnPrev.addEventListener("click",  handlePrev);

audioElement.addEventListener("ended", handleTrackEnd);

// ============================
// INITIALIZE
// ============================
loadTrack(0);
enterStoppedVisual(); // ensure visuals are clean on load





// // ============================
// // CREATE CINEMATIC OVERLAY
// // ============================
// function createCinematicElements() {
//   // Vignette overlay
//   const vignette = document.createElement("div");
//   vignette.className = "vignette-overlay";
//   document.body.appendChild(vignette);

//   // Glow container for walkman
//   const glowLayer = document.createElement("div");
//   glowLayer.className = "walkman-glow";
//   h.appendChild(glowLayer);

//   // LED indicator light
//   const led = document.createElement("div");
//   led.className = "led-light";
//   h.appendChild(led);
// }


// // Inject CSS for cinematic effects
// function injectCinematicCSS() {
//   const style = document.createElement("style");
//   style.textContent = `
//     /* ===== CINEMATIC TRANSITIONS ===== */
    
//     body {
//       transition: background-color 1.5s ease, filter 1.5s ease;
//     }
    
//     body.is-playing {
//       background-color: #1a2a3a;
//     }
    
//     /* Vignette overlay */
//     .vignette-overlay {
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       pointer-events: none;
//       opacity: 0;
//       background: radial-gradient(
//         ellipse at center,
//         transparent 20%,
//         rgba(0, 0, 0, 0.3) 60%,
//         rgba(0, 0, 0, 0.7) 100%
//       );
//       transition: opacity 1.5s ease;
//       z-index: 1000;
//     }
    
//     body.is-playing .vignette-overlay {
//       opacity: 1;
//     }
    
//     /* Shadow dims when playing */
//     body.is-playing .shadows {
//       filter: brightness(0.4);
//       transition: filter 1.5s ease;
//     }
    
//     .shadows {
//       transition: filter 1.5s ease;
//     }
    
//     /* ===== WALKMAN GLOW EFFECTS ===== */
    
//     .main {
//       transition: filter 1.5s ease;
//     }
    
//     body.is-playing .main {
//       filter: drop-shadow(0 0 15px rgba(100, 180, 255, 0.4))
//               drop-shadow(0 0 30px rgba(100, 180, 255, 0.2))
//               drop-shadow(0 0 60px rgba(100, 180, 255, 0.1));
//     }
    
//     /* Cassette window glow */
//     .a__front::after {
//       transition: box-shadow 1.5s ease, background-color 1.5s ease;
//     }
    
//     body.is-playing .a__front::after {
//       background-color: #1a3550;
//       box-shadow: 
//         inset 0 0 20px rgba(100, 200, 255, 0.3),
//         0 0 10px rgba(100, 200, 255, 0.2);
//     }
    
//     /* LED indicator light */
//     .led-light {
//       position: absolute;
//       width: 0.8vmin;
//       height: 0.8vmin;
//       border-radius: 50%;
//       background: #333;
//       top: 2vmin;
//       right: 3vmin;
//       transform: translateZ(56vmin);
//       box-shadow: none;
//       transition: all 0.3s ease;
//     }
    
//     body.is-playing .led-light {
//       background: #00ff88;
//       box-shadow: 
//         0 0 5px #00ff88,
//         0 0 10px #00ff88,
//         0 0 20px #00ff88,
//         0 0 40px #00ff88;
//       animation: led-pulse 1s ease-in-out infinite;
//     }
    
//     @keyframes led-pulse {
//       0%, 100% { 
//         opacity: 1;
//         box-shadow: 
//           0 0 5px #00ff88,
//           0 0 10px #00ff88,
//           0 0 20px #00ff88;
//       }
//       50% { 
//         opacity: 0.7;
//         box-shadow: 
//           0 0 8px #00ff88,
//           0 0 15px #00ff88,
//           0 0 30px #00ff88,
//           0 0 50px #00ff88;
//       }
//     }
    
//     /* Play button glow when playing */
//     body.is-playing .button__top::after {
//       box-shadow: 
//         0 0 10px rgba(255, 200, 100, 0.5),
//         0 0 20px rgba(255, 200, 100, 0.3);
//     }
    
//     .button__top::after {
//       transition: box-shadow 1.5s ease;
//     }
    
//     /* Screen/display area ambient glow */
//     .d04__front::after {
//       transition: box-shadow 1.5s ease, background-color 1.5s ease;
//     }
    
//     body.is-playing .d04__front::after {
//       background-color: #0a1520;
//       box-shadow: 
//         inset 0 0 15px rgba(0, 255, 136, 0.2),
//         0 0 5px rgba(0, 255, 136, 0.1);
//     }
    
//     /* Tape reels glow */
//     .circle {
//       transition: box-shadow 0.5s ease, background-image 0.5s ease;
//     }
    
//     body.is-playing .circle {
//       box-shadow: 
//         0 0 8px rgba(100, 200, 255, 0.4),
//         0 0 15px rgba(100, 200, 255, 0.2);
//     }
    
//     /* Waves get a glow too */
//     body.is-playing .wave {
//       box-shadow: 0 0 10px rgba(100, 200, 255, 0.3);
//     }
    
//     .wave {
//       transition: box-shadow 0.3s ease;
//     }
    
//     /* Speaker grille subtle glow */
//     .d01__right::before,
//     .d01__right::after {
//       transition: filter 1.5s ease;
//     }
    
//     body.is-playing .d01__right::before,
//     body.is-playing .d01__right::after {
//       filter: drop-shadow(0 0 3px rgba(100, 200, 255, 0.3));
//     }
    
//     /* Ambient light on the body panels */
//     body.is-playing .a__front,
//     body.is-playing .b01__front,
//     body.is-playing .b02__front {
//       filter: brightness(0.85);
//     }
    
//     .a__front, .b01__front, .b02__front {
//       transition: filter 1.5s ease;
//     }
    
//     /* Side panels darken */
//     body.is-playing .d01__front,
//     body.is-playing .d03__front,
//     body.is-playing .d06__front {
//       filter: brightness(0.7);
//     }
    
//     .d01__front, .d03__front, .d06__front {
//       transition: filter 1.5s ease;
//     }
//   `;
//   document.head.appendChild(style);
// }