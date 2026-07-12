/* ==========================================
   KALEM V3
   Script.js
========================================== */

"use strict";

/* -----------------------------
   Yardımcı Kısayollar
------------------------------ */

const $ = (id) => document.getElementById(id);

const $$ = (selector) => document.querySelectorAll(selector);

/* -----------------------------
   LocalStorage
------------------------------ */

const STORAGE = {

    documents: "kalem_documents",

    tasks: "kalem_tasks",

    notes: "kalem_notes",

    calendar: "kalem_calendar",

    contacts: "kalem_contacts",

    theme: "kalem_theme"

};

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

/* -----------------------------
   Sayfa Açılışı
------------------------------ */

window.addEventListener("load", () => {

    setTimeout(() => {

        $("loadingScreen").style.display = "none";

        $("app").classList.remove("hidden");

        loadTheme();

        updateDashboard();

        renderDocuments();

        renderTasks();

        renderNotes();

        renderCalendar();

        renderContacts();

    }, 700);

});

/* -----------------------------
   Dashboard
------------------------------ */

function updateDashboard() {

    $("docCount").textContent = documents.length;

    $("taskCount").textContent = tasks.length;

    $("noteCount").textContent = notes.length;

    $("calendarCount").textContent = calendars.length;

}

/* -----------------------------
   Sayfa Geçişleri
------------------------------ */

$$(".sidebar li").forEach(item => {

    item.addEventListener("click", () => {

        $$(".sidebar li").forEach(i => {
            i.classList.remove("active");
        });

        item.classList.add("active");

        const page = item.dataset.page;

        $$(".page").forEach(p => {
            p.classList.remove("active");
        });

        const target = document.getElementById(page);

        if(target){
            target.classList.add("active");
        }

        if(window.innerWidth <= 900){
            $("sidebar").classList.remove("show");
        }

    });

});

/* -----------------------------
   Mobil Menü
------------------------------ */

$("menuBtn").addEventListener("click", () => {

    $("sidebar").classList.toggle("show");

});

/* -----------------------------
   Tema
------------------------------ */

function loadTheme(){

    const theme = localStorage.getItem(STORAGE.theme);

    if(theme === "dark"){

        document.body.classList.add("dark");

    }

}

$("themeBtn").addEventListener("click", toggleTheme);

$("changeThemeBtn").addEventListener("click", toggleTheme);

function toggleTheme(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem(STORAGE.theme,"dark");

    }else{

        localStorage.setItem(STORAGE.theme,"light");

    }

}

/* -----------------------------
   Evrak Kaydet
------------------------------ */

$("saveDocumentBtn").addEventListener("click", () => {

    const name =
    $("documentName").value.trim();

    if(name===""){

        alert("Evrak adı giriniz.");

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

    localStorage.setItem(
        STORAGE.documents,
        JSON.stringify(documents)
    );

    renderDocuments();

    updateDashboard();

    $("documentName").value="";
    $("documentDescription").value="";

});

/* -----------------------------
   Evrak Listesi
------------------------------ */

function renderDocuments(){

    const tbody = $("documentTable");

    tbody.innerHTML = "";

    documents.forEach((doc,index)=>{

        tbody.innerHTML += `
        <tr>

            <td>${index+1}</td>

            <td>${doc.name}</td>

            <td>${doc.category}</td>

            <td>${doc.date}</td>

            <td>

                <button onclick="deleteDocument(${doc.id})">
                Sil
                </button>

            </td>

        </tr>
        `;

    });

}

function deleteDocument(id){

    if(!confirm("Bu evrak silinsin mi?")) return;

    documents =
    documents.filter(x=>x.id!==id);

    localStorage.setItem(
        STORAGE.documents,
        JSON.stringify(documents)
    );

    renderDocuments();

    updateDashboard();

}

/* -----------------------------
   Görevler
------------------------------ */

$("addTaskBtn").addEventListener("click",()=>{

    const value =
    $("taskInput").value.trim();

    if(value==="") return;

    tasks.unshift({

        id:Date.now(),

        text:value,

        done:false

    });

    localStorage.setItem(
        STORAGE.tasks,
        JSON.stringify(tasks)
    );

    $("taskInput").value="";

    renderTasks();

    updateDashboard();

});

function renderTasks(){

    const list =
    $("taskList");

    list.innerHTML="";

    tasks.forEach(task=>{

        list.innerHTML += `
        <li class="listItem">

            <label>

            <input
            type="checkbox"
            ${task.done ? "checked":""}
            onchange="toggleTask(${task.id})">

            ${task.text}

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

    tasks = tasks.map(task=>{

        if(task.id===id){

            task.done=!task.done;

        }

        return task;

    });

    localStorage.setItem(
        STORAGE.tasks,
        JSON.stringify(tasks)
    );

}

function deleteTask(id){

    tasks =
    tasks.filter(task=>task.id!==id);

    localStorage.setItem(
        STORAGE.tasks,
        JSON.stringify(tasks)
    );

    renderTasks();

    updateDashboard();

}

/* -----------------------------
   Notlar
------------------------------ */

$("saveNoteBtn").addEventListener("click", () => {

    const text = $("noteInput").value.trim();

    if (text === "") return;

    notes.unshift({
        id: Date.now(),
        text,
        date: new Date().toLocaleString("tr-TR")
    });

    localStorage.setItem(
        STORAGE.notes,
        JSON.stringify(notes)
    );

    $("noteInput").value = "";

    renderNotes();

    updateDashboard();

});

$("clearNoteBtn").addEventListener("click", () => {
    $("noteInput").value = "";
});

function renderNotes() {

    const list = $("noteList");

    list.innerHTML = "";

    notes.forEach(note => {

        list.innerHTML += `
        <div class="listItem">

            <strong>${note.date}</strong>

            <p>${note.text}</p>

            <button onclick="deleteNote(${note.id})">
                Sil
            </button>

        </div>
        `;

    });

}

function deleteNote(id) {

    notes = notes.filter(n => n.id !== id);

    localStorage.setItem(
        STORAGE.notes,
        JSON.stringify(notes)
    );

    renderNotes();

    updateDashboard();

}

/* -----------------------------
   Takvim
------------------------------ */

$("saveCalendarBtn").addEventListener("click", () => {

    const date = $("calendarDate").value;

    const title = $("calendarTitle").value.trim();

    if (!date || title === "") return;

    calendars.unshift({

        id: Date.now(),

        date,

        title

    });

    localStorage.setItem(
        STORAGE.calendar,
        JSON.stringify(calendars)
    );

    $("calendarDate").value = "";

    $("calendarTitle").value = "";

    renderCalendar();

    updateDashboard();

});

function renderCalendar() {

    const list = $("calendarList");

    list.innerHTML = "";

    calendars.forEach(item => {

        list.innerHTML += `
        <div class="listItem">

            <strong>${item.date}</strong>

            <p>${item.title}</p>

            <button onclick="deleteCalendar(${item.id})">
                Sil
            </button>

        </div>
        `;

    });

}

function deleteCalendar(id) {

    calendars =
    calendars.filter(c => c.id !== id);

    localStorage.setItem(
        STORAGE.calendar,
        JSON.stringify(calendars)
    );

    renderCalendar();

    updateDashboard();

}

/* -----------------------------
   Kişiler
------------------------------ */

$("saveContactBtn").addEventListener("click", () => {

    const name = $("contactName").value.trim();
    const phone = $("contactPhone").value.trim();
    const mail = $("contactMail").value.trim();

    if (name === "") return;

    contacts.unshift({
        id: Date.now(),
        name,
        phone,
        mail
    });

    localStorage.setItem(
        STORAGE.contacts,
        JSON.stringify(contacts)
    );

    $("contactName").value = "";
    $("contactPhone").value = "";
    $("contactMail").value = "";

    renderContacts();

});

function renderContacts() {

    const list = $("contactList");

    list.innerHTML = "";

    contacts.forEach(contact => {

        list.innerHTML += `
        <div class="listItem">

            <h3>${contact.name}</h3>

            <p>📞 ${contact.phone || "-"}</p>

            <p>✉️ ${contact.mail || "-"}</p>

            <button onclick="deleteContact(${contact.id})">
            Sil
            </button>

        </div>
        `;

    });

}

function deleteContact(id){

    contacts =
    contacts.filter(c=>c.id!==id);

    localStorage.setItem(
        STORAGE.contacts,
        JSON.stringify(contacts)
    );

    renderContacts();

}

/* -----------------------------
   JSON Yedekleme
------------------------------ */

$("exportDataBtn").addEventListener("click",()=>{

    const data={

        documents,
        tasks,
        notes,
        calendars,
        contacts

    };

    const blob=new Blob(
        [JSON.stringify(data,null,2)],
        {type:"application/json"}
    );

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download="KALEM_YEDEK.json";

    link.click();

});

/* -----------------------------
   JSON Geri Yükleme
------------------------------ */

$("importFile").addEventListener("change",(e)=>{

    const file=e.target.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=event=>{

        try{

            const data=
            JSON.parse(event.target.result);

            documents=data.documents||[];
            tasks=data.tasks||[];
            notes=data.notes||[];
            calendars=data.calendars||[];
            contacts=data.contacts||[];

            localStorage.setItem(STORAGE.documents,JSON.stringify(documents));
            localStorage.setItem(STORAGE.tasks,JSON.stringify(tasks));
            localStorage.setItem(STORAGE.notes,JSON.stringify(notes));
            localStorage.setItem(STORAGE.calendar,JSON.stringify(calendars));
            localStorage.setItem(STORAGE.contacts,JSON.stringify(contacts));

            renderDocuments();
            renderTasks();
            renderNotes();
            renderCalendar();
            renderContacts();
            updateDashboard();

            alert("Yedek başarıyla yüklendi.");

        }catch{

            alert("Geçersiz yedek dosyası.");

        }

    };

    reader.readAsText(file);

});

/* -----------------------------
   Tüm Verileri Sil
------------------------------ */

$("deleteAllBtn").addEventListener("click",()=>{

    if(!confirm("Tüm kayıtlar silinsin mi?")) return;

    Object.values(STORAGE).forEach(key=>{

        localStorage.removeItem(key);

    });

    location.reload();

});

console.log("KALEM V3 başarıyla başlatıldı.");

