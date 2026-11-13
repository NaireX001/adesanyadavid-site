/* ===== Home: sections below the dive ===== */
(function(){
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),range=(p,a,b)=>clamp((p-a)/(b-a));
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const prog=el=>{const r=el.getBoundingClientRect();return clamp(-r.top/(el.offsetHeight-innerHeight))};

/* 01 · about teaser */
const ab=$('#about'),abIn=$('.ab-in');
const words=[];$$('.ab-lines p').forEach(p=>{
  const walk=n=>{Array.from(n.childNodes).forEach(ch=>{
    if(ch.nodeType===3){const f=document.createDocumentFragment();ch.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));return}const s=document.createElement('span');s.className='w';s.textContent=t;f.appendChild(s);words.push(s)});ch.replaceWith(f)}
    else walk(ch)})};walk(p)});

/* 02 · services track */
const hs=$('#services'),track=$('.hs-track'),bar=$('.hs-bar i'),cards=$$('.card');
function sizeHs(){const extra=Math.max(0,track.scrollWidth-innerWidth);hs.style.height=(innerHeight+extra)+'px';hs.dataset.extra=extra}
cards.forEach(c=>c.addEventListener('click',()=>{if(matchMedia('(hover:none)').matches&&!c.classList.contains('all'))c.classList.toggle('flip')}));

/* 03 · shelf */
const shelf=$('#books'),row=$('.shelf-row');

/* 04 · testimonials */
const slides=$$('.slide'),cnt=$('.tst-ctl .cnt'),tb=$('.tst-ctl .tbar i');let si=0,timer;
function show(i){si=(i+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('on',k===si));cnt.textContent=String(si+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  tb.classList.remove('run');void tb.offsetWidth;tb.classList.add('run');clearTimeout(timer);timer=setTimeout(()=>show(si+1),6000)}
if(slides.length){$('.tst-ctl .prev').onclick=()=>show(si-1);$('.tst-ctl .next').onclick=()=>show(si+1);show(0)}

function frame(){
  requestAnimationFrame(frame);
  /* about */
  const p=prog(ab);
  const ci=14*(1-ease(range(p,0,.3)));abIn.style.setProperty('--ci',ci+'%');
  abIn.style.setProperty('--is',1.25-.25*ease(range(p,0,.5)));
  abIn.style.setProperty('--co',range(p,.25,.35));abIn.style.setProperty('--ro',range(p,.2,.4));
  const wp=range(p,.12,.85);words.forEach((w,i)=>w.classList.toggle('on',i/words.length<wp));
  abIn.style.setProperty('--mo',range(p,.85,.95));
  /* services */
  const hp=prog(hs),ex=+hs.dataset.extra||0;
  track.style.transform='translate3d('+(-hp*ex)+'px,0,0)';bar.style.transform='scaleX('+hp+')';
  cards.forEach(c=>{const r=c.getBoundingClientRect(),m=(r.left+r.width/2)/innerWidth-.5;c.style.transform='rotateY('+(-m*14)+'deg) translateZ('+(-Math.abs(m)*60)+'px)'});
  /* shelf drifts with scroll */
  const r=shelf.getBoundingClientRect(),sp=clamp((innerHeight-r.top)/(innerHeight+r.height));
  const over=Math.max(0,row.scrollWidth-innerWidth);row.style.transform='translate3d('+(-sp*over)+'px,0,0)';
}
addEventListener('resize',sizeHs);sizeHs();setTimeout(sizeHs,800);
requestAnimationFrame(frame);
})();
