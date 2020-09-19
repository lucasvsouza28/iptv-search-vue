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

        console.log('Tentando baixar m3u da url: ' + url);
        
        const response = await Axios({
          url,
          method: 'GET',
          responseType: 'stream'
        })
      
        response.data.pipe(writer)
      
        return new Promise((resolve, reject) => {
          writer.on('finish', (err, file) => {
            if (err) reject(err);
            
            console.log('Arquivo baixado com sucesso');
            resolve(path);
          });
          writer.on('error', (err) => {
            console.log('Erro ao baixar arquivo: ' + err.message);
            reject();
          });
        })
      }


}

export const DownloaderServiceInstance = new DownloaderService();