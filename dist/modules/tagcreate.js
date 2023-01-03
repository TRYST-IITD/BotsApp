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
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const message_type_1 = require("../sidekick/message-type");
const config_1 = __importDefault(require("../config"));
module.exports = {
    name: "tagcreate",
    description: "Creates a tagging message",
    extendedDescription: "Give tag message and list of numbers",
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let members = [];
                for (let i = 1; i < args.length; i++) {
                    let n = args[i];
                    if (n.length === 10)
                        n = config_1.default.COUNTRY_CODE + n;
                    n += '@s.whatsapp.net';
                    members.push(n);
                }
                client.sendMessage(BotsApp.chatId, args[0], message_type_1.MessageType.text, {
                    contextInfo: {
                        mentionedJid: members,
                    },
                }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
            return;
        });
    },
};
//# sourceMappingURL=tagcreate.js.map