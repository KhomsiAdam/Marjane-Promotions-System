// Nodemailer
const nodemailer = require("nodemailer");

module.exports = async function mail(email, password) {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

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