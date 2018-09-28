// mail.ts
import * as nodemailer from 'nodemailer';


export function sendEmail (from, to, subject, html) {

  const transporter = nodemailer.createTransport({
    name: 'kosyas',
    host: 'localhost', // host address
    port: 25,  // mostly same number, rarely changes
    secure: false // true for 465, false for other ports

  });


  const mailOptions = {
    from: from, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
}


