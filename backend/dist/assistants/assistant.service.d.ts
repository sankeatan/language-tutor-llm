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
import { ChatAssistant, ChatAssistantDocument } from './schemas/chat-assistant.schema';
import { OpenAIService } from 'src/shared/services/openai.service';
export declare class AssistantService {
    private assistantModel;
    private readonly openAIService;
    private readonly logger;
    constructor(assistantModel: Model<ChatAssistantDocument>, openAIService: OpenAIService);
    createAssistant(userId: string, assistantData: Partial<ChatAssistant>): Promise<ChatAssistant>;
    getAssistantById(assistantId: string): Promise<ChatAssistant>;
    listAssistantsByUser(userId: string): Promise<ChatAssistant[]>;
    updateAssistant(assistantId: string, updateData: Partial<ChatAssistant>): Promise<ChatAssistant>;
    deleteAssistant(assistantId: string): Promise<void>;
    generateName(personality: string[], interests: string[], gender: string, age: number, language: string): Promise<string>;
    generateBackground(personality: string[], interests: string[], gender: string, age: number, language: string, name: string): Promise<string>;
    generateRelationships(personality: string[], interests: string[], gender: string, age: number, language: string, background: string): Promise<string>;
    generateWeeklySchedule(personality: string[], interests: string[], gender: string, age: number, language: string, backgroundHistory: string, relationips: string): Promise<string>;
}
