import nodeTransport from "./nodemailer.js";

const sendConfirmMail = async (userEmail, emailToken) => {
  const confirmUrl = `${process.env.FRONTEND_URL}email/verify/${emailToken}`;

  return await nodeTransport.sendMail({
    from: "NUS - Photobook", // sender address
    to: userEmail, // list of receivers
    subject: "Confirm email address", // Subject line
    text: "Please click the button to confirm your email address", // plain text body
    html: `<a href=${confirmUrl}>Click here<a>`, // html body
  });
};

export default { sendConfirmMail };
