const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Pfad zur lokalen HTML-Datei
  const filePath = path.resolve(__dirname, 'mockCalendar.html');
  await page.goto(`file://${filePath}`);

  // Beispiel: Warte auf ein Element in der Datei
  

  // Führe Aktionen auf der Seite aus
  try{

    await page.waitForSelector('.ui-datepicker-calendar');

    const appointments = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.ui-datepicker-calendar td span.ui-state-default.ui-state-active'))
        .map(row => row.textContent.trim());
    });

    console.log('Verfügbare Termine: ', appointments);
}   catch(error){
    console.error('Element nicht gefunden', error);
}

  await browser.close();
})();