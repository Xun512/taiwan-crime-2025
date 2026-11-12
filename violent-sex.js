(() => {
  const yearSelect = document.getElementById('violentSexYear');
  const tbody = document.getElementById('violentSexRows');
  const caption = document.getElementById('violentSexCaption');
  const note = document.getElementById('violentSexNote');
  const published2025 = EXTENDED.violence.map(({name, suspects, victims}) =>
    [name, suspects.male, suspects.female, victims.male, victims.female]);
  const records = {...VIOLENT_SEX_HISTORY, 2025: published2025};
  const years = Object.keys(records).sort((a, b) => Number(b) - Number(a));
  const versionNote = '2023 年性別原表的嫌疑犯合計為 826 人，同頁《警政統計月報》年度表為 819 人。兩表各依來源呈現。';

  function withTotal(rows) {
    const total = [0, 0, 0, 0];
    rows.forEach(([, ...counts]) => counts.forEach((count, index) => {
      total[index] += count;
    }));
    return [['七類合計', ...total], ...rows];
  }

  function render() {
    const year = yearSelect.value;
    caption.textContent = `${year} 年（單位：人）`;
    note.textContent = year === '2023' ? versionNote : '';
    note.hidden = year !== '2023';
    tbody.replaceChildren(...withTotal(records[year]).map(([name, ...counts]) => {
      const row = document.createElement('tr');
      const heading = document.createElement('th');
      heading.scope = 'row';
      heading.textContent = name;
      row.append(heading);
      counts.forEach(count => {
        const cell = row.insertCell();
        cell.textContent = fmt(count);
      });
      return row;
    }));
  }

  years.forEach(year => yearSelect.add(new Option(`${year} 年`, year)));
  yearSelect.value = '2024';
  yearSelect.addEventListener('change', render);
  document.getElementById('violentSexDownload').addEventListener('click', () => {
    const headers = ['年度', '案類', '男性嫌疑犯（人）', '女性嫌疑犯（人）', '男性被害人（人）', '女性被害人（人）', '來源說明'];
    const rows = years.flatMap(year => withTotal(records[year]).map(row => [
      year, ...row,
      year === '2025' ? '警政署 114 年暴力犯罪通報' :
        year === '2023' ? versionNote : '警政署開放資料 176673、176672',
    ]));
    saveCsv('臺灣2017-2025_暴力犯罪_嫌疑犯與被害人性別.csv', [headers, ...rows]);
  });
  render();
})();
