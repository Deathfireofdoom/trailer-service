export interface IDatabaseService {
    getTrailerUrlsByUrlHash(urlHash: string): Promise<string[] | undefined>;
    migrate(): Promise<void>; // should not be here in prod
}