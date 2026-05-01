import { MailerOptions } from '@nestjs-modules/mailer';

function getRequiredEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`${key} is required for mailer configuration`);
  }
  return value;
}

const nodeMailerUser = getRequiredEnv('NODE_MAILER_USER');
const nodeMailerPass = getRequiredEnv('NODE_MAILER_PASS');

export const mailerConfig: MailerOptions = {
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: nodeMailerUser,
      pass: nodeMailerPass,
    },
  },
  defaults: {
    from: `"PMS Backend" <${nodeMailerUser}>`,
  },
};
