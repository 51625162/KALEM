// Rol Tabanlı Yetki Kontrolü
function rolDegistir() {
    const secilenRol = document.getElementById('role-select').value;
    const body = document.body;
    const profilName = document.getElementById('profile-name');

    if(secilenRol === 'staff') {
        body.classList.add('role-restricted');
        profilName.innerText = "Zabıt Katibi (Mehmet D.)";
        
        // Eğer katip yasaklı bir sayfadaysa otomatik dashboard'a yönlendir
        const activeSection = document.querySelector('.view-section.active-view');
        if(activeSection && (activeSection.id === 'kullanici-yonetimi' || activeSection.id === 'sistem-ayarlari')) {
            switchView('dashboard', document.querySelector('.menu-item'));
        }
    } else {
        body.classList.remove('role-restricted');
        profilName.innerText = "Yazı İşleri Müdürü (Ahmet Y.)";
    }
    sistemiGuncelle();
}

// Uygulama İlk Açıldığında Çalışacak Yapı
window.addEventListener('DOMContentLoaded', () => {
    if (typeof sistemiGuncelle === "function") {
        sistemiGuncelle();
    }
});
