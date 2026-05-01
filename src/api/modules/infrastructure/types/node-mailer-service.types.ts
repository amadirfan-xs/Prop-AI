export type SendMailInput = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export type SendTemplateMailInput = {
  to: string;
  subject: string;
  template: string;
  context?: Record<string, unknown>;
};
