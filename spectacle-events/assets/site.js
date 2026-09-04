// ── INTRO SPLASH
(function(){
  const intro=document.getElementById('intro');
  if(!intro)return;

  // Lock scroll while intro is visible
  document.body.classList.add('intro-on');

  // Spawn ambient particles inside intro
  const ip=document.getElementById('intro-particles');
  if(ip){
    for(let i=0;i<28;i++){
      const d=document.createElement('div');
      d.className='i-pdot';
      const s=.8+Math.random()*2.4;
      d.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;bottom:${-5-Math.random()*10}%;animation-duration:${7+Math.random()*11}s;animation-delay:${-Math.random()*16}s;opacity:${.2+Math.random()*0.35}`;
      ip.appendChild(d);
    }
  }

  // Trigger exit at 3.8 s — curtain slides up, scan-line leads edge
  setTimeout(()=>{
    intro.classList.add('exit');
    setTimeout(()=>{
      intro.remove();
      document.body.classList.remove('intro-on');
    },1150);
  },3800);
})();

// SCROLL PROGRESS
const sp=document.getElementById('sp');
if(sp)window.addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-window.innerHeight;sp.style.width=(h>0?window.scrollY/h*100:0)+'%';},{passive:true});

// PARTICLES
(function(){const c=document.getElementById('bgParticles');if(!c)return;for(let i=0;i<45;i++){const d=document.createElement('div');d.className='p-dot';const s=1+Math.random()*3;d.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;bottom:${-10-Math.random()*20}%;animation-duration:${6+Math.random()*12}s;animation-delay:${-Math.random()*18}s;opacity:${0.3+Math.random()*0.4};`;c.appendChild(d);}})();

// CURSOR
const cur=document.getElementById('cur'),ring=document.getElementById('ring');
let mx=0,my=0,rx=0,ry=0,trt=0;
if(cur&&ring){
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
  const now=Date.now();
  if(now-trt>55){trt=now;const t=document.createElement('div');t.className='trail-dot';t.style.left=mx+'px';t.style.top=my+'px';document.body.appendChild(t);setTimeout(()=>t.remove(),700);}
});
(function aR(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(aR);})();
document.querySelectorAll('a,button,.dot,.arr,.svc-card,.proc-card,.impact-card,.g-item,.client-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='56px';ring.style.height='56px';ring.style.opacity='.35';ring.style.borderColor='rgba(0,214,183,.9)';});
  el.addEventListener('mouseleave',()=>{ring.style.width='34px';ring.style.height='34px';ring.style.opacity='1';ring.style.borderColor='rgba(0,214,183,.6)';});
});
}

// BLOBS
const bE=[document.querySelector('.blob-1'),document.querySelector('.blob-2'),document.querySelector('.blob-3')];
if(bE.every(Boolean)){
const bS=[{x:window.innerWidth*.25,y:window.innerHeight*.35,speed:.018,phase:0},{x:window.innerWidth*.75,y:window.innerHeight*.25,speed:.032,phase:2.1},{x:window.innerWidth*.5,y:window.innerHeight*.7,speed:.048,phase:4.3}];
let cX=window.innerWidth*.5,cY=window.innerHeight*.5,tk=0;
document.addEventListener('mousemove',e=>{cX=e.clientX;cY=e.clientY;},{passive:true});
(function aB(){tk+=.004;const W=window.innerWidth,H=window.innerHeight;
  bS.forEach((b,i)=>{const amp=.07;const tX=cX+Math.sin(tk+b.phase)*amp*W;const tY=cY+Math.cos(tk+b.phase*.7)*amp*H;b.x+=(tX-b.x)*b.speed;b.y+=(tY-b.y)*b.speed;const w=bE[i].offsetWidth/2,h=bE[i].offsetHeight/2;bE[i].style.transform=`translate(${b.x-w}px,${b.y-h}px)`;});
  requestAnimationFrame(aB);})();
}

// HERO SLIDER
(function(){
const slides=document.querySelectorAll('.slide'),dotsW=document.getElementById('sliderDots'),prog=document.getElementById('slideProgress');
const heroEl0=document.querySelector('.hero');
if(!slides.length||!dotsW||!prog||!heroEl0)return;
const DELAY=5000;let cur_=0,paused=false,pStart=null,pRaf=null;
slides.forEach((_,i)=>{const d=document.createElement('div');d.className='dot'+(i===0?' active':'');d.addEventListener('click',()=>goTo(i));dotsW.appendChild(d);});
function syncD(i){document.querySelectorAll('.dot').forEach((d,j)=>d.classList.toggle('active',j===i));}
function goTo(n){slides[cur_].classList.remove('active');cur_=((n%slides.length)+slides.length)%slides.length;slides[cur_].classList.add('active');syncD(cur_);startP();}
function startP(){cancelAnimationFrame(pRaf);prog.style.transition='none';prog.style.width='0%';pStart=performance.now();if(!paused)tickP();}
function tickP(ts){if(!ts)ts=performance.now();const pct=Math.min((ts-pStart)/DELAY*100,100);prog.style.width=pct+'%';if(pct<100){pRaf=requestAnimationFrame(tickP);}else{setTimeout(()=>goTo(cur_+1),40);}}
document.getElementById('arrNext').addEventListener('click',()=>goTo(cur_+1));
document.getElementById('arrPrev').addEventListener('click',()=>goTo(cur_-1));
const heroEl=document.querySelector('.hero');
heroEl.addEventListener('mouseenter',()=>{paused=true;cancelAnimationFrame(pRaf);});
heroEl.addEventListener('mouseleave',()=>{paused=false;const e=parseFloat(prog.style.width||0)/100*DELAY;pStart=performance.now()-e;tickP();});
startP();
})();

// REVEAL
const rO=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rO.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.rv,.rv-scale').forEach(el=>rO.observe(el));

// COUNTERS
const cO=new IntersectionObserver(es=>{es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=+el.dataset.count,suffix=el.dataset.suffix||'',dur=2000,t0=performance.now();(function t(now){const p=Math.min((now-t0)/dur,1),v=1-Math.pow(1-p,4);el.textContent=Math.round(v*target)+suffix;if(p<1)requestAnimationFrame(t);else el.textContent=target+suffix;})(t0);cO.unobserve(el);});},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cO.observe(el));

// NAV
const nI=document.getElementById('navInner');
if(nI)window.addEventListener('scroll',()=>nI.classList.toggle('scrolled',window.scrollY>60),{passive:true});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const h=a.getAttribute('href');if(!h||h==='#')return;const t=document.querySelector(h);if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}});});

// MOBILE MENU
function toggleMobMenu(){
  const btn=document.getElementById('mob-btn');
  const ov=document.getElementById('mob-overlay');
  if(!btn||!ov)return;
  const isOpen=ov.classList.toggle('open');
  btn.classList.toggle('open',isOpen);
  document.body.style.overflow=isOpen?'hidden':'';
}
function closeMobMenu(){
  const btn=document.getElementById('mob-btn'),ov=document.getElementById('mob-overlay');
  if(btn)btn.classList.remove('open');
  if(ov)ov.classList.remove('open');
  document.body.style.overflow='';
}
// Close on overlay click (outside menu items)
const mobOv=document.getElementById('mob-overlay');
if(mobOv)mobOv.addEventListener('click',function(e){if(e.target===this)closeMobMenu();});
// Close on ESC
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMobMenu();});
