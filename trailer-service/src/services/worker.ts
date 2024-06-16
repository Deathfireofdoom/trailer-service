import SQSService from "./sqs";
import TrailerService from "./trailer";
import { Message } from "@aws-sdk/client-sqs";
import { NewContentMessage } from "../models/messages";

class WorkerService {
    private trailerService: TrailerService;
    private sqsService: SQSService;

    constructor(trailerService: TrailerService, sqsService: SQSService) {
        this.trailerService = trailerService;
        this.sqsService = sqsService;
    }

    public async start(): Promise<void> {
        console.log("Worker started, listening for messages...");
        while (true) {
            const messages = await this.sqsService.receiveMessages();
            if (messages) {
                for (const message of messages) {
                    await this.handleMessage(message);
                }
            }
        }
    }

    private async handleMessage(message: Message): Promise<void> {
        try {
            console.log("Received message:", message.Body);
            if (!message.Body) {
                throw Error('Message is missing body')
            }
            
            const content: NewContentMessage = JSON.parse(message.Body);
            this.validateNewContentMessage(content);
            
            await this.trailerService.handleNewContent(content);
            
            if (!message.ReceiptHandle) {
                throw Error('Message is missing receipthandle, how?')
            }
            
            await this.sqsService.deleteMessage(message.ReceiptHandle);
            console.log("Message processed and deleted successfully.");
        } catch (error) {
            console.error("Failed to process message:", error);
        }
    }

    private validateNewContentMessage(content: any): asserts content is NewContentMessage {
        if (typeof content !== 'object' || typeof content.url !== 'string') {
            throw new TypeError("Invalid message format: Expected { url: string }");
        }
    }
}

export default WorkerService;