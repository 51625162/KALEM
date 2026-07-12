/* ==========================================
   KALEM V4
   Script.js
========================================== */

"use strict";

/* ==========================
Yardımcı Fonksiyonlar
========================== */

const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

/* ==========================
LocalStorage Anahtarları
========================== */

const STORAGE = {

documents: "kalem_documents",

tasks: "kalem_tasks",

notes: "kalem_notes",

calendar: "kalem_calendar",

contacts: "kalem_contacts",

theme: "kalem_theme"

};

/* ==========================
Veriler
========================== */

let documents =
JSON.parse(localStorage.getItem(STORAGE.documents)) || [];

let tasks =
JSON.parse(localStorage.getItem(STORAGE.tasks)) || [];

let notes =
JSON.parse(localStorage.getItem(STORAGE.notes)) || [];

let calendars =
JSON.parse(localStorage.getItem(STORAGE.calendar)) || [];

let contacts =
JSON.parse(localStorage.getItem(STORAGE.contacts)) || [];

/* ==========================
Sayfa Açılışı
========================== */

window.addEventListener("load", init);

function init(){

setTimeout(()=>{

const loading=$("loadingScreen");
const app=$("app");

if(loading){
loading.style.display="none";
}

if(app){
app.classList.remove("hidden");
}

loadTheme();

updateDashboard();

renderDocuments();

renderTasks();

renderNotes();

renderCalendar();

renderContacts();

initMenu();

initButtons();

},600);

}

/* ==========================
Dashboard
========================== */

function updateDashboard(){

if($("docCount"))
$("docCount").textContent=documents.length;

if($("taskCount"))
$("taskCount").textContent=tasks.length;

if($("noteCount"))
$("noteCount").textContent=notes.length;

if($("calendarCount"))
$("calendarCount").textContent=calendars.length;

}

/* ==========================
Menü Sistemi
========================== */

function initMenu(){

$$(".sidebar li").forEach(item=>{

item.addEventListener("click",()=>{

$$(".sidebar li").forEach(li=>{

li.classList.remove("active");

});

item.classList.add("active");

const page=item.dataset.page;

$$(".page").forEach(section=>{

section.classList.remove("active");

});

const target=$(page);

if(target){

target.classList.add("active");

}

const sidebar=$("sidebar");

if(sidebar && window.innerWidth<=900){

sidebar.classList.remove("show");

}

});

});

}

/* ==========================
Butonlar
========================== */

function initButtons(){

const menuBtn=$("menuBtn");

if(menuBtn){

menuBtn.addEventListener("click",()=>{

const sidebar=$("sidebar");

if(sidebar){

sidebar.classList.toggle("show");

}

});

}

const themeBtn=$("themeBtn");

if(themeBtn){

themeBtn.addEventListener(

"click",

toggleTheme

);

}

const changeThemeBtn=$("changeThemeBtn");

if(changeThemeBtn){

changeThemeBtn.addEventListener(

"click",

toggleTheme

);

}

}

/* ==========================
Tema Sistemi
========================== */

function loadTheme(){

const theme=

localStorage.getItem(STORAGE.theme);

if(theme==="dark"){

document.body.classList.add("dark");

}

}

function toggleTheme(){

document.body.classList.toggle("dark");

localStorage.setItem(

STORAGE.theme,

document.body.classList.contains("dark")

? "dark"

: "light"

);

}

/* ==========================
Evrak Sistemi
========================== */

const saveDocumentBtn = $("saveDocumentBtn");

if(saveDocumentBtn){

saveDocumentBtn.addEventListener(

"click",

saveDocument

);

}

const clearDocumentBtn = $("clearDocumentBtn");

if(clearDocumentBtn){

clearDocumentBtn.addEventListener("click",()=>{

const name=$("documentName");
const desc=$("documentDescription");

if(name) name.value="";
if(desc) desc.value="";

});

}

function saveDocument(){

const inputName=$("documentName");

if(!inputName) return;

const name=inputName.value.trim();

if(name===""){

alert("Evrak adı giriniz.");

return;

}

const item={

id:Date.now(),

name:name,

category:$("documentCategory")?.value || "Genel",

description:$("documentDescription")?.value || "",

date:new Date().toLocaleDateString("tr-TR")

};

documents.unshift(item);

saveDocuments();

renderDocuments();

updateDashboard();

inputName.value="";

if($("documentDescription")){

$("documentDescription").value="";

}

}

function saveDocuments(){

localStorage.setItem(

STORAGE.documents,

JSON.stringify(documents)

);

}

function renderDocuments(){

const table=$("documentTable");

if(!table) return;

table.innerHTML="";

documents.forEach((doc,index)=>{

table.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${doc.name}</td>

<td>${doc.category}</td>

<td>${doc.date}</td>

<td>

<button
onclick="deleteDocument(${doc.id})">

Sil

</button>

</td>

</tr>

`;

});

}

function deleteDocument(id){

if(!confirm("Bu evrak silinsin mi?")){

return;

}

documents=

documents.filter(

doc=>doc.id!==id

);

saveDocuments();

renderDocuments();

updateDashboard();

}

/* ==========================
Görev Sistemi
========================== */

const addTaskBtn = $("addTaskBtn");

if(addTaskBtn){

addTaskBtn.addEventListener(

"click",

addTask

);

}

function addTask(){

const input=$("taskInput");

if(!input) return;

const text=input.value.trim();

if(text===""){

alert("Görev giriniz.");

return;

}

tasks.unshift({

id:Date.now(),

text:text,

done:false,

date:new Date().toLocaleDateString("tr-TR")

});

saveTasks();

renderTasks();

updateDashboard();

input.value="";

}

function saveTasks(){

localStorage.setItem(

STORAGE.tasks,

JSON.stringify(tasks)

);

}

function renderTasks(){

const list=$("taskList");

if(!list) return;

list.innerHTML="";

tasks.forEach(task=>{

list.innerHTML+=`

<li class="listItem">

<label>

<input

type="checkbox"

${task.done ? "checked" : ""}

onchange="toggleTask(${task.id})">

<span>

${task.text}

</span>

</label>

<button

onclick="deleteTask(${task.id})">

Sil

</button>

</li>

`;

});

}

function toggleTask(id){

tasks=tasks.map(task=>{

if(task.id===id){

task.done=!task.done;

}

return task;

});

saveTasks();

renderTasks();

}

function deleteTask(id){

if(!confirm("Görev silinsin mi?")){

return;

}

tasks=tasks.filter(

task=>task.id!==id

);

saveTasks();

renderTasks();

updateDashboard();

}

/* ==========================
Not Sistemi
========================== */

const saveNoteBtn = $("saveNoteBtn");
const clearNoteBtn = $("clearNoteBtn");

if(saveNoteBtn){

saveNoteBtn.addEventListener("click",saveNote);

}

if(clearNoteBtn){

clearNoteBtn.addEventListener("click",()=>{

const note=$("noteInput");

if(note){

note.value="";

}

});

}

function saveNote(){

const input=$("noteInput");

if(!input) return;

const text=input.value.trim();

if(text===""){

alert("Not giriniz.");

return;

}

notes.unshift({

id:Date.now(),

text:text,

date:new Date().toLocaleString("tr-TR")

});

saveNotes();

renderNotes();

updateDashboard();

input.value="";

}

function saveNotes(){

localStorage.setItem(

STORAGE.notes,

JSON.stringify(notes)

);

}

function renderNotes(){

const list=$("noteList");

if(!list) return;

list.innerHTML="";

notes.forEach(note=>{

list.innerHTML+=`

<div class="listItem">

<div>

<strong>${note.date}</strong>

<p>${note.text}</p>

</div>

<button onclick="deleteNote(${note.id})">

Sil

</button>

</div>

`;

});

}

function deleteNote(id){

if(!confirm("Not silinsin mi?")){

return;

}

notes=notes.filter(

note=>note.id!==id

);

saveNotes();

renderNotes();

updateDashboard();

}

/* ==========================
Takvim Sistemi
========================== */

const saveCalendarBtn=$("saveCalendarBtn");

if(saveCalendarBtn){

saveCalendarBtn.addEventListener(

"click",

saveCalendar

);

}

function saveCalendar(){

const date=$("calendarDate");

const title=$("calendarTitle");

if(!date || !title) return;

if(date.value==="" || title.value.trim()===""){

alert("Tarih ve başlık giriniz.");

return;

}

calendars.unshift({

id:Date.now(),

date:date.value,

title:title.value.trim()

});

saveCalendars();

renderCalendar();

updateDashboard();

date.value="";

title.value="";

}

function saveCalendars(){

localStorage.setItem(

STORAGE.calendar,

JSON.stringify(calendars)

);

}

function renderCalendar(){

const list=$("calendarList");

if(!list) return;

list.innerHTML="";

calendars.forEach(item=>{

list.innerHTML+=`

<div class="listItem">

<div>

<strong>${item.date}</strong>

<p>${item.title}</p>

</div>

<button onclick="deleteCalendar(${item.id})">

Sil

</button>

</div>

`;

});

}

function deleteCalendar(id){

if(!confirm("Etkinlik silinsin mi?")){

return;

}

calendars=

calendars.filter(

item=>item.id!==id

);

saveCalendars();

renderCalendar();

updateDashboard();

}

/* ==========================
Kişiler
========================== */

const saveContactBtn = $("saveContactBtn");

if(saveContactBtn){

saveContactBtn.addEventListener(

"click",

saveContact

);

}

function saveContact(){

const name=$("contactName");
const phone=$("contactPhone");
const mail=$("contactMail");

if(!name) return;

if(name.value.trim()===""){

alert("Ad Soyad giriniz.");

return;

}

contacts.unshift({

id:Date.now(),

name:name.value.trim(),

phone:phone ? phone.value.trim() : "",

mail:mail ? mail.value.trim() : ""

});

saveContacts();

renderContacts();

name.value="";

if(phone) phone.value="";

if(mail) mail.value="";

}

function saveContacts(){

localStorage.setItem(

STORAGE.contacts,

JSON.stringify(contacts)

);

}

function renderContacts(){

const list=$("contactList");

if(!list) return;

list.innerHTML="";

contacts.forEach(person=>{

list.innerHTML+=`

<div class="listItem">

<div>

<h3>${person.name}</h3>

<p>📞 ${person.phone || "-"}</p>

<p>✉️ ${person.mail || "-"}</p>

</div>

<button onclick="deleteContact(${person.id})">

Sil

</button>

</div>

`;

});

}

function deleteContact(id){

if(!confirm("Kişi silinsin mi?")){

return;

}

contacts=

contacts.filter(

person=>person.id!==id

);

saveContacts();

renderContacts();

}

/* ==========================
JSON Yedekleme
========================== */

const exportBtn=$("exportDataBtn");

if(exportBtn){

exportBtn.addEventListener(

"click",

exportData

);

}

function exportData(){

const data={

documents,

tasks,

notes,

calendars,

contacts

};

const blob=new Blob(

[JSON.stringify(data,null,2)],

{

type:"application/json"

}

);

const url=

URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="KALEM_YEDEK.json";

a.click();

URL.revokeObjectURL(url);

}

/* ==========================
JSON Geri Yükleme
========================== */

const importFile=$("importFile");

if(importFile){

importFile.addEventListener(

"change",

importData

);

}

function importData(e){

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(event){

try{

const data=

JSON.parse(event.target.result);

documents=data.documents || [];

tasks=data.tasks || [];

notes=data.notes || [];

calendars=data.calendars || [];

contacts=data.contacts || [];

saveDocuments();

saveTasks();

saveNotes();

saveCalendars();

saveContacts();

renderDocuments();

renderTasks();

renderNotes();

renderCalendar();

renderContacts();

updateDashboard();

alert("Yedek başarıyla yüklendi.");

}catch{

alert("Geçersiz JSON dosyası.");

}

};

reader.readAsText(file);

}

/* ==========================
Tüm Verileri Sil
========================== */

const deleteAllBtn = $("deleteAllBtn");

if(deleteAllBtn){

deleteAllBtn.addEventListener(

"click",

deleteAllData

);

}

function deleteAllData(){

if(!confirm("Tüm veriler silinsin mi?")){

return;

}

Object.values(STORAGE).forEach(key=>{

localStorage.removeItem(key);

});

documents=[];
tasks=[];
notes=[];
calendars=[];
contacts=[];

renderDocuments();
renderTasks();
renderNotes();
renderCalendar();
renderContacts();

updateDashboard();

alert("Tüm veriler silindi.");

}

/* ==========================
Evrak Arama
========================== */

(function(){

const page=$("documents");

const table=$("documentTable");

if(!page || !table) return;

const search=document.createElement("input");

search.type="text";

search.className="searchInput";

search.placeholder="🔍 Evrak Ara...";

page.insertBefore(search,page.firstChild);

search.addEventListener("input",()=>{

const value=search.value.toLowerCase();

table.querySelectorAll("tr").forEach(row=>{

row.style.display=row.innerText
.toLowerCase()
.includes(value)

? ""

: "none";

});

});

})();

/* ==========================
Pencere Boyutu
========================== */

window.addEventListener("resize",()=>{

if(window.innerWidth>900){

const sidebar=$("sidebar");

if(sidebar){

sidebar.classList.remove("show");

}

}

});

/* ==========================
Genel Yardımcılar
========================== */

function refreshAll(){

updateDashboard();

renderDocuments();

renderTasks();

renderNotes();

renderCalendar();

renderContacts();

}

/* ==========================
Sayfa Görünür Olunca
========================== */

document.addEventListener("visibilitychange",()=>{

if(!document.hidden){

refreshAll();

}

});

/* ==========================
Storage Senkronizasyonu
========================== */

window.addEventListener("storage",(e)=>{

if(!e.key) return;

if(e.key===STORAGE.documents){

documents=JSON.parse(localStorage.getItem(STORAGE.documents))||[];

}

if(e.key===STORAGE.tasks){

tasks=JSON.parse(localStorage.getItem(STORAGE.tasks))||[];

}

if(e.key===STORAGE.notes){

notes=JSON.parse(localStorage.getItem(STORAGE.notes))||[];

}

if(e.key===STORAGE.calendar){

calendars=JSON.parse(localStorage.getItem(STORAGE.calendar))||[];

}

if(e.key===STORAGE.contacts){

contacts=JSON.parse(localStorage.getItem(STORAGE.contacts))||[];

}

refreshAll();

});

/* ==========================
Başlatıldı
========================== */

console.log("KALEM V4 başarıyla başlatıldı.");

/* ==========================
KALEM AI Dosya
========================== */

const aiFile = $("aiFile");

if (aiFile) {

    aiFile.addEventListener("change", function (e) {

        const file = e.target.files[0];

        if (!file) return;

        $("aiAnswer").innerHTML = `
            <h3>📄 Dosya Hazır</h3>
            <p><b>Dosya:</b> ${file.name}</p>
            <p><b>Boyut:</b> ${(file.size / 1024).toFixed(2)} KB</p>
            <p>✅ Dosya başarıyla seçildi.</p>
        `;

    });

}

/* ==========================
KALEM AI Demo
========================== */

const askAiBtn = $("askAiBtn");

if (askAiBtn) {

    askAiBtn.addEventListener("click", () => {

        const prompt = $("aiPrompt").value.trim();

        if (prompt === "") {
            alert("Lütfen bir soru yazın.");
            return;
        }

        $("aiAnswer").innerHTML = `
            <h3>🤖 KALEM AI</h3>
            <p><b>Sorunuz:</b> ${prompt}</p>
            <hr>
            <p>Bu sürüm şu anda demo modunda çalışıyor.</p>
            <p>Bir sonraki adımda gerçek OpenAI yapay zekâsına bağlanacaktır.</p>
        `;

    });

}
