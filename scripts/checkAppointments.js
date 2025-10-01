const puppeteer = require('puppeteer');
async function checkAppointments(){
    const browser = await puppeteer.launch({ headkess: true });
    const page = await browser.newPage();
    await page.goto('https://www.etermin.net/stadt-duisburg-abh-homberg');
try{
    
    await page.waitForSelector('#capvalue219676', { visible: true, timeout: 10000 });
    await page.click('#capvalue219676');
    console.log('✓ Erfolgreich geklickt!');
    
    await page.waitForSelector('#bp1', { visible : true });
    await page.click('#bp1');

    

    await page.screenshot({ path : 'pre-tab.png' , fullPage : true});
    
} catch(error){
    console.error('Element nicht gefunden', error);
    
    // Screenshot bei Fehler
    await page.screenshot({ 
        path: 'debug-error.png',
        fullPage: true
    });
    console.log('Screenshot gespeichert: debug-error.png');
    
    await browser.close();
    return false;
}

let allAppointments = [];

    try{

    await page.waitForSelector('.ui-datepicker-calendar', { timeout: 5000 });

    for(let month = 0; month < 3; month++){
        console.log(`Prüfe Monat ${month + 1}/3...`);
    

    const monthAppointmnets = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.ui-datepicker-calendar td span.ui-state-default.ui-state-active'))
        .map(row => row.textContent.trim());
    });

    await page.screenshot({ path : `tableStat${month}.png`, fullPage : true});
    allAppointments = allAppointments.concat(monthAppointmnets);

    if(month < 2){
        console.log("Klicke auf nächsten Monat");
        await page.waitForSelector('a[aria-label = "Nächstes Monat"]', { visible : true});
        await page.click('a[aria-label="Nächstes Monat"]');
        }
    }

    console.log('Verfügbare Termine: ', allAppointments);
    await page.screenshot({ path : 'tab.png', fullPage : true});

    if(allAppointments.length === 0){
        await browser.close();
        return {available : true, appointments : []};
    }else{
        await browser.close();
        return {available : false, appointments : allAppointments};
    }

}   catch(error){
    console.error('Element nicht gefunden', error);
    await browser.close();
    return false;

}}

module.exports = checkAppointments;