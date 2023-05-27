export type barChartInput = {
    title: string;
    labels: string[];
    datasets: barChartNumbers[]
}

export type barChartNumbers = {
    data: number[], label: string, backgroundColor?: string
}

export type lineChartInput = {
    title: string,
    data: number[][],
    xLabels: string[],
}


export const defaultBarChartInput = {title: 'foo', labels: ['bar', 'foo'],datasets: [{data: [0, 1], label: 'qux'}] }
export const defaultLineChartInput = {title: 'baz', data: [[ 65, 59, 80, 81, 56, 55, 40 ], [ 28, 48, 40, 19, 86, 27, 90 ], [ 180, 480, 770, 90, 1000, 270, 400 ]], xLabels:['foo','bar','baz']}


export const defaultLabels = ['ElasticSearch', 'MeiliSearch', 'Typesense']


