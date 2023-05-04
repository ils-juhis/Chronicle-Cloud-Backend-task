const nodemailer = require("nodemailer");

const sendBillEmail = async(customerID, billID, billType, unit, month, year, amount, email, meterNo, dueDate, emailType)=>{

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

  let emailMessage;
  if(emailType==="billGeneration"){
    emailMessage=`<div style="border: 1px solid gray; padding: 10px;">
    <h4  style='text-align:center; color:gray'>
    Electricity Bill Management System 
  </h4>
  <div>
    <div style='text-align:right; color:red'>DOG: ${new Date().toLocaleDateString()}</div>
    <br>
    <div><b>Bill Number:</b> ${billID}</div>
    <div><b>Bill Type:</b> ${billType}</div>
    <div><b>CustomerID:</b> ${customerID}</div>
    <div><b>Meter Number:</b> ${meterNo}</div>
    <div><b>Month & Year:</b> ${month}-${year}</div>
    <div><b>Total Units:</b> ${unit} W</div>
    <div><b>Amount:</b> Rs. ${amount}</div>
    <div><b>Due Date:</b> ${dueDate}</div>
  </div>
  </div>`
  }else{
    emailMessage=`<div style="border: 1px solid gray; padding: 10px;">
    <h6  style='text-align:center; color:red'>
    * Please pay the electricity bill. Tomorrow is last date.*
  </h6>
    <h4  style='text-align:center; color:gray'>
    Electricity Bill Management System 
  </h4>
  <div>
    <div style='text-align:right; color:red'>DOG: ${new Date().toLocaleDateString()}</div>
    <br>
    <div><b>Bill Number:</b> ${billID}</div>
    <div><b>Bill Type:</b> ${billType}</div>
    <div><b>CustomerID:</b> ${customerID}</div>
    <div><b>Meter Number:</b> ${meterNo}</div>
    <div><b>Month & Year:</b> ${month}-${year}</div>
    <div><b>Total Units:</b> ${unit} W</div>
    <div><b>Amount:</b> Rs. ${amount}</div>
    <div><b>Due Date:</b> ${dueDate}</div>
  </div>
  </div>`
  }

  // send mail with defined transport object
  let sendMailNow = await transporter.sendMail({
    from: "ebms@gmail.com", // sender address
    to: email, // list of receivers
    subject: `Electricity bill of ${month}/${year}`, // Subject line
    html: emailMessage, // html body
  });

  console.log(sendMailNow)

  console.log("Message sent: %s", sendMailNow.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(sendMailNow));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = {sendBillEmail};
