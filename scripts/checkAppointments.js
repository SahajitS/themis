const puppeteer = require('puppeteer');
function checkAppointments(){
(async () => {
    const browser = await puppeteer.launch({ headkess: true });
    const page = await browser.newPage();
    await page.goto('https://www.etermin.net/stadt-duisburg-abh-homberg');

    await page.waitForSelector('#capvalue219676');
    await page.click('#capvalue219676');
    await page.waitForSelector('#bp1');
    await page.click('#bp1');

    try{

    await page.waitForSelector('.ui-datepicker-calendar', { timeout: 5000 });

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
    if(appointmetns.isEmpty()){
        return false;
    }else{
        return true;
    }
}

module.exports = checkAppointments;