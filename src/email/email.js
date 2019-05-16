

const sg = require('@sendgrid/mail')
sg.setApiKey(process.env.SENDGRID_API_KEY)
const welcomeMail = (name, email)=>{
    sg.send({
        to: email,
        from:'spd30062@gmail.com',
        subject: 'Welcome to Task APP',
        text: `Hello ${name}!! Welcome to task app. Write to us anytime for any suggestions.`
    })
}  

const cancellationMail = (name, email)=>{
    sg.send({
        to: email,
        from:'spd30062@gmail.com',
        subject: 'See you soon in TaskApp',
        text: `Hello ${name}!! We are sorry to see you go. Hope to see you back soon.`
    })
}

module.exports = {
    welcomeMail,
    cancellationMail
}