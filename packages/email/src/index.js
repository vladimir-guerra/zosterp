import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from "nodemailer";

const testAccount = await createTestAccount();

export const transporter = createTransport({
  host: testAccount.smtp.host,
  port: testAccount.smtp.port,
  secure: testAccount.smtp.secure,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `Zosterp Admin <${testAccount.user}>`,
    to,
    subject,
    html,
  });

  const data = { info };
  if (process.env.NODE_ENV === "development") {
    const messageUrl = await getTestMessageUrl(info);
    console.log(`Message sent: ${info.messageId}\nMessage URL: ${messageUrl}`);
    data.url = messageUrl;
  }

  return data;
};
