import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';
import { AssistantService } from './assistant.service'
import { AuthGuard } from '@nestjs/passport';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/:userId')
  async getAllAssistants(@Param('userId') userId: string) {
    return this.assistantService.getAllAssistantsForUser(userId);  // You’ll need to implement this method
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('generate')
  async generateassistant(@Body() createChatAssistantDto: { personality: string; interests: string[]; userId: string }) {
    return this.assistantService.generateChatAssistant(createChatAssistantDto);
  }
}
