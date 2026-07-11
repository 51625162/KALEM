// Örnek Veritabanı Seti
let evrakVeritabanı = [
    { no: "EVR-0001", ad: "Bakanlık Muhabere Dilekçesi", tur: "Dilekçe", tarih: "10.07.2026", durum: "Tamamlandı", dosya: "muhabere_ek.pdf", dosyaIcerik: "T.C. ADALET BAKANLIĞI Muhabere Evrakı ekidir. Evrak arşiv kaydı tamamlanmıştır." },
    { no: "EVR-0002", ad: "Personel Görev Süre Uzatımı", tur: "Genelge", tarih: "11.07.2026", durum: "Beklemede", dosya: "sure_uzatimi.docx", dosyaIcerik: "İlgili kalemde çalışan personelin görev süresinin 6 ay süreyle uzatılması kararı." },
    { no: "EVR-0003", ad: "Ödenek Planlama Müzekkeresi", tur: "Müzekkere", tarih: "12.07.2026", durum: "Beklemede", dosya: "odenek_plani.pdf", dosyaIcerik: "Kalem odası donanım ve lojistik giderleri 3. çeyrek bütçe cetvelidir." }
];
let evrakSayac = 3;

// Arayüz Görünüm Değiştirici
function switchView(viewId, element) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active-view'));
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    document.getElementById(viewId).classList.add('active-view');
    element.classList.add('active');
    sistemiGuncelle();
}

function toggleElement(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'none' ? 'grid' : 'none';
}

// Sistemi ve Tabloları Yenileme Fonksiyonu
function sistemiGuncelle() {
    const mainTable = document.getElementById('main-evrak-table');
    const dashTable = document.getElementById('dash-summary-table');
    const dosyaTable = document.getElementById('dosya-tablo-body');
    
    if(!mainTable || !dashTable || !dosyaTable) return;
    
    mainTable.innerHTML = ""; dashTable.innerHTML = ""; dosyaTable.innerHTML = "";
    let bekleyen = 0;

    evrakVeritabanı.forEach((evrak) => {
        if(evrak.durum === "Beklemede") bekleyen++;
        const badgeClass = `badge badge-${evrak.durum.toLowerCase().replace('ə','e')}`;
        
        mainTable.innerHTML += `<tr>
            <td><strong>${evrak.no}</strong></td><td>${evrak.ad}</td><td>${evrak.tur}</td><td>${evrak.tarih}</td>
            <td><span class="${badgeClass}">${evrak.durum}</span></td>
            <td class="action-icons">
                <i class="fa-solid fa-file-lines" title="Dosyayı Gör" onclick="dosyaOnizle('${evrak.no}')"></i>
                <i class="fa-solid fa-trash" style="color:var(--danger)" onclick="evrakSil('${evrak.no}')"></i>
            </td>
        </tr>`;

        dashTable.insertAdjacentHTML('afterbegin', `<tr><td><strong>${evrak.no}</strong></td><td>${evrak.ad}</td><td>${evrak.tur}</td><td>${evrak.tarih}</td><td><span class="${badgeClass}">${evrak.durum}</span></td></tr>`);

        if(evrak.dosya) {
            const dosyaIkonu = evrak.dosya.endsWith('.pdf') ? 'fa-file-pdf text-danger' : 'fa-file-word text-primary';
            dosyaTable.innerHTML += `<tr>
                <td>${evrak.no}</td><td><i class="fa-solid ${dosyaIkonu}"></i> ${evrak.dosya}</td>
                <td>${evrak.dosya.endsWith('.pdf') ? 'PDF Belgesi' : 'Word Dokümanı'}</td><td>1.2 MB</td>
                <td><button class="btn btn-primary" style="padding:4px 10px; font-size:12px;" onclick="dosyaOnizle('${evrak.no}')">Görüntüle</button></td>
            </tr>`;
        }
    });

    document.getElementById('dash-total').innerText = evrakVeritabanı.length;
    document.getElementById('dash-bekleyen').innerText = bekleyen;
}

function sistemeEvrakKaydet() {
    const ad = document.getElementById('form-ad').value.trim();
    const tur = document.getElementById('form-tur').value;
    const durum = document.getElementById('form-durum').value;
    const bugun = new Date().toLocaleDateString('tr-TR');

    if (!ad) return alert("Lütfen evrak konusunu yazınız.");
    
    evrakSayac++;
    evrakVeritabanı.push({
        no: `EVR-000${evrakSayac}`, ad: ad, tur: tur, tarih: bugun, durum: durum,
        dosya: "yeni_belge.pdf", dosyaIcerik: `${ad} konusuyla alakalı sisteme yeni eklenen evrak ekidir.`
    });

    document.getElementById('form-ad').value = "";
    toggleElement('evrak-ekleme-formu');
    sistemiGuncelle();
}

function evrakSil(no) {
    if(confirm('Seçilen resmi evrakı silmek istediğinize emin misiniz?')) {
        evrakVeritabanı = evrakVeritabanı.filter(e => e.no !== no);
        sistemiGuncelle();
    }
}

function dosyaOnizle(no) {
    const evrak = evrakVeritabanı.find(e => e.no === no);
    if(evrak) {
        document.getElementById('modal-baslik').innerText = `${evrak.no} Evrak İçerik Detayı`;
        document.getElementById('modal-icerik').innerText = evrak.dosyaIcerik;
        document.getElementById('onizleme-modal').style.display = 'flex';
    }
}

function modalKapat() { document.getElementById('onizleme-modal').style.display = 'none'; }

function evrakFiltrele() {
    const terim = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('#main-evrak-table tr').forEach(row => {
        row.style.display = (row.children[0].innerText.toLowerCase().includes(terim) || row.children[1].innerText.toLowerCase().includes(terim)) ? "" : "none";
    });
}

function tabloyuExceleAktar() {
    let csv = 'Evrak No,Evrak Adi,Tur,Tarih,Durum\n';
    evrakVeritabanı.forEach(e => csv += `${e.no},${e.ad},${e.tur},${e.tarih},${e.durum}\n`);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "kalem_evrak_listesi.csv");
    link.click();
}

function tabloyuYazdir() {
    const printContent = document.getElementById('yazdirilabilir-tablo').outerHTML;
    const win = window.open('', '', 'height=700,width=900');
    win.document.write('<html><head><style>table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:10px; font-family:sans-serif;}</style></head><body><h2>KALEM PROJESİ RESMİ EVRAK ÇIKTISI</h2>' + printContent + '</body></html>');
    win.document.close();
    win.print();
}
