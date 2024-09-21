import { ContactService } from './contacts.service';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    getAllContacts(req: any): Promise<import("../schemas/chat-assistant.schema").ChatAssistant[]>;
}
