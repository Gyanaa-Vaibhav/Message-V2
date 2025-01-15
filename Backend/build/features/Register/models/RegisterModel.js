// Placeholder for the Register model
// Currently empty; add schema or logic here as needed
import nodemailer from "nodemailer";
import { getUser } from "../../../shared/DataBase/dbExports.js";
import crypto from "crypto";
import CryptoJS from "crypto-js";
async function checkUser(email, username) {
    const [user] = await getUser({ email, username });
    if (user) {
        if (user.email === email) {
            return { success: false, message: 'User already exists please login' };
        }
        if (user.username === username) {
            return { success: false, message: 'User already exists please login', username: true };
        }
        return;
    }
}
function genSalts() {
    const salt1 = crypto.randomBytes(128);
    const salt2 = crypto.randomBytes(128);
    const salt3 = crypto.randomBytes(128);
    return `${salt1.toString('hex')}${salt2.toString('hex')}${salt3.toString('hex')}`;
}
function sendSaltsEmail(concatenatedSalts, userEmail, userName) {
    // Configure the transporter
    const date = new Date().getFullYear();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gynanrudr0@gmail.com',
            pass: 'degp cwmo igqd ikyc' // Be cautious with app passwords
        }
    });
    // Email details
    const mailOptions = {
        from: 'gynanrudr0@gmail.com',
        to: 'samd11.2.2005@gmail.com', // Receiver address TODO change to userEmail after testing
        subject: 'Welcome to MessageINC - Your Super Secret Key', // Subject line
        html: `
                    <div style="font-family: Arial, sans-serif; background-color: var(--background-primary); color: var(--accent-colour); padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                        <header style="text-align: center; padding-bottom: 20px;">
                            <h1 style="color: var(--secondary-colour); margin: 0;">MessageINC</h1>
                            <p style="font-size: 16px; color: var(--accent-colour);">Your Anynomous secure communication platform</p>
                        </header>
                        <main>
                            <p style="font-size: 16px; line-height: 1.6; color: var(--accent-colour);">
                                Hi ${userName},
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; color: var(--accent-colour);">
                                Welcome to <strong>MessageINC</strong>! Below are your unique Secret Keys. Please keep these secure, as they are critical for your encryption keys.
                            </p>
                            <div style="background-color: var(--background-secondary-hover); padding: 15px; border-radius: 8px; color: var(--secondary-colour); margin: 20px 0; word-wrap: break-word; font-family: monospace;">
                            ${concatenatedSalts}
                            </div>
                            <p style="font-size: 14px; line-height: 1.6; color: var(--accent-colour);">
                                Make sure to store these securely. If you lose them, recovering your encrypted messages may not be possible.
                            </p>
                        </main>
                        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid var(--background-secondary-hover); color: var(--accent-colour); font-size: 12px;">
                            <p style="margin: 0;">MessageINC &copy; ${date}. All rights reserved.</p>
                            <p style="margin: 0;"><a href="#" style="color: var(--secondary-colour-hover); text-decoration: none;">Contact Support</a></p> // TODO Add support Link
                        </footer>
                    </div>
                `,
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error while sending email: ', error);
        }
        console.log('Email sent: ' + info.response);
    });
}
function encryptPrivateKey(privateKey, string) {
    return CryptoJS.AES.encrypt(privateKey, string).toString();
}
export { sendSaltsEmail, checkUser, genSalts, encryptPrivateKey };
