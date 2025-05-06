// Tunggu sampai seluruh konten HTML selesai dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {

    // Ambil elemen-elemen yang dibutuhkan dari HTML (selector baru)
    const loadingScreen = document.getElementById('loading-screen'); // Target ID baru
    const progressBar = document.querySelector('.progress-bar'); // Target class baru
    const percentageText = document.querySelector('.progress-percentage'); // Target class baru
    const statusTextElement = document.querySelector('.status-text'); // Target class baru untuk teks status
    const homeSection = document.getElementById('home-section'); // Tetap sama

    let percentage = 0; // Mulai dari 0%
    const loadingSpeed = 50; // Kecepatan loading dalam milidetik

    // Fungsi untuk mengubah teks status loading (target elemen baru)
    const updateLoadingText = (percent) => {
        let newText = '';
        if (percent < 65) {
            newText = 'BOOTING SYSTEM...';
        } else if (percent < 81) {
            newText = 'INITIALIZING...';
        } else if (percent < 100) {
            newText = 'PREPARING BIRTHDAY SURPRISE...';
        } else {
            newText = 'READY!..'; // Saat 100%
        }
        // Update textContent dari elemen span khusus untuk teks
        if (statusTextElement) { // Cek dulu apakah elemennya ditemukan
            statusTextElement.textContent = newText;
        }
    };

    // Jalankan interval untuk simulasi loading
    const interval = setInterval(() => {
        percentage++; // Naikkan persentase

        // Update visual progress bar dan teks persentase (target elemen baru)
        if (progressBar) { // Cek dulu apakah elemennya ditemukan
           progressBar.style.width = percentage + '%';
        }
        if (percentageText) { // Cek dulu apakah elemennya ditemukan
            percentageText.textContent = percentage + '%';
        }


        // Update teks status loading berdasarkan persentase saat ini
        updateLoadingText(percentage);

        // Cek jika sudah mencapai 100%
        if (percentage >= 100) {
            clearInterval(interval); // Hentikan interval loading

            // Beri sedikit jeda agar "READY!" terlihat sebelum transisi
            setTimeout(() => {
                // Mulai transisi fade out untuk loading screen (target ID baru)
                if (loadingScreen) { // Cek dulu apakah elemennya ditemukan
                    loadingScreen.classList.add('hidden');

                    // Dengarkan event ketika transisi CSS selesai
                    loadingScreen.addEventListener('transitionend', () => {
                        // Sembunyikan loading screen sepenuhnya setelah fade out
                        loadingScreen.style.display = 'none';

                        // Tampilkan home section
                        if (homeSection) { // Cek dulu apakah elemennya ditemukan
                           homeSection.style.display = 'block'; // Atau 'flex' sesuai kebutuhan Home
                        }
                    }, { once: true }); // Hanya berjalan sekali
                }

            }, 500); // Jeda 0.5 detik

        }
    }, loadingSpeed);

}); // Akhir dari event listener DOMContentLoaded