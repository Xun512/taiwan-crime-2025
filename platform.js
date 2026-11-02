(() => {
  'use strict';
  const titles={home:'首頁總覽',query:'資料查詢',age:'年齡與性別',violence:'暴力犯罪','county-map':'縣市犯罪地圖',compare:'自由比較',method:'資料來源與方法'};
  const aliases={overview:'home',explore:'age',rates:'age','age-scope-title':'age','pairing-title':'age','violence-scope-title':'violence'};
  const sidebar=document.getElementById('sidebar'),toggle=document.getElementById('menuToggle');
  const mobile=window.matchMedia('(max-width: 800px)');
  function setMenu(open){sidebar.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));sidebar.inert=mobile.matches&&!open}
  function ageView(view){
    document.querySelectorAll('[data-age-panel]').forEach(p=>p.hidden=p.dataset.agePanel!==view);
    document.querySelectorAll('[data-age-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ageView===view)));
  }
  function route(focus=true){
    const raw=decodeURIComponent(location.hash.slice(1)),key=titles[raw]?raw:aliases[raw]||'home';
    document.querySelectorAll('[data-page]').forEach(p=>p.hidden=p.dataset.page!==key);
    document.querySelectorAll('[data-route]').forEach(a=>{if(a.dataset.route===key)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    document.getElementById('pageTitle').textContent=titles[key];
    document.title=`${titles[key]}｜臺灣犯罪觀察 2025`;
    setMenu(false);
    if(key==='age'&&raw!=='age')ageView(raw==='rates'?'rates':'structure');
    window.scrollTo(0,0);
    if(focus)document.getElementById('pageTitle').focus({preventScroll:true});
    if(raw==='age-scope-title'||raw==='pairing-title')document.getElementById(raw).scrollIntoView({block:'start'});
  }
  toggle.addEventListener('click',()=>setMenu(!sidebar.classList.contains('open')));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sidebar.classList.contains('open')){setMenu(false);toggle.focus()}});
  document.addEventListener('click',e=>{if(mobile.matches&&!sidebar.contains(e.target)&&!toggle.contains(e.target))setMenu(false)});
  mobile.addEventListener('change',()=>setMenu(false));
  document.querySelector('.skip-link').addEventListener('click',e=>{e.preventDefault();document.getElementById('main').focus()});
  document.querySelectorAll('[data-age-view]').forEach(b=>b.addEventListener('click',()=>{ageView(b.dataset.ageView);history.replaceState(null,'',b.dataset.ageView==='rates'?'#rates':'#age')}));
  // Same-route links still close the mobile drawer without resetting analysis filters.
  document.querySelectorAll('[data-route]').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  window.addEventListener('hashchange',()=>route());route(false);
  const warning=document.getElementById('compareWarning');
  function comparisonWarning(){const population=document.getElementById('comparePopulation').value,metric=document.getElementById('compareMetric').value;const changed=['Age','Crime','Sex'].filter(f=>document.getElementById(`compare${f}A`).value!==document.getElementById(`compare${f}B`).value).length;warning.textContent=(population==='victims'?'被害人採官方獨立年齡分組；沒有適用的人口分母，本區停用被害人口率。 ':'兩組均使用犯罪嫌疑犯資料；不跨嫌疑犯與被害人母體相減。 ')+(metric==='count'?'人數未控制人口規模。 ':metric==='share'?'占比分母各為該組年齡層的全部案類、男女合計人數。 ':'人口率分母依各組年齡與性別選取；全體分母含未滿 12 歲人口。 ')+(changed>1?'目前同時改變多個條件，差異不能歸因於單一年齡、性別或犯罪類型。':'合計與子項可能重疊，勿將比較兩組相加。')}
  document.getElementById('compare').addEventListener('change',comparisonWarning);
  document.querySelectorAll('[data-compare-preset]').forEach(b=>b.addEventListener('click',comparisonWarning));comparisonWarning();
})();
