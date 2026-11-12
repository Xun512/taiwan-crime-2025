(() => {
  const control=document.querySelector('.edition-switch');
  if(!control)return;
  const to4={home:'overview',query:'overview',age:'explore'},to5={overview:'home',explore:'age'};
  function update(){
    let section='';
    try{section=decodeURIComponent(location.hash.slice(1))}catch{section=''}
    const current=control.dataset.currentVersion;
    control.querySelectorAll('[data-version-target]').forEach(link=>{
      const target=link.dataset.versionTarget;
      const hash=target===current?section:(target==='4'?to4[section]||section:to5[section]||section);
      link.href=`./${target==='4'?'v4.html':'index.html'}${hash?'#'+encodeURIComponent(hash):''}`;
    });
  }
  window.addEventListener('hashchange',update);update();
})();
