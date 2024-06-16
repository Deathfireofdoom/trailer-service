import CacheService from "./cache";
import DatabaseService from "./database";
import { hashUrl } from "../utils/hash";
import { ICacheService } from "../interfaces/ICacheService";
import { IDatabaseService } from "../interfaces/IDatabaseService";


class TrailerService {
    private cacheService: ICacheService;
    private databaseService: IDatabaseService;

    constructor(cacheService: CacheService, databaseService: DatabaseService) {
        this.cacheService = cacheService;
        this.databaseService = databaseService;
    }

    public async getTrailerUrls(viaplayUrl: string): Promise<string[]> {
        // Note: The initial thought was to fetch the imdb-id from viaplay url
        //       however, this would mean one extra http-request, which is slow,
        //       so instead I decided to use a hash of the url as the key. 
        //
        //      This also removes one extra depency from the system. So this system
        //      would be working even if the viaplay-system was down.
        //
        //      Also realized a bit to late that I should have saved the non
        //      hashed url somehow, making the data a bit more readable.
        const urlHash = hashUrl(viaplayUrl);
        const cacheKey = `trailer:${urlHash}`;
       
        const trailerUrls = await this.cacheService.get(cacheKey);

        if (trailerUrls) {
            return JSON.parse(trailerUrls);
        }
        
        const trailerData = await this.databaseService.getTrailerUrlsByUrlHash(urlHash);
        if (trailerData) {
            this.cacheService.set(cacheKey, JSON.stringify(trailerData));
            return trailerData;
        }
        return [];
    }

    // THIS FUNCTION IS BECUASE I DID NOT BOTHER SETTING UP ANY
    // REAL MIGRATION STEP. 
    public async migrateDatabase(): Promise<void> {
        await this.databaseService.migrate();
    }
}

export default TrailerService;