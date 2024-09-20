"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNameAndBackground = void 0;
function extractNameAndBackground(response) {
    const nameMatch = response.match(/Name:\s*(.*)/);
    const backgroundMatch = response.match(/Background:\s*([\s\S]*)/);
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown Name';
    const background = backgroundMatch ? backgroundMatch[1].trim() : 'Unknown Background';
    return { name, background };
}
exports.extractNameAndBackground = extractNameAndBackground;
//# sourceMappingURL=utils.js.map