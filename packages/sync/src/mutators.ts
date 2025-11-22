import type { WriteTransaction } from "replicache";

export interface ChatMessage {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: number;
}

export const mutators = {
    async createMessage(tx: WriteTransaction, message: ChatMessage) {
        await tx.set(`message/${message.id}`, message);
    },

    async deleteMessage(tx: WriteTransaction, id: string) {
        await tx.del(`message/${id}`);
    },
};

export type Mutators = typeof mutators;
