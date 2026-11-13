const STORE={users:'clf-users',items:'clf-items',session:'clf-session'};
const read=(key,fallback=[])=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}};
const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getSession=()=>read(STORE.session,null);
const getItems=()=>read(STORE.items,[]);
const categories=['Electronics','Books','ID Cards','Accessories','Clothing','Other'];
const icons={Electronics:'🎧',Books:'📚','ID Cards':'🪪',Accessories:'⌚',Clothing:'🧥',Other:'📦'};
function toast(message,type='success'){let el=document.querySelector('#toast');if(!el){el=document.createElement('div');el.id='toast';el.style.cssText='position:fixed;top:88px;right:20px;z-index:99;padding:13px 18px;border-radius:12px;background:var(--surface);border:1px solid var(--border);box-shadow:var(--shadow);max-width:90vw';document.body.append(el)}el.textContent=message;el.style.color=type==='error'?'var(--danger)':'var(--success)';el.classList.remove('hidden');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.add('hidden'),3000)}
function currentUser(){const s=getSession();return s?read(STORE.users,[]).find(u=>u.email===s.email):null}
function requireLogin(){if(!getSession()){location.href='signin.html?next=home.html';return false}return true}
function initRegister(){
 const form=document.querySelector('#registerForm');if(!form)return;
 const rules={fullName:[/^[a-zA-Z\s]{2,50}$/,'Enter 2–50 letters and spaces.'],empId:[/^[A-Z0-9]{6,12}$/i,'Use 6–12 letters or numbers.'],email:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Enter a valid email address.'],mobile:[/^[6-9]\d{9}$/,'Enter a valid 10-digit Indian mobile number.'],password:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,'Use 8+ characters with uppercase, lowercase, number and @$!%*?&.']};
 const fields=[...form.querySelectorAll('[data-validate]')],submit=form.querySelector('button[type="submit"]');
 function validate(input){let ok=true,msg='';if(rules[input.name]){ok=rules[input.name][0].test(input.value.trim());msg=rules[input.name][1]}else if(input.name==='dept'){ok=!!input.value;msg='Choose your department.'}else if(input.name==='confirmPassword'){ok=input.value===form.password.value&&!!input.value;msg='Passwords do not match.'}
 const error=form.querySelector(`[data-error="${input.name}"]`);input.classList.toggle('invalid',!ok);input.classList.toggle('valid',ok);if(error)error.textContent=ok?'':msg;return ok}
 function allValid(){const valid=fields.every(validate);submit.disabled=!valid;submit.style.opacity=valid?'1':'.55';return valid}
 fields.forEach(i=>{i.addEventListener('blur',()=>{validate(i);allValid()});i.addEventListener('input',()=>{if(i.classList.contains('invalid')||i.name==='password')validate(i);if(i.name==='password'&&form.confirmPassword.value)validate(form.confirmPassword);allValid()})});
 form.addEventListener('submit',e=>{e.preventDefault();if(!allValid())return;const users=read(STORE.users,[]);const email=form.email.value.trim().toLowerCase(),empId=form.empId.value.trim();if(users.some(u=>u.email===email||u.empId.toLowerCase()===empId.toLowerCase())){toast('Email or Register ID is already registered.','error');return}
 users.push({fullName:form.fullName.value.trim(),empId,email,mobile:form.mobile.value.trim(),dept:form.dept.value,password:form.password.value});write(STORE.users,users);toast('Registration successful! Please sign in.');setTimeout(()=>location.href='signin.html',900)});
}
function initSignup(){
 const f=document.querySelector('#signupForm');if(!f)return;
 f.addEventListener('submit',e=>{e.preventDefault();const email=f.email.value.trim().toLowerCase(),p=f.password.value,cp=f.confirmPassword.value;
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/).test(p)||p!==cp||!f.terms.checked){toast('Check your email, password, confirmation and terms consent.','error');return}
 const users=read(STORE.users,[]);if(users.some(u=>u.email===email)){toast('An account with this email already exists.','error');return}
 users.push({fullName:email.split('@')[0],empId:'',email,mobile:'',dept:'',password:p});write(STORE.users,users);toast('Account created! You can now sign in.');setTimeout(()=>location.href='signin.html',800);
 });
}
function initSignin(){
 const f=document.querySelector('#signinForm');if(!f)return;
 const toggle=f.querySelector('[data-password-toggle]');toggle?.addEventListener('click',()=>{const p=f.password;p.type=p.type==='password'?'text':'password';toggle.textContent=p.type==='password'?'Show':'Hide'});
 f.addEventListener('submit',e=>{e.preventDefault();const identity=f.identity.value.trim().toLowerCase(),password=f.password.value;const user=read(STORE.users,[]).find(u=>(u.email.toLowerCase()===identity||(u.empId||'').toLowerCase()===identity)&&u.password===password);
 const alert=f.querySelector('.alert');if(!user){alert.textContent='Invalid email / Register ID or password. Please try again.';alert.classList.remove('hidden');return}
 alert.classList.add('hidden');write(STORE.session,{email:user.email,remember:f.remember.checked,loggedAt:new Date().toISOString()});const next=new URLSearchParams(location.search).get('next');location.href=next==='home.html'?'home.html':'home.html';
 });
}
function initReport(){
 const f=document.querySelector('#reportForm');if(!f)return;
 const type=f.dataset.type;
 f.addEventListener('submit',e=>{e.preventDefault();if(!f.reportValidity())return;const user=currentUser();const imageFile=f.image.files[0];
 const save=image=>{const item={id:'CLF-'+Date.now().toString(36).toUpperCase(),type,name:f.itemName.value.trim(),category:f.category.value,location:f.location.value.trim(),date:f.itemDate.value,description:f.description.value.trim(),contact:f.contact.value.trim(),image:image||'',createdAt:new Date().toISOString(),reporter:user?.fullName||'Campus student',status:'Open'};const items=getItems();items.unshift(item);write(STORE.items,items);toast('Your item report has been published!');f.reset();setTimeout(()=>location.href='items.html',900)};
 if(imageFile){if(imageFile.size>1500000){toast('Please choose an image smaller than 1.5 MB.','error');return}const reader=new FileReader();reader.onload=()=>save(reader.result);reader.readAsDataURL(imageFile)}else save('');
 });
}
function itemCard(item){const emoji=icons[item.category]||'📦';const img=item.image?`<img src="${item.image}" alt="${escapeHTML(item.name)}">`:emoji;return `<article class="listing-card"><div class="listing-image">${img}</div><div class="listing-body"><span class="status ${item.type==='found'?'found':''}">${item.type.toUpperCase()}</span><h3>${escapeHTML(item.name)}</h3><div class="listing-meta"><span>📍 ${escapeHTML(item.location)}</span><span>📅 ${escapeHTML(item.date)}</span><span>🏷️ ${escapeHTML(item.category)}</span></div><p class="muted">${escapeHTML(item.description).slice(0,105)}${item.description.length>105?'…':''}</p><div class="listing-actions"><a class="btn small" href="mailto:${encodeURIComponent(item.contact)}?subject=${encodeURIComponent('Campus Lost & Found: '+item.name)}">Contact reporter</a><button class="btn small secondary" data-reunite="${item.id}">Mark reunited</button></div><small class="muted">ID: ${escapeHTML(item.id)}</small></div></article>`}
function renderItems(target,items){if(!target)return;target.innerHTML=items.length?items.map(itemCard).join(''):'<div class="empty-state"><div style="font-size:2rem">🔎</div><strong>No matching items yet</strong><p>Try changing your filters or report an item.</p></div>';target.querySelectorAll('[data-reunite]').forEach(b=>b.addEventListener('click',()=>{const all=getItems(),it=all.find(x=>x.id===b.dataset.reunite);if(it){it.status='Reunited';write(STORE.items,all);toast('Item marked as reunited.');refreshListings()}}))}
function refreshListings(){
 const items=getItems(),target=document.querySelector('#itemsGrid');if(target){let filtered=items;const q=(document.querySelector('#searchItems')?.value||'').toLowerCase(),type=document.querySelector('#filterType')?.value||'all',cat=document.querySelector('#filterCategory')?.value||'all',loc=(document.querySelector('#filterLocation')?.value||'').toLowerCase();filtered=filtered.filter(i=>(i.name+' '+i.description).toLowerCase().includes(q)&&(type==='all'||i.type===type)&&(cat==='all'||i.category===cat)&&i.location.toLowerCase().includes(loc));renderItems(target,filtered)}
 const lost=document.querySelector('#recentLost'),found=document.querySelector('#recentFound');if(lost)renderItems(lost,items.filter(i=>i.type==='lost'&&i.status!=='Reunited').slice(0,4));if(found)renderItems(found,items.filter(i=>i.type==='found'&&i.status!=='Reunited').slice(0,4));
 const counts={lost:items.filter(i=>i.type==='lost'&&i.status!=='Reunited').length,found:items.filter(i=>i.type==='found'&&i.status!=='Reunited').length,reunited:items.filter(i=>i.status==='Reunited').length};
 document.querySelectorAll('[data-count]').forEach(el=>el.textContent=counts[el.dataset.count]??0);
}
function initDashboard(){
 if(!document.querySelector('[data-dashboard]'))return;const user=currentUser();if(!user){location.href='signin.html';return}
 const name=document.querySelector('[data-user-name]');if(name)name.textContent=user.fullName;
 const email=document.querySelector('[data-user-email]');if(email)email.textContent=user.email;
 refreshListings();
 document.querySelectorAll('[data-logout]').forEach(b=>b.addEventListener('click',()=>{localStorage.removeItem(STORE.session);location.href='index.html'}));
 document.querySelectorAll('[data-sidebar-toggle]').forEach(b=>b.addEventListener('click',()=>document.querySelector('.sidebar')?.classList.toggle('open')));
}
document.addEventListener('DOMContentLoaded',()=>{
 initRegister();initSignup();initSignin();initReport();initDashboard();
 const grid=document.querySelector('#itemsGrid');if(grid){['searchItems','filterType','filterCategory','filterLocation'].forEach(id=>document.getElementById(id)?.addEventListener('input',refreshListings));refreshListings()}
 document.querySelectorAll('[data-logout]').forEach(b=>b.addEventListener('click',()=>{localStorage.removeItem(STORE.session);location.href='index.html'}));
});
