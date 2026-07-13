/* =========================================================================
   KALEM - CTE MEVZUAT & ŞABLON VERİTABANI
   =========================================================================
   ÖNEMLİ / DİKKAT:
   Bu dosyadaki MEVZUAT kayıtları başlangıç/örnek niteliğindedir. Bir kısmı
   web araması ile doğrulanmıştır (kaynak alanına bakınız) ama zaman içinde
   madde numaraları, fıkralar veya yönetmelik metinleri DEĞİŞEBİLİR.
   Resmi bir belgede "hukuki dayanak" olarak kullanmadan önce mutlaka
   mevzuat.gov.tr / Resmi Gazete üzerinden GÜNCEL metinle karşılaştırın.
   Bu sistem hukuki danışmanlık vermez, yalnızca arama/hatırlatma amaçlıdır.
   ========================================================================= */

const LEGAL_DB_VERSION = "2026-07-13";

/* -------------------- 1) MEVZUAT VERİTABANI -------------------- */
// tur: 'kanun' | 'yonetmelik' | 'tuzuk' | 'genelge'
const MEVZUAT_DB = [
  {
    id: "kanun-5275-42",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 42",
    baslik: "Haberleşme veya iletişim araçlarından yoksun bırakma / disiplin cezaları",
    ozet: "Hükümlünün belirli disiplin cezasını gerektiren eylemleri sayılır; bu eylemlerden biri, kurum idaresine bildirilen telefon numarası dışında ya da teknik müdahale ile başka hatta yönlendirme yaparak görüşme hakkı olmayan kişilerle görüşmektir (f bendi). Bu eylem için 1 aydan 3 aya kadar haberleşme ve iletişim araçlarından yoksun bırakma cezası öngörülür.",
    ilgiliFikra: "42/2-f",
    keywords: ["telefon", "disiplin", "haberleşme", "iletişim", "yoksun bırakma", "yönlendirme", "izinsiz görüşme", "ceza"],
    kaynakUrl: "https://www.lexpera.com.tr/mevzuat/kanunlar/ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun-5275",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-66",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 66",
    baslik: "Telefonla haberleşme hakkı",
    ozet: "Kapalı ceza infaz kurumlarındaki hükümlüler, yönetmelikte belirlenen esas ve usullere göre idarenin kontrolündeki ücretli telefonlarla görüşme yapabilir; görüşmeler idarece dinlenir ve kayıt altına alınır. Açık kurum ve çocuk eğitimevlerinde hükümlüler serbestçe görüşebilir. Hükümlüler kurumda cep telefonu vb. iletişim araçları bulunduramaz ve kullanamaz.",
    keywords: ["telefon", "haberleşme", "görüşme hakkı", "açık kurum", "kapalı kurum", "cep telefonu"],
    kaynakUrl: "https://www.lexpera.com.tr/mevzuat/kanunlar/ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun-5275",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-83",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 83",
    baslik: "Hükümlüyü ziyaret",
    ozet: "Hükümlü; belgelendirilmesi koşuluyla eşi, üçüncü dereceye kadar kan ve kayın hısımları ile vasisi veya kayyımı tarafından haftada bir kez, ayrıca kabullerinde bildirdiği en fazla üç kişi tarafından yarım saatten az, bir saatten fazla olmamak üzere çalışma saatleri içinde ziyaret edilebilir. Ziyaretin kapalı/açık şekli ve şartları yönetmelikle düzenlenir.",
    keywords: ["ziyaret", "ziyaretçi", "görüş", "açık görüş", "kapalı görüş", "hısım"],
    kaynakUrl: "https://karar.memurlar.net/anayasa/detay/default.aspx?primarykey=01ad53c4-609e-ed11-8119-a0369f7d1484",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "yonetmelik-cik-74",
    tur: "yonetmelik",
    kaynak: "Ceza İnfaz Kurumlarının Yönetimi ile Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Yönetmelik",
    madde: "Madde 74",
    baslik: "Telefonla görüşme usul ve esasları",
    ozet: "Kapalı kurumlarda bulunan hükümlüler, belgelendirmeleri koşuluyla eşi, dördüncü dereceye kadar kan ve kayın hısımları ve vasisi ile telefon görüşmesi yapabilir. Görüşme hakkının kullanımı 'Telefon Görüşme Formu' doldurulmasına bağlıdır; ücret hükümlü tarafından karşılanır.",
    keywords: ["telefon", "görüşme formu", "hısım", "usul", "esas"],
    kaynakUrl: "https://izmirkkcik.adalet.gov.tr/telefon-gorus-yonetmeligi",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "placeholder-firar",
    tur: "kanun",
    kaynak: "[DOLDURULMADI — kendi kaynağınla doğrula]",
    madde: "—",
    baslik: "Firar (örnek boş kayıt)",
    ozet: "Bu kayıt bir yer tutucudur. Firar ile ilgili doğru madde/yönetmelik referansını mevzuat.gov.tr üzerinden bulup buraya ekleyin.",
    keywords: ["firar", "kaçma"],
    kaynakUrl: "",
    dogrulanma: "DOĞRULANMADI"
  },
  {
    id: "placeholder-arama",
    tur: "yonetmelik",
    kaynak: "[DOLDURULMADI — kendi kaynağınla doğrula]",
    madde: "—",
    baslik: "Arama işlemleri (örnek boş kayıt)",
    ozet: "Bu kayıt bir yer tutucudur. Oda/üst araması ile ilgili doğru madde referansını ekleyin.",
    keywords: ["arama", "üst araması", "oda araması"],
    kaynakUrl: "",
    dogrulanma: "DOĞRULANMADI"
  }
];

/* -------------------- 2) ŞABLON KÜTÜPHANESİ -------------------- */
// Bunlar resmi yazışma FORMATLARIdır (boilerplate) — hukuki içerik değil,
// bu yüzden güvenle kullanılabilir. {{alan}} yer tutucuları wizard ile doldurulur.
const TEMPLATES_DB = [
  {
    id: "tpl-olay-tutanagi",
    title: "Olay Tutanağı",
    category: "Tutanak",
    keywords: ["olay", "tutanak", "vaka"],
    fields: [
      { key: "tarih", label: "Olay Tarihi", type: "date" },
      { key: "saat", label: "Olay Saati", type: "text" },
      { key: "yer", label: "Olay Yeri", type: "text" },
      { key: "taraflar", label: "Olayda Bulunanlar", type: "textarea" },
      { key: "aciklama", label: "Olayın Tarifi", type: "textarea" },
      { key: "deliller", label: "Deliller / Kamera Kaydı", type: "textarea" },
      { key: "tutanakEden", label: "Tutanağı Düzenleyen Personel", type: "text" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
OLAY TUTANAĞI

Tarih: {{tarih}}          Saat: {{saat}}
Olay Yeri: {{yer}}

Olayda Bulunanlar:
{{taraflar}}

Olayın Tarifi:
{{aciklama}}

Deliller / Kamera Kaydı:
{{deliller}}

İşbu tutanak, olayın tarafımızca tespiti üzerine düzenlenerek imza altına alınmıştır.

Tutanağı Düzenleyen: {{tutanakEden}}
İmza: ____________________`
  },
  {
    id: "tpl-arama-tutanagi",
    title: "Arama Tutanağı",
    category: "Tutanak",
    keywords: ["arama", "üst araması", "oda araması", "tutanak"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "saat", label: "Saat", type: "text" },
      { key: "aranan", label: "Araması Yapılan Kişi/Yer", type: "text" },
      { key: "aramaTuru", label: "Arama Türü (üst/oda/genel)", type: "text" },
      { key: "bulgular", label: "Bulunan Eşya / Bulgu", type: "textarea" },
      { key: "gorevliler", label: "Aramayı Yapan Görevliler", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
ARAMA TUTANAĞI

Tarih: {{tarih}}          Saat: {{saat}}
Arama Türü: {{aramaTuru}}
Araması Yapılan: {{aranan}}

Bulunan Eşya / Bulgu:
{{bulgular}}

Aramayı Yapan Görevliler:
{{gorevliler}}

İşbu tutanak arama işleminin bitiminde düzenlenmiş olup taraflarca imza altına alınmıştır.
İmza: ____________________`
  },
  {
    id: "tpl-teslim-tutanagi",
    title: "Teslim Tutanağı",
    category: "Tutanak",
    keywords: ["teslim", "eşya", "emanet", "tutanak"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "teslimEden", label: "Teslim Eden", type: "text" },
      { key: "teslimAlan", label: "Teslim Alan", type: "text" },
      { key: "esyaListesi", label: "Teslim Edilen Eşya Listesi", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
TESLİM TUTANAĞI

Tarih: {{tarih}}
Teslim Eden: {{teslimEden}}
Teslim Alan: {{teslimAlan}}

Teslim Edilen Eşya Listesi:
{{esyaListesi}}

İşbu tutanak taraflarca imza altına alınmıştır.
Teslim Eden İmza: ____________       Teslim Alan İmza: ____________`
  },
  {
    id: "tpl-sayim-tutanagi",
    title: "Sayım Tutanağı",
    category: "Tutanak",
    keywords: ["sayım", "tutanak", "mevcut"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "saat", label: "Saat", type: "text" },
      { key: "koguş", label: "Koğuş / Bölüm", type: "text" },
      { key: "mevcutSayi", label: "Mevcut Sayısı", type: "text" },
      { key: "not", label: "Açıklama / Uyuşmazlık Notu", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
SAYIM TUTANAĞI

Tarih: {{tarih}}          Saat: {{saat}}
Koğuş / Bölüm: {{koguş}}
Mevcut Sayısı: {{mevcutSayi}}

Açıklama:
{{not}}

Sayımı Yapan Görevli İmza: ____________________`
  },
  {
    id: "tpl-disiplin-karari",
    title: "Disiplin Kurulu Kararı",
    category: "Karar",
    keywords: ["disiplin", "karar", "ceza", "kurul"],
    fields: [
      { key: "kararNo", label: "Karar No", type: "text" },
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "eylem", label: "Disiplin Cezasını Gerektiren Eylem", type: "textarea" },
      { key: "dayanak", label: "Hukuki Dayanak (Kanun/Yönetmelik Maddesi)", type: "textarea" },
      { key: "verilenCeza", label: "Verilen Ceza ve Süresi", type: "text" },
      { key: "gerekce", label: "Gerekçe", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
DİSİPLİN KURULU KARARI

Karar No: {{kararNo}}          Tarih: {{tarih}}
Hakkında Karar Verilen: {{hukumluAdi}}

Disiplin Cezasını Gerektiren Eylem:
{{eylem}}

Hukuki Dayanak:
{{dayanak}}

Gerekçe:
{{gerekce}}

SONUÇ / KARAR:
Yukarıda açıklanan nedenlerle {{hukumluAdi}} hakkında {{verilenCeza}} uygulanmasına, kararın ilgiliye tebliğine, tebliğ tarihinden itibaren yasal itiraz süresi bulunduğunun hatırlatılmasına oy birliği/çokluğu ile karar verilmiştir.

Disiplin Kurulu Üyeleri İmza: ____________________`
  },
  {
    id: "tpl-savunma-istem",
    title: "Savunma İstem Yazısı",
    category: "Yazı",
    keywords: ["savunma", "istem", "yazı"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "isnatEdilenEylem", label: "İsnat Edilen Eylem", type: "textarea" },
      { key: "sure", label: "Savunma İçin Verilen Süre", type: "text" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
SAVUNMA İSTEM YAZISI

Tarih: {{tarih}}
Sayın: {{hukumluAdi}}

Aşağıda belirtilen eylem nedeniyle hakkınızda disiplin işlemi başlatılmış olup, yazılı savunmanızın {{sure}} içinde tarafımıza sunulması istenmektedir. Süresi içinde savunma verilmemesi halinde savunma hakkından vazgeçmiş sayılacağınız hususu ihtar olunur.

İsnat Edilen Eylem:
{{isnatEdilenEylem}}

Tebliğ Eden İmza: ____________________
Tebellüğ Eden (Hükümlü) İmza: ____________________`
  },
  {
    id: "tpl-izin-talep",
    title: "İzin Talep Yazısı",
    category: "Yazı",
    keywords: ["izin", "talep", "yazı"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "adiSoyadi", label: "Talep Eden Adı Soyadı", type: "text" },
      { key: "izinTuru", label: "İzin Türü", type: "text" },
      { key: "baslangic", label: "Başlangıç Tarihi", type: "date" },
      { key: "bitis", label: "Bitiş Tarihi", type: "date" },
      { key: "gerekce", label: "Gerekçe", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
İZİN TALEP YAZISI

Tarih: {{tarih}}
Talep Eden: {{adiSoyadi}}
İzin Türü: {{izinTuru}}
Talep Edilen Süre: {{baslangic}} — {{bitis}}

Gerekçe:
{{gerekce}}

Talep Eden İmza: ____________________`
  },
  {
    id: "tpl-ust-yazi",
    title: "Üst Yazı",
    category: "Yazı",
    keywords: ["üst yazı", "resmi yazı"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "sayi", label: "Sayı", type: "text" },
      { key: "konu", label: "Konu", type: "text" },
      { key: "muhatap", label: "Muhatap Makam", type: "text" },
      { key: "icerik", label: "Yazı İçeriği", type: "textarea" },
      { key: "imzalayan", label: "İmzalayan / Unvan", type: "text" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU

Sayı: {{sayi}}                              Tarih: {{tarih}}
Konu: {{konu}}

{{muhatap}} MAKAMINA

{{icerik}}

Bilgilerinize arz/rica ederim.

{{imzalayan}}
İmza: ____________________`
  },
  {
    id: "tpl-tebligat",
    title: "Tebligat",
    category: "Yazı",
    keywords: ["tebligat", "tebliğ"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "muhatap", label: "Tebliğ Edilecek Kişi", type: "text" },
      { key: "konu", label: "Tebligat Konusu", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
TEBLİGAT

Tarih: {{tarih}}
Sayın: {{muhatap}}

Aşağıdaki husus tarafınıza tebliğ olunur:

{{konu}}

Tebliğ Eden İmza: ____________________
Tebellüğ Eden İmza: ____________________`
  },
  {
    id: "tpl-ziyaretci-yasagi",
    title: "Ziyaretçi Yasağı Kararı",
    category: "Karar",
    keywords: ["ziyaretçi", "yasak", "karar"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "ziyaretciAdi", label: "Yasaklanan Ziyaretçi", type: "text" },
      { key: "gerekce", label: "Gerekçe", type: "textarea" },
      { key: "sure", label: "Yasağın Süresi", type: "text" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
ZİYARETÇİ YASAĞI KARARI

Tarih: {{tarih}}
Hükümlü: {{hukumluAdi}}
Yasaklanan Ziyaretçi: {{ziyaretciAdi}}
Süre: {{sure}}

Gerekçe:
{{gerekce}}

Karar Veren İmza: ____________________`
  }
];

/* -------------------- 3) HAZIR KARAR BANKASI -------------------- */
// Somut, sık karşılaşılan senaryolara göre önceden yazılmış örnek karar
// metinleri. Yalnızca "telefon-suistimal" kaydı doğrulanmış madde içerir;
// diğerleri şablon iskeleti + [DOLDUR] uyarısıdır.
const KARAR_BANKASI = [
  {
    id: "karar-telefon-suistimal",
    title: "Telefon Görüşme Hakkının Kötüye Kullanılması",
    keywords: ["telefon", "suistimal", "yönlendirme", "izinsiz görüşme"],
    dayanakId: "kanun-5275-42",
    gerekceMetni:
`Hükümlünün, kurum idaresine bildirdiği telefon numarası dışında bir hatta yönlendirme yapmak suretiyle görüşme hakkı bulunmayan kişi/kişilerle görüştüğü tespit edilmiştir. Bu eylem, 5275 sayılı Kanun'un 42/2-f maddesinde tanımlanan disiplin ihlaline karşılık gelmekte olup, aynı madde uyarınca 1 aydan 3 aya kadar haberleşme ve iletişim araçlarından yoksun bırakma cezası öngörülmektedir.`
  },
  {
    id: "karar-firar-placeholder",
    title: "Firar (örnek — dayanak doldurulmalı)",
    keywords: ["firar"],
    dayanakId: "placeholder-firar",
    gerekceMetni: "[DOLDUR] — Firar ile ilgili doğrulanmış madde eklenmeden bu karar resmi olarak kullanılmamalıdır."
  }
];

if (typeof module !== "undefined") {
  module.exports = { MEVZUAT_DB, TEMPLATES_DB, KARAR_BANKASI, LEGAL_DB_VERSION };
}
