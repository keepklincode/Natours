const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

// new email(user, url).sendWelcome();

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = `Chris Keepklin <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === "production") {
            //Sendgrid
            return nodemailer.createTransport({
                service: "MailGun",
                auth: {
                    user: process.env.MAILGUN_USERNAME,
                    pass: process.env.MAILGUN_PASSWORD
                }
            })
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            
            }
        });
    }

    //send actual email 
    async send(templete, subject) {
    //1) render html based on pug templete

    const html = pug.renderFile(
        `${__dirname}/../views/email/${templete}.pug`, 
    {
        firstName: this.firstName,
        url: this.url,
        subject
    });

    // 2) Define email options
    const mailOptions = {
        from: this.form,
        to: this.to,
        subject,
        html,
        text: htmlToText.fromString(html) 
        //text: htmlToText.fromString(html)       
    };

    // 3) create a transort and send email
    await this.newTransport().sendMail(mailOptions);
    }
    async sendWelcome() {
        await this.send("welcome", "Welcome to the Natours Family!");
    }

    async sendPasswordReset() {
        await this.send("passwordReset", "Your password reset token (valid for 10 minutes)");
    }
}; 
