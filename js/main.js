// File: js/main.js (Final Lengkap - Termasuk Semua Trigger & Auto-Pause Musik & Efek Suara Tombol)

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan seleksi elemen ini ada di dalam DOMContentLoaded
    const sections = document.querySelectorAll('section');
    const startButton = document.querySelector('#home-section .btn-start'); // Tombol START home
    const homeSectionId = 'home-section';
    const messageSectionId = 'message-section';
    const gallerySectionId = 'gallery-section';
    const musicSectionId = 'music-section'; // ID music section
    const tetrisSectionId = 'tetris-section';

    // Cek start button home (opsional)
    if (!startButton && sections.length > 1 && sections[1] && sections[1].id === homeSectionId) {
        // console.warn("Tombol START (#home-section .btn-start) tidak ditemukan.");
    }

    // Urutan section untuk tombol START Home
    const sequence = ['message-section', 'gallery-section', 'music-section', 'tetris-section', 'home-section'];
    let currentSequenceIndex = 0;

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
                    if (targetId === messageSectionId && typeof window.triggerMessageAnimation === 'function') {
                        window.triggerMessageAnimation();
                    } else if (targetId === gallerySectionId && typeof window.initGallery === 'function') {
                        window.initGallery();
                    } else if (targetId === musicSectionId && typeof window.initMusicPlayer === 'function') {
                        window.initMusicPlayer();
                    } else if (targetId === tetrisSectionId && typeof window.initTetris === 'function') {
                        window.initTetris();
                    }
                } catch (e) { console.error(`Error saat menampilkan/inisialisasi section ${targetId}:`, e); }
                sectionFound = true;

            } else {
                // --- BAGIAN MENYEMBUNYIKAN SECTION LAIN ---

                // === LOGIKA AUTO-PAUSE MUSIK ===
                // Jika section yang akan disembunyikan adalah Music Section, panggil fungsi pause globalnya
                if (section.id === musicSectionId && typeof window.pauseMusicPlayer === 'function') {
                    // console.log("Pausing music player because section is being hidden."); // Debug log
                    window.pauseMusicPlayer();
                }
                // === AKHIR LOGIKA AUTO-PAUSE ===

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
        const button = event.target.closest('[data-target]'); // Cari tombol atau parent-nya yg punya data-target
        if (button && button.matches('[data-target]')) { // Pastikan elemen ditemukan dan punya atribut
            if (!button.classList.contains('btn-start')) { // Jangan tangani tombol START Home di sini
                const targetSectionId = button.getAttribute('data-target');
                if (targetSectionId) {
                    showSection(targetSectionId);
                } else {
                    console.error("Tombol tidak memiliki atribut data-target:", button);
                }
            }
        }
    });

    // --- Event Listener untuk Tombol START Home (Navigasi Berurutan) ---
    if (startButton) {
        startButton.addEventListener('click', () => {
            if (currentSequenceIndex < sequence.length) {
                const nextSectionId = sequence[currentSequenceIndex];
                showSection(nextSectionId);
                currentSequenceIndex++;
                if (currentSequenceIndex >= sequence.length) {
                    currentSequenceIndex = 0;
                }
            } else {
                console.error("Indeks sequence tidak valid:", currentSequenceIndex);
                currentSequenceIndex = 0; // Reset jika error
            }
        });
    }

    // --- Event Listener untuk Tombol Non-Navigasi (Contoh: Home Section) ---
    const nonNavButtons = document.querySelectorAll('#home-section .d-pad > div, #home-section .btn-action, #home-section .btn-select');
    nonNavButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const buttonInfo = event.target.className || 'Unknown Button';
            // console.log(`Tombol ditekan (tanpa navigasi Home): ${buttonInfo}`); // Matikan log jika tidak perlu
        });
    });

    // --- Logika untuk Efek Suara Tombol ---
    const buttonSound = document.getElementById('button-sound');
    if (buttonSound) {
        document.body.addEventListener('click', (event) => {
            const targetElement = event.target.closest('button, .d-pad > div');
            if (targetElement) {
                buttonSound.currentTime = 0;
                buttonSound.play().catch(error => { /* Abaikan error autoplay */ });
            }
        });
        // Coba load suara di awal
        buttonSound.load();
    } else {
        console.warn("Elemen audio '#button-sound' tidak ditemukan. Efek suara tombol tidak aktif.");
    }
    // --- Akhir Logika Efek Suara Tombol ---

}); // Akhir DOMContentLoaded