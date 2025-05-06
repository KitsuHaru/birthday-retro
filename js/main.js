// File: js/main.js (Final Lengkap - Trigger Semua Section & Efek Suara Tombol)

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan seleksi elemen ini ada di dalam DOMContentLoaded
    const sections = document.querySelectorAll('section');
    const startButton = document.querySelector('#home-section .btn-start'); // Tombol START home
    const homeSectionId = 'home-section';
    const messageSectionId = 'message-section';
    const gallerySectionId = 'gallery-section';
    const musicSectionId = 'music-section';
    const tetrisSectionId = 'tetris-section';

    // Cek start button home
    if (!startButton && sections.length > 1 && sections[1].id === homeSectionId) { // Cek hanya jika home section ada
       // console.warn("Tombol START (#home-section .btn-start) tidak ditemukan.");
       // Tidak perlu error fatal, mungkin memang tidak ada start button di desain lain
    }

    const sequence = ['message-section', 'gallery-section', 'music-section', 'tetris-section', 'home-section'];
    let currentSequenceIndex = 0;

    function showSection(targetId) {
        let sectionFound = false;
        sections.forEach(section => {
            if (!section) return; // Lewati jika section null
            if (section.id === targetId) {
                try {
                    if (targetId === homeSectionId || targetId === messageSectionId || targetId === gallerySectionId || targetId === musicSectionId || targetId === tetrisSectionId) {
                        section.style.display = 'flex';
                    } else {
                        section.style.display = 'block';
                    }

                    // Panggil init functions (pastikan fungsi ini ada di window)
                    if (targetId === messageSectionId && typeof window.triggerMessageAnimation === 'function') { window.triggerMessageAnimation(); }
                    else if (targetId === gallerySectionId && typeof window.initGallery === 'function') { window.initGallery(); }
                    else if (targetId === musicSectionId && typeof window.initMusicPlayer === 'function') { window.initMusicPlayer(); }
                    else if (targetId === tetrisSectionId && typeof window.initTetris === 'function') { window.initTetris(); }

                } catch (e) { console.error(`Error saat menampilkan/inisialisasi section ${targetId}:`, e); }
                sectionFound = true;
            } else {
                section.style.display = 'none';
            }
        });

        if (!sectionFound) { console.error(`Section dengan ID "${targetId}" tidak ditemukan!`); return; }

        if (targetId === homeSectionId) { currentSequenceIndex = 0; }
        else { const indexInSequence = sequence.indexOf(targetId); if (indexInSequence !== -1 && targetId !== homeSectionId) { currentSequenceIndex = indexInSequence + 1; if (currentSequenceIndex >= sequence.length) { currentSequenceIndex = 0; } } }
    }

    document.body.addEventListener('click', (event) => {
        const button = event.target.closest('[data-target]');
        if (button && button.matches('[data-target]')) {
             if (!button.classList.contains('btn-start')) { // Pastikan bukan tombol START home
                 const targetSectionId = button.getAttribute('data-target');
                 if (targetSectionId) { showSection(targetSectionId); }
                 else { console.error("Tombol tidak memiliki atribut data-target:", button); }
             }
        }
    });

    if (startButton) {
        startButton.addEventListener('click', () => {
            if (currentSequenceIndex < sequence.length) { const nextSectionId = sequence[currentSequenceIndex]; showSection(nextSectionId); currentSequenceIndex++; if (currentSequenceIndex >= sequence.length) { currentSequenceIndex = 0; } }
            else { console.error("Indeks sequence tidak valid:", currentSequenceIndex); currentSequenceIndex = 0; }
        });
    }

    const nonNavButtons = document.querySelectorAll('#home-section .d-pad > div, #home-section .btn-action, #home-section .btn-select');
    nonNavButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const buttonInfo = event.target.className || 'Unknown Button';
            // console.log(`Tombol ditekan (tanpa navigasi Home): ${buttonInfo}`); // Kurangi log console
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
        // Coba load suara di awal untuk atasi autoplay policy di beberapa browser
        buttonSound.load();
    } else {
        console.warn("Elemen audio '#button-sound' tidak ditemukan. Efek suara tombol tidak aktif.");
    }
    // --- Akhir Logika Efek Suara Tombol ---

}); // Akhir DOMContentLoaded