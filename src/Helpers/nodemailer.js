const nodemailer = require("nodemailer");
const emailTemplate = require("./Template.js");
const transporter = nodemailer.createTransport({
  service: "gmail",
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
    html: emailTemplate(opt , userEmail),
  });
  return info;
}

module.exports = { sendMail };
