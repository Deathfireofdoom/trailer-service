import DatabaseService from "./database";
import HttpService from "./http";
import TMDBService from "./tmdb";
import { NewContentMessage } from "../models/messages";
import { hashUrl } from "../utils/hash";


class TrailerService {
    private httpService: HttpService;
    private tmdbService: TMDBService;
    private databaseService: DatabaseService;


    constructor(httpService: HttpService, tmdbService: TMDBService, databaseService: DatabaseService) {
        this.httpService = httpService;
        this.tmdbService = tmdbService;
        this.databaseService = databaseService;
    }

    public async handleNewContent(message: NewContentMessage): Promise<Boolean> {
        try {
            // get the imdb-id from viaplay
            const data = await this.httpService.fetchUrl(message.url);
            const imdbId = data._embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content.imdb.id;
            
            // get the urls from tmdb
            const trailerUrls = await this.tmdbService.getTrailerUrlsByExternalId(imdbId, 'imdb_id');
            
            // save the data to database
            await this.databaseService.upsertTrailerByImdbId(hashUrl(message.url), trailerUrls);

            // we should invalidate redis-cache here - TODO or we do write-through

            // return true so worker can ack-message
            return true;
        } catch ( error ) {
            // return false so worker won't ack-message
            return false;
        }
    }
}


export default TrailerService;