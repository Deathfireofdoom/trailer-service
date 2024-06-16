import { Request, Response } from 'express';
import TrailerService from '../services/trailer';
import { validateUrl } from '../utils/url';

export const getTrailerUrls = (trailerService: TrailerService) => {
    return async (req: Request, res: Response): Promise<void> => {
        const viaplayUrl = req.query.url as string;

        if (!viaplayUrl) {
            res.status(400).send("Missing 'url' parameter");
            return;
        }

        if (!validateUrl(viaplayUrl)) {
            res.status(400).send("Invalid 'url' parameter");
            return;
        }

        try {
            const trailerUrls = await trailerService.getTrailerUrls(viaplayUrl);
            
            if (trailerUrls.length > 0) {
                res.json(trailerUrls);
                return;
            }
            res.status(404).send('No trailers found')
            return;

        } catch (error) {
            console.error('Error getting trailer URLs:', error);
            res.status(500).send('Internal server error');
            return;
        }
    };
};

