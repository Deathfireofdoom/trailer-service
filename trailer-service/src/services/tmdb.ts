import HttpService from "./http";
import { TMDB_BASE_URL, TMDB_TOKEN } from "../config/config";

class TMDBService {
    private httpService: HttpService;
    private headers: Record<string, string>;

    constructor(httpService: HttpService) {
        this.httpService = httpService;
        this.headers = {
            'Authorization': `Bearer ${TMDB_TOKEN}`
        };
    }

    public async getTrailerUrlsByExternalId(externalId: string, externalSource: string): Promise<string[]> {
        try {
            // fetch the ID by the external ID and source
            const movieId = await this.getIdByExternalId(externalId, externalSource);
            if (!movieId) {
                throw new Error("Movie ID not found");
            }
            // use the movie ID to fetch trailer URLs
            return await this.getTrailerUrlsById(movieId);
        } catch (error) {
            console.error(`Error fetching trailers by external ID: ${error}`);
            throw error;
        }
    }

    private async getIdByExternalId(externalId: string, externalSource: string): Promise<Number> {
        const url = `${TMDB_BASE_URL}/3/find/${externalId}?external_source=${externalSource}`;
        const data = await this.httpService.fetchUrl(url, this.headers);
        
        if (data.movie_results && data.movie_results.length > 0) {
            return data.movie_results[0].id;
        } else {
            throw new Error("No results found");
        }
    } 

    private async getTrailerUrlsById(id: Number): Promise<string[]> {
        const url = `${TMDB_BASE_URL}/3/movie/${id}/videos`;
        const data = await this.httpService.fetchUrl(url, this.headers);

        if (data.results && Array.isArray(data.results)) {
            return data.results
                .filter((video: any) => video.site === "YouTube" && video.type === "Trailer")
                .map((video: any) => `https://www.youtube.com/watch?v=${video.key}`);
        } else {
            throw new Error("No video results found");
        }
    }
}

export default TMDBService;