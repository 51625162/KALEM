/* =========================================================================
   KALEM - EK ŞABLON KÜTÜPHANESİ
   -------------------------------------------------------------------------
   Bu dosya legal-ai-data.js'ten SONRA yüklenmelidir. TEMPLATES_DB dizisine
   yeni resmi yazışma / karar / düzenleme şablonları ekler.
   Not: Bunlar RESMİ FORMAT iskeletleridir (boilerplate). Hukuki dayanak
   gerektiren alanlarda ({{dayanak}} vb.) kendi doğruladığınız mevzuat
   metnini elle girin — sistem otomatik doldurmaz (bkz. legal-ai-engine.js
   buildKararWithDayanak fonksiyonu, sadece MEVZUAT_DB'de kaydı olan
   kararlar için otomatik dayanak ekler).
   ========================================================================= */

const TEMPLATES_EXT = [

  /* ---------------- YAZIŞMA TÜRLERİ ---------------- */
  {
    id: "tpl-cevap-ust-yazi",
    title: "Cevap Üst Yazısı",
    category: "Yazışma",
    keywords: ["cevap", "yanıt", "üst yazı", "yazıya cevap"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "sayi", label: "Sayı", type: "text" },
      { key: "ilgiYazi", label: "İlgi Yazının Tarih/Sayısı", type: "text" },
      { key: "muhatap", label: "Muhatap Makam", type: "text" },
      { key: "konu", label: "Konu", type: "text" },
      { key: "cevapMetni", label: "Cevap Metni", type: "textarea" },
      { key: "imzalayan", label: "İmzalayan / Unvan", type: "text" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU

Sayı: {{sayi}}                              Tarih: {{tarih}}
Konu: {{konu}}
İlgi: {{ilgiYazi}}

{{muhatap}} MAKAMINA

İlgi yazınız incelenmiş olup aşağıdaki hususlar arz olunur:

{{cevapMetni}}

Bilgilerinize arz/rica ederim.

{{imzalayan}}
İmza: ____________________`
  },
  {
    id: "tpl-ic-yazi",
    title: "Kurum İçi Yazışma",
    category: "Yazışma",
    keywords: ["iç yazı", "kurum içi", "birimler arası"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "gonderenBirim", label: "Gönderen Birim", type: "text" },
      { key: "aliciBirim", label: "Alıcı Birim", type: "text" },
      { key: "konu", label: "Konu", type: "text" },
      { key: "icerik", label: "İçerik", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
KURUM İÇİ YAZI

Tarih: {{tarih}}
Gönderen: {{gonderenBirim}}
Alıcı: {{aliciBirim}}
Konu: {{konu}}

{{icerik}}

İmza: ____________________`
  },
  {
    id: "tpl-havale-yazisi",
    title: "Havale Yazısı",
    category: "Yazışma",
    keywords: ["havale", "yönlendirme", "yazı havalesi"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "gelenYazi", label: "Havale Edilen Yazının Tarih/Sayısı", type: "text" },
      { key: "havaleEdilenBirim", label: "Havale Edilen Birim", type: "text" },
      { key: "talimat", label: "Talimat / Not", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
HAVALE YAZISI

Tarih: {{tarih}}
İlgi Yazı: {{gelenYazi}}
Havale Edilen Birim: {{havaleEdilenBirim}}

Talimat / Not:
{{talimat}}

İmza: ____________________`
  },
  {
    id: "tpl-bilgi-yazisi",
    title: "Bilgi Verme Yazısı",
    category: "Yazışma",
    keywords: ["bilgi", "bilgilendirme", "yazı"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "muhatap", label: "Muhatap", type: "text" },
      { key: "konu", label: "Konu", type: "text" },
      { key: "icerik", label: "Bilgi İçeriği", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
BİLGİ VERME YAZISI

Tarih: {{tarih}}
{{muhatap}} MAKAMINA
Konu: {{konu}}

{{icerik}}

Bilgilerinize arz/rica ederim.
İmza: ____________________`
  },
  {
    id: "tpl-red-yazisi",
    title: "Talebin Reddi Yazısı",
    category: "Yazışma",
    keywords: ["ret", "red", "talep reddi", "yazı"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "muhatap", label: "Talep Eden", type: "text" },
      { key: "talepKonusu", label: "Talep Konusu", type: "text" },
      { key: "redGerekcesi", label: "Reddin Gerekçesi", type: "textarea" },
      { key: "itirazBilgisi", label: "İtiraz/Şikayet Yolu Bilgisi", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
YAZI

Tarih: {{tarih}}
Sayın: {{muhatap}}
Konu: {{talepKonusu}} talebiniz hk.

Talebiniz incelenmiş olup aşağıdaki gerekçe ile uygun görülmemiştir:

{{redGerekcesi}}

İtiraz/Şikayet Yolu:
{{itirazBilgisi}}

İmza: ____________________`
  },
  {
    id: "tpl-onay-yazisi",
    title: "Onay Yazısı",
    category: "Yazışma",
    keywords: ["onay", "uygundur", "yazı"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "konu", label: "Onaylanan Konu", type: "text" },
      { key: "aciklama", label: "Açıklama", type: "textarea" },
      { key: "onaylayan", label: "Onaylayan / Unvan", type: "text" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
ONAY

Tarih: {{tarih}}
Konu: {{konu}}

{{aciklama}}

Yukarıda belirtilen husus uygun görülerek onaylanmıştır.

{{onaylayan}}
İmza: ____________________`
  },

  /* ---------------- KARAR TÜRLERİ ---------------- */
  {
    id: "tpl-nakil-karari",
    title: "Nakil Kararı",
    category: "Karar",
    keywords: ["nakil", "sevk", "kurum değişikliği", "karar"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü/Tutuklu Adı Soyadı", type: "text" },
      { key: "mevcutKurum", label: "Mevcut Kurum", type: "text" },
      { key: "hedefKurum", label: "Nakledileceği Kurum", type: "text" },
      { key: "gerekce", label: "Nakil Gerekçesi", type: "textarea" },
      { key: "dayanak", label: "Hukuki Dayanak", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
NAKİL KARARI

Tarih: {{tarih}}
Hükümlü/Tutuklu: {{hukumluAdi}}
Mevcut Kurum: {{mevcutKurum}}
Nakledileceği Kurum: {{hedefKurum}}

Gerekçe:
{{gerekce}}

Hukuki Dayanak:
{{dayanak}}

Karar: Yukarıda kimliği belirtilen hükümlü/tutuklunun {{hedefKurum}}'a nakline karar verilmiştir.

Karar Veren İmza: ____________________`
  },
  {
    id: "tpl-acik-kuruma-ayirma",
    title: "Açık Ceza İnfaz Kurumuna Ayırma Kararı",
    category: "Karar",
    keywords: ["açık kurum", "ayırma", "karar", "açığa ayırma"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "degerlendirme", label: "İdare ve Gözlem Kurulu Değerlendirmesi", type: "textarea" },
      { key: "dayanak", label: "Hukuki Dayanak", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
İDARE VE GÖZLEM KURULU KARARI
(Açık Ceza İnfaz Kurumuna Ayırma)

Tarih: {{tarih}}
Hükümlü: {{hukumluAdi}}

Kurul Değerlendirmesi:
{{degerlendirme}}

Hukuki Dayanak:
{{dayanak}}

Karar: Hükümlünün açık ceza infaz kurumuna ayrılmasına karar verilmiştir.

Kurul Üyeleri İmza: ____________________`
  },
  {
    id: "tpl-kapali-kuruma-iade",
    title: "Kapalı Kuruma İade Kararı",
    category: "Karar",
    keywords: ["kapalı kurum", "iade", "karar", "geri gönderme"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "gerekce", label: "İade Gerekçesi", type: "textarea" },
      { key: "dayanak", label: "Hukuki Dayanak", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
İDARE VE GÖZLEM KURULU KARARI
(Kapalı Kuruma İade)

Tarih: {{tarih}}
Hükümlü: {{hukumluAdi}}

Gerekçe:
{{gerekce}}

Hukuki Dayanak:
{{dayanak}}

Karar: Hükümlünün kapalı ceza infaz kurumuna iadesine karar verilmiştir.

Kurul Üyeleri İmza: ____________________`
  },
  {
    id: "tpl-odul-karari",
    title: "Ödül Kararı",
    category: "Karar",
    keywords: ["ödül", "ödüllendirme", "karar", "teşvik"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "odulGerekcesi", label: "Ödül Gerekçesi (olumlu tutum/davranış)", type: "textarea" },
      { key: "odulTuru", label: "Verilen Ödülün Türü", type: "text" },
      { key: "dayanak", label: "Hukuki Dayanak", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
ÖDÜL KARARI

Tarih: {{tarih}}
Hükümlü: {{hukumluAdi}}

Ödül Gerekçesi:
{{odulGerekcesi}}

Verilen Ödül: {{odulTuru}}

Hukuki Dayanak:
{{dayanak}}

Karar Veren İmza: ____________________`
  },
  {
    id: "tpl-hucre-cezasi-karari",
    title: "Hücreye Koyma Cezası Kararı",
    category: "Karar",
    keywords: ["hücre", "hücreye koyma", "disiplin", "ceza", "karar"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "eylem", label: "Cezayı Gerektiren Eylem", type: "textarea" },
      { key: "sure", label: "Ceza Süresi (gün)", type: "text" },
      { key: "dayanak", label: "Hukuki Dayanak", type: "textarea" },
      { key: "saglikKontrolu", label: "Doktor Kontrolü Notu", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
DİSİPLİN KURULU KARARI
(Hücreye Koyma Cezası)

Tarih: {{tarih}}
Hükümlü: {{hukumluAdi}}

Cezayı Gerektiren Eylem:
{{eylem}}

Hukuki Dayanak:
{{dayanak}}

Ceza Süresi: {{sure}} gün

Doktor Kontrolü:
{{saglikKontrolu}}

Karar: Yukarıda belirtilen eylem nedeniyle hükümlü hakkında {{sure}} gün hücreye koyma cezası uygulanmasına karar verilmiştir. İtiraz hakkının hatırlatılmasına.

Disiplin Kurulu Üyeleri İmza: ____________________`
  },
  {
    id: "tpl-oda-degisikligi",
    title: "Oda / Koğuş Değişikliği Kararı",
    category: "Karar",
    keywords: ["oda değişikliği", "koğuş", "karar", "nakil oda"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "eskiOda", label: "Eski Oda/Koğuş", type: "text" },
      { key: "yeniOda", label: "Yeni Oda/Koğuş", type: "text" },
      { key: "gerekce", label: "Gerekçe", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
ODA/KOĞUŞ DEĞİŞİKLİĞİ KARARI

Tarih: {{tarih}}
Hükümlü: {{hukumluAdi}}
Eski Oda/Koğuş: {{eskiOda}}
Yeni Oda/Koğuş: {{yeniOda}}

Gerekçe:
{{gerekce}}

Karar Veren İmza: ____________________`
  },
  {
    id: "tpl-saglik-erteleme",
    title: "Sağlık Nedeniyle İnfazın Ertelenmesi Kararı",
    category: "Karar",
    keywords: ["sağlık", "erteleme", "infaz erteleme", "karar", "rapor"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "raporBilgisi", label: "Sağlık Raporu Bilgisi (kurum, tarih, sayı)", type: "text" },
      { key: "gerekce", label: "Erteleme Gerekçesi", type: "textarea" },
      { key: "ertelemeSuresi", label: "Erteleme Süresi", type: "text" },
      { key: "dayanak", label: "Hukuki Dayanak", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
KARAR
(Sağlık Nedeniyle İnfazın Ertelenmesi)

Tarih: {{tarih}}
Hükümlü: {{hukumluAdi}}
Sağlık Raporu: {{raporBilgisi}}

Gerekçe:
{{gerekce}}

Erteleme Süresi: {{ertelemeSuresi}}

Hukuki Dayanak:
{{dayanak}}

Karar Veren İmza: ____________________`
  },
  {
    id: "tpl-gozlem-siniflandirma",
    title: "Gözlem ve Sınıflandırma Kurulu Kararı",
    category: "Karar",
    keywords: ["gözlem", "sınıflandırma", "kurul", "karar"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "degerlendirme", label: "Değerlendirme (kişilik, risk, ihtiyaç analizi)", type: "textarea" },
      { key: "sonuc", label: "Sınıflandırma Sonucu / Öneri", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
GÖZLEM VE SINIFLANDIRMA KURULU KARARI

Tarih: {{tarih}}
Hükümlü: {{hukumluAdi}}

Değerlendirme:
{{degerlendirme}}

Sonuç / Öneri:
{{sonuc}}

Kurul Üyeleri İmza: ____________________`
  },
  {
    id: "tpl-emanet-esya-karari",
    title: "Emanet Eşya İşlem Kararı",
    category: "Karar",
    keywords: ["emanet", "eşya", "imha", "muhafaza", "karar"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "esyaListesi", label: "Eşya Listesi", type: "textarea" },
      { key: "islemTuru", label: "İşlem Türü (muhafaza/imha/iade)", type: "text" },
      { key: "gerekce", label: "Gerekçe", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
EMANET EŞYA İŞLEM KARARI

Tarih: {{tarih}}
Hükümlü: {{hukumluAdi}}
İşlem Türü: {{islemTuru}}

Eşya Listesi:
{{esyaListesi}}

Gerekçe:
{{gerekce}}

Karar Veren İmza: ____________________`
  },
  {
    id: "tpl-telefon-kisitlama-karari",
    title: "Telefon Görüşme Hakkının Kısıtlanması Kararı",
    category: "Karar",
    keywords: ["telefon", "kısıtlama", "karar", "görüşme yasağı"],
    fields: [
      { key: "tarih", label: "Karar Tarihi", type: "date" },
      { key: "hukumluAdi", label: "Hükümlü Adı Soyadı", type: "text" },
      { key: "gerekce", label: "Kısıtlama Gerekçesi", type: "textarea" },
      { key: "sure", label: "Kısıtlama Süresi", type: "text" },
      { key: "dayanak", label: "Hukuki Dayanak", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
KARAR
(Telefon Görüşme Hakkının Kısıtlanması)

Tarih: {{tarih}}
Hükümlü: {{hukumluAdi}}

Gerekçe:
{{gerekce}}

Kısıtlama Süresi: {{sure}}

Hukuki Dayanak:
{{dayanak}}

Karar Veren İmza: ____________________`
  },
  {
    id: "tpl-denetimli-serbestlik-degerlendirme",
    title: "Denetimli Serbestlik Yükümlülük Değerlendirme Yazısı",
    category: "Karar",
    keywords: ["denetimli serbestlik", "yükümlülük", "değerlendirme", "karar"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "yukumluAdi", label: "Yükümlü Adı Soyadı", type: "text" },
      { key: "yukumlulukTuru", label: "Yükümlülük Türü", type: "text" },
      { key: "uyum", label: "Yükümlülüğe Uyum Değerlendirmesi", type: "textarea" },
      { key: "oneri", label: "Öneri / Sonuç", type: "textarea" }
    ],
    body:
`T.C.
DENETİMLİ SERBESTLİK MÜDÜRLÜĞÜ
YÜKÜMLÜLÜK DEĞERLENDİRME YAZISI

Tarih: {{tarih}}
Yükümlü: {{yukumluAdi}}
Yükümlülük Türü: {{yukumlulukTuru}}

Uyum Değerlendirmesi:
{{uyum}}

Öneri / Sonuç:
{{oneri}}

Değerlendiren İmza: ____________________`
  },

  /* ---------------- EKLEME / DÜZENLEME YAZILARI ---------------- */
  {
    id: "tpl-karar-duzeltme",
    title: "Karar Düzeltme / Ek Karar Yazısı",
    category: "Düzenleme",
    keywords: ["düzeltme", "ek karar", "sehven", "hata", "revizyon"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "eskiKararNo", label: "Düzeltilen Kararın No/Tarihi", type: "text" },
      { key: "duzeltmeNedeni", label: "Düzeltme Nedeni", type: "textarea" },
      { key: "yeniIcerik", label: "Düzeltilmiş / Eklenen İçerik", type: "textarea" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
KARAR DÜZELTME / EK KARAR YAZISI

Tarih: {{tarih}}
İlgili Karar: {{eskiKararNo}}

Düzeltme Nedeni:
{{duzeltmeNedeni}}

Düzeltilmiş / Eklenen İçerik:
{{yeniIcerik}}

İşbu yazı, yukarıda belirtilen kararın eki/düzeltmesi olarak düzenlenmiştir.

Karar Veren İmza: ____________________`
  },
  {
    id: "tpl-tutanak-ek",
    title: "Tutanağa Ek Yazısı",
    category: "Düzenleme",
    keywords: ["ek tutanak", "ilave", "tamamlayıcı tutanak"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "anaTutanak", label: "Asıl Tutanağın Tarihi/Konusu", type: "text" },
      { key: "ekBilgi", label: "Eklenen Bilgi / Bulgu", type: "textarea" },
      { key: "duzenleyen", label: "Düzenleyen Personel", type: "text" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
TUTANAĞA EK YAZISI

Tarih: {{tarih}}
İlgili Tutanak: {{anaTutanak}}

Eklenen Bilgi / Bulgu:
{{ekBilgi}}

Bu yazı, ilgili tutanağın ayrılmaz eki niteliğindedir.

Düzenleyen: {{duzenleyen}}
İmza: ____________________`
  },
  {
    id: "tpl-ek-sure-talep",
    title: "Ek Süre Talep Yazısı",
    category: "Düzenleme",
    keywords: ["ek süre", "süre uzatımı", "talep"],
    fields: [
      { key: "tarih", label: "Tarih", type: "date" },
      { key: "muhatap", label: "Muhatap Makam", type: "text" },
      { key: "ilgiKonu", label: "İlgili Süreç / Konu", type: "text" },
      { key: "gerekce", label: "Ek Süre Gerekçesi", type: "textarea" },
      { key: "talepEdilenSure", label: "Talep Edilen Ek Süre", type: "text" }
    ],
    body:
`T.C.
CEZA İNFAZ KURUMU
EK SÜRE TALEP YAZISI

Tarih: {{tarih}}
{{muhatap}} MAKAMINA
Konu: {{ilgiKonu}} hk. ek süre talebi

Gerekçe:
{{gerekce}}

Talep Edilen Ek Süre: {{talepEdilenSure}}

Bilgilerinize arz/rica ederim.
İmza: ____________________`
  }
];

/* Ana şablon kütüphanesine ekle (legal-ai-data.js sonrasında çalışmalı) */
if (typeof TEMPLATES_DB !== "undefined") {
  TEMPLATES_EXT.forEach(t => {
    if (!TEMPLATES_DB.find(x => x.id === t.id)) TEMPLATES_DB.push(t);
  });
}

if (typeof module !== "undefined") {
  module.exports = { TEMPLATES_EXT };
}
