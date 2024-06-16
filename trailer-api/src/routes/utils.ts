
import express from 'express';
import { trailerService } from '../services/services';
import { migrate, publishNewContent } from '../controllers/utils';

const utilsRouter = express.Router();

utilsRouter.post('/publish', publishNewContent)
utilsRouter.post('/migrate', migrate(trailerService));

export default utilsRouter;