import { createHash } from "crypto";

export const hashUrl = (url: string): string => {
    const hash = createHash('sha256'); 
    hash.update(url);                 
    return hash.digest('hex');
}
