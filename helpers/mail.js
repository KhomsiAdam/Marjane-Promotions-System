// Nodemailer
const nodemailer = require("nodemailer");

module.exports = async function mail(email, password) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Marjane Supermarkets" <${testAccount.user}>`,
        to: email,
        subject: "Login credentials",
        text: "Login credentials",
        html: `<p><strong>email:</strong> ${email}</p><p><strong>password:</strong> ${password}</p>`
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// main(data).catch(console.error);