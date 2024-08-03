require("dotenv").config();
import { google } from "googleapis";
import nodemailer from "nodemailer";

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN as string;
const USER_EMAIL = process.env.USER_EMAIL as string;

const createTransporter = async () => {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const accessToken = await new Promise<string>((resolve, reject) => {
      oAuth2Client.getAccessToken((error, token) => {
        if (error) {
          reject(error);
        }
        resolve(token as string);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    return transporter;
  } catch (err) {
    throw err;
  }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const emailConfig = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Reset Password",
    html: `<h1>Reset Your Password</h1>
           <p>Click on the following link to reset your password:</p>
           <a href="http:localhost//4000/resetpassword">Reset Password</a>
           <p>The link will expire in 10 minutes.</p>
           <p>If you didn't request a password reset, please ignore this email.</p>`,
  };

  try {
    const mailTransporter = await createTransporter();
    await mailTransporter.sendMail(emailConfig);
    return {
      status: 200,
      message: "Reset password email has been sent.",
    };
  } catch (error) {
    console.log(`Transporter: ${error}`);
    return {
      status: 500,
      message: "Failed to send reset password email.",
    };
  }
};
