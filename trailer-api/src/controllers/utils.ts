import { Request, Response } from 'express';
import TrailerService from "../services/trailer";
import { sqsClient } from '../clients/sqs';
import { SendMessageCommand, CreateQueueCommand } from '@aws-sdk/client-sqs';
import { SQS_QUEUE_URL, SQS_QUEUE_NAME } from '../config/config';

// This files contains utils-functions, these functions is not 
// "part" of the system. Instead they help with setting up
// the system so one can test it out. That also why they are 
// a bit all over the place.
//
// In production other methods would have been used.
export const publishNewContent = async (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).json({ error: 'Body must be provided in the request.' });
        return; 
    }

    if (!req.body.url) {
        res.status(400).json({ error: 'URL must be provided in the request body.' });
        return;
    }

    const url = req.body.url;

    const params = {
        QueueUrl: SQS_QUEUE_URL, 
        MessageBody: JSON.stringify({ url }), 
    };

    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        res.status(200).json({
            message: 'Content published successfully.',
            messageId: data.MessageId
        });
    } catch (error) {
        console.error('Error publishing content:', error);
        res.status(500).json({ error: 'Failed to publish content.' });
    }
};

export const migrate = (trailerService: TrailerService) => {
    return async (_: Request, res: Response): Promise<void> => {
        try {
            await trailerService.migrateDatabase();
            res.status(200).send("Database migrated");
        } catch ( error ) {
            console.error('Error migrating database:', error);
            res.status(500).send('Internal server error');
        }
    };
};
