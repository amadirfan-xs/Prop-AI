import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { readFile } from 'fs/promises';
import { join } from 'path';
import ejs from 'ejs';
import type {
  SendMailInput,
  SendTemplateMailInput,
} from '@/api/modules/infrastructure/types/node-mailer-service.types';

@Injectable()
export class NodeMailerService {
  private readonly logger = new Logger(NodeMailerService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    template: string,
    subject: string,
    context: Record<string, unknown>,
  ): Promise<void> {
    this.validateEmailInput(to, subject);
    if (!template?.trim()) {
      throw new BadRequestException('template is required');
    }

    try {
      const templatePath = await this.resolveTemplatePath(template);
      const source = await readFile(templatePath, 'utf-8');
      const html = ejs.render(source, context);

      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      this.logger.log(`Template email sent to ${to} using "${template}"`);
    } catch (error) {
      this.logger.error(
        `Failed to send template email "${template}" to ${to}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Unable to send email right now');
    }
  }

  async sendMail(input: SendMailInput): Promise<void> {
    this.validateEmailInput(input.to, input.subject);
    if (!input.text && !input.html) {
      throw new BadRequestException('text or html content is required');
    }

    try {
      await this.mailerService.sendMail({
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      });
      this.logger.log(
        `Email sent to ${input.to} with subject "${input.subject}"`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${input.to} with subject "${input.subject}"`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Unable to send email right now');
    }
  }

  async sendTemplateMail(input: SendTemplateMailInput): Promise<void> {
    await this.sendEmail(
      input.to,
      input.template,
      input.subject,
      input.context ?? {},
    );
  }

  private validateEmailInput(to: string, subject: string): void {
    if (!to?.trim()) {
      throw new BadRequestException('recipient email is required');
    }
    if (!subject?.trim()) {
      throw new BadRequestException('email subject is required');
    }
  }

  private async resolveTemplatePath(template: string): Promise<string> {
    const normalizedTemplateName = template.endsWith('.ejs')
      ? template
      : `${template}.ejs`;
    const candidates = [
      join(
        process.cwd(),
        'dist',
        'common',
        'templates',
        normalizedTemplateName,
      ),
      join(process.cwd(), 'src', 'common', 'templates', normalizedTemplateName),
    ];

    for (const candidate of candidates) {
      try {
        await readFile(candidate, 'utf-8');
        return candidate;
      } catch {
        // Continue searching next path.
      }
    }

    throw new BadRequestException(`Email template "${template}" not found`);
  }
}
