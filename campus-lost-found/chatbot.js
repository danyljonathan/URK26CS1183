document.addEventListener('DOMContentLoaded',()=>{
 const fab=document.querySelector('#chatFab'),panel=document.querySelector('#chatPanel'),form=document.querySelector('#chatForm'),log=document.querySelector('#chatLog');
 if(!fab||!panel||!form||!log)return;
 const add=(text,cls)=>{const d=document.createElement('div');d.className='chat-msg '+cls;d.textContent=text;log.append(d);log.scrollTop=log.scrollHeight};
 const reply=q=>{q=q.toLowerCase();if(/hello|hi|hey/.test(q))return'Hey! Welcome to Campus Lost & Found. How can I help you today?';if(/report|lost/.test(q))return'Click Report Lost Item and fill in the details of your missing belonging.';if(/wallet|find|search/.test(q))return'Try searching in Browse Items by item name, category or location.';if(/contact|email|person/.test(q))return'Open an item listing and use Contact Reporter to send an email.';if(/found/.test(q))return'Use Report Found to publish the item, location and date you found it.';if(/login|account|register/.test(q))return'Create an account using Register, then sign in to access your dashboard.';return'I can help with reporting lost/found items, searching listings and contacting reporters. Try asking one of those!'};
 fab.addEventListener('click',()=>panel.classList.toggle('open'));panel.querySelector('[data-chat-close]')?.addEventListener('click',()=>panel.classList.remove('open'));
 add('Hi! I’m the campus assistant. What can I help you find?','bot-msg');
 form.addEventListener('submit',e=>{e.preventDefault();const input=form.querySelector('input'),q=input.value.trim();if(!q)return;add(q,'user-msg');input.value='';setTimeout(()=>add(reply(q),'bot-msg'),250)});
});
