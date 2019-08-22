import { ResultModel } from "./result.model";

export class ResultGroupModel {
    Items: ResultModel[];

    constructor(public groupName: string){
        
    }
}