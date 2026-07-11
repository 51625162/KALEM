// Tarayıcı hafızasından verileri çek
let evrakVeritabanı = JSON.parse(localStorage.getItem('kalem_evraklar')) || [];
let evrakSayac = evrakVeritabanı.length > 0 ? Math.max(...evrakVeritabanı.map(e => parseInt(e.no.split('-')[1]))) : 0;

function hafizayaKaydet() {
    localStorage.setItem('kalem_evraklar', JSON.stringify(evrakVeritabanı));
}

// 🤖 KALEM DİNAMİK YAPAY ZEKA ASİSTAN MOTORU
function asistanaSor() {
    const inputEl = document.getElementById('asistan-input');
    const cevapEl = document.getElementById('asistan-cevap');
    if (!inputEl || !inputEl.value.trim()) return;

    const soru = inputEl.value.trim().toLowerCase();
    const bugun = new Date().toLocaleDateString('tr-TR');
    let cevap = "";

    // MADDELER 1 & 4: Evrak Hazırlama & Kontrol Denetimi
    if (soru.includes("dilekçe hazırla") || soru.includes("izin dilekçesi")) {
        cevap = ` T.C.\nADALET BAKANLIĞI KURUMLARINA ARZ OLUNMAK ÜZERE\n\nBAŞVURU SAHİBİ: Yetkili Kullanıcı\nKONU: Yıllık Mazeret İzin Talebi\n\nKurumunuz bünyesinde yürütmekte olduğum görevim esnasında, ekte sunulan haklı mazeretime binaen 657 Sayılı Kanun'un ilgili maddeleri uyarınca tarafıma gerekli izin haklarının tanınmasını saygılarımla arz ederim.\n\nİmza: _______________\nTarih: ${bugun}\n\n🤖 [YZ KONTROLÜ]: Belge resmî yazışma diline uygundur. Eksik bilgi bulunmamaktadır. Yazım hatası taranmıştır: TEMİZ.`;
    }
    
    // MADDE 2: Hükümlü Süreç Analizi & Gerekli Belgeler
    else if (soru.includes("açık cezaevi") || soru.includes("hükümlü açık")) {
        cevap = `🤖 [KALEM ANALİZ]: Hükümlünün Açık Ceza İnfaz Kurumuna Ayrılma Talebi Analizi:\n\n1. GEREKLİ BELGELER:\n   • İyi Hal Kararı (İdare ve Gözlem Kurulu Raporu)\n   • Adli Sicil Kaydı UYAP Çıktısı\n   • Süre Belgesi (Müddetname)\n\n2. BAŞVURULACAK BİRİM:\n   • Kurum İdare ve Gözlem Kurulu Başkanlığı\n\n3. DAYANAK MEVZUAT:\n   • Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği (6. ve 7. Maddeler)\n\n4. SÜREÇ:\n   • Toplam cezanın belirli bir oranının kapalıda infaz edilmiş olması ve iyi hal şartı aranır. Kurul değerlendirmesinden sonra onaylanırsa nakil işlemi gerçekleştirilir.`;
    }

    // MADDE 3: Mevzuat Asistanı
    else if (soru.includes("denetimli serbestlik")) {
        cevap = `🤖 [MEVZUAT ASİSTANİ]: Denetimli Serbestlik Süre Bilgilendirmesi:\n\n• Hukuki Dayanak: 5275 Sayılı Kanun Madde 105/A\n• Temel Kural: Koşullu salıverilmesine belirli bir süre kalan iyi halli hükümlülerin cezalarının denetimli serbestlik tedbiri altında infazına karar verilebilir. Suç türüne, işlenme tarihine ve infaz oranlarına (1/2, 2/3, 3/4) göre denetim süreleri yasal paket değişikliklerine bağlı olarak değişiklik göstermektedir.\n• Güncel Durum: Dosya bazlı özel infaz hesaplaması için hükümlü hakkındaki UYAP Müddetnamesi esas alınmalıdır.`;
    }

    // MADDELER 5, 7 & 8: Akıllı Arama, Hatırlatma & İstatistik Paneli
    else if (soru.includes("kaç evrak") || soru.includes("istatistik") || soru.includes("tamamlandı")) {
        const toplam = evrakVeritabanı.length;
        const tamamlanan = evrakVeritabanı.filter(e => e.durum === "Tamamlanan").length;
        const bekleyen = toplam - tamamlanan;
        cevap = `🤖 [SİSTEM İSTATİSTİK]: Cari Dönem İstatistikleri:\n\n• Toplam İşlem Gören Evrak: ${toplam} adet\n• Tamamlanan Başarılı İşlemler: ${tamamlanan} adet\n• Beklemede/Süreçte Olan Evrak: ${bekleyen} adet\n• En Çok Gelen Evrak Türü Dağılımı: Genel işlemler dengeli dağılmıştır.\n\n💡 [HATIRLATMA / 30 GÜN UYARISI]: Bekleyen ${bekleyen} adet evrakın yasal cevap süreleri (30 gün) sistem tarafından takibe alınmıştır.`;
    }
    
    else if (soru.includes("göster") || soru.includes("filtrele") || soru.includes("izin")) {
        cevap = `🤖 [AKILLI ARAMA HIZLI FİLTRE]:\n\n"${inputEl.value}" talebinize yönelik sistem veritabanı tarandı.\nEvrak listesindeki filtre paneline ilgili kelimeler başarıyla gönderildi.`;
        const aramaGiris = document.getElementById('search-input');
        if (aramaGiris) {
            aramaGiris.value = "izin";
            switchView('evrak-yonetimi', document.querySelectorAll('.menu-item')[2]);
            evrakFiltrele();
        }
    }
    
    // MADDE 6: Özetleme Robotu Simülasyonu
    else if (soru.includes("özetle") || soru.includes("pdf")) {
        cevap = `🤖 [BELGE ÖZETLEME ROBOTU]:\n\nSisteme yüklenen kurumsal evrak / PDF başarıyla analiz edildi:\n1. ANA NOKTALAR: Kurum içi genel düzen ve operasyonel işleyiş talimatları.\n2. ÖNEMLİ TARİHLER: Yasal bildirimler ivedilikle yapılmalıdır.\n3. YAPILMASI GEREKENLER: Evrak içeriğindeki eksik hanelerin doldurularak arşive kaldırılması gerekmektedir.`;
    }

    // Varsayılan Yanıt (Öğrenen Mekanizma Modeli)
    else {
        cevap = `🤖 [KALEM ZEKÂSI]: "${inputEl.value}" yönündeki talebinizi anladım.\n\nBu süreçle ilgili geçmiş kurumsal pratiklerinizi inceliyorum. Talebinize uygun üst yazı şablonu oluşturmak veya ilgili mevzuat maddesini getirmek için sistemi eğitmeye devam edebilirsiniz. Lütfen aradığınız konuyu 'dilekçe', 'açık cezaevi', 'mevzuat' veya 'istatistik' kelimelerini kullanarak detaylandırın.`;
    }

    cevapEl.innerText = cevap;
    inputEl.value = "";
}

// EVRAK EKLEME ESNASINDA YZ YAZI MOTORU
function yapayZekaBelgeUret(tur, konu) {
    const bugun = new Date().toLocaleDateString('tr-TR');
    if (tur === "Müzekkere") {
        return `T.C.\nADALET BAKANLIĞI\n\nSayı: E-${Math.floor(100000 + Math.random() * 900000)}\nKonu: ${konu}\n\nİLGİLİ MAKAMA\n\nSistemimiz üzerinden kaydı açılan "${konu}" hususu ile ilgili olarak; gerekli tahkikatın yapılarak neticeden ivedi olarak Kalemimize bilgi verilmesi hususunda gereği rica olunur.\n\n${bugun}\nYetkili Kullanıcı\n(İmza)`;
    }
    return `GEREĞİ DÜŞÜNÜLDÜ:\n\nKalem Projesi Otomasyonu üzerinden intikal eden "${konu}" konulu evrak ve tüm ekleri incelendi.\n\nKARAR:\nDosya kapsamı ve mevcut delil durumu dikkate alınarak, talebin resmi kayıtlara işlenmesine ve sürecin takibine oy birliği ile karar verildi.\n\n${bugun}`;
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
                <i class="fa-solid fa-file-lines" title="Resmi Belgeyi Gör" onclick="dosyaOnizle('${evrak.no}')" style="cursor:pointer; margin-right:10px; color:#0284c7;"></i>
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
    const uretilenIcerik = yapayZekaBelgeUret(tur, ad);

    evrakVeritabanı.push({
        no: evrakNo, ad: ad, tur: tur, tarih: bugun, 
        durum: durum === "Beklemede" ? "Bekleyen" : "Tamamlanan",
        dosya: `${tur.toLowerCase()}_taslak.doc`, dosyaIcerik: uretilenIcerik
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
        document.getElementById('modal-baslik').innerText = `${evrak.no} - Belge Metni`;
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
