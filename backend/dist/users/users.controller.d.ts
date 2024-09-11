import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserDto: CreateUserDto): Promise<import("./schemas/user.schema").User>;
    getUserById(id: string): Promise<import("./schemas/user.schema").User>;
    updateConversation(id: string, updateConversationDto: UpdateConversationDto): Promise<import("./schemas/user.schema").User>;
}
