"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const assistant_service_1 = require("./assistant.service");
const assistant_controller_1 = require("./assistant.controller");
const chat_service_1 = require("../chat/chat.service");
const conversation_schema_1 = require("../chat/schemas/conversation.schema");
const chat_assistant_schema_1 = require("./dto/schemas/chat-assistant.schema");
const contacts_controller_1 = require("./contacts/contacts.controller");
const contacts_service_1 = require("./contacts/contacts.service");
let AssistantModule = class AssistantModule {
};
exports.AssistantModule = AssistantModule;
exports.AssistantModule = AssistantModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: chat_assistant_schema_1.ChatAssistant.name, schema: chat_assistant_schema_1.ChatAssistantSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: conversation_schema_1.Conversation.name, schema: conversation_schema_1.ConversationSchema }])
        ],
        controllers: [assistant_controller_1.AssistantController, contacts_controller_1.ContactController],
        providers: [assistant_service_1.AssistantService, chat_service_1.ChatService, contacts_service_1.ContactService],
    })
], AssistantModule);
//# sourceMappingURL=assistant.module.js.map