/* =======================================
   KALEM V3
   Style.css
======================================= */

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

:root{

    --primary:#2563eb;
    --primary-dark:#1d4ed8;

    --success:#16a34a;
    --warning:#f59e0b;
    --danger:#dc2626;

    --background:#f3f6fb;
    --surface:#ffffff;

    --text:#1f2937;
    --text-light:#6b7280;

    --border:#dbe3ef;

    --radius:16px;

    --shadow:
    0 10px 25px rgba(0,0,0,.08);

    --transition:.25s;
}

body{

    background:var(--background);

    color:var(--text);

    font-family:
    Arial,
    Helvetica,
    sans-serif;

    min-height:100vh;
}

.hidden{
    display:none;
}

button{

    cursor:pointer;

    border:none;

    transition:var(--transition);
}

input,
textarea,
select{

    width:100%;

    padding:12px 14px;

    border:1px solid var(--border);

    border-radius:12px;

    font-size:15px;

    outline:none;

    transition:var(--transition);

    background:#fff;
}

input:focus,
textarea:focus,
select:focus{

    border-color:var(--primary);

    box-shadow:
    0 0 0 3px
    rgba(37,99,235,.15);
}

textarea{

    min-height:120px;

    resize:vertical;
}

/* ==========================
   Yükleniyor Ekranı
========================== */

#loadingScreen{
    position:fixed;
    inset:0;
    background:#ffffff;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    gap:18px;
    z-index:9999;
}

.loader{

    width:60px;
    height:60px;

    border:6px solid #e5e7eb;
    border-top:6px solid var(--primary);

    border-radius:50%;

    animation:spin 1s linear infinite;
}

@keyframes spin{

    from{
        transform:rotate(0deg);
    }

    to{
        transform:rotate(360deg);
    }

}

/* ==========================
   Üst Menü
========================== */

.topbar{

    height:70px;

    background:var(--surface);

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:0 22px;

    box-shadow:var(--shadow);

    position:sticky;

    top:0;

    z-index:100;
}

.logoArea{

    display:flex;

    align-items:center;

    gap:10px;
}

.logoArea h1{

    color:var(--primary);

    font-size:28px;
}

.logoArea span{

    background:var(--primary);

    color:#fff;

    padding:5px 10px;

    border-radius:999px;

    font-size:13px;

    font-weight:bold;
}

.topButtons{

    display:flex;

    gap:10px;
}

.topButtons button{

    width:42px;

    height:42px;

    border-radius:12px;

    background:var(--primary);

    color:#fff;

    font-size:18px;
}

.topButtons button:hover{

    background:var(--primary-dark);

    transform:translateY(-2px);
}

/* ==========================
   Ana Yerleşim
========================== */

#app{

    display:grid;

    grid-template-columns:260px 1fr;

    min-height:calc(100vh - 70px);
}

/* ==========================
   Sol Menü
========================== */

.sidebar{

    background:var(--surface);

    border-right:1px solid var(--border);

    padding:20px;

    overflow-y:auto;
}

.sidebarHeader{

    margin-bottom:20px;
}

.sidebarHeader h2{

    font-size:20px;

    color:var(--primary);
}

.sidebar ul{

    list-style:none;
}

.sidebar li{

    display:flex;

    align-items:center;

    gap:12px;

    padding:14px 16px;

    margin-bottom:8px;

    border-radius:12px;

    cursor:pointer;

    transition:var(--transition);

    font-weight:600;
}

.sidebar li:hover{

    background:#eef4ff;
}

.sidebar li.active{

    background:var(--primary);

    color:#fff;
}

/* ==========================
   İçerik
========================== */

.content{

    padding:24px;

    overflow:auto;
}

.page{

    display:none;
}

.page.active{

    display:block;
}

.pageTitle{

    margin-bottom:22px;
}

.pageTitle h2{

    font-size:28px;

    margin-bottom:6px;
}

.pageTitle p{

    color:var(--text-light);
}

/* ==========================
   Kartlar
========================== */

.cardGrid{

    display:grid;

    grid-template-columns:
    repeat(auto-fit,minmax(220px,1fr));

    gap:20px;
}

.card{

    background:var(--surface);

    border-radius:var(--radius);

    padding:24px;

    box-shadow:var(--shadow);

    transition:var(--transition);
}

.card:hover{

    transform:translateY(-4px);
}

.card h3{

    margin-bottom:12px;

    color:var(--text-light);
}

.card p{

    font-size:34px;

    font-weight:bold;

    color:var(--primary);
}

/* ==========================
   Formlar
========================== */

.formCard{

    background:var(--surface);

    padding:24px;

    border-radius:var(--radius);

    box-shadow:var(--shadow);

    margin-bottom:24px;
}

.inputGroup{

    margin-bottom:18px;
}

.inputGroup label{

    display:block;

    margin-bottom:8px;

    font-weight:600;
}

.buttonArea{

    display:flex;

    gap:12px;

    flex-wrap:wrap;

    margin-top:20px;
}

.buttonArea button,
.formCard button{

    background:var(--primary);

    color:#fff;

    padding:12px 20px;

    border-radius:12px;

    font-size:15px;

    font-weight:bold;
}

.buttonArea button:hover,
.formCard button:hover{

    background:var(--primary-dark);
}

/* ==========================
   Tablolar
========================== */

.tableCard{

    background:var(--surface);

    border-radius:var(--radius);

    box-shadow:var(--shadow);

    overflow:auto;
}

table{

    width:100%;

    border-collapse:collapse;
}

thead{

    background:var(--primary);

    color:#fff;
}

th,
td{

    padding:15px;

    text-align:left;

    border-bottom:1px solid var(--border);
}

tbody tr:hover{

    background:#f8fbff;
}

/* ==========================
   Listeler
========================== */

.listContainer,
.noteList{

    display:flex;

    flex-direction:column;

    gap:14px;
}

.listItem{

    background:var(--surface);

    border-radius:14px;

    padding:18px;

    box-shadow:var(--shadow);
}

.emptyBox{

    background:var(--surface);

    padding:40px;

    text-align:center;

    border-radius:var(--radius);

    color:var(--text-light);

    box-shadow:var(--shadow);
}

/* ==========================
   Ayarlar
========================== */

.settingsGrid{

    display:grid;

    grid-template-columns:
    repeat(auto-fit,minmax(280px,1fr));

    gap:20px;
}

.settingCard{

    background:var(--surface);

    padding:22px;

    border-radius:var(--radius);

    box-shadow:var(--shadow);
}

.settingCard h3{

    margin-bottom:10px;
}

.settingCard p{

    margin-bottom:18px;

    color:var(--text-light);
}

.settingCard button{

    background:var(--primary);

    color:#fff;

    padding:12px 18px;

    border-radius:12px;

    font-weight:bold;
}

.settingCard.danger button{

    background:var(--danger);
}

/* ==========================
   Mobil Uyum
========================== */

@media (max-width:900px){

    #app{
        grid-template-columns:1fr;
    }

    .sidebar{

        position:fixed;

        left:-280px;

        top:70px;

        width:260px;

        height:calc(100vh - 70px);

        z-index:1000;

        transition:.30s;
    }

    .sidebar.show{
        left:0;
    }

    .content{
        padding:18px;
    }

    .cardGrid{
        grid-template-columns:1fr;
    }

    .settingsGrid{
        grid-template-columns:1fr;
    }

}

@media (max-width:600px){

    .topbar{
        padding:0 14px;
    }

    .logoArea h1{
        font-size:22px;
    }

    .pageTitle h2{
        font-size:22px;
    }

    th,
    td{
        padding:10px;
        font-size:14px;
    }

    .buttonArea{
        flex-direction:column;
    }

    .buttonArea button,
    .formCard button,
    .settingCard button{
        width:100%;
    }

}

/* ==========================
   Scrollbar
========================== */

::-webkit-scrollbar{
    width:8px;
}

::-webkit-scrollbar-track{
    background:#eef2f7;
}

::-webkit-scrollbar-thumb{
    background:#b8c3d6;
    border-radius:999px;
}

::-webkit-scrollbar-thumb:hover{
    background:#94a3b8;
}

/* ==========================
   Animasyonlar
========================== */

.page{
    animation:fade .25s ease;
}

@keyframes fade{

    from{
        opacity:0;
        transform:translateY(10px);
    }

    to{
        opacity:1;
        transform:translateY(0);
    }

}

.card,
.formCard,
.tableCard,
.settingCard,
.listItem,
.emptyBox{

    transition:
    transform .25s,
    box-shadow .25s;
}

.card:hover,
.formCard:hover,
.tableCard:hover,
.settingCard:hover,
.listItem:hover{

    transform:translateY(-3px);

    box-shadow:
    0 14px 30px rgba(0,0,0,.12);
}
