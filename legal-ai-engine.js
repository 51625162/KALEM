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

if (typeof module !== "undefined") {
  module.exports = {
    legalSmartSearch, getMevzuatById, formatMevzuatCard,
    renderTemplate, buildKararWithDayanak, KalemWizard,
    detectIntent, kalemAiRespond
  };
}

/* =========================================================================
   ENTEGRASYON NOTLARI (KALEM app.js / script.js içine eklemek için)
   =========================================================================
   1) index.html <head> içine, script.js'ten ÖNCE şu iki satırı ekleyin:
        <script src="legal-ai-data.js"></script>
        <script src="legal-ai-engine.js"></script>

   2) Eski sendChat() fonksiyonunu şu şekilde güncelleyin:

        function sendChat(){
          const input = document.getElementById('chatInput');
          const text = input.value.trim();
          if(!text) return;
          pushMsg('user', text);
          input.value = '';
          const res = kalemAiRespond(text);
          setTimeout(()=> pushMsg('ai', res.text), 300);
          if(res.action) handleAiAction(res.action); // opsiyonel: sihirbazı otomatik açar
        }

   3) Sihirbazı UI'a bağlamak için (opsiyonel ama önerilir):
        - Bir modal açın, KalemWizard örneği oluşturun:
            const wiz = new KalemWizard('tpl-olay-tutanagi', (result) => {
              // result: doldurulmuş resmi metin (string)
              // burada bir <textarea> veya yeni bir "Belge" kaydına yazabilirsiniz
            });
        - Her adımda wiz.currentQuestionText() ile soruyu göster,
          kullanıcı cevap verince wiz.submitAnswer(value) çağırın.
        - wiz.isDone() true olunca onComplete tetiklenir.

   4) Üretilen metni doğrudan KALEM'in Belgeler modülüne kaydetmek isterseniz:
        state.docs.unshift({
          id: uid(), title: 'Olay Tutanağı - ' + new Date().toLocaleDateString('tr-TR'),
          cat: 'Evrak', tags: ['tutanak'], content: result, fav: false,
          date: new Date().toISOString()
        });
        persist('docs'); renderAll();

   5) MEVZUAT_DB içindeki "DOĞRULANMADI" etiketli kayıtları resmi kaynakla
      doldurmadan gerçek kararlarda dayanak olarak KULLANMAYIN.
   ========================================================================= */
