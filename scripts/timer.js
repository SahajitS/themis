const nodemailer = require('nodemailer');
const checkAppointments = require('./checkAppointments');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'taigerlenbiy@gmail.com',
        pass : 'xqgo uvvo sscs drcu'
    }
});

function sendEmailNotification(appointments){
    const appointmentsText = appointments.join(', ');

    const mailOptions = {
        from : 'taigerlenbiy@gmail.com',
        to : 'ripudumensingh@gmail.com',
        subject: 'Termin verfügbar',
        text: `Termine sind verfügbar!\n\nVerfügbare Termine: ${appointmentsText}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
        }else{
            console.log('email gesendet:', info.response);
        }
    });
}

async function checkAndNotify(){
    const isAvailable = await checkAppointments();
    
    console.log('Sind Termine verfügbar?', isAvailable.available);
    
    if(isAvailable.available){
        console.log('Sende E-Mail...');
        sendEmailNotification(isAvailable.appointments);
    } else {
        console.log('Keine Termine verfügbar, keine E-Mail gesendet');
    }
}

setInterval(checkAndNotify, 10 * 60 * 1000);