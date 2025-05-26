# 🎂 Retro Birthday Surprise 🕹️✨

Selamat datang di repositori proyek website ucapan ulang tahun spesial dengan tema retro yang interaktif! Proyek ini dibuat dengan penuh cinta sebagai hadiah ulang tahun ke-20 untuk Yas aka Suyo.

Website ini dirancang untuk memberikan pengalaman unik melalui berbagai section yang interaktif, mengingatkan pada era game-game klasik.

## 🚀 Fitur Utama

Website ini terdiri dari beberapa section dengan fitur menarik:

1.  **📺 Loading Screen:**
    * Animasi loading ala sistem boot-up retro.
    * Teks status yang berubah-ubah selama proses loading.
    * Progress bar yang menunjukkan kemajuan.

2.  **🎮 Home Section (Navigasi Utama):**
    * Tampilan antarmuka mirip konsol Game Boy klasik.
    * Tombol-tombol navigasi untuk langsung menuju ke setiap section (Message, Gallery, Music, Tetris).
    * Tombol "START" untuk memulai tur berurutan ke semua section.
    * Tombol D-pad, A, B, Select yang interaktif (memberikan feedback visual/suara).

3.  **💌 Message Section:**
    * Menampilkan pesan ulang tahun personal dengan efek *typewriter* (teks muncul satu per satu).
    * Tombol "SKIP" untuk langsung menampilkan seluruh pesan.
    * Area pesan yang bisa di-scroll jika teksnya panjang.

4.  **🖼️ Gallery Section (Photobox):**
    * Konsep "Photobox" retro.
    * Tombol "MULAI CETAK" untuk memulai.
    * Animasi loading "Mempersiapkan photobox..."
    * Animasi "pencetakan" foto satu per satu dengan status dan progress bar per foto.
    * Menampilkan daftar foto yang sudah "dicetak".
    * Fitur "Clip Dump" yang memutar kompilasi video dalam jendela modal.
    * Tombol "CETAK ULANG" untuk mengulang animasi pencetakan foto.

5.  **🎶 Music Section:**
    * Pemutar musik interaktif.
    * Menampilkan cover album, judul lagu, dan nama artis.
    * Progress bar lagu yang bisa diklik/digeser (seeking).
    * Tombol kontrol: Play/Pause, Previous Track, Next Track.
    * Kontrol volume (speaker icon).
    * Daftar playlist yang bisa di-scroll dan diklik untuk langsung memutar lagu.
    * Lagu di Music Section akan otomatis berhenti jika pindah ke section lain.

6.  **🧱 Tetris Game Section:**
    * Game Tetris klasik yang bisa dimainkan.
    * Kontrol balok menggunakan tombol di layar (Kiri, Kanan, Rotate) dan keyboard.
    * Menampilkan Skor, Jumlah Baris yang dihapus, dan Level.
    * Kecepatan jatuh balok meningkat seiring naiknya level.
    * Layar "GAME OVER" dengan pesan personal "INGET YA!" dan tombol konfirmasi.
    * Tombol "PLAY AGAIN" (setelah Game Over, tombol START berubah) dan "KEMBALI".

7.  **🔊 Efek Suara & Musik Latar:**
    * Efek suara retro pada setiap interaksi tombol di seluruh website.
    * Musik latar yang terus berputar, namun akan otomatis mati saat:
        * Memasuki Music Section (karena ada pemutar musik sendiri).
        * Memutar video "Clip Dump" di Gallery Section.
        * (Musik latar akan kembali berputar saat kondisi di atas tidak terpenuhi).

8.  **📱 Desain Responsif:**
    * Tampilan disesuaikan agar tetap baik saat dibuka di perangkat mobile.

## 📸 Tampilan

## 🛠️ Teknologi yang Digunakan

* **HTML5:** Untuk struktur dasar halaman web.
* **CSS3:** Untuk styling, layout (Flexbox & Grid), animasi, dan desain responsif (Media Queries).
* **JavaScript (ES6+):** Untuk semua logika interaktif, manipulasi DOM, fitur-fitur di setiap section, game Tetris, dan kontrol audio.

## 🎮 Cara Menjalankan / Melihat Proyek

**Pilihan 1: Melihat Versi Online**
Website ini sudah di-deploy dan bisa diakses melalui link berikut:
(https://birthdaysuyo.vercel.app/)

**Pilihan 2: Menjalankan Secara Lokal**
1.  Clone repositori ini ke komputer Anda:
    ```bash
    git clone [https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git](https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git)
    ```
2.  Masuk ke direktori proyek:
    ```bash
    cd NAMA_REPO_ANDA
    ```
3.  Buka file `index.html` langsung di browser favorit Anda.

## 📁 Struktur Proyek (Ringkas)

* `index.html`: File utama yang berisi semua struktur section.
* `css/`: Folder berisi semua file CSS (satu file per section: `loading.css`, `home.css`, dst.).
* `js/`: Folder berisi semua file JavaScript (satu file per section/fungsi utama: `loading.js`, `main.js`, `tetris.js`, dst.).
* `assets/`: Folder berisi semua aset media:
    * `images/`: Untuk semua file gambar (foto galeri, cover album, dll.).
    * `video/`: Untuk file video Clip Dump.
    * `audio/`: Untuk file musik di Music Section, backsound utama, dan efek suara tombol.

## ❤️

Proyek ini adalah bentuk kecil dari rasa sayang dan apresiasiku untukmu. Setiap baris kode, setiap detail kecil, dibuat dengan memikirkan senyummu. Semoga kamu suka dan merasakan semua ketulusan di baliknya. Happy Birthday sekali lagi, sayang!

Feel free untuk digunakan sebagai bentuk rasa sayang kalian ke pasangan kalian.
---
*Dibuat dengan penuh semangat oleh [Mr.Yu]*
