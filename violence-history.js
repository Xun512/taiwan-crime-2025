(() => {
  const table = document.getElementById('violentHistoryTable');
  const metric = document.getElementById('violentHistoryMetric');
  const chart = document.getElementById('violentHistoryBars');
  const headers = Array.from(table.tHead.rows[0].cells, cell => cell.textContent);
  const rows = Array.from(table.tBodies[0].rows, row =>
    Array.from(row.cells, cell => cell.textContent));

  function renderChart() {
    const column = Number(metric.value);
    const values = rows.map(row => Number(row[column].replaceAll(',', '')));
    const maximum = Math.max(1, ...values);
    const unit = column === 10 ? '人' : '件';
    chart.replaceChildren(...rows.map(([year], index) => {
      const row = document.createElement('div');
      row.className = 'violent-history-bar';
      const label = document.createElement('span');
      label.textContent = year === '2024' ? '2024（轉換年）' : year;
      const track = document.createElement('div');
      track.className = 'track';
      track.setAttribute('aria-hidden', 'true');
      const fill = document.createElement('div');
      fill.className = 'fill';
      fill.style.width = `${values[index] / maximum * 100}%`;
      track.append(fill);
      const value = document.createElement('strong');
      value.textContent = `${rows[index][column]} ${unit}`;
      row.append(label, track, value);
      return row;
    }));
    chart.setAttribute('aria-label', `歷年${headers[column]}（${unit}）`);
  }

  metric.addEventListener('change', renderChart);
  document.getElementById('violentHistoryDownload').addEventListener('click', () => {
    const csvHeaders = ['年度', ...headers.slice(1, 10).map(label => `${label}（件）`), '嫌疑犯（人）', '口徑變動'];
    const csvRows = rows.map(row => row.map((value, index) =>
      index > 0 && index < 11 ? value.replaceAll(',', '') : value));
    saveCsv('臺灣2017-2025_暴力犯罪歷年統計.csv', [csvHeaders, ...csvRows]);
  });
  renderChart();
  document.getElementById('violentHistoryControls').hidden = false;
})();
