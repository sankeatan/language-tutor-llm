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
var AssistantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_assistant_schema_1 = require("./schemas/chat-assistant.schema");
const openai_service_1 = require("../shared/services/openai.service");
const fs = require("fs");
let AssistantService = AssistantService_1 = class AssistantService {
    constructor(assistantModel, openAIService) {
        this.assistantModel = assistantModel;
        this.openAIService = openAIService;
        this.logger = new common_1.Logger(AssistantService_1.name);
    }
    async createAssistant(userId, assistantData) {
        this.logger.log(`Creating assistant for user: ${userId}`);
        const name = await this.generateName(assistantData.personalityTraits, assistantData.interests, assistantData.gender, assistantData.age, assistantData.language);
        const backgroundHistory = await this.generateBackground(assistantData.personalityTraits, assistantData.interests, assistantData.gender, assistantData.age, assistantData.language, name.toString());
        const relationships = await this.generateRelationships(assistantData.personalityTraits, assistantData.interests, assistantData.gender, assistantData.age, assistantData.language, backgroundHistory.toString());
        const weeklySchedule = await this.generateWeeklySchedule(assistantData.personalityTraits, assistantData.interests, assistantData.gender, assistantData.age, assistantData.language, backgroundHistory.toString(), relationships.toString());
        const instructions = `You are a conversational language partner for an English speaker that is learning ${assistantData.language}. You are going to
    be given a background, relationships, and a weekly schedule in your Vector Database. 
    
    You are being sent a text message from your language partner. Please use the background, relationships, weekly schedule and conversation context
    to decide how best to reply in ${assistantData.language}`;
        const backgroundFilePath = './backgroundHistory.txt';
        const relationshipsFilePath = './relationships.json';
        const scheduleFilePath = './weeklySchedule.json';
        fs.writeFileSync(backgroundFilePath, backgroundHistory);
        fs.writeFileSync(relationshipsFilePath, JSON.stringify(relationships));
        fs.writeFileSync(scheduleFilePath, JSON.stringify(weeklySchedule));
        const backgroundFile = await this.openAIService.uploadAssistantFile(backgroundFilePath);
        const relationshipsFile = await this.openAIService.uploadAssistantFile(relationshipsFilePath);
        const scheduleFile = await this.openAIService.uploadAssistantFile(scheduleFilePath);
        const vectorStore = await this.openAIService.createVectorStore([backgroundFile.id, relationshipsFile.id, scheduleFile.id]);
        const thread = await this.openAIService.createThread({ vector_store_ids: [vectorStore.id] });
        const newAssistant = new this.assistantModel({
            ...assistantData,
            name,
            threadId: thread.id,
            vectorId: vectorStore.id,
            userId,
            backgroundHistory,
            relationships,
            weeklySchedule
        });
        return newAssistant.save();
    }
    async getAssistantById(assistantId) {
        this.logger.log(`Fetching assistant by id: ${assistantId}`);
        return this.assistantModel.findOne({ assistantId }).exec();
    }
    async listAssistantsByUser(userId) {
        this.logger.log(`Listing all assistants for user: ${userId}`);
        return this.assistantModel.find({ userId }).exec();
    }
    async updateAssistant(assistantId, updateData) {
        this.logger.log(`Updating assistant with id: ${assistantId}`);
        return this.assistantModel.findOneAndUpdate({ assistantId }, updateData, { new: true }).exec();
    }
    async deleteAssistant(assistantId) {
        this.logger.log(`Deleting assistant with id: ${assistantId}`);
        await this.assistantModel.deleteOne({ assistantId }).exec();
    }
    async generateName(personality, interests, gender, age, language) {
        const prompt = `
      Generate an appropriate name for a person living in a culture dominated by ${language}:
      - Gender: ${gender}
      - Age: ${age}
      - Personality traits: ${personality}
      - Interests: ${interests}`;
        return await this.openAIService.generateCompletion(prompt);
    }
    async generateBackground(personality, interests, gender, age, language, name) {
        const prompt = `
      Write a short autobiographical background story written in ${language} for a person named ${name} with the following attributes:
      - Gender: ${gender}
      - Age: ${age}
      - Personality traits: ${personality}
      - Interests: ${interests}
      
      The story should be written in the first person, in ${language}, and reflect the person's upbringing, key life experiences, and values. 
      It should incorporate the person's cultural background and be consistent with the customs of the ${language} culture.`;
        return await this.openAIService.generateCompletion(prompt);
    }
    async generateRelationships(personality, interests, gender, age, language, background) {
        const prompt = `
      Analyze this autobiographical background for a character with the following attributes:
      - Gender: ${gender}
      - Age: ${age}
      - Personality traits: ${personality}
      - Interests: ${interests} 
      - Background: "${background}"

      Now, write a short list in ${language} of important relationships based on that background. If any specific relationships are mentioned 
      please include them in the list, if any details about that relationship description is missing please generate it. If it is a group of people, such as 
      a group of friends or coworkers, please generate individuals within that group and a description for them as well.

      For each relationship, describe:
      1. Their name
      2. Their relationship with the character
      3. The impact their relationship has had on the character's life
      
      Return it is a json object with the first value being the relation's name like this:
      
      Relationships: {
        "Axel Cubillo": {
            "Relation": "Padre",
            "Influence": "Ha esta por su lado hasta siempre"
            },
        "Isabela Frances": {
            "Relation": "Amgia",
            "Influence": "Una amiga de escuela"
            },    
        }`;
        return await this.openAIService.generateCompletion(prompt);
    }
    async generateWeeklySchedule(personality, interests, gender, age, language, backgroundHistory, relationips) {
        const prompt = `
      Write a short weekly schedule for a chatbot with the following attributes, written in ${language}:
      - Gender: ${gender}
      - Age: ${age}
      - Personality traits: ${personality}
      - Interests: ${interests}
      - Background History: ${backgroundHistory}
      - Relationships: ${relationips}
      - Target language: ${language}

      
      The schedule should include daily activities that reflect the chatbot's personality, hobbies, and interests, background history, and relationships.
      It should also include cultural practices and routines specific to the ${language} culture, such as social gatherings, rest times (like siesta), and other customs.

      Respond with a json object that has each day of the week (Sunday - Saturday) listed as the initial value, like this:

      "Schedule": {
        "Sunday": {
          "8:00": "Desayunar con mi familia",
          "9:00": "Sale la casa por iglesia",
          }
        }
    `;
        return await this.openAIService.generateCompletion(prompt);
    }
};
exports.AssistantService = AssistantService;
exports.AssistantService = AssistantService = AssistantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_assistant_schema_1.ChatAssistant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        openai_service_1.OpenAIService])
], AssistantService);
//# sourceMappingURL=assistant.service.js.map