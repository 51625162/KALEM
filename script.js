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
Local Storage Anahtarları
========================== */

const STORAGE = {

documents : "kalem_documents",

tasks : "kalem_tasks",

notes : "kalem_notes",

calendar : "kalem_calendar",

contacts : "kalem_contacts",

theme : "kalem_theme"

};

/* ==========================
Veriler
========================== */

let documents =
JSON.parse(
localStorage.getItem(STORAGE.documents)
) || [];

let tasks =
JSON.parse(
localStorage.getItem(STORAGE.tasks)
) || [];

let notes =
JSON.parse(
localStorage.getItem(STORAGE.notes)
) || [];

let calendars =
JSON.parse(
localStorage.getItem(STORAGE.calendar)
) || [];

let contacts =
JSON.parse(
localStorage.getItem(STORAGE.contacts)
) || [];

/* ==========================
Sayfa Açılışı
========================== */

window.addEventListener("load",()=>{

setTimeout(()=>{

$("loadingScreen").style.display="none";

$("app").classList.remove("hidden");

loadTheme();

updateDashboard();

renderDocuments();

renderTasks();

renderNotes();

renderCalendar();

renderContacts();

},700);

});

/* ==========================
Dashboard
========================== */

function updateDashboard(){

$("docCount").textContent =
documents.length;

$("taskCount").textContent =
tasks.length;

$("noteCount").textContent =
notes.length;

$("calendarCount").textContent =
calendars.length;

}

/* ==========================
Menü Geçişleri
========================== */

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

const target=document.getElementById(page);

if(target){

target.classList.add("active");

}

if(window.innerWidth<=900){

$("sidebar").classList.remove("show");

}

});

});

/* ==========================
Mobil Menü
========================== */

$("menuBtn").addEventListener("click",()=>{

$("sidebar").classList.toggle("show");

});

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

if(document.body.classList.contains("dark")){

localStorage.setItem(
STORAGE.theme,
"dark"
);

}else{

localStorage.setItem(
STORAGE.theme,
"light"
);

}

}

$("themeBtn").addEventListener(

"click",

toggleTheme

);

/* ==========================
Yardımcı Fonksiyon
========================== */

function clearInputs(){

document.querySelectorAll(

"input[type=text], textarea"

).forEach(input=>{

input.value="";

});

}

/* ==========================
Evrak Kaydet
========================== */

$("saveDocumentBtn").addEventListener("click",saveDocument);

function saveDocument(){

const name=
$("documentName").value.trim();

if(name===""){

alert("Evrak adı boş olamaz.");

return;

}

const item={

id:Date.now(),

name:name,

category:$("documentCategory").value,

description:$("documentDescription").value,

date:new Date().toLocaleDateString("tr-TR")

};

documents.unshift(item);

saveDocuments();

renderDocuments();

updateDashboard();

$("documentName").value="";

$("documentDescription").value="";

}

/* ==========================
LocalStorage Kaydet
========================== */

function saveDocuments(){

localStorage.setItem(

STORAGE.documents,

JSON.stringify(documents)

);

}

/* ==========================
Listele
========================== */

function renderDocuments(){

const tbody=

$("documentTable");

tbody.innerHTML="";

documents.forEach((doc,index)=>{

tbody.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${doc.name}</td>

<td>${doc.category}</td>

<td>${doc.date}</td>

<td>

<button
class="deleteBtn"
onclick="deleteDocument(${doc.id})">

Sil

</button>

</td>

</tr>

`;

});

}

/* ==========================
Sil
========================== */

function deleteDocument(id){

if(

!confirm(

"Evrak silinsin mi?"

)

){

return;

}

documents=

documents.filter(

item=>item.id!==id

);

saveDocuments();

renderDocuments();

updateDashboard();

}

/* ==========================
Temizle
========================== */

$("clearDocumentBtn").addEventListener(

"click",

()=>{

$("documentName").value="";

$("documentDescription").value="";

}

);

/* ==========================
Görev Sistemi
========================== */

$("addTaskBtn").addEventListener(

"click",

addTask

);

function addTask(){

const text=

$("taskInput").value.trim();

if(text===""){

alert("Görev yazınız.");

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

$("taskInput").value="";

}

/* ==========================
Görevleri Kaydet
========================== */

function saveTasks(){

localStorage.setItem(

STORAGE.tasks,

JSON.stringify(tasks)

);

}

/* ==========================
Görevleri Listele
========================== */

function renderTasks(){

const list=

$("taskList");

list.innerHTML="";

tasks.forEach(task=>{

list.innerHTML+=`

<li class="listItem">

<label>

<input

type="checkbox"

${task.done?"checked":""}

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

/* ==========================
Görev Tamamla
========================== */

function toggleTask(id){

tasks=

tasks.map(task=>{

if(task.id===id){

task.done=!task.done;

}

return task;

});

saveTasks();

}

/* ==========================
Görev Sil
========================== */

function deleteTask(id){

if(

!confirm(

"Görev silinsin mi?"

)

){

return;

}

tasks=

tasks.filter(

task=>task.id!==id

);

saveTasks();

renderTasks();

updateDashboard();

}

/* ==========================
Not Sistemi
========================== */

$("saveNoteBtn").addEventListener(

"click",

saveNote

);

$("clearNoteBtn").addEventListener(

"click",

()=>{

$("noteInput").value="";

}

);

function saveNote(){

const text=

$("noteInput").value.trim();

if(text===""){

alert("Not yazınız.");

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

$("noteInput").value="";

}

function saveNotes(){

localStorage.setItem(

STORAGE.notes,

JSON.stringify(notes)

);

}

function renderNotes(){

const list=

$("noteList");

list.innerHTML="";

notes.forEach(note=>{

list.innerHTML+=`

<div class="listItem">

<div>

<strong>${note.date}</strong>

<p>${note.text}</p>

</div>

<button

onclick="deleteNote(${note.id})">

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

notes=

notes.filter(

note=>note.id!==id

);

saveNotes();

renderNotes();

updateDashboard();

}

/* ==========================
Takvim Sistemi
========================== */

$("saveCalendarBtn").addEventListener(

"click",

saveCalendar

);

function saveCalendar(){

const date=

$("calendarDate").value;

const title=

$("calendarTitle").value.trim();

if(date===""||title===""){

alert("Tarih ve başlık giriniz.");

return;

}

calendars.unshift({

id:Date.now(),

date,

title

});

saveCalendars();

renderCalendar();

updateDashboard();

$("calendarDate").value="";

$("calendarTitle").value="";

}

function saveCalendars(){

localStorage.setItem(

STORAGE.calendar,

JSON.stringify(calendars)

);

}

function renderCalendar(){

const list=

$("calendarList");

list.innerHTML="";

calendars.forEach(item=>{

list.innerHTML+=`

<div class="listItem">

<div>

<strong>${item.date}</strong>

<p>${item.title}</p>

</div>

<button

onclick="deleteCalendar(${item.id})">

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

$("saveContactBtn").addEventListener(

"click",

saveContact

);

function saveContact(){

const name=

$("contactName").value.trim();

if(name===""){

alert("Ad Soyad giriniz.");

return;

}

contacts.unshift({

id:Date.now(),

name:name,

phone:$("contactPhone").value.trim(),

mail:$("contactMail").value.trim()

});

saveContacts();

renderContacts();

$("contactName").value="";

$("contactPhone").value="";

$("contactMail").value="";

}

function saveContacts(){

localStorage.setItem(

STORAGE.contacts,

JSON.stringify(contacts)

);

}

function renderContacts(){

const list=

$("contactList");

list.innerHTML="";

contacts.forEach(person=>{

list.innerHTML+=`

<div class="listItem">

<div>

<h3>${person.name}</h3>

<p>📞 ${person.phone||"-"}</p>

<p>✉️ ${person.mail||"-"}</p>

</div>

<button

onclick="deleteContact(${person.id})">

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

$("exportDataBtn").addEventListener(

"click",

exportData

);

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

const link=

document.createElement("a");

link.href=url;

link.download="KALEM_YEDEK.json";

link.click();

URL.revokeObjectURL(url);

}

/* ==========================
JSON Geri Yükleme
========================== */

$("importFile").addEventListener(

"change",

importData

);

function importData(event){

const file=

event.target.files[0];

if(!file){

return;

}

const reader=

new FileReader();

reader.onload=function(e){

try{

const data=

JSON.parse(e.target.result);

documents=

data.documents||[];

tasks=

data.tasks||[];

notes=

data.notes||[];

calendars=

data.calendars||[];

contacts=

data.contacts||[];

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

alert(

"Yedek başarıyla yüklendi."

);

}catch{

alert(

"Geçersiz yedek dosyası."

);

}

};

reader.readAsText(file);

}

/* ==========================
Tema Sistemi
========================== */

$("changeThemeBtn").addEventListener("click",toggleTheme);

function loadTheme(){

const theme=localStorage.getItem(STORAGE.theme);

if(theme==="dark"){

document.body.classList.add("dark");

}

}

function toggleTheme(){

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

localStorage.setItem(STORAGE.theme,"dark");

}else{

localStorage.setItem(STORAGE.theme,"light");

}

}

/* ==========================
Tüm Verileri Sil
========================== */

$("deleteAllBtn").addEventListener("click",deleteAllData);

function deleteAllData(){

if(!confirm("Tüm kayıtlar silinsin mi?")){

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

const documentPage=document.getElementById("documents");

if(documentPage){

const searchBox=document.createElement("input");

searchBox.type="text";

searchBox.placeholder="🔍 Evrak Ara";

searchBox.className="searchInput";

documentPage.prepend(searchBox);

searchBox.addEventListener("input",function(){

const value=this.value.toLowerCase();

document.querySelectorAll("#documentTable tr").forEach(row=>{

row.style.display=row.innerText.toLowerCase().includes(value)

? ""

: "none";

});

});

}

/* ==========================
Pencere Boyutu
========================== */

window.addEventListener("resize",()=>{

if(window.innerWidth>900){

$("sidebar").classList.remove("show");

}

});

/* ==========================
Tema Sistemi
========================== */

$("changeThemeBtn").addEventListener(

"click",

toggleTheme

);

function loadTheme(){

const theme=

localStorage.getItem(

STORAGE.theme

);

if(theme==="dark"){

document.body.classList.add(

"dark"

);

}

}

function toggleTheme(){

document.body.classList.toggle(

"dark"

);

if(

document.body.classList.contains(

"dark"

)

){

localStorage.setItem(

STORAGE.theme,

"dark"

);

}else{

localStorage.setItem(

STORAGE.theme,

"light"

);

}

}

/* ==========================
Tüm Verileri Sil
========================== */

$("deleteAllBtn").addEventListener(

"click",

deleteAllData

);

function deleteAllData(){

if(

!confirm(

"Tüm kayıtlar silinsin mi?"

)

){

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

alert(

"Tüm veriler silindi."

);

}

/* ==========================
Evrak Arama
========================== */

const searchBox=

document.createElement("input");

searchBox.placeholder="🔍 Evrak Ara";

searchBox.className="searchInput";

const documentPage=

document.getElementById("documents");

if(documentPage){

documentPage.prepend(searchBox);

}

searchBox.addEventListener(

"input",

function(){

const value=

this.value.toLowerCase();

document

.querySelectorAll(

"#documentTable tr"

)

.forEach(row=>{

row.style.display=

row.innerText

.toLowerCase()

.includes(value)

?

""

:

"none";

});

}

/* ==========================
Pencere Yeniden Boyutlanınca
========================== */

window.addEventListener(

"resize",

()=>{

if(

window.innerWidth>900

){

$("sidebar").classList.remove(

"show"

);

}

}
);




