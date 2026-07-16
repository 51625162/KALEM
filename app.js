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
    documents:['Belge Yönetimi','KALEM / Belgeler'],
    templates:['Şablon Merkezi','KALEM / Şablonlar'],
    mevzuat:['Mevzuat Merkezi','KALEM / Mevzuat'],
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
    if(name==='documents') Docs.render();
    if(name==='templates') Templates.render();
    if(name==='mevzuat') Mevzuat.render();
    if(name==='archive') Docs.renderArchive();
    if(name==='calendar') Calendar.render();
    if(name==='pdf') PdfStudio.populateSelect();
    if(name==='settings') Settings.load();
    if(name==='excel') ExcelStudio.render();
    if(name==='word' && !WordStudio._initialized) WordStudio.init();
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
];

const Mevzuat = {
  render(filter){
    const list = document.getElementById('lawList');
    const q = (filter!==undefined? filter : document.getElementById('lawSearch').value).toLowerCase().trim();
    const items = MEVZUAT_DB.filter(m=>{
      if(!q) return true;
      return (m.kanun+' '+m.madde+' '+m.baslik+' '+m.konu+' '+m.metin).toLowerCase().includes(q);
    });
    if(items.length===0){
      list.innerHTML = '<div class="empty-state"><div class="big">§</div>Sonuç bulunamadı.</div>';
      return;
    }
    list.innerHTML = items.map(m=>`
      <div class="card law-card">
        <div class="law-title">${escapeHtml(m.baslik)}</div>
        <div class="law-meta">${escapeHtml(m.kanun)} · ${escapeHtml(m.madde)}</div>
        <div class="law-text">${escapeHtml(m.metin)}</div>
      </div>
    `).join('');
  },
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
document.getElementById('lawSearch').addEventListener('input', e=>Mevzuat.render(e.target.value));

/* =========================================================
   ŞABLON MERKEZİ — gömülü şablon verisi
   Placeholders: {{KURUM}}, {{TARIH}}, {{AD_SOYAD}}, {{KONU}}, {{ICERIK}}
   ========================================================= */
const TEMPLATES = [
  {id:'t1', cat:'Dilekçe', title:'Ziyaretçi Ek Görüşme Talep Dilekçesi', desc:'Hükümlü/tutuklu adına ek görüşme talebi için standart dilekçe.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>MÜDÜRLÜĞÜNE</h2>
<p>Kurumunuzda bulunmaktayım. Aşağıda belirtilen gerekçe ile ek görüşme yapmama izin verilmesini arz ederim.</p>
<p><b>Gerekçe:</b> {{ICERIK}}</p>
<p>Gereğini bilgilerinize saygıyla arz ederim.</p>
<p style="text-align:right">{{TARIH}}<br>{{AD_SOYAD}}<br>İmza</p>`},

  {id:'t2', cat:'Dilekçe', title:'Sağlık Muayenesi Talep Dilekçesi', desc:'Hükümlü/tutuklunun sağlık birimine sevk talebi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>MÜDÜRLÜĞÜNE</h2>
<p>Aşağıda belirtilen sağlık şikâyetim nedeniyle revire/hastaneye sevkimin yapılmasını talep ederim.</p>
<p><b>Şikâyet:</b> {{ICERIK}}</p>
<p style="text-align:right">{{TARIH}}<br>{{AD_SOYAD}}<br>İmza</p>`},

  {id:'t3', cat:'Üst Yazı', title:'Denetimli Serbestlik Müdürlüğüne Bilgi Yazısı', desc:'Yükümlü hakkındaki gelişmenin ilgili makama bildirilmesi.',
   body:`<h2 style="text-align:center">{{KURUM}}</h2>
<p><b>Sayı:</b> ....../......<br><b>Konu:</b> {{KONU}}</p>
<p><b>DENETİMLİ SERBESTLİK MÜDÜRLÜĞÜNE</b></p>
<p>{{ICERIK}}</p>
<p>Bilgilerinize arz/rica ederim.</p>
<p style="text-align:right">{{TARIH}}<br>{{AD_SOYAD}}<br>Kurum Müdürü</p>`},

  {id:'t4', cat:'Üst Yazı', title:'Cumhuriyet Başsavcılığına Bildirim Yazısı', desc:'Yükümlülük ihlali ya da adli işlem gerektiren durumun bildirimi.',
   body:`<h2 style="text-align:center">{{KURUM}}</h2>
<p><b>Sayı:</b> ....../......<br><b>Konu:</b> {{KONU}}</p>
<p><b>CUMHURİYET BAŞSAVCILIĞINA</b></p>
<p>{{ICERIK}}</p>
<p>Gereğinin yapılmasını arz ederim.</p>
<p style="text-align:right">{{TARIH}}<br>{{AD_SOYAD}}<br>Kurum Müdürü</p>`},

  {id:'t5', cat:'Tutanak', title:'Disiplin Olayı Tespit Tutanağı', desc:'Kurum içinde meydana gelen disiplin gerektiren olayın kaydı.',
   body:`<h2 style="text-align:center">OLAY TESPİT TUTANAĞI</h2>
<p><b>Kurum:</b> {{KURUM}}<br><b>Tarih/Saat:</b> {{TARIH}}<br><b>İlgili Kişi:</b> {{AD_SOYAD}}</p>
<p><b>Olayın Tarifi:</b></p>
<p>{{ICERIK}}</p>
<p>Yukarıda belirtilen olay, tarafımızca yerinde tespit edilerek iş bu tutanak tanzim edilmiştir.</p>
<p style="margin-top:40px;">Tutanak Tanzim Eden Görevliler:<br><br>1) ......................... &nbsp;&nbsp; 2) ......................... &nbsp;&nbsp; 3) .........................</p>`},

  {id:'t6', cat:'Tutanak', title:'Eşya Teslim / Emanet Tutanağı', desc:'Hükümlü/tutuklu eşyasının emanete alınması veya iadesi.',
   body:`<h2 style="text-align:center">EŞYA TESLİM TUTANAĞI</h2>
<p><b>Kurum:</b> {{KURUM}}<br><b>Tarih:</b> {{TARIH}}<br><b>İlgili Kişi:</b> {{AD_SOYAD}}</p>
<p><b>Teslim Alınan/Edilen Eşyalar:</b></p>
<p>{{ICERIK}}</p>
<p style="margin-top:40px;">Teslim Eden: ......................... &nbsp;&nbsp; Teslim Alan: .........................</p>`},

  {id:'t7', cat:'Karar', title:'Disiplin Kurulu Kararı', desc:'Disiplin soruşturması sonucunda verilen gerekçeli karar.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>DİSİPLİN KURULU KARARI</h2>
<p><b>Karar Tarihi:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p><b>Konu:</b> {{KONU}}</p>
<p><b>İnceleme ve Gerekçe:</b></p>
<p>{{ICERIK}}</p>
<p><b>KARAR:</b> Yukarıda açıklanan gerekçelerle ilgili hakkında mevzuata uygun disiplin işleminin uygulanmasına, kararın ilgiliye tebliğine oy birliği/çokluğu ile karar verildi.</p>
<p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},

  {id:'t8', cat:'Karar', title:'İdare ve Gözlem Kurulu Kararı (Açık Kuruma Ayırma)', desc:'İyi halli hükümlünün açık kuruma ayrılmasına ilişkin karar.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>İDARE VE GÖZLEM KURULU KARARI</h2>
<p><b>Karar Tarihi:</b> {{TARIH}}<br><b>Hakkında Karar Verilen:</b> {{AD_SOYAD}}</p>
<p><b>Değerlendirme:</b></p>
<p>{{ICERIK}}</p>
<p><b>KARAR:</b> İlgilinin açık ceza infaz kurumuna ayrılmasına/ayrılmamasına, ilgili mevzuat hükümleri uyarınca karar verildi.</p>
<p style="margin-top:40px;">Kurul Üyeleri:<br><br>Başkan: ......................... &nbsp;&nbsp; Üye: ......................... &nbsp;&nbsp; Üye: .........................</p>`},

  {id:'t9', cat:'Rapor', title:'Yükümlü Gelişim / Uyum Raporu', desc:'Denetimli serbestlik yükümlüsünün süreç değerlendirme raporu.',
   body:`<h2 style="text-align:center">YÜKÜMLÜ DEĞERLENDİRME RAPORU</h2>
<p><b>Kurum:</b> {{KURUM}}<br><b>Tarih:</b> {{TARIH}}<br><b>Yükümlü:</b> {{AD_SOYAD}}</p>
<p><b>Değerlendirme:</b></p>
<p>{{ICERIK}}</p>
<p><b>Sonuç ve Öneri:</b> Yükümlünün sürece uyumu yukarıda belirtildiği şekilde değerlendirilmiş olup gerekli işlemlerin buna göre yürütülmesi arz olunur.</p>
<p style="text-align:right; margin-top:20px;">Raporu Hazırlayan<br>{{AD_SOYAD_HAZIRLAYAN}}</p>`},

  {id:'t10', cat:'Rapor', title:'Aylık Faaliyet Raporu (Birim)', desc:'Kurum birimlerinin aylık özet faaliyet raporu.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>AYLIK FAALİYET RAPORU</h2>
<p><b>Dönem:</b> {{TARIH}}<br><b>Birim:</b> {{KONU}}</p>
<p><b>Faaliyet Özeti:</b></p>
<p>{{ICERIK}}</p>
<p style="text-align:right; margin-top:20px;">Hazırlayan<br>{{AD_SOYAD}}</p>`},

  {id:'t11', cat:'Dilekçe', title:'Nakil Talep Dilekçesi', desc:'Hükümlü/tutuklunun başka kuruma nakil talebi.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>MÜDÜRLÜĞÜNE</h2>
<p>Aşağıda belirtilen gerekçe ile başka bir ceza infaz kurumuna naklimin yapılmasını talep ederim.</p>
<p><b>Gerekçe:</b> {{ICERIK}}</p>
<p style="text-align:right">{{TARIH}}<br>{{AD_SOYAD}}<br>İmza</p>`},

  {id:'t12', cat:'Üst Yazı', title:'Aile/Yakınlara Bilgilendirme Yazısı', desc:'Nakil, sağlık veya diğer önemli gelişmelerin aileye bildirilmesi.',
   body:`<h2 style="text-align:center">{{KURUM}}</h2>
<p><b>Sayı:</b> ....../......<br><b>Konu:</b> {{KONU}}</p>
<p>Sayın İlgili,</p>
<p>{{ICERIK}}</p>
<p>Bilgilerinize arz ederim.</p>
<p style="text-align:right">{{TARIH}}<br>{{AD_SOYAD}}<br>Kurum Müdürü</p>`},

  {id:'t13', cat:'Tutanak', title:'Sağlık Muayenesi Tespit Tutanağı', desc:'Sağlık biriminde yapılan muayenenin kaydı.',
   body:`<h2 style="text-align:center">SAĞLIK MUAYENESİ TUTANAĞI</h2>
<p><b>Kurum:</b> {{KURUM}}<br><b>Tarih:</b> {{TARIH}}<br><b>Muayene Olan:</b> {{AD_SOYAD}}</p>
<p><b>Muayene Bulguları:</b></p>
<p>{{ICERIK}}</p>
<p style="margin-top:40px;">Sağlık Personeli: .........................</p>`},

  {id:'t14', cat:'Karar', title:'Denetimli Serbestlik İhlal Bildirim Kararı', desc:'Yükümlülük ihlalinin tespiti ve mahkemeye bildirim kararı.',
   body:`<h2 style="text-align:center">{{KURUM}}<br>İHLAL DEĞERLENDİRME KARARI</h2>
<p><b>Tarih:</b> {{TARIH}}<br><b>Yükümlü:</b> {{AD_SOYAD}}</p>
<p><b>İhlalin Tarifi:</b></p>
<p>{{ICERIK}}</p>
<p><b>KARAR:</b> Yükümlünün ilgili yükümlülüklerine aykırı davrandığı değerlendirilerek durumun ilgili mahkemeye/Cumhuriyet başsavcılığına bildirilmesine karar verildi.</p>
<p style="margin-top:40px;">Şube Müdürü: .........................</p>`},

  {id:'t15', cat:'Rapor', title:'Olay Sonrası Değerlendirme Raporu', desc:'Kurum içi olay sonrası genel değerlendirme ve öneriler.',
   body:`<h2 style="text-align:center">OLAY SONRASI DEĞERLENDİRME RAPORU</h2>
<p><b>Kurum:</b> {{KURUM}}<br><b>Tarih:</b> {{TARIH}}<br><b>İlgili Kişi:</b> {{AD_SOYAD}}</p>
<p><b>Olay ve Değerlendirme:</b></p>
<p>{{ICERIK}}</p>
<p><b>Öneriler:</b> Benzer olayların tekrarını önlemek amacıyla ilgili birimlerce gerekli tedbirlerin alınması önerilir.</p>
<p style="text-align:right; margin-top:20px;">Raporu Hazırlayan<br>{{AD_SOYAD}}</p>`},
];

const Templates = {
  activeCat:'',
  render(){
    const cats = ['Tümü', ...new Set(TEMPLATES.map(t=>t.cat))];
    const row = document.getElementById('tmplCategoryRow');
    row.innerHTML = cats.map(c=>`<span class="tag-pill ${(c==='Tümü' && !this.activeCat)||c===this.activeCat?'active':''}" onclick="Templates.filter('${c==='Tümü'?'':c}')">${c}</span>`).join('');
    const items = TEMPLATES.filter(t=>!this.activeCat || t.cat===this.activeCat);
    const grid = document.getElementById('tmplGrid');
    grid.innerHTML = items.map(t=>`
      <div class="card tmpl-card" onclick="Templates.use('${t.id}')">
        <div class="cat">${escapeHtml(t.cat)}</div>
        <h4>${escapeHtml(t.title)}</h4>
        <p>${escapeHtml(t.desc)}</p>
      </div>
    `).join('');
  },
  filter(cat){ this.activeCat = cat; this.render(); },
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
  {keys:['hakaret','itaatsizlik','disiplin','saygısızlık','kavga','şiddet'],
   docType:'Tutanak', templateId:'t5', karar:'Karar', kararTemplateId:'t7',
   ozet:'Olay, kurum disiplinini ilgilendiren bir davranış olarak değerlendirilmiştir. Önce olay tutanağa bağlanmalı, ardından savunma alınarak disiplin kurulu kararı oluşturulmalıdır.'},
  {keys:['sağlık','hastalık','ağrı','muayene','revir','hastane'],
   docType:'Dilekçe', templateId:'t2', karar:'Tutanak', kararTemplateId:'t13',
   ozet:'Sağlık ile ilgili bir talep/tespit söz konusudur. Sevk talebi dilekçe ile başlatılabilir; muayene sonrası tutanakla kayıt altına alınmalıdır.'},
  {keys:['ihlal','uymadı','yükümlülük','denetimli serbestlik','gelmedi','çağrı'],
   docType:'Karar', templateId:'t14', karar:'Üst Yazı', kararTemplateId:'t4',
   ozet:'Yükümlülük ihlaline dair bir durum tespit edilmiştir. İhlal değerlendirme kararı hazırlanmalı, ardından ilgili makama bildirim yazısı gönderilmelidir.'},
  {keys:['nakil','kurum değişikliği','sevk edil','başka kurum'],
   docType:'Dilekçe', templateId:'t11', karar:'Üst Yazı', kararTemplateId:'t3',
   ozet:'Nakil talebi ile ilgilidir. İlgilinin dilekçesi alınmalı ve ilgili makama üst yazı ile bildirim yapılmalıdır.'},
  {keys:['ziyaret','görüşme','aile','eş','ek görüşme'],
   docType:'Dilekçe', templateId:'t1', karar:'', kararTemplateId:'',
   ozet:'Ziyaret/görüşme talebi ile ilgilidir. Standart ek görüşme dilekçesi kullanılabilir.'},
  {keys:['eşya','para','emanet','teslim'],
   docType:'Tutanak', templateId:'t6', karar:'', kararTemplateId:'',
   ozet:'Eşya/para teslimi veya emanet işlemi söz konusudur. Teslim tutanağı düzenlenmelidir.'},
  {keys:['açık kurum','iyi hal','ayrıl'],
   docType:'Karar', templateId:'t8', karar:'', kararTemplateId:'',
   ozet:'İyi hal ve açık kuruma ayrılma değerlendirmesi ile ilgilidir. İdare ve Gözlem Kurulu kararı düzenlenmelidir.'},
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
      <div class="chip-line">${matched ? `<span class="chip">${escapeHtml(matched.docType)}</span>${matched.karar ? '<span class="chip">+ '+escapeHtml(matched.karar)+'</span>' : ''}` : "<span class=\"chip\">Şablon Merkezi'nden manuel seçin</span>"}</div>
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
  render(){
    const q = (document.getElementById('docSearch').value||'').toLowerCase();
    const typeFilter = document.getElementById('docFilterType').value;
    const list = this.all().filter(d=>!d.archived).filter(d=>{
      const matchQ = !q || (d.title+' '+d.type+' '+(d.person||'')).toLowerCase().includes(q);
      const matchT = !typeFilter || d.type===typeFilter;
      return matchQ && matchT;
    }).sort((a,b)=> new Date(b.updatedAt) - new Date(a.updatedAt));
    const body = document.getElementById('docTableBody');
    document.getElementById('docEmpty').style.display = list.length? 'none':'block';
    body.innerHTML = list.map(d=>`
      <tr>
        <td><b>${escapeHtml(d.title)}</b></td>
        <td><span class="badge type">${escapeHtml(d.type)}</span></td>
        <td>${escapeHtml(d.person||'—')}</td>
        <td>${fmtDate(d.updatedAt)}</td>
        <td><span class="badge status-${d.status==='Tamamlandı'?'tamam':'taslak'}">${escapeHtml(d.status||'Taslak')}</span></td>
        <td style="white-space:nowrap;">
          <button class="btn secondary small" onclick="Docs.edit('${d.id}')">Düzenle</button>
          <button class="btn secondary small" onclick="Docs.archive('${d.id}')">Arşivle</button>
          <button class="btn danger small" onclick="Docs.remove('${d.id}')">Sil</button>
        </td>
      </tr>
    `).join('');
  },
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
    if(d){ d.archived = true; d.archivedAt = nowIso(); this.saveAll(list); this.render(); toast('Belge arşivlendi.'); }
  },
  restore(id){
    const list = this.all();
    const d = list.find(x=>x.id===id);
    if(d){ d.archived = false; this.saveAll(list); this.renderArchive(); toast('Belge geri yüklendi.'); }
  },
  remove(id){
    if(!confirm('Bu belgeyi kalıcı olarak silmek istediğinize emin misiniz?')) return;
    const list = this.all().filter(x=>x.id!==id);
    this.saveAll(list); this.render(); this.renderArchive();
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
document.getElementById('docSearch').addEventListener('input', ()=>Docs.render());
document.getElementById('docFilterType').addEventListener('change', ()=>Docs.render());

/* =========================================================
   WORD STUDIO
   ========================================================= */
const WordStudio = {
  currentId:null,
  _initialized:false,
  init(){
    this._initialized = true;
    if(!document.getElementById('wordTitle').value){
      document.getElementById('wordEditor').innerHTML = '<p>Belge içeriğini buraya yazın veya bir şablon seçin.</p>';
    }
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
const ExcelStudio = {
  data: Store.get('excelGrid', null) || {rows:8, cols:6, cells:{}},
  persist(){ Store.set('excelGrid', this.data); },
  render(){
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
    if(!d){ box.innerHTML = "<div class=\"empty-state\">Önce Belge Yönetimi veya Word Studio'dan bir belge kaydedin.</div>"; return; }
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
    document.getElementById('setKurumAdi').value = s.kurumAdi || '';
    document.getElementById('setPersonelAdi').value = s.personelAdi || '';
    document.getElementById('setSicil').value = s.sicil || '';
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
    const s = {
      kurumAdi: document.getElementById('setKurumAdi').value.trim(),
      personelAdi: document.getElementById('setPersonelAdi').value.trim(),
      sicil: document.getElementById('setSicil').value.trim(),
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
    ['documents','reminders','settings','excelGrid','excelTitle'].forEach(k=>localStorage.removeItem('kalem_'+k));
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
Templates.render();
Mevzuat.render('');
Calendar.render();
ExcelStudio.render();
KalemAI.updateModeIndicator();
