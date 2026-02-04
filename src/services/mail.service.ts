import { mailTransporter } from "../config/mail.config";
import { env } from "../config/env.config";

export class MailService {
  static async sendVerifyOtp(to: string, otp: string) {
    const info = await mailTransporter.sendMail({
      from: env.mail.from,
      to,
      subject: "Verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });
    return info;
  }
}