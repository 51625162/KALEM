// Tamamen Boş Veritabanı Seti (Sıfırdan veri eklemen için)
let evrakVeritabanı = [];
let evrakSayac = 0;

// Sistemi ve Tabloları Yenileme Fonksiyonu
function sistemiGuncelle() {
    const mainTable = document.getElementById('main-evrak-table');
    const dashTable = document.getElementById('dash-summary-table');
    const dosyaTable = document.getElementById('dosya-tablo-body');
    
    let bekleyen = 0;
    let mainRows = "";
    let dashRows = "";
    let dosyaRows = "";

    // Eğer hiç evrak yoksa kullanıcıya bilgi ver
    if (evrakVeritabanı.length === 0) {
        const bosSatir = `<tr><td colspan="6" style="text-align:center; color:#64748b;">Sistemde kayıtlı evrak bulunmamaktadır. Yeni evrak ekleyin.</td></tr>`;
        if(mainTable) mainTable.innerHTML = bosSatir;
        if(dashTable) dashTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b;">İşlem geçmişi boş.</td></tr>`;
        if(dosyaTable) dosyaTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b;">Arşivde dosya yok.</td></tr>`;
        
        if(document.getElementById('dash-total')) document.getElementById('dash-total').innerText = "0";
        if(document.getElementById('dash-bekleyen')) document.getElementById('dash-bekleyen').innerText = "0";
        return;
    }

    evrakVeritabanı.forEach((evrak) => {
        if(evrak.durum.includes("Bekleyen") || evrak.durum === "Beklemede") bekleyen++;
        
        let badgeClass = "badge badge-bekleyen";
        if(evrak.durum.includes("Tamamlanan") || evrak.durum === "Tamamlandı") {
            badgeClass = "badge badge-tamamlanan";
        }
        
        // Ana Evrak Yönetim Tablosu
        mainRows += `<tr>
            <td><strong>${evrak.no}</strong></td>
            <td>${evrak.ad}</td>
            <td>${evrak.tur}</td>
            <td>${evrak.tarih}</td>
            <td><span class="${badgeClass}">${evrak.durum}</span></td>
            <td class="action-icons">
                <i class="fa-solid fa-file-lines" title="Dosyayı Gör" onclick="dosyaOnizle('${evrak.no}')" style="cursor:pointer; margin-right:10px; color:#64748b;"></i>
                <i class="fa-solid fa-trash" title="Evrakı Sil" onclick="evrakSil('${evrak.no}')" style="cursor:pointer; color:#ef4444;"></i>
            </td>
        </tr>`;

        // Dashboard Özet Tablosu
        dashRows += `<tr>
            <td><strong>${evrak.no}</strong></td>
            <td>${evrak.ad}</td>
            <td>${evrak.tur}</td>
            <td>${evrak.tarih}</td>
            <td><span class="${badgeClass}">${evrak.durum}</span></td>
        </tr>`;

        // Dosya Arşiv Tablosu
        if(evrak.dosya) {
            const dosyaIkonu = evrak.dosya.endsWith('.pdf') ? 'fa-file-pdf text-danger' : 'fa-file-word text-primary';
            dosyaRows += `<tr>
                <td>${evrak.no}</td>
                <td><i class="fa-solid ${dosyaIkonu}"></i> ${evrak.dosya}</td>
                <td>${evrak.dosya.endsWith('.pdf') ? 'PDF Belgesi' : 'Word Dokümanı'}</td>
                <td>1.2 MB</td>
                <td><button class="btn btn-primary" style="padding:4px 10px; font-size:12px;" onclick="dosyaOnizle('${evrak.no}')">Görüntüle</button></td>
            </tr>`;
        }
    });

    if(mainTable) mainTable.innerHTML = mainRows;
    if(dashTable) dashTable.innerHTML = dashRows;
    if(dosyaTable) dosyaTable.innerHTML = dosyaRows;

    const totalEl = document.getElementById('dash-total');
    const bekleyenEl = document.getElementById('dash-bekleyen');
    if(totalEl) totalEl.innerText = evrakVeritabanı.length;
    if(bekleyenEl) bekleyenEl.innerText = bekleyen;
}

// Görünüm Değiştirici
function switchView(viewId, element) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active-view'));
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    
    const targetView = document.getElementById(viewId);
    if(targetView) targetView.classList.add('active-view');
    if(element) element.classList.add('active');
    
    sistemiGuncelle();
}

function toggleElement(id) {
    const el = document.getElementById(id);
    if(el) el.style.display = el.style.display === 'none' ? 'grid' : 'none';
}

// Tamamen senin formdan girdiğin veriyi kaydeden fonksiyon
function sistemeEvrakKaydet() {
    const ad = document.getElementById('form-ad').value.trim();
    const tur = document.getElementById('form-tur').value;
    const durum = document.getElementById('form-durum').value;
    const dosyaGirişi = document.getElementById('form-dosya');
    const bugun = new Date().toLocaleDateString('tr-TR');

    if (!ad) return alert("Lütfen evrak konusunu yazınız.");
    
    // Yüklenen dosya adını al veya varsayılan ata
    let secilenDosyaAdi = "ek_belge.pdf";
    if(dosyaGirişi && dosyaGirişi.files.length > 0) {
        secilenDosyaAdi = dosyaGirişi.files[0].name;
    }

    evrakSayac++;
    // Numaratörü dinamik yapıyoruz (EVR-0001, EVR-0002...)
    const evrakNo = "EVR-" + String(evrakSayac).padStart(4, '0');

    evrakVeritabanı.push({
        no: evrakNo, 
        ad: ad, 
        tur: tur, 
        tarih: bugun, 
        durum: durum === "Beklemede" ? "Bekleyen" : "Tamamlanan",
        dosya: secilenDosyaAdi, 
        dosyaIcerik: `${ad} konusuyla alakalı sisteme yüklediğiniz ${secilenDosyaAdi} isimli resmi evrak içeriği.`
    });

    // Formu temizle
    document.getElementById('form-ad').value = "";
    if(dosyaGirişi) dosyaGirişi.value = "";
    
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
    const modal = document.getElementById('onizleme-modal');
    if(evrak && modal) {
        document.getElementById('modal-baslik').innerText = `${evrak.no} Evrak İçerik Detayı`;
        document.getElementById('modal-icerik').innerText = evrak.dosyaIcerik;
        modal.style.display = 'flex';
    }
}

function modalKapat() { 
    const modal = document.getElementById('onizleme-modal');
    if(modal) modal.style.display = 'none'; 
}

function evrakFiltrele() {
    const terim = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('#main-evrak-table tr').forEach(row => {
        if(row.children.length > 1) {
            row.style.display = (row.children[0].innerText.toLowerCase().includes(terim) || row.children[1].innerText.toLowerCase().includes(terim)) ? "" : "none";
        }
    });
}

function tabloyuExceleAktar() {
    if(evrakVeritabanı.length === 0) return alert("Aktarılacak veri bulunamadı.");
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

window.onload = sistemiGuncelle;
