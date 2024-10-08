import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';  // Import OpenAI library
import { Message } from 'src/chat/schemas/message.schema';
import * as fs from 'fs'

@Injectable()
export class OpenAIService {
    private readonly client: OpenAI;
    private readonly logger = new Logger(OpenAIService.name); //Next.js Logger

    constructor() {
        this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,  // Ensure you load this from environment variables
        });
        this.logger.log('OpenAI Client initialized')
    }

    // Function to create a thread with metadata (like personality)
    async createThread(metadata: any) {
        this.logger.log(`Creating a thread`);
        try{
        const thread = await this.client.beta.threads.create({
            tool_resources: {
                file_search: {
                    vector_store_ids: metadata.vector_store_ids}
                },
            });
        this.logger.log(`Thread created successfully: ${thread.id}`);
        return thread;
        } catch (error) {
            this.logger.error('Error creating thread', error.stack);
            throw new Error('Failed to create thread');
        }
    }

    // Add messages
    async appendMessageToThread(threadId: string, message: {role: string, content: string}){
        this.logger.log(`Appending message to thread ${threadId}: ${message.role} - ${message.content}`);
        try {
            const response = await this.client.beta.threads.messages.create(threadId, {
            role: message.role === "user" ? "user" : "assistant",
            content: message.content,
            });
            this.logger.log(`Message appended successfully to thread ${threadId}`);
            return response;
        } catch (error) {
            this.logger.error(`Error appending message to thread ${threadId}`, error.stack);
            throw new Error('Failed to append message');
        }
        }
  
    //Get all messages
    async getMessagesInThread(threadId: string) {
        this.logger.log(`Fetching messages from thread ${threadId}`);
        try {
            const messages = await this.client.beta.threads.messages.list(threadId);
            this.logger.log(`Fetched ${messages.data.length} messages from thread ${threadId}`);
            return messages;
        } catch (error) {
            this.logger.error(`Error fetching messages from thread ${threadId}`, error.stack);
            throw new Error('Failed to get messages');
        }
        }
    
    async getLatestMessage(threadId: string): Promise<Message> {
        this.logger.log(`Fetching latest message from thread ${threadId}`);
        try {
            // Get the most recent message in the thread
            const messagesPage = await this.client.beta.threads.messages.list(threadId, {
            order: 'desc',
            limit: 1
            });
        
            const latestMessageData = messagesPage.data[0]; // The latest message
        
            if (latestMessageData) {

                const latestMessage: Message = {
                    threadId: threadId,
                    role: latestMessageData.role,
                    content: latestMessageData.content[0][0],
                    timestamp: new Date()
                }
            this.logger.log(`Latest message found in thread ${threadId}: ${latestMessage.content}`);
            return latestMessage;
            } else {
            this.logger.warn(`No messages found in thread ${threadId}`);
            return null;
            }
        } catch (error) {
            this.logger.error(`Error fetching latest message from thread ${threadId}`, error.stack);
            throw new Error('Failed to retrieve latest message');
        }
        }
    
    async deleteMessage(threadId: string, messageId: string, options?: OpenAI.RequestOptions) {
        this.logger.log(`Deleting message ${messageId} from thread ${threadId}`);
        try {
        const response = await this.client.beta.threads.messages.del(threadId, messageId, options);
        this.logger.log(`Message ${messageId} deleted successfully from thread ${threadId}`);
        return response;
        } catch (error) {
        this.logger.error(`Error deleting message ${messageId} from thread ${threadId}`, error.stack);
        throw new Error('Failed to delete message');
        }
    }

    // Function to run the assistant within a thread context
    async runAssistantOnThread(threadId: string, assistantId: string, instructions?: string) {
        this.logger.log(`Running assistant ${assistantId} on thread ${threadId}`);
        try {
        const run = await this.client.beta.threads.runs.createAndPoll(threadId, {
            instructions,
            assistant_id: assistantId,
        });

        let runStatus = run.status;
        while (runStatus === 'queued' || runStatus === 'in_progress') {
            this.logger.log(`Assistant run is in progress for thread ${threadId} (status: ${runStatus})`);
            await new Promise(resolve => setTimeout(resolve, 1000));  // Poll every 1 second
            runStatus = (await this.client.beta.threads.runs.retrieve(threadId, run.id)).status;
        }

        if (runStatus === 'completed') {
            this.logger.log(`Assistant run completed for thread ${threadId}`);
            return await this.getLatestMessage(threadId)
        }

        this.logger.error(`Assistant run failed with status: ${runStatus}`);
        throw new Error(`Run failed with status: ${runStatus}`);
        } catch (error) {
        this.logger.error(`Error running assistant on thread ${threadId}`, error.stack);
        throw new Error('Failed to run assistant');
        }
    }

    // Generic function to handle GPT-4 completions
    async generateCompletion(prompt: string, maxTokens?: number, temperature: number = 0.7): Promise<string> {
        try {
        this.logger.log(`Generating completion with prompt: ${prompt}`);
        
        const response = await this.client.chat.completions.create({
            model: 'gpt-4',
            messages: [{role: 'user', content: prompt}],
            max_tokens: maxTokens,
            temperature: temperature,
        });
        
        const completionText = response.choices[0].message.content;
        this.logger.log(`Generated completion: ${completionText}`);
        return completionText;
        } catch (error) {
        this.logger.error(`Error generating completion: ${error.message}`, error.stack);
        throw new Error('Failed to generate completion');
        }
    }

    async uploadAssistantFile(filePath: string) {
        try{
            this.logger.log(`Uploading file: ${filePath}`);
            const file = await this.client.files.create({
                file: fs.createReadStream(filePath),
                purpose: "assistants"
            })
            return file;
            } catch (error) {
            this.logger.log(`Error uploading file: ${filePath}`);

            }

    }

    async uploadFileToVectorStore(vectorStoreId: string, fileId: string): Promise<any> {
        try {
            this.logger.log(`Uploading ${fileId} to ${vectorStoreId}`);
            const response = await this.client.beta.vectorStores.files.create(vectorStoreId, {
                file_id: fileId
          });
          this.logger.log(`Uploaded ${fileId} to vector store for thread ${vectorStoreId}`);
          return response;
        } catch (error) {
          this.logger.error(`Error uploading ${fileId} to vector store: ${error.message}`);
          this.logger.log('File upload failed');
        }
      }
      
    async createVectorStore(fileId?: string[]) {
        try{
            this.logger.log(`Attempting to create Vector Store`)
            const vectorStore = await this.client.beta.vectorStores.create({
                file_ids: fileId
            })
            this.logger.log(`Vector Store Created: ${vectorStore.id}`)
            return vectorStore
        } catch (error) {
            this.logger.log(`Error creating vector store`)
        }
    }
}

