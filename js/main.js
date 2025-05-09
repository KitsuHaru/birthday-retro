// File: js/main.js (Final Lengkap - Termasuk Kontrol Backsound Utama)

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan seleksi elemen ini ada di dalam DOMContentLoaded
    const sections = document.querySelectorAll('section');
    const startButton = document.querySelector('#home-section .btn-start'); // Tombol START home
    const homeSectionId = 'home-section';
    const messageSectionId = 'message-section';
    const gallerySectionId = 'gallery-section';
    const musicSectionId = 'music-section';
    const tetrisSectionId = 'tetris-section';
    const loadingScreenId = 'loading-screen'; // <<< Tambahkan ID loading screen

    // === ELEMEN AUDIO BARU UNTUK BACKSOUND ===
    const backgroundMusic = document.getElementById('background-music');
    const buttonSound = document.getElementById('button-sound'); // Dari fitur sebelumnya
    let isBacksoundManuallyControlled = false; // Untuk nanti jika ada tombol mute/unmute backsound
    let firstUserInteraction = false; // Tandai interaksi pertama pengguna
    // === AKHIR ELEMEN AUDIO BARU ===

    // Cek start button home (opsional)
    if (!startButton && sections.length > 1 && sections[1] && sections[1].id === homeSectionId) {
        // console.warn("Tombol START (#home-section .btn-start) tidak ditemukan.");
    } else if (!startButton && sections.length <= 1 && (sections[0] && sections[0].id !== 'loading-screen') ) {
        // console.warn("Tombol START (#home-section .btn-start) tidak ditemukan atau hanya ada satu section utama.");
    }

    // Urutan section untuk tombol START Home
    const sequence = ['message-section', 'gallery-section', 'music-section', 'tetris-section', 'home-section'];
    let currentSequenceIndex = 0;

    // --- Fungsi untuk mencoba memainkan backsound ---
    function tryPlayBacksound() {
        if (backgroundMusic && backgroundMusic.paused && !isBacksoundManuallyControlled && firstUserInteraction) {
            backgroundMusic.play().catch(e => {
                // console.warn("Gagal memulai backsound (mungkin perlu interaksi pengguna lanjutan):", e);
            });
        }
    }

    // --- Fungsi untuk Menampilkan Section ---
    function showSection(targetId) {
        // console.log("Attempting to show section:", targetId); // Debug log
        let sectionFound = false;
        sections.forEach(section => {
            if (!section) return; // Lewati jika elemen section tidak valid

            if (section.id === targetId) {
                // --- BAGIAN MENAMPILKAN SECTION TARGET ---
                try {
                    // Atur display: flex untuk section utama agar bisa centering
                    if (targetId === homeSectionId || targetId === messageSectionId || targetId === gallerySectionId || targetId === musicSectionId || targetId === tetrisSectionId) {
                        section.style.display = 'flex';
                    } else {
                        section.style.display = 'block'; // Default untuk section lain (jika ada)
                    }

                    // Panggil fungsi inisialisasi/animasi untuk section yang sesuai
                    if (targetId === messageSectionId && typeof window.triggerMessageAnimation === 'function') { window.triggerMessageAnimation(); }
                    else if (targetId === gallerySectionId && typeof window.initGallery === 'function') { window.initGallery(); }
                    else if (targetId === musicSectionId && typeof window.initMusicPlayer === 'function') { window.initMusicPlayer(); }
                    else if (targetId === tetrisSectionId && typeof window.initTetris === 'function') { window.initTetris(); }

                    // === KONTROL BACKSOUND SAAT SECTION DITAMPILKAN ===
                    if (backgroundMusic) {
                        if (targetId === musicSectionId) { // Jika masuk Music Section
                            if (!backgroundMusic.paused) backgroundMusic.pause();
                        } else if (targetId !== loadingScreenId) { // Jangan putar di loading screen
                            // Coba mainkan jika sudah ada interaksi user & tidak di-pause manual
                            tryPlayBacksound();
                        } else if (targetId === loadingScreenId && !backgroundMusic.paused) {
                             backgroundMusic.pause(); // Pastikan mati saat loading screen
                        }
                    }
                    // === AKHIR KONTROL BACKSOUND ===

                } catch (e) { console.error(`Error saat menampilkan/inisialisasi section ${targetId}:`, e); }
                sectionFound = true;

            } else {
                // --- BAGIAN MENYEMBUNYIKAN SECTION LAIN ---
                // Logika auto-pause musik dari Music Player (player lagu, bukan backsound)
                if (section.id === musicSectionId && typeof window.pauseMusicPlayer === 'function') {
                    window.pauseMusicPlayer();
                }
                section.style.display = 'none'; // Sembunyikan section ini
            }
        });

        if (!sectionFound) { console.error(`Section dengan ID "${targetId}" tidak ditemukan!`); return; }

        // Logika reset index sequence (Tetap sama)
        if (targetId === homeSectionId) { currentSequenceIndex = 0; }
        else { const indexInSequence = sequence.indexOf(targetId); if (indexInSequence !== -1 && targetId !== homeSectionId) { currentSequenceIndex = indexInSequence + 1; if (currentSequenceIndex >= sequence.length) { currentSequenceIndex = 0; } } }
    }

    // --- Event Listener untuk SEMUA Tombol Navigasi [data-target] ---
    document.body.addEventListener('click', (event) => {
        // --- LOGIKA INTERAKSI PERTAMA UNTUK BACKSOUND ---
        if (!firstUserInteraction && backgroundMusic) {
            firstUserInteraction = true;
            backgroundMusic.muted = false; // Coba unmute
            // Coba mainkan backsound setelah interaksi pertama, jika bukan di music section
            const activeSection = document.querySelector('section[style*="display: flex"], section[style*="display: block"], div[style*="display: flex"]'); // Cek juga loading screen
            if (activeSection && activeSection.id !== musicSectionId && activeSection.id !== loadingScreenId) {
                tryPlayBacksound();
            }
        }
        // --- AKHIR LOGIKA INTERAKSI PERTAMA ---

        const button = event.target.closest('[data-target]');
        if (button && button.matches('[data-target]')) {
             if (!button.classList.contains('btn-start')) { // Jangan tangani tombol START Home di sini
                 const targetSectionId = button.getAttribute('data-target');
                 if (targetSectionId) { showSection(targetSectionId); }
                 else { console.error("Tombol tidak memiliki atribut data-target:", button); }
             }
        }
    });

    // --- Event Listener untuk Tombol START Home (Navigasi Berurutan) ---
    if (startButton) {
        startButton.addEventListener('click', () => {
            if (currentSequenceIndex < sequence.length) { const nextSectionId = sequence[currentSequenceIndex]; showSection(nextSectionId); currentSequenceIndex++; if (currentSequenceIndex >= sequence.length) { currentSequenceIndex = 0; } }
            else { console.error("Indeks sequence tidak valid:", currentSequenceIndex); currentSequenceIndex = 0; }
        });
    }

    // --- Event Listener untuk Tombol Non-Navigasi (Home Section) ---
    const nonNavButtons = document.querySelectorAll('#home-section .d-pad > div, #home-section .btn-action, #home-section .btn-select');
    nonNavButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const buttonInfo = event.target.className || 'Unknown Button';
            // console.log(`Tombol ditekan (tanpa navigasi Home): ${buttonInfo}`);
        });
    });

    // --- Logika untuk Efek Suara Tombol ---
    if (buttonSound) {
        document.body.addEventListener('click', (event) => {
            const targetElement = event.target.closest('button, .d-pad > div');
            if (targetElement) {
                buttonSound.currentTime = 0;
                buttonSound.play().catch(error => { /* Abaikan error autoplay */ });
            }
        });
        buttonSound.load(); // Coba load di awal
    } else {
        console.warn("Elemen audio '#button-sound' tidak ditemukan. Efek suara tombol tidak aktif.");
    }
    // --- Akhir Logika Efek Suara Tombol ---

    // === COBA PUTAR BACKSOUND (MUTED) DI AWAL ===
    if (backgroundMusic) {
         backgroundMusic.muted = true; // Mulai dengan muted untuk mengatasi blokir autoplay
         backgroundMusic.play().then(() => {
             // console.log("Backsound (muted) playing on load attempt.");
         }).catch(e => {
             // console.warn("Initial muted autoplay of backsound failed. User interaction will be needed.", e);
         });
    }
    // === AKHIR COBA PUTAR BACKSOUND ===

}); // Akhir DOMContentLoaded