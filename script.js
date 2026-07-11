// Tarayıcı hafızasından verileri çek, eğer boşsa sıfır dizi başlat
let evrakVeritabanı = JSON.parse(localStorage.getItem('kalem_evraklar')) || [];
let evrakSayac = evrakVeritabanı.length > 0 ? Math.max(...evrakVeritabanı.map(e => parseInt(e.no.split('-')[1]))) : 0;

function hafizayaKaydet() {
    localStorage.setItem('kalem_evraklar', JSON.stringify(evrakVeritabanı));
}

// YAPAY ZEKA RESMİ BELGE ÜRETİCİ MOTORU
function yapayZekaBelgeUret(tur, konu) {
    const bugun = new Date().toLocaleDateString('tr-TR');
    let taslak = "";

    if (tur === "Müzekkere") {
        taslak = `T.C.\nADALET BAKANLIĞI\n\nSayı: E-${SayıUret()}\nKonu: ${konu}\n\nİLGİLİ MAKAMA\n\nSistemimiz üzerinden kaydı açılan "${konu}" hususu ile ilgili olarak; gerekli tahkikatın yapılarak neticeden ivedi olarak Kalemimize bilgi verilmesi hususunda gereği rica olunur.\n\n${bugun}\nYetkili Kullanıcı\n(İmza)`;
    } else if (tur === "Dilekçe") {
        taslak = `ADALET BAKANLIĞI YÜKSEK MAKAMINA\n\nBaşvuran: Yetkili Kullanıcı\nKonu: ${konu}\n\nTalebin Özeti: Yukarıda belirtilen "${konu}" konusu kapsamında, mevzuatın ilgili maddeleri uyarınca gerekli yasal işlemlerin başlatılmasını ve tarafıma yazılı olarak bilgi verilmesini saygılarımla arz ve talep ederim.\n\nAdres/İletişim: Sistem Kayıtlı Adresi\n\n${bugun}\nAd Soyad / İmza`;
    } else if (tur === "Genelge") {
        taslak = `T.C.\nADALET BAKANLIĞI\n\nGenelge No: 2026 / ${evrakSayac + 1}\nKonu: ${konu}\n\nMERKEZ VE TAŞRA TEŞKİLATINA\n\nYürütülen faaliyetlerin daha etkin ve mevzuata uygun şekilde sürdürülebilmesi amacıyla, "${konu}" başlığı altındaki kurallara titizlikle uyulması, aksaklığa meydan verilmemesi hususunda gereği önemle rica olunur.\n\n${bugun}\nBakan Adına\nYetkili Kullanıcı`;
    } else {
        // Varsayılan / Karar Metni
        taslak = `GEREĞİ DÜŞÜNÜLDÜ:\n\nKalem Projesi Otomasyonu üzerinden intikal eden "${konu}" konulu evrak ve tüm ekleri incelendi.\n\nKARAR:\nDosya kapsamı ve mevcut delil durumu dikkate alınarak, talebin resmi kayıtlara işlenmesine ve sürecin takibine oy birliği ile karar verildi.\n\n${bugun}`;
    }
    return taslak;
}

function SayıUret() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Sistemi ve Tabloları Yenileme Fonksiyonu
function sistemiGuncelle() {
    const mainTable = document.getElementById('main-evrak-table');
    const dashTable = document.getElementById('dash-summary-table');
    const dosyaTable = document.getElementById('dosya-tablo-body');
    
    let bekleyen = 0;
    let mainRows = "";
    let dashRows = "";
    let dosyaRows = "";

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
        if(evrak.durum === "Bekleyen" || evrak.durum === "Beklemede") bekleyen++;
        
        let badgeClass = evrak.durum === "Tamamlanan" ? "badge badge-tamamlanan" : "badge badge-bekleyen";
        
        mainRows += `<tr>
            <td><strong>${evrak.no}</strong></td>
            <td>${evrak.ad}</td>
            <td>${evrak.tur}</td>
            <td>${evrak.tarih}</td>
            <td><span class="${badgeClass}">${evrak.durum}</span></td>
            <td class="action-icons">
                <i class="fa-solid fa-file-lines" title="Resmi Belgeyi Gör / Yazdır" onclick="dosyaOnizle('${evrak.no}')" style="cursor:pointer; margin-right:10px; color:#0284c7;"></i>
                <i class="fa-solid fa-trash" title="Evrakı Sil" onclick="evrakSil('${evrak.no}')" style="cursor:pointer; color:#ef4444;"></i>
            </td>
        </tr>`;

        dashRows += `<tr>
            <td><strong>${evrak.no}</strong></td>
            <td>${evrak.ad}</td>
            <td>${evrak.tur}</td>
            <td>${evrak.tarih}</td>
            <td><span class="${badgeClass}">${evrak.durum}</span></td>
        </tr>`;

        if(evrak.dosya) {
            dosyaRows += `<tr>
                <td>${evrak.no}</td>
                <td><i class="fa-solid fa-file-word text-primary"></i> ${evrak.dosya}</td>
                <td>Resmi Şablon</td>
                <td>Hazır</td>
                <td><button class="btn btn-primary" style="padding:4px 10px; font-size:12px;" onclick="dosyaOnizle('${evrak.no}')">Görüntüle</button></td>
            </tr>`;
        }
    });

    if(mainTable) mainTable.innerHTML = mainRows;
    if(dashTable) dashTable.innerHTML = dashRows;
    if(dosyaTable) dosyaTable.innerHTML = dosyaRows;

    if(document.getElementById('dash-total')) document.getElementById('dash-total').innerText = evrakVeritabanı.length;
    if(document.getElementById('dash-bekleyen')) document.getElementById('dash-bekleyen').innerText = bekleyen;
}

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

function sistemeEvrakKaydet() {
    const ad = document.getElementById('form-ad').value.trim();
    const tur = document.getElementById('form-tur').value;
    const durum = document.getElementById('form-durum').value;
    const bugun = new Date().toLocaleDateString('tr-TR');

    if (!ad) return alert("Lütfen evrak konusunu yazınız.");
    
    evrakSayac++;
    const evrakNo = "EVR-" + String(evrakSayac).padStart(4, '0');

    // Yapay Zekadan şablon yazıyı türetiyoruz
    const uretilenIcerik = yapayZekaBelgeUret(tur, ad);

    evrakVeritabanı.push({
        no: evrakNo, 
        ad: ad, 
        tur: tur, 
        tarih: bugun, 
        durum: durum === "Beklemede" ? "Bekleyen" : "Tamamlanan",
        dosya: `${tur.toLowerCase()}_taslak.doc`, 
        dosyaIcerik: uretilenIcerik
    });

    document.getElementById('form-ad').value = "";
    toggleElement('evrak-ekleme-formu');
    hafizayaKaydet();
    sistemiGuncelle();
}

function evrakSil(no) {
    if(confirm('Seçilen resmi evrakı silmek istediğinize emin misiniz?')) {
        evrakVeritabanı = evrakVeritabanı.filter(e => e.no !== no);
        hafizayaKaydet();
        sistemiGuncelle();
    }
}

function dosyaOnizle(no) {
    const evrak = evrakVeritabanı.find(e => e.no === no);
    const modal = document.getElementById('onizleme-modal');
    if(evrak && modal) {
        document.getElementById('modal-baslik').innerText = `${evrak.no} - Resmi Belge Metni (${evrak.tur})`;
        // Satır atlamalarının düzgün görünmesi için white-space stilini ekliyoruz
        const icerikAlani = document.getElementById('modal-icerik');
        icerikAlani.innerText = evrak.dosyaIcerik;
        icerikAlani.style.whiteSpace = "pre-wrap";
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
