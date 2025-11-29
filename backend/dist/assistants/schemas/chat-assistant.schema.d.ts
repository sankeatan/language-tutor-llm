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
import { Document } from 'mongoose';
export type ChatAssistantDocument = ChatAssistant & Document;
export declare class ChatAssistant {
    userId: string;
    threadId: string;
    vectorId: string;
    name: string;
    gender: string;
    age: number;
    language: string;
    interests: string[];
    personalityTraits: string[];
    backgroundHistory: string;
    relationships: string[];
}
export declare const ChatAssistantSchema: import("mongoose").Schema<ChatAssistant, import("mongoose").Model<ChatAssistant, any, any, any, Document<unknown, any, ChatAssistant> & ChatAssistant & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatAssistant, Document<unknown, {}, import("mongoose").FlatRecord<ChatAssistant>> & import("mongoose").FlatRecord<ChatAssistant> & {
    _id: import("mongoose").Types.ObjectId;
}>;
