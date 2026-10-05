import nodemailer from 'nodemailer';

interface EmailPayloads {
    recipient: string;
    subject: string;
    text: string;
}


export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendEmail = async ({ recipient, subject, text }: EmailPayloads) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })
    await transporter.sendMail({
        from: `Developer Hiring <${process.env.MAIL_USER}>`,
        to: recipient,
        subject: subject,
        text: text
    })
}