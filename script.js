/* =========================
   KALEM V2
   script.js
========================= */

let belgeler = JSON.parse(localStorage.getItem("kalemBelgeler")) || [];

function kaydet() {
    localStorage.setItem("kalemBelgeler", JSON.stringify(belgeler));
}

function belgeEkle() {

    const belgeAdi = document.getElementById("belgeAdi").value.trim();
    const kategori = document.getElementById("kategori").value;
    const durum = document.getElementById("durum").value;

    if (belgeAdi === "") {
        alert("Belge adı boş olamaz.");
        return;
    }

    const yeniBelge = {
        id: Date.now(),
        ad: belgeAdi,
        kategori: kategori,
        durum: durum
    };

    belgeler.push(yeniBelge);

    kaydet();

    document.getElementById("belgeAdi").value = "";

    listeyiGoster();
}

function listeyiGoster() {

    const liste = document.getElementById("belgeListesi");

    liste.innerHTML = "";

    belgeler.forEach((belge) => {

        liste.innerHTML += `
        <div class="belge">

            <h3>${belge.ad}</h3>

            <p>Kategori : ${belge.kategori}</p>

            <p>Durum : ${belge.durum}</p>

            <button onclick="duzenleBelge(${belge.id})">
            Düzenle
            </button>

            <button onclick="silBelge(${belge.id})">
            Sil
            </button>

        </div>
        `;

    });

    istatistikleriGuncelle();
}
