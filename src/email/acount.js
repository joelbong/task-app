const sgMail = require('@sendgrid/mail')

const sendgridApi = process.env.SENDGRID_API_KEY


sgMail.setApiKey(sendgridApi)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'joelbong@hotmail.com',
        subject: 'Welcome to the app',
        text: `Welcome to the app, ${name}. Let us know how you get allong with the app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'joelbong@hotmail.com',
        subject: 'Ooh..',
        text: `Hi, ${name}, are you leaving us..? :'(.`
    })
} 

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}