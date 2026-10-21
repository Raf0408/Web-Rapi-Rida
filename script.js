
/* =========================================
   PENGATURAN UNDANGAN
   ========================================= */

// Tanggal dan waktu acara
const WEDDING_DATE = new Date("2027-08-04T09:00:00+07:00");

// Nomor WhatsApp tujuan RSVP (format internasional tanpa +)
const WHATSAPP_NUMBER = "6281234567890";


/* =========================================
   AMBIL ELEMEN HTML
   ========================================= */

const openBtn = document.getElementById("openBtn");
const cover = document.getElementById("cover");
const musik = document.getElementById("backgroundMusic");


/* =========================================
   NAMA TAMU DARI LINK
   Contoh: index.html?to=Budi+Santoso
   ========================================= */

const params = new URLSearchParams(window.location.search);
const guest = params.get("to");

if (guest) {
    const guestName = document.getElementById("guestName");
    const namaInput = document.getElementById("nama");

    if (guestName) {
        guestName.textContent = guest;
    }

    if (namaInput) {
        namaInput.value = guest;
    }
}


/* =========================================
   BUKA UNDANGAN DAN PUTAR MUSIK
   ========================================= */

if (openBtn && cover) {
    openBtn.addEventListener("click", async () => {
        // Cegah tombol ditekan berkali-kali
        if (document.body.classList.contains("opened")) {
            return;
        }

        // Buka halaman undangan
        cover.classList.add("open");

        // Aktifkan tampilan latar foto dari CSS
        document.body.classList.remove("locked");
        document.body.classList.add("opened");

        // Mulai dari bagian atas halaman
        window.scrollTo({
            top: 0,
            behavior: "auto"
        });

        // Putar musik setelah klik pengguna
        if (musik) {
            try {
                musik.volume = 0.7;

                // Mulai dari awal jika musik belum berjalan
                if (musik.paused) {
                    await musik.play();
                }
            } catch (error) {
                console.error(
                    "Musik tidak dapat diputar. Periksa file musik.mp3:",
                    error
                );
            }
        }
    });
}


/* =========================================
   HITUNG MUNDUR MENUJU ACARA
   Pastikan HTML memiliki elemen:
   id="d", id="h", id="m", id="s"
   ========================================= */

const pad = (angka) => String(angka).padStart(2, "0");

function tick() {
    const sekarang = new Date();
    const selisih = Math.max(0, WEDDING_DATE.getTime() - sekarang.getTime());

    const hari = Math.floor(selisih / 86400000);
    const jam = Math.floor(selisih / 3600000) % 24;
    const menit = Math.floor(selisih / 60000) % 60;
    const detik = Math.floor(selisih / 1000) % 60;

    const d = document.getElementById("d");
    const h = document.getElementById("h");
    const m = document.getElementById("m");
    const s = document.getElementById("s");

    if (d) d.textContent = pad(hari);
    if (h) h.textContent = pad(jam);
    if (m) m.textContent = pad(menit);
    if (s) s.textContent = pad(detik);
}

tick();
setInterval(tick, 1000);


/* =========================================
   SALIN NOMOR REKENING
   Pastikan HTML memiliki id="copyBtn"
   dan id="rek"
   ========================================= */

const copyBtn = document.getElementById("copyBtn");

if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
        const rekElement = document.getElementById("rek");

        if (!rekElement) {
            return;
        }

        const nomorRekening = rekElement.textContent.trim();
        const teksAsli = copyBtn.textContent;

        try {
            await navigator.clipboard.writeText(nomorRekening);
            copyBtn.textContent = "Nomor tersalin!";
        } catch (error) {
            // Fallback jika clipboard tidak tersedia
            try {
                const area = document.createElement("textarea");
                area.value = nomorRekening;
                area.style.position = "fixed";
                area.style.opacity = "0";

                document.body.appendChild(area);
                area.select();

                const berhasil = document.execCommand("copy");
                area.remove();

                copyBtn.textContent = berhasil
                    ? "Nomor tersalin!"
                    : "Silakan salin manual";
            } catch {
                copyBtn.textContent = "Silakan salin manual";
            }
        }

        setTimeout(() => {
            copyBtn.textContent = teksAsli;
        }, 2000);
    });
}


/* =========================================
   RSVP MELALUI WHATSAPP
   Pastikan form memiliki id="rsvpForm"
   ========================================= */

const rsvpForm = document.getElementById("rsvpForm");

if (rsvpForm) {
    rsvpForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nama = document.getElementById("nama")?.value.trim() || "";
        const hadir = document.getElementById("hadir")?.value || "";
        const jumlah = document.getElementById("jumlah")?.value || "";
        const ucapan = document.getElementById("ucapan")?.value.trim() || "";

        if (!nama || !hadir) {
            alert("Mohon isi nama dan konfirmasi kehadiran.");
            return;
        }

        let pesan =
            `Halo, saya ${nama}.\n` +
            `Konfirmasi kehadiran: ${hadir}`;

        if (hadir === "Hadir" && jumlah) {
            pesan += ` (${jumlah} orang)`;
        }

        if (ucapan) {
            pesan += `\nUcapan: ${ucapan}`;
        }

        const urlWhatsApp =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pesan)}`;

        window.open(urlWhatsApp, "_blank", "noopener,noreferrer");
    });
}
