const nodemailer = require("nodemailer");



async function sendEmail(options) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

    const message = {
        from: process.env.FROM_NAME, // sender address
        to: options.email,
        subject: options.subject,
        text: options.message
      }
  // send mail with defined transport object
  let info = await transporter.sendMail(message);
}

module.exports = sendEmail