import * as Fs from 'fs';
const { promisify } = require('util');
import { ResultModel } from '../models/result.model';
import { ResultGroupModel } from '../models/result-group.model';
import { DownloaderServiceInstance } from './downloader.service';
const _ = require('lodash');

export class SearchService {

    constructor() {

    }

    async Search(url: string, query: string): Promise<ResultGroupModel[]> {
        
        let ret: ResultGroupModel[] = [];

        let filename = this.clearUrl(url) + '.m3u';
        
        const filePath = await DownloaderServiceInstance.downloadFile(url, filename);                        
        const readFile = promisify(Fs.readFile);
        const content = await readFile(filePath, 'utf8');

        if (content) {
            console.log('content found: ', content.substring(0, 30));

            ret = this.parseContent(query, content);
        }
        else{
            console.log('content NOT found');
        }
        
        return ret;
                
    }
    
    private clearUrl(url: string): string {
        let ret = url;
        let rgx = RegExp('([htp\:\/\?\=\&\.])', 'g');
        ret = ret.replace(rgx, '');
        
        return ret;
    }

    private parseContent(query: string, content: string): ResultGroupModel[] {        
        const lines = content.split('\n');

        console.log('lines count', lines.length);

        let dicGroups: {[Key: string]: ResultGroupModel} = {};
        const rgx = new RegExp('\#extinf.+tvg-logo\=\"(?<logo>.+)\".+group-title\=\"(?<group>.+)\"\,(?<name>.+)', 'gmi');

        lines.forEach((line) => {
            const match = rgx.exec(line);

            if (match) {
                const groupMatch = match.groups.group.toUpperCase().indexOf(query.toUpperCase()) >= 0;
                const nameMatch = match.groups.name.toUpperCase().indexOf(query.toUpperCase()) >= 0;

                if (groupMatch || nameMatch) {
                    dicGroups[match.groups.group] = dicGroups[match.groups.group] || new ResultGroupModel(match.groups.group);
                    dicGroups[match.groups.group].Items = dicGroups[match.groups.group].Items || [];
                    dicGroups[match.groups.group].Items.push(new ResultModel(match.groups.name, match.groups.group, match.groups.logo));
                }
            }

        });

        let ret: ResultGroupModel[] = [];
        Object.keys(dicGroups).forEach(key =>{ ret.push(dicGroups[key]); });

        return ret;
    }
}

export const SearchServiceInstance = new SearchService();
