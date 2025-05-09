// File: js/gallery.js (Diperbarui dengan Kontrol Backsound untuk Video Modal)

document.addEventListener('DOMContentLoaded', () => {

    // --- Konfigurasi & Data (Nama File Dummy) ---
    const photoURLs = [
        'assets/images/gallery-photo-1.jpg',
        'assets/images/gallery-photo-2.jpg',
        'assets/images/gallery-photo-3.jpg',
        'assets/images/gallery-photo-4.jpg'
    ];
    const videoURL = 'assets/video/gallery-video-clip.mp4';
    const totalPhotos = photoURLs.length;
    const PREPARING_SPEED = 30;
    const PRINTING_SPEED = 40;
    const PHOTO_ENTRY_DELAY = 500;

    // --- Ambil Elemen DOM ---
    const gallerySection = document.getElementById('gallery-section');
    const initialStateDiv = document.getElementById('gallery-initial-state');
    const preparingStateDiv = document.getElementById('gallery-preparing-state');
    const printingStateDiv = document.getElementById('gallery-printing-state');
    const finalStateDiv = document.getElementById('gallery-final-state');
    const allStateDivs = document.querySelectorAll('.gallery-state');
    const mulaiCetakButton = document.getElementById('mulai-cetak-button');
    const cetakUlangButton = document.getElementById('cetak-ulang-button');
    const preparingProgressBar = document.getElementById('preparing-progress-bar');
    const preparingPercentageText = document.getElementById('preparing-percentage');
    const printingStatusText = document.getElementById('printing-status-text');
    const printingProgressBar = document.getElementById('printing-progress-bar');
    const printingPercentageText = document.getElementById('printing-percentage');
    const printedPhotosContainer = document.getElementById('printed-photos');
    const finalPhotosListContainer = document.getElementById('final-photos-list');
    const videoModal = document.getElementById('video-modal');
    const videoModalCloseButton = document.getElementById('video-modal-close');
    const videoPlayer = document.getElementById('clip-dump-video');
    const galleryContentArea = document.querySelector('#gallery-section .photobox-content-area');

    // === TAMBAHKAN REFERENSI KE BACKSOUND DAN STATE-NYA ===
    const backgroundMusic = document.getElementById('background-music');
    let wasBacksoundPlayingBeforeModal = false;
    // === AKHIR TAMBAHAN ===

    // --- State Management ---
    let currentPhotoIndex = 0;
    let preparingInterval;
    let printingInterval;
    let printedPhotoElements = [];

    // --- Fungsi Helper ---
    function setState(newState) {
        // Pastikan elemen galleryContentArea ada sebelum diakses
        if (!galleryContentArea) {
            console.error("Elemen galleryContentArea tidak ditemukan saat setState.");
            // Hentikan fungsi jika elemen krusial tidak ada untuk mencegah error lebih lanjut
            allStateDivs.forEach(div => { if(div) div.style.display = 'none'; }); // Tetap sembunyikan state lain
            const targetStateDivOnError = document.getElementById(`gallery-${newState}-state`);
            if (targetStateDivOnError) targetStateDivOnError.style.display = 'flex'; // Coba tampilkan state yg diminta
            return;
        }

        allStateDivs.forEach(div => { if(div) div.style.display = 'none'; });

        if (newState === 'printing' || newState === 'final') {
            galleryContentArea.style.overflowY = 'auto';
            galleryContentArea.style.justifyContent = 'flex-start';
        } else {
            galleryContentArea.style.overflowY = 'hidden';
            galleryContentArea.style.justifyContent = 'center';
        }

        const targetStateDiv = document.getElementById(`gallery-${newState}-state`);
        if (targetStateDiv) {
            targetStateDiv.style.display = 'flex';
            targetStateDiv.style.flexDirection = 'column';
            if (newState === 'initial' || newState === 'preparing'){
                targetStateDiv.style.justifyContent = 'center';
                targetStateDiv.style.alignItems = 'center';
            } else {
                targetStateDiv.style.justifyContent = 'flex-start';
                targetStateDiv.style.alignItems = 'center';
            }
        } else {
            // console.error("State div tidak ditemukan untuk:", newState); // Matikan jika terlalu berisik
        }
    }

    // --- Fungsi Utama ---
    function initGallery() {
        setState('initial');
        clearInterval(preparingInterval); clearInterval(printingInterval);
        currentPhotoIndex = 0; printedPhotoElements = [];
        if(printedPhotosContainer) printedPhotosContainer.innerHTML = '';
        if(finalPhotosListContainer) finalPhotosListContainer.innerHTML = '';
        if(preparingProgressBar) preparingProgressBar.style.width = '0%';
        if(preparingPercentageText) preparingPercentageText.textContent = '0%';
        if(printingProgressBar) printingProgressBar.style.width = '0%';
        if(printingPercentageText) printingPercentageText.textContent = '0%';
    }
    window.initGallery = initGallery;

    function startPreparingLoading() {
        clearInterval(preparingInterval);
        let percentage = 0;
        if(preparingProgressBar) preparingProgressBar.style.width = '0%'; // Cek null
        if(preparingPercentageText) preparingPercentageText.textContent = '0%'; // Cek null

        preparingInterval = setInterval(() => {
            percentage++;
            if(preparingProgressBar) preparingProgressBar.style.width = percentage + '%';
            if(preparingPercentageText) preparingPercentageText.textContent = percentage + '%';
            if (percentage >= 100) {
                clearInterval(preparingInterval);
                startPrintingCycle();
            }
        }, PREPARING_SPEED);
    }

    function startPrintingCycle() {
        setState('printing');
        currentPhotoIndex = 0; printedPhotoElements = [];
        if(printedPhotosContainer) printedPhotosContainer.innerHTML = '';
        if(finalPhotosListContainer) finalPhotosListContainer.innerHTML = '';
        printPhoto(currentPhotoIndex);
    }

    function printPhoto(index) {
        if (index >= totalPhotos) { showFinalState(); return; }
        if(printingStatusText) printingStatusText.textContent = `Mencetak foto ${index + 1} dari ${totalPhotos}...`;
        if(printingProgressBar) printingProgressBar.style.width = '0%';
        if(printingPercentageText) printingPercentageText.textContent = '0%';

        const photoDiv = document.createElement('div'); photoDiv.className = 'photo-item';
        const img = document.createElement('img'); img.src = photoURLs[index]; img.alt = `Foto ${index + 1}`;
        img.onerror = () => img.src = 'assets/images/placeholder_error.png';
        const caption = document.createElement('span'); caption.className = 'photo-caption'; caption.textContent = `#${index + 1}`;
        photoDiv.appendChild(img); photoDiv.appendChild(caption);
        if(printedPhotosContainer) {
            printedPhotosContainer.appendChild(photoDiv);
            printedPhotosContainer.scrollTop = printedPhotosContainer.scrollHeight; // Scroll setelah menambah
        }
        printedPhotoElements.push(photoDiv);
        startPerPhotoLoading(index);
    }

    function startPerPhotoLoading(index) {
        clearInterval(printingInterval); let percentage = 0;
        if(printingProgressBar) printingProgressBar.style.width = '0%';
        if(printingPercentageText) printingPercentageText.textContent = '0%';
        printingInterval = setInterval(() => {
            percentage++;
            if(printingProgressBar) printingProgressBar.style.width = percentage + '%';
            if(printingPercentageText) printingPercentageText.textContent = percentage + '%';
            if (percentage >= 100) {
                clearInterval(printingInterval); currentPhotoIndex++;
                setTimeout(() => { printPhoto(currentPhotoIndex); }, PHOTO_ENTRY_DELAY);
            }
        }, PRINTING_SPEED);
    }

    function showFinalState() {
        setState('final');
        if(finalPhotosListContainer) finalPhotosListContainer.innerHTML = '';
        printedPhotoElements.forEach(photoEl => {
            if(finalPhotosListContainer) finalPhotosListContainer.appendChild(photoEl.cloneNode(true));
        });
        const videoPlaceholderDiv = document.createElement('div');
        videoPlaceholderDiv.className = 'video-placeholder'; videoPlaceholderDiv.id = 'clip-dump-placeholder';
        videoPlaceholderDiv.innerHTML = `<div class="play-icon">▶</div><div class="video-title">Clip Dump</div><div class="video-caption">Kenangan spesial!</div>`;
        if(finalPhotosListContainer) finalPhotosListContainer.appendChild(videoPlaceholderDiv);
        const actualPlaceholder = document.getElementById('clip-dump-placeholder'); // Ambil lagi elemen yg baru dibuat
        if(actualPlaceholder) actualPlaceholder.addEventListener('click', openVideoModal);
        if(finalPhotosListContainer) finalPhotosListContainer.scrollTop = 0;
    }

    // --- Fungsi untuk Video Modal (DENGAN KONTROL BACKSOUND) ---
    function openVideoModal() {
        // === PAUSE BACKSOUND SAAT MODAL DIBUKA ===
        if (backgroundMusic && !backgroundMusic.paused) {
            try {
                backgroundMusic.pause();
                wasBacksoundPlayingBeforeModal = true;
            } catch (e) { console.warn("Gagal mem-pause backsound saat membuka modal video:", e); }
        } else {
            wasBacksoundPlayingBeforeModal = false;
        }
        // === AKHIR LOGIKA PAUSE BACKSOUND ===

        if (videoPlayer && videoURL && videoModal) {
            videoPlayer.src = videoURL;
            videoModal.style.display = 'flex';
            // videoPlayer.play(); // Opsional
        } else {
            console.error("Video player, videoURL, atau videoModal tidak ditemukan saat openVideoModal");
        }
    }

    function closeVideoModal() {
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.src = "";
        }
        if (videoModal) videoModal.style.display = 'none';

        // === RESUME BACKSOUND SAAT MODAL DITUTUP ===
        const currentActiveSection = document.querySelector('section[style*="display: flex"], section[style*="display: block"]');
        if (backgroundMusic && wasBacksoundPlayingBeforeModal &&
            currentActiveSection && currentActiveSection.id !== 'music-section') {
            try {
                backgroundMusic.play().catch(e => console.warn("Gagal resume backsound:", e));
            } catch (e) { console.warn("Error saat resume backsound:", e); }
        }
        wasBacksoundPlayingBeforeModal = false; // Reset flag
        // === AKHIR LOGIKA RESUME BACKSOUND ===
    }

    // --- Event Listeners untuk Tombol ---
    if (mulaiCetakButton) { mulaiCetakButton.addEventListener('click', (e) => { e.preventDefault(); setState('preparing'); startPreparingLoading(); }); }
    else { console.warn("Tombol 'Mulai Cetak' tidak ditemukan (mungkin karena belum di state initial)."); }

    if (cetakUlangButton) { cetakUlangButton.addEventListener('click', (e) => { e.preventDefault(); startPrintingCycle(); }); }
    else { /* console.warn("Tombol 'Cetak Ulang' tidak selalu ada."); */ }

    if (videoModalCloseButton) { videoModalCloseButton.addEventListener('click', closeVideoModal); }
    else { console.warn("Tombol close video modal tidak ditemukan."); }

    if (videoModal) {
         videoModal.addEventListener('click', (event) => {
             if (event.target === videoModal) { closeVideoModal(); }
         });
     } else { console.warn("Elemen video modal tidak ditemukan."); }

    // Pengecekan elemen DOM penting lainnya di awal
    const importantElements = {gallerySection, initialStateDiv, preparingStateDiv, printingStateDiv, finalStateDiv,
                                preparingProgressBar, preparingPercentageText, printingStatusText, printingProgressBar,
                                printingPercentageText, printedPhotosContainer, finalPhotosListContainer, videoPlayer, galleryContentArea};
    for (const key in importantElements) {
        if (!importantElements[key]) {
            console.warn(`Elemen Gallery krusial '${key}' tidak ditemukan.`);
        }
    }

}); // Akhir DOMContentLoaded