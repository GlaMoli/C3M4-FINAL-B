import nodemailer from 'nodemailer';

const sendResetEmail = async (userEmail, resetUrl) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: '"Soporte CineApp" <noreply@cineapp.com>',
        to: userEmail,
        subject: 'Recuperación de Contraseña',
        html: `<p>Para restablecer tu contraseña, haz clic aquí: <a href="${resetUrl}">${resetUrl}</a></p>`
    });
};

export default sendResetEmail;