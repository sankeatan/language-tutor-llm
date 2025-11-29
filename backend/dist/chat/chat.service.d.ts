/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Model } from 'mongoose';
import { Thread, ThreadDocument } from './schemas/thread.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { OpenAIService } from '../shared/services/openai.service';
export declare class ChatService {
    private threadModel;
    private messageModel;
    private readonly openAIService;
    private readonly logger;
    constructor(threadModel: Model<ThreadDocument>, messageModel: Model<MessageDocument>, openAIService: OpenAIService);
    createThread(thread: Thread): Promise<Thread>;
    addMessage(message: Message): Promise<Message>;
    handleUserMessage(threadId: string, assistantId: string, content: string): Promise<Message>;
    getMessages(threadId: string): Promise<Message[]>;
    deleteThread(threadId: string): Promise<void>;
    deleteMessage(threadId: string, messageId: string): Promise<void>;
}
