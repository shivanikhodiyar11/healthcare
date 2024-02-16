const nodemailer = require("nodemailer");
const { HOST, SMTP_PORT, SMTP_USER, PASS } = process.env;

const sendEmail = async (user, link) => {
  let transporter = nodemailer.createTransport({
    host: HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let info = await transporter.sendMail({
    from: `Hospital Management <${SMTP_USER}>`,
    to: [user.email, "ruchit.m.patel.302@gmail.com"],
    subject: "Email Verification",
    text: "Hello world?",
    html: `<div><b>Email Verification Link </b><a href="http://localhost:3000/token/verify/${link}" target="_blank">Verify</a></div>`,
  });

  console.log("Message sent: %s", info);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = { sendEmail };
