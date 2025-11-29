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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const thread_schema_1 = require("./schemas/thread.schema");
const message_schema_1 = require("./schemas/message.schema");
const openai_service_1 = require("../shared/services/openai.service");
let ChatService = ChatService_1 = class ChatService {
    constructor(threadModel, messageModel, openAIService) {
        this.threadModel = threadModel;
        this.messageModel = messageModel;
        this.openAIService = openAIService;
        this.logger = new common_1.Logger(ChatService_1.name);
    }
    async createThread(thread) {
        this.logger.log(`Creating thread for user: ${thread.userId}`);
        const newThread = new this.threadModel({
            userId: thread.userId,
            metadata: thread.metadata
        });
        return newThread.save();
    }
    async addMessage(message) {
        this.logger.log(`Adding message to thread ${message.threadId}`);
        const newMessage = new this.messageModel({
            threadId: message.threadId,
            role: message.role === "user" ? "user" : "assistant",
            content: message.content,
            timestamp: message.timestamp || new Date()
        });
        return newMessage.save();
    }
    async handleUserMessage(threadId, assistantId, content) {
        await this.addMessage({ threadId, role: 'user', content, timestamp: new Date });
        await this.openAIService.appendMessageToThread(threadId, { role: 'user', content });
        const assistantResponse = await this.openAIService.runAssistantOnThread(threadId, assistantId);
        return this.addMessage({ threadId, role: 'assistant', content: assistantResponse.content, timestamp: new Date });
    }
    async getMessages(threadId) {
        this.logger.log(`Fetching messages for thread ${threadId}`);
        return this.messageModel.find({ threadId }).exec();
    }
    async deleteThread(threadId) {
        await this.threadModel.findByIdAndDelete(threadId).exec();
        await this.messageModel.deleteMany({ threadId }).exec();
    }
    async deleteMessage(threadId, messageId) {
        await this.messageModel.findOneAndDelete({ _id: messageId, threadId }).exec();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(thread_schema_1.Thread.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        openai_service_1.OpenAIService])
], ChatService);
//# sourceMappingURL=chat.service.js.map