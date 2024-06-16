import express from 'express';
import { trailerService } from '../services/services';
import { getTrailerUrls } from '../controllers/trailer';

const trailerRouter = express.Router();

trailerRouter.get('/', getTrailerUrls(trailerService));

export default trailerRouter;
