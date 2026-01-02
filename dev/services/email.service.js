const { sendToQueue, createConsumer } = require('../config/rabbitmq');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const EMAIL_QUEUE = 'email_notifications';
let transporter = null;

const createTransporter = async () => {
    if (transporter) return transporter;

    try {
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        logger.info(`Email transporter created: ${testAccount.user}`);
        return transporter;
    } catch (error) {
        logger.error('Failed to create email transporter:', error);
        throw error;
    }
};

const sendEmailNotification = async (emailData) => {
    try {
        await sendToQueue(EMAIL_QUEUE, emailData);
        logger.info(`Email queued for: ${emailData.to}`);
        return true;
    } catch (error) {
        logger.error('Failed to queue email:', error);
        throw error;
    }
};

const startEmailConsumer = async () => {
    await createTransporter();

    const consumer = createConsumer(EMAIL_QUEUE, async (msg) => {
        const emailData = msg.body;
        logger.info(`Processing email to: ${emailData.to}`);

        try {
            const info = await transporter.sendMail({
                from: '"FundooNotes" <noreply@fundoonotes.com>',
                to: emailData.to,
                subject: emailData.subject,
                text: emailData.message,
                html: `<p>${emailData.message}</p>`
            });

            logger.info(`Email sent: ${info.messageId}`);
            logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        } catch (error) {
            logger.error('Failed to send email:', error);
        }
    });

    consumer.on('error', (err) => {
        logger.error('Email consumer error:', err);
    });

    logger.info('Email consumer started and ready to send emails');
    return consumer;
};

module.exports = { sendEmailNotification, startEmailConsumer };