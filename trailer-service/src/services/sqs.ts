import { SQSClient, ReceiveMessageCommand, ReceiveMessageCommandOutput, DeleteMessageCommand, CreateQueueCommand, CreateQueueCommandInput, CreateQueueResult } from "@aws-sdk/client-sqs";
import { SQS_QUEUE_URL, SQS_QUEUE_NAME } from "../config/config";

class SQSService {
    private client: SQSClient;

    constructor(client: SQSClient) {
        this.client = client;
    }

    // This is "util" function to make the easier to run locally.
    // irl queues should be created outside application code, I would
    // have done it with terraform.
    public async ensureQueueExists(): Promise<void> {
        const params: CreateQueueCommandInput = {
            QueueName: SQS_QUEUE_NAME, 
        };

        try {
            const { QueueUrl }: CreateQueueResult = await this.client.send(new CreateQueueCommand(params));
            console.log(`Queue created or already exists: ${QueueUrl}`);
        } catch (error) {
            console.error("Failed to create queue:", error);
            throw new Error("Failed to create SQS queue");
        }
    }

    public async receiveMessages(): Promise<ReceiveMessageCommandOutput["Messages"]> {
        const params = {
            QueueUrl: SQS_QUEUE_URL,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20
        };

        try {
            const data = await this.client.send(new ReceiveMessageCommand(params));
            return data.Messages || [];
        } catch (err) {
            console.error("Error receiving messages:", err);
            throw new Error("Error receiving messages from SQS");
        }
    }

    public async deleteMessage(receiptHandle: string): Promise<void> {
        const params = {
            QueueUrl: SQS_QUEUE_URL,
            ReceiptHandle: receiptHandle
        };

        try {
            await this.client.send(new DeleteMessageCommand(params));
            console.log("Message deleted successfully");
        } catch (err) {
            console.error("Error deleting message:", err);
            throw new Error("Error deleting message from SQS");
        }
    }
}

export default SQSService;
