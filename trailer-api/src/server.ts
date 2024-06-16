import express from 'express';
import morgan from 'morgan';

import { PORT } from './config/config';

// routers
import healthRouter from './routes/health';
import trailerRouter from './routes/trailer';
import utilsRouter from './routes/utils';

const app = express();

// middleware
app.use(express.json());
app.use(morgan('combined'));  // logging

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/trailer', trailerRouter);
app.use('/non-production/utils', utilsRouter);

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch ( error ) {
        console.error('failed to start the server: ', error);
    }
}

startServer();