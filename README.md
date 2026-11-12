# 臺灣犯罪觀察｜2025

以警政署公開統計整理臺灣 2025 年刑事案件、犯罪嫌疑犯、被害人與各縣市資料，並提供 2017–2025 年暴力犯罪趨勢。網站使用 HTML、CSS 和原生 JavaScript，可直接部署至 GitHub Pages。

- [第五版｜資料平台](https://xun512.github.io/2025-/index.html)
- [第四版｜長頁報告](https://xun512.github.io/2025-/v4.html)

## 網站功能

- **年度總覽與查詢**：查看案件分布，依資料可用範圍篩選案類、年齡或性別。第五版另有獨立查詢工作區。
- **年齡與性別**：查看嫌疑犯與被害人的分布，以及每十萬人口的犯罪嫌疑犯人數。
- **歷年暴力犯罪**：第四版與第五版共用 2017–2025 年資料。可切換指標查看七類案件的發生數、總破獲數或嫌疑犯人數，也可選擇年份查看每一案類的男性、女性嫌疑犯及被害人人數。
- **縣市地圖與自由比較**：查看 22 縣市警察機關別案件統計，或比較兩組條件的統計數字。
- **版本切換與下載**：頁首可切換第四版、第五版及顯示主題。歷年暴力犯罪與性別明細各有 CSV 下載按鈕。

## 如何解讀統計

- **2017 年 1 月**起，暴力犯罪項下的「強制性交」排除「對幼性交」。[警政統計月報表 3 附註](https://www.npa.gov.tw/ch/app/data/doc?detailNo=949193398038827008&module=wg055&type=s#page=27)
- **2020 年 6 月 19 日**起，未滿 12 歲兒童不再列入警方受理、處理的刑事案件件數及查獲嫌疑犯人數統計。[警政署統計表附註](https://wwwcdn.npa.gov.tw/ch/app/data/doc?detailNo=816231117882421248&module=wg063&type=s)
- **2024 年 9 月**起，部分案件改按被害人計數。2024 年全年涵蓋兩種口徑，與 2025 年的件數差異可能同時反映案件變化與計數方式變動。[警政工作年報](https://www.npa.gov.tw/ch/app/data/doc?detailNo=1452952881236807680&module=wg031&type=s) · [2025 年暴力犯罪通報](https://www.npa.gov.tw/ch/app/data/doc?detailNo=1508721510041260032&module=wg057&type=s)
- **2023 年的資料版本**：性別原表的暴力犯罪嫌疑犯合計為 826 人，月報年度表為 819 人。網站在各表中保留其來源數值。[嫌疑犯性別原表](https://data.gov.tw/dataset/176673) · [警政統計月報表 3](https://www.npa.gov.tw/ch/app/data/doc?detailNo=949193398038827008&module=wg055&type=s#page=25)

案件以件計，嫌疑犯與被害人以人計。性別表呈現兩組各自的分布，無法由此推算個案中的嫌疑犯與被害人配對。縣市地圖採警察機關別統計，實際案發地與當事人居住地可能不同。

## 資料來源

| 資料 | 來源 |
| --- | --- |
| 2025 年全般刑案、嫌疑犯及被害人 | [警政署重要統計結果表](https://www.npa.gov.tw/ch/app/data/view?id=2217&module=wg056&serno=fbf5a752-9c50-4eb1-a3ac-8d4f7112c70a) |
| 2017–2025 年暴力犯罪年度數值 | [警政署《警政統計月報》表 3](https://www.npa.gov.tw/ch/app/data/doc?detailNo=949193398038827008&module=wg055&type=s#page=25) |
| 2017–2024 年各案類男女數量 | [嫌疑犯按性別分](https://data.gov.tw/dataset/176673) · [被害人按年齡別分，取男女總計欄](https://data.gov.tw/dataset/176672) |
| 2025 年暴力犯罪男女數量 | [警政署 114 年暴力犯罪通報](https://www.npa.gov.tw/ch/app/data/doc?detailNo=1508721510041260032&module=wg057&type=s) |
| 人口分母 | [內政部戶籍人口統計](https://data.gov.tw/dataset/14226) |
| 地圖邊界 | [taiwan-atlas](https://github.com/dkaoster/taiwan-atlas) · [地圖授權](map-license.txt) |

## 本機預覽與部署

下載或解壓完整網站後，在 `index.html` 所在目錄執行：

```bash
python -m http.server 8000
```

在瀏覽器開啟 `http://localhost:8000/` 可預覽第五版，開啟 `http://localhost:8000/v4.html` 可預覽第四版。

部署時將 `index.html`、`v4.html`、同層 JavaScript 與 CSS、`map-license.txt` 和 `.nojekyll` 一起放入 GitHub Pages 的發布目錄。在儲存庫的 **Settings → Pages** 選擇對應分支與目錄。兩版以相對路徑共用歷年資料與圖表程式，請保留檔名與目錄結構。

## 主要檔案

| 檔案 | 用途 |
| --- | --- |
| `index.html`、`v4.html` | 第五版資料平台與第四版長頁報告 |
| `data.js`、`extended-data.js`、`county-data.js` | 2025 年案件、人數、人口與縣市資料 |
| `violence-history.js`、`violence-history.css` | 兩版共用的歷年暴力犯罪圖表與樣式 |
| `violent-sex-data.js`、`violent-sex.js` | 歷年性別數據、年份選擇及 CSV 匯出 |
| `version-switch.js`、`version-switch.css` | 版本切換與導覽樣式 |
