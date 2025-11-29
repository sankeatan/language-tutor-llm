"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OpenAIService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const fs = require("fs");
let OpenAIService = OpenAIService_1 = class OpenAIService {
    constructor() {
        this.logger = new common_1.Logger(OpenAIService_1.name);
        this.client = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.logger.log('OpenAI Client initialized');
    }
    async createThread(metadata) {
        this.logger.log(`Creating a thread`);
        try {
            const thread = await this.client.beta.threads.create({
                tool_resources: {
                    file_search: {
                        vector_store_ids: metadata.vector_store_ids
                    }
                },
            });
            this.logger.log(`Thread created successfully: ${thread.id}`);
            return thread;
        }
        catch (error) {
            this.logger.error('Error creating thread', error.stack);
            throw new Error('Failed to create thread');
        }
    }
    async appendMessageToThread(threadId, message) {
        this.logger.log(`Appending message to thread ${threadId}: ${message.role} - ${message.content}`);
        try {
            const response = await this.client.beta.threads.messages.create(threadId, {
                role: message.role === "user" ? "user" : "assistant",
                content: message.content,
            });
            this.logger.log(`Message appended successfully to thread ${threadId}`);
            return response;
        }
        catch (error) {
            this.logger.error(`Error appending message to thread ${threadId}`, error.stack);
            throw new Error('Failed to append message');
        }
    }
    async getMessagesInThread(threadId) {
        this.logger.log(`Fetching messages from thread ${threadId}`);
        try {
            const messages = await this.client.beta.threads.messages.list(threadId);
            this.logger.log(`Fetched ${messages.data.length} messages from thread ${threadId}`);
            return messages;
        }
        catch (error) {
            this.logger.error(`Error fetching messages from thread ${threadId}`, error.stack);
            throw new Error('Failed to get messages');
        }
    }
    async getLatestMessage(threadId) {
        this.logger.log(`Fetching latest message from thread ${threadId}`);
        try {
            const messagesPage = await this.client.beta.threads.messages.list(threadId, {
                order: 'desc',
                limit: 1
            });
            const latestMessageData = messagesPage.data[0];
            if (latestMessageData) {
                const latestMessage = {
                    threadId: threadId,
                    role: latestMessageData.role,
                    content: latestMessageData.content[0][0],
                    timestamp: new Date()
                };
                this.logger.log(`Latest message found in thread ${threadId}: ${latestMessage.content}`);
                return latestMessage;
            }
            else {
                this.logger.warn(`No messages found in thread ${threadId}`);
                return null;
            }
        }
        catch (error) {
            this.logger.error(`Error fetching latest message from thread ${threadId}`, error.stack);
            throw new Error('Failed to retrieve latest message');
        }
    }
    async deleteMessage(threadId, messageId, options) {
        this.logger.log(`Deleting message ${messageId} from thread ${threadId}`);
        try {
            const response = await this.client.beta.threads.messages.del(threadId, messageId, options);
            this.logger.log(`Message ${messageId} deleted successfully from thread ${threadId}`);
            return response;
        }
        catch (error) {
            this.logger.error(`Error deleting message ${messageId} from thread ${threadId}`, error.stack);
            throw new Error('Failed to delete message');
        }
    }
    async runAssistantOnThread(threadId, assistantId, instructions) {
        this.logger.log(`Running assistant ${assistantId} on thread ${threadId}`);
        try {
            const run = await this.client.beta.threads.runs.createAndPoll(threadId, {
                instructions,
                assistant_id: assistantId,
            });
            let runStatus = run.status;
            while (runStatus === 'queued' || runStatus === 'in_progress') {
                this.logger.log(`Assistant run is in progress for thread ${threadId} (status: ${runStatus})`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                runStatus = (await this.client.beta.threads.runs.retrieve(threadId, run.id)).status;
            }
            if (runStatus === 'completed') {
                this.logger.log(`Assistant run completed for thread ${threadId}`);
                return await this.getLatestMessage(threadId);
            }
            this.logger.error(`Assistant run failed with status: ${runStatus}`);
            throw new Error(`Run failed with status: ${runStatus}`);
        }
        catch (error) {
            this.logger.error(`Error running assistant on thread ${threadId}`, error.stack);
            throw new Error('Failed to run assistant');
        }
    }
    async generateCompletion(prompt, maxTokens, temperature = 0.7) {
        try {
            this.logger.log(`Generating completion with prompt: ${prompt}`);
            const response = await this.client.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: maxTokens,
                temperature: temperature,
            });
            const completionText = response.choices[0].message.content;
            this.logger.log(`Generated completion: ${completionText}`);
            return completionText;
        }
        catch (error) {
            this.logger.error(`Error generating completion: ${error.message}`, error.stack);
            throw new Error('Failed to generate completion');
        }
    }
    async uploadAssistantFile(filePath) {
        try {
            this.logger.log(`Uploading file: ${filePath}`);
            const file = await this.client.files.create({
                file: fs.createReadStream(filePath),
                purpose: "assistants"
            });
            return file;
        }
        catch (error) {
            this.logger.log(`Error uploading file: ${filePath}`);
        }
    }
    async uploadFileToVectorStore(vectorStoreId, fileId) {
        try {
            this.logger.log(`Uploading ${fileId} to ${vectorStoreId}`);
            const response = await this.client.beta.vectorStores.files.create(vectorStoreId, {
                file_id: fileId
            });
            this.logger.log(`Uploaded ${fileId} to vector store for thread ${vectorStoreId}`);
            return response;
        }
        catch (error) {
            this.logger.error(`Error uploading ${fileId} to vector store: ${error.message}`);
            this.logger.log('File upload failed');
        }
    }
    async createVectorStore(fileId) {
        try {
            this.logger.log(`Attempting to create Vector Store`);
            const vectorStore = await this.client.beta.vectorStores.create({
                file_ids: fileId
            });
            this.logger.log(`Vector Store Created: ${vectorStore.id}`);
            return vectorStore;
        }
        catch (error) {
            this.logger.log(`Error creating vector store`);
        }
    }
};
exports.OpenAIService = OpenAIService;
exports.OpenAIService = OpenAIService = OpenAIService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OpenAIService);
//# sourceMappingURL=openai.service.js.map