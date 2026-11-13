document.addEventListener('DOMContentLoaded',()=>{
 const display=document.querySelector('#calcDisplay'),grid=document.querySelector('#calcGrid');if(!display||!grid)return;
 let current='0',stored=null,operator=null,replace=false;
 const show=()=>display.value=current;
 const calculate=(a,b,op)=>{if(op==='+')return a+b;if(op==='-')return a-b;if(op==='*')return a*b;if(op==='/'){if(b===0)throw Error('Cannot divide by zero');return a/b}return b};
 grid.addEventListener('click',e=>{const b=e.target.closest('button[data-key]');if(!b)return;const k=b.dataset.key;
 try{
 if(k==='C'){current='0';stored=null;operator=null;replace=false}
 else if(k==='='){if(operator!==null&&stored!==null){current=String(Number(calculate(stored,Number(current),operator).toFixed(8)));stored=null;operator=null;replace=true}}
 else if(['+','-','*','/'].includes(k)){if(operator&&stored!==null)stored=calculate(stored,Number(current),operator);else stored=Number(current);operator=k;replace=true}
 else if(k==='.'){if(replace){current='0.';replace=false}else if(!current.includes('.'))current+='.'}
 else if(/^\d$/.test(k)){if(replace||current==='0'){current=k;replace=false}else if(current.length<12)current+=k}
 show();
 }catch(err){current=err.message;stored=null;operator=null;replace=true;show()}
 });
});
