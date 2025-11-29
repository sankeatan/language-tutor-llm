import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { ChatAssistant } from './schemas/chat-assistant.schema';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  // Create a new assistant with generated content
  @Post('create')
  async createAssistant(
    @Body('userId') userId: string,
    @Body('personalityTraits') personalityTraits: string[],
    @Body('interests') interests: string[],
    @Body('gender') gender: string,
    @Body('age') age: number,
    @Body('language') language: string
  ): Promise<ChatAssistant> {
    const assistant = await this.assistantService.createAssistant(userId, {
      personalityTraits,
      interests,
      gender,
      age,
      language,
    });

    return assistant;
  }

  // Get assistant by userId
  @Get(':assistantId')
  async getAssistant(@Param('userId') assistantId: string): Promise<ChatAssistant> {
    return this.assistantService.getAssistantById(assistantId);
  }

  // List all assistants for a user
  @Get('list/:userId')
  async listAssistants(@Param('userId') userId: string): Promise<ChatAssistant[]> {
    return this.assistantService.listAssistantsByUser(userId);
  }

  // Update an assistant's information
  @Put('update/:assistantId')
  async updateAssistant(
    @Param('assistantId') assistantId: string,
    @Body('personalityTraits') personalityTraits: string[],
    @Body('interests') interests: string[],
    @Body('gender') gender: string,
    @Body('age') age: number,
    @Body('language') language: string
  ): Promise<ChatAssistant> {
    return this.assistantService.updateAssistant(assistantId, {
      personalityTraits,
      interests,
      gender,
      age,
      language,
    });
  }

  // Delete an assistant by userId
  @Delete('delete/:assistantId')
  async deleteAssistant(@Param('assistantid') assistantId: string): Promise<{ message: string }> {
    await this.assistantService.deleteAssistant(assistantId);
    return { message: `Assistant for user ${assistantId} deleted successfully.` };
  }

}