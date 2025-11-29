// shared.module.ts
import { Module } from '@nestjs/common';
import { OpenAIService } from './services/openai.service';  // Import the service

@Module({
  providers: [OpenAIService],  // Add it to providers
  exports: [OpenAIService],    // Export it to make it available for other modules
})
export class SharedModule {}
