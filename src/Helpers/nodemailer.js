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

async function sendMail(userEmail, opt, msg) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: userEmail,
    subject: msg || "Verify Your email ✔",
    html: emailTemplate(opt, userEmail),
  });
  return info;
}

module.exports = { sendMail };
