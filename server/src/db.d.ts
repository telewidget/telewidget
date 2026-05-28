export declare const CHAT_SCHEMA_STATEMENTS: string[];
export declare function ensureChatSchema(): void;
export declare function upsertSession(sessionId: string, name: string, phone: string): void;
export declare function getSession(sessionId: string): any;
export declare function getSessionByThread(telegramThreadId: number): any;
export declare function updateSessionThread(sessionId: string, telegramThreadId: number, telegramTopicName: string): void;
export declare function insertMessage(sessionId: string, direction: 'visitor' | 'admin', body: string, telegramMessageId?: number): {
    id: string;
    sessionId: string;
    direction: "visitor" | "admin";
    body: string;
    createdAt: string;
};
export declare function listMessages(sessionId: string): any[];
//# sourceMappingURL=db.d.ts.map