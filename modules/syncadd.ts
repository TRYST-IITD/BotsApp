import Client from "../sidekick/client";
import fs from 'fs';
import { MessageType } from "../sidekick/message-type";

async function handle(client: Client): Promise<void> {
        const PATH = process.env.CONTACTS_PATH;
        const CHAT_ID = process.env.GROUP_ID;
        console.log(PATH, CHAT_ID);
        const x = fs.readdirSync(PATH);
        console.log(x);
        if (x.length === 0)
            process.kill(process.pid, 'SIGHUP');
        const n = `91${x[0]}@s.whatsapp.net`;
        try {
            const res = await client.sock.groupParticipantsUpdate(CHAT_ID, [n], 'add');
            console.log(res);
        } catch {
            try {
                const code = await client.sock.groupInviteCode(CHAT_ID);
                console.log(code);
                const response = await client.sendMessage(
                    n,
                    "Hi! Greetings from TRYST 2023! You are invited to join our campus ambassador program WhatsApp Group! https://chat.whatsapp.com/"+code,
                    MessageType.text
                );
                console.log(response);
            } catch {}
        }
        fs.rmSync(`${PATH}/${x[0]}`);
        process.kill(process.pid, 'SIGHUP');
}

export default handle;