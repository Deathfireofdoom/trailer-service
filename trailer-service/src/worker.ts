import { sqsClient } from "./clients/sqs";
import SQSService from "./services/sqs";
import TrailerService from "./services/trailer";
import WorkerService from "./services/worker";
import DatabaseService from "./services/database";
import TMDBService from "./services/tmdb";
import HttpService from "./services/http";
import { Pool } from "pg";
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from "./config/config";
import { sleep } from "./utils/sleep";

async function initializeAndStartWorker() {
    // This pool does not make sense, since we only will be running 
    // one "message" at a time. So this needs to be addressed.
    const pool = new Pool({
        user: POSTGRES_USER,
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        password: POSTGRES_PASSWORD,
        port: parseInt(POSTGRES_PORT),
    });
    
    const httpService = new HttpService();
    const tmdbService = new TMDBService(httpService); 
    const databaseService = new DatabaseService(pool); 
    const trailerService = new TrailerService(httpService, tmdbService, databaseService);
    const sqsService = new SQSService(sqsClient);
    const workerService = new WorkerService(trailerService, sqsService); 

    // This is just for this project - make it easier to start etc.
    // we dont create queues like this in prod
    await sleep(30000);
    await sqsService.ensureQueueExists();

    try {
        console.log("Starting the worker...");
        await workerService.start();
    } catch (error) {
        console.error("Failed to start the worker:", error);
        throw error;
    }
}

initializeAndStartWorker().then(() => console.log("worker working")).catch(error => console.error('something went wrong', error))