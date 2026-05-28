export declare function buildTelegramTopicName(name: string, phone: string): string;
export declare function buildTelegramVisitorMessage(name: string, phone: string, message: string): string;
export declare function createTelegramTopic(name: string, phone: string): Promise<{
    threadId: any;
    topicName: string;
}>;
export declare function sendTelegramMessage(threadId: number, text: string): Promise<any>;
export declare function sendTelegramDocument(threadId: number, file: Express.Multer.File, caption: string): Promise<any>;
//# sourceMappingURL=telegram.d.ts.map