import cheerio from 'cheerio';
import axios from 'axios';

export default async function handler(req, res){
    try{
        const response = await axios.get('URL_DER_BÜRGERAMT_SEITE');
        const $ = cheerio.load(response.data);

        const appointments = [];
        $('.appointments-class').each((index, element) =>{
            const data = $(element).find('data-class').text();
            const time = $(element).find('.time-class').text();
            appointments.push({date, time});
        });

        if(appointments.length > 0){
            //Logik zum Senden einer email
        }

        res.status(200).json({ success : true, appointments});
    }   catch (error){
        console.error('Fehler beim Abrufen der Termine:', error);
        res.status(500).json({ success: false, error: 'Fehler beim Abrufen der Termine'});
    }
   }
