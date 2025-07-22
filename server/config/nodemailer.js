import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port:  587,
  secure: false, // use true only for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
export default transporter;
