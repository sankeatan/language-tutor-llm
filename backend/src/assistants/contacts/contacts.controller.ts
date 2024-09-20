import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContactService } from './contacts.service';

@Controller('contacts')
@UseGuards(AuthGuard('jwt'))  // Protect routes using JWT authentication
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Get all contacts (agents) for the authenticated user
  @Get()
  async getAllContacts(@Req() req) {
    const userId = req.user.userId;
    return this.contactService.getAllContactsForUser(userId);
  }
}
