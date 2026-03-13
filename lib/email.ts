import 'server-only';

import nodemailer, {
  type SendMailOptions,
  type SentMessageInfo,
  type Transporter,
} from 'nodemailer';

type EmailRecipient = string | string[];

export type SendEmailInput = {
  to: EmailRecipient;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: EmailRecipient;
  bcc?: EmailRecipient;
  replyTo?: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  defaultFromAddress: string;
  defaultFromName?: string;
};

type EmailClient = {
  transporter: Transporter;
  defaultFrom: string;
};

let emailClient: EmailClient | null = null;

export async function sendEmail(input: SendEmailInput): Promise<SentMessageInfo> {
  ensureEmailContentExists(input);

  const client = getEmailClient();
  const message: SendMailOptions = {
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    cc: input.cc,
    bcc: input.bcc,
    replyTo: input.replyTo,
    from: input.from ?? client.defaultFrom,
  };

  return client.transporter.sendMail(message);
}

function getEmailClient(): EmailClient {
  if (emailClient) {
    return emailClient;
  }

  const config = loadSmtpConfigFromEnv();
  emailClient = {
    transporter: createTransporter(config),
    defaultFrom: buildFromAddress(config.defaultFromAddress, config.defaultFromName),
  };

  return emailClient;
}

function createTransporter(config: SmtpConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: !config.secure,
    tls: {
      minVersion: 'TLSv1.2',
    },
    auth: {
      user: config.user,
      pass: config.password,
    },
  });
}

function loadSmtpConfigFromEnv(): SmtpConfig {
  const port = parseSmtpPort(readRequiredEnv('SMTP_PORT'));

  return {
    host: readRequiredEnv('SMTP_HOST'),
    port,
    secure: parseSmtpSecure(process.env.SMTP_SECURE, port),
    user: readRequiredEnv('SMTP_USER'),
    password: readRequiredEnv('SMTP_PASSWORD'),
    defaultFromAddress: readRequiredEnv('SMTP_FROM_EMAIL'),
    defaultFromName: readOptionalEnv('SMTP_FROM_NAME'),
  };
}

function ensureEmailContentExists(input: SendEmailInput): void {
  if (input.text || input.html) {
    return;
  }

  throw new Error('At least one mail body field must be provided: text or html.');
}

function parseSmtpPort(value: string): number {
  const parsedPort = Number(value);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    throw new Error(`Invalid SMTP_PORT value: "${value}". Expected a positive integer.`);
  }

  return parsedPort;
}

function parseSmtpSecure(value: string | undefined, port: number): boolean {
  if (!value) {
    return port === 465;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(`Invalid SMTP_SECURE value: "${value}". Expected "true" or "false".`);
}

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readOptionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();

  return value || undefined;
}

function buildFromAddress(email: string, name?: string): string {
  if (!name) {
    return email;
  }

  return `${name} <${email}>`;
}
