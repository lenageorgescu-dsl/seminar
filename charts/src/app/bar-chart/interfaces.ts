export type barChartInput = {
    title: string;
    labels: string[];
    datasets: barChartNumbers[]
}

export type barChartNumbers = {
    data: number[], label: string
}

export type lineChartInput = {
    title: string,
    data: number[][],
    xLabels: string[],
}


export const defaultBarChartInput = {title: 'foo', labels: ['bar', 'foo'],datasets: [{data: [0, 1], label: 'qux'}] }
export const defaultLineChartInput = {title: 'baz', data: [[ 65, 59, 80, 81, 56, 55, 40 ], [ 28, 48, 40, 19, 86, 27, 90 ], [ 180, 480, 770, 90, 1000, 270, 400 ]], xLabels:['foo', 'bar', 'baz']}


export const defaultLabels = ['ElasticSearch', 'MeiliSearch', 'Typesense']



// export interface placeholderSearch {
//     experiment: string,
//     engine: string,
//     operation: string,
//     collection: string,
//     hits: number,
//     startTime: number,
//     endTime: number,
//     running: number,
//     memPercent: number[],
//     cpuPercent: number[]
// }


// export interface index{
//     experiment: string,
//     engine: string,
//     operation: string,
//     collection: string,
//     startTime: number,
//     endTime: number,
//     running: number, 
//     memPercent: number[],
//     cpuPercent: number[],
//     storageMega: number,
// }

// export interface keywordSearch {
//     experiment: string,
//     engine: string,
//     operation: string,
//     collection: string,
//     keyword: string,
//     hits: number,
//     startTime: number,
//     endTime: number,
//     running: number,
//     memPercent: number[],
//     cpuPercent: number[]
// }

// export interface boolQuerySearch {
//     experiment: string,
//     engine: string,
//     operation: string,
//     collection: string,
//     boolQuery: BoolQuery,
//     hits: number,
//     startTime: number,
//     endTime: number,
//     running: number,
//     memPercent: number[],
//     cpuPercent: number[]
// }

// export interface init {
//     experiment: string,
//     engine: string,
//     operation: string,
//     memPercent: number[],
//     cpuPercent: number[],
//     storageMega: number,
// }

// export type BoolQuery = {
//   and: any[];
//   or: any[];
// };


// export type numericalData = {
//     meili: number,
//     typesense: number,
//     elastic: number
// }

// export type numericalArrayData = {
//     meili: number[],
//     typesense: number[],
//     elastic: number[]
// }

// export interface StorageStats{
//     name: "Storage"
//     init: numericalData, 
//     index: {articles: numericalData, tweets: numericalData}
// }

// export interface CpuStats{
//     name: "CPU"
//     init: numericalData
//     index: {articles: numericalArrayData, tweets: numericalArrayData}
//     search: searchStatsArray
// }


// export interface MemStats{
//     name: "Memory"
//     init: numericalData
//     tweets: numericalArrayData
//     articles: numericalArrayData
//     search: searchStatsArray
// }

// export interface SpeedStats {
//     name: "Speed",
//     index: {articles: numericalData, tweets: numericalData},
//     search: searchStats
// }

// export interface HitStats{
//     name: 'Hits',
//     search: searchStats
// }

// export type searchStatsArray = {
//     placeholderSearch: {articles: numericalArrayData, tweets: numericalArrayData},
//     keyWordSearch: {articles: numericalArrayData, tweets: numericalArrayData},
//     boolQuerySearch: {articles: numericalArrayData, tweets: numericalArrayData}
// }

// export type searchStats = {
//     placeholderSearch: {articles: numericalData, tweets: numericalData},
//     keyWordSearch: {articles: numericalData, tweets: numericalData},
//     boolQuerySearch: {articles: numericalData, tweets: numericalData}
// }





//export interface GeneralData {
//   experiment: string,
//   engine: string,
//   operation: string,
//   memPercent: number[],
//   cpuPercent: number[]
// }

// export interface SearchData extends NonInitialData{
//   type: 'Search'
//   collection: string;
//   hits: 
//   number;
// }

// export interface IndexData extends NonInitialData{
//   name: 'Index'
//   collection: string,
//   storageMega: number
// }

// export interface BoolQuerySearchData extends SearchData{
//   name: 'BoolquerySearch',
//   boolquery: BoolQuery
// }

// export interface PlaceholderSearchData extends SearchData{
//   name: 'PlaceholderSearch'
// }

// export interface KeyWordSearchData extends SearchData{
//   name: 'KeyWordSearch',
//   keyword: string
// }

// export interface NonInitialData extends GeneralData{
//   startTime: number,
//   endTime: number,
//   running: number
// }

// export interface InitialData extends GeneralData {
//   name: 'Init',
//   storageMega: number,
// }




