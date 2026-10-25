
const music = document.getElementById("music");
const playBtn = document.getElementById("playBtn");
const currentTime = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");
const progress = document.getElementById("progress");
const lyrics = document.getElementById("lyrics");
const snowContainer = document.getElementById("snow-container");

// LIRIK DAN WAKTU KEMUNCULANNYA
const lyricData = [
    { time: 0, text: "You know it's true" },
    { time: 4, text: "Yeah, I miss you" },
    { time: 9, text: "You know it's true" },
    { time: 14, text: "So, What if I call?" },
    { time: 18, text: "And you pick up the phone" },
    { time: 22, text: "And I use this holiday to make my way to your ghost" },
    { time: 32, text: "Oh, What if you're lonely?" },
    { time: 36, text: "And you know I am too" },
    { time: 41, text: "And I get the chance to say" },
    { time: 44, text: "Merry Christmas, I miss you" },
    { time: 50, text: "I MISS YOU ❤️" }
];

let activeLyric = -1;

// FORMAT WAKTU
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// TOMBOL PLAY / PAUSE
playBtn.addEventListener("click", async () => {
    try {
        if (music.paused) {
            await music.play();
        } else {
            music.pause();
        }
    } catch (error) {
        console.error("Audio gagal diputar:", error);
        alert("Musik gagal diputar. Periksa file lagu.mp3.");
    }
});

// IKON PLAY / PAUSE
music.addEventListener("play", () => {
    playBtn.textContent = "Ⅱ";
});

music.addEventListener("pause", () => {
    playBtn.textContent = "▶";
});

// DURASI LAGU
music.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(music.duration);
});

// UPDATE WAKTU, PROGRESS, DAN LIRIK
music.addEventListener("timeupdate", () => {
    const now = music.currentTime;

    currentTime.textContent = formatTime(now);

    if (Number.isFinite(music.duration) && music.duration > 0) {
        progress.value = (now / music.duration) * 100;
    }

    let index = -1;

    for (let i = 0; i < lyricData.length; i++) {
        if (now >= lyricData[i].time) {
            index = i;
        }
    }

    if (index !== activeLyric) {
        activeLyric = index;

        lyrics.classList.remove("lyric-in");
        void lyrics.offsetWidth;

        lyrics.textContent = index >= 0
            ? lyricData[index].text
            : "Press play and remember...";

        lyrics.classList.add("lyric-in");
    }
});

// KEMBALI KE AWAL SAAT LAGU SELESAI
music.addEventListener("ended", () => {
    playBtn.textContent = "▶";
    progress.value = 0;
    currentTime.textContent = "0:00";
    activeLyric = -1;
});

// GESER PROGRESS BAR
progress.addEventListener("input", () => {
    if (Number.isFinite(music.duration) && music.duration > 0) {
        music.currentTime =
            (Number(progress.value) / 100) * music.duration;
    }
});

// AUTOPLAY (JIKA DIIZINKAN BROWSER)
window.addEventListener("load", async () => {
    try {
        await music.play();
    } catch (error) {
        playBtn.textContent = "▶";
        console.log("Autoplay diblokir. Klik tombol Play.");
    }
});

// CEK LAPISAN ANIMASI
if (snowContainer) {
    // BATAS PARTIKEL AGAR TIDAK TERLALU BERAT
    const maxSnow = 65;
    const maxHearts = 12;

    // MEMBUAT SALJU
    function createSnow() {
        if (snowContainer.querySelectorAll(".snow").length >= maxSnow) {
            return;
        }

        const snow = document.createElement("span");

        snow.className = "snow";
        snow.textContent = Math.random() > 0.5 ? "❄" : "✦";
        snow.style.left = Math.random() * 100 + "vw";
        snow.style.fontSize = (Math.random() * 10 + 8) + "px";
        snow.style.opacity = Math.random() * 0.6 + 0.3;

        const duration = Math.random() * 5 + 5;
        snow.style.animationDuration = duration + "s";

        snowContainer.appendChild(snow);

        setTimeout(() => {
            snow.remove();
        }, duration * 1000);
    }

    // MEMBUAT HATI MELAYANG
    function createHeart() {
        if (
            snowContainer.querySelectorAll(".floating-heart").length >= maxHearts
        ) {
            return;
        }

        const heart = document.createElement("span");

        heart.className = "floating-heart";
        heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = (Math.random() * 12 + 12) + "px";
        heart.style.opacity = Math.random() * 0.4 + 0.3;

        const duration = Math.random() * 5 + 8;
        heart.style.animationDuration = duration + "s";

        snowContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // MULAI ANIMASI SALJU
    setInterval(createSnow, 250);

    // MULAI ANIMASI HATI
    setInterval(createHeart, 1200);

    // PARTIKEL AWAL
    for (let i = 0; i < 20; i++) {
        setTimeout(createSnow, i * 100);
    }

    for (let i = 0; i < 4; i++) {
        setTimeout(createHeart, i * 700);
    }
}