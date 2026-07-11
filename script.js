let docs=JSON.parse(localStorage.getItem('kalemDocs')||'["İzin Talebi","Dilekçe","Rapor"]');
function save(){localStorage.setItem('kalemDocs',JSON.stringify(docs));render();}
function render(){tbody.innerHTML='';docs.forEach((d,i)=>tbody.innerHTML+=`<tr><td>${d}</td><td><button onclick="delDoc(${i})">🗑️ Sil</button></td></tr>`);count.textContent=docs.length;wait.textContent=docs.length?1:0;}
function addDoc(){if(doc.value.trim()){docs.push(doc.value.trim());doc.value='';save();}}
function delDoc(i){if(confirm('Evrak silinsin mi?')){docs.splice(i,1);save();}}
render();