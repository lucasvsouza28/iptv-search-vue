import * as Fs from 'fs'; 
import * as Path from 'path';  
const Axios = require('axios');

export class DownloaderService {

    constructor(){}

    async downloadFile (url: string, filename: string, forceDownload: boolean = false): Promise<any> {
        const path = Path.resolve('./api/src/public/uploads/', filename);

        if (Fs.existsSync(path) && !forceDownload)
            return new Promise((resolve, reject) => { resolve(path); });

        const writer = Fs.createWriteStream(path);
    
        const response = await Axios({
          url,
          method: 'GET',
          responseType: 'stream'
        })
      
        response.data.pipe(writer)
      
        return new Promise((resolve, reject) => {
          writer.on('finish', () => { resolve(path); });
          writer.on('error', reject);
        })
      }


}

export const DownloaderServiceInstance = new DownloaderService();