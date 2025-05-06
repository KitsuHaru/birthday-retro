// File: js/message.js (dengan pesan baru)

document.addEventListener('DOMContentLoaded', () => {
    const messageTextArea = document.getElementById('message-text-area');
    const skipButton = document.getElementById('skip-button');

    // --- Teks Pesan Baru Anda ---
    const fullMessage = `Hai Yas,\n\nHappy Birthday!\n\nHari ini aku pengen kamu ngerasain semua hal positif dan keajaiban yang cuma bisa didapetin kalo kamu ada di dunia ini. Semoga segala keinginanmu tercapai, cita-cita dan impian kamu bisa kamu wujudkan, Aku selalu bersyukur bisa ngeliat kamu jadi versi terbaik dari dirimu, yang kadang-kadang random banget, tapi juga selalu bikin aku tersenyum tanpa henti.\n\nMakasih udah jadi temen curhat, partner in crime, dan sumber inspirasi sehari-hari. Semoga tahun ini kamu makin kece, makin banyak momen bahagia, dan makin dicintai, karena kamu emang pantas dapetin semua itu. Jangan lupa, kita bakal terus jalan bareng, ngejar mimpi, dan ngelewatin segala drama hidup dengan tawa.\n\nI love you Sweetie Pie <3`;
    // Jangan lupa sesuaikan jika perlu, misal nama pengirim jika ingin ditambahkan

    let typewriterTimeout; // Variabel untuk menyimpan ID timeout
    let isTyping = false; // Status apakah sedang mengetik

    // --- Fungsi untuk Efek Typewriter ---
    function startTypewriter() {
        if (!messageTextArea || isTyping) return;

        messageTextArea.innerHTML = ''; // Kosongkan area teks
        // Pastikan tombol skip ditemukan sebelum mengubah stylenya
         if (skipButton) {
            skipButton.style.display = 'inline-block'; // Tampilkan tombol SKIP
         }
        isTyping = true;
        let charIndex = 0;
        const typingSpeed = 50; // Kecepatan ketik (ms per karakter)

        function typeChar() {
            if (charIndex < fullMessage.length) {
                messageTextArea.innerHTML += fullMessage.charAt(charIndex);
                charIndex++;
                // Auto scroll ke bawah (cek null parentElement)
                if (messageTextArea.parentElement){
                    messageTextArea.parentElement.scrollTop = messageTextArea.parentElement.scrollHeight;
                }
                typewriterTimeout = setTimeout(typeChar, typingSpeed);
            } else {
                finishTyping();
            }
        }
        typeChar();
    }

    // --- Fungsi saat mengetik selesai / skip ---
     function finishTyping() {
        clearTimeout(typewriterTimeout);
        messageTextArea.innerHTML = fullMessage.replace(/\n/g, '<br>'); // Ganti \n jadi <br>
        if (skipButton) {
            skipButton.style.display = 'none'; // Sembunyikan tombol SKIP
        }
        isTyping = false;
        // Pastikan scroll di posisi paling bawah
        setTimeout(() => {
             if(messageTextArea && messageTextArea.parentElement) {
                 messageTextArea.parentElement.scrollTop = messageTextArea.parentElement.scrollHeight;
             }
        }, 50);
    }


    // --- Event Listener untuk Tombol SKIP ---
    if (skipButton) {
        skipButton.addEventListener('click', finishTyping);
    }

    // --- Membuat fungsi global agar bisa dipanggil dari main.js ---
    window.triggerMessageAnimation = startTypewriter;

}); // Akhir DOMContentLoaded