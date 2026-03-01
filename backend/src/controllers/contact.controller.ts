import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CreateContactDto } from '../dto/create-contact.dto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('contact')
export class ContactController {
  @Post()
  @HttpCode(200)
  async submitContact(@Body() dto: CreateContactDto) {
    // Log contact to file (simple storage)
    const logDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'contacts.json');
    let contacts = [];

    if (fs.existsSync(logFile)) {
      try {
        contacts = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
      } catch {
        contacts = [];
      }
    }

    contacts.push({
      ...dto,
      createdAt: new Date().toISOString(),
    });

    fs.writeFileSync(logFile, JSON.stringify(contacts, null, 2));

    return { success: true, message: 'Contact form submitted successfully' };
  }
}
