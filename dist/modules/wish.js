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
const db_js_1 = __importDefault(require("../lib/db.js"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const config_1 = __importDefault(require("../config"));
const message_type_1 = require("../sidekick/message-type");
const ADD = db_js_1.default.add;
module.exports = {
    name: "wish",
    description: "Wishes a list of people",
    extendedDescription: "reply to the list of numbers with names, and tag with '.wish <Greeting>'",
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!BotsApp.isTextReply) {
                    client.sendMessage(BotsApp.chatId, "Create a message with the list of contacts (numbers and names) and tag it with this message", message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                if (args.length === 0) {
                    client.sendMessage(BotsApp.chatId, ADD.NO_ARG_ERROR, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                let ok = [];
                let names = {};
                const rows = BotsApp.replyMessage.split('\n');
                rows.forEach((r) => {
                    const n = r.split(' ')[0];
                    const name = r.replace(n, '');
                    if (Number.isNaN(parseInt(n)) || n[0] === "+" || n.length < 10) {
                        client.sendMessage(BotsApp.chatId, ADD.NUMBER_SYNTAX_ERROR, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        return;
                    }
                    let number;
                    if (n.length === 10 && !(Number.isNaN(parseInt(n)))) {
                        number = config_1.default.COUNTRY_CODE + n;
                    }
                    else {
                        number = n;
                    }
                    number += "@s.whatsapp.net";
                    ok.push(number);
                    names[number] = name;
                });
                for (let i = 0; i < ok.length; i++) {
                    const msg = `${args.join(' ')}${names[ok[i]]}!`;
                    yield client.sendMessage(ok[i], msg, message_type_1.MessageType.text);
                }
                yield client.sendMessage(BotsApp.chatId, "Sent", message_type_1.MessageType.text);
            }
            catch (err) {
                if (err.status == 400) {
                    yield input_sanitization_1.default.handleError(err, client, BotsApp, ADD.NOT_ON_WHATSAPP).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                }
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
            return;
        });
    },
};
//# sourceMappingURL=wish.js.map