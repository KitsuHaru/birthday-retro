// File: js/music.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Konfigurasi Playlist ---
    // Ganti dengan data lagu Anda: path ke audio & gambar cover
    const playlistData = [
        {
            title: "Semesta Untukmu (Remastered)",
            artist: "Mr.Yu",
            audioSrc: "assets/audio/Semesta Untukmu (Remastered).mp3", // Ganti path audio
            imageSrc: "assets/images/Semesta Untukmu (Remastered).png" // Ganti path gambar
        },
        {
            title: "Serendipity (Remastered)",
            artist: "Mr.Yu",
            audioSrc: "assets/audio/Serendipity (Remastered).mp3",
            imageSrc: "assets/images/Serendipity (Remastered).png"
        },
        {
            title: "Do I Wanna Know?",
            artist: "Arctic Monkeys",
            audioSrc: "assets/audio/Do I Wanna Know.mp3",
            imageSrc: "assets/images/Do-I-Wanna-Know.png"
        },
        {
            title: "No.1 Party Anthem",
            artist: "Arctic Monkeys",
            audioSrc: "assets/audio/No. 1 Party Anthem.mp3",
            imageSrc: "assets/images/No.1_Party-Anthem.jpg"
        },
         {
            title: "Sleep Walking",
            artist: "Bring Me The Horizon",
            audioSrc: "assets/audio/Sleepwalking.mp3",
            imageSrc: "assets/images/BMTH-Sleepwalking.jpg"
        },
        {
            title: "Follow You",
            artist: "Bring Me The Horizon",
            audioSrc: "assets/audio/Follow You.mp3",
            imageSrc: "assets/images/BMTH-Follow_You.jpg"
        }
        // Tambahkan lagu lain di sini jika perlu
    ];

    // --- Ambil Elemen DOM ---
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const albumArt = document.getElementById('album-art');
    const songTitleEl = document.getElementById('song-title');
    const songArtistEl = document.getElementById('song-artist');
    const playlistContainer = document.getElementById('playlist');
    const volumeBtn = document.getElementById('volume-btn');

    // --- State Player ---
    let currentSongIndex = 0;
    let isPlaying = false;

    // --- Fungsi Bantuan ---
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- Fungsi Inti Player ---
    function loadSong(index) {
        if (index < 0 || index >= playlistData.length) {
            console.error("Index lagu tidak valid:", index);
            return;
        }
        const song = playlistData[index];
        audioPlayer.src = song.audioSrc;
        albumArt.src = song.imageSrc || 'assets/images/default-album-art.png'; // Fallback jika gambar tdk ada
        albumArt.onerror = () => albumArt.src = 'assets/images/default-album-art.png'; // Handle error load gambar
        songTitleEl.textContent = song.title;
        songArtistEl.textContent = song.artist;
        currentSongIndex = index;

        // Reset progress bar saat lagu baru dimuat
        progressBar.value = 0;
        currentTimeEl.textContent = "0:00";
        totalDurationEl.textContent = "0:00"; // Akan diupdate saat metadata siap

        // Update highlight playlist
        updatePlaylistHighlight();

         // Coba muat metadata untuk durasi (beberapa browser perlu ini)
         audioPlayer.load();
    }

    function playSong() {
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                playPauseBtn.innerHTML = '⏸'; // Ikon Pause
            })
            .catch(error => console.error("Error playing audio:", error)); // Tangani error jika play gagal
    }

    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '▶'; // Ikon Play
    }
    window.pauseMusicPlayer = pauseSong;
    
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = playlistData.length - 1; // Wrap around ke akhir
        }
        loadSong(currentSongIndex);
        playSong();
    }

    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= playlistData.length) {
            currentSongIndex = 0; // Wrap around ke awal
        }
        loadSong(currentSongIndex);
        playSong();
    }

    function updateProgressBar(e) {
        const { duration, currentTime } = e.target;
         // Update durasi total jika sudah tersedia
         if (duration && !isNaN(duration)) {
            totalDurationEl.textContent = formatTime(duration);
            progressBar.max = Math.floor(duration); // Set max value progress bar
        } else if (!totalDurationEl.textContent || totalDurationEl.textContent === "0:00") {
             totalDurationEl.textContent = "Loading..."; // Tanda durasi belum siap
        }
        // Update waktu saat ini & posisi progress bar
        if(!isNaN(currentTime)) {
            currentTimeEl.textContent = formatTime(currentTime);
            progressBar.value = Math.floor(currentTime);
        }
    }

     function setProgressBar(e) {
        // Jika sumber event adalah klik user, bukan update otomatis
         if (e.type === 'input' || e.type === 'change') {
             if (!isNaN(audioPlayer.duration)) { // Pastikan durasi valid
                 audioPlayer.currentTime = progressBar.value;
             }
         }
    }

     function toggleMute() {
        audioPlayer.muted = !audioPlayer.muted;
        volumeBtn.style.opacity = audioPlayer.muted ? 0.5 : 1; // Ubah tampilan tombol mute
        volumeBtn.innerHTML = audioPlayer.muted ? '🔇' : '🔊'; // Ubah ikon
    }

    // --- Fungsi Playlist ---
    function populatePlaylist() {
        playlistContainer.innerHTML = ''; // Kosongkan dulu
        playlistData.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.dataset.index = index; // Simpan index di data attribute

             // Tampilkan durasi sementara (akan diupdate saat metadata load jika perlu)
             const tempDuration = "?.??";

             item.innerHTML = `
                <span class="item-title">${index + 1}. ${song.title}</span>
                <span class="item-duration" id="duration-${index}">${tempDuration}</span>
            `;

             // Tambahkan listener untuk memutar lagu saat item diklik
             item.addEventListener('click', () => {
                 loadSong(index);
                 playSong();
             });

            playlistContainer.appendChild(item);

             // Ambil durasi asli (opsional, bisa memakan waktu)
             getAudioDuration(song.audioSrc, index);
        });
    }

    // Fungsi untuk mengambil durasi audio (asinkron)
     function getAudioDuration(src, index) {
         const audio = new Audio();
         audio.addEventListener('loadedmetadata', () => {
             const durationElement = document.getElementById(`duration-${index}`);
             if (durationElement && audio.duration && !isNaN(audio.duration)) {
                 durationElement.textContent = formatTime(audio.duration);
             } else if(durationElement) {
                 durationElement.textContent = "--:--"; // Jika gagal dapat durasi
             }
         });
         audio.addEventListener('error', () => {
             const durationElement = document.getElementById(`duration-${index}`);
              if (durationElement) {
                 durationElement.textContent = "Err"; // Tandai jika file audio error
             }
         });
         audio.src = src;
     }


    function updatePlaylistHighlight() {
        const items = playlistContainer.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }


    // --- Inisialisasi Player ---
    function initMusicPlayer() {
        // console.log("Initializing Music Player");
        populatePlaylist();
        loadSong(currentSongIndex); // Muat lagu pertama
        setupEventListeners();
    }

    function setupEventListeners() {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        });
        prevBtn.addEventListener('click', prevSong);
        nextBtn.addEventListener('click', nextSong);
        audioPlayer.addEventListener('timeupdate', updateProgressBar);
        audioPlayer.addEventListener('loadedmetadata', updateProgressBar); // Update durasi saat metadata siap
        audioPlayer.addEventListener('ended', nextSong); // Otomatis putar lagu berikutnya
        progressBar.addEventListener('input', setProgressBar); // Update saat user menggeser
        volumeBtn.addEventListener('click', toggleMute);
    }

    // Buat fungsi init global agar bisa dipanggil dari main.js
    window.initMusicPlayer = initMusicPlayer;

}); // Akhir DOMContentLoaded