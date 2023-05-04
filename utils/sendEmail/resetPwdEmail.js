const nodemailer = require("nodemailer");

const resetPwdEmail = async(email, id, token)=>{

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


  // send mail with defined transport object
  let sendMailNow = await transporter.sendMail({
    from: "ebms@gmail.com", // sender address
    to: email, // list of receivers
    subject: `Reset Password link`, // Subject line
    html: `<div style="border: 1px solid gray; padding: 10px;">
    <h4  style='text-align:center; color:gray'>
    Electricity Bill Management System 
  </h4>
  <div>Please click on the button to reset password.
      <br>
      <span style="font-size: 12px; color:red"> * Link is active for 1 hour only. *</span>
  </div>
  <div style='text-align:center; margin: 20px;'>
    <br>
    <a href="http://localhost:3000/reset-password/${id}/${token}" style="text-decoration:none; color: white; background-color: #764ABC; padding: 10px; font-size: 13px;  border-radius: 5px; font-family: 'Open Sans', sans-serif;"><b>Reset Password</b></a>
  </div>
  </div>`, // html body

  }, (error, result) => {
    if (error) return false;

    console.log("Message sent: %s", sendMailNow.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(sendMailNow));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });

  return true;

}

module.exports = {resetPwdEmail};
