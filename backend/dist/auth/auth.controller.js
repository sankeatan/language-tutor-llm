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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async register(body) {
        const user = await this.authService.register(body.email, body.password, body.username);
        return { message: 'User registered successfully', user };
    }
    async login(body) {
        const { accessToken, refreshToken, userId } = await this.authService.login(body.email, body.password);
        console.log('Auth Controller Access Token:', accessToken);
        console.log('Auth Controller Refresh Token:', refreshToken);
        return { accessToken, refreshToken, userId };
    }
    verifyToken(req) {
        const token = req.cookies?.['token'];
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        try {
            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            return { valid: true, decoded };
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async refreshToken(refreshToken) {
        console.log('Received refresh token for refresh:', refreshToken);
        const tokens = await this.authService.refreshToken(refreshToken);
        if (!tokens) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        console.log('Refreshed tokens:', tokens);
        return tokens;
    }
    logout(res) {
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logged out successfully' });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('verify-token'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map