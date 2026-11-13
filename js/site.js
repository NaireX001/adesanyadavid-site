/* ===== Adesanya David — shared behaviour (all pages) ===== */
(function(){
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));

/* page curtain: lift on arrival, sweep on leaving */
const cur=document.createElement('div');cur.className='curtain';
cur.innerHTML='<div class="cv"></div><div class="cl"></div><div class="cw gold"></div>';document.body.appendChild(cur);
requestAnimationFrame(()=>requestAnimationFrame(()=>cur.classList.add('hide')));
addEventListener('pageshow',e=>{if(e.persisted){cur.classList.remove('go');cur.classList.add('hide')}});
const norm=p=>{p=(p||'/').replace(/\/index\.html$/,'/').replace(/\.html$/,'');return p===''?'/':p};
function goTo(id,instant){const t=document.getElementById(id);if(!t)return;
  const run=()=>t.scrollIntoView({behavior:instant?'auto':'smooth',block:'start'});
  if(document.body.classList.contains('locked')){const iv=setInterval(()=>{if(!document.body.classList.contains('locked')){clearInterval(iv);setTimeout(run,60)}},100)}else run()}
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey)return;
  const h=a.getAttribute('href');
  if(h.startsWith('#')){e.preventDefault();if(h==='#top'){scrollTo({top:0,behavior:'smooth'});return}goTo(h.slice(1));const mm=document.querySelector('.mmenu.open');if(mm){mm.classList.remove('open');const b=document.querySelector('.burger');if(b)b.textContent='Menu'}return}
  if(!h.startsWith('/')||h.startsWith('//'))return;
  e.preventDefault();
  const go=a.dataset.go;
  if(norm(h)===norm(location.pathname)){if(go)goTo(go,true);else scrollTo({top:0,behavior:'smooth'});return}
  try{if(go)sessionStorage.setItem('go',go)}catch(_){}
  cur.querySelector('.cw').textContent=a.dataset.label||a.textContent.trim().replace(/[→↑]/g,'');
  cur.classList.remove('hide');cur.classList.add('go');
  setTimeout(()=>{location.href=h},780);
});
try{const g=sessionStorage.getItem('go');if(g){sessionStorage.removeItem('go');addEventListener('load',()=>goTo(g,true))}}catch(_){}
if(location.hash){const id=location.hash.slice(1);history.replaceState(null,'',location.pathname);addEventListener('load',()=>goTo(id,true))}

/* grain + cursor */
if(!$('.grain')){const g=document.createElement('div');g.className='grain';document.body.appendChild(g)}
let c=$('#cur');if(!c){c=document.createElement('div');c.className='cur';c.id='cur';c.innerHTML='<span>READ</span>';document.body.appendChild(c)}
let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
(function loop(){cx+=(mx-cx)*.18;cy+=(my-cy)*.18;c.style.transform='translate3d('+cx+'px,'+cy+'px,0)';requestAnimationFrame(loop)})();
const hoverables='a,button,.bk,.card,[data-c]';
document.addEventListener('mouseover',e=>{if(e.target.closest(hoverables))c.classList.add('big')});
document.addEventListener('mouseout',e=>{if(e.target.closest(hoverables)&&!e.relatedTarget?.closest?.(hoverables))c.classList.remove('big')});

/* nav: solid on scroll, mobile menu */
const nav=$('.nav');addEventListener('scroll',()=>nav&&nav.classList.toggle('solid',scrollY>40),{passive:true});
const burger=$('.burger'),mm=$('.mmenu');
if(burger&&mm){burger.addEventListener('click',()=>{mm.classList.toggle('open');burger.textContent=mm.classList.contains('open')?'Close':'Menu'})}

/* reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv,.split,.phero,[data-in]').forEach((el,i)=>{if(el.classList.contains('rv'))el.style.transitionDelay=(i%5)*.07+'s';io.observe(el)});

/* live clock */
const fmt=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'});
const tick=()=>{$$('[data-clock]').forEach(el=>{try{el.textContent=fmt.format(new Date())}catch(e){}})};tick();setInterval(tick,15000);

/* books: tap to open on touch screens */
$$('.bk').forEach(b=>b.addEventListener('click',()=>{if(matchMedia('(hover:none)').matches)b.classList.toggle('open')}));

/* count-up numbers */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.count,t0=performance.now();
  (function step(t){const k=clamp((t-t0)/1800),v=Math.round(to*(1-Math.pow(1-k,3)));el.textContent=v+(el.dataset.suffix||'');if(k<1)requestAnimationFrame(step)})(t0);co.unobserve(el)}),{threshold:.5});
$$('[data-count]').forEach(el=>co.observe(el));

window.AD={clamp};
})();
/* contact form: builds a ready-to-send WhatsApp message and email */
(function(){const f=document.getElementById('cform');if(!f)return;const wa=document.getElementById('sendWa'),em=document.getElementById('sendEm');
function upd(){const d=Object.fromEntries(new FormData(f));
  const body='Hi David, I would like to talk about my book.\n\nName: '+(d.name||'')+'\nEmail: '+(d.email||'')+'\nWhere my book is now: '+d.stage+'\nWhat I need: '+d.need+'\n\n'+(d.msg||'');
  wa.href='https://wa.me/2349077716599?text='+encodeURIComponent(body);
  em.href='mailto:adesanyadavid25@gmail.com?subject='+encodeURIComponent('Book enquiry'+(d.name?' from '+d.name:''))+'&body='+encodeURIComponent(body);}
f.addEventListener('input',upd);f.addEventListener('change',upd);upd();})();
