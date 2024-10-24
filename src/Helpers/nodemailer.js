const nodemailer = require("nodemailer");
const emailTemplate = require("./Template.js");
const transporter = nodemailer.createTransport({
  service: true,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

async function sendMail(userEmail, opt) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Verify Your Eamil ✔",
    html: emailTemplate(opt),
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports = { sendMail };
