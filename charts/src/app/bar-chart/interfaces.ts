export interface placeholderSearch {
    experiment: string,
    engine: string,
    operation: string,
    collection: string,
    hits: number,
    startTime: number,
    endTime: number,
    running: number,
    memPercent: number[],
    cpuPercent: number[]
}


export interface index{
    experiment: string,
    engine: string,
    operation: string,
    collection: string,
    startTime: number,
    endTime: number,
    running: number, 
    memPercent: number[],
    cpuPercent: number[],
    storageMega: number,
}

export interface keywordSearch {
    experiment: string,
    engine: string,
    operation: string,
    collection: string,
    keyword: string,
    hits: number,
    startTime: number,
    endTime: number,
    running: number,
    memPercent: number[],
    cpuPercent: number[]
}

export interface boolQuerySearch {
    experiment: string,
    engine: string,
    operation: string,
    collection: string,
    boolQuery: BoolQuery,
    hits: number,
    startTime: number,
    endTime: number,
    running: number,
    memPercent: number[],
    cpuPercent: number[]
}

export interface init {
    experiment: string,
    engine: string,
    operation: string,
    memPercent: number[],
    cpuPercent: number[],
    storageMega: number,
}

export type BoolQuery = {
  and: any[];
  or: any[];
};
