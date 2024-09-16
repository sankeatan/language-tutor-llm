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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const conversation_schema_1 = require("./schemas/conversation.schema");
const openai_1 = require("openai");
let ChatService = class ChatService {
    constructor(conversationModel) {
        this.conversationModel = conversationModel;
        const openai = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async createConversation(dto) {
        const newConversation = new this.conversationModel({
            userId: dto.userId,
            messages: dto.messages,
        });
        const savedConversation = await newConversation.save();
        const conversationId = savedConversation._id;
        const userMessage = dto.messages[0].content;
        const gptResponse = await this.getGPT4Response(conversationId.toString(), userMessage);
        await savedConversation.save();
        savedConversation.messages.push({ role: 'assistant', content: gptResponse });
        return savedConversation;
    }
    async getGPT4Response(conversationId, message) {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: message }],
            });
            const reply = response.choices[0].message?.content || 'No response from GPT-4';
            await this.updateConversation({
                conversationId: conversationId,
                messages: [{ role: 'user', content: message }, { role: 'assistant', content: reply }],
            });
            return reply;
        }
        catch (error) {
            console.error('Error communicating with OpenAI API', error);
            throw new Error('Failed to get response from GPT-4');
        }
    }
    async updateConversation(dto) {
        const conversation = await this.conversationModel.findById(dto.conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        conversation.messages.push(...dto.messages);
        return conversation.save();
    }
    async deleteConversation(conversationId) {
        return this.conversationModel.findByIdAndDelete(conversationId);
    }
    async getAllConversations(userId) {
        return this.conversationModel.find({ userId }).exec();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(conversation_schema_1.Conversation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map