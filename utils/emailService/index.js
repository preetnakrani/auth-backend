const nodemailer = require("nodemailer");
const loadTemplate = require("./template-emails");

const tranporter = nodemailer.createTransport({
  host: process.env.emailHost,
  port: process.env.emailPort,
  secure: true, // use SSL
  auth: {
    user: process.env.emailID,
    pass: process.env.emailPass,
  },
});

const getTemplate = async (path, context) => {
  let email = await loadTemplate(path, context);
  return email;
};

const transportEmail = async (email) => {
  await tranporter.sendMail(email);
};

const sendEmail = async (path, context, to) => {
  let templateObj = await getTemplate(path, context);
  let emailSettings = {
    ...templateObj,
    to: to,
    from: `"${process.env.senderName}" <${process.env.emailID}>`,
  };
  await transportEmail(emailSettings);
};

module.exports = sendEmail;
