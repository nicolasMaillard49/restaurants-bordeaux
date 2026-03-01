import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CreateContactDto } from '../dto/create-contact.dto';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Controller('contact')
export class ContactController {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  @Post()
  @HttpCode(200)
  async submitContact(@Body() dto: CreateContactDto) {
    const subjectLabels: Record<string, string> = {
      suggestion: '🍽️ Suggestion de restaurant',
      question: '❓ Question générale',
      partnership: '🤝 Partenariat',
      bug: '🐛 Signalement de problème',
      other: '📩 Autre',
    };

    const subjectLabel = subjectLabels[dto.subject] || dto.subject;
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER || '';

    // Send email
    try {
      await this.transporter.sendMail({
        from: `"Restaurants Bordeaux" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        replyTo: dto.email,
        subject: `[Contact] ${subjectLabel} — ${dto.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #722F37; padding: 24px; border-radius: 12px 12px 0 0;">
              <h2 style="color: white; margin: 0; font-size: 20px;">📩 Nouveau message de contact</h2>
            </div>
            <div style="background: #f9f9f9; padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 600; width: 100px;">Nom</td>
                  <td style="padding: 8px 0; color: #333;">${dto.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 600;">Email</td>
                  <td style="padding: 8px 0; color: #333;"><a href="mailto:${dto.email}" style="color: #722F37;">${dto.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 600;">Sujet</td>
                  <td style="padding: 8px 0; color: #333;">${subjectLabel}</td>
                </tr>
              </table>
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
              <div style="color: #333; line-height: 1.6; white-space: pre-wrap;">${dto.message}</div>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 16px;">
              Envoyé depuis restaurants-bordeaux.com
            </p>
          </div>
        `,
        text: `Nouveau message de contact\n\nNom: ${dto.name}\nEmail: ${dto.email}\nSujet: ${subjectLabel}\n\nMessage:\n${dto.message}`,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      // Still save to file as backup
    }

    // Also save to file as backup
    const logDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, 'contacts.json');
    let contacts = [];
    if (fs.existsSync(logFile)) {
      try { contacts = JSON.parse(fs.readFileSync(logFile, 'utf-8')); } catch { contacts = []; }
    }
    contacts.push({ ...dto, createdAt: new Date().toISOString() });
    fs.writeFileSync(logFile, JSON.stringify(contacts, null, 2));

    return { success: true, message: 'Contact form submitted successfully' };
  }
}
