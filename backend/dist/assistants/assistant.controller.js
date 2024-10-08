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
exports.AssistantController = void 0;
const common_1 = require("@nestjs/common");
const assistant_service_1 = require("./assistant.service");
let AssistantController = class AssistantController {
    constructor(assistantService) {
        this.assistantService = assistantService;
    }
    async createAssistant(userId, personalityTraits, interests, gender, age, language) {
        const assistant = await this.assistantService.createAssistant(userId, {
            personalityTraits,
            interests,
            gender,
            age,
            language,
        });
        return assistant;
    }
    async getAssistant(assistantId) {
        return this.assistantService.getAssistantById(assistantId);
    }
    async listAssistants(userId) {
        return this.assistantService.listAssistantsByUser(userId);
    }
    async updateAssistant(assistantId, personalityTraits, interests, gender, age, language) {
        return this.assistantService.updateAssistant(assistantId, {
            personalityTraits,
            interests,
            gender,
            age,
            language,
        });
    }
    async deleteAssistant(assistantId) {
        await this.assistantService.deleteAssistant(assistantId);
        return { message: `Assistant for user ${assistantId} deleted successfully.` };
    }
};
exports.AssistantController = AssistantController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('personalityTraits')),
    __param(2, (0, common_1.Body)('interests')),
    __param(3, (0, common_1.Body)('gender')),
    __param(4, (0, common_1.Body)('age')),
    __param(5, (0, common_1.Body)('language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Array, String, Number, String]),
    __metadata("design:returntype", Promise)
], AssistantController.prototype, "createAssistant", null);
__decorate([
    (0, common_1.Get)(':assistantId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssistantController.prototype, "getAssistant", null);
__decorate([
    (0, common_1.Get)('list/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssistantController.prototype, "listAssistants", null);
__decorate([
    (0, common_1.Put)('update/:assistantId'),
    __param(0, (0, common_1.Param)('assistantId')),
    __param(1, (0, common_1.Body)('personalityTraits')),
    __param(2, (0, common_1.Body)('interests')),
    __param(3, (0, common_1.Body)('gender')),
    __param(4, (0, common_1.Body)('age')),
    __param(5, (0, common_1.Body)('language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Array, String, Number, String]),
    __metadata("design:returntype", Promise)
], AssistantController.prototype, "updateAssistant", null);
__decorate([
    (0, common_1.Delete)('delete/:assistantId'),
    __param(0, (0, common_1.Param)('assistantid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssistantController.prototype, "deleteAssistant", null);
exports.AssistantController = AssistantController = __decorate([
    (0, common_1.Controller)('assistant'),
    __metadata("design:paramtypes", [assistant_service_1.AssistantService])
], AssistantController);
//# sourceMappingURL=assistant.controller.js.map