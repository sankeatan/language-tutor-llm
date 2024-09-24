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
const mongoose_2 = require("mongoose");
const openai_1 = require("openai");
const chat_assistant_schema_1 = require("./schemas/chat-assistant.schema");
const chat_service_1 = require("../chat/chat.service");
let AssistantService = class AssistantService {
    constructor(chatAssistantModel, chatService) {
        this.chatAssistantModel = chatAssistantModel;
        this.chatService = chatService;
        this.openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    async generateChatAssistant(createChatAssistantDto) {
        const { personality, interests, userId, gender, age } = createChatAssistantDto;
        let name = 'Generating...';
        let background = 'Generating...';
        let assistantId = 'Generating...';
        const backgroundPrompt = `
      Please help complete the profile of a contemporary spanish language speaker.
      I would like you to generate a name, as well as history and background that are culturally appropriate for a spanish speaker.
      I am going to give you a personality trait and list of interests and a gender that you are going to incorporate into the history and background.
      If the value for any of these profile key's is "GPT Choice" then I'd like you to insert your own choice for that value.

      Profile
      Personality: ${personality}
      Interests: ${interests.join(', ')}
      Gender: ${gender}
      Age Range: ${age}

      When generating the name please take gender into account.

      When writing the history please include birth year, birth place, current country, relatives, notable current and past friends, 
      notable current and past jobs, and any other details that can help give the profile a detailed history. When generating the birth year 
      take the age of the user into account. Subtract it from the current year of 2024. Give the response only in spanish. 
      Do not limit the background location to Spain. Include other Spanish speaking countries, or even countries where Spanish isn't the main language
      but a very common second language.

      Respond with a in json using the following two keys in english
      name:
      background:
    `;
        const assistantResponse = await this.chatService.getGPT4Response(backgroundPrompt);
        console.log("Raw GPT-4 response: ", assistantResponse);
        try {
            const nameIndex = assistantResponse.indexOf('"name":') + 7;
            const backgroundIndex = assistantResponse.indexOf('"background":') + 15;
            name = assistantResponse.slice(nameIndex + 2, backgroundIndex - 19).trim();
            background = assistantResponse.slice(backgroundIndex, assistantResponse.length - 2).trim();
            console.log(`Extracted Name: ${name}`);
            console.log(`Extracted Background: ${background}`);
        }
        catch (error) {
            console.error('Failed to extract name and background from GPT-4 response:', error);
        }
        const instructions = `
    You are a language partner for an end user that knows English but wants to learn Spanish.

    The following is a profile of your personality, interests, as well as background history. 
    Personality: ${personality}
    Interests: ${interests.join(', ')}
    Background: ${background}.
    
    Use this profile to provide interesting and engaging conversations to the end user in Spanish.`;
        const chatAssistant = new this.chatAssistantModel({
            assistantId: assistantId,
            name: name,
            personality,
            interests,
            userId,
            instructions: instructions.trim(),
            background: background
        });
        const openaiResponse = await this.openai.beta.assistants.create({
            instructions: chatAssistant.instructions,
            name: chatAssistant.name,
            model: 'gpt-4o',
        });
        chatAssistant.assistantId = openaiResponse.id;
        await chatAssistant.save();
        console.log(chatAssistant);
    }
    async getAllAssistantsForUser(userId) {
        return this.chatAssistantModel.find({ userId }).exec();
    }
};
exports.AssistantService = AssistantService;
exports.AssistantService = AssistantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_assistant_schema_1.ChatAssistant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        chat_service_1.ChatService])
], AssistantService);
//# sourceMappingURL=assistant.service.js.map