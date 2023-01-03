"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const message_type_1 = require("../sidekick/message-type");
function handle(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const PATH = process.env.CONTACTS_PATH;
        const CHAT_ID = process.env.GROUP_ID;
        console.log(PATH, CHAT_ID);
        const x = fs_1.default.readdirSync(PATH);
        console.log(x);
        if (x.length === 0)
            process.kill(process.pid, 'SIGHUP');
        const n = `91${x[0]}@s.whatsapp.net`;
        try {
            const res = yield client.sock.groupParticipantsUpdate(CHAT_ID, [n], 'add');
            console.log(res);
        }
        catch (_a) {
            try {
                const code = yield client.sock.groupInviteCode(CHAT_ID);
                console.log(code);
                const response = yield client.sendMessage(n, "Hi! Greetings from TRYST 2023! You are invited to join our campus ambassador program WhatsApp Group! https://chat.whatsapp.com/" + code, message_type_1.MessageType.text);
                console.log(response);
            }
            catch (_b) { }
        }
        fs_1.default.rmSync(`${PATH}/${x[0]}`);
        process.kill(process.pid, 'SIGHUP');
    });
}
exports.default = handle;
//# sourceMappingURL=syncadd.js.map