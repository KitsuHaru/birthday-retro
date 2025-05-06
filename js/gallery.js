// File: js/gallery.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Konfigurasi & Data (Nama File Dummy) ---
    // ---> EDIT BAGIAN INI <---
    const photoURLs = [
        'assets/images/gallery-photo-1.jpg', // Ganti ini jika nama file Anda beda
        'assets/images/gallery-photo-2.jpg', // Ganti ini jika nama file Anda beda
        'assets/images/gallery-photo-3.jpg', // Ganti ini jika nama file Anda beda
        'assets/images/gallery-photo-4.jpg'  // Ganti ini jika nama file Anda beda
    ];
    const videoURL = 'assets/video/gallery-video-clip.mp4'; // Ganti ini jika nama file Anda beda
    // ---> AKHIR BAGIAN EDIT <---
    const totalPhotos = photoURLs.length;
    const PREPARING_SPEED = 30; // Kecepatan loading persiapan (ms)
    const PRINTING_SPEED = 40; // Kecepatan loading per foto (ms)
    const PHOTO_ENTRY_DELAY = 500; // Jeda sebelum foto berikutnya mulai cetak (ms)

    // --- Ambil Elemen DOM ---
    const gallerySection = document.getElementById('gallery-section');
    // States
    const initialStateDiv = document.getElementById('gallery-initial-state');
    const preparingStateDiv = document.getElementById('gallery-preparing-state');
    const printingStateDiv = document.getElementById('gallery-printing-state');
    const finalStateDiv = document.getElementById('gallery-final-state');
    const allStateDivs = document.querySelectorAll('.gallery-state');
    // Buttons
    const mulaiCetakButton = document.getElementById('mulai-cetak-button');
    const cetakUlangButton = document.getElementById('cetak-ulang-button');
    // Progress Bars & Text
    const preparingProgressBar = document.getElementById('preparing-progress-bar');
    const preparingPercentageText = document.getElementById('preparing-percentage');
    const printingStatusText = document.getElementById('printing-status-text');
    const printingProgressBar = document.getElementById('printing-progress-bar');
    const printingPercentageText = document.getElementById('printing-percentage');
    // Containers
    const printedPhotosContainer = document.getElementById('printed-photos');
    const finalPhotosListContainer = document.getElementById('final-photos-list');
    // Video Modal
    const videoModal = document.getElementById('video-modal');
    const videoModalCloseButton = document.getElementById('video-modal-close');
    const videoPlayer = document.getElementById('clip-dump-video');
    const galleryContentArea = document.querySelector('#gallery-section .photobox-content-area');

    // --- State Management ---
    let currentPhotoIndex = 0;
    let preparingInterval;
    let printingInterval;
    let printedPhotoElements = []; // Simpan elemen foto yang sudah dibuat

    // --- Fungsi Helper ---
    function setState(newState) {
        allStateDivs.forEach(div => {
            div.style.display = 'none'; // Sembunyikan semua state
        });
         // Set overflow content area sesuai state
        if (newState === 'printing' || newState === 'final') {
            galleryContentArea.style.overflowY = 'auto';
             galleryContentArea.style.justifyContent = 'flex-start'; // Mulai dari atas
        } else {
             galleryContentArea.style.overflowY = 'hidden';
             galleryContentArea.style.justifyContent = 'center'; // Tengahkan state awal/prepare
        }

        const targetStateDiv = document.getElementById(`gallery-${newState}-state`);
        if (targetStateDiv) {
            targetStateDiv.style.display = 'flex'; // Gunakan flex untuk layout internal state
            targetStateDiv.style.flexDirection = 'column'; // Pastikan kolom
            if (newState === 'initial' || newState === 'preparing'){
                 targetStateDiv.style.justifyContent = 'center'; // Tengahkan isi state awal & prepare
                 targetStateDiv.style.alignItems = 'center';
            } else {
                 targetStateDiv.style.justifyContent = 'flex-start'; // State print/final mulai dari atas
                 targetStateDiv.style.alignItems = 'center';
            }

        } else {
            console.error("State div not found for:", newState);
        }
    }

    // --- Fungsi Utama ---

    // Inisialisasi Gallery Section (dipanggil dari main.js)
    function initGallery() {
        // console.log("Initializing Gallery");
        setState('initial'); // Set ke state awal
        // Hentikan interval yang mungkin masih berjalan jika user kembali
        clearInterval(preparingInterval);
        clearInterval(printingInterval);
        currentPhotoIndex = 0;
        printedPhotoElements = []; // Kosongkan array elemen foto
        if(printedPhotosContainer) printedPhotosContainer.innerHTML = ''; // Kosongkan kontainer foto
        if(finalPhotosListContainer) finalPhotosListContainer.innerHTML = ''; // Kosongkan kontainer akhir
        // Set progress bar ke 0
        if(preparingProgressBar) preparingProgressBar.style.width = '0%';
        if(preparingPercentageText) preparingPercentageText.textContent = '0%';
        if(printingProgressBar) printingProgressBar.style.width = '0%';
        if(printingPercentageText) printingPercentageText.textContent = '0%';
    }
    window.initGallery = initGallery; // Buat global agar bisa dipanggil main.js


    // Mulai loading persiapan
    function startPreparingLoading() {
        clearInterval(preparingInterval); // Hapus interval lama jika ada
        let percentage = 0;
        preparingProgressBar.style.width = '0%';
        preparingPercentageText.textContent = '0%';

        preparingInterval = setInterval(() => {
            percentage++;
            preparingProgressBar.style.width = percentage + '%';
            preparingPercentageText.textContent = percentage + '%';

            if (percentage >= 100) {
                clearInterval(preparingInterval);
                // console.log("Preparing done, starting printing cycle");
                startPrintingCycle(); // Mulai cetak foto
            }
        }, PREPARING_SPEED);
    }

    // Mulai siklus cetak foto
    function startPrintingCycle() {
        setState('printing');
        currentPhotoIndex = 0;
        printedPhotoElements = []; // Kosongkan array elemen
        printedPhotosContainer.innerHTML = ''; // Kosongkan kontainer tampilan printing
        finalPhotosListContainer.innerHTML = ''; // Kosongkan kontainer tampilan akhir
        printPhoto(currentPhotoIndex); // Mulai cetak foto pertama
    }

    // Fungsi untuk "mencetak" satu foto
    function printPhoto(index) {
        if (index >= totalPhotos) {
            // console.log("All photos printed, showing final state");
            showFinalState(); // Semua foto selesai, tampilkan state akhir
            return;
        }

        printingStatusText.textContent = `Mencetak foto ${index + 1} dari ${totalPhotos}...`;
        printingProgressBar.style.width = '0%';
        printingPercentageText.textContent = '0%';

        // Buat elemen HTML untuk foto
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item';

        const img = document.createElement('img');
        img.src = photoURLs[index];
        img.alt = `Foto ${index + 1}`;
        img.onerror = () => img.src = 'assets/images/placeholder_error.png'; // Gambar pengganti jika error load

        const caption = document.createElement('span');
        caption.className = 'photo-caption';
        caption.textContent = `#${index + 1}`; // Contoh caption nomor

        photoDiv.appendChild(img);
        photoDiv.appendChild(caption);

        // Tambahkan ke kontainer DAN simpan referensi elemennya
        printedPhotosContainer.appendChild(photoDiv);
        printedPhotoElements.push(photoDiv); // Simpan elemen untuk state final

        // Scroll ke bawah jika perlu
         printedPhotosContainer.scrollTop = printedPhotosContainer.scrollHeight;

        // Mulai loading persentase untuk foto ini
        startPerPhotoLoading(index);
    }

    // Loading persentase per foto
    function startPerPhotoLoading(index) {
        clearInterval(printingInterval);
        let percentage = 0;
        printingProgressBar.style.width = '0%';
        printingPercentageText.textContent = '0%';

        printingInterval = setInterval(() => {
            percentage++;
            printingProgressBar.style.width = percentage + '%';
            printingPercentageText.textContent = percentage + '%';

            if (percentage >= 100) {
                clearInterval(printingInterval);
                currentPhotoIndex++;
                // Jeda sebentar sebelum cetak foto berikutnya
                setTimeout(() => {
                    printPhoto(currentPhotoIndex);
                }, PHOTO_ENTRY_DELAY);
            }
        }, PRINTING_SPEED);
    }

    // Tampilkan state akhir setelah semua foto tercetak
    function showFinalState() {
        setState('final');
        finalPhotosListContainer.innerHTML = ''; // Kosongkan dulu

        // Salin semua elemen foto yang sudah dibuat ke kontainer final
        printedPhotoElements.forEach(photoEl => {
            finalPhotosListContainer.appendChild(photoEl.cloneNode(true)); // Salin elemennya
        });

        // Buat dan tambahkan placeholder video
        const videoPlaceholderDiv = document.createElement('div');
        videoPlaceholderDiv.className = 'video-placeholder';
        videoPlaceholderDiv.id = 'clip-dump-placeholder'; // Beri ID agar bisa ditarget
        videoPlaceholderDiv.innerHTML = `
            <div class="play-icon">▶</div>
            <div class="video-title">Clip Dump</div>
            <div class="video-caption">Kenangan spesial!</div>
        `;
        finalPhotosListContainer.appendChild(videoPlaceholderDiv);

        // Tambahkan event listener ke placeholder video YANG BARU DIBUAT
        videoPlaceholderDiv.addEventListener('click', openVideoModal);

        // Pastikan bisa discroll
        finalPhotosListContainer.scrollTop = 0; // Scroll ke atas
    }


    // --- Fungsi untuk Video Modal ---
    function openVideoModal() {
        // console.log("Opening video modal");
        if (videoPlayer && videoURL) {
            videoPlayer.src = videoURL; // Set sumber video
            videoModal.style.display = 'flex'; // Tampilkan modal
            // videoPlayer.play(); // Optional: langsung putar
        } else {
            console.error("Video player or URL not found");
        }
    }

    function closeVideoModal() {
         // console.log("Closing video modal");
         if (videoPlayer) {
             videoPlayer.pause(); // Jeda video saat ditutup
             videoPlayer.src = ""; // Kosongkan src untuk stop buffering
         }
        videoModal.style.display = 'none'; // Sembunyikan modal
    }

    // --- Event Listeners untuk Tombol ---
    if (mulaiCetakButton) {
        mulaiCetakButton.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log("Mulai Cetak Clicked");
            setState('preparing');
            startPreparingLoading();
        });
    } else { console.error("Button 'Mulai Cetak' not found"); }

    if (cetakUlangButton) {
         cetakUlangButton.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log("Cetak Ulang Clicked");
            // Langsung mulai printing cycle lagi
            startPrintingCycle();
        });
    } else { console.error("Button 'Cetak Ulang' not found"); }

    if (videoModalCloseButton) {
        videoModalCloseButton.addEventListener('click', closeVideoModal);
    } else { console.error("Video modal close button not found"); }

     // Listener untuk menutup modal jika klik di luar area konten modal (di overlay)
     if (videoModal) {
         videoModal.addEventListener('click', (event) => {
             // Jika yg diklik adalah overlay itu sendiri, bukan konten di dalamnya
             if (event.target === videoModal) {
                 closeVideoModal();
             }
         });
     }


}); // Akhir DOMContentLoaded