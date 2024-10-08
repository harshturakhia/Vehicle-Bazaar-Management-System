const Bull = require('bull');
const nodemailer = require('nodemailer');


// Initialize Redis connection and Bull queue
const redisOptions = { host: '127.0.0.1', port: 6379 };
const emailQueue = new Bull('emailQueue', { redis: redisOptions });


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'tatva.dotnet.jaiminkumarbhojani@outlook.com', // replace with your email
        pass: 'Jaimin@12' // replace with your email password
    },
    tls: {
        rejectUnauthorized: false
    }
});


// Define a job processor for the email queue
emailQueue.process(async (job) => {
    const { email, subject } = job.data;

    const mailOptions = {
        from: 'tatva.dotnet.jaiminkumarbhojani@outlook.com',
        to: 'harshturakhia2002@gmail.com',
        subject: subject,
        text: `${job.data.text}`
    };

    job.log('Data fetching!')
    job.progress(25)

    try {
        console.log("Sending mail...!");
        job.progress(50)
        await transporter.sendMail(mailOptions)
            .then(() => {
                job.progress(75)
                job.log('Mail Sent!')
                job.progress(100)
                console.log(`Email sent to ${email}`);
            })
            .catch((error) => {
                console.error('Mail not sent with error:', error);
            })
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});


module.exports = emailQueue;
