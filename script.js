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
    id: "kanun-5275-44-firar",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 44/3-ı",
    baslik: "Firar — hücreye koyma cezası",
    ozet: "Hücreye koyma cezası, hükümlünün eylemlerinin nitelik ve ağırlığına göre 1-20 gün arasında uygulanan, tek başına ve her türlü temastan yoksun tutulmayı içeren bir disiplin cezasıdır (m.44/1). Firar eylemi, madde 44/3 kapsamındaki (11-20 gün) hücre cezasını gerektiren eylemlerden biri olarak uygulamada değerlendirilmektedir (bkz. örnek karar: İncesu ACİK Disiplin Kurulu 2016/306 sayılı kararı, m.44/3-ı gereğince 15 gün hücre cezası).",
    keywords: ["firar", "kaçma", "hücre cezası", "disiplin"],
    kaynakUrl: "https://barandogan.av.tr/blog/mevzuat/infaz-kanunu-madde-47-disiplin-sorusturmasi.html",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-44-genel",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 44/1",
    baslik: "Hücreye koyma cezası (genel tanım)",
    ozet: "Hücreye koyma cezası, hükümlünün eylemlerinin nitelik ve ağırlığına göre 1 günden 20 güne kadar, açık havaya çıkma hakkı saklı kalmak üzere, geceli gündüzlü bir hücrede tek başına tutulması ve her türlü temastan yoksun bırakılmasıdır. İnfazından önce ve sırasında hükümlü hekim tarafından muayene edilir; katlanamayacağı anlaşılırsa infaz ertelenir veya hekimin belirlediği aralıklarla uygulanır.",
    keywords: ["hücre cezası", "hücreye koyma", "disiplin", "doktor muayenesi"],
    kaynakUrl: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5275.pdf",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-44-2a",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 44/2-a",
    baslik: "Kurum tesislerine zarar verme — hücre cezası (1-10 gün)",
    ozet: "Kurum tesislerine, araç ve gereçlerine zarar vermek, 1 günden 10 güne kadar hücreye koyma cezasını gerektiren eylemlerden biridir.",
    keywords: ["zarar verme", "tesis", "hücre cezası", "disiplin"],
    kaynakUrl: "https://barandogan.av.tr/blog/mevzuat/5275-sayili-ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun.html",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-44-2f",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 44/2-f",
    baslik: "Baskı kurarak çıkar sağlama — hücre cezası (1-10 gün)",
    ozet: "Hükümlü ve tutuklular üzerinde baskı kurarak çıkar sağlamak, özel işleriyle başka işlerde kullanmak, bunlara kalkışmak veya bu amaçla oluşturulan gruplara katılmak/dayanışma içinde olmak, 1 günden 10 güne kadar hücreye koyma cezasını gerektirir.",
    keywords: ["baskı", "çıkar sağlama", "grup", "hücre cezası", "disiplin"],
    kaynakUrl: "https://barandogan.av.tr/blog/mevzuat/5275-sayili-ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun.html",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-42-2c",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 42/2-c",
    baslik: "Toplu sessiz direniş / protesto — haberleşme yoksunluğu cezası",
    ozet: "Herhangi bir şeyi protesto amacıyla veya idareye karşı toplu olarak sessiz direnişte bulunmak, 1 aydan 3 aya kadar haberleşme ve iletişim araçlarından yoksun bırakma cezasını gerektiren eylemlerden biridir.",
    keywords: ["protesto", "direniş", "toplu", "disiplin", "haberleşme"],
    kaynakUrl: "https://nizamname.com/5275-sayili-ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun/",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-42-2d",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 42/2-d",
    baslik: "Odalarda ilaç/gıda stoku — haberleşme yoksunluğu cezası",
    ozet: "Odalarda, eklentilerinde ve diğer alanlarda ilaç ve gıda maddesi stoku yapmak, 1 aydan 3 aya kadar haberleşme ve iletişim araçlarından yoksun bırakma cezasını gerektirir.",
    keywords: ["ilaç stoku", "gıda stoku", "disiplin", "oda"],
    kaynakUrl: "https://nizamname.com/5275-sayili-ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun/",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-42-2e",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 42/2-e",
    baslik: "Gereksiz marş/slogan — haberleşme yoksunluğu cezası",
    ozet: "Gereksiz olarak marş söylemek veya slogan atmak, 1 aydan 3 aya kadar haberleşme ve iletişim araçlarından yoksun bırakma cezasını gerektiren eylemlerden biridir.",
    keywords: ["marş", "slogan", "gürültü", "disiplin"],
    kaynakUrl: "https://nizamname.com/5275-sayili-ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun/",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-36-arama",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 36",
    baslik: "Arama işlemleri",
    ozet: "Kurumlarda, odalar ve eklentilerinde, hükümlülerin üst ve eşyasında habersiz olarak her zaman arama yapılabilir. Her ay bir kez mutlaka arama yapılır. Aramalar gerektiğinde dış güvenlik görevlileri veya kolluk kuvvetleriyle ya da diğer kamu görevlilerince ortaklaşa gerçekleştirilebilir.",
    keywords: ["arama", "üst araması", "oda araması", "aylık arama"],
    kaynakUrl: "https://barandogan.av.tr/blog/mevzuat/5275-sayili-ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun.html",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-34-kapi",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 34",
    baslik: "Oda/koridor kapılarının açılma halleri",
    ozet: "Kapalı kurumlarda oda ve koridor kapıları kapalı tutulur. Kapılar şu hallerde açılır: kurum hekimine/revir/hamam/berbere gitme, başka odaya nakil; hastane/duruşmaya gönderme, başka kuruma nakil; tahliye, ziyaret, arama, sayım, denetim, eğitim-öğretim, spor ve iyileştirme çalışmaları, kurumda çalıştırma. Bu haller dışında hükümlüler diğer odalardakilerle ve görevlilerle temas edemez.",
    keywords: ["kapı", "oda", "koridor", "nakil", "sayım", "ziyaret", "denetim"],
    kaynakUrl: "https://www.lexpera.com.tr/resmi-gazete/metin/ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun-25685-5275",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-47-sorusturma",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 47",
    baslik: "Disiplin soruşturması usulü",
    ozet: "Hükümlülerin disiplin cezasını gerektiren eylemlerinin öğrenilmesinden itibaren derhal ve en geç iki gün içinde soruşturmaya başlanır. Savunma alınmadan disiplin cezası verilemez; kararlar gerekçeli olarak, itiraz mercii ve süresi belirtilerek yazılır ve tebliğ edilir. Soruşturma süresine uyulmaması, cezayı hukuka aykırı hale getirebilir (bkz. Yargıtay 1. CD 2024/6629 E.).",
    keywords: ["disiplin soruşturması", "savunma", "süre", "muhakkik", "usul"],
    kaynakUrl: "https://barandogan.av.tr/blog/mevzuat/infaz-kanunu-madde-47-disiplin-sorusturmasi.html",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-49-tedbir",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 49",
    baslik: "Soruşturma sırasında alınabilecek tedbirler",
    ozet: "Yönetim, disiplin soruşturması yapılan hükümlünün odasını, iş ve çalışma yerini değiştirebilir, hükümlüyü kurumun başka kesimine nakledebilir veya diğer hükümlülerden ayırabilir.",
    keywords: ["oda değişikliği", "tedbir", "soruşturma", "ayırma"],
    kaynakUrl: "http://www.ceza-bb.adalet.gov.tr/mevzuat/5275.htm",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-52-itiraz",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 52",
    baslik: "Disiplin cezalarına şikayet ve itiraz",
    ozet: "Disiplin cezalarına ve tedbirlerine karşı şikayet ve itiraz durumunda 4675 sayılı İnfaz Hakimliği Kanunu hükümleri uygulanır. Diğer mevzuattan kaynaklanan dilekçe ve şikayet hakkı saklıdır.",
    keywords: ["itiraz", "şikayet", "infaz hakimliği", "disiplin"],
    kaynakUrl: "http://www.ceza-bb.adalet.gov.tr/mevzuat/5275.htm",
    dogrulanma: "web-arama-2026-07-13"
  },
  {
    id: "kanun-5275-53-nakil",
    tur: "kanun",
    kaynak: "5275 Sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun",
    madde: "Madde 53",
    baslik: "Nakil sebepleri ve usulü",
    ozet: "Hükümlüler kendi istekleri veya toplu sevk, disiplin, asayiş ve güvenlik, hastalık, eğitim, öğretim, suç ve yargılama yeri nedenleriyle başka bir kuruma nakledilebilir. Nakilden önce hükümlü aranır ve hekime muayene ettirilir; yola çıkarılamayacağı anlaşılanlar resmi sağlık kuruluşuna sevk edilir. Mazereti raporla belgelenirse nakil, mazeret ortadan kalkıncaya kadar geri bırakılır ve Adalet Bakanlığına bildirilir.",
    keywords: ["nakil", "sevk", "kurum değişikliği", "hastalık", "disiplin"],
    kaynakUrl: "https://cisst.org.tr/disiplin-cezalari/",
    dogrulanma: "web-arama-2026-07-13"
  }
];

/* -------------------- 1b) KONU KATALOĞU (genişletilebilir) -------------------- */
// Karar/tutanak "konularının" (senaryoların) listesi. Her konu bir formata
// (templateId) ve varsa bir mevzuat kaydına bağlanır. Bu sayede 30 format
// şablonu ile onlarca/yüzlerce farklı, ANLAMLI belge üretilebilir —
// binlerce kopya/dolgu şablon yerine.
const KONU_KATALOGU = [
  { id:"konu-protesto", baslik:"Toplu Sessiz Direniş / Protesto", templateId:"tpl-disiplin-karari", dayanakId:"kanun-5275-42-2c",
    gerekce:"Hükümlünün, idareye karşı toplu olarak sessiz direnişte bulunmak suretiyle protesto eylemi gerçekleştirdiği tespit edilmiştir.", keywords:["protesto","direniş","toplu"] },
  { id:"konu-stok", baslik:"Odada İlaç/Gıda Stoku", templateId:"tpl-disiplin-karari", dayanakId:"kanun-5275-42-2d",
    gerekce:"Hükümlünün odasında yapılan aramada gıda ve/veya ilaç maddesi stoku bulunduğu tespit edilmiştir.", keywords:["stok","ilaç","gıda","oda"] },
  { id:"konu-marş", baslik:"Gereksiz Marş/Slogan", templateId:"tpl-disiplin-karari", dayanakId:"kanun-5275-42-2e",
    gerekce:"Hükümlünün gereksiz yere marş söylediği/slogan attığı, kurum düzenini bozduğu tespit edilmiştir.", keywords:["marş","slogan"] },
  { id:"konu-tesis-zarar", baslik:"Kurum Tesislerine Zarar Verme", templateId:"tpl-hucre-cezasi-karari", dayanakId:"kanun-5275-44-2a",
    gerekce:"Hükümlünün kurum tesislerine, araç ve gereçlerine kasıtlı olarak zarar verdiği tespit edilmiştir.", keywords:["zarar","tesis","eşya"] },
  { id:"konu-baski", baslik:"Baskı Kurarak Çıkar Sağlama", templateId:"tpl-hucre-cezasi-karari", dayanakId:"kanun-5275-44-2f",
    gerekce:"Hükümlünün diğer hükümlüler üzerinde baskı kurarak çıkar sağladığı veya bu amaçla oluşturulan bir grupla dayanışma içinde olduğu tespit edilmiştir.", keywords:["baskı","çıkar","grup"] },
  { id:"konu-firar", baslik:"Firar", templateId:"tpl-hucre-cezasi-karari", dayanakId:"kanun-5275-44-firar",
    gerekce:"Hükümlünün kurumdan/gönderildiği yerden izinsiz ayrılmak suretiyle firar eylemi gerçekleştirdiği tespit edilmiştir.", keywords:["firar","kaçma"] },
  { id:"konu-telefon", baslik:"Telefon Görüşme Hakkının Kötüye Kullanılması", templateId:"tpl-disiplin-karari", dayanakId:"kanun-5275-42",
    gerekce:"Hükümlünün, kurum idaresine bildirdiği telefon numarası dışında bir hatta yönlendirme yapmak suretiyle görüşme hakkı bulunmayan kişilerle görüştüğü tespit edilmiştir.", keywords:["telefon","yönlendirme","izinsiz görüşme"] },
  { id:"konu-nakil-istek", baslik:"Nakil — Hükümlünün Kendi İsteği", templateId:"tpl-nakil-karari", dayanakId:"kanun-5275-53-nakil",
    gerekce:"Hükümlünün kendi yazılı talebi üzerine başka bir kuruma nakline karar verilmesi gerekmektedir.", keywords:["nakil","istek","talep"] },
  { id:"konu-nakil-disiplin", baslik:"Nakil — Disiplin/Asayiş Nedeniyle", templateId:"tpl-nakil-karari", dayanakId:"kanun-5275-53-nakil",
    gerekce:"Hükümlünün kurum düzenini ve asayişi bozan tutum ve davranışları nedeniyle disiplin/asayiş gerekçesiyle başka bir kuruma nakli gerekmektedir.", keywords:["nakil","disiplin","asayiş"] },
  { id:"konu-nakil-saglik", baslik:"Nakil — Sağlık Nedeniyle", templateId:"tpl-nakil-karari", dayanakId:"kanun-5275-53-nakil",
    gerekce:"Hükümlünün sağlık durumu nedeniyle tedavisinin sürdürülebileceği bir kuruma/hastaneye nakli gerekmektedir.", keywords:["nakil","sağlık","tedavi"] },
  { id:"konu-arama-rutin", baslik:"Rutin Aylık Arama", templateId:"tpl-arama-tutanagi", dayanakId:"kanun-5275-36-arama",
    gerekce:"Kanunun öngördüğü aylık zorunlu arama kapsamında oda ve eklentilerinde arama yapılmıştır.", keywords:["arama","rutin","aylık"] },
  { id:"konu-arama-ani", baslik:"Habersiz Ani Arama", templateId:"tpl-arama-tutanagi", dayanakId:"kanun-5275-36-arama",
    gerekce:"İdarenin takdiri ile habersiz şekilde ani arama yapılmıştır.", keywords:["arama","ani","habersiz"] },
  { id:"konu-oda-tedbir", baslik:"Soruşturma Sırasında Oda/İş Yeri Değişikliği", templateId:"tpl-oda-degisikligi", dayanakId:"kanun-5275-49-tedbir",
    gerekce:"Devam eden disiplin soruşturması kapsamında, olayların tekrarını önlemek amacıyla hükümlünün oda/iş yerinin değiştirilmesi/ayrılması gerekli görülmüştür.", keywords:["oda değişikliği","soruşturma","tedbir"] }
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
// metinleri. KONU_KATALOGU'ndaki her doğrulanmış konu, otomatik olarak
// bir "hazır karar" haline getirilir (aşağıdaki .map ile) — böylece yeni
// bir konu eklemek için sadece KONU_KATALOGU'na bir satır eklemek yeterli.
const KARAR_BANKASI = KONU_KATALOGU.map(k => ({
    id: "karar-" + k.id,
    title: k.baslik,
    keywords: k.keywords,
    dayanakId: k.dayanakId,
    templateId: k.templateId,
    gerekceMetni: k.gerekce
  }));

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

/* =========================================================================
   KALEM - CTE MEVZUAT & ŞABLON AI MOTORU (çevrimdışı, sunucusuz)
   -------------------------------------------------------------------------
   Bu dosya legal-ai-data.js'e bağımlıdır (önce o yüklenmeli).
   KALEM'in "Yapay Zeka" sekmesindeki eski basit sohbet mantığının yerine
   geçecek şekilde tasarlanmıştır. Entegrasyon notları dosyanın sonundadır.
   ========================================================================= */

/* -------------------- Yardımcılar -------------------- */
function normalizeTr(str) {
  return (str || "")
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");
}

function scoreMatch(queryNorm, text) {
  const t = normalizeTr(text);
  if (!queryNorm) return 0;
  if (t.includes(queryNorm)) return 3;
  const qWords = queryNorm.split(/\s+/).filter(Boolean);
  let hits = 0;
  qWords.forEach(w => { if (t.includes(w)) hits++; });
  return hits;
}

/* -------------------- 1) AKILLI ARAMA MOTORU -------------------- */
// Tek bir arama kutusuna yazılan kelimeyle: şablonlar + mevzuat + kararlar
// aynı anda taranır ve puanına göre sıralanır.
function legalSmartSearch(query) {
  const qn = normalizeTr(query);
  if (!qn) return { templates: [], mevzuat: [], kararlar: [] };

  const templates = TEMPLATES_DB
    .map(t => ({ item: t, score: Math.max(
      scoreMatch(qn, t.title) * 2,
      ...t.keywords.map(k => scoreMatch(qn, k))
    )}))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.item);

  const mevzuat = MEVZUAT_DB
    .map(m => ({ item: m, score: Math.max(
      scoreMatch(qn, m.baslik) * 2,
      scoreMatch(qn, m.ozet),
      ...m.keywords.map(k => scoreMatch(qn, k))
    )}))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.item);

  const kararlar = KARAR_BANKASI
    .map(k => ({ item: k, score: Math.max(
      scoreMatch(qn, k.title) * 2,
      ...k.keywords.map(w => scoreMatch(qn, w))
    )}))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.item);

  return { templates, mevzuat, kararlar };
}

/* -------------------- 2) MEVZUAT DETAY GETİRME -------------------- */
function getMevzuatById(id) {
  return MEVZUAT_DB.find(m => m.id === id) || null;
}

function formatMevzuatCard(m) {
  const guven = m.dogrulanma === "DOĞRULANMADI"
    ? "⚠️ DOĞRULANMADI — resmi kullanımdan önce kontrol edin"
    : "✅ Web kaynağıyla doğrulandı (" + m.dogrulanma + ")";
  return `${m.kaynak} — ${m.madde}
${m.baslik}

${m.ozet}

Durum: ${guven}${m.kaynakUrl ? "\nKaynak: " + m.kaynakUrl : ""}`;
}

/* -------------------- 3) ŞABLON DOLDURMA (placeholder replace) -------------------- */
function renderTemplate(template, values) {
  let out = template.body;
  template.fields.forEach(f => {
    const val = (values[f.key] ?? "").toString().trim() || `[${f.label} girilmedi]`;
    out = out.split(`{{${f.key}}}`).join(val);
  });
  return out;
}

// Karar şablonuna otomatik hukuki dayanak ekleme
function buildKararWithDayanak(kararKaydi, extraFields) {
  const dayanak = getMevzuatById(kararKaydi.dayanakId);
  const template = TEMPLATES_DB.find(t => t.id === "tpl-disiplin-karari");
  const values = Object.assign({
    dayanak: dayanak
      ? `${dayanak.kaynak}, ${dayanak.madde}${dayanak.ilgiliFikra ? " (" + dayanak.ilgiliFikra + ")" : ""}\n${dayanak.ozet}`
      : "[Dayanak bulunamadı — elle ekleyin]",
    gerekce: kararKaydi.gerekceMetni
  }, extraFields);
  return renderTemplate(template, values);
}

/* -------------------- 4) TUTANAK / KARAR SİHİRBAZI -------------------- */
// Adım adım soru sorar, cevapları toplar, şablonu doldurur.
class KalemWizard {
  constructor(templateId, onComplete) {
    this.template = TEMPLATES_DB.find(t => t.id === templateId);
    this.onComplete = onComplete;
    this.stepIndex = 0;
    this.answers = {};
  }
  currentField() {
    if (!this.template) return null;
    return this.template.fields[this.stepIndex] || null;
  }
  currentQuestionText() {
    const f = this.currentField();
    if (!f) return null;
    return `${f.label}?`;
  }
  submitAnswer(value) {
    const f = this.currentField();
    if (!f) return;
    this.answers[f.key] = value;
    this.stepIndex++;
    if (this.isDone()) {
      const result = renderTemplate(this.template, this.answers);
      this.onComplete(result);
    }
  }
  isDone() {
    return !this.template || this.stepIndex >= this.template.fields.length;
  }
  progressLabel() {
    if (!this.template) return "";
    return `Adım ${Math.min(this.stepIndex + 1, this.template.fields.length)}/${this.template.fields.length}`;
  }
}

/* -------------------- 5) NİYET TANIMA (basit anahtar kelime eşleme) -------------------- */
// "Olay tutanağı hazırla" gibi serbest metinden hangi şablon/işlem
// kastedildiğini anlamaya çalışan çok basit, tamamen yerel bir eşleyici.
function detectIntent(freeText) {
  const qn = normalizeTr(freeText);

  // "X hakkında karar hazırla" -> karar bankasında ara
  if (qn.includes("karar hazirla") || qn.includes("karar olustur")) {
    const kararMatch = KARAR_BANKASI
      .map(k => ({ item: k, score: Math.max(...k.keywords.map(w => scoreMatch(qn, w))) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)[0];
    if (kararMatch) return { type: "karar", payload: kararMatch.item };
  }

  // "X maddesi / hangi yönetmelik / dayanak" -> mevzuat sorgusu
  if (qn.includes("madde") || qn.includes("yonetmelik") || qn.includes("dayanak") || qn.includes("kanun")) {
    const results = legalSmartSearch(freeText);
    if (results.mevzuat.length) return { type: "mevzuat", payload: results.mevzuat };
  }

  // Doğrudan şablon adı geçiyor mu?
  const tplResults = legalSmartSearch(freeText);
  if (tplResults.templates.length) return { type: "template", payload: tplResults.templates[0] };

  return { type: "unknown", payload: null };
}

/* -------------------- 6) DIŞA AÇILAN ANA FONKSİYON -------------------- */
// Sohbet kutusuna yazılan serbest metni işleyip kullanıcıya gösterilecek
// yanıtı (metin) üretir. UI tarafı bunu chat balonuna basar.
function kalemAiRespond(userText) {
  const intent = detectIntent(userText);

  switch (intent.type) {
    case "karar": {
      const karar = intent.payload;
      const dayanak = getMevzuatById(karar.dayanakId);
      let msg = `"${karar.title}" için hazır karar taslağı buldum.\n\n`;
      msg += `Dayanak: ${dayanak ? dayanak.kaynak + " " + dayanak.madde : "bulunamadı"}\n\n`;
      msg += `Gerekçe önerisi:\n${karar.gerekceMetni}\n\n`;
      msg += `Tam kararı doldurmak için sihirbazı başlatabilirsin (aşağıdaki "Karar Sihirbazını Başlat" butonu).`;
      return { text: msg, action: { type: "start-wizard-karar", kararId: karar.id } };
    }
    case "mevzuat": {
      const list = intent.payload.slice(0, 3);
      const msg = list.map(formatMevzuatCard).join("\n\n---\n\n");
      return { text: msg, action: null };
    }
    case "template": {
      const tpl = intent.payload;
      return {
        text: `"${tpl.title}" şablonunu buldum (${tpl.category}). Adım adım doldurmak için sihirbazı başlatabilirim.`,
        action: { type: "start-wizard-template", templateId: tpl.id }
      };
    }
    default:
      return {
        text: `Bunu tam olarak eşleştiremedim. Şunları deneyebilirsin:\n• "olay tutanağı hazırla"\n• "telefon hakkı hangi maddede"\n• "disiplin cezası dayanağını göster"\n\nYa da üstteki arama kutusuna anahtar kelime yaz.`,
        action: null
      };
  }
}


/* ---------------- State & storage ---------------- */
const STORE_KEYS = { docs:'kalem_documents', rems:'kalem_reminders', settings:'kalem_settings', profile:'kalem_profile', customTemplates:'kalem_custom_templates' };
let state = {
  docs: JSON.parse(localStorage.getItem(STORE_KEYS.docs) || '[]'),
  rems: JSON.parse(localStorage.getItem(STORE_KEYS.rems) || '[]'),
  settings: JSON.parse(localStorage.getItem(STORE_KEYS.settings) || '{"notifications":true,"lang":"tr"}'),
  profile: JSON.parse(localStorage.getItem(STORE_KEYS.profile) || '{"name":"Kullanıcı","email":"","role":""}'),
  customTemplates: JSON.parse(localStorage.getItem(STORE_KEYS.customTemplates) || '[]')
};
let docFilter = { cat:'all', fav:false, q:'' };
let remFilter = 'active';
let calDate = new Date();

function persist(key){ localStorage.setItem(STORE_KEYS[key], JSON.stringify(state[key])); }

/* ---------------- Kullanıcı Şablonları (kalıcı, GitHub'a yeniden yüklemeye gerek yok) ---------------- */
// Kullanıcı "Kendi Şablonunu Ekle" ile eklediği her şablon burada tarayıcının
// localStorage'ında saklanır ve TEMPLATES_DB'ye eklenerek arama/AI motoruna dahil olur.
function parseTemplateFields(body){
  const found = [...body.matchAll(/\{\{(\w+)\}\}/g)].map(m=>m[1]);
  const unique = [...new Set(found)];
  return unique.map(key => ({
    key,
    label: key.replace(/([A-Z])/g,' $1').replace(/^./, c=>c.toUpperCase()).replace(/_/g,' '),
    type: /aciklama|icerik|not|gerekce|metin|detay|liste/i.test(key) ? 'textarea' : (/tarih|date/i.test(key) ? 'date' : 'text')
  }));
}
function loadCustomTemplatesIntoDb(){
  state.customTemplates.forEach(ct => {
    if(!TEMPLATES_DB.find(t=>t.id===ct.id)) TEMPLATES_DB.push(ct);
  });
}
function addCustomTemplate(title, category, body){
  const fields = parseTemplateFields(body);
  const tpl = {
    id: 'custom-' + uid(),
    title: title.trim(),
    category: category.trim() || 'Özel',
    keywords: title.toLowerCase().split(/\s+/),
    fields,
    body,
    isCustom: true
  };
  state.customTemplates.push(tpl);
  persist('customTemplates');
  TEMPLATES_DB.push(tpl);
  return tpl;
}
function deleteCustomTemplate(id){
  state.customTemplates = state.customTemplates.filter(t=>t.id!==id);
  persist('customTemplates');
  const idx = TEMPLATES_DB.findIndex(t=>t.id===id);
  if(idx>-1) TEMPLATES_DB.splice(idx,1);
}
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(window._toastT);
  window._toastT = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ---------------- Navigation ---------------- */
function goPage(p){
  document.querySelectorAll('.page').forEach(el=>el.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active', el.dataset.page===p));
  document.querySelectorAll('#mobileNav button').forEach(el=>el.classList.toggle('active', el.dataset.page===p));
  if(p==='calendar') renderCalendar();
  if(p==='profile') loadProfileForm();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.nav-item').forEach(btn=>{
  btn.addEventListener('click', ()=> btn.dataset.page && goPage(btn.dataset.page));
});
document.querySelectorAll('#mobileNav button').forEach(btn=>{
  btn.addEventListener('click', ()=> goPage(btn.dataset.page));
});

/* ---------------- Modals ---------------- */
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(ov=>{
  ov.addEventListener('click', e=>{ if(e.target===ov) ov.classList.remove('open'); });
});

/* ---------------- Documents ---------------- */
function openDocModal(doc){
  document.getElementById('docModalTitle').textContent = doc ? 'Belgeyi Düzenle' : 'Yeni Belge';
  document.getElementById('docId').value = doc ? doc.id : '';
  document.getElementById('docTitle').value = doc ? doc.title : '';
  document.getElementById('docCat').value = doc ? doc.cat : 'Not';
  document.getElementById('docTags').value = doc ? doc.tags.join(', ') : '';
  document.getElementById('docContent').value = doc ? doc.content : '';
  openModal('docModal');
}
function saveDoc(){
  const title = document.getElementById('docTitle').value.trim();
  if(!title){ toast('Başlık boş olamaz'); return; }
  const id = document.getElementById('docId').value;
  const tags = document.getElementById('docTags').value.split(',').map(s=>s.trim()).filter(Boolean);
  const payload = {
    id: id || uid(),
    title, cat: document.getElementById('docCat').value,
    tags, content: document.getElementById('docContent').value.trim(),
    fav: id ? state.docs.find(d=>d.id===id).fav : false,
    date: id ? state.docs.find(d=>d.id===id).date : new Date().toISOString()
  };
  if(id){ state.docs = state.docs.map(d=> d.id===id ? payload : d); }
  else{ state.docs.unshift(payload); }
  persist('docs');
  closeModal('docModal'); toast('Belge kaydedildi'); renderAll();
}
function deleteDoc(id){
  state.docs = state.docs.filter(d=>d.id!==id); persist('docs'); renderAll(); toast('Belge silindi');
}
function toggleFav(id){
  state.docs = state.docs.map(d=> d.id===id ? {...d, fav:!d.fav} : d);
  persist('docs'); renderAll();
}
function setDocFilter(cat, el){
  docFilter.cat = cat;
  document.querySelectorAll('.chip-filter[data-catf]').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderDocs();
}
function toggleFavFilter(el){
  docFilter.fav = !docFilter.fav;
  el.classList.toggle('active', docFilter.fav);
  renderDocs();
}
document.getElementById('globalSearch').addEventListener('input', e=>{
  docFilter.q = e.target.value.toLowerCase();
  renderDocs();
});
function renderDocs(){
  const grid = document.getElementById('docGrid');
  let list = state.docs.filter(d=>{
    if(docFilter.cat!=='all' && d.cat!==docFilter.cat) return false;
    if(docFilter.fav && !d.fav) return false;
    if(docFilter.q && !(d.title.toLowerCase().includes(docFilter.q) || d.content.toLowerCase().includes(docFilter.q) || d.tags.join(' ').toLowerCase().includes(docFilter.q))) return false;
    return true;
  });
  if(list.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><span class="em-ic">📄</span>Henüz belge yok. "Belge Ekle" ile başla.</div>`;
    return;
  }
  grid.innerHTML = list.map(d=>`
    <div class="card doc-card">
      <div class="doc-top">
        <div>
          <div class="doc-cat">${d.cat}</div>
          <div class="doc-title">${escapeHtml(d.title)}</div>
        </div>
        <button class="icon-mini fav-btn ${d.fav?'is-fav':''}" onclick="toggleFav('${d.id}')">${d.fav?'⭐':'☆'}</button>
      </div>
      ${d.content ? `<div class="doc-desc">${escapeHtml(d.content)}</div>` : ''}
      ${d.tags.length ? `<div class="doc-tags">${d.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
      <div class="doc-foot">
        <span class="doc-date">${new Date(d.date).toLocaleDateString('tr-TR')}</span>
        <div class="doc-actions">
          <button class="icon-mini" title="Word'e aktar" onclick="exportTextAsWord('${escapeHtml(d.title)}', document.getElementById('__docsrc_${d.id}').value)">📄</button>
          <button class="icon-mini" title="PDF'e aktar" onclick="exportTextAsPDF('${escapeHtml(d.title)}', document.getElementById('__docsrc_${d.id}').value)">🖨️</button>
          <button class="icon-mini" onclick='openDocModal(${JSON.stringify(d).replace(/'/g,"&apos;")})'>✏️</button>
          <button class="icon-mini" onclick="deleteDoc('${d.id}')">🗑️</button>
        </div>
      </div>
      <textarea id="__docsrc_${d.id}" style="display:none;">${escapeHtml(d.content)}</textarea>
    </div>
  `).join('');
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s??''; return d.innerHTML; }

/* ---------------- Word / PDF Dışa Aktarma (tamamen çevrimdışı, dış kütüphane yok) ---------------- */
// Word: HTML içeriğini .doc uzantısıyla indirir — Word bu formatı sorunsuz açar.
function exportTextAsWord(title, content){
  const safeTitle = (title || 'Belge').replace(/[\\/:*?"<>|]/g, '-');
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body><pre style="font-family:'Courier New',monospace;font-size:12pt;white-space:pre-wrap;">${escapeHtml(content)}</pre></body></html>`;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = safeTitle + '.doc';
  a.click();
  URL.revokeObjectURL(url);
  toast('Word dosyası indirildi');
}
// PDF: tarayıcının kendi "Yazdır > PDF olarak kaydet" özelliğini kullanır — dış servis/internet gerekmez.
function exportTextAsPDF(title, content){
  const w = window.open('', '_blank');
  if(!w){ toast('Açılır pencere engellendi — tarayıcı ayarlarından izin ver'); return; }
  w.document.write(`<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
    <style>
      body{font-family:'Courier New',monospace;white-space:pre-wrap;padding:36px;font-size:12.5px;line-height:1.6;color:#111;}
      @media print{ body{padding:14px;} }
    </style></head>
    <body>${escapeHtml(content)}</body></html>`);
  w.document.close();
  setTimeout(()=>{ w.focus(); w.print(); }, 350);
}
function exportTplResultAsWord(){
  const tpl = TEMPLATES_DB.find(t=>t.id===currentTplId);
  const content = document.getElementById('tplModalResult').value;
  exportTextAsWord(tpl ? tpl.title : 'Belge', content);
}
function exportTplResultAsPDF(){
  const tpl = TEMPLATES_DB.find(t=>t.id===currentTplId);
  const content = document.getElementById('tplModalResult').value;
  exportTextAsPDF(tpl ? tpl.title : 'Belge', content);
}

/* ---------------- Reminders ---------------- */
function openRemModal(rem){
  document.getElementById('remModalTitle').textContent = rem ? 'Görevi Düzenle' : 'Yeni Görev';
  document.getElementById('remId').value = rem ? rem.id : '';
  document.getElementById('remTitle').value = rem ? rem.title : '';
  document.getElementById('remDate').value = rem ? rem.date : '';
  document.getElementById('remPriority').value = rem ? rem.priority : 'medium';
  document.getElementById('remNote').value = rem ? rem.note : '';
  openModal('remModal');
}
function saveRem(){
  const title = document.getElementById('remTitle').value.trim();
  if(!title){ toast('Başlık boş olamaz'); return; }
  const id = document.getElementById('remId').value;
  const payload = {
    id: id || uid(),
    title, date: document.getElementById('remDate').value,
    priority: document.getElementById('remPriority').value,
    note: document.getElementById('remNote').value.trim(),
    done: id ? state.rems.find(r=>r.id===id).done : false
  };
  if(id){ state.rems = state.rems.map(r=> r.id===id ? payload : r); }
  else{ state.rems.unshift(payload); }
  persist('rems');
  closeModal('remModal'); toast('Görev kaydedildi'); renderAll();
}
function deleteRem(id){ state.rems = state.rems.filter(r=>r.id!==id); persist('rems'); renderAll(); toast('Görev silindi'); }
function toggleDone(id){
  const rem = state.rems.find(r=>r.id===id);
  state.rems = state.rems.map(r=> r.id===id ? {...r, done:!r.done} : r);
  persist('rems'); renderAll();
  if(!rem.done) toast('Görev tamamlandı 🎉');
}
function setRemFilter(f, el){
  remFilter = f;
  document.querySelectorAll('.chip-filter[data-remf]').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderReminders();
}
function priorityLabel(p){ return p==='high'?'Yüksek':p==='medium'?'Orta':'Düşük'; }
function priorityPillClass(p){ return p==='high'?'pill-high':p==='medium'?'pill-med':'pill-low'; }
function renderReminders(){
  const list = document.getElementById('remList');
  let items = [...state.rems].sort((a,b)=> (a.date||'9999').localeCompare(b.date||'9999'));
  if(remFilter==='active') items = items.filter(r=>!r.done);
  if(remFilter==='done') items = items.filter(r=>r.done);
  if(items.length===0){
    list.innerHTML = `<div class="empty-state"><span class="em-ic">⏰</span>Bu filtrede görev yok.</div>`;
    return;
  }
  list.innerHTML = items.map(r=>`
    <div class="card rem-item ${r.done?'done':''}">
      <button class="rem-check" onclick="toggleDone('${r.id}')">${r.done?'✓':''}</button>
      <div class="rem-body">
        <div class="rem-title">${escapeHtml(r.title)}</div>
        <div class="rem-meta">
          ${r.date ? `<span class="rem-date">📅 ${new Date(r.date).toLocaleDateString('tr-TR')}</span>` : ''}
          <span class="pill ${priorityPillClass(r.priority)}">${priorityLabel(r.priority)}</span>
        </div>
      </div>
      <div class="doc-actions">
        <button class="icon-mini" onclick='openRemModal(${JSON.stringify(r).replace(/'/g,"&apos;")})'>✏️</button>
        <button class="icon-mini" onclick="deleteRem('${r.id}')">🗑️</button>
      </div>
    </div>
  `).join('');
}

/* ---------------- Calendar ---------------- */
const MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const DOW_TR = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
function calShift(n){ calDate.setMonth(calDate.getMonth()+n); renderCalendar(); }
function renderCalendar(){
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById('calTitle').textContent = `${MONTHS_TR[m]} ${y}`;
  const grid = document.getElementById('calGrid');
  let html = DOW_TR.map(d=>`<div class="cal-dow">${d}</div>`).join('');
  const firstDay = new Date(y,m,1);
  let startOffset = (firstDay.getDay()+6)%7; // Monday=0
  const daysInMonth = new Date(y,m+1,0).getDate();
  const daysInPrevMonth = new Date(y,m,0).getDate();
  const todayStr = new Date().toDateString();

  const cells = [];
  for(let i=startOffset; i>0; i--) cells.push({d:daysInPrevMonth-i+1, other:true, dateObj:new Date(y,m-1,daysInPrevMonth-i+1)});
  for(let d=1; d<=daysInMonth; d++) cells.push({d, other:false, dateObj:new Date(y,m,d)});
  while(cells.length%7!==0) { const nd = cells.length - (startOffset+daysInMonth) + 1; cells.push({d:nd, other:true, dateObj:new Date(y,m+1,nd)}); }

  html += cells.map(c=>{
    const dateISO = c.dateObj.toISOString().slice(0,10);
    const evts = state.rems.filter(r=>r.date===dateISO);
    const isToday = c.dateObj.toDateString()===todayStr;
    return `<div class="cal-cell ${c.other?'other-month':''} ${isToday?'today':''}">
      <div class="cal-daynum">${c.d}</div>
      ${evts.slice(0,3).map(e=>`<div class="cal-evt ${e.priority==='high'?'high':''}">${escapeHtml(e.title)}</div>`).join('')}
      ${evts.length>3?`<div class="cal-evt">+${evts.length-3} daha</div>`:''}
    </div>`;
  }).join('');
  grid.innerHTML = html;
}

/* ---------------- AI: Mevzuat & Şablon Motoru (çevrimdışı) ---------------- */
function pushMsg(role, text){
  const log = document.getElementById('chatLog');
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
function aiPreset(kind){
  const map = {
    soru: '',
    karar: 'hakkında karar hazırla',
    tutanak: 'tutanağı hazırla',
    mevzuat: 'hangi maddede düzenleniyor',
    yazi: 'yazısı hazırla'
  };
  document.getElementById('chatInput').value = map[kind] || '';
  document.getElementById('chatInput').focus();
}
function sendChat(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  pushMsg('user', text);
  input.value = '';
  setTimeout(()=>{
    if(typeof kalemAiRespond !== 'function'){
      pushMsg('ai', 'AI motor dosyaları yüklenemedi (ai/legal-ai-*.js). index.html içindeki script sıralamasını kontrol et.');
      return;
    }
    const res = kalemAiRespond(text);
    pushMsg('ai', res.text);
    if(res.action){
      if(res.action.type === 'start-wizard-template') openTplModal(res.action.templateId);
      if(res.action.type === 'start-wizard-karar'){
        const karar = KARAR_BANKASI.find(k=>k.id===res.action.kararId);
        openTplModal(karar ? karar.templateId : 'tpl-disiplin-karari', prefillForKarar(res.action.kararId));
      }
    }
  }, 300);
}
document.getElementById('chatInput').addEventListener('keydown', e=>{
  if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendChat(); }
});

/* ---------------- AI: Akıllı Arama (şablon + mevzuat + karar) ---------------- */
let legalCatFilter = 'all';
function setLegalCatFilter(cat, el){
  legalCatFilter = cat;
  document.querySelectorAll('#legalCatFilters .chip-filter').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderLegalSearch();
}
function renderLegalSearch(){
  const q = document.getElementById('legalSearchInput').value.trim();
  const wrap = document.getElementById('legalResults');

  if(legalCatFilter === 'Özel' && !q){
    if(state.customTemplates.length === 0){
      wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><span class="em-ic">➕</span>Henüz kendi şablonunu eklemedin. Yukarıdaki "Kendi Şablonunu Ekle" butonuyla başla.</div>`;
    } else {
      wrap.innerHTML = state.customTemplates.map(t => `
        <div class="card doc-card">
          <div class="doc-top">
            <div><div class="doc-cat">${escapeHtml(t.category)}</div><div class="doc-title">${escapeHtml(t.title)}</div></div>
          </div>
          <div class="doc-desc">Kendi eklediğin şablon — tarayıcında kalıcı.</div>
          <div class="doc-foot"><span class="doc-date">Özel Şablon</span>
            <div class="doc-actions">
              <button class="btn btn-primary btn-sm" onclick="openTplModal('${t.id}')">Doldur</button>
              <button class="icon-mini" onclick="removeCustomTplAndRefresh('${t.id}')">🗑️</button>
            </div>
          </div>
        </div>`).join('');
    }
    return;
  }

  if(!q){
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><span class="em-ic">⚖️</span>Aramaya başlamak için yukarı yaz — örneğin "olay tutanağı" veya "telefon hakkı".</div>`;
    return;
  }
  if(typeof legalSmartSearch !== 'function'){
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">AI motor dosyaları yüklenemedi.</div>`;
    return;
  }
  const { templates, mevzuat, kararlar } = legalSmartSearch(q);
  let cards = [];

  if(legalCatFilter === 'all' || legalCatFilter !== 'Mevzuat'){
    templates
      .filter(t => legalCatFilter==='all' || t.category===legalCatFilter)
      .forEach(t => cards.push(`
        <div class="card doc-card">
          <div class="doc-top">
            <div><div class="doc-cat">${escapeHtml(t.category)}</div><div class="doc-title">${escapeHtml(t.title)}</div></div>
          </div>
          <div class="doc-desc">${t.isCustom ? 'Kendi eklediğin şablon.' : 'Alanları doldurup saniyeler içinde resmi metni oluştur.'}</div>
          <div class="doc-foot"><span class="doc-date">${t.isCustom ? 'Özel Şablon' : 'Şablon'}</span>
            <div class="doc-actions">
              <button class="btn btn-primary btn-sm" onclick="openTplModal('${t.id}')">Doldur</button>
              ${t.isCustom ? `<button class="icon-mini" onclick="removeCustomTplAndRefresh('${t.id}')">🗑️</button>` : ''}
            </div>
          </div>
        </div>`));
  }

  if(legalCatFilter === 'all' || legalCatFilter === 'Karar'){
    kararlar.forEach(k => cards.push(`
        <div class="card doc-card">
          <div class="doc-top">
            <div><div class="doc-cat">Hazır Karar</div><div class="doc-title">${escapeHtml(k.title)}</div></div>
          </div>
          <div class="doc-desc">${escapeHtml(k.gerekceMetni.slice(0,110))}${k.gerekceMetni.length>110?'…':''}</div>
          <div class="doc-foot"><span class="doc-date">Karar</span>
            <button class="btn btn-primary btn-sm" onclick="openTplModal('${k.templateId}', prefillForKarar('${k.id}'))">Karara Dök</button>
          </div>
        </div>`));
  }

  if(legalCatFilter === 'all' || legalCatFilter === 'Mevzuat'){
    mevzuat.forEach(m => cards.push(`
        <div class="card doc-card">
          <div class="doc-top">
            <div><div class="doc-cat">${escapeHtml(m.tur)}</div><div class="doc-title">${escapeHtml(m.madde)}</div></div>
          </div>
          <div class="doc-desc">${escapeHtml(m.kaynak)} — ${escapeHtml(m.baslik)}</div>
          <div class="doc-foot">
            <span class="doc-date">${m.dogrulanma==='DOĞRULANMADI' ? '⚠️ doğrulanmadı' : '✅ doğrulandı'}</span>
            <button class="btn btn-ghost btn-sm" onclick="openMevzuatModal('${m.id}')">Görüntüle</button>
          </div>
        </div>`));
  }

  wrap.innerHTML = cards.length ? cards.join('') : `<div class="empty-state" style="grid-column:1/-1;"><span class="em-ic">🔍</span>Sonuç bulunamadı.</div>`;
}
document.getElementById('legalSearchInput').addEventListener('input', renderLegalSearch);

/* ---------------- Kendi Şablonunu Ekle (UI) ---------------- */
function openCustomTplModal(){
  document.getElementById('customTplTitle').value = '';
  document.getElementById('customTplCategory').value = 'Özel';
  document.getElementById('customTplBody').value = '';
  openModal('customTplModal');
}
function saveCustomTplFromModal(){
  const title = document.getElementById('customTplTitle').value.trim();
  const category = document.getElementById('customTplCategory').value;
  const body = document.getElementById('customTplBody').value;
  if(!title){ toast('Şablon adı boş olamaz'); return; }
  if(!body.trim()){ toast('Belge metni boş olamaz'); return; }
  const tpl = addCustomTemplate(title, category, body);
  closeModal('customTplModal');
  toast('Şablon kaydedildi — artık aramada ve "Kendi Şablonlarım" altında görünecek');
  document.getElementById('legalSearchInput').value = '';
  document.querySelectorAll('#legalCatFilters .chip-filter').forEach(b=>b.classList.remove('active'));
  document.querySelector('#legalCatFilters [data-legalcat="Özel"]').classList.add('active');
  legalCatFilter = 'Özel';
  renderLegalSearch();
}
function removeCustomTplAndRefresh(id){
  if(!confirm('Bu şablonu silmek istediğine emin misin?')) return;
  deleteCustomTemplate(id);
  renderLegalSearch();
  toast('Şablon silindi');
}

function openMevzuatModal(id){
  const m = getMevzuatById(id);
  if(!m) return;
  document.getElementById('mevzuatModalTitle').textContent = m.madde + ' — ' + m.kaynak;
  document.getElementById('mevzuatModalBody').textContent = formatMevzuatCard(m);
  openModal('mevzuatModal');
}

/* ---------------- AI: Şablon Doldurma Modalı ---------------- */
let currentTplId = null;
function prefillForKarar(kararId){
  const karar = KARAR_BANKASI.find(k=>k.id===kararId);
  if(!karar) return {};
  const dayanak = getMevzuatById(karar.dayanakId);
  return {
    dayanak: dayanak ? `${dayanak.kaynak}, ${dayanak.madde}${dayanak.ilgiliFikra?' ('+dayanak.ilgiliFikra+')':''}\n${dayanak.ozet}` : '[Dayanak bulunamadı — elle ekleyin]',
    gerekce: karar.gerekceMetni
  };
}
function openTplModal(templateId, prefill){
  const tpl = TEMPLATES_DB.find(t=>t.id===templateId);
  if(!tpl){ toast('Şablon bulunamadı'); return; }
  currentTplId = templateId;
  prefill = prefill || {};
  document.getElementById('tplModalTitle').textContent = tpl.title;
  const fieldsWrap = document.getElementById('tplModalFields');
  fieldsWrap.innerHTML = tpl.fields.map(f=>{
    const val = prefill[f.key] ? escapeHtml(prefill[f.key]) : '';
    if(f.type === 'textarea'){
      return `<div class="field"><label>${escapeHtml(f.label)}</label><textarea data-field="${f.key}">${val}</textarea></div>`;
    }
    if(f.type === 'date'){
      return `<div class="field"><label>${escapeHtml(f.label)}</label><input type="date" data-field="${f.key}" value="${val}"></div>`;
    }
    return `<div class="field"><label>${escapeHtml(f.label)}</label><input type="text" data-field="${f.key}" value="${val}"></div>`;
  }).join('');
  document.getElementById('tplModalResultWrap').style.display = 'none';
  document.getElementById('tplModalResult').value = '';
  document.getElementById('tplGenerateBtn').style.display = 'inline-flex';
  document.getElementById('tplGenerateBtn').textContent = 'Belgeyi Oluştur';
  document.getElementById('tplGenerateBtn').onclick = generateFromTplModal;
  openModal('tplModal');
}
function generateFromTplModal(){
  const tpl = TEMPLATES_DB.find(t=>t.id===currentTplId);
  if(!tpl) return;
  const values = {};
  document.querySelectorAll('#tplModalFields [data-field]').forEach(el=>{
    values[el.dataset.field] = el.value;
  });
  const result = renderTemplate(tpl, values);
  document.getElementById('tplModalResultWrap').style.display = 'block';
  document.getElementById('tplModalResult').value = result;
  document.getElementById('tplGenerateBtn').textContent = 'Belgelere Kaydet';
  document.getElementById('tplGenerateBtn').onclick = () => saveTplResultToDocs(tpl);
  toast('Belge oluşturuldu — kontrol edip kaydedebilirsin');
}
function saveTplResultToDocs(tpl){
  const content = document.getElementById('tplModalResult').value;
  state.docs.unshift({
    id: uid(),
    title: tpl.title + ' - ' + new Date().toLocaleDateString('tr-TR'),
    cat: 'Evrak', tags: [tpl.category],
    content, fav: false, date: new Date().toISOString()
  });
  persist('docs'); renderAll();
  toast('Belgeler bölümüne kaydedildi');
  closeModal('tplModal');
}

/* ---------------- Settings ---------------- */
function toggleSetting(key, el){
  state.settings[key] = !state.settings[key];
  el.classList.toggle('on', state.settings[key]);
  persist('settings');
}
function setLang(v){ state.settings.lang = v; persist('settings'); toast('Dil ayarı kaydedildi (İngilizce yakında)'); }
function requestNotifPermission(){
  if(!('Notification' in window)){ toast('Tarayıcın bildirimleri desteklemiyor'); return; }
  Notification.requestPermission().then(p=>{
    toast(p==='granted' ? 'Bildirim izni verildi' : 'Bildirim izni reddedildi');
  });
}
function sendTestNotif(){
  if(!('Notification' in window)){ toast('Tarayıcın bildirimleri desteklemiyor'); return; }
  if(Notification.permission==='granted'){
    new Notification('KALEM', {body:'Bu bir test bildirimidir 🖋️'});
  } else {
    requestNotifPermission();
  }
}
function exportData(){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'kalem-yedek-'+new Date().toISOString().slice(0,10)+'.json';
  a.click(); URL.revokeObjectURL(url);
  toast('Yedek indirildi');
}
function importData(e){
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = evt=>{
    try{
      const data = JSON.parse(evt.target.result);
      if(data.docs) state.docs = data.docs;
      if(data.rems) state.rems = data.rems;
      if(data.settings) state.settings = data.settings;
      if(data.profile) state.profile = data.profile;
      Object.keys(STORE_KEYS).forEach(persist);
      renderAll(); loadProfileForm();
      toast('Veriler içe aktarıldı');
    }catch(err){ toast('Geçersiz yedek dosyası'); }
  };
  reader.readAsText(file);
}
function resetAllData(){
  if(!confirm('Tüm veriler kalıcı olarak silinecek. Emin misin?')) return;
  state = { docs:[], rems:[], settings:{notifications:true, lang:'tr'}, profile:{name:'Kullanıcı', email:'', role:''} };
  Object.keys(STORE_KEYS).forEach(persist);
  renderAll(); loadProfileForm();
  toast('Tüm veriler sıfırlandı');
}

/* ---------------- Profile ---------------- */
function loadProfileForm(){
  document.getElementById('profName').value = state.profile.name || '';
  document.getElementById('profEmail').value = state.profile.email || '';
  document.getElementById('profRole').value = state.profile.role || '';
}
function saveProfile(){
  state.profile = {
    name: document.getElementById('profName').value.trim() || 'Kullanıcı',
    email: document.getElementById('profEmail').value.trim(),
    role: document.getElementById('profRole').value.trim()
  };
  persist('profile');
  renderProfileChip();
  toast('Profil kaydedildi');
}
function renderProfileChip(){
  const initial = (state.profile.name||'K').trim()[0]?.toUpperCase() || 'K';
  document.getElementById('avatarInitial').textContent = initial;
  document.getElementById('topAvatarInitial').textContent = initial;
  document.getElementById('sideProfileName').textContent = state.profile.name || 'Kullanıcı';
  document.getElementById('welcomeGreeting').textContent = 'Hoş geldin, ' + (state.profile.name || 'Kullanıcı');
}

/* ---------------- Dashboard render ---------------- */
function renderDashboard(){
  document.getElementById('statDocs').textContent = state.docs.length;
  document.getElementById('statPending').textContent = state.rems.filter(r=>!r.done).length;
  const todayISO = new Date().toISOString().slice(0,10);
  const in7 = new Date(); in7.setDate(in7.getDate()+7);
  const upcoming = state.rems.filter(r=> r.date && !r.done && r.date>=todayISO && r.date<=in7.toISOString().slice(0,10));
  document.getElementById('statUpcoming').textContent = upcoming.length;
  document.getElementById('statFav').textContent = state.docs.filter(d=>d.fav).length;

  const dashRem = document.getElementById('dashReminders');
  const upcomingSorted = [...state.rems].filter(r=>!r.done).sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')).slice(0,5);
  dashRem.innerHTML = upcomingSorted.length ? upcomingSorted.map(r=>`
    <div class="mini-row">
      <div><div class="mini-row-title">${escapeHtml(r.title)}</div><div class="mini-row-sub">${r.date? new Date(r.date).toLocaleDateString('tr-TR') : 'Tarih yok'}</div></div>
      <span class="pill ${priorityPillClass(r.priority)}">${priorityLabel(r.priority)}</span>
    </div>`).join('') : `<div class="empty-state"><span class="em-ic">✅</span>Bekleyen görev yok</div>`;

  const dashDocs = document.getElementById('dashDocs');
  const recentDocs = [...state.docs].slice(0,5);
  dashDocs.innerHTML = recentDocs.length ? recentDocs.map(d=>`
    <div class="mini-row">
      <div><div class="mini-row-title">${escapeHtml(d.title)}</div><div class="mini-row-sub">${d.cat}</div></div>
      <span>${d.fav?'⭐':''}</span>
    </div>`).join('') : `<div class="empty-state"><span class="em-ic">📄</span>Henüz belge yok</div>`;

  document.getElementById('todayDate').textContent = new Date().toLocaleDateString('tr-TR', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
}

function renderAll(){
  renderDashboard();
  renderDocs();
  renderReminders();
  if(document.getElementById('page-calendar').classList.contains('active')) renderCalendar();
}

/* ---------------- Init ---------------- */
function init(){
  document.getElementById('notifSwitch').classList.toggle('on', !!state.settings.notifications);
  document.getElementById('langSelect').value = state.settings.lang || 'tr';
  loadProfileForm();
  renderProfileChip();
  loadCustomTemplatesIntoDb();
  if(state.docs.length===0 && state.rems.length===0){
    // Örnek içerik ilk kullanım için
    state.docs = [{id:uid(), title:'KALEM\'e Hoş Geldin', cat:'Not', tags:['başlangıç'], content:'Bu senin ilk notun. Sol menüden Belgeler, Hatırlatıcılar ve Takvim bölümlerini keşfedebilirsin.', fav:true, date:new Date().toISOString()}];
    state.rems = [{id:uid(), title:'KALEM\'i keşfet', date:new Date().toISOString().slice(0,10), priority:'low', note:'', done:false}];
    persist('docs'); persist('rems');
  }
  pushMsg('ai', 'Merhaba! Ben KALEM\'in yerel asistanıyım. Sorularını buraya yazabilirsin.');
  renderAll();
}
init();
