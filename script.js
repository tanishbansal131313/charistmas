const canvas = document.createElement("canvas");
canvas.className = "snow";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let w, h;
let flakes = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function createFlakes() {
  flakes = Array.from({ length: 120 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 3 + 1,
    speed: Math.random() * 1 + 0.5
  }));
}
createFlakes();

function draw() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  flakes.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();
    f.y += f.speed;
    f.x += Math.sin(f.y * 0.01);
    if (f.y > h) {
      f.y = -5;
      f.x = Math.random() * w;
    }
  });
  requestAnimationFrame(draw);
}
draw();

// Background music controls
const bgm = new Audio();
bgm.src = 'music.mp3';
bgm.loop = true;
bgm.volume = 0.28;
bgm.preload = 'auto';
let musicPlaying = false;

function updateMusicButton() {
  const btn = document.getElementById('music-toggle');
  if (!btn) return;
  btn.textContent = musicPlaying ? '🔊 Music ON' : '🔈 Music OFF';
  btn.setAttribute('aria-pressed', musicPlaying ? 'true' : 'false');
}

function playMusic() {
  bgm.play().then(() => {
    musicPlaying = true;
    updateMusicButton();
    localStorage.setItem('bgmPlaying', '1');
  }).catch(() => {
    // Autoplay blocked; wait for user interaction
    musicPlaying = false;
    updateMusicButton();
  });
}

function pauseMusic() {
  bgm.pause();
  musicPlaying = false;
  updateMusicButton();
  localStorage.setItem('bgmPlaying', '0');
}

function toggleMusic() {
  if (musicPlaying) pauseMusic(); else playMusic();
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('music-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    toggleMusic();
  });

  // Restore preference if user previously enabled music
  const saved = localStorage.getItem('bgmPlaying');
  if (saved === '1') {
    // Many browsers block autoplay; try to play on first user gesture
    const tryPlay = () => {
      playMusic();
      window.removeEventListener('click', tryPlay);
    };
    window.addEventListener('click', tryPlay);
  } else {
    updateMusicButton();
  }
});
/* =========================
   GALLERY – USER PHOTOS
========================= */

const galleryEl = document.getElementById("gallery");
const photoInput = document.getElementById("photoInput");

if (photoInput && galleryEl) {
  // Load saved photos
  const savedPhotos = JSON.parse(localStorage.getItem("photos") || "[]");
  savedPhotos.forEach(src => addImage(src));

  photoInput.addEventListener("change", () => {
    Array.from(photoInput.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        addImage(e.target.result);
        savedPhotos.push(e.target.result);
        localStorage.setItem("photos", JSON.stringify(savedPhotos));
      };
      reader.readAsDataURL(file);
    });
  });
}

function addImage(src) {
  const img = document.createElement("img");
  img.src = src;
  galleryEl.appendChild(img);
}
/* =========================
   NOTES – USER MESSAGES
========================= */

const notesEl = document.getElementById("notes");
const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNote");

if (notesEl && addNoteBtn && noteInput) {
  const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");

  savedNotes.forEach(text => addNote(text));

  addNoteBtn.addEventListener("click", () => {
    const text = noteInput.value.trim();
    if (!text) return;

    addNote(text);
    savedNotes.push(text);
    localStorage.setItem("notes", JSON.stringify(savedNotes));
    noteInput.value = "";
  });
}

function addNote(text) {
  const div = document.createElement("div");
  div.className = "note";
  div.textContent = text;
  notesEl.appendChild(div);
}
