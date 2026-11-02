/* Pure adapter over unchanged official aggregates. No synthetic cross-tabs. */
const QUERY_MODEL = Object.freeze({
  capabilities(object){return {demographics:object!=='cases',region:object==='cases',rate:object!=='victims'}},
  crimes(object){return object==='cases'?['總計',...DATA.events.map(r=>r.name),'暴力犯罪七案類']:DATA[object]['全體'].map(r=>r.name)},
  ages(object){return object==='cases'?['不適用']:Object.keys(DATA[object])},
  run(selection){
    const {object,region,age,sex,metric,crime,search=''}=selection;
    if(!['suspects','victims','cases'].includes(object))throw Error('查詢對象不支援');
    if(!['count','share','rate'].includes(metric))throw Error('指標不支援');
    let records,denominator,unit=object==='cases'?'件':'人';
    if(object==='cases'){
      if(age!=='不適用'||sex!=='total')throw Error('案件彙總不支援年齡與性別交叉查詢');
      const county=COUNTY_DATA.counties.find(c=>c.name===region);
      if(region!=='全國'&&!county)throw Error('地區不支援');
      records=county?Object.entries(county.cases).map(([name,count])=>({name,count})): [{name:'總計',count:COUNTY_DATA.nationalCases},...DATA.events.map(r=>({name:r.name,count:r.total})),{name:'暴力犯罪七案類',count:503}];
      denominator=metric==='rate'?(county?county.population:EXTENDED.rates[0].population.total):(county?county.cases['總計']:COUNTY_DATA.nationalCases);
    }else{
      if(region!=='全國')throw Error('現有縣市資料未提供年齡與性別交叉表');
      if(!['total','male','female'].includes(sex)||!DATA[object][age])throw Error('年齡或性別不支援');
      if(object==='victims'&&metric==='rate')throw Error('被害人年齡分組沒有適用人口分母');
      const original=DATA[object][age];records=original.map(r=>({name:r.name,count:r[sex]}));
      denominator=metric==='rate'?EXTENDED.rates.find(r=>r.age===age)?.population[sex]:original[0].total;
    }
    if(!QUERY_MODEL.crimes(object).includes(crime)&&crime!=='全部案類')throw Error('犯罪類型不支援');
    if(metric==='rate'&&(!Number.isFinite(denominator)||denominator<=0))throw Error('此分組缺少適用人口分母');
    records=records.filter(r=>(crime==='全部案類'||r.name===crime)&&r.name.includes(search.trim()));
    const metricUnit=metric==='share'?'%':metric==='rate'?`${unit}／10萬人口`:unit;
    return {unit,metricUnit,denominator,rows:records.map(r=>({...r,value:EXPLORER_MATH.value(r.count,denominator,metric)}))};
  }
});
