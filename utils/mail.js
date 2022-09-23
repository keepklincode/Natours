const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

// new email(user, url).sendWelcome();
const data ={
    from: process.env.EMAIL_FROM,
    to: "keepklincode@gmail.com",
    subject: "Hello",
    text: "Testing some Mailgun awesomness!",
    html: "<h1>Testing some Mailgun awesomness!</h1>"
}
module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = `Chris Keepklin <${process.env.EMAIL_FROM}>`;
    };

   

    newTransport() {
        if (process.env.NODE_ENV === "production") {
            //   const sendMessage = client.messages.create(
            //     process.env.MAILGUN_DOMAIN_NAME, data
            //   );

            //   if(sendMessage){
            //       console.log("message sent")
            //   }else{
            //     console.log("message not sent") 
            //   }
             


            //Sendgrid
        //     return nodemailer.createTransport({
        //         service: "mailChimp",
        //         auth: {
        //             user: process.env.MAILCHIMP_USERID,
        //             api: process.env.MAILCHIMP_APIKEY
        //         }
        //     });
        // }

        // return nodemailer.createTransport({
        //     host: process.env.EMAIL_HOST,
        //     port: process.env.EMAIL_PORT,
        //     auth: {
        //         user: process.env.EMAIL_USERNAME,
        //         pass: process.env.EMAIL_PASSWORD
            
        //     }
        // });
    }

    //send actual email 
     send =  async(templete, subject) =>{
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
        // from: this.form,
        // to: this.to,
        // subject,
        // html,
        // text: htmlToText.fromString(html) 
        //text: htmlToText.fromString(html)    
        
        from: process.env.EMAIL_FROM,
        to: "keepklincode@gmail.com",
        subject: "Hello",
        text: "Testing some Mailgun awesomness!",
        html: "<h1>Testing some Mailgun awesomness!</h1>"
    };

    // 3) create a transort and send email
   // await this.newTransport().sendMail(mailOptions);
    const sendMessage = await client.messages.create(
        process.env.MAILGUN_DOMAIN_NAME, mailOptions
      );
      if(sendMessage){
          console.log("Sent email")
       
    }else( 
        console.log("Sent not email"))
   
    }
    
     

    // async sendPasswordReset() {
    //     await this.send("passwordReset", "Your password reset token (valid for 10 minutes)");
    // }
}
sendWelcome = async()=> {
    await this.send("welcome", "Welcome to the Natours Family!");
}
}; 
