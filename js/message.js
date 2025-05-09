// File: js/message.js (dengan pesan baru untuk Nuringtyas)

document.addEventListener('DOMContentLoaded', () => {
    const messageTextArea = document.getElementById('message-text-area');
    const skipButton = document.getElementById('skip-button');

    // --- Teks Pesan Baru Anda ---
    const fullMessage = `Hai Nuringtyas,\n\nHappy 20th Birthday, Sweetie Pie! 💖\n\nHari ini aku pengen kamu ngerasain semua hal positif dan keajaiban yang cuma bisa didapetin kalo kamu ada di dunia ini. Semoga segala keinginanmu tercapai, cita-cita dan impian kamu bisa kamu wujudkan. Aku selalu bersyukur bisa ngeliat kamu jadi versi terbaik dari dirimu — yang kadang-kadang random banget, tapi juga selalu bikin aku tersenyum tanpa henti.\n\nMakasih udah jadi temen curhat, partner in crime, dan sumber inspirasi sehari-hari. Kamu nggak cuma hadir di hidupku, tapi kamu bikin hidupku lebih hidup. Cara kamu nyemangatin aku, dengerin keluhanku, sampai hal-hal kecil yang kamu lakuin — semuanya bikin aku jatuh cinta lagi dan lagi, setiap hari.\n\nSemoga di usia ke-20 ini, kamu makin kece, makin banyak momen bahagia, makin dikelilingi cinta yang tulus, dan makin dekat dengan versi terbaik dari dirimu. Kamu pantas dapetin semua kebahagiaan di dunia ini, karena kamu selalu berusaha jadi cahaya buat orang lain — termasuk aku.\n\nJangan lupa, kita bakal terus jalan bareng, ngejar mimpi, dan ngelewatin segala drama hidup dengan tawa. Nggak peduli seberapa ribet dunia ini, aku selalu milih kamu, dan akan terus milih kamu.\n\nI love you more than words can say. Happy birthday, sayangku. ❤️🎉`;

    let typewriterTimeout; // Variabel untuk menyimpan ID timeout
    let isTyping = false; // Status apakah sedang mengetik

    // --- Fungsi untuk Efek Typewriter ---
    function startTypewriter() {
        if (!messageTextArea) {
            console.error("Elemen area pesan (#message-text-area) tidak ditemukan.");
            return;
        }
        if (isTyping) return;

        messageTextArea.innerHTML = ''; // Kosongkan area teks
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
        if (messageTextArea) {
            // Mengganti \n\n (dua baris baru) jadi <br><p></p><br> untuk efek paragraf
            // Mengganti \n (satu baris baru) jadi <br>
            messageTextArea.innerHTML = fullMessage
                .replace(/\n\n/g, '<br><p style="margin-bottom: 0.7em;"></p><br>') // Spasi antar paragraf utama
                .replace(/\n/g, '<br>'); // Baris baru dalam paragraf
        }
        if (skipButton) {
            skipButton.style.display = 'none'; // Sembunyikan tombol SKIP
        }
        isTyping = false;
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