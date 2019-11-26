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
            ret = this.parseContent(query, content);
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
        let dicGroups: {[Key: string]: ResultGroupModel} = {};
        const rgx = new RegExp('\#extinf.+tvg-id\=\"(?<id>.+).+tvg-logo\=\"(?<logo>.+)\".+group-title\=\"(?<group>.+)\"\,(?<name>.+)', 'gmi');

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
            // if (line.indexOf('#EXTINF') >= 0) {
            //     const arrTvg = line.split('tvg-');
            //     const part2 = arrTvg[arrTvg.length-1];
            //     const arrGt = part2.split('group-title')[1];
            //     const group = arrGt.replace("=", "").split(',')[0].replace("\"", "").replace("\"", "");
            //     const name = arrTvg[2].replace('name=', '').replace('\"', '').replace("\"", "");
            //     const logo = part2.split('group-title')[0].replace('logo=', '').replace('\"', '').replace("\"", "");
                
            //     const groupMatch = group.toUpperCase().indexOf(query.toUpperCase()) >= 0;
            //     const nameMatch = name.toUpperCase().indexOf(query.toUpperCase()) >= 0;

            //     if (groupMatch || nameMatch) {
            //         ret[group] = ret[group] || new ResultGroupModel(group);
            //         ret[group].Items = ret[group].Items || [];
            //         ret[group].Items.push(new ResultModel(name, group, logo));
            //     }
            // }
        });

        let ret: ResultGroupModel[] = [];
        Object.keys(dicGroups).forEach(key =>{ ret.push(dicGroups[key]); });

        return ret;
    }
}

export const SearchServiceInstance = new SearchService();
