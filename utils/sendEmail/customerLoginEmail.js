const nodemailer = require("nodemailer");

const customerLoginEmail = async(name, email, password)=>{

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //   let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL, // generated ethereal user
      pass: process.env.NODEMAILER_PASS, // generated ethereal password
    },
  });


  let sendMailNow = await transporter.sendMail({
    from: "ebms@gmail.com", // sender address
    to: email, // list of receivers
    subject: `Credentials for EBMS`, // Subject line
    html: `<div style="border: 1px solid gray; padding: 10px;">
    <h4  style='text-align:center; color:gray'>
    Electricity Bill Management System 
  </h4>
  <div>Dear ${name}, Here are your credentials for Electricity Bill Management System</div>
  <div style='text-align:center;'>
    <br>
    <div><b>Email:</b> ${email}</div>
    <div><b>Password:</b> ${password}</div>
  </div>
  </div>`, // html body
  });

  console.log("Message sent: %s", sendMailNow.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(sendMailNow));
}

module.exports = {customerLoginEmail};
