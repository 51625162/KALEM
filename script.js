const rows=[
['EVR-001','İzin Talebi','Tamamlandı'],
['EVR-002','Dilekçe','Bekliyor'],
['EVR-003','Rapor','İşlemde']
];
evrak.textContent=rows.length;
kullanici.textContent=12;
bekleyen.textContent=1;
function render(list){
tbody.innerHTML='';
list.forEach(r=>{
tbody.innerHTML+=`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`;
});
}
render(rows);
search.addEventListener('input',e=>{
const q=e.target.value.toLowerCase();
render(rows.filter(r=>r.join(' ').toLowerCase().includes(q)));
});
