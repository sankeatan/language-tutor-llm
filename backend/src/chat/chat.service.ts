import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor() {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,  // Store API Key in .env file
    });
  }

  async getGPT4Response(message: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    });

    return response.choices[0].message?.content || 'Error: No response';
  }
}
