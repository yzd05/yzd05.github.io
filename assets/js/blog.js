(() => {
  const $ = s => document.querySelector(s);
  const menu = $('.menu-toggle');
  menu.addEventListener('click', () => { const open = $('#site-nav').classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  $('#back-top').addEventListener('click', () => window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  const panel = $('#reading-settings'), settingsButton = $('#settings-open'), size = $('#font-size'), eye = $('#eye-care');
  const storageKey = 'yzd-reading-settings';
  function applySettings(font, comfort) {
    const value = Math.max(14, Math.min(22, Number(font) || 16));
    document.documentElement.style.setProperty('--body-size', value + 'px');
    document.body.classList.toggle('eye-care', Boolean(comfort));
    size.value = String(value); $('#font-size-value').value = value + ' px'; eye.checked = Boolean(comfort);
  }
  try { const saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); applySettings(saved.font, saved.comfort); } catch { applySettings(16,false); }
  function saveSettings() { applySettings(size.value,eye.checked); try {localStorage.setItem(storageKey,JSON.stringify({font:Number(size.value),comfort:eye.checked}));} catch {} }
  size.addEventListener('input',saveSettings); eye.addEventListener('change',saveSettings);
  $('#settings-reset').addEventListener('click',() => {applySettings(16,false); saveSettings();});
  settingsButton.addEventListener('click',() => {panel.hidden=!panel.hidden;settingsButton.setAttribute('aria-expanded',String(!panel.hidden));});
  document.addEventListener('click',e => {if(!panel.hidden&&!panel.contains(e.target)&&!settingsButton.contains(e.target)){panel.hidden=true;settingsButton.setAttribute('aria-expanded','false');}});
  const dialog=$('#search-dialog'), input=$('#search-input'), status=$('#search-status'), results=$('#search-results');
  let indexPromise, indexData, loadError=false;
  async function loadIndex(){
    if(!indexPromise) indexPromise=fetch(dialog.dataset.indexUrl).then(r=>{if(!r.ok)throw new Error('index');return r.json();}).then(data=>{indexData=data;loadError=false;return data;}).catch(()=>{loadError=true;indexPromise=undefined;return null;});
    return indexPromise;
  }
  function renderResults(){
    results.replaceChildren();
    const query=input.value.trim().toLocaleLowerCase();
    if(!query){status.textContent='输入关键词，搜索全部文章。';return;}
    if(loadError){status.textContent='暂时无法加载搜索索引，请关闭后重试。';return;}
    if(!indexData){status.textContent='正在加载文章…';return;}
    const terms=query.split(/\s+/).filter(Boolean);
    const matches=indexData.filter(p=>{const text=[p.title,p.content,...(p.tags||[]),...(p.categories||[])].join(' ').toLocaleLowerCase();return terms.every(t=>text.includes(t));});
    status.textContent=matches.length?'找到 '+matches.length+' 篇文章':'没有找到相关内容，试试其他关键词。';
    for(const p of matches){
      const article=document.createElement('article'); article.className='search-result';
      const heading=document.createElement('h3'), link=document.createElement('a');link.href=p.url;link.textContent=p.title;heading.append(link);
      const snippet=document.createElement('p');const content=p.content||p.summary||'';const hit=content.toLocaleLowerCase().indexOf(terms[0]);const start=Math.max(0,hit-36);snippet.textContent=(start?'…':'')+content.slice(start,start+160)+(content.length>start+160?'…':'');
      article.append(heading,snippet);results.append(article);
    }
  }
  async function openSearch(){if(!dialog.open)dialog.showModal();input.focus();await loadIndex();renderResults();}
  $('.search-open').addEventListener('click',openSearch);$('#search-close').addEventListener('click',()=>dialog.close());
  input.addEventListener('input',renderResults);
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){panel.hidden=true;settingsButton.setAttribute('aria-expanded','false');}
    const editing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)||document.activeElement.isContentEditable;
    if((e.key==='/'&&!editing)||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();openSearch();}
  });
  const tocLinks=[...document.querySelectorAll('.article-toc a')];
  const headings=tocLinks.map(a=>{try{return document.getElementById(decodeURIComponent(a.hash.slice(1)));}catch{return null;}}).filter(Boolean);
  let queued=false;
  function updateToc(){
    queued=false;if(!headings.length)return;
    let current=headings[0];for(const h of headings){if(h.getBoundingClientRect().top<=110)current=h;else break;}
    for(const a of tocLinks){let active=false;try{active=decodeURIComponent(a.hash.slice(1))===current.id;}catch{}a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}
  }
  if(headings.length){window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateToc);}},{passive:true});updateToc();}
  for(const pre of document.querySelectorAll('.post-content pre')){
    const code=pre.querySelector('code');if(!code)continue;
    const button=document.createElement('button');button.className='copy-code';button.textContent='复制';button.setAttribute('aria-label','复制代码');
    button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code.textContent);button.textContent='已复制';}catch{button.textContent='请手动复制';}setTimeout(()=>button.textContent='复制',1800);});pre.prepend(button);
  }
})();
