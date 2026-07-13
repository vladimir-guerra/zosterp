import {
  createTransport,
  createTestAccount,
  getTestMessageUrl,
} from "nodemailer";

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.NODE_ENV === "production") {
    transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    const testAccount = await createTestAccount();
    transporter = createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }
  return transporter;
}

export const sendMail = async (to, subject, html) => {
  const transport = await getTransporter();
  const from = `"Zosterp" <${process.env.SMTP_USER || "noreply@zosterp.com"}>`;
  const info = await transport.sendMail({ from, to, subject, html });
  if (process.env.NODE_ENV !== "production")
    console.log(`Preview URL: ${getTestMessageUrl(info)}`);
  return info;
};
