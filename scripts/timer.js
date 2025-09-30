const nodemailer = require('nodemailer');
const checkAppointments = require('./checkAppointments');

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'taigerlenbiy@gmail.com',
        pass : 'kristall234'
    }
});

function sendEmailNotification(){
    const mailOptions = {
        from : 'taigerlenbiy@gmail.com',
        to : 'ripudumensingh@gmail.com',
        subject: 'Termin verfügbar',
        text: 'Termin ist da'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log('Fehler');
        }else{
            console.log('email gesendet:', info.response);
        }
    });

    function checkAndNotify(){
        const isAvailable = checkAppointments();

        if(isAvailable){
            sendEmailNotification();
        }
    }
}

setInterval(checkAndNotify, 10 * 60 * 1000);