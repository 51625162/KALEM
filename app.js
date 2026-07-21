/* =========================================================
   KALEM — tek dosyalık, tamamen offline uygulama
   Depolama: localStorage, önek "kalem_"
   ========================================================= */

/* ---------------- Yardımcı fonksiyonlar ---------------- */
const Store = {
  get(key, fallback){
    try{ const v = localStorage.getItem('kalem_'+key); return v ? JSON.parse(v) : fallback; }
    catch(e){ return fallback; }
  },
  set(key, val){ localStorage.setItem('kalem_'+key, JSON.stringify(val)); },
};

function uid(){ return 'id'+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function nowIso(){ return new Date().toISOString(); }
function fmtDate(iso){
  const d = new Date(iso);
  if(isNaN(d)) return '—';
  return d.toLocaleDateString('tr-TR', {day:'2-digit', month:'2-digit', year:'numeric'});
}
function fmtDateTime(iso){
  const d = new Date(iso);
  if(isNaN(d)) return '—';
  return d.toLocaleDateString('tr-TR')+' '+d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
}
function escapeHtml(s){
  return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._h);
  toast._h = setTimeout(()=>t.classList.remove('show'), 2600);
}
function download(filename, content, mime){
  const blob = new Blob([content], {type:mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

/* ---------------- Router ---------------- */
const Router = {
  titles:{
    dashboard:['Dashboard','KALEM / Dashboard'],
    ai:['KALEM AI','KALEM / KALEM AI · Karar Motoru'],
    word:['Word Studio','KALEM / Stüdyolar / Word'],
    excel:['Excel Studio','KALEM / Stüdyolar / Excel'],
    pdf:['PDF Studio','KALEM / Stüdyolar / PDF'],
    archive:['Arşiv','KALEM / Arşiv'],
    calendar:['Takvim & Hatırlatıcılar','KALEM / Takvim'],
    settings:['Ayarlar','KALEM / Ayarlar'],
  },
  go(name){
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('active'));
    const sec = document.getElementById('sec-'+name);
    if(sec) sec.classList.add('active');
    const item = document.querySelector('.menu-item[data-target="'+name+'"]');
    if(item) item.classList.add('active');
    const t = this.titles[name] || [name,''];
    document.getElementById('pageTitle').textContent = t[0];
    document.getElementById('pageBreadcrumb').textContent = t[1];
    document.getElementById('sidebar').classList.remove('open');
    // sayfa girişlerinde tazele
    if(name==='dashboard') Dashboard.render();
    if(name==='ai') KalemAI.updateModeIndicator();
    if(name==='archive') Docs.renderArchive();
    if(name==='calendar') Calendar.render();
    if(name==='pdf') PdfStudio.populateSelect();
    if(name==='settings') Settings.load();
    if(name==='excel') ExcelStudio.render();
    if(name==='word'){ if(!WordStudio._initialized) WordStudio.init(); WordStudio.renderPhrasePanel(); }
    window.scrollTo(0,0);
  }
};
document.querySelectorAll('.menu-item').forEach(el=>{
  el.addEventListener('click', ()=>Router.go(el.dataset.target));
});
document.getElementById('hamburgerBtn').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('open');
});

/* ---------------- Saat ---------------- */
function tickClock(){
  const d = new Date();
  document.getElementById('clockTime').textContent = d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  document.getElementById('clockDate').textContent = d.toLocaleDateString('tr-TR',{weekday:'long', day:'2-digit', month:'long', year:'numeric'});
}
tickClock(); setInterval(tickClock, 15000);

/* ---------------- Modal ---------------- */
const Modal = {
  open(title, bodyHtml, footHtml){
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('modalFoot').innerHTML = footHtml || '';
    document.getElementById('modalOverlay').classList.add('open');
  },
  close(){ document.getElementById('modalOverlay').classList.remove('open'); }
};
document.getElementById('modalOverlay').addEventListener('click', (e)=>{
  if(e.target.id==='modalOverlay') Modal.close();
});

/* =========================================================
   MEVZUAT — örnek veri tabanı (JS içinde gömülü)
   ========================================================= */
const MEVZUAT_DB = [
  {id:'m1', kanun:'5275 Sayılı Kanun', madde:'Madde 42', baslik:'Disiplin cezalarını gerektiren eylemler', konu:'disiplin, hakaret, itaatsizlik',
    metin:'Hükümlünün kurum düzenini bozan, görevliye saygısızlık eden veya itaatsizlik eden davranışları disiplin cezasını gerektirir. Ceza türü, eylemin ağırlığına göre kurum idaresince belirlenir.'},
  {id:'m2', kanun:'5275 Sayılı Kanun', madde:'Madde 44', baslik:'Disiplin cezaları', konu:'disiplin cezası, kınama, hücre',
    metin:'Disiplin cezaları kınama, bazı etkinliklere katılmaktan alıkoyma, ücretli işten yoksun bırakma ve hücreye koyma cezalarından oluşur; ceza, savunma alınmadan verilemez.'},
  {id:'m3', kanun:'5275 Sayılı Kanun', madde:'Madde 46', baslik:'Disiplin soruşturması ve savunma hakkı', konu:'savunma, soruşturma, tutanak',
    metin:'Disiplin cezası verilmeden önce hükümlünün savunması yazılı veya sözlü olarak alınır ve bu husus tutanağa geçirilir; savunma alınmadan ceza verilemez.'},
  {id:'m4', kanun:'CGTİHK Yönetmeliği', madde:'Madde 91', baslik:'Ziyaret ve görüşme usulleri', konu:'ziyaret, görüşme, aile',
    metin:'Hükümlü ve tutuklular, yönetmelikte belirlenen gün ve saatlerde, kimliği belirlenmiş kişilerle görevli gözetiminde görüşme yapabilir; görüşme koşulları kurum güvenlik gerekçeleriyle sınırlandırılabilir.'},
  {id:'m5', kanun:'5275 Sayılı Kanun', madde:'Madde 116', baslik:'Açık kuruma ayırma şartları', konu:'açık kurum, nakil, iyi hal',
    metin:'İyi halli hükümlülerin, cezalarının belirli bir kısmını infaz etmiş olmaları ve idare ve gözlem kurulunun olumlu görüşü halinde açık ceza infaz kurumuna ayrılmalarına karar verilebilir.'},
  {id:'m6', kanun:'5402 Sayılı Kanun', madde:'Madde 4', baslik:'Denetimli serbestlik hizmetlerinin kapsamı', konu:'denetimli serbestlik, yükümlülük, rehberlik',
    metin:'Denetimli serbestlik, salıverilen veya mahkemece yükümlülük altına alınan kişilerin toplum içinde izlenmesi, denetlenmesi, iyileştirilmesi ve toplumla bütünleşmesini sağlamaya yönelik hizmetleri kapsar.'},
  {id:'m7', kanun:'Denetimli Serbestlik Yönetmeliği', madde:'Madde 21', baslik:'Yükümlülüğe uymama halinin bildirimi', konu:'yükümlülük ihlali, bildirim, rapor',
    metin:'Yükümlünün, denetimli serbestlik tedbirlerine ilişkin yükümlülüklerine uymadığının tespiti halinde durum gerekçeli bir raporla ilgili mahkemeye veya Cumhuriyet başsavcılığına bildirilir.'},
  {id:'m8', kanun:'5275 Sayılı Kanun', madde:'Madde 68', baslik:'Sağlık hizmetlerinden yararlanma', konu:'sağlık, muayene, hastane sevk',
    metin:'Hükümlü ve tutuklular kurumda bulunan sağlık birimlerinden yararlanır; kurum imkânlarının yetersiz kalması halinde ilgili sağlık kuruluşuna sevk edilirler.'},
  {id:'m9', kanun:'CGTİHK Yönetmeliği', madde:'Madde 130', baslik:'Eşya ve para ile ilgili işlemler', konu:'eşya, emanet, para',
    metin:'Hükümlü ve tutuklulara ait para ve değerli eşyalar kurum idaresince kayıt altına alınarak emanete alınır; giriş ve çıkışta tutanakla teslim edilir.'},
  {id:'m10', kanun:'5275 Sayılı Kanun', madde:'Madde 25', baslik:'Nakil işlemleri', konu:'nakil, sevk, kurum değişikliği',
    metin:'Hükümlülerin bir kurumdan diğerine nakli, güvenlik, sağlık, kapasite veya idarenin gerekli gördüğü diğer hallerde mevzuata uygun şekilde ve gerekçe belirtilerek yapılır.'},
  {id:'m11', kanun:'5275 Sayılı Kanun', madde:'Madde 89', baslik:'Kurum içi olayların tutanağa bağlanması', konu:'tutanak, olay, kayıt',
    metin:'Kurum içinde meydana gelen ve idari veya adli işlem gerektiren her olay, olay yeri ve zamanı belirtilerek görevlilerce tutanağa bağlanır ve ilgili birime iletilir.'},
  {id:'m12', kanun:'Denetimli Serbestlik Yönetmeliği', madde:'Madde 9', baslik:'Yükümlünün çağrılması ve görüşme', konu:'çağrı, görüşme, rehberlik',
    metin:'Şube müdürlüğü, yükümlüyü belirlenen sıklıkla görüşmeye çağırır; görüşme sonucu, yükümlünün uyumu ve gelişimi hakkında rapor tutulur.'},
  {id:'m13', kanun:'5275 Sayılı Kanun', madde:'Madde 107', baslik:'Koşullu salıverilme şartları', konu:'koşullu salıverilme, şartla tahliye, iyi hal',
    metin:'Koşullu salıverilmeden yararlanabilmek için hükümlünün cezasının kanunda belirtilen kısmını iyi halli olarak infaz kurumunda geçirmiş olması gerekir; iyi hal değerlendirmesi idare ve gözlem kurulunca yapılır.'},
  {id:'m14', kanun:'5275 Sayılı Kanun', madde:'Madde 78', baslik:'İş yurtlarında çalıştırma', konu:'iş yurdu, çalıştırma, meslek edinme',
    metin:'Hükümlüler, istekleri ve yetenekleri dikkate alınarak iş yurtlarında çalıştırılabilir; çalıştırma, hükümlünün meslek edinmesi ve topluma uyumuna katkı sağlamayı amaçlar.'},
  {id:'m15', kanun:'5275 Sayılı Kanun', madde:'Madde 94', baslik:'Mazeret izni', konu:'mazeret izni, izin, aile',
    metin:'Hükümlüye, yakınlarının ölümü, ağır hastalığı veya doğal afet gibi zorunlu hallerde, kurum en üst amirinin önerisi ve Cumhuriyet başsavcılığının onayı ile mazeret izni verilebilir.'},
  {id:'m16', kanun:'CGTİHK Yönetmeliği', madde:'Madde 103', baslik:'Telefon ile haberleşme hakkı', konu:'telefon, haberleşme, iletişim',
    metin:'Hükümlü ve tutuklular, idarenin kontrolünde ve belirlenen usullere uygun olarak telefonla görüşme hakkından yararlanır; disiplin cezası uygulananların bu hakkı sınırlandırılabilir.'},
  {id:'m17', kanun:'CGTİHK Yönetmeliği', madde:'Madde 88', baslik:'Açık ve kapalı görüş', konu:'açık görüş, kapalı görüş, ziyaret',
    metin:'Hükümlü ve tutuklular, mevzuatta belirlenen usul ve esaslar çerçevesinde açık veya kapalı görüş yoluyla ziyaretçileriyle görüşebilir; disiplin cezası veya güvenlik gerekçeleriyle bu hak sınırlandırılabilir.'},
  {id:'m18', kanun:'CGTİHK Yönetmeliği', madde:'Madde 67', baslik:'Oda ve koğuş düzeni, barındırma', konu:'oda değişikliği, koğuş, barındırma',
    metin:'Hükümlü ve tutukluların oda ve koğuşlara yerleştirilmesinde kapasite, güvenlik, sağlık durumu ve uyum gözetilir; barındırma düzeninde değişiklik yapılması kurum idaresinin takdirindedir.'},
  {id:'m19', kanun:'CGTİHK Yönetmeliği', madde:'Madde 71', baslik:'Kantin hizmetleri ve dışarıdan eşya/ilaç temini', konu:'kantin, ilaç temini, eşya temini',
    metin:'Hükümlü ve tutukluların ihtiyaçları esas olarak kurum kantini aracılığıyla karşılanır; kantinde bulunmayan ilaç ve malzemenin temini, güvenlik ve sağlık mevzuatına uygun şekilde idarenin iznine tabidir.'},
  {id:'m20', kanun:'5275 Sayılı Kanun', madde:'Madde 16', baslik:'Yüksek güvenlikli kurumlara ayırma', konu:'yüksek güvenlikli kurum, güvenlik riski',
    metin:'Örgütlü suçlardan hükümlü olanlar veya kurum güvenliği açısından risk oluşturan hükümlüler, niteliklerine uygun yüksek güvenlikli ceza infaz kurumlarında barındırılır.'},
  {id:'m21', kanun:'5275 Sayılı Kanun', madde:'Madde 95', baslik:'Hastaneye ve mahkemeye sevk', konu:'hastane sevk, mahkeme sevk, nakil',
    metin:'Hükümlü ve tutukluların mahkemeye veya sağlık kuruluşuna sevki, gerekli güvenlik tedbirleri alınarak ve giriş-çıkış kayıtları tutularak gerçekleştirilir.'},
];

const Mevzuat = {
  search(text, limit){
    const q = text.toLowerCase();
    const words = q.split(/[\s,.]+/).filter(w=>w.length>3);
    const scored = MEVZUAT_DB.map(m=>{
      const hay = (m.konu+' '+m.baslik+' '+m.metin).toLowerCase();
      let score = 0;
      words.forEach(w=>{ if(hay.includes(w)) score++; });
      m.konu.split(',').forEach(k=>{ k=k.trim(); if(k && q.includes(k)) score += 2; });
      return {m, score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    return scored.slice(0, limit||3).map(x=>x.m);
  }
};

/* =========================================================
   ŞABLON MERKEZİ — gömülü şablon verisi
   Placeholders: {{KURUM}}, {{TARIH}}, {{AD_SOYAD}}, {{KONU}}, {{ICERIK}}
   ========================================================= */
const TEMPLATES = [
  {id:'n1', cat:'Karar', title:'Açık Ceza İnfaz Kurumuna Ayırma Talebinin Reddi (Örgütsel Tutum ve Davranışlar Nedeniyle)', desc:'Terör örgütü üyeliği nedeniyle hükümlü olan ve örgütsel tutumunu terk etmediği değerlendirilen hükümlü için ret kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>AÇIK CEZA İNFAZ KURUMUNA AYIRMA TALEBİNİN REDDİ (ÖRGÜTSEL TUTUM VE DAVRANIŞLAR NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, infaz evrakları, disiplin kayıtları, gözlem ve değerlendirme raporları ile İdare ve Gözlem Kurulu tarafından temin edilen bilgi ve belgeler incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün terör örgütü üyeliği suçundan hükümlü bulunduğu, kurum içerisinde bulunduğu süre zarfında örgütsel tutum ve davranışlarını tamamen terk ettiğine ilişkin yeterli kanaat oluşmadığı, iyileştirme faaliyetlerinden beklenen düzeyde yararlanamadığı ve yeniden suç işlememe yönünde yeterli farkındalık geliştirmediği değerlendirilmiştir.</p>
<p>Ayrıca hükümlünün kurum içerisindeki tutum ve davranışları, gözlem raporları ve güvenlik değerlendirmeleri birlikte ele alındığında açık ceza infaz kurumlarının temelini oluşturan güven esaslı infaz rejimine uyum sağlayabileceği hususunda yeterli olumlu kanaat oluşmadığı anlaşılmıştır.</p>
<p>Bu nedenle hükümlünün açık ceza infaz kurumuna ayrılma şartlarını henüz yeterli düzeyde taşımadığı değerlendirildiğinden, Açık Ceza İnfaz Kurumuna Ayrılma Talebinin reddine karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n2', cat:'Karar', title:'Koşullu Salıverilme Değerlendirmesinin Olumsuz Sonuçlandırılması (Olumsuz İyi Hâl Değerlendirmesi Nedeniyle)', desc:'Disiplin yaptırımları ve yetersiz farkındalık nedeniyle koşullu salıverilme değerlendirmesinin olumsuz sonuçlandırılması.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>KOŞULLU SALIVERİLME DEĞERLENDİRMESİNİN OLUMSUZ SONUÇLANDIRILMASI (OLUMSUZ İYİ HÂL DEĞERLENDİRMESİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün koşullu salıverilme değerlendirmesine esas olmak üzere dosyası, infaz evrakları, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, psikososyal servis raporları, eğitim ve iyileştirme faaliyetlerine katılım durumu ile diğer bilgi ve belgeler incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün infaz süreci içerisinde kurum kurallarına uyum konusunda yeterli istikrar sağlayamadığı, çeşitli tarihlerde disiplin yaptırımlarına konu davranışlarda bulunduğu, eğitim ve iyileştirme faaliyetlerinden beklenen düzeyde yararlanamadığı tespit edilmiştir.</p>
<p>Ayrıca yapılan bireysel görüşmeler, gözlem kayıtları ve kurumsal değerlendirmelerde; hükümlünün işlediği suçun sonuçları konusunda yeterli farkındalık geliştirmediği, yeniden suç işlememe yönünde kalıcı davranış değişikliği oluşturduğuna ilişkin yeterli olumlu kanaat oluşmadığı değerlendirilmiştir.</p>
<p>Hükümlünün disiplin durumu, kuruma uyumu, gözlem sonuçları, iyileştirme faaliyetlerine katılım düzeyi ve yeniden suç işleme riski birlikte değerlendirildiğinde; koşullu salıverilmenin temel şartlarından olan iyi hâl yönünden yeterli olumlu kanaat oluşmadığı anlaşılmıştır.</p>
<p>Bu nedenle hükümlü hakkında iyi hâl değerlendirmesinin olumsuz olduğuna, koşullu salıverilme değerlendirmesinin olumsuz sonuçlandırılmasına ve bir sonraki değerlendirme dönemine kadar infazına bulunduğu kurumda devam edilmesine karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n3', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (ASAYİŞ VE GÜVENLİK NEDENİYLE)', desc:'Asayiş ve güvenlik nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (ASAYİŞ VE GÜVENLİK NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, kurum kayıtları, güvenlik değerlendirme raporları, disiplin durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün kurum içerisinde bulunduğu süre zarfında diğer hükümlülerle çeşitli sorunlar yaşadığı, bulunduğu yaşam alanında gerginliklere neden olduğu, kurum personelinin uyarı ve yönlendirmelerine rağmen kuruma uyum konusunda istenilen seviyeye ulaşamadığı tespit edilmiştir.</p>
<p>Ayrıca hükümlünün mevcut kurumda barındırılmaya devam edilmesinin kurum asayişi ve güvenliği açısından risk oluşturabileceği, kurum düzeninin korunması ve infaz hizmetlerinin etkin şekilde yürütülmesi bakımından ilave tedbir alınmasını gerektirdiği değerlendirilmiştir.</p>
<p>Tüm dosya kapsamı, güvenlik değerlendirmeleri, kurum içerisindeki tutum ve davranışları ile ilgili birim görüşleri birlikte değerlendirildiğinde; hükümlünün mevcut kurumda kalmasının kurum güvenliği ve asayişi açısından sakınca oluşturabileceği kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlünün kurum asayiş ve güvenliğinin sağlanması, kurum düzeninin korunması ve infaz hizmetlerinin etkin şekilde yürütülmesi amacıyla durumuna uygun başka bir ceza infaz kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n4', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (DİSİPLİN CEZALARI VE KURUMA UYUMSUZLUK NEDENİYLE)', desc:'Disiplin cezaları ve kuruma uyumsuzluk nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (DİSİPLİN CEZALARI VE KURUMA UYUMSUZLUK NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, güvenlik değerlendirmeleri ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün kurumda bulunduğu süre içerisinde çeşitli tarihlerde disiplin yaptırımı uygulanmasını gerektiren eylemlerde bulunduğu, kurum kurallarına uymakta isteksiz davrandığı, personelin uyarı ve yönlendirmelerine rağmen olumsuz tutum ve davranışlarını sürdürdüğü tespit edilmiştir.</p>
<p>Hükümlünün diğer hükümlülerle olan ilişkilerinde uyum sorunu yaşadığı, zaman zaman kurum düzenini bozabilecek davranışlar sergilediği, mevcut tutum ve davranışlarının kurum disiplininin sağlanmasını olumsuz etkilediği değerlendirilmiştir.</p>
<p>Disiplin geçmişi, kuruma uyum düzeyi, gözlem raporları ve güvenlik değerlendirmeleri birlikte ele alındığında; hükümlünün mevcut kurumda barındırılmaya devam edilmesinin kurum düzeni, disiplini ve güvenliği açısından sakınca oluşturabileceği kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlünün disiplin durumu, kuruma uyumsuzluğu ve kurum düzeninin korunması gerekliliği dikkate alınarak durumuna uygun başka bir ceza infaz kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n5', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (HASIMLILIK NEDENİYLE)', desc:'Hasımlılık nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (HASIMLILIK NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, kurum kayıtları, güvenlik değerlendirme raporları, dilekçeleri ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün kurumda barındırılan bazı hükümlüler ile aralarında geçmişe dayanan husumet bulunduğu, taraflar arasında yaşanabilecek olası olayların kurum güvenliği ve asayişi açısından risk oluşturabileceği tespit edilmiştir.</p>
<p>Mevcut husumet nedeniyle tarafların aynı kurumda barındırılmaya devam edilmesinin can güvenliği yönünden sakınca doğurabileceği, kurum personeli tarafından alınan tedbirlere rağmen riskin tamamen ortadan kaldırılamadığı, kurum düzeni ve güvenliğinin korunması amacıyla ek tedbir alınmasının gerekli olduğu değerlendirilmiştir.</p>
<p>Tarafların güvenliği, kurum asayişi, güvenlik değerlendirmeleri ve ilgili birim görüşleri birlikte dikkate alındığında; olası olumsuzlukların önlenmesi ve güvenlik risklerinin ortadan kaldırılması amacıyla hükümlünün başka bir kurumda barındırılmasının uygun olacağı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlünün can güvenliğinin sağlanması, kurum asayiş ve güvenliğinin korunması ve mevcut hasımlılık durumundan kaynaklanan risklerin ortadan kaldırılması amacıyla durumuna uygun başka bir ceza infaz kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n6', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (ÖRGÜTSEL FAALİYETLER VE İSTİHBARİ DEĞERLENDİRMELER NEDENİYLE)', desc:'Örgütsel faaliyetler ve istihbari değerlendirmeler nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (ÖRGÜTSEL FAALİYETLER VE İSTİHBARİ DEĞERLENDİRMELER NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, kurum kayıtları, disiplin durumu, güvenlik ve istihbarat değerlendirme raporları ile ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün kurum içerisinde örgütsel saiklerle hareket ettiğine, diğer hükümlüler üzerinde etkide bulunmaya çalıştığına, örgütsel birlikteliği ve dayanışmayı canlı tutmaya yönelik faaliyetlerde bulunduğuna ilişkin bilgi ve değerlendirmelerin bulunduğu anlaşılmıştır.</p>
<p>Ayrıca hükümlünün kurum içerisinde gerçekleştirilen bazı toplu eylem ve protesto faaliyetleriyle ilişkilendirildiği, benzer düşünce yapısına sahip hükümlüler üzerinde yönlendirici etkisinin bulunduğuna dair istihbari tespitlerin mevcut olduğu, bu durumun kurum güvenliği ve disiplinini olumsuz etkileyebilecek nitelikte olduğu değerlendirilmiştir.</p>
<p>Mevcut durumun devam etmesi halinde kurum içerisinde gruplaşma, örgütsel motivasyonun artırılması ve kurum düzeninin bozulması risklerinin ortaya çıkabileceği, infaz hizmetlerinin güvenli ve etkin şekilde yürütülmesinin olumsuz etkilenebileceği kanaatine varılmıştır.</p>
<p>Tüm dosya kapsamı, güvenlik ve istihbarat değerlendirmeleri, kurum içerisindeki tutum ve davranışları ile ilgili birim görüşleri birlikte değerlendirildiğinde; hükümlünün mevcut kurumda barındırılmasının kurum asayiş ve güvenliği açısından sakınca oluşturabileceği anlaşılmıştır.</p>
<p>Bu nedenle hükümlünün kurum güvenliğinin sağlanması, örgütsel faaliyet ve yönlendirmelerin önlenmesi, kurum disiplininin korunması ve infaz hizmetlerinin etkin şekilde yürütülmesi amacıyla durumuna uygun başka bir ceza infaz kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n7', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (HASTANE SEVKİNDE FİRAR TEŞEBBÜSÜ/FİRAR NEDENİYLE)', desc:'Hastane sevkinde firar teşebbüsü/firar nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (HASTANE SEVKİNDE FİRAR TEŞEBBÜSÜ/FİRAR NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, disiplin kayıtları, sevk evrakları, olay tutanakları, güvenlik değerlendirme raporları ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün hastane sevki sırasında güvenlik tedbirlerini bertaraf etmeye yönelik davranışlarda bulunduğu, firar etmeye teşebbüs ettiği veya firar eylemini gerçekleştirdiği, bu nedenle hakkında gerekli adli ve idari işlemlerin başlatıldığı anlaşılmıştır.</p>
<p>Söz konusu eylemin, hükümlünün infaz rejimine uyum göstermediğini, güvenlik tedbirlerine riayet etme konusunda yeterli hassasiyeti taşımadığını ve yeniden firar girişiminde bulunma riskinin bulunduğunu ortaya koyduğu değerlendirilmiştir.</p>
<p>Ayrıca hükümlünün mevcut kurumda barındırılmaya devam edilmesinin kurum güvenliği açısından risk oluşturabileceği, sevk ve dış güvenlik işlemlerinin yürütülmesinde ilave güvenlik tedbirleri alınmasını gerektirdiği, infaz hizmetlerinin güvenli şekilde sürdürülmesini olumsuz etkileyebileceği kanaatine varılmıştır.</p>
<p>Tüm dosya kapsamı, olay tutanakları, güvenlik değerlendirmeleri ve firar teşebbüsü/firar eylemine ilişkin kayıtlar birlikte değerlendirildiğinde; hükümlünün mevcut kurumda kalmasının uygun olmadığı ve daha sıkı güvenlik tedbirleri uygulanabilecek bir kurumda barındırılmasının gerekli olduğu sonucuna ulaşılmıştır.</p>
<p>Bu nedenle hükümlünün hastane sevki sırasında gerçekleştirdiği firar teşebbüsü/firar eylemi nedeniyle kurum güvenliğinin sağlanması, yeniden firar riskinin önlenmesi ve infaz hizmetlerinin güvenli şekilde yürütülmesi amacıyla durumuna uygun başka bir ceza infaz kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n8', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (KORUMA VE CAN GÜVENLİĞİ NEDENİYLE)', desc:'Koruma ve can güvenliği nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (KORUMA VE CAN GÜVENLİĞİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, kurum kayıtları, güvenlik değerlendirme raporları, dilekçeleri, olay tutanakları ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün kurum içerisinde bazı hükümlü/tutuklularla yaşadığı sorunlar, kendisine yönelik tehdit iddiaları, hasımlılık durumu ve güvenlik değerlendirmeleri dikkate alındığında mevcut kurumda barındırılmasının can güvenliği açısından risk oluşturabileceği anlaşılmıştır.</p>
<p>Ayrıca hükümlünün güvenliğinin sağlanması amacıyla kurum içerisinde alınan tedbirlere rağmen riskin tamamen ortadan kaldırılamadığı, mevcut durumun devam etmesi halinde hükümlünün fiziksel güvenliğinin tehlikeye düşebileceği değerlendirilmiştir.</p>
<p>İlgili birim görüşleri, güvenlik raporları ve dosya kapsamındaki bilgiler birlikte değerlendirildiğinde; hükümlünün can güvenliğinin sağlanması, olası saldırı ve çatışmaların önlenmesi, kurum asayiş ve güvenliğinin korunması amacıyla başka bir kurumda barındırılmasının uygun olacağı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlünün can güvenliğinin sağlanması, korunması ve kurum güvenliğinin muhafazası amacıyla durumuna uygun başka bir ceza infaz kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n9', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (GÜVENLİK RİSKİ VE DİSİPLİN DURUMU NEDENİYLE — YÜKSEK GÜVENLİKLİ KURUMA)', desc:'Güvenlik riski ve disiplin durumu (Yüksek Güvenlikli Kuruma) nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (GÜVENLİK RİSKİ VE DİSİPLİN DURUMU NEDENİYLE — YÜKSEK GÜVENLİKLİ KURUMA)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, infaz evrakları, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, güvenlik değerlendirmeleri ile ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün kurumda bulunduğu süre içerisinde kurum düzenini ve güvenliğini olumsuz etkileyen davranışlarda bulunduğu, hakkında çeşitli disiplin işlemleri tesis edildiği, kurum kurallarına uyum konusunda ciddi sorunlar yaşadığı ve mevcut güvenlik tedbirlerinin yetersiz kalmasına neden olabilecek tutumlar sergilediği tespit edilmiştir.</p>
<p>Ayrıca hükümlünün diğer hükümlüler üzerinde etkide bulunmaya çalıştığı, kurum içerisinde gruplaşmaya neden olabilecek faaliyetlerde bulunduğu, güvenlik ve asayiş yönünden risk teşkil eden davranışlarını sürdürdüğü yönündeki tespit ve değerlendirmeler dikkate alınmıştır.</p>
<p>Disiplin geçmişi, güvenlik değerlendirmeleri, kurum içerisindeki tutum ve davranışları ile yeniden güvenlik riski oluşturma ihtimali birlikte değerlendirildiğinde; hükümlünün daha sıkı güvenlik tedbirleri altında barındırılmasının kurum güvenliği ve infaz hizmetlerinin etkin şekilde yürütülmesi açısından gerekli olduğu kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlünün kurum güvenliğinin sağlanması, disiplinin korunması, güvenlik risklerinin azaltılması ve infaz hizmetlerinin etkin şekilde yürütülmesi amacıyla durumuna uygun Yüksek Güvenlikli Ceza İnfaz Kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n10', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (SAĞLIK NEDENİYLE TEDAVİ VE UZMANLIK GEREKSİNİMİ)', desc:'Sağlık nedeniyle tedavi ve uzmanlık gereksinimi nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (SAĞLIK NEDENİYLE TEDAVİ VE UZMANLIK GEREKSİNİMİ)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, sağlık raporları, hastane sevk kayıtları, kurum sağlık servisi değerlendirmeleri, infaz durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün mevcut sağlık durumunun düzenli takip ve tedavi gerektirdiği, bulunduğu kurumda gerekli sağlık hizmetlerine erişim konusunda güçlük yaşanabileceği, tedavisinin daha uygun şartlarda ve uzman sağlık kuruluşları aracılığıyla sürdürülebilmesi amacıyla başka bir kurumda barındırılmasının uygun olacağı değerlendirilmiştir.</p>
<p>Ayrıca yapılacak naklin hükümlünün sağlık hakkının korunması, tedavi sürecinin aksamadan devam ettirilmesi ve sağlık hizmetlerinin daha etkin yürütülmesi açısından gerekli olduğu, kurum güvenliği ve infaz hizmetleri yönünden herhangi bir sakınca oluşturmadığı kanaatine varılmıştır.</p>
<p>Sağlık durumu, tedavi gereksinimi, kurum imkânları ve ilgili sağlık birimi görüşleri birlikte değerlendirildiğinde; hükümlünün durumuna uygun bir ceza infaz kurumunda barındırılmasının uygun olacağı sonucuna ulaşılmıştır.</p>
<p>Bu nedenle hükümlünün sağlık durumunun gerektirdiği tedavi ve takip işlemlerinin daha uygun şartlarda yürütülmesi amacıyla durumuna uygun başka bir ceza infaz kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n11', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (AÇLIK GREVİ/EYLEM ORGANİZASYONU VE KURUM GÜVENLİĞİ NEDENİYLE)', desc:'Açlık grevi/eylem organizasyonu nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (AÇLIK GREVİ/EYLEM ORGANİZASYONU VE KURUM GÜVENLİĞİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, kurum kayıtları, olay tutanakları, disiplin durumu, güvenlik değerlendirme raporları, gözlem kayıtları ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün kurum içerisinde gerçekleştirilen açlık grevi, toplu eylem veya benzeri faaliyetlere katıldığı, bu faaliyetlerin organizasyonu veya sürdürülmesi sürecinde etkili olduğu yönünde bilgi ve değerlendirmelerin bulunduğu anlaşılmıştır.</p>
<p>Söz konusu eylemlerin kurum düzeni, güvenliği ve disiplinini olumsuz etkileyebilecek nitelikte olduğu, hükümlünün mevcut kurumda bulunmasının benzer olayların devamı veya yeniden yaşanması yönünden risk oluşturabileceği değerlendirilmiştir.</p>
<p>Ayrıca kurum içerisinde huzur ve güven ortamının korunması, hükümlülerin güvenli şekilde barındırılması ve infaz hizmetlerinin düzenli şekilde yürütülmesi amacıyla gerekli idari tedbirlerin alınmasının zorunlu olduğu kanaatine varılmıştır.</p>
<p>Dosya kapsamı, güvenlik değerlendirmeleri, kurum içi tutum ve davranışlar ile ilgili birim görüşleri birlikte değerlendirildiğinde; hükümlünün mevcut kurumda barındırılmasının uygun olmadığı sonucuna ulaşılmıştır.</p>
<p>Bu nedenle hükümlünün kurum güvenliğinin ve disiplin düzeninin korunması, olası toplu eylem ve olumsuzlukların önlenmesi amacıyla durumuna uygun başka bir ceza infaz kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n12', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (DİSİPLİN DURUMU, KURUM DÜZENİ VE GÜVENLİĞİ NEDENİYLE)', desc:'Disiplin durumu, kurum düzeni ve güvenliği nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (DİSİPLİN DURUMU, KURUM DÜZENİ VE GÜVENLİĞİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, disiplin kayıtları, olay tutanakları, kurum içi gözlem ve değerlendirme raporları, güvenlik değerlendirmeleri ile ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün kurumda bulunduğu süre içerisinde kurum düzenini bozucu davranışlarda bulunduğu, hakkında birden fazla disiplin işlemi tesis edildiği, kurum kurallarına uyum sağlamakta güçlük çektiği ve olumsuz davranışlarını sürdürdüğü anlaşılmıştır.</p>
<p>Ayrıca hükümlünün diğer hükümlüler üzerinde olumsuz etki oluşturduğu, personelin uyarılarına rağmen kurallara aykırı davranışlarını devam ettirdiği, bulunduğu yaşam alanında huzur ve güven ortamını olumsuz etkilediği yönünde tespit ve değerlendirmelerin bulunduğu görülmüştür.</p>
<p>Mevcut disiplin durumu, kurum içerisindeki tutum ve davranışları, olay tutanakları ve güvenlik değerlendirmeleri birlikte değerlendirildiğinde; hükümlünün mevcut kurumda barındırılmasının kurum asayişi ve güvenliği açısından risk oluşturduğu kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlünün kurum düzeni ve güvenliğinin korunması, disiplin sorunlarının önlenmesi ve infaz hizmetlerinin sağlıklı şekilde yürütülmesi amacıyla durumuna uygun başka bir ceza infaz kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n13', cat:'Karar', title:'Naklen Sevk Edilmesine İlişkin Karar (ASAYİŞ VE GÜVENLİK NEDENİYLE — EK VARYANT)', desc:'Asayiş ve güvenlik (ek varyant) nedeniyle başka bir ceza infaz kurumuna naklen sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKLEN SEVK EDİLMESİNE İLİŞKİN KARAR (ASAYİŞ VE GÜVENLİK NEDENİYLE — EK VARYANT)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün dosyası, kurum kayıtları, olay tutanakları, güvenlik değerlendirme raporları, disiplin durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün kurum içerisinde bulunduğu süre zarfında asayişi ve kurum düzenini olumsuz etkileyebilecek nitelikte davranışlar sergilediği, bu durumun kurum personeli ve diğer hükümlüler açısından güvenlik riski oluşturduğu tespit edilmiştir.</p>
<p>Ayrıca hükümlünün mevcut kurumda barındırılmaya devam edilmesi hâlinde benzer nitelikte olayların tekrarlanabileceği, kurum idaresince alınan tedbirlerin riski tam olarak bertaraf etmekte yetersiz kaldığı, bu nedenle ilave ve kalıcı bir tedbir olarak nakil işleminin gerekli olduğu değerlendirilmiştir.</p>
<p>Dosya kapsamı, güvenlik değerlendirmeleri, olay tutanakları ve ilgili birim görüşleri birlikte ele alındığında; hükümlünün mevcut kurumda kalmasının kurum asayişi ve güvenliği açısından sakınca oluşturacağı, kurum düzeninin ve infaz hizmetlerinin sağlıklı yürütülmesinin ancak nakil ile mümkün olabileceği kanaatine varılmıştır.</p>
<p>Bu nedenle kurum asayiş ve güvenliğinin sağlanması, kurum düzeninin korunması ve infaz hizmetlerinin etkin şekilde yürütülmesi amacıyla hükümlünün durumuna uygun başka bir ceza infaz kurumuna naklen sevk edilmesinin uygun olduğuna karar verilmiştir.</p><p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},
  {id:'n14', cat:'Karar', title:'İş Yurdunda Çalıştırılma Talebinin Kabulü (İyi Hâl, Meslek Edinme ve Topluma Uyum Nedeniyle)', desc:'Disiplin durumu iyi olan, meslek edinmesi hedeflenen hükümlü için iş yurdunda çalıştırma kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>İŞ YURDUNDA ÇALIŞTIRILMA TALEBİNİN KABULÜ (İYİ HÂL, MESLEK EDİNME VE TOPLUMA UYUM NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün iş yurdunda çalıştırılmasına ilişkin talebi, dosyası, kurum içi gözlem kayıtları, disiplin durumu, eğitim ve iyileştirme faaliyetlerine katılımı ile ilgili birim görüşleri birlikte değerlendirilmiştir.</p>
<p>Yapılan inceleme neticesinde; hükümlünün kurum içerisinde bulunduğu süre boyunca kurum kurallarına uyum sağladığı, disiplin yönünden olumsuz bir durumunun bulunmadığı, verilen görev ve sorumlulukları yerine getirme konusunda olumlu tutum sergilediği değerlendirilmiştir.</p>
<p>Ayrıca hükümlünün meslek edinmesi, çalışma alışkanlığı kazanması, sorumluluk bilincinin geliştirilmesi ve topluma yeniden uyum sürecine katkı sağlanması amacıyla iş yurdu faaliyetlerinde görev almasının uygun olacağı kanaatine varılmıştır.</p>
<p>Hükümlünün kişisel özellikleri, yetenekleri, kurum ihtiyaçları ve iş yurdu faaliyetlerinin niteliği birlikte değerlendirildiğinde; çalıştırılmasının kurum güvenliği ve düzeni açısından herhangi bir sakınca oluşturmayacağı değerlendirilmiştir.</p>
<p>Bu nedenle hükümlünün meslek edinmesi, rehabilitasyon sürecine katkı sağlanması ve topluma uyumunun desteklenmesi amacıyla durumuna uygun iş yurdu faaliyetlerinde çalıştırılmasına karar verilmiştir.</p>`},
  {id:'n15', cat:'Karar', title:'İş Yurdunda Çalıştırılma Talebinin Reddi (Güvenlik, Disiplin ve Olumsuz Değerlendirme Nedeniyle)', desc:'Disiplin sorunları nedeniyle iş yurdunda çalıştırma talebinin reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>İŞ YURDUNDA ÇALIŞTIRILMA TALEBİNİN REDDİ (GÜVENLİK, DİSİPLİN VE OLUMSUZ DEĞERLENDİRME NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün iş yurdunda çalıştırılmasına ilişkin talebi, dosyası, kurum kayıtları, disiplin durumu, kurum içi gözlem ve değerlendirme raporları ile ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün kurum içerisinde bulunduğu süre içerisinde disiplin kurallarına aykırı davranışlarda bulunduğu, kurum düzenine uyum konusunda istenilen seviyede olmadığı, verilen görev ve sorumlulukları yerine getirme hususunda yeterli güven vermediği değerlendirilmiştir.</p>
<p>Ayrıca hükümlünün mevcut tutum ve davranışları, güvenlik değerlendirmeleri ve kurum içerisindeki sosyal ilişkileri dikkate alındığında, iş yurdu faaliyetlerinde görevlendirilmesinin kurum güvenliği, işleyişi ve disiplin düzeni açısından uygun olmayacağı kanaatine varılmıştır.</p>
<p>İş yurtlarında çalıştırmanın güven, sorumluluk ve kurallara uyum esasına dayandığı, hükümlünün mevcut durumu itibarıyla bu şartları yeterli düzeyde taşımadığı değerlendirilmiştir.</p>
<p>Bu nedenle hükümlünün iş yurdunda çalıştırılma talebinin, güvenlik, disiplin ve mevcut değerlendirmeler dikkate alınarak reddine karar verilmiştir.</p>`},
  {id:'n16', cat:'Karar', title:'Mazeret İzni Talebinin Reddi (Güvenlik Değerlendirmesi ve Uygunluk Şartları Nedeniyle)', desc:'Şartların oluşmaması nedeniyle mazeret izni talebinin reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>MAZERET İZNİ TALEBİNİN REDDİ (GÜVENLİK DEĞERLENDİRMESİ VE UYGUNLUK ŞARTLARI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün mazeret izni talebi; dosyası, infaz durumu, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları ile ilgili birim görüşleri incelenerek değerlendirilmiştir.</p>
<p>Yapılan inceleme neticesinde; hükümlünün mazeret izninden yararlanmasına ilişkin şartların oluşmadığı, mevcut infaz durumu, kurum içerisindeki tutum ve davranışları, güvenlik değerlendirmeleri ve diğer hususlar birlikte değerlendirildiğinde izin talebinin uygun olmadığı kanaatine varılmıştır.</p>
<p>Ayrıca hükümlünün kurum dışına çıkmasının kurum güvenliği ve infaz hizmetlerinin sağlıklı şekilde yürütülmesi açısından uygun olmayacağı, mevcut şartlar itibarıyla izin verilmesini gerektiren zorunlu ve olumlu bir durumun bulunmadığı değerlendirilmiştir.</p>
<p>Bu nedenle hükümlünün mazeret izni talebinin, mevcut infaz durumu, güvenlik değerlendirmeleri ve ilgili şartların oluşmaması nedeniyle reddine karar verilmiştir.</p>`},
  {id:'n17', cat:'Karar', title:'Mazeret İzni Talebinin Kabulü (Zorunlu ve Özel Durum Nedeniyle)', desc:'Yakın aile bireyi sağlık/vefat gibi zorunlu mazeret nedeniyle izin kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>MAZERET İZNİ TALEBİNİN KABULÜ (ZORUNLU VE ÖZEL DURUM NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün mazeret izni talebi; dosyası, infaz durumu, kurum kayıtları, disiplin durumu ve sunduğu mazerete ilişkin bilgi ve belgeler birlikte değerlendirilerek incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün ileri sürdüğü mazeretin gerçek, zorunlu ve değerlendirmeye değer nitelikte olduğu, yakın aile bireyinin sağlık durumu, vefat veya benzeri özel durum nedeniyle kurum dışına çıkmasının gerekli olduğu anlaşılmıştır.</p>
<p>Hükümlünün kurum içerisindeki tutum ve davranışları, disiplin durumu, infaz süreci ve izin süresince alınabilecek güvenlik tedbirleri birlikte değerlendirildiğinde; mazeret izninden yararlanmasının kurum güvenliği ve düzeni açısından sakınca oluşturmayacağı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlünün mazeret izni talebinin kabulüne, ilgili mevzuat hükümleri çerçevesinde gerekli güvenlik tedbirleri alınarak izin işlemlerinin yürütülmesine karar verilmiştir.</p>`},
  {id:'n18', cat:'Karar', title:'Açık Ceza İnfaz Kurumuna Ayrılma Talebinin Kabulü (İyi Hâl ve Yasal Şartların Oluşması Nedeniyle)', desc:'İyi hal ve yasal şartların oluşması nedeniyle açık kuruma ayrılma kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>AÇIK CEZA İNFAZ KURUMUNA AYRILMA TALEBİNİN KABULÜ (İYİ HÂL VE YASAL ŞARTLARIN OLUŞMASI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün açık ceza infaz kurumuna ayrılma talebi; infaz dosyası, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, psikososyal servis görüşleri ve ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün infaz süreci içerisinde kurum kurallarına uyum sağladığı, disiplin yönünden olumsuz bir durumunun bulunmadığı, eğitim ve iyileştirme faaliyetlerinden yararlandığı ve yeniden suç işlememe yönünde olumlu kanaat oluşturduğu değerlendirilmiştir.</p>
<p>Hükümlünün kişisel durumu, kurum içerisindeki tutum ve davranışları, sosyal uyumu ve infaz sürecindeki gelişimi birlikte değerlendirildiğinde; açık ceza infaz kurumlarının gerektirdiği güven esaslı infaz rejimine uyum sağlayabileceği kanaatine varılmıştır.</p>
<p>Ayrıca hükümlünün açık ceza infaz kurumuna ayrılmasına yasal bir engel bulunmadığı, gerekli şartları taşıdığı ve bu şekilde infazına devam edilmesinin uygun olacağı değerlendirilmiştir.</p>
<p>Bu nedenle hükümlünün açık ceza infaz kurumuna ayrılma talebinin kabulüne ve gerekli işlemlerin ilgili birimlerce yerine getirilmesine karar verilmiştir.</p>`},
  {id:'n19', cat:'Karar', title:'Koşullu Salıverilme Değerlendirmesinin Olumlu Sonuçlandırılması (İyi Hâl ve Topluma Uyum Kanaati Nedeniyle)', desc:'İyi hal ve topluma uyum kanaati oluşan hükümlü için koşullu salıverilme olumlu sonuçlandırma.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>KOŞULLU SALIVERİLME DEĞERLENDİRMESİNİN OLUMLU SONUÇLANDIRILMASI (İYİ HÂL VE TOPLUMA UYUM KANAATİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün koşullu salıverilme değerlendirmesine esas olmak üzere dosyası, infaz evrakları, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, psikososyal servis görüşleri, eğitim ve iyileştirme faaliyetlerine katılım durumu ile diğer bilgi ve belgeler incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün infaz süreci içerisinde kurum kurallarına uygun hareket ettiği, disiplin yönünden olumsuz bir durumunun bulunmadığı, verilen görev ve sorumluluklara uyum sağladığı, eğitim ve iyileştirme faaliyetlerinden yararlandığı tespit edilmiştir.</p>
<p>Hükümlünün işlediği suçun nedenleri ve sonuçları konusunda farkındalık geliştirdiği, yeniden suç işlememe yönünde olumlu tutum sergilediği, toplumsal yaşama uyum sağlayabilecek davranış değişikliği gösterdiği ve infaz sürecini olumlu şekilde sürdürdüğü değerlendirilmiştir.</p>
<p>Ayrıca hükümlünün kurum içerisindeki tutum ve davranışları, sosyal ilişkileri, sorumluluk bilinci ve geleceğe yönelik olumlu yaklaşımı birlikte değerlendirildiğinde; iyi hâl yönünden olumlu kanaat oluştuğu anlaşılmıştır.</p>
<p>Bu nedenle hükümlü hakkında iyi hâl değerlendirmesinin olumlu olduğuna, koşullu salıverilmeden yararlanabileceğine ilişkin kanaat oluştuğuna ve gerekli işlemlerin ilgili mevzuat hükümleri doğrultusunda yürütülmesine karar verilmiştir.</p>`},
  {id:'n20', cat:'Karar', title:'Denetimli Serbestlik Değerlendirmesi (İyi Hâl ve Topluma Uyum Kanaati Nedeniyle)', desc:'Olumlu kanaat oluşan hükümlü için denetimli serbestlik değerlendirmesi - olumlu.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>DENETİMLİ SERBESTLİK DEĞERLENDİRMESİ (İYİ HÂL VE TOPLUMA UYUM KANAATİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün denetimli serbestlik tedbirinden yararlanma durumuna ilişkin dosyası, infaz evrakları, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, psikososyal servis görüşleri ile ilgili bilgi ve belgeler incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün infaz sürecinde kurum kurallarına uygun hareket ettiği, disiplin yönünden olumsuz bir durumunun bulunmadığı, eğitim ve iyileştirme faaliyetlerine katılım sağladığı ve sorumluluk bilincinin geliştiği değerlendirilmiştir.</p>
<p>Hükümlünün işlediği suçun sonuçları konusunda farkındalık kazandığı, yeniden suç işlememe yönünde olumlu tutum sergilediği, aile ve sosyal çevresiyle bağlarını sürdürdüğü, toplum içerisinde kurallara uygun bir yaşam sürdürebileceğine ilişkin olumlu kanaat oluştuğu anlaşılmıştır.</p>
<p>Ayrıca hükümlünün infaz sürecindeki tutum ve davranışları, kurum düzenine uyumu, sosyal ilişkileri ve geleceğe yönelik planları birlikte değerlendirildiğinde; denetimli serbestlik sürecinin amacına uygun şekilde yürütülebileceği değerlendirilmiştir.</p>
<p>Bu nedenle hükümlü hakkında denetimli serbestlik tedbirinden yararlanmasına ilişkin olumlu kanaat oluştuğuna ve gerekli işlemlerin ilgili mevzuat hükümleri doğrultusunda yürütülmesine karar verilmiştir.</p>`},
  {id:'n21', cat:'Karar', title:'Denetimli Serbestlik Değerlendirmesi (Olumsuz Kanaat ve Yetersiz İyi Hâl Nedeniyle)', desc:'Yetersiz iyi hal ve olumsuz kanaat nedeniyle denetimli serbestlik değerlendirmesi - olumsuz.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>DENETİMLİ SERBESTLİK DEĞERLENDİRMESİ (OLUMSUZ KANAAT VE YETERSİZ İYİ HÂL NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün denetimli serbestlik tedbirinden yararlanma durumuna ilişkin dosyası, infaz evrakları, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, psikososyal servis görüşleri ile ilgili bilgi ve belgeler incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün infaz süreci içerisinde kurum kurallarına uyum konusunda yeterli istikrar sağlayamadığı, disiplin yönünden olumsuz kayıtlarının bulunduğu, eğitim ve iyileştirme faaliyetlerinden beklenen düzeyde yararlanmadığı ve sorumluluk bilincinin yeterince gelişmediği değerlendirilmiştir.</p>
<p>Hükümlünün işlediği suçun nedenleri ve sonuçları konusunda yeterli farkındalık oluşturmadığı, yeniden suç işlememe yönünde kalıcı bir davranış değişikliği gösterdiğine ilişkin yeterli olumlu kanaat oluşmadığı, toplum içerisinde kurallara uygun yaşam sürdürme konusunda risklerinin devam ettiği değerlendirilmiştir.</p>
<p>Ayrıca hükümlünün kurum içerisindeki tutum ve davranışları, disiplin geçmişi, sosyal uyum durumu ve yeniden suç işleme riski birlikte değerlendirildiğinde; denetimli serbestlik sürecinden beklenen amacı gerçekleştirecek düzeyde olumlu gelişim göstermediği kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü hakkında denetimli serbestlik tedbirinden yararlanmasına ilişkin olumlu kanaat oluşmadığından talebin uygun olmadığına ve gerekli işlemlerin ilgili mevzuat hükümleri doğrultusunda yürütülmesine karar verilmiştir.</p>`},
  {id:'n22', cat:'Karar', title:'Telefon Görüşmesi Talebinin Kabulü (İletişim Hakkı ve Kurum Kurallarına Uyum Nedeniyle)', desc:'Disiplin engeli bulunmayan hükümlü/tutuklu için telefon görüşmesi kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>TELEFON GÖRÜŞMESİ TALEBİNİN KABULÜ (İLETİŞİM HAKKI VE KURUM KURALLARINA UYUM NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklunun telefon görüşmesi talebi; dosyası, kurum kayıtları, disiplin durumu, iletişim hakkından yararlanma şartları ve ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun telefon görüşmesinden yararlanmasına engel teşkil eden herhangi bir disiplin cezası veya idari kısıtlama bulunmadığı, kurum kurallarına uygun hareket ettiği ve iletişim hakkını kullanma şartlarını taşıdığı anlaşılmıştır.</p>
<p>Telefon görüşmesinin hükümlü/tutuklunun aile bağlarının korunması, sosyal ilişkilerinin devam ettirilmesi ve iyileştirme sürecine katkı sağlaması açısından faydalı olacağı değerlendirilmiştir.</p>
<p>Ayrıca söz konusu görüşmenin kurum güvenliği ve düzeni açısından herhangi bir sakınca oluşturmayacağı, ilgili mevzuat ve kurum uygulamaları çerçevesinde gerçekleştirilebileceği kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun telefon görüşmesi talebinin kabulüne ve mevzuat hükümleri doğrultusunda telefon görüşmesinden yararlandırılmasına karar verilmiştir.</p>`},
  {id:'n23', cat:'Karar', title:'Telefon Görüşmesi Talebinin Reddi (Disiplin Durumu ve Kurum Güvenliği Nedeniyle)', desc:'Disiplin yaptırımı bulunan hükümlü/tutuklu için telefon görüşmesi reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>TELEFON GÖRÜŞMESİ TALEBİNİN REDDİ (DİSİPLİN DURUMU VE KURUM GÜVENLİĞİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklunun telefon görüşmesi talebi; dosyası, kurum kayıtları, disiplin durumu, iletişim hakkından yararlanma şartları ve ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun kurum içerisinde disiplin kurallarına aykırı davranışlarda bulunduğu, hakkında uygulanan disiplin yaptırımlarının devam ettiği veya kurum düzeni ve güvenliği açısından olumsuz değerlendirmelerinin bulunduğu anlaşılmıştır.</p>
<p>Ayrıca hükümlü/tutuklunun iletişim hakkını kullanmasının mevcut durumda kurum güvenliği, disiplinin sağlanması ve infaz hizmetlerinin düzenli yürütülmesi açısından uygun olmayacağı, gerekli şartların oluşmadığı değerlendirilmiştir.</p>
<p>Hükümlünün/tutuklunun kurum kurallarına uyum sağlaması ve iletişim hakkından yararlanma şartlarını yeniden kazanması halinde durumunun tekrar değerlendirilebileceği kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun telefon görüşmesi talebinin mevcut disiplin durumu, kurum güvenliği ve ilgili mevzuat hükümleri dikkate alınarak reddine karar verilmiştir.</p>`},
  {id:'n24', cat:'Karar', title:'Ziyaretçi Görüşü Talebinin Kabulü (Aile Bağlarının Korunması ve Sosyal Uyum Nedeniyle)', desc:'Şartları taşıyan hükümlü/tutuklu için ziyaretçi görüşü kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>ZİYARETÇİ GÖRÜŞÜ TALEBİNİN KABULÜ (AİLE BAĞLARININ KORUNMASI VE SOSYAL UYUM NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklunun ziyaretçi görüşü talebi; dosyası, kurum kayıtları, disiplin durumu, ziyaret şartları ve ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun ziyaretçi görüşünden yararlanmasına engel teşkil eden herhangi bir durumun bulunmadığı, ziyaret talebinin mevzuat hükümleri çerçevesinde uygun olduğu anlaşılmıştır.</p>
<p>Aile ve sosyal bağların korunmasının, hükümlü/tutuklunun psikososyal gelişimi, infaz sürecine uyumu ve topluma yeniden kazandırılması açısından önemli olduğu değerlendirilmiştir.</p>
<p>Ayrıca yapılacak ziyaretin kurum güvenliği ve düzeni açısından herhangi bir sakınca oluşturmayacağı, gerekli güvenlik tedbirleri alınarak gerçekleştirilebileceği kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun ziyaretçi görüşü talebinin kabulüne ve mevzuat hükümleri doğrultusunda ziyaret görüşünden yararlandırılmasına karar verilmiştir.</p>`},
  {id:'n25', cat:'Karar', title:'Ziyaretçi Görüşü Talebinin Reddi (Mevzuat ve Güvenlik Şartlarının Oluşmaması Nedeniyle)', desc:'Mevzuat/güvenlik şartlarının oluşmaması nedeniyle ziyaretçi görüşü reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>ZİYARETÇİ GÖRÜŞÜ TALEBİNİN REDDİ (MEVZUAT VE GÜVENLİK ŞARTLARININ OLUŞMAMASI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklunun ziyaretçi görüşü talebi; dosyası, kurum kayıtları, ziyaretçi bilgileri, disiplin durumu ve ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; talep edilen ziyaret görüşünün gerçekleştirilmesi için gerekli şartların oluşmadığı, ziyaretçi bilgilerinin veya başvuruya ilişkin hususların mevzuatta belirtilen koşulları karşılamadığı anlaşılmıştır.</p>
<p>Ayrıca söz konusu görüşmenin kurum güvenliği, asayişi ve disiplin düzeni açısından uygun olmadığı, ziyaret işlemlerinde aranan güvenlik kriterlerinin sağlanamadığı değerlendirilmiştir.</p>
<p>Kurum güvenliğinin korunması, ziyaret işlemlerinin mevzuata uygun şekilde yürütülmesi ve infaz hizmetlerinin düzenli şekilde devam ettirilmesi amacıyla talebin karşılanmasının uygun olmadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun ziyaretçi görüşü talebinin, mevzuat hükümleri ve güvenlik şartlarının oluşmaması nedeniyle reddine karar verilmiştir.</p>`},
  {id:'n26', cat:'Karar', title:'Kapalı Görüşten Yararlandırılmasına İlişkin Karar (Aile Bağlarının Korunması ve Mevzuat Şartlarının Oluşması Nedeniyle)', desc:'Kapalı görüş şartlarını taşıyan hükümlü/tutuklu için kabul kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>KAPALI GÖRÜŞTEN YARARLANDIRILMASINA İLİŞKİN KARAR (AİLE BAĞLARININ KORUNMASI VE MEVZUAT ŞARTLARININ OLUŞMASI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklunun kapalı görüşten yararlanma talebi; dosyası, kurum kayıtları, disiplin durumu ve ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun kapalı görüş hakkından yararlanmasına engel teşkil eden herhangi bir disiplin yaptırımı veya idari kısıtlama bulunmadığı, görüşme talebinin mevzuat hükümlerine uygun olduğu anlaşılmıştır.</p>
<p>Kapalı görüş uygulamasının hükümlü/tutuklunun aile ve sosyal bağlarının korunması, topluma yeniden kazandırılması sürecinin desteklenmesi ve psikososyal yönden olumlu katkı sağlaması açısından önemli olduğu değerlendirilmiştir.</p>
<p>Ayrıca görüşmenin kurum güvenliği ve düzeni açısından herhangi bir sakınca oluşturmayacağı, gerekli güvenlik tedbirleri alınarak gerçekleştirilebileceği kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun kapalı görüşten yararlandırılmasına ve görüşme işlemlerinin ilgili mevzuat hükümleri doğrultusunda yerine getirilmesine karar verilmiştir.</p>`},
  {id:'n27', cat:'Karar', title:'Kapalı Görüşten Yararlandırılma Talebinin Reddi (Disiplin Yaptırımı ve Mevzuat Engeli Nedeniyle)', desc:'Disiplin yaptırımı bulunan hükümlü/tutuklu için kapalı görüş reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>KAPALI GÖRÜŞTEN YARARLANDIRILMA TALEBİNİN REDDİ (DİSİPLİN YAPTIRIMI VE MEVZUAT ENGELİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklunun kapalı görüşten yararlanma talebi; dosyası, kurum kayıtları, disiplin durumu, görüşme haklarına ilişkin kayıtlar ve ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklu hakkında kapalı görüş hakkının kullanılmasını kısıtlayan disiplin yaptırımının bulunduğu ve/veya ilgili mevzuat hükümleri kapsamında görüşmeden yararlanma şartlarını taşımadığı anlaşılmıştır.</p>
<p>Ayrıca mevcut durumun kurum düzeni, güvenliği ve disiplininin korunması amacıyla uygulanan tedbirler kapsamında değerlendirilmesi gerektiği, görüşme hakkından yararlandırılmasının mevcut aşamada uygun olmadığı kanaatine varılmıştır.</p>
<p>Disiplin kayıtları, kurum içi değerlendirmeler ve ilgili mevzuat hükümleri birlikte değerlendirildiğinde; kapalı görüş talebinin kabul edilmesini gerektiren şartların oluşmadığı sonucuna ulaşılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun kapalı görüşten yararlanma talebinin, mevcut disiplin yaptırımı ve mevzuat hükümleri nedeniyle reddine karar verilmiştir.</p>`},
  {id:'n28', cat:'Karar', title:'Açık Görüşten Yararlandırılmasına İlişkin Karar (Aile Bağlarının Korunması ve Mevzuat Şartlarının Oluşması Nedeniyle)', desc:'Açık görüş şartlarını taşıyan hükümlü/tutuklu için kabul kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>AÇIK GÖRÜŞTEN YARARLANDIRILMASINA İLİŞKİN KARAR (AİLE BAĞLARININ KORUNMASI VE MEVZUAT ŞARTLARININ OLUŞMASI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklunun açık görüşten yararlanma durumu; dosyası, kurum kayıtları, disiplin durumu ve ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun açık görüş hakkından yararlanmasına engel teşkil eden herhangi bir disiplin yaptırımı veya idari kısıtlama bulunmadığı, açık görüşten yararlanma şartlarını taşıdığı anlaşılmıştır.</p>
<p>Açık görüş uygulamasının hükümlü/tutuklunun aile bağlarının korunması, yakınlarıyla sosyal ilişkilerinin sürdürülmesi, moral ve motivasyonunun artırılması ile topluma yeniden uyum sürecinin desteklenmesi açısından faydalı olacağı değerlendirilmiştir.</p>
<p>Ayrıca açık görüşten yararlandırılmasının kurum güvenliği ve düzeni açısından herhangi bir sakınca oluşturmayacağı, gerekli güvenlik ve kontrol tedbirleri alınarak gerçekleştirilebileceği kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun açık görüşten yararlandırılmasına ve görüşme işlemlerinin ilgili mevzuat hükümleri doğrultusunda yerine getirilmesine karar verilmiştir.</p>`},
  {id:'n29', cat:'Karar', title:'Açık Görüşten Yararlandırılmama Kararı (Disiplin Yaptırımı ve Mevzuat Engeli Nedeniyle)', desc:'Disiplin yaptırımı bulunan hükümlü/tutuklu için açık görüş reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>AÇIK GÖRÜŞTEN YARARLANDIRILMAMA KARARI (DİSİPLİN YAPTIRIMI VE MEVZUAT ENGELİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklunun açık görüşten yararlanma durumu; dosyası, disiplin kayıtları, kurum kayıtları ve ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklu hakkında açık görüş hakkından yararlanmasını engelleyen disiplin yaptırımının bulunduğu ve/veya ilgili mevzuatta öngörülen şartları taşımadığı anlaşılmıştır.</p>
<p>Ayrıca hükümlü/tutuklunun mevcut disiplin durumu ve kurum içerisindeki tutum ve davranışları dikkate alındığında, açık görüşten yararlandırılmasının kurum düzeni ve disiplininin sağlanması bakımından uygun olmadığı değerlendirilmiştir.</p>
<p>Disiplin kayıtları, kurum içi değerlendirmeler ve ilgili mevzuat hükümleri birlikte ele alındığında; açık görüş hakkından yararlandırılmasını gerektiren şartların oluşmadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun açık görüşten yararlandırılmamasına, mevcut disiplin yaptırımı ve ilgili mevzuat hükümleri doğrultusunda açık görüş hakkından faydalandırılmamasına karar verilmiştir.</p>`},
  {id:'n30', cat:'Karar', title:'Kardeşinin Bulunduğu Koğuş/Odaya Alınma Talebinin Reddi (Barındırma Planı ve Güvenlik Değerlendirmesi Nedeniyle)', desc:'Barındırma planı gerekçesiyle kardeş odasına alınma reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>KARDEŞİNİN BULUNDUĞU KOĞUŞ/ODAYA ALINMA TALEBİNİN REDDİ (BARINDIRMA PLANI VE GÜVENLİK DEĞERLENDİRMESİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından, kardeşinin bulunduğu koğuş/odada barındırılma talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, kardeşinin barındırılma durumu, kurum kayıtları, oda mevcutları, güvenlik değerlendirmeleri ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun kardeşi ile aynı koğuş/odada barındırılmasını gerektiren zorunlu ve istisnai bir durumun bulunmadığı, mevcut barındırma planlamasının kurum güvenliği, oda dengeleri ve hükümlü/tutuklu profilleri dikkate alınarak oluşturulduğu anlaşılmıştır.</p>
<p>Ayrıca aynı koğuş/odada barındırılmalarının kurum düzeni ve güvenliği açısından uygun olmayabileceği, mevcut yerleştirme planının değiştirilmesinin kurum işleyişini olumsuz etkileyebileceği değerlendirilmiştir.</p>
<p>Kurum kapasitesi, güvenlik kriterleri ve barındırma esasları birlikte değerlendirildiğinde; talebin karşılanmasının uygun olmadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun kardeşinin bulunduğu koğuş/odaya alınma talebinin reddine karar verilmiştir.</p>`},
  {id:'n31', cat:'Karar', title:'Kardeşinin Bulunduğu Koğuş/Odaya Alınma Talebinin Kabulü (Aile Bağlarının Korunması ve Uygun Barındırma Nedeniyle)', desc:'Aile bağlarının korunması gerekçesiyle kardeş odasına alınma kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>KARDEŞİNİN BULUNDUĞU KOĞUŞ/ODAYA ALINMA TALEBİNİN KABULÜ (AİLE BAĞLARININ KORUNMASI VE UYGUN BARINDIRMA NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından, kardeşinin bulunduğu koğuş/odada barındırılma talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, kardeşinin barındırılma durumu, kurum kayıtları, oda mevcutları, güvenlik değerlendirmeleri ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun kardeşi ile aynı kurum içerisinde bulunduğu, aralarında aile bağının mevcut olduğu, aynı koğuş/odada barındırılmalarının kurum güvenliği ve düzeni açısından herhangi bir sakınca oluşturmayacağı anlaşılmıştır.</p>
<p>Ayrıca talebin, hükümlü/tutuklunun aile bağlarının korunması, psikososyal yönden desteklenmesi ve infaz sürecine olumlu katkı sağlaması açısından uygun olduğu değerlendirilmiştir.</p>
<p>Kurum kapasitesi, oda mevcutları ve güvenlik kriterleri dikkate alındığında; kardeşinin bulunduğu koğuş/odaya alınmasının mümkün ve uygun olduğu kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun kardeşinin bulunduğu koğuş/odaya alınma talebinin kabulüne ve uygun yerleştirme işlemlerinin ilgili birimlerce yapılmasına karar verilmiştir.</p>`},
  {id:'n32', cat:'Karar', title:'Nakil Talebinin Reddi (Mevcut Kurumda Barındırılmasının Uygun Olması Nedeniyle)', desc:'Somut nedeni bulunmayan nakil talebinin reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKİL TALEBİNİN REDDİ (MEVCUT KURUMDA BARINDIRILMASININ UYGUN OLMASI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından başka bir ceza infaz kurumuna nakil talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, infaz durumu, barındırılma koşulları, disiplin kayıtları, güvenlik değerlendirmeleri, sağlık durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun mevcut kurumda barındırılmasına engel teşkil edecek güvenlik, sağlık veya idari bir zorunluluğun bulunmadığı, mevcut kurum şartlarının infazının devamı açısından uygun olduğu anlaşılmıştır.</p>
<p>Ayrıca talep edilen nakli gerektirecek zorunlu ve somut bir nedenin bulunmadığı, nakil işleminin kurumların kapasite, güvenlik ve barındırma planlamalarını etkileyebileceği değerlendirilmiştir.</p>
<p>Hükümlü/tutuklunun mevcut kurumda infazının güvenli ve düzenli şekilde sürdürülebileceği, talebinin kabulünü gerektirecek yeterli gerekçe oluşmadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun nakil talebinin reddine, mevcut kurumda infazına devam edilmesine karar verilmiştir.</p>`},
  {id:'n33', cat:'Karar', title:'Nakil Talebinin Kabulü (Aile, Sağlık ve Özel Durum Nedeniyle)', desc:'Haklı mazeret/özel durum nedeniyle nakil kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKİL TALEBİNİN KABULÜ (AİLE, SAĞLIK VE ÖZEL DURUM NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından başka bir ceza infaz kurumuna nakil talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, infaz durumu, sağlık ve ailevi durumuna ilişkin belgeler, kurum kayıtları, güvenlik değerlendirmeleri ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun ileri sürdüğü mazeret ve özel durumun değerlendirmeye değer nitelikte olduğu, mevcut durumunun başka bir ceza infaz kurumunda bulunmasını gerektirecek haklı ve makul sebepler içerdiği anlaşılmıştır.</p>
<p>Ayrıca talep edilen naklin, hükümlü/tutuklunun aile bağlarının korunması, sağlık durumunun takibi veya özel durumunun gerektirdiği ihtiyaçların karşılanması açısından uygun olacağı, kurum güvenliği ve infaz hizmetlerinin yürütülmesi bakımından herhangi bir sakınca oluşturmayacağı değerlendirilmiştir.</p>
<p>Kurumların kapasite durumu, güvenlik kriterleri ve hükümlü/tutuklunun durumuna uygunluk hususları birlikte değerlendirildiğinde nakil işleminin yapılmasının uygun olduğu kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun nakil talebinin kabulüne ve durumuna uygun başka bir ceza infaz kurumuna sevk edilmesi için gerekli işlemlerin başlatılmasına karar verilmiştir.</p>`},
  {id:'n34', cat:'Karar', title:'Nakil Talebinin Kabulü (Eş ve Aile Birliğinin Korunması Nedeniyle)', desc:'Eş/aile birliğinin korunması gerekçesiyle nakil kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKİL TALEBİNİN KABULÜ (EŞ VE AİLE BİRLİĞİNİN KORUNMASI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından eşine ve ailesine daha yakın bir ceza infaz kurumuna nakil talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, infaz durumu, aile bilgileri, mevcut kurum koşulları, güvenlik değerlendirmeleri ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun eş ve aile bağlarının korunmasının, sosyal destek sisteminin devam ettirilmesi ve infaz sürecine uyumunun sağlanması açısından önem arz ettiği, talep edilen naklin aile ilişkilerinin sürdürülmesine katkı sağlayacağı değerlendirilmiştir.</p>
<p>Ayrıca yapılacak naklin kurum güvenliği, asayişi ve infaz hizmetlerinin yürütülmesi açısından herhangi bir sakınca oluşturmayacağı, hükümlünün durumuna uygun bir kurumda barındırılmasının mümkün olduğu kanaatine varılmıştır.</p>
<p>Hükümlünün ailevi durumu, infaz koşulları ve kurumların kapasite/güvenlik durumları birlikte değerlendirildiğinde, nakil talebinin uygun olduğu değerlendirilmiştir.</p>
<p>Bu nedenle hükümlü/tutuklunun eş ve aile bağlarının korunması amacıyla nakil talebinin kabulüne ve durumuna uygun başka bir ceza infaz kurumuna sevk işlemlerinin başlatılmasına karar verilmiştir.</p>`},
  {id:'n35', cat:'Karar', title:'Nakil Talebinin Reddi (Eş ve Aile Durumunun Nakli Gerektirmemesi Nedeniyle)', desc:'Aile durumu tek başına nakli gerektirmediğinde red kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKİL TALEBİNİN REDDİ (EŞ VE AİLE DURUMUNUN NAKLİ GEREKTİRMEMESİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından eşine ve ailesine daha yakın bir ceza infaz kurumuna nakil talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, infaz durumu, aile bilgileri, mevcut kurum koşulları, güvenlik değerlendirmeleri, kurumların kapasite durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun aile bağlarının devam ettirilmesine yönelik imkânlarının mevcut olduğu, ileri sürülen ailevi durumun tek başına nakil yapılmasını zorunlu kılan nitelikte olmadığı ve talep edilen nakli gerektirecek zorunlu veya istisnai bir durum bulunmadığı anlaşılmıştır.</p>
<p>Ayrıca mevcut kurumda barındırılmasının infaz hizmetleri, kurum güvenliği ve düzeni açısından uygun olduğu, nakil işleminin kurumların kapasite ve güvenlik planlamalarını olumsuz etkileyebileceği değerlendirilmiştir.</p>
<p>Hükümlü/tutuklunun aile durumu, infaz şartları, kurumların kapasite ve güvenlik koşulları birlikte değerlendirildiğinde; nakil talebinin uygun olmadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun eş ve aile durumu gerekçesiyle yapmış olduğu nakil talebinin reddine, mevcut kurumda infazına devam edilmesine karar verilmiştir.</p>`},
  {id:'n36', cat:'Karar', title:'Nakil Talebinin Reddi (Sağlık Hizmetlerinin Mevcut Kurumda Karşılanabilmesi Nedeniyle)', desc:'Sağlık hizmetlerinin mevcut kurumda karşılanabildiği durumda nakil reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>NAKİL TALEBİNİN REDDİ (SAĞLIK HİZMETLERİNİN MEVCUT KURUMDA KARŞILANABİLMESİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından sağlık gerekçesiyle başka bir ceza infaz kurumuna nakil talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, sağlık raporları, kurum sağlık servisi değerlendirmeleri, hastane sevk kayıtları, infaz durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun sağlık durumunun mevcut kurum sağlık birimi ve bağlı sağlık kuruluşları aracılığıyla takip ve tedavi edilebildiği, ileri sürülen sağlık gerekçesinin başka bir kuruma nakli zorunlu kılan nitelikte olmadığı anlaşılmıştır.</p>
<p>Ayrıca mevcut kurumda hükümlü/tutuklunun sağlık hizmetlerine erişiminin sağlandığı, gerekli muayene, takip ve tedavi işlemlerinin yürütüldüğü, nakil yapılmasını gerektirecek tıbbi veya idari bir zorunluluk bulunmadığı değerlendirilmiştir.</p>
<p>Hükümlü/tutuklunun sağlık durumu, mevcut tedavi imkânları, kurum şartları ve ilgili sağlık birimi görüşleri birlikte değerlendirildiğinde; talebin karşılanmasının uygun olmadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun sağlık gerekçesiyle yapmış olduğu nakil talebinin, mevcut kurum imkânlarının yeterli olması ve tedavisinin burada sürdürülebilmesi nedeniyle reddine karar verilmiştir.</p>`},
  {id:'n37', cat:'Karar', title:'Kurumlar Arası Nakil Talebinin Reddi (Kapasite, Güvenlik ve Barındırma Planı Nedeniyle)', desc:'Kapasite/güvenlik gerekçesiyle kurumlar arası nakil reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>KURUMLAR ARASI NAKİL TALEBİNİN REDDİ (KAPASİTE, GÜVENLİK VE BARINDIRMA PLANI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından başka bir ceza infaz kurumuna nakil talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, infaz durumu, mevcut barındırılma koşulları, disiplin kayıtları, güvenlik değerlendirmeleri, kurumların kapasite durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun mevcut kurumda barındırılmasına engel teşkil eden herhangi bir güvenlik, sağlık veya idari zorunluluğun bulunmadığı, mevcut kurum şartlarının infazının devamı açısından uygun olduğu anlaşılmıştır.</p>
<p>Ayrıca talep edilen kuruma nakli gerektirecek zorunlu, somut ve haklı bir nedenin bulunmadığı, nakil işleminin kurumların kapasite durumu, güvenlik kriterleri ve barındırma planlaması üzerinde olumsuz etkiler oluşturabileceği değerlendirilmiştir.</p>
<p>Hükümlü/tutuklunun mevcut kurumda güvenli ve düzenli şekilde barındırılmasının mümkün olduğu, kurumlar arası naklin yapılmasını gerektiren şartların oluşmadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun kurumlar arası nakil talebinin kapasite, güvenlik ve mevcut barındırma şartları dikkate alınarak reddine, mevcut kurumda infazına devam edilmesine karar verilmiştir.</p>`},
  {id:'n38', cat:'Karar', title:'Kurumlar Arası Nakil Talebinin Kabulü (Uygunluk, Güvenlik ve Özel Durum Değerlendirmesi Nedeniyle)', desc:'Uygunluk değerlendirmesi olumlu olduğunda kurumlar arası nakil kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>KURUMLAR ARASI NAKİL TALEBİNİN KABULÜ (UYGUNLUK, GÜVENLİK VE ÖZEL DURUM DEĞERLENDİRMESİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından başka bir ceza infaz kurumuna nakil talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, infaz durumu, barındırılma şartları, güvenlik değerlendirmeleri, kurumların kapasite durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun mevcut durumunun başka bir ceza infaz kurumunda barındırılmasını gerektiren haklı ve makul sebepler içerdiği, talep edilen naklin infaz sürecinin daha uygun şartlarda devam ettirilmesine katkı sağlayacağı değerlendirilmiştir.</p>
<p>Ayrıca nakil yapılacak kurumun hükümlü/tutuklunun durumuna uygun olduğu, kurum güvenliği ve asayişi açısından herhangi bir sakınca bulunmadığı, barındırma ve kapasite şartlarının uygun olduğu anlaşılmıştır.</p>
<p>Hükümlü/tutuklunun güvenliği, aile ve sosyal bağlarının korunması, sağlık veya diğer özel durumları ile kurumların mevcut koşulları birlikte değerlendirildiğinde; nakil işleminin yapılmasının uygun olduğu kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun kurumlar arası nakil talebinin kabulüne ve durumuna uygun başka bir ceza infaz kurumuna sevk işlemlerinin başlatılmasına karar verilmiştir.</p>`},
  {id:'n39', cat:'Karar', title:'Açık Ceza İnfaz Kurumuna Ayrılma Talebinin Reddi (Yasal Şartların Oluşmaması ve Olumsuz Değerlendirme Nedeniyle)', desc:'Yasal şartların oluşmaması nedeniyle açık kuruma ayrılma reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>AÇIK CEZA İNFAZ KURUMUNA AYRILMA TALEBİNİN REDDİ (YASAL ŞARTLARIN OLUŞMAMASI VE OLUMSUZ DEĞERLENDİRME NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün açık ceza infaz kurumuna ayrılma talebi; infaz dosyası, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, psikososyal servis görüşleri ve ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün açık ceza infaz kurumuna ayrılabilmesi için gerekli şartların oluşmadığı, infaz süreci içerisindeki tutum ve davranışları, disiplin durumu ve kurum düzenine uyumu birlikte değerlendirildiğinde açık kurum şartlarına henüz uygun olmadığı kanaatine varılmıştır.</p>
<p>Ayrıca hükümlünün yeniden suç işlememe yönünde yeterli olumlu gelişim göstermediği, kurum kurallarına uyum konusunda eksikliklerinin bulunduğu ve daha sıkı gözetim altında infazına devam edilmesinin uygun olacağı değerlendirilmiştir.</p>
<p>Hükümlünün kişisel durumu, infaz sürecindeki davranışları, güvenlik değerlendirmeleri ve ilgili birim görüşleri birlikte değerlendirildiğinde; açık ceza infaz kurumuna ayrılmasının mevcut aşamada uygun olmadığı sonucuna ulaşılmıştır.</p>
<p>Bu nedenle hükümlünün açık ceza infaz kurumuna ayrılma talebinin, yasal şartların oluşmaması ve mevcut değerlendirmeler doğrultusunda reddine karar verilmiştir.</p>`},
  {id:'n40', cat:'Karar', title:'İyi Hâl Değerlendirmesinin Olumsuz Sonuçlandırılması (Disiplin ve Davranış Durumu Nedeniyle)', desc:'Disiplin ve davranış durumu nedeniyle iyi hal değerlendirmesi - olumsuz.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>İYİ HÂL DEĞERLENDİRMESİNİN OLUMSUZ SONUÇLANDIRILMASI (DİSİPLİN VE DAVRANIŞ DURUMU NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün iyi hâl değerlendirmesine esas olmak üzere dosyası, infaz evrakları, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, psikososyal servis görüşleri ile diğer bilgi ve belgeler incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün infaz süreci içerisinde kurum düzenine uyum konusunda yeterli olumlu gelişim göstermediği, kurum kurallarına aykırı davranışlarının bulunduğu ve hakkında disiplin işlemleri uygulandığı anlaşılmıştır.</p>
<p>Hükümlünün mevcut tutum ve davranışları, verilen sorumluluklara yaklaşımı, kurum personeli ve diğer hükümlülerle ilişkileri ile disiplin durumu birlikte değerlendirildiğinde; yeniden suç işlememe yönünde yeterli ve kalıcı bir olumlu kanaat oluşmadığı değerlendirilmiştir.</p>
<p>Ayrıca hükümlünün iyileştirme faaliyetlerinden yeterli düzeyde yararlanmadığı, davranış değişikliği konusunda beklenen gelişimi göstermediği ve infaz sürecinde daha fazla gözlem ve değerlendirmeye ihtiyaç duyduğu kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü hakkında iyi hâl değerlendirmesinin olumsuz olduğuna, mevcut aşamada olumlu kanaat oluşmadığına ve durumunun ilerleyen süreçte yeniden değerlendirilmesine karar verilmiştir.</p>`},
  {id:'n41', cat:'Karar', title:'İyi Hâl Değerlendirmesinin Olumlu Sonuçlandırılması (Olumlu Davranış Değişikliği ve Kurum Uyumu Nedeniyle)', desc:'Olumlu davranış değişikliği nedeniyle iyi hal değerlendirmesi - olumlu.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>İYİ HÂL DEĞERLENDİRMESİNİN OLUMLU SONUÇLANDIRILMASI (OLUMLU DAVRANIŞ DEĞİŞİKLİĞİ VE KURUM UYUMU NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün iyi hâl değerlendirmesine esas olmak üzere dosyası, infaz evrakları, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, psikososyal servis görüşleri, eğitim ve iyileştirme faaliyetlerine katılım durumu ile diğer bilgi ve belgeler incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün infaz süreci içerisinde kurum kurallarına uyum sağladığı, disiplin yönünden olumsuz bir durumunun bulunmadığı veya mevcut olumsuzlukların giderildiği, personel ve diğer hükümlülerle ilişkilerinde olumlu tutum sergilediği değerlendirilmiştir.</p>
<p>Hükümlünün işlediği suçun nedenleri ve sonuçları konusunda farkındalık kazandığı, sorumluluk bilincinin geliştiği, iyileştirme faaliyetlerine katılım sağladığı ve yeniden suç işlememe yönünde olumlu davranış değişikliği gösterdiği kanaatine varılmıştır.</p>
<p>Ayrıca hükümlünün kurum içerisindeki genel tutumu, kurallara uyumu, sosyal ilişkileri ve infaz sürecindeki gelişimi birlikte değerlendirildiğinde; iyi hâl yönünden olumlu kanaat oluştuğu anlaşılmıştır.</p>
<p>Bu nedenle hükümlü hakkında iyi hâl değerlendirmesinin olumlu olduğuna, olumlu kanaat oluştuğuna ve ilgili mevzuat kapsamında gerekli işlemlerin yürütülmesine karar verilmiştir.</p>`},
  {id:'n42', cat:'Karar', title:'Açık Ceza İnfaz Kurumuna Ayrılma Talebinin Reddi (Disiplin Cezası ve İyi Hâl Şartlarının Oluşmaması Nedeniyle)', desc:'Disiplin cezası bulunması nedeniyle açık kuruma ayrılma reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>AÇIK CEZA İNFAZ KURUMUNA AYRILMA TALEBİNİN REDDİ (DİSİPLİN CEZASI VE İYİ HÂL ŞARTLARININ OLUŞMAMASI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlünün açık ceza infaz kurumuna ayrılma talebi; infaz dosyası, disiplin kayıtları, kurum içi gözlem ve değerlendirme raporları, psikososyal servis görüşleri ile ilgili mevzuat hükümleri kapsamında incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlünün infaz süreci içerisinde kurum kurallarına aykırı davranışları nedeniyle hakkında disiplin cezası uygulandığı, mevcut disiplin durumunun açık ceza infaz kurumuna ayrılma yönünden olumsuz değerlendirilmesi gerektiği anlaşılmıştır.</p>
<p>Ayrıca hükümlünün kurum içerisindeki tutum ve davranışlarının açık kurum sisteminin gerektirdiği güven esaslı infaz anlayışı ile tam olarak bağdaşmadığı, iyi hâl yönünden yeterli olumlu kanaat oluşmadığı değerlendirilmiştir.</p>
<p>Disiplin kayıtları, kurum içi gözlem raporları, güvenlik değerlendirmeleri ve ilgili mevzuat hükümleri birlikte değerlendirildiğinde; hükümlünün açık ceza infaz kurumuna ayrılabilmesi için gerekli şartları henüz taşımadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlünün açık ceza infaz kurumuna ayrılma talebinin, disiplin cezası bulunması ve iyi hâl şartlarının oluşmaması nedeniyle reddine karar verilmiştir.</p>`},
  {id:'n43', cat:'Karar', title:'Kantin Harici Malzeme Temini Talebinin Reddi (Güvenlik ve Mevzuat Nedeniyle)', desc:'Zorunlu/istisnai durum bulunmadığında kantin harici malzeme reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>KANTİN HARİCİ MALZEME TEMİNİ TALEBİNİN REDDİ (GÜVENLİK VE MEVZUAT NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından kurum kantininde satışa sunulmayan bir malzemenin kurum dışından temin edilmesine yönelik talepte bulunulmuştur.</p>
<p>Talep konusu malzeme ile ilgili yapılan inceleme ve değerlendirme neticesinde; hükümlü ve tutukluların ihtiyaçlarının karşılanmasında kurum kantininin esas olduğu, kurum dışından malzeme girişine izin verilmesinin güvenlik, denetim ve kontrol süreçlerini olumsuz etkileyebileceği değerlendirilmiştir.</p>
<p>Ayrıca talep edilen malzemenin kurum dışından temin edilmesini gerektiren zorunlu ve istisnai bir durumun bulunmadığı, talebin karşılanmasının kurum uygulamalarında eşitsizliğe neden olabileceği ve kurum düzeni açısından sakınca oluşturabileceği kanaatine varılmıştır.</p>
<p>Talep konusu eşyanın kuruma kabul edilmesinin güvenlik ve denetim açısından risk oluşturabileceği, mevcut kurum uygulamaları ve ilgili mevzuat hükümleri çerçevesinde talebin uygun olmadığı değerlendirilmiştir.</p>
<p>Bu nedenle hükümlü/tutuklunun kantin harici malzeme teminine ilişkin talebinin güvenlik, denetim ve mevzuat hükümleri dikkate alınarak reddine karar verilmiştir.</p>`},
  {id:'n44', cat:'Karar', title:'Kantin Harici Malzeme Temini Talebinin Kabulü (İhtiyaç ve Güvenlik Açısından Uygun Bulunması Nedeniyle)', desc:'Kişisel ihtiyaç ve mevzuata aykırılık bulunmadığında kantin harici malzeme kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>KANTİN HARİCİ MALZEME TEMİNİ TALEBİNİN KABULÜ (İHTİYAÇ VE GÜVENLİK AÇISINDAN UYGUN BULUNMASI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından kurum kantininde satışa sunulmayan bir malzemenin kurum dışından temin edilmesine yönelik talepte bulunulmuştur.</p>
<p>Talep konusu malzeme ile ilgili yapılan inceleme ve değerlendirme neticesinde; söz konusu eşyanın kurum kantininde bulunmadığı, hükümlü/tutuklunun kişisel ihtiyacına yönelik olduğu ve temin edilmesini engelleyen herhangi bir mevzuat hükmünün bulunmadığı anlaşılmıştır.</p>
<p>Ayrıca talep edilen malzemenin kurum güvenliği ve disiplini açısından sakınca teşkil etmediği, yasaklı eşya kapsamında olmadığı, gerekli kontrol ve denetim işlemlerinin yapılması halinde kuruma kabulünün mümkün olduğu değerlendirilmiştir.</p>
<p>Talebin karşılanmasının kurum düzeni ve güvenliğini olumsuz etkilemeyeceği, hükümlü/tutuklunun ihtiyaçlarının karşılanmasına katkı sağlayacağı ve kurum uygulamaları açısından herhangi bir sakınca oluşturmayacağı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun kantin harici malzeme teminine ilişkin talebinin, gerekli güvenlik ve kontrol işlemlerinin yapılması kaydıyla kabulüne karar verilmiştir.</p>`},
  {id:'n45', cat:'Karar', title:'Dış Kantin Aracılığıyla İlaç Temini Talebinin Reddi (Sağlık Birimi Usulleri ve Mevzuat Nedeniyle)', desc:'Sağlık sistemi üzerinden karşılanabildiğinde dış kantin ilaç temini reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>DIŞ KANTİN ARACILIĞIYLA İLAÇ TEMİNİ TALEBİNİN REDDİ (SAĞLIK BİRİMİ USULLERİ VE MEVZUAT NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından kullanmak istediği ilacın dış kantin aracılığıyla temin edilmesine yönelik talepte bulunulmuştur.</p>
<p>Talep konusu ilaç ile ilgili yapılan inceleme ve değerlendirme neticesinde; ceza infaz kurumlarında ilaçların temini, muhafazası, dağıtımı ve kullandırılmasına ilişkin işlemlerin sağlık servisi ve ilgili sağlık kuruluşları aracılığıyla yürütülmesinin esas olduğu anlaşılmıştır.</p>
<p>Ayrıca talep edilen ilacın sağlık birimi tarafından dışarıdan temin edilmesini gerektirecek zorunlu bir durumun bulunmadığı, ilaç teminine ilişkin işlemlerin mevcut sağlık sistemi ve kurum prosedürleri çerçevesinde karşılanabileceği değerlendirilmiştir.</p>
<p>İlaçların dış kantin aracılığıyla temin edilmesinin sağlık hizmetlerinin denetimi, ilaç güvenliği ve kurum uygulamaları açısından uygun olmadığı, bu durumun kontrol ve takip süreçlerini olumsuz etkileyebileceği kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun dış kantin aracılığıyla ilaç teminine ilişkin talebinin sağlık birimi uygulamaları, kurum prosedürleri ve ilgili mevzuat hükümleri dikkate alınarak reddine karar verilmiştir.</p>`},
  {id:'n46', cat:'Karar', title:'Dış Kantin Aracılığıyla İlaç Temini Talebinin Kabulü (Tedavinin Sürekliliğinin Sağlanması Nedeniyle)', desc:'Tedavi sürekliliği gerekçesiyle dış kantin ilaç temini kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>DIŞ KANTİN ARACILIĞIYLA İLAÇ TEMİNİ TALEBİNİN KABULÜ (TEDAVİNİN SÜREKLİLİĞİNİN SAĞLANMASI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından kullanmakta olduğu ilacın dış kantin aracılığıyla temin edilmesine yönelik talepte bulunulmuştur.</p>
<p>Talep konusu ilaç ile ilgili yapılan inceleme ve değerlendirme neticesinde; ilacın uzman hekim tarafından reçete edildiği, kurum sağlık servisi tarafından kullanımının uygun görüldüğü, tedavinin devamı açısından gerekli olduğu ve kurum imkânlarıyla temininde güçlük yaşandığı anlaşılmıştır.</p>
<p>Ayrıca ilacın yasaklı veya sakıncalı bir ilaç niteliğinde olmadığı, sağlık biriminin bilgisi ve denetimi altında kullandırılmasının mümkün olduğu, dışarıdan temin edilmesinin kurum güvenliği ve disiplinini olumsuz etkilemeyeceği değerlendirilmiştir.</p>
<p>Tedavinin kesintiye uğramasının hükümlü/tutuklunun sağlık durumunu olumsuz etkileyebileceği, sağlık hakkının korunması ve tedavi sürekliliğinin sağlanması açısından talebin uygun olduğu kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun dış kantin aracılığıyla ilaç teminine ilişkin talebinin, sağlık biriminin kontrol ve denetiminde kullandırılmak üzere kabulüne karar verilmiştir.</p>`},
  {id:'n47', cat:'Karar', title:'Oda Değişikliği Talebinin Reddi (Barındırma Düzeni ve Güvenlik Değerlendirmesi Nedeniyle)', desc:'Somut/haklı neden bulunmadığında genel oda değişikliği reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>ODA DEĞİŞİKLİĞİ TALEBİNİN REDDİ (BARINDIRMA DÜZENİ VE GÜVENLİK DEĞERLENDİRMESİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından bulunduğu odanın değiştirilmesine yönelik talepte bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun barındırılma durumu, kurum kayıtları, güvenlik değerlendirmeleri, oda mevcutları ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun mevcut odasında barındırılmasına engel teşkil edecek güvenlik, sağlık veya idari bir zorunluluğun bulunmadığı, oda değişikliğini gerektirecek somut ve haklı bir neden ortaya koyamadığı anlaşılmıştır.</p>
<p>Ayrıca mevcut barındırma planlamasının kurum güvenliği, oda dengeleri, hükümlü/tutuklu profilleri ve kurumun genel işleyişi dikkate alınarak oluşturulduğu, talebin kabul edilmesinin mevcut yerleştirme düzenini olumsuz etkileyebileceği değerlendirilmiştir.</p>
<p>Tüm dosya kapsamı, kurum ihtiyaçları, güvenlik değerlendirmeleri ve barındırılma planlaması birlikte dikkate alındığında; oda değişikliği talebinin uygun olmadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun oda değişikliği talebinin reddine karar verilmiştir.</p>`},
  {id:'n48', cat:'Karar', title:'Oda Değişikliği Talebinin Kabulü (Uyum, Güvenlik ve Barındırma Gerekçeleri Nedeniyle)', desc:'Uyum sorunu/güvenlik gerekçesiyle genel oda değişikliği kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>ODA DEĞİŞİKLİĞİ TALEBİNİN KABULÜ (UYUM, GÜVENLİK VE BARINDIRMA GEREKÇELERİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından bulunduğu odanın değiştirilmesine yönelik talepte bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun barındırılma durumu, kurum kayıtları, güvenlik değerlendirmeleri, oda mevcutları ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun mevcut odasında barındırılmasının çeşitli uyum sorunlarına neden olduğu, aynı yaşam alanını paylaştığı hükümlü/tutuklularla anlaşmazlıklar yaşadığı ve mevcut barındırılma durumunun kurum düzeni açısından uygun olmadığı değerlendirilmiştir.</p>
<p>Ayrıca yapılacak oda değişikliğinin kurum güvenliği ve asayişi açısından herhangi bir sakınca oluşturmayacağı, ilgili hükümlü/tutuklunun durumuna uygun bir odada barındırılmasının kurum içi huzur, güvenlik ve uyumun sağlanmasına katkı sunacağı kanaatine varılmıştır.</p>
<p>Oda mevcutları, güvenlik kriterleri, hükümlü/tutuklu profilleri ve kurumun barındırma planlaması birlikte değerlendirildiğinde, talebin karşılanmasının uygun olduğu anlaşılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun durumuna uygun bir odaya yerleştirilmek üzere oda değişikliği talebinin kabulüne karar verilmiştir.</p>`},
  {id:'n49', cat:'Karar', title:'Tek Kişilik Oda Talebinin Reddi (Mevcut Barındırma Koşulları ve Kurum Kapasitesi Nedeniyle)', desc:'Zorunluluk bulunmadığında tek kişilik oda talebi reddi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>TEK KİŞİLİK ODA TALEBİNİN REDDİ (MEVCUT BARINDIRMA KOŞULLARI VE KURUM KAPASİTESİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından tek kişilik odada barındırılma talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, barındırılma durumu, kurum kapasitesi, oda mevcutları, güvenlik değerlendirmeleri ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun tek kişilik odada barındırılmasını gerektiren sağlık, güvenlik veya idari bir zorunluluğun bulunmadığı, mevcut barındırılma durumunun kurum düzeni ve güvenliği açısından uygun olduğu anlaşılmıştır.</p>
<p>Ayrıca kurumdaki tek kişilik odaların kapasitesi, kullanım amacı ve mevcut doluluk durumu dikkate alındığında, talebin karşılanmasının mümkün olmadığı, talep sahibinin durumunun tek kişilik odada barındırılmayı zorunlu kılan özel şartlar taşımadığı değerlendirilmiştir.</p>
<p>Kurumun barındırma planlaması, kapasite durumu, güvenlik kriterleri ve ilgili mevzuat hükümleri birlikte değerlendirildiğinde talebin uygun olmadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun tek kişilik odada barındırılma talebinin reddine karar verilmiştir.</p>`},
  {id:'n50', cat:'Karar', title:'Tek Kişilik Oda Talebinin Kabulü (Can Güvenliği ve Güvenlik Tedbirleri Nedeniyle)', desc:'Can güvenliği riski nedeniyle tek kişilik oda kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>TEK KİŞİLİK ODA TALEBİNİN KABULÜ (CAN GÜVENLİĞİ VE GÜVENLİK TEDBİRLERİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından tek kişilik odada barındırılma talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, kurum kayıtları, güvenlik değerlendirmeleri, barındırılma durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun diğer hükümlü/tutuklular ile aynı yaşam alanında barındırılmasının güvenlik açısından risk oluşturabileceği, mevcut barındırılma koşullarının can güvenliği bakımından sakınca doğurabileceği ve koruyucu tedbir alınmasının gerekli olduğu değerlendirilmiştir.</p>
<p>Ayrıca hükümlü/tutuklu hakkında düzenlenen raporlar, güvenlik değerlendirmeleri ve ilgili birim görüşleri doğrultusunda, tek kişilik odada barındırılmasının kurum düzeni ve güvenliği açısından daha uygun olacağı kanaatine varılmıştır.</p>
<p>Mevcut oda durumu ve kurum imkânları da dikkate alınarak, hükümlü/tutuklunun can güvenliğinin sağlanması, olası olumsuzlukların önlenmesi ve kurum güvenliğinin korunması amacıyla tek kişilik odada barındırılmasının gerekli olduğu değerlendirilmiştir.</p>
<p>Bu nedenle hükümlü/tutuklunun can güvenliğinin sağlanması ve gerekli güvenlik tedbirlerinin alınması amacıyla tek kişilik odada barındırılmasına karar verilmiştir.</p>`},
  {id:'n51', cat:'Karar', title:'Oda Değişikliği Talebinin Kabulü (Sağlık Gerekçesiyle)', desc:'Sağlık durumu nedeniyle oda değişikliği kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>ODA DEĞİŞİKLİĞİ TALEBİNİN KABULÜ (SAĞLIK GEREKÇESİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından sağlık durumu gerekçesiyle bulunduğu odanın değiştirilmesi talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun sağlık raporları, kurum sağlık servisi değerlendirmesi, mevcut barındırma durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun mevcut sağlık durumunun (hareket kısıtlılığı, bulaşıcı olmayan rahatsızlık, engellilik durumu vb.) bulunduğu odada barındırılmasını güçleştirdiği, sağlık biriminin de bu yönde görüş bildirdiği anlaşılmıştır.</p>
<p>Uygun bir odaya nakledilmesinin hükümlü/tutuklunun sağlık durumunun takibi, tedavi sürecinin aksamadan yürütülmesi ve yaşam koşullarının iyileştirilmesi açısından gerekli olduğu, bu değişikliğin kurum güvenliği ve düzeni açısından herhangi bir sakınca oluşturmayacağı değerlendirilmiştir.</p>
<p>Bu nedenle hükümlü/tutuklunun sağlık durumuna uygun bir odaya yerleştirilmek üzere oda değişikliği talebinin kabulüne karar verilmiştir.</p>`},
  {id:'n52', cat:'Karar', title:'Oda Değişikliği Talebinin Reddi (Sağlık Gerekçesinin Yetersiz Bulunması Nedeniyle)', desc:'Sağlık biriminin oda değişikliğini gerekli görmemesi durumunda ret.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>ODA DEĞİŞİKLİĞİ TALEBİNİN REDDİ (SAĞLIK GEREKÇESİNİN YETERSİZ BULUNMASI NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından sağlık durumu gerekçesiyle bulunduğu odanın değiştirilmesi talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun sağlık raporları, kurum sağlık servisi değerlendirmesi ve mevcut barındırma durumu incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun ileri sürdüğü sağlık durumunun, sağlık birimince oda değişikliğini zorunlu kılacak nitelikte bulunmadığı, mevcut odanın sağlık açısından uygun olduğu anlaşılmıştır.</p>
<p>Sağlık biriminin görüşü, mevcut oda şartları ve kurum kapasitesi birlikte değerlendirildiğinde; talebin tıbbi açıdan destek görmediği ve karşılanmasının gerekli olmadığı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun sağlık gerekçesiyle yapmış olduğu oda değişikliği talebinin reddine karar verilmiştir.</p>`},
  {id:'n53', cat:'Karar', title:'Oda Değişikliği Talebinin Kabulü (Disiplin/Uyum Sorunu Nedeniyle)', desc:'Oda içi uyum sorunu nedeniyle oda değişikliği kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>ODA DEĞİŞİKLİĞİ TALEBİNİN KABULÜ (DİSİPLİN/UYUM SORUNU NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından, oda arkadaşlarıyla yaşadığı uyum sorunu gerekçesiyle oda değişikliği talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, kurum kayıtları, oda içi gözlem kayıtları, disiplin durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklu ile bulunduğu odadaki diğer hükümlü/tutuklular arasında zaman zaman gerginlik ve anlaşmazlık yaşandığı, bu durumun oda içi huzuru ve kurum düzenini olumsuz etkileyebileceği tespit edilmiştir.</p>
<p>Olası çatışma ve disiplin olaylarının önlenmesi, kurum içi huzurun sağlanması amacıyla hükümlü/tutuklunun uygun bir başka odaya nakledilmesinin, kurum güvenliği ve barındırma planlaması açısından uygun olacağı değerlendirilmiştir.</p>
<p>Bu nedenle hükümlü/tutuklunun oda içi uyum sorununun giderilmesi amacıyla oda değişikliği talebinin kabulüne karar verilmiştir.</p>`},
  {id:'n54', cat:'Karar', title:'Oda Değişikliği Talebinin Reddi (Disiplin/Uyum Sorununun Nakli Gerektirmemesi Nedeniyle)', desc:'Sorunun idari uyarıyla çözülebilir nitelikte olması nedeniyle ret.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>ODA DEĞİŞİKLİĞİ TALEBİNİN REDDİ (DİSİPLİN/UYUM SORUNUNUN NAKLİ GEREKTİRMEMESİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından, oda arkadaşlarıyla yaşadığı uyum sorunu gerekçesiyle oda değişikliği talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak hükümlü/tutuklunun dosyası, oda içi gözlem kayıtları, disiplin durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; ileri sürülen uyum sorununun oda değişikliğini zorunlu kılacak ciddiyette olmadığı, günlük yaşamın olağan akışında karşılaşılabilecek nitelikte anlaşmazlıklardan ibaret olduğu, idari uyarı ve yönlendirme ile çözülebilecek düzeyde kaldığı anlaşılmıştır.</p>
<p>Mevcut oda düzeninin ve barındırma planlamasının korunmasının kurum işleyişi açısından daha uygun olduğu, talebin kabul edilmesinin emsal teşkil edebileceği değerlendirilmiştir.</p>
<p>Bu nedenle hükümlü/tutuklunun disiplin/uyum sorunu gerekçesiyle yapmış olduğu oda değişikliği talebinin reddine karar verilmiştir.</p>`},
  {id:'n55', cat:'Karar', title:'Oda Değişikliği Talebinin Kabulü (Kalabalık/Kapasite Gerekçesiyle)', desc:'Oda doluluk oranının yüksek olması nedeniyle oda değişikliği kabulü.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>ODA DEĞİŞİKLİĞİ TALEBİNİN KABULÜ (KALABALIK/KAPASİTE GEREKÇESİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından bulunduğu odanın kalabalık olması gerekçesiyle oda değişikliği talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak mevcut oda mevcutları, kurum kapasitesi, barındırma planlaması ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun bulunduğu odanın mevcut kapasitesinin üzerinde doluluk oranına sahip olduğu, bu durumun yaşam koşullarını olumsuz etkilediği, kurumda müsait kapasiteye sahip başka bir odanın bulunduğu anlaşılmıştır.</p>
<p>Uygun kapasiteli bir odaya nakledilmesinin hükümlü/tutuklunun yaşam koşullarının iyileştirilmesi ve kurum barındırma dengesinin sağlanması açısından uygun olacağı değerlendirilmiştir.</p>
<p>Bu nedenle hükümlü/tutuklunun kalabalık gerekçesiyle yapmış olduğu oda değişikliği talebinin kabulüne karar verilmiştir.</p>`},
  {id:'n56', cat:'Karar', title:'Oda Değişikliği Talebinin Reddi (Kapasite Uygunluğu Nedeniyle)', desc:'Doluluk oranının standartlara uygun olması nedeniyle ret.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>ODA DEĞİŞİKLİĞİ TALEBİNİN REDDİ (KAPASİTE UYGUNLUĞU NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu tarafından bulunduğu odanın kalabalık olması gerekçesiyle oda değişikliği talebinde bulunulmuştur.</p>
<p>Talep ile ilgili olarak mevcut oda mevcutları, kurum kapasitesi ve barındırma planlaması incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun bulunduğu odanın doluluk oranının kurum standartları ve mevzuat hükümleri çerçevesinde uygun olduğu, talep edilen değişikliği gerektirecek bir kapasite sorununun bulunmadığı anlaşılmıştır.</p>
<p>Mevcut barındırma planlamasının kurum dengeleri gözetilerek oluşturulduğu, talebin kabul edilmesinin diğer odalarda dengesizliğe yol açabileceği değerlendirilmiştir.</p>
<p>Bu nedenle hükümlü/tutuklunun kapasite gerekçesiyle yapmış olduğu oda değişikliği talebinin reddine karar verilmiştir.</p>`},
  {id:'n57', cat:'Karar', title:'Mahkemeye Sevk Edilmesine İlişkin Karar (Duruşmaya Katılım Nedeniyle)', desc:'Mahkemece talep edilen duruşmaya katılım için sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>MAHKEMEYE SEVK EDİLMESİNE İLİŞKİN KARAR (DURUŞMAYA KATILIM NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklu hakkında ilgili mahkemece gönderilen celp/tensip yazısı, dosyası, disiplin durumu, güvenlik değerlendirmeleri ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan inceleme neticesinde; hükümlü/tutuklunun ilgili mahkemede görülecek duruşmaya bizzat katılımının mahkemece talep edildiği, bu hususun yasal bir zorunluluk teşkil ettiği ve sevk işleminin geciktirilmeksizin yerine getirilmesi gerektiği anlaşılmıştır.</p>
<p>Sevk işleminin gerçekleştirilmesi sırasında hükümlü/tutuklunun ve görevli personelin güvenliğinin sağlanması amacıyla yeterli sayıda ve nitelikte güvenlik personeli görevlendirilmesinin, nakil güzergâhı ve süresi dikkate alınarak gerekli tedbirlerin önceden planlanmasının zorunlu olduğu değerlendirilmiştir.</p>
<p>Ayrıca hükümlü/tutuklunun mahkemeye çıkışı ve kuruma geri dönüşü ile ilgili giriş-çıkış kayıtlarının usulüne uygun şekilde tutulacağı, sevk sürecinde ortaya çıkabilecek herhangi bir olağandışı durumun derhal kurum idaresine ve ilgili mercilere bildirileceği kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun ilgili mahkemede görülecek duruşmaya katılımının sağlanması amacıyla, gerekli güvenlik ve refakat tedbirleri alınarak mahkemeye sevk edilmesine, sevk ve dönüş işlemlerinin kayıt altına alınmasına karar verilmiştir.</p>`},
  {id:'n58', cat:'Karar', title:'Hastaneye Sevk Edilmesine İlişkin Karar (Muayene/Tedavi Nedeniyle)', desc:'Kurum imkânlarıyla karşılanamayan muayene/tedavi için hastane sevk kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>HASTANEYE SEVK EDİLMESİNE İLİŞKİN KARAR (MUAYENE/TEDAVİ NEDENİYLE)</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Hükümlü/Tutuklu:</b> {{AD_SOYAD}}</p>
<p>Hükümlü/Tutuklunun sağlık durumu, kurum sağlık servisi değerlendirmesi, hekim talebi, sevk gerekçesi ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; hükümlü/tutuklunun mevcut sağlık durumunun kurum imkânlarıyla karşılanamayan bir muayene, tetkik veya tedavi gerektirdiği, ilgili sağlık kuruluşuna sevkinin hekim tarafından uygun görüldüğü ve gecikmesinde sakınca bulunup bulunmadığının değerlendirildiği anlaşılmıştır.</p>
<p>Sevk işlemi sırasında hükümlü/tutuklunun sağlığının ve güvenliğinin korunması amacıyla yeterli sayıda güvenlik personeli refakatinde, sağlık kuruluşunun ilgili birimiyle koordineli şekilde nakil işleminin gerçekleştirilmesinin zorunlu olduğu değerlendirilmiştir.</p>
<p>Ayrıca muayene/tedavi sonucunda düzenlenecek rapor ve belgelerin kurum sağlık servisine teslim edilerek dosyasına işleneceği, tedavinin gerektirdiği takip ve kontrol muayenelerinin de aynı usulle yürütüleceği, sevk sürecine ilişkin giriş-çıkış kayıtlarının tutulacağı kanaatine varılmıştır.</p>
<p>Bu nedenle hükümlü/tutuklunun muayene/tedavisinin yapılabilmesi amacıyla, gerekli güvenlik ve refakat tedbirleri alınarak ilgili sağlık kuruluşuna sevk edilmesine, sevk ve dönüş işlemlerinin kayıt altına alınmasına karar verilmiştir.</p>`},
  {id:'u1', cat:'Üst Yazı', title:'İdare ve Gözlem Kurulu Kararı Gönderme Üst Yazısı (Kısa)', desc:'Kurul kararını kısa ve öz şekilde ilgili makama gönderme yazısı.',
   body:`<h2 style="text-align:center">{{KURUM}}</h2>
<p><b>Sayı:</b> ....../......<br><b>Konu:</b> {{KONU}}</p>
<p>Kurumumuz İdare ve Gözlem Kurulunun ....../....../2026 tarih ve ........ sayılı kararı ilişikte gönderilmiş olup, karar doğrultusunda gerekli işlemlerin yapılması hususunda bilgi ve gereğini arz ederim.</p><p style="text-align:right; margin-top:20px;">{{TARIH}}<br>{{AD_SOYAD_HAZIRLAYAN}}<br>Kurum Müdürü</p>`},
  {id:'u2', cat:'Üst Yazı', title:'İdare ve Gözlem Kurulu Kararı Gönderme Üst Yazısı (Standart)', desc:'Kurul kararını standart resmi üslupla ilgili makama gönderme yazısı.',
   body:`<h2 style="text-align:center">{{KURUM}}</h2>
<p><b>Sayı:</b> ....../......<br><b>Konu:</b> {{KONU}}</p>
<p>Kurumumuz İdare ve Gözlem Kurulunun ....../....../2026 tarih ve ........ sayılı kararı ile hükümlü/tutuklunun dosyası, infaz durumu, kurum içerisindeki tutum ve davranışları, disiplin durumu, güvenlik değerlendirmeleri ve ilgili mevzuat hükümleri birlikte değerlendirilmiştir.</p>
<p>Yapılan değerlendirme sonucunda hükümlü/tutuklu hakkında alınan kurul kararı uygun görülmüş olup, gereğinin ifası amacıyla İdare ve Gözlem Kurulu Kararı ilişikte gönderilmiştir.</p>
<p>Bilgi ve gereğini arz ederim.</p><p style="text-align:right; margin-top:20px;">{{TARIH}}<br>{{AD_SOYAD_HAZIRLAYAN}}<br>Kurum Müdürü</p>`},
  {id:'u3', cat:'Üst Yazı', title:'İdare ve Gözlem Kurulu Kararı Gönderme Üst Yazısı (Detaylı)', desc:'Kurul kararını ayrıntılı gerekçeyle birlikte ilgili makama gönderme yazısı.',
   body:`<h2 style="text-align:center">{{KURUM}}</h2>
<p><b>Sayı:</b> ....../......<br><b>Konu:</b> {{KONU}}</p>
<p>Kurumumuz İdare ve Gözlem Kurulunun ....../....../2026 tarih ve ........ sayılı kararı ile hükümlü/tutuklunun dosya kapsamı, infaz süreci, kurum içerisindeki tutum ve davranışları, disiplin durumu, güvenlik değerlendirmeleri ile ilgili mevzuat hükümleri ayrıntılı olarak değerlendirilmiştir.</p>
<p>Yapılan değerlendirme neticesinde alınan kurul kararının uygulanmasının kurum güvenliği, disiplinin sağlanması ve infaz hizmetlerinin etkin şekilde yürütülmesi açısından uygun olacağı kanaatine varılmış olup, söz konusu İdare ve Gözlem Kurulu Kararı ilişikte gönderilmiştir.</p>
<p>Karar kapsamında yer alan hususların ilgili birimlerce incelenerek, gerekli iş ve işlemlerin ivedilikle tesis edilmesi ve sonucundan kurumumuza bilgi verilmesi hususunu bilgilerinize ve gereğinize arz ederim.</p><p style="text-align:right; margin-top:20px;">{{TARIH}}<br>{{AD_SOYAD_HAZIRLAYAN}}<br>Kurum Müdürü</p>`},
  {id:'u4', cat:'Üst Yazı', title:'Genel Bilgi/Bildirim Üst Yazısı', desc:'Herhangi bir konuda ilgili makama bilgi verme amaçlı genel üst yazı.',
   body:`<h2 style="text-align:center">{{KURUM}}</h2>
<p><b>Sayı:</b> ....../......<br><b>Konu:</b> {{KONU}}</p>
<p>İlgi: ....../....../2026 tarihli yazınız / Kurumumuz kayıtları.</p>
<p>Kurumumuzda bulunan hükümlü/tutuklu {{AD_SOYAD}} hakkında düzenlenen dosya, kurum kayıtları, ilgili birim görüşleri ve mevcut bilgi/belgeler incelenmiştir.</p>
<p>Yapılan inceleme neticesinde; {{ICERIK}}</p>
<p>Konu ile ilgili gelişmelerin makamınıza zamanında ve eksiksiz şekilde ulaştırılmasının, ilgili mevzuat hükümleri ve kurumlar arası bilgi akışının sağlıklı yürütülmesi bakımından önem arz ettiği değerlendirilmiştir.</p>
<p>Yukarıda belirtilen hususlara ilişkin bilgi ve belgeler ekte sunulmuş olup, konunun bilgilerinize sunulması ve gereğinin ifası hususunu arz/rica ederim.</p>
<p>Ek: İlgili bilgi ve belgeler (.... sayfa)</p><p style="text-align:right; margin-top:20px;">{{TARIH}}<br>{{AD_SOYAD_HAZIRLAYAN}}<br>Kurum Müdürü</p>`},
  {id:'u5', cat:'Üst Yazı', title:'Evrak/Belge Gönderme Üst Yazısı', desc:'Düzenlenen veya intikal eden bir evrakın ilgili birime gönderilmesi.',
   body:`<h2 style="text-align:center">{{KURUM}}</h2>
<p><b>Sayı:</b> ....../......<br><b>Konu:</b> {{KONU}}</p>
<p>Kurumumuzca yürütülen iş ve işlemler kapsamında düzenlenen/tarafımıza intikal eden ilişikteki evrakın incelenmesi ve gereğinin ifa edilmesi gerektiği değerlendirilmiştir.</p>
<p>Söz konusu evrakın içeriği, ilgili mevzuat hükümleri çerçevesinde değerlendirilmiş olup, {{ICERIK}}</p>
<p>Evrak kapsamında yer alan hususların ilgili birimlerce incelenerek, gerekli iş ve işlemlerin ivedilikle tesis edilmesinin, sürecin sağlıklı ve mevzuata uygun şekilde ilerlemesi açısından gerekli olduğu kanaatine varılmıştır.</p>
<p>Bu nedenle ilişikteki evrakın incelenerek gereğinin yapılması ve sonucundan kurumumuza bilgi verilmesi hususunu bilgilerinize arz/rica ederim.</p>
<p>Ek: ..... (belge adı/sayısı)</p><p style="text-align:right; margin-top:20px;">{{TARIH}}<br>{{AD_SOYAD_HAZIRLAYAN}}<br>Kurum Müdürü</p>`},
  {id:'u6', cat:'Üst Yazı', title:'Talep/Rica Üst Yazısı', desc:'İlgili birimden işlem yapılmasını veya bilgi/belge gönderilmesini talep etme yazısı.',
   body:`<h2 style="text-align:center">{{KURUM}}</h2>
<p><b>Sayı:</b> ....../......<br><b>Konu:</b> {{KONU}}</p>
<p>Kurumumuzda bulunan hükümlü/tutuklu {{AD_SOYAD}} hakkında yürütülen iş ve işlemler kapsamında, dosyası, mevcut durumu ve ilgili birim görüşleri incelenmiştir.</p>
<p>Yapılan değerlendirme neticesinde; {{ICERIK}} hususunda tarafınızca gerekli işlemlerin tesis edilmesine ve konuya ilişkin bilgi/belgelerin kurumumuza iletilmesine ihtiyaç duyulduğu anlaşılmıştır.</p>
<p>Söz konusu talebin karşılanmasının, hükümlü/tutuklunun infaz sürecinin sağlıklı yürütülmesi, ilgili mevzuat hükümlerinin gereği gibi uygulanması ve kurumlar arası iş birliğinin sağlanması bakımından önem taşıdığı değerlendirilmiştir.</p>
<p>Bu nedenle yukarıda belirtilen hususta gerekli işlemlerin yapılması, ilgili bilgi ve belgelerin en kısa sürede kurumumuza intikal ettirilmesi hususunu bilgilerinize arz/rica ederim.</p><p style="text-align:right; margin-top:20px;">{{TARIH}}<br>{{AD_SOYAD_HAZIRLAYAN}}<br>Kurum Müdürü</p>`},
  {id:'u7', cat:'Üst Yazı', title:'Gelen Yazıya Cevap Üst Yazısı', desc:'Bir kurum/makamdan gelen yazıya cevap verme amaçlı üst yazı.',
   body:`<h2 style="text-align:center">{{KURUM}}</h2>
<p><b>Sayı:</b> ....../......<br><b>Konu:</b> {{KONU}}</p>
<p>İlgi: ....../....../2026 tarihli ve ........ sayılı yazınız.</p>
<p>İlgi yazınızda belirtilen husus, kurumumuz kayıtları, ilgili dosya ve mevcut bilgi/belgeler dikkate alınarak incelenmiştir.</p>
<p>Yapılan inceleme neticesinde; {{ICERIK}}</p>
<p>Konuya ilişkin değerlendirme, ilgili mevzuat hükümleri ve kurum uygulamaları çerçevesinde yapılmış olup, yukarıda arz edilen hususların bu doğrultuda değerlendirilmesinin uygun olacağı kanaatine varılmıştır.</p>
<p>Bilgilerinize arz ederim.</p><p style="text-align:right; margin-top:20px;">{{TARIH}}<br>{{AD_SOYAD_HAZIRLAYAN}}<br>Kurum Müdürü</p>`},
];

const Templates = {
  use(id){
    const t = TEMPLATES.find(x=>x.id===id);
    if(!t) return;
    const settings = Store.get('settings', {});
    let html = t.body
      .replaceAll('{{KURUM}}', settings.kurumAdi || '[KURUM ADI]')
      .replaceAll('{{TARIH}}', fmtDate(nowIso()))
      .replaceAll('{{AD_SOYAD}}', '[AD SOYAD]')
      .replaceAll('{{AD_SOYAD_HAZIRLAYAN}}', settings.personelAdi || '[AD SOYAD]')
      .replaceAll('{{KONU}}', '[KONU]')
      .replaceAll('{{ICERIK}}', '[İçerik buraya yazılacak]');
    WordStudio.loadContent(t.title, t.cat, html);
    Router.go('word');
    toast("Şablon Word Studio'ya yüklendi.");
  }
};

/* =========================================================
   KALEM AI — basit anahtar kelime tabanlı karar motoru
   ========================================================= */
const AI_RULES = [
  {keys:['örgüt','örgütsel','terör'],
   docType:'Karar', templateId:'n1', karar:'', kararTemplateId:'',
   ozet:'Hükümlünün örgütsel tutum ve davranışlarını terk etmediğine ilişkin yeterli kanaat oluşmadığı durumlarda açık kuruma ayırma talebi reddedilir.'},
  {keys:['koşullu salıverilme','şartla tahliye'],
   docType:'Karar', templateId:'n2', karar:'', kararTemplateId:'',
   ozet:'İyi hâl yönünden olumsuz kanaat oluşan hükümlüler için koşullu salıverilme değerlendirmesi olumsuz sonuçlandırılır.'},
  {keys:['asayiş','güvenlik riski'],
   docType:'Karar', templateId:'n3', karar:'', kararTemplateId:'',
   ozet:'Asayiş ve güvenlik nedeniyle naklen sevk kararı gerekebilir.'},
  {keys:['uyumsuzluk','disiplin cezaları'],
   docType:'Karar', templateId:'n4', karar:'', kararTemplateId:'',
   ozet:'Disiplin cezaları ve kuruma uyumsuzluk nedeniyle naklen sevk kararı gerekebilir.'},
  {keys:['hasım','husumet'],
   docType:'Karar', templateId:'n5', karar:'', kararTemplateId:'',
   ozet:'Hasımlılık durumu nedeniyle naklen sevk kararı gerekebilir.'},
  {keys:['istihbarat','gruplaşma'],
   docType:'Karar', templateId:'n6', karar:'', kararTemplateId:'',
   ozet:'Örgütsel faaliyet ve istihbari değerlendirmeler nedeniyle naklen sevk kararı gerekebilir.'},
  {keys:['hastane sevkinde firar','sevk sırasında firar'],
   docType:'Karar', templateId:'n7', karar:'', kararTemplateId:'',
   ozet:'Hastane sevki sırasında firar/firar teşebbüsü nedeniyle naklen sevk kararı gerekebilir.'},
  {keys:['can güvenliği','tehdit'],
   docType:'Karar', templateId:'n8', karar:'', kararTemplateId:'',
   ozet:'Can güvenliği riski nedeniyle naklen sevk kararı gerekebilir.'},
  {keys:['yüksek güvenlikli','güvenlik riski disiplin'],
   docType:'Karar', templateId:'n9', karar:'', kararTemplateId:'',
   ozet:'Ciddi güvenlik riski ve disiplin sorunu nedeniyle Yüksek Güvenlikli Kuruma naklen sevk kararı gerekebilir.'},
  {keys:['sağlık nedeniyle nakil','tedavi gereksinimi'],
   docType:'Karar', templateId:'n10', karar:'', kararTemplateId:'',
   ozet:'Sağlık durumu nedeniyle tedavi/uzmanlık gereksinimi doğduğunda naklen sevk kararı gerekebilir.'},
  {keys:['açlık grevi','toplu eylem'],
   docType:'Karar', templateId:'n11', karar:'', kararTemplateId:'',
   ozet:'Açlık grevi/toplu eylem organizasyonu nedeniyle naklen sevk kararı gerekebilir.'},
  {keys:['kurum düzeni bozucu','birden fazla disiplin'],
   docType:'Karar', templateId:'n12', karar:'', kararTemplateId:'',
   ozet:'Tekrarlayan disiplin sorunları ve kurum düzenine etkisi nedeniyle naklen sevk kararı gerekebilir.'},
  {keys:['asayiş ek','güvenlik ek'],
   docType:'Karar', templateId:'n13', karar:'', kararTemplateId:'',
   ozet:'Asayiş ve güvenlik gerekçeli naklin ek/alternatif varyantı.'},
  {keys:['iş yurdu kabul','çalıştırılma talebi'],
   docType:'Karar', templateId:'n14', karar:'', kararTemplateId:'',
   ozet:'İyi hal ve meslek edinme amacıyla iş yurdunda çalıştırma talebi kabul edilebilir.'},
  {keys:['iş yurdu red'],
   docType:'Karar', templateId:'n15', karar:'', kararTemplateId:'',
   ozet:'Disiplin/güvenlik nedeniyle iş yurdunda çalıştırma talebi reddedilebilir.'},
  {keys:['mazeret izni red','izin reddi'],
   docType:'Karar', templateId:'n16', karar:'', kararTemplateId:'',
   ozet:'Uygunluk şartları oluşmadığında mazeret izni talebi reddedilebilir.'},
  {keys:['mazeret izni kabul','vefat izni'],
   docType:'Karar', templateId:'n17', karar:'', kararTemplateId:'',
   ozet:'Zorunlu/özel durum nedeniyle mazeret izni talebi kabul edilebilir.'},
  {keys:['açık kurum kabul','iyi hal açık'],
   docType:'Karar', templateId:'n18', karar:'', kararTemplateId:'',
   ozet:'İyi hal ve yasal şartların oluşması nedeniyle açık kuruma ayrılma talebi kabul edilebilir.'},
  {keys:['koşullu salıverilme olumlu'],
   docType:'Karar', templateId:'n19', karar:'', kararTemplateId:'',
   ozet:'İyi hal ve topluma uyum kanaati oluşan hükümlüler için koşullu salıverilme olumlu sonuçlandırılabilir.'},
  {keys:['denetimli serbestlik olumlu'],
   docType:'Karar', templateId:'n20', karar:'', kararTemplateId:'',
   ozet:'Olumlu kanaat oluşan hükümlüler için denetimli serbestlik değerlendirmesi olumlu sonuçlandırılabilir.'},
  {keys:['denetimli serbestlik olumsuz'],
   docType:'Karar', templateId:'n21', karar:'', kararTemplateId:'',
   ozet:'Yetersiz iyi hal nedeniyle denetimli serbestlik değerlendirmesi olumsuz sonuçlandırılabilir.'},
  {keys:['telefon görüşmesi kabul'],
   docType:'Karar', templateId:'n22', karar:'', kararTemplateId:'',
   ozet:'Disiplin engeli olmayan hükümlü/tutuklu için telefon görüşmesi talebi kabul edilebilir.'},
  {keys:['telefon görüşmesi red'],
   docType:'Karar', templateId:'n23', karar:'', kararTemplateId:'',
   ozet:'Disiplin yaptırımı süren hükümlü/tutuklu için telefon görüşmesi talebi reddedilebilir.'},
  {keys:['ziyaretçi görüşü kabul'],
   docType:'Karar', templateId:'n24', karar:'', kararTemplateId:'',
   ozet:'Şartları taşıyan hükümlü/tutuklu için ziyaretçi görüşü talebi kabul edilebilir.'},
  {keys:['ziyaretçi görüşü red'],
   docType:'Karar', templateId:'n25', karar:'', kararTemplateId:'',
   ozet:'Mevzuat/güvenlik şartları oluşmadığında ziyaretçi görüşü talebi reddedilebilir.'},
  {keys:['kapalı görüş kabul'],
   docType:'Karar', templateId:'n26', karar:'', kararTemplateId:'',
   ozet:'Şartları taşıyan hükümlü/tutuklu için kapalı görüşten yararlandırma kararı verilebilir.'},
  {keys:['kapalı görüş red'],
   docType:'Karar', templateId:'n27', karar:'', kararTemplateId:'',
   ozet:'Disiplin yaptırımı süren hükümlü/tutuklu için kapalı görüş talebi reddedilebilir.'},
  {keys:['açık görüş kabul'],
   docType:'Karar', templateId:'n28', karar:'', kararTemplateId:'',
   ozet:'Şartları taşıyan hükümlü/tutuklu için açık görüşten yararlandırma kararı verilebilir.'},
  {keys:['açık görüş red'],
   docType:'Karar', templateId:'n29', karar:'', kararTemplateId:'',
   ozet:'Disiplin yaptırımı süren hükümlü/tutuklu için açık görüş talebi reddedilebilir.'},
  {keys:['kardeş odası red'],
   docType:'Karar', templateId:'n30', karar:'', kararTemplateId:'',
   ozet:'Barındırma planı gerekçesiyle kardeşin odasına alınma talebi reddedilebilir.'},
  {keys:['kardeş odası kabul'],
   docType:'Karar', templateId:'n31', karar:'', kararTemplateId:'',
   ozet:'Aile bağlarının korunması gerekçesiyle kardeşin odasına alınma talebi kabul edilebilir.'},
  {keys:['nakil talebi red','nakil reddi genel'],
   docType:'Karar', templateId:'n32', karar:'', kararTemplateId:'',
   ozet:'Somut/zorunlu bir gerekçe bulunmadığında nakil talebi reddedilebilir.'},
  {keys:['nakil kabul özel durum'],
   docType:'Karar', templateId:'n33', karar:'', kararTemplateId:'',
   ozet:'Haklı mazeret/özel durum nedeniyle nakil talebi kabul edilebilir.'},
  {keys:['eş aile nakil kabul'],
   docType:'Karar', templateId:'n34', karar:'', kararTemplateId:'',
   ozet:'Eş/aile birliğinin korunması gerekçesiyle nakil talebi kabul edilebilir.'},
  {keys:['eş aile nakil red'],
   docType:'Karar', templateId:'n35', karar:'', kararTemplateId:'',
   ozet:'Aile durumu tek başına nakli gerektirmediğinde talep reddedilebilir.'},
  {keys:['sağlık nakil red'],
   docType:'Karar', templateId:'n36', karar:'', kararTemplateId:'',
   ozet:'Sağlık hizmetleri mevcut kurumda karşılanabildiğinde nakil talebi reddedilebilir.'},
  {keys:['kurumlar arası nakil red'],
   docType:'Karar', templateId:'n37', karar:'', kararTemplateId:'',
   ozet:'Kapasite/güvenlik gerekçesiyle kurumlar arası nakil talebi reddedilebilir.'},
  {keys:['kurumlar arası nakil kabul'],
   docType:'Karar', templateId:'n38', karar:'', kararTemplateId:'',
   ozet:'Uygunluk değerlendirmesi olumlu olduğunda kurumlar arası nakil talebi kabul edilebilir.'},
  {keys:['yasal şartlar oluşmadı'],
   docType:'Karar', templateId:'n39', karar:'', kararTemplateId:'',
   ozet:'Yasal şartların oluşmaması nedeniyle açık kuruma ayrılma talebi reddedilebilir.'},
  {keys:['iyi hal olumsuz'],
   docType:'Karar', templateId:'n40', karar:'', kararTemplateId:'',
   ozet:'Disiplin ve davranış durumu nedeniyle iyi hal değerlendirmesi olumsuz sonuçlandırılabilir.'},
  {keys:['iyi hal olumlu'],
   docType:'Karar', templateId:'n41', karar:'', kararTemplateId:'',
   ozet:'Olumlu davranış değişikliği nedeniyle iyi hal değerlendirmesi olumlu sonuçlandırılabilir.'},
  {keys:['disiplin cezası açık kurum red'],
   docType:'Karar', templateId:'n42', karar:'', kararTemplateId:'',
   ozet:'Disiplin cezası bulunması nedeniyle açık kuruma ayrılma talebi reddedilebilir.'},
  {keys:['kantin harici red','kantin dışı malzeme red'],
   docType:'Karar', templateId:'n43', karar:'', kararTemplateId:'',
   ozet:'Zorunlu bir durum bulunmadığında kantin harici malzeme temini talebi reddedilebilir.'},
  {keys:['kantin harici kabul','kantin dışı malzeme kabul'],
   docType:'Karar', templateId:'n44', karar:'', kararTemplateId:'',
   ozet:'Kişisel ihtiyaç ve mevzuata aykırılık bulunmadığında kantin harici malzeme talebi kabul edilebilir.'},
  {keys:['ilaç temini red','dış kantin ilaç red'],
   docType:'Karar', templateId:'n45', karar:'', kararTemplateId:'',
   ozet:'Sağlık sistemi üzerinden karşılanabildiğinde dış kantin ilaç temini reddedilebilir.'},
  {keys:['ilaç temini kabul','dış kantin ilaç kabul'],
   docType:'Karar', templateId:'n46', karar:'', kararTemplateId:'',
   ozet:'Tedavi sürekliliği gerekçesiyle dış kantin ilaç temini kabul edilebilir.'},
  {keys:['oda değişikliği red','oda değiştirme red'],
   docType:'Karar', templateId:'n47', karar:'', kararTemplateId:'',
   ozet:'Somut/haklı bir neden bulunmadığında oda değişikliği talebi reddedilebilir.'},
  {keys:['oda değişikliği kabul','oda değiştirme kabul'],
   docType:'Karar', templateId:'n48', karar:'', kararTemplateId:'',
   ozet:'Uyum sorunu/güvenlik gerekçesiyle oda değişikliği talebi kabul edilebilir.'},
  {keys:['tek kişilik oda red'],
   docType:'Karar', templateId:'n49', karar:'', kararTemplateId:'',
   ozet:'Zorunluluk bulunmadığında tek kişilik oda talebi reddedilebilir.'},
  {keys:['tek kişilik oda kabul'],
   docType:'Karar', templateId:'n50', karar:'', kararTemplateId:'',
   ozet:'Can güvenliği riski nedeniyle tek kişilik oda talebi kabul edilebilir.'},
  {keys:['oda değişikliği sağlık kabul'],
   docType:'Karar', templateId:'n51', karar:'', kararTemplateId:'',
   ozet:'Sağlık durumu nedeniyle oda değişikliği talebi kabul edilebilir.'},
  {keys:['oda değişikliği sağlık red'],
   docType:'Karar', templateId:'n52', karar:'', kararTemplateId:'',
   ozet:'Sağlık biriminin oda değişikliğini gerekli görmemesi durumunda talep reddedilebilir.'},
  {keys:['oda değişikliği disiplin kabul'],
   docType:'Karar', templateId:'n53', karar:'', kararTemplateId:'',
   ozet:'Oda içi uyum sorunu nedeniyle oda değişikliği talebi kabul edilebilir.'},
  {keys:['oda değişikliği disiplin red'],
   docType:'Karar', templateId:'n54', karar:'', kararTemplateId:'',
   ozet:'Sorun idari uyarıyla çözülebilecek düzeydeyse oda değişikliği talebi reddedilebilir.'},
  {keys:['oda değişikliği kapasite kabul'],
   docType:'Karar', templateId:'n55', karar:'', kararTemplateId:'',
   ozet:'Doluluk oranının yüksek olması nedeniyle oda değişikliği talebi kabul edilebilir.'},
  {keys:['oda değişikliği kapasite red'],
   docType:'Karar', templateId:'n56', karar:'', kararTemplateId:'',
   ozet:'Doluluk oranı standartlara uygunsa oda değişikliği talebi reddedilebilir.'},
  {keys:['mahkemeye sevk','duruşmaya katılım'],
   docType:'Karar', templateId:'n57', karar:'', kararTemplateId:'',
   ozet:'Mahkemece talep edilen duruşmaya katılım için sevk kararı gerekebilir.'},
  {keys:['hastaneye sevk','muayene tedavi sevk'],
   docType:'Karar', templateId:'n58', karar:'', kararTemplateId:'',
   ozet:'Kurum imkânlarıyla karşılanamayan muayene/tedavi için hastaneye sevk kararı gerekebilir.'},
  {keys:['kurul kararı gönderme kısa'],
   docType:'Üst Yazı', templateId:'u1', karar:'', kararTemplateId:'',
   ozet:'İdare ve Gözlem Kurulu kararının kısa üslupla gönderilmesi gerektiğinde kullanılabilir.'},
  {keys:['kurul kararı gönderme standart'],
   docType:'Üst Yazı', templateId:'u2', karar:'', kararTemplateId:'',
   ozet:'İdare ve Gözlem Kurulu kararının standart resmi üslupla gönderilmesi gerektiğinde kullanılabilir.'},
  {keys:['kurul kararı gönderme detaylı'],
   docType:'Üst Yazı', templateId:'u3', karar:'', kararTemplateId:'',
   ozet:'İdare ve Gözlem Kurulu kararının ayrıntılı gerekçeyle gönderilmesi gerektiğinde kullanılabilir.'},
  {keys:['genel bilgi yazısı','bildirim yazısı'],
   docType:'Üst Yazı', templateId:'u4', karar:'', kararTemplateId:'',
   ozet:'Genel amaçlı bilgi/bildirim üst yazısı gerektiğinde kullanılabilir.'},
  {keys:['evrak gönderme','belge gönderme yazısı'],
   docType:'Üst Yazı', templateId:'u5', karar:'', kararTemplateId:'',
   ozet:'Bir evrakın ilgili birime gönderilmesi gerektiğinde kullanılabilir.'},
  {keys:['talep yazısı','rica yazısı'],
   docType:'Üst Yazı', templateId:'u6', karar:'', kararTemplateId:'',
   ozet:'İlgili birimden işlem/bilgi talep edilmesi gerektiğinde kullanılabilir.'},
  {keys:['gelen yazıya cevap','cevap yazısı'],
   docType:'Üst Yazı', templateId:'u7', karar:'', kararTemplateId:'',
   ozet:'Gelen bir yazıya resmi cevap verilmesi gerektiğinde kullanılabilir.'},
];

/* =========================================================
   AI ENGINE — gerçek dil modeli entegrasyonu (Google Gemini, ücretsiz katman)
   Kullanıcı kendi API anahtarını Ayarlar'dan girer; anahtar yalnızca
   bu tarayıcıda (localStorage) saklanır ve doğrudan Google'a gönderilir.
   İnternet yoksa veya anahtar/etkinleştirme yoksa sistem otomatik olarak
   offline kural motorunu (AI_RULES) kullanır.
   ========================================================= */
const AiEngine = {
  geminiModel: 'gemini-2.0-flash',
  groqModel: 'llama-3.3-70b-versatile',
  settings(){ return Store.get('settings', {}); },
  provider(){ return this.settings().aiProvider || 'gemini'; },
  hasKey(){
    const s = this.settings();
    return !!(s.aiEnabled && s.aiKey && s.aiKey.length > 10);
  },
  async callModel(promptText){
    return this.provider()==='groq' ? this.callGroq(promptText) : this.callGemini(promptText);
  },
  async callGemini(promptText){
    const s = this.settings();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${encodeURIComponent(s.aiKey)}`;
    const res = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{ parts:[{ text: promptText }] }] })
    });
    if(!res.ok){
      const errText = await res.text().catch(()=> '');
      throw new Error('Gemini API hatası ('+res.status+'): '+errText.slice(0,200));
    }
    const data = await res.json();
    const text = data && data.candidates && data.candidates[0] && data.candidates[0].content
      && data.candidates[0].content.parts && data.candidates[0].content.parts[0]
      && data.candidates[0].content.parts[0].text;
    if(!text) throw new Error('Gemini modelinden yanıt alınamadı.');
    return text;
  },
  async callGroq(promptText){
    const s = this.settings();
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const res = await fetch(url, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+s.aiKey
      },
      body: JSON.stringify({
        model: this.groqModel,
        messages: [{ role:'user', content: promptText }]
      })
    });
    if(!res.ok){
      const errText = await res.text().catch(()=> '');
      throw new Error('Groq API hatası ('+res.status+'): '+errText.slice(0,200));
    }
    const data = await res.json();
    const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if(!text) throw new Error('Groq modelinden yanıt alınamadı.');
    return text;
  },
  buildPrompt(olayText, person, kurum, relatedLaws){
    const lawBlock = relatedLaws.map(m=>`- ${m.kanun} ${m.madde} (${m.baslik}): ${m.metin}`).join('\n');
    return `Sen bir Türk ceza infaz kurumu / denetimli serbestlik biriminde çalışan, resmi yazışma kurallarına hâkim bir memur asistanısın.
Aşağıdaki olay tarifine dayanarak, kurumsal üslupta, gerekçeli ve mevzuata atıf yapan bir belge taslağı yaz (tutanak/karar/rapor tarzında, olaya en uygun olanı sen seç).

Kurum: ${kurum || '[KURUM ADI]'}
İlgili kişi: ${person || '[AD SOYAD]'}
Olay tarifi: ${olayText}

İlgili olabilecek mevzuat maddeleri (varsa atıf yap, uydurma madde ekleme):
${lawBlock || 'Doğrudan eşleşen madde bulunamadı, genel ifade kullan.'}

Kurallar:
- Resmi, nesnel ve kurumsal bir dil kullan.
- Sadece verilen mevzuat maddelerine atıf yap, yeni kanun/madde numarası uydurma.
- Taslağın sonunda "Bu taslak öneridir, yetkili personel tarafından incelenmelidir" notunu ekleme (arayüz zaten ekleyecek).
- Düz metin olarak, paragraflar halinde yaz.`;
  },
  async testConnection(){
    const box = document.getElementById('aiTestResult');
    box.textContent = 'Test ediliyor...';
    try{
      if(!this.hasKey()){
        box.textContent = "Önce \"Gerçek AI'ı etkinleştir\" kutusunu işaretleyip bir API anahtarı girip kaydedin.";
        return;
      }
      await this.callModel('Sadece "Bağlantı başarılı" yaz.');
      box.textContent = '✓ Bağlantı başarılı. Gerçek AI kullanıma hazır.';
    }catch(err){
      box.textContent = '✗ Bağlantı başarısız: ' + err.message + ' (İnternet yok, anahtar hatalı veya kurum ağı engelliyor olabilir — offline mod yine de çalışmaya devam eder.)';
    }
  }
};

const KalemAI = {
  updateModeIndicator(){
    const el = document.getElementById('aiModeIndicator');
    if(!el) return;
    el.innerHTML = AiEngine.hasKey()
      ? `<span class="chip" style="background:#e6f0e9; color:var(--green);">🟢 Gerçek AI aktif (${AiEngine.provider()==='groq' ? 'Groq' : 'Gemini'})</span>`
      : "<span class=\"chip\">⚪ Offline kural motoru — Ayarlar'dan gerçek AI etkinleştirebilirsiniz</span>";
  },
  ruleMatch(text){
    const lower = text.toLowerCase();
    let matched = null, hitCount = 0;
    AI_RULES.forEach(rule=>{
      const c = rule.keys.filter(k=>lower.includes(k)).length;
      if(c > hitCount){ hitCount = c; matched = rule; }
    });
    return matched;
  },
  async analyze(){
    const text = document.getElementById('aiInput').value.trim();
    const person = document.getElementById('aiPersonName').value.trim();
    const kurum = document.getElementById('aiKurum').value.trim();
    const resultBox = document.getElementById('aiResult');
    const btn = document.getElementById('aiAnalyzeBtn');
    if(!text){
      toast('Lütfen olay tarifini girin.');
      return;
    }
    const matched = this.ruleMatch(text);
    const relatedLaws = Mevzuat.search(text, 3);

    const baseHtml = `
      <h4 style="margin:0 0 6px;">Önerilen Belge Türü ${matched ? '' : '<span class="section-desc">(yakın eşleşme bulunamadı)</span>'}</h4>
      <div class="chip-line">${matched ? `<span class="chip">${escapeHtml(matched.docType)}</span>${matched.karar ? '<span class="chip">+ '+escapeHtml(matched.karar)+'</span>' : ''}` : "<span class=\"chip\">Word Studio'da manuel oluşturun</span>"}</div>
      ${matched ? `<p class="section-desc" style="margin:12px 0 0;">${escapeHtml(matched.ozet)}</p>` : ''}

      <h4 style="margin:20px 0 6px;">İlgili Mevzuat</h4>
      ${relatedLaws.length ? relatedLaws.map(m=>`
        <div class="card law-card"><div class="law-title">${escapeHtml(m.baslik)}</div><div class="law-meta">${escapeHtml(m.kanun)} · ${escapeHtml(m.madde)}</div><div class="law-text">${escapeHtml(m.metin)}</div></div>
      `).join('') : '<p class="section-desc">Doğrudan eşleşen madde bulunamadı.</p>'}

      ${matched ? `<div class="toolbar" style="margin-top:18px;">
        <button class="btn secondary" onclick="KalemAI.createDraft('${matched.templateId}', ${JSON.stringify(text).replace(/"/g,'&quot;')}, '${escapeHtml(person)}', '${escapeHtml(kurum)}')">Şablon Taslağını Word Studio'da Oluştur</button>
        ${matched.kararTemplateId ? `<button class="btn secondary" onclick="KalemAI.createDraft('${matched.kararTemplateId}', ${JSON.stringify(text).replace(/"/g,'&quot;')}, '${escapeHtml(person)}', '${escapeHtml(kurum)}')">İkinci aşama belgeyi oluştur</button>` : ''}
      </div>` : ''}

      <div id="aiRealResult" style="margin-top:18px;"></div>
    `;
    resultBox.style.display = 'block';
    resultBox.innerHTML = baseHtml;

    const realBox = document.getElementById('aiRealResult');
    if(AiEngine.hasKey()){
      btn.disabled = true;
      realBox.innerHTML = `<div class="section-desc">✦ Gerçek AI ile gerekçeli taslak oluşturuluyor, lütfen bekleyin...</div>`;
      try{
        const prompt = AiEngine.buildPrompt(text, person, kurum, relatedLaws);
        const draft = await AiEngine.callModel(prompt);
        this._lastDraft = draft;
        realBox.innerHTML = `
          <h4 style="margin:0 0 6px;">🟢 Gerçek AI Taslağı (${AiEngine.provider()==='groq' ? 'Groq' : 'Gemini'})</h4>
          <div class="card card-pad" style="white-space:pre-wrap; line-height:1.75; font-size:13.5px;">${escapeHtml(draft)}</div>
          <div class="toolbar" style="margin-top:14px;">
            <button class="btn bronze" onclick="KalemAI.sendAiDraftToWord('${escapeHtml(person)}', '${escapeHtml(kurum)}')">✦ Bu Taslağı Word Studio'ya Aktar</button>
          </div>
        `;
      }catch(err){
        realBox.innerHTML = `<div class="empty-state">Gerçek AI'a ulaşılamadı (${escapeHtml(err.message)}). İnternet bağlantınızı veya API anahtarınızı kontrol edin. Yukarıdaki kural tabanlı öneri kullanılabilir.</div>`;
      }finally{
        btn.disabled = false;
      }
    }

    const finalNote = document.createElement('p');
    finalNote.className = 'section-desc';
    finalNote.style.marginTop = '14px';
    finalNote.style.fontStyle = 'italic';
    finalNote.textContent = 'Not: Üretilen taslaklar yalnızca öneridir; içerik yetkili personel tarafından incelenmeli ve onaylanmalıdır.';
    resultBox.appendChild(finalNote);
  },
  sendAiDraftToWord(person, kurum){
    if(!this._lastDraft) return;
    const settings = Store.get('settings', {});
    const paragraphs = this._lastDraft.split(/\n+/).filter(p=>p.trim()).map(p=>`<p>${escapeHtml(p)}</p>`).join('');
    const html = `<h2 style="text-align:center">${escapeHtml(kurum || settings.kurumAdi || '[KURUM ADI]')}</h2>
<p><b>Tarih:</b> ${fmtDate(nowIso())} &nbsp; <b>İlgili Kişi:</b> ${escapeHtml(person || '[AD SOYAD]')}</p>
${paragraphs}
<p style="margin-top:30px;">Hazırlayan: ${escapeHtml(settings.personelAdi || '.........................')}</p>`;
    WordStudio.loadContent('AI Taslağı - '+fmtDate(nowIso()), 'Diğer', html);
    Router.go('word');
    toast("Taslak Word Studio'ya aktarıldı.");
  },
  createDraft(templateId, ozetText, person, kurum){
    const t = TEMPLATES.find(x=>x.id===templateId);
    if(!t) return;
    const settings = Store.get('settings', {});
    let html = t.body
      .replaceAll('{{KURUM}}', kurum || settings.kurumAdi || '[KURUM ADI]')
      .replaceAll('{{TARIH}}', fmtDate(nowIso()))
      .replaceAll('{{AD_SOYAD}}', person || '[AD SOYAD]')
      .replaceAll('{{AD_SOYAD_HAZIRLAYAN}}', settings.personelAdi || '[AD SOYAD]')
      .replaceAll('{{KONU}}', 'KALEM AI Önerisi')
      .replaceAll('{{ICERIK}}', escapeHtml(ozetText));
    WordStudio.loadContent(t.title, t.cat, html);
    Router.go('word');
    toast("Taslak Word Studio'ya aktarıldı.");
  }
};

/* =========================================================
   BELGE YÖNETİMİ
   ========================================================= */
const Docs = {
  all(){ return Store.get('documents', []); },
  saveAll(list){ Store.set('documents', list); },
  newBlank(){
    WordStudio.loadContent('Yeni Belge', 'Diğer', '<p>Belge içeriğini buraya yazın.</p>');
    Router.go('word');
  },
  edit(id){
    const d = this.all().find(x=>x.id===id);
    if(!d) return;
    WordStudio.loadContent(d.title, d.type, d.content, d.id, d.person);
    Router.go('word');
  },
  archive(id){
    const list = this.all();
    const d = list.find(x=>x.id===id);
    if(d){ d.archived = true; d.archivedAt = nowIso(); this.saveAll(list); toast('Belge arşivlendi.'); }
  },
  restore(id){
    const list = this.all();
    const d = list.find(x=>x.id===id);
    if(d){ d.archived = false; this.saveAll(list); this.renderArchive(); toast('Belge geri yüklendi.'); }
  },
  remove(id){
    if(!confirm('Bu belgeyi kalıcı olarak silmek istediğinize emin misiniz?')) return;
    const list = this.all().filter(x=>x.id!==id);
    this.saveAll(list); this.renderArchive();
    toast('Belge silindi.');
  },
  renderArchive(){
    const list = this.all().filter(d=>d.archived).sort((a,b)=> new Date(b.archivedAt||0) - new Date(a.archivedAt||0));
    const body = document.getElementById('archiveTableBody');
    document.getElementById('archiveEmpty').style.display = list.length? 'none':'block';
    body.innerHTML = list.map(d=>`
      <tr>
        <td><b>${escapeHtml(d.title)}</b></td>
        <td><span class="badge type">${escapeHtml(d.type)}</span></td>
        <td>${fmtDate(d.archivedAt)}</td>
        <td style="white-space:nowrap;">
          <button class="btn secondary small" onclick="Docs.restore('${d.id}')">Geri Yükle</button>
          <button class="btn danger small" onclick="Docs.remove('${d.id}')">Kalıcı Sil</button>
        </td>
      </tr>
    `).join('');
  }
};

/* =========================================================
   WORD STUDIO
   ========================================================= */
/* =========================================================
   RESMİ DİL KALIPLARI — Word Studio yardımcı referans paneli
   ========================================================= */
const RESMI_DIL_KALIPLARI = [
  {kategori:'İnceleme / Tespit', kaliplar:[
    '...dosyası, kayıtları ve ilgili bilgi/belgeler incelenmiştir.',
    'Yapılan inceleme/değerlendirme neticesinde...',
    '...hususu tespit edilmiştir.',
    '...olduğu anlaşılmıştır.',
    '...görülmüştür/müşahede edilmiştir.'
  ]},
  {kategori:'Değerlendirme / Gerekçelendirme', kaliplar:[
    '...kanaatine varılmıştır.',
    '...değerlendirilmiştir/mütalaa edilmektedir.',
    '...sonucuna ulaşılmıştır.',
    'Dosya kapsamı, ... birlikte değerlendirildiğinde...',
    '...bakımından önem arz etmektedir/önem taşımaktadır.',
    '...gerekli ve uygun olduğu değerlendirilmiştir.'
  ]},
  {kategori:'Bağlayıcı / Geçiş', kaliplar:[
    'Bu itibarla...',
    'Bu kapsamda...',
    'Bu nedenle...',
    'Ayrıca...',
    'Öte yandan...',
    'Bununla birlikte...',
    'Yukarıda arz edilen hususlar çerçevesinde...',
    'Yukarıda belirtilen gerekçelerle...'
  ]},
  {kategori:'Karar Bildiren', kaliplar:[
    '...karar verilmiştir.',
    '...karar verilmesinin uygun olduğuna karar verilmiştir.',
    '...uygun görülmüştür/uygun mütalaa edilmiştir.',
    '...hususu kendisine tebliğ olunur.',
    '...reddine/kabulüne karar verilmiştir.'
  ]},
  {kategori:'Arz / Rica Kapanış', kaliplar:[
    'Bilgilerinize arz ederim.',
    'Gereğini rica ederim.',
    'Bilgi ve gereğini arz/rica ederim.',
    'Takdir ve tensiplerinize arz ederim.',
    'Olurlarınıza arz ederim.'
  ]}
];

const WordStudio = {
  currentId:null,
  _initialized:false,
  init(){
    this._initialized = true;
    if(!document.getElementById('wordTitle').value){
      document.getElementById('wordEditor').innerHTML = '<p>Belge içeriğini buraya yazın veya bir şablon seçin.</p>';
    }
    this.renderPhrasePanel();
  },
  renderPhrasePanel(){
    const box = document.getElementById('phraseList');
    if(!box) return;
    box.innerHTML = RESMI_DIL_KALIPLARI.map(grp => `
      <div style="margin-bottom:14px;">
        <div style="font-family:sans-serif; font-size:10.5px; font-weight:700; letter-spacing:.4px; text-transform:uppercase; color:var(--bronze-dark); margin-bottom:6px;">${escapeHtml(grp.kategori)}</div>
        ${grp.kaliplar.map(k => `<div class="tag-pill" style="display:block; margin-bottom:5px; cursor:pointer;" onclick="WordStudio.insertPhrase(${JSON.stringify(k)})">${escapeHtml(k)}</div>`).join('')}
      </div>
    `).join('');
  },
  insertPhrase(text){
    const editor = document.getElementById('wordEditor');
    editor.focus();
    document.execCommand('insertText', false, text + ' ');
  },
  cmd(command){ document.execCommand(command, false, null); document.getElementById('wordEditor').focus(); },
  block(tag){ document.execCommand('formatBlock', false, tag); document.getElementById('wordEditor').focus(); },
  clearFormat(){ document.execCommand('removeFormat', false, null); },
  loadContent(title, type, html, id, person){
    this._initialized = true;
    document.getElementById('wordTitle').value = title || '';
    document.getElementById('wordDocType').value = type || 'Diğer';
    document.getElementById('wordEditor').innerHTML = html || '';
    this.currentId = id || null;
    this._person = person || '';
  },
  save(){
    const title = document.getElementById('wordTitle').value.trim() || 'Adsız Belge';
    const type = document.getElementById('wordDocType').value;
    const content = document.getElementById('wordEditor').innerHTML;
    const list = Docs.all();
    if(this.currentId){
      const d = list.find(x=>x.id===this.currentId);
      if(d){ d.title=title; d.type=type; d.content=content; d.updatedAt=nowIso(); }
    } else {
      const doc = {id:uid(), title, type, content, person:this._person||'', status:'Taslak', createdAt:nowIso(), updatedAt:nowIso(), archived:false};
      list.push(doc);
      this.currentId = doc.id;
    }
    Docs.saveAll(list);
    toast('Belge kaydedildi.');
  },
  exportDoc(){
    const title = document.getElementById('wordTitle').value.trim() || 'belge';
    const content = document.getElementById('wordEditor').innerHTML;
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="font-family:Georgia,serif; font-size:14px; line-height:1.7;">${content}</body></html>`;
    download(title.replace(/[^\\wğüşöçıİĞÜŞÖÇ -]/g,'')+'.doc', html, 'application/msword');
    toast('.doc dosyası indirildi.');
  }
};

/* =========================================================
   EXCEL STUDIO
   ========================================================= */
const EXCEL_TEMPLATES = [];

const ExcelStudio = {
  data: Store.get('excelGrid', null) || {rows:8, cols:6, cells:{}},
  persist(){ Store.set('excelGrid', this.data); },
  render(){
    this.renderTemplates();
    document.getElementById('excelTitle').value = Store.get('excelTitle','');
    const table = document.getElementById('excelGrid');
    let html = '<tr><th class="rownum"></th>';
    for(let c=0;c<this.data.cols;c++) html += `<th>${this.colLabel(c)}</th>`;
    html += '</tr>';
    for(let r=0;r<this.data.rows;r++){
      html += `<tr><th class="rownum">${r+1}</th>`;
      for(let c=0;c<this.data.cols;c++){
        const key = r+'_'+c;
        const val = this.data.cells[key] || '';
        html += `<td><input value="${escapeHtml(val)}" onchange="ExcelStudio.setCell(${r},${c},this.value)"></td>`;
      }
      html += '</tr>';
    }
    table.innerHTML = html;
  },
  renderTemplates(){
    const grid = document.getElementById('excelTemplateGrid');
    if(!grid) return;
    const custom = Store.get('excelTemplates', []);
    const builtinHtml = EXCEL_TEMPLATES.map(t=>`
      <div class="card tmpl-card" onclick="ExcelStudio.applyTemplate('${t.id}', false)">
        <div class="cat">Hazır Şablon</div>
        <h4>${escapeHtml(t.title)}</h4>
        <p>${escapeHtml(t.desc)}</p>
      </div>
    `).join('');
    const customHtml = custom.map(t=>`
      <div class="card tmpl-card" style="position:relative;">
        <div onclick="ExcelStudio.applyTemplate('${t.id}', true)">
          <div class="cat">Özel Şablon</div>
          <h4>${escapeHtml(t.title)}</h4>
          <p>${escapeHtml((t.headers||[]).join(', '))}</p>
        </div>
        <button class="btn danger small" style="position:absolute; top:10px; right:10px;" onclick="event.stopPropagation(); ExcelStudio.deleteTemplate('${t.id}')">Sil</button>
      </div>
    `).join('');
    grid.innerHTML = (builtinHtml + customHtml) || '<div class="empty-state">Henüz şablon yok.</div>';
  },
  applyTemplate(id, isCustom){
    const list = isCustom ? Store.get('excelTemplates', []) : EXCEL_TEMPLATES;
    const t = list.find(x=>x.id===id);
    if(!t) return;
    if(!confirm('Bu şablonu uygulamak mevcut tablo içeriğinin üzerine yazacaktır. Devam edilsin mi?')) return;
    const headers = t.headers || [];
    this.data = {rows: 12, cols: headers.length || this.data.cols, cells:{}};
    headers.forEach((h,i)=>{ this.data.cells['0_'+i] = h; });
    this.persist();
    document.getElementById('excelTitle').value = t.title;
    Store.set('excelTitle', t.title);
    this.render();
    toast('Şablon uygulandı: '+t.title);
  },
  saveAsTemplate(){
    const headers = [];
    for(let c=0;c<this.data.cols;c++) headers.push(this.data.cells['0_'+c] || ('Sütun '+(c+1)));
    const name = prompt('Şablon adı girin:', document.getElementById('excelTitle').value || 'Yeni Şablon');
    if(!name || !name.trim()) return;
    const custom = Store.get('excelTemplates', []);
    custom.push({id: uid(), title: name.trim(), headers});
    Store.set('excelTemplates', custom);
    this.renderTemplates();
    toast('Şablon kaydedildi: '+name.trim());
  },
  deleteTemplate(id){
    if(!confirm('Bu özel şablonu silmek istediğinize emin misiniz?')) return;
    const custom = Store.get('excelTemplates', []).filter(t=>t.id!==id);
    Store.set('excelTemplates', custom);
    this.renderTemplates();
    toast('Şablon silindi.');
  },
  colLabel(i){
    let s=''; i++;
    while(i>0){ const m=(i-1)%26; s=String.fromCharCode(65+m)+s; i=Math.floor((i-1)/26); }
    return s;
  },
  setCell(r,c,val){ this.data.cells[r+'_'+c] = val; this.persist(); },
  addRow(){ this.data.rows++; this.persist(); this.render(); },
  addCol(){ this.data.cols++; this.persist(); this.render(); },
  removeRow(){ if(this.data.rows>1){ this.data.rows--; this.persist(); this.render(); } },
  removeCol(){ if(this.data.cols>1){ this.data.cols--; this.persist(); this.render(); } },
  toArray(){
    const arr = [];
    for(let r=0;r<this.data.rows;r++){
      const row = [];
      for(let c=0;c<this.data.cols;c++) row.push(this.data.cells[r+'_'+c] || '');
      arr.push(row);
    }
    return arr;
  },
  exportCsv(){
    const title = document.getElementById('excelTitle').value.trim() || 'tablo';
    Store.set('excelTitle', title);
    const arr = this.toArray();
    const csv = arr.map(row=>row.map(cell=>'"'+String(cell).replace(/"/g,'""')+'"').join(',')).join('\\r\\n');
    download(title.replace(/[^\\wğüşöçıİĞÜŞÖÇ -]/g,'')+'.csv', '\\ufeff'+csv, 'text/csv;charset=utf-8;');
    toast('CSV indirildi.');
  },
  exportXls(){
    const title = document.getElementById('excelTitle').value.trim() || 'tablo';
    Store.set('excelTitle', title);
    const arr = this.toArray();
    let html = '<table border="1">' + arr.map(row=>'<tr>'+row.map(c=>'<td>'+escapeHtml(c)+'</td>').join('')+'</tr>').join('') + '</table>';
    const doc = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body>${html}</body></html>`;
    download(title.replace(/[^\\wğüşöçıİĞÜŞÖÇ -]/g,'')+'.xls', doc, 'application/vnd.ms-excel');
    toast('Excel (.xls) dosyası indirildi.');
  }
};

/* =========================================================
   PDF STUDIO (tarayıcı yazdırma tabanlı, tamamen offline)
   ========================================================= */
const PdfStudio = {
  populateSelect(){
    const sel = document.getElementById('pdfDocSelect');
    const list = Docs.all().filter(d=>!d.archived);
    sel.innerHTML = list.length
      ? list.map(d=>`<option value="${d.id}">${escapeHtml(d.title)} (${escapeHtml(d.type)})</option>`).join('')
      : '<option value="">Kayıtlı belge yok</option>';
  },
  load(){
    const id = document.getElementById('pdfDocSelect').value;
    const d = Docs.all().find(x=>x.id===id);
    const box = document.getElementById('pdfPreview');
    if(!d){ box.innerHTML = "<div class=\"empty-state\">Önce Word Studio'da bir belge kaydedin.</div>"; return; }
    box.innerHTML = d.content;
  }
};

/* =========================================================
   ARŞİV — Docs.renderArchive() içinde ele alınıyor
   ========================================================= */

/* =========================================================
   TAKVİM & HATIRLATICILAR
   ========================================================= */
const Calendar = {
  cursor: new Date(),
  reminders(){ return Store.get('reminders', []); },
  saveReminders(list){ Store.set('reminders', list); },
  shiftMonth(delta){ this.cursor.setMonth(this.cursor.getMonth()+delta); this.render(); },
  render(){
    const y = this.cursor.getFullYear(), m = this.cursor.getMonth();
    document.getElementById('calMonthLabel').textContent = this.cursor.toLocaleDateString('tr-TR',{month:'long', year:'numeric'});
    const dayLabels = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
    document.getElementById('calDayLabels').innerHTML = dayLabels.map(d=>`<div class="cal-day-label">${d}</div>`).join('');

    const first = new Date(y,m,1);
    let startOffset = (first.getDay()+6)%7; // pazartesi=0
    const daysInMonth = new Date(y,m+1,0).getDate();
    const reminders = this.reminders();
    const todayStr = new Date().toDateString();

    let html = '';
    for(let i=0;i<startOffset;i++) html += '<div class="cal-cell empty"></div>';
    for(let day=1; day<=daysInMonth; day++){
      const dateObj = new Date(y,m,day);
      const isToday = dateObj.toDateString()===todayStr;
      const dayReminders = reminders.filter(r=>{
        const rd = new Date(r.date);
        return rd.getFullYear()===y && rd.getMonth()===m && rd.getDate()===day;
      });
      html += `<div class="cal-cell ${isToday?'today':''}" onclick="Calendar.openNew('${dateObj.toISOString().slice(0,10)}')">
        <div class="d">${day}</div>
        ${dayReminders.slice(0,2).map(r=>`<span class="evt">${escapeHtml(r.text)}</span>`).join('')}
        ${dayReminders.length>2? `<span class="evt">+${dayReminders.length-2} daha</span>`:''}
      </div>`;
    }
    document.getElementById('calGrid').innerHTML = html;
    this.renderList();
  },
  renderList(){
    const list = this.reminders().slice().sort((a,b)=> new Date(a.date)-new Date(b.date));
    const box = document.getElementById('reminderList');
    if(list.length===0){
      box.innerHTML = '<div class="empty-state">Hatırlatıcı bulunmuyor.</div>';
      return;
    }
    box.innerHTML = list.map(r=>`
      <div class="reminder-row">
        <div class="dot"></div>
        <div class="date">${fmtDate(r.date)}</div>
        <div class="txt">${escapeHtml(r.text)}</div>
        <button class="btn danger small" onclick="Calendar.remove('${r.id}')">Sil</button>
      </div>
    `).join('');
  },
  openNew(dateStr){
    const d = dateStr || new Date().toISOString().slice(0,10);
    Modal.open('Yeni Hatırlatıcı', `
      <div class="field"><label class="field-label">Tarih</label><input class="input" type="date" id="remDate" value="${d}"></div>
      <div class="field"><label class="field-label">Açıklama</label><input class="input" id="remText" placeholder="Örn: Yükümlü görüşme günü"></div>
    `, `
      <button class="btn secondary" onclick="Modal.close()">Vazgeç</button>
      <button class="btn bronze" onclick="Calendar.add()">Kaydet</button>
    `);
  },
  add(){
    const date = document.getElementById('remDate').value;
    const text = document.getElementById('remText').value.trim();
    if(!date || !text){ toast('Tarih ve açıklama gerekli.'); return; }
    const list = this.reminders();
    list.push({id:uid(), date, text});
    this.saveReminders(list);
    Modal.close();
    this.render();
    toast('Hatırlatıcı eklendi.');
  },
  remove(id){
    this.saveReminders(this.reminders().filter(r=>r.id!==id));
    this.render();
  }
};

/* =========================================================
   AYARLAR
   ========================================================= */
const Settings = {
  load(){
    const s = Store.get('settings', {});
    document.getElementById('setAiEnabled').checked = !!s.aiEnabled;
    document.getElementById('setAiProvider').value = s.aiProvider || 'gemini';
    document.getElementById('setAiKey').value = s.aiKey || '';
    this.onProviderChange();
  },
  onProviderChange(){
    const provider = document.getElementById('setAiProvider').value;
    const label = document.getElementById('setAiKeyLabel');
    const input = document.getElementById('setAiKey');
    if(provider==='groq'){
      label.textContent = 'Groq API Anahtarı';
      input.placeholder = 'gsk_...';
    } else {
      label.textContent = 'Gemini API Anahtarı';
      input.placeholder = 'AIzaSy...';
    }
  },
  save(){
    const existing = Store.get('settings', {});
    const s = {
      ...existing,
      aiEnabled: document.getElementById('setAiEnabled').checked,
      aiProvider: document.getElementById('setAiProvider').value,
      aiKey: document.getElementById('setAiKey').value.trim(),
    };
    Store.set('settings', s);
    toast('Ayarlar kaydedildi.');
    if(typeof KalemAI !== 'undefined') KalemAI.updateModeIndicator();
  },
  exportBackup(){
    const backup = {
      documents: Store.get('documents', []),
      reminders: Store.get('reminders', []),
      settings: Store.get('settings', {}),
      excelGrid: Store.get('excelGrid', null),
      excelTitle: Store.get('excelTitle',''),
      excelTemplates: Store.get('excelTemplates', []),
      exportedAt: nowIso(),
    };
    download('kalem_yedek_'+new Date().toISOString().slice(0,10)+'.json', JSON.stringify(backup, null, 2), 'application/json');
    toast('Yedek dosyası indirildi.');
  },
  importBackup(ev){
    const file = ev.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e=>{
      try{
        const data = JSON.parse(e.target.result);
        if(data.documents) Store.set('documents', data.documents);
        if(data.reminders) Store.set('reminders', data.reminders);
        if(data.settings) Store.set('settings', data.settings);
        if(data.excelGrid) Store.set('excelGrid', data.excelGrid);
        if(data.excelTitle!==undefined) Store.set('excelTitle', data.excelTitle);
        if(data.excelTemplates) Store.set('excelTemplates', data.excelTemplates);
        toast('Yedek başarıyla geri yüklendi. Sayfa yenileniyor...');
        setTimeout(()=>location.reload(), 1200);
      }catch(err){
        toast('Yedek dosyası okunamadı.');
      }
    };
    reader.readAsText(file);
  },
  clearAll(){
    if(!confirm('TÜM veriler (belgeler, hatırlatıcılar, ayarlar) kalıcı olarak silinecek. Emin misiniz?')) return;
    ['documents','reminders','settings','excelGrid','excelTitle','excelTemplates'].forEach(k=>localStorage.removeItem('kalem_'+k));
    toast('Tüm veriler silindi. Sayfa yenileniyor...');
    setTimeout(()=>location.reload(), 1000);
  }
};

/* =========================================================
   DASHBOARD
   ========================================================= */
const Dashboard = {
  render(){
    const docs = Docs.all().filter(d=>!d.archived);
    const archived = Docs.all().filter(d=>d.archived);
    const reminders = Calendar.reminders();
    const upcoming = reminders.filter(r=> new Date(r.date) >= new Date(new Date().toDateString())).sort((a,b)=>new Date(a.date)-new Date(b.date));

    const stats = [
      {label:'Toplam Belge', num:docs.length, sub:'aktif belge'},
      {label:'Taslaklar', num:docs.filter(d=>d.status!=='Tamamlandı').length, sub:'inceleme bekliyor'},
      {label:'Arşivlenmiş', num:archived.length, sub:'arşiv kaydı'},
      {label:'Hatırlatıcılar', num:upcoming.length, sub:'yaklaşan'},
    ];
    document.getElementById('dashStats').innerHTML = stats.map(s=>`
      <div class="card stat-card">
        <div class="label">${s.label}</div>
        <div class="num">${s.num}</div>
        <div class="sub">${s.sub}</div>
      </div>
    `).join('');

    const recent = docs.slice().sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,5);
    document.getElementById('dashRecentDocs').innerHTML = recent.length ? recent.map(d=>`
      <div class="reminder-row">
        <div class="dot"></div>
        <div class="txt"><b>${escapeHtml(d.title)}</b><br><span style="color:var(--ink-soft); font-size:11.5px;">${escapeHtml(d.type)} · ${fmtDate(d.updatedAt)}</span></div>
        <button class="btn secondary small" onclick="Docs.edit('${d.id}')">Aç</button>
      </div>
    `).join('') : '<div class="empty-state">Henüz belge yok.</div>';

    document.getElementById('dashReminders').innerHTML = upcoming.length ? upcoming.slice(0,5).map(r=>`
      <div class="reminder-row">
        <div class="dot"></div>
        <div class="date">${fmtDate(r.date)}</div>
        <div class="txt">${escapeHtml(r.text)}</div>
      </div>
    `).join('') : '<div class="empty-state">Yaklaşan hatırlatıcı yok.</div>';
  }
};

/* ---------------- Başlangıç ---------------- */
Dashboard.render();
Calendar.render();
ExcelStudio.render();
KalemAI.updateModeIndicator();
