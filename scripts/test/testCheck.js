const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  // Für lokale Tests auf Windows: verwende Chrome/Chromium vom System
  let executablePath;
  
  // Versuche verschiedene Chrome-Pfade auf Windows
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  
  // Finde den ersten verfügbaren Browser
  const fs = require('fs');
  for (const chromePath of possiblePaths) {
    if (fs.existsSync(chromePath)) {
      executablePath = chromePath;
      break;
    }
  }
  
  if (!executablePath) {
    console.error('Kein Chrome/Edge Browser gefunden! Bitte installiere Chrome oder Edge.');
    process.exit(1);
  }
  
  console.log('Verwende Browser:', executablePath);

  const browser = await puppeteer.launch({ 
    executablePath: executablePath,
    headless: false, // Für Tests sichtbar machen
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
    ]
  });
  const page = await browser.newPage();

  // Pfad zur lokalen HTML-Datei
  const filePath = path.resolve(__dirname, 'mockCalendar.html');
  await page.goto(`file://${filePath}`);

  // Beispiel: Warte auf ein Element in der Datei
  

  // Führe Aktionen auf der Seite aus
  try{
    let allAppointments = [];

    // Teste alle 3 Monate (wie im echten Code)
    for(let month = 0; month < 3; month++){
        console.log(`Prüfe Monat ${month + 1}/3...`);

        await page.waitForSelector('.ui-datepicker-calendar');

        const monthAppointments = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.ui-datepicker-calendar td span.ui-state-default.ui-state-active'))
            .map(row => row.textContent.trim());
        });

        
        allAppointments = allAppointments.concat(monthAppointments);

        // Navigiere zum nächsten Monat (außer beim letzten Monat)
        if(month < 2){
            console.log("Klicke auf nächsten Monat");
            await page.waitForSelector('button[aria-label="Nächstes Monat"]', { visible: true});
            await page.click('button[aria-label="Nächstes Monat"]');
            
            // Warte kurz, damit die Seite sich aktualisiert
            
        }
    }

    console.log('Alle verfügbaren Termine:', allAppointments);
    console.log('Anzahl gefundener Termine:', allAppointments.length);

}   catch(error){
    console.error('Element nicht gefunden', error);
}

  await browser.close();
})();