import { Component, Input } from '@angular/core';
import { defaultLineChartInput, lineChartInput } from '../bar-chart/interfaces';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.css']
})
export class CpuComponent {

  @Input() key: string = ''
  @Input() name: string = ''

  @Input() indexData: any[]=[]
  @Input() placeholderData: any[]=[]
  @Input() keywordData: any[] = []

    indexLineDataTweets: lineChartInput = defaultLineChartInput;
    indexLineDataArticles: lineChartInput = defaultLineChartInput;
    placeholderLineDataTweets: lineChartInput = defaultLineChartInput;
    placeholderLineDataArticles: lineChartInput = defaultLineChartInput;
    keywordLineDataTweetsTesla: lineChartInput = defaultLineChartInput;
    keywordLineDataTweetsGoodnight: lineChartInput = defaultLineChartInput;
    keywordLineDataArticlesMarkets: lineChartInput = defaultLineChartInput;
    keywordLineDataArticlesLonger: lineChartInput = defaultLineChartInput;

  constructor(private filterService: FilterService){
    
  }

   ngOnChanges(){
    this.indexLineDataTweets = this.parseData(this.indexData, 'indexing', 'tweets');
    this.indexLineDataArticles = this.parseData(this.indexData, 'indexing', 'articles');
    this.placeholderLineDataTweets = this.parseData(this.placeholderData, 'placeholderSearching', 'tweets');
    this.placeholderLineDataArticles = this.parseData(this.placeholderData, 'placeholderSearching', 'articles');
    this.keywordLineDataTweetsTesla = this.parseSearchData(this.keywordData, 'keywordSearching', 'Tesla', 'tweets')
    this.keywordLineDataTweetsGoodnight = this.parseSearchData(this.keywordData, 'keywordSearching', '@elonmusk good night from Nigeria', 'tweets')
    this.keywordLineDataArticlesMarkets = this.parseSearchData(this.keywordData, 'keywordSearching', 'Markets', 'articles')
    this.keywordLineDataArticlesLonger = this.parseSearchData(this.keywordData, 'keywordSearching', '2019 Size, Share, Growth, Demand, Analysis, Research, Trends, Forecast, Applications, Products, Types, Technology, Production, Cost, Price, Profit, Leading Suppliers, Manufacturing Plants, Regions, Vendors', 'articles')
  }
  

  parseData(input: any[], title: string, collection: string): lineChartInput{
    const collectionName = collection.charAt(0).toUpperCase() + collection.slice(1);
    const collectionData = input.filter((s)=> s.collection == collection);
    const data = this.filterService.getArrNumber(collectionData, `${this.key}Percent`);
    const res: lineChartInput = {
      title: `${this.name} Percentage while ${title} the ${collectionName}-Collection`,
      data: data,
      xLabels: this.filterService.getxLabels(data)
    }
    return res;

  }

  parseSearchData(input: any[], title: string, keyword: string, collection: string): lineChartInput{
    const collectionName = collection.charAt(0).toUpperCase() + collection.slice(1);;
    const tweetData = input.filter((s)=>s.collection == collection);
    const keywordData = tweetData.filter((s)=> s.keyword == keyword)
    const data = this.filterService.getArrNumber(keywordData, `${this.key}Percent`)
    if (keyword.length > 15) keyword = keyword.substring(0, 15)+'...'
     const res: lineChartInput = {
      title: `${this.name} Percentage while ${title} the ${collectionName}-Collection, Query: ${keyword}`,
      data: data,
      xLabels: this.filterService.getxLabels(data)
    }
    return res;
  }

}
