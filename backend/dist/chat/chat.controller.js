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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const openai_service_1 = require("../shared/services/openai.service");
let ChatController = class ChatController {
    constructor(chatService, openAIService) {
        this.chatService = chatService;
        this.openAIService = openAIService;
    }
    async startThread(userId, metadata) {
        const thread = { userId, metadata, createdAt: new Date() };
        return this.chatService.createThread(thread);
    }
    async sendMessage(threadId, assistantId, content) {
        return this.chatService.handleUserMessage(threadId, assistantId, content);
    }
    async getMessages(threadId) {
        return this.chatService.getMessages(threadId);
    }
    async getLatestMessage(threadId) {
        return this.openAIService.getLatestMessage(threadId);
    }
    async deleteThread(threadId) {
        await this.chatService.deleteThread(threadId);
        return { message: `Thread ${threadId} deleted successfully` };
    }
    async deleteMessage(threadId, messageId) {
        await this.chatService.deleteMessage(threadId, messageId);
        return { message: `Message ${messageId} from thread ${threadId} deleted successfully` };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('metadata')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "startThread", null);
__decorate([
    (0, common_1.Post)(':threadId/message'),
    __param(0, (0, common_1.Param)('threadId')),
    __param(1, (0, common_1.Body)('assistantId')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)(':threadId/messages'),
    __param(0, (0, common_1.Param)('threadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)(':threadId/latest'),
    __param(0, (0, common_1.Param)('threadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getLatestMessage", null);
__decorate([
    (0, common_1.Delete)(':threadId'),
    __param(0, (0, common_1.Param)('threadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteThread", null);
__decorate([
    (0, common_1.Delete)(':threadId/message/:messageId'),
    __param(0, (0, common_1.Param)('threadId')),
    __param(1, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        openai_service_1.OpenAIService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map