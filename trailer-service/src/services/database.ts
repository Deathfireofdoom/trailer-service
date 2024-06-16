import { Pool } from "pg";

class DatabaseService {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    public async upsertTrailerByImdbId(urlHash: string, trailers: string[]) {
        const query = `
            INSERT INTO trailers (url_hash, trailers)
            VALUES ($1, $2)
            ON CONFLICT (url_hash)
            DO UPDATE SET trailers = EXCLUDED.trailers, updated_at = NOW();
        `;

        try {
            const result = await this.pool.query(query, [urlHash, trailers]);
            console.log('Upsert successful:', result.rowCount);
            return result;
        } catch (err) {
            console.error('Error during upsert:', err);
            throw err;
        }
    }
}

export default DatabaseService;