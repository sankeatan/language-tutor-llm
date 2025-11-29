import OpenAI from 'openai';
import { Message } from 'src/chat/schemas/message.schema';
export declare class OpenAIService {
    private readonly client;
    private readonly logger;
    constructor();
    createThread(metadata: any): Promise<OpenAI.Beta.Threads.Thread>;
    appendMessageToThread(threadId: string, message: {
        role: string;
        content: string;
    }): Promise<OpenAI.Beta.Threads.Messages.Message>;
    getMessagesInThread(threadId: string): Promise<OpenAI.Beta.Threads.Messages.MessagesPage>;
    getLatestMessage(threadId: string): Promise<Message>;
    deleteMessage(threadId: string, messageId: string, options?: OpenAI.RequestOptions): Promise<OpenAI.Beta.Threads.Messages.MessageDeleted>;
    runAssistantOnThread(threadId: string, assistantId: string, instructions?: string): Promise<Message>;
    generateCompletion(prompt: string, maxTokens?: number, temperature?: number): Promise<string>;
    uploadAssistantFile(filePath: string): Promise<OpenAI.Files.FileObject>;
    uploadFileToVectorStore(vectorStoreId: string, fileId: string): Promise<any>;
    createVectorStore(fileId?: string[]): Promise<OpenAI.Beta.VectorStores.VectorStore>;
}
