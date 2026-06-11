/* ===== Navbar: scroll state + mobile toggle ===== */
(function(){
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  const isTransparent = nav && nav.classList.contains('transparent');

  function onScroll(){
    if(!nav) return;
    const y = window.scrollY;
    if(y > 40){
      nav.classList.add('scrolled');
      nav.classList.remove('transparent');
    }else{
      nav.classList.remove('scrolled');
      if(isTransparent) nav.classList.add('transparent');
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  if(toggle){
    toggle.addEventListener('click', ()=>{
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      toggle.classList.remove('open'); links.classList.remove('open');
    }));
  }
})();

/* ===== Scroll reveal ===== */
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return;}
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
  },{threshold:.12, rootMargin:'0px 0px -40px 0px'});
  els.forEach(e=>io.observe(e));
})();

/* ===== Animated stat counters ===== */
(function(){
  const nums = document.querySelectorAll('[data-count]');
  if(!nums.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el = en.target; const target = +el.dataset.count; const suffix = el.dataset.suffix||'';
      let cur=0; const step = Math.max(1, Math.ceil(target/45));
      const t = setInterval(()=>{ cur+=step; if(cur>=target){cur=target;clearInterval(t);} el.textContent=cur+suffix; }, 26);
      io.unobserve(el);
    });
  },{threshold:.5});
  nums.forEach(n=>io.observe(n));
})();

/* ===== Active nav link by current page ===== */
(function(){
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a[data-page]').forEach(a=>{
    if(a.dataset.page === here) a.classList.add('active');
  });
})();

/* ===== Publications: tabs + search + filter ===== */
(function(){
  const root = document.querySelector('[data-pubroot]');
  if(!root) return;
  const tabs = root.querySelectorAll('.pubtab');
  const search = root.querySelector('#pubSearch');
  const chips = root.querySelectorAll('.chip');
  const panels = root.querySelectorAll('[data-panel]');
  let activeFilter = 'all';

  function applyFilter(){
    const q = (search?.value||'').trim().toLowerCase();
    panels.forEach(panel=>{
      if(panel.classList.contains('hidden')) return;
      let visible=0;
      panel.querySelectorAll('.pub-item').forEach(item=>{
        const txt = item.textContent.toLowerCase();
        const tags = (item.dataset.tags||'');
        const okText = !q || txt.includes(q);
        const okFilter = activeFilter==='all' || tags.includes(activeFilter);
        const show = okText && okFilter;
        item.style.display = show?'':'none';
        if(show) visible++;
      });
      const empty = panel.querySelector('.pub-empty');
      if(empty) empty.style.display = visible? 'none':'block';
    });
  }

  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    panels.forEach(p=>p.classList.toggle('hidden', p.dataset.panel!==tab.dataset.target));
    applyFilter();
  }));
  chips.forEach(c=>c.addEventListener('click',()=>{
    chips.forEach(x=>x.classList.remove('active'));
    c.classList.add('active');
    activeFilter = c.dataset.filter;
    applyFilter();
  }));
  if(search) search.addEventListener('input', applyFilter);
})();

/* ===== Gallery lightbox ===== */
(function(){
  const cards = Array.from(document.querySelectorAll('.gcard'));
  const box = document.querySelector('.lightbox');
  if(!cards.length || !box) return;
  const img = box.querySelector('img');
  const cap = box.querySelector('.lightbox__cap');
  let idx = 0;
  const items = cards.map(c=>({src:c.querySelector('img').src, cap:c.dataset.caption||''}));

  function show(i){
    idx = (i+items.length)%items.length;
    img.src = items[idx].src;
    cap.textContent = items[idx].cap;
  }
  cards.forEach((c,i)=>c.addEventListener('click',()=>{box.classList.add('open');show(i);document.body.style.overflow='hidden';}));
  function close(){box.classList.remove('open');document.body.style.overflow='';}
  box.querySelector('.lightbox__close').addEventListener('click',close);
  box.querySelector('.lightbox__nav.prev').addEventListener('click',e=>{e.stopPropagation();show(idx-1);});
  box.querySelector('.lightbox__nav.next').addEventListener('click',e=>{e.stopPropagation();show(idx+1);});
  box.addEventListener('click',e=>{if(e.target===box)close();});
  document.addEventListener('keydown',e=>{
    if(!box.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowLeft')show(idx-1);
    if(e.key==='ArrowRight')show(idx+1);
  });
})();

/* ===== Footer year ===== */
document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
