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
    name: "addmulti",
    description: "Adds multiple numbers to a group",
    extendedDescription: "Give a list of numbers to add",
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(BotsApp.chatId);
                if (!BotsApp.isGroup) {
                    client.sendMessage(BotsApp.chatId, db_js_1.default.general.NOT_A_GROUP, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                let members = {};
                BotsApp.groupMembers.forEach(m => members[m.id] = true);
                if (!BotsApp.isBotGroupAdmin) {
                    client.sendMessage(BotsApp.chatId, db_js_1.default.general.BOT_NOT_ADMIN, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                if (args.length === 0) {
                    client.sendMessage(BotsApp.chatId, ADD.NO_ARG_ERROR, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                let ok = [];
                args.forEach((n) => __awaiter(this, void 0, void 0, function* () {
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
                    if (!members[number]) {
                        ok.push(number);
                        members[number] = false;
                    }
                }));
                console.log({ ok });
                const response = yield client.sock.groupParticipantsUpdate(BotsApp.chatId, ok, 'add');
                console.log({ response });
                yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                BotsApp.groupMembers.forEach(m => members[m.id] = true);
                let done = ok.filter(m => members[m] === true);
                yield client.sendMessage(BotsApp.chatId, "*Added* \n```" + done.map(m => '+' + m.split('@')[0]).join('\n') + "```", message_type_1.MessageType.text);
                let notok = ok.filter(m => members[m] === false);
                notok.forEach((n) => __awaiter(this, void 0, void 0, function* () {
                    const code = yield client.sock.groupInviteCode(BotsApp.chatId);
                    yield client.sendMessage(n, "```Hi! You have been invited to join this WhatsApp group!``` https://chat.whatsapp.com/" + code, message_type_1.MessageType.text);
                }));
                if (notok.length !== 0)
                    yield client.sendMessage(BotsApp.chatId, "*Invited* \n```" + notok.map(m => '+' + m.split('@')[0]).join('\n') + "```", message_type_1.MessageType.text);
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
//# sourceMappingURL=addmulti.js.map