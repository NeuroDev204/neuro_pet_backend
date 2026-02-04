import nodemailer from "nodemailer";
import { env } from "./env.config";

/**
 * Mail Transporter Configuration
 */
export const mailTransporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: false,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: env.mail.user,
    pass: env.mail.pass,
  },
});