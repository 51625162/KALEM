

/* ---------------- State & storage ---------------- */
const STORE_KEYS = { docs:'kalem_documents', rems:'kalem_reminders', settings:'kalem_settings', profile:'kalem_profile' };
let state = {
  docs: JSON.parse(localStorage.getItem(STORE_KEYS.docs) || '[]'),
  rems: JSON.parse(localStorage.getItem(STORE_KEYS.rems) || '[]'),
  settings: JSON.parse(localStorage.getItem(STORE_KEYS.settings) || '{"notifications":true,"lang":"tr"}'),
  profile: JSON.parse(localStorage.getItem(STORE_KEYS.profile) || '{"name":"Kullanıcı","email":"","role":""}')
};
let docFilter = { cat:'all', fav:false, q:'' };
let remFilter = 'active';
let calDate = new Date();

function persist(key){ localStorage.setItem(STORE_KEYS[key], JSON.stringify(state[key])); }
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
          <button class="icon-mini" onclick='openDocModal(${JSON.stringify(d).replace(/'/g,"&apos;")})'>✏️</button>
          <button class="icon-mini" onclick="deleteDoc('${d.id}')">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s??''; return d.innerHTML; }

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

/* ---------------- AI (local assistant, no external calls) ---------------- */
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
    soru: 'Bir sorum var: ',
    ozet: 'Şu belgeyi özetle: ',
    duzenle: 'Şu metni düzenle ve iyileştir: ',
    yaz: 'Şu konuda kısa bir yazı oluştur: ',
    analiz: 'Şu dosyayı analiz et: '
  };
  document.getElementById('chatInput').value = map[kind];
  document.getElementById('chatInput').focus();
}
function localAiReply(userText){
  // Basit, tamamen yerel (ücretsiz, sunucusuz) taslak yanıt üretici.
  const t = userText.toLowerCase();
  if(t.includes('özet')){
    return 'Taslak özet: Girdiğin metnin ana fikrini 2-3 cümlede özetlemeye çalıştım. Gerçek bir AI motoruna bağlanınca burası çok daha isabetli özetler üretecek. Şimdilik metni Belgeler bölümünde saklayıp etiketlemeni öneririm.';
  }
  if(t.includes('düzenle') || t.includes('iyileştir')){
    return 'Taslak düzenleme: Metnini daha kısa cümlelerle, aktif çatıyla yazmanı öneririm. Tekrar eden ifadeleri çıkarıp somut örnekler eklemek genelde metni güçlendirir.';
  }
  if(t.includes('yazı') || t.includes('oluştur')){
    return 'Taslak yazı: Konunu üç bölümde ele alabilirsin — giriş (neden önemli), gelişme (ana noktalar), sonuç (çıkarım/öneri). İstersen konuyu biraz daha açar mısın, taslağı genişleteyim.';
  }
  if(t.includes('analiz')){
    return 'Dosya analizi için önce dosyayı Belgeler bölümüne yükleyip kategorisini ve etiketlerini girmeni öneririm; böylece ileride gerçek bir AI motoru bağlandığında otomatik analiz edilebilir.';
  }
  return 'Not aldım. KALEM V1\'de bu bölüm yerel bir taslak asistanı olarak çalışıyor — dış sunucuya bağlı değil. Ayarlar\'dan kendi AI servisini bağlarsan burada gerçek yanıtlar alabilirsin.';
}
function sendChat(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  pushMsg('user', text);
  input.value = '';
  setTimeout(()=> pushMsg('ai', localAiReply(text)), 400);
}
document.getElementById('chatInput').addEventListener('keydown', e=>{
  if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendChat(); }
});

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
