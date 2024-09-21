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
exports.AssistantService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const chat_service_1 = require("../chat/chat.service");
const mongoose_2 = require("mongoose");
const chat_assistant_schema_1 = require("./schemas/chat-assistant.schema");
let AssistantService = class AssistantService {
    constructor(chatService, chatAssistantModel) {
        this.chatService = chatService;
        this.chatAssistantModel = chatAssistantModel;
    }
    async generateChatAssistant(createChatAssistantDto) {
        const { personality, interests, userId } = createChatAssistantDto;
        const chatAssistant = new this.chatAssistantModel({
            personality,
            interests,
            userId,
            name: 'temp',
            background: 'temp',
        });
        await chatAssistant.save();
        const prompt = `
      Your role is a conversational Spanish language partner.
      You have the following traits:
      Personality: ${personality}
      Interests: ${interests.join(', ')}

      With only two things, a culturally appropriate name for a Spanish language partner and a culturally appropriate background 
      that includes birth year, birth place, current country, relatives, current and past friends, current and past jobs, and 
      any other details that can help give the assistant a history. Tie in the traits that have been listed to the background as well.

      Respond with a json using the following two keys
      name:
      background:
    `;
        const assistantResponse = await this.chatService.getGPT4Response(prompt);
        let name = 'Unknown Name';
        let background = 'Unknown Background';
        try {
            const parsedResponse = JSON.parse(assistantResponse);
            name = parsedResponse.name || name;
            background = parsedResponse.background || background;
        }
        catch (error) {
            console.error('Failed to parse GPT-4 response:', error);
        }
        chatAssistant.name = name;
        chatAssistant.background = background;
        await chatAssistant.save();
    }
    async getAllAssistantsForUser(userId) {
        return this.chatAssistantModel.find({ userId }).exec();
    }
};
exports.AssistantService = AssistantService;
exports.AssistantService = AssistantService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(chat_assistant_schema_1.ChatAssistant.name)),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        mongoose_2.Model])
], AssistantService);
//# sourceMappingURL=assistant.service.js.map