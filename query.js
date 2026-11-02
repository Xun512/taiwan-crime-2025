(() => {
  const el=id=>document.getElementById(id),sexNames={total:'男女合計',male:'男性',female:'女性'},objectNames={suspects:'犯罪嫌疑犯',victims:'被害人',cases:'刑事案件'},metricNames={count:'計數',share:'占比',rate:'人口率（本站計算）'};
  const number=n=>n.toLocaleString('zh-TW',{maximumFractionDigits:2}),value=n=>n===null?'不適用':n.toLocaleString('zh-TW',{minimumFractionDigits:2,maximumFractionDigits:2});
  const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  let view='chart',result,selection;
  function options(node,items,preferred){node.replaceChildren(...items.map(([v,label])=>{const o=document.createElement('option');o.value=v;o.textContent=label;return o}));if(items.some(([v])=>v===preferred))node.value=preferred}
  function sync(){
    const object=el('qObject').value,caps=QUERY_MODEL.capabilities(object),oldAge=el('qAge').value,oldCrime=el('qCrime').value,oldRegion=el('qRegion').value,oldMetric=el('qMetric').value;
    options(el('qRegion'),['全國',...COUNTY_DATA.counties.map(c=>c.name)].map(v=>[v,v]),caps.region?oldRegion:'全國');el('qRegion').disabled=!caps.region;
    options(el('qAge'),QUERY_MODEL.ages(object).map(v=>[v,v]),caps.demographics?oldAge:'不適用');el('qAge').disabled=!caps.demographics;
    el('qSex').disabled=!caps.demographics;if(!caps.demographics)el('qSex').value='total';
    options(el('qCrime'),['全部案類',...QUERY_MODEL.crimes(object)].map(v=>[v,v]),oldCrime||'全部案類');
    options(el('qMetric'),[['count','計數'],['share',object==='cases'?'占同地區全部案件':'占同齡全部人數'],['rate',object==='cases'?'刑案發生率（本站計算）':'犯罪嫌疑人口率（本站計算）']],oldMetric);
    el('qMetric').querySelector('[value="rate"]').disabled=!caps.rate;if(!caps.rate&&el('qMetric').value==='rate')el('qMetric').value='count';
    el('qLimit').textContent=object==='cases'?'案件資料僅提供全國或縣市警察機關別 × 犯罪類型，未提供案件的年齡、性別交叉表，因此停用這兩項條件。':object==='victims'?'被害人採官方表 16 年齡分組；現有縣市資料沒有相同交叉欄位，因此地區限全國。沒有適用的分組人口分母，因此停用被害人口率。':'嫌疑犯採官方表 7 年齡分組；現有縣市資料沒有年齡、性別交叉欄位，因此地區限全國。未滿 12 歲不列入嫌疑犯統計；不代表沒有事件。';
    render();
  }
  function render(){
    selection={object:el('qObject').value,region:el('qRegion').value,crime:el('qCrime').value,age:el('qAge').value,sex:el('qSex').value,metric:el('qMetric').value,search:el('qSearch').value};
    result=QUERY_MODEL.run(selection);const {object,metric,region,age,sex,crime}=selection;
    el('qTitle').textContent=`${objectNames[object]} · ${crime} · ${metric==='rate'?(object==='cases'?'刑案發生率':'犯罪嫌疑人口率'):metricNames[metric]}`;
    el('qContext').textContent=`2025 年全年｜${object==='cases'?(region==='全國'?'全國（含署所屬機關）':region+'警察機關別，非逐案發生地'):age+' · '+sexNames[sex]+' · 全國'}｜單位：${result.metricUnit}${metric==='rate'?' · 本站計算':''}`;
    const denom=metric==='count'?'無（原始官方計數）':metric==='share'?(object==='cases'?`${region}全部案件 ${number(result.denominator)} 件`:`${age}全部案類、男女合計 ${number(result.denominator)} 人`):`${object==='cases'?region+'戶籍':age+'、'+sexNames[sex]}年中人口近似值 ${number(result.denominator)} 人；（2024 年底＋2025 年底）÷ 2`;
    el('qDenominator').textContent=`分母：${denom}${metric==='rate'?'。人口率並非個人犯罪機率。':''}`;
    el('qRowsNote').textContent=`${result.rows.length} 個統計項目。${object==='cases'?'51 類案件互不重複；「總計」與「暴力犯罪七案類」另列，不重複加總。':'明細保留合計與子項，可能重疊，請勿將各列相加。'} 占比與人口率依原始數值計算後顯示兩位小數。`;
    const max=metric==='share'?100:Math.max(0,...result.rows.map(r=>r.value??0));
    el('qChart').innerHTML=result.rows.length?result.rows.map(r=>`<div class="query-row"><span>${escape(r.name)}</span><div class="track" aria-hidden="true"><div class="fill ${sex==='total'?'':sex}" style="width:${max&&r.value!==null?r.value/max*100:0}%"></div></div><strong>${metric==='count'?number(r.count):value(r.value)} ${result.metricUnit}</strong></div>`).join(''):'<p class="no-results">沒有符合的結果，請調整犯罪類型或搜尋文字。</p>';
    el('qRows').innerHTML=result.rows.length?result.rows.map(r=>`<tr><td>${escape(r.name)}</td><td>${number(r.count)} ${result.unit}</td><td>${metric==='count'?number(r.count):value(r.value)} ${result.metricUnit}</td><td>${metric==='count'?'不適用':number(result.denominator)+(metric==='share'&&object==='cases'?' 件':' 人')}</td></tr>`).join(''):'<tr><td colspan="4">沒有符合的結果。</td></tr>';
  }
  el('qObject').addEventListener('change',sync);
  ['qRegion','qCrime','qAge','qSex','qMetric'].forEach(id=>el(id).addEventListener('change',render));el('qSearch').addEventListener('input',render);
  function setView(next){view=next;el('qChart').hidden=view!=='chart';el('qTable').hidden=view!=='table';for(const [id,v] of [['qChartButton','chart'],['qTableButton','table']]){el(id).classList.toggle('active',view===v);el(id).setAttribute('aria-pressed',String(view===v))}}
  el('qChartButton').onclick=()=>setView('chart');el('qTableButton').onclick=()=>setView('table');
  el('qDownload').onclick=()=>saveCsv('臺灣2025_資料查詢.csv',[['統計期間','對象','地區','年齡層','性別','案類','計數','計數單位','指標','指標值','指標單位','分母','計算說明','統計限制'],...result.rows.map(r=>['2025年全年',objectNames[selection.object],selection.region,selection.age,sexNames[selection.sex],r.name,r.count,result.unit,metricNames[selection.metric],r.value??'',result.metricUnit,selection.metric==='count'?'':result.denominator,el('qDenominator').textContent,el('qLimit').textContent])]);
  sync();
})();
