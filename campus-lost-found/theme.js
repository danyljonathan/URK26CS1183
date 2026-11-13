(function(){
  const saved=localStorage.getItem('clf-theme')||'light';
  document.documentElement.setAttribute('data-theme',saved);
  function updateButtons(){document.querySelectorAll('[data-theme-toggle]').forEach(b=>{b.textContent=document.documentElement.dataset.theme==='dark'?'☀️ Light':'🌙 Dark';});}
  document.addEventListener('DOMContentLoaded',()=>{
    updateButtons();
    document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{
      const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
      document.documentElement.setAttribute('data-theme',next);localStorage.setItem('clf-theme',next);updateButtons();
    }));
    const menu=document.querySelector('[data-menu-toggle]'),links=document.querySelector('.nav-links');
    if(menu&&links)menu.addEventListener('click',()=>links.classList.toggle('open'));
  });
})();
