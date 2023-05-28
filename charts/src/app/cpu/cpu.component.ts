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
   @Input() boolqueryData: any[] = []


    indexLineDataTweets: lineChartInput = defaultLineChartInput;
    indexLineDataArticles: lineChartInput = defaultLineChartInput;
    placeholderLineDataTweets: lineChartInput = defaultLineChartInput;
    placeholderLineDataArticles: lineChartInput = defaultLineChartInput;
    keywordLineDataTweetsTesla: lineChartInput = defaultLineChartInput;
    keywordLineDataTweetsGoodnight: lineChartInput = defaultLineChartInput;
    keywordLineDataArticlesMarkets: lineChartInput = defaultLineChartInput;
    keywordLineDataArticlesLonger: lineChartInput = defaultLineChartInput;
    boolqueryLineDataTweetsObama: lineChartInput = defaultLineChartInput;
    boolqueryLineDataTweetsEisenhower: lineChartInput = defaultLineChartInput;
    boolqueryLineDataArticlesYear: lineChartInput = defaultLineChartInput;
    boolqueryLineDataArticlesKeynes: lineChartInput = defaultLineChartInput;


  constructor(private filterService: FilterService){
    
  }

   ngOnChanges(){
    this.indexLineDataTweets = this.parseData(this.indexData, 'indexing', 'tweets');
    this.indexLineDataArticles = this.parseData(this.indexData, 'indexing', 'articles');
    this.placeholderLineDataTweets = this.parseData(this.placeholderData, 'placeholderSearching', 'tweets');
    this.placeholderLineDataArticles = this.parseData(this.placeholderData, 'placeholderSearching', 'articles');
    this.keywordLineDataTweetsTesla = this.parseSearchData(this.keywordData, 'keywordSearching', 'Tesla', 'tweets', 'keyword')
    this.keywordLineDataTweetsGoodnight = this.parseSearchData(this.keywordData, 'keywordSearching', '@elonmusk good night from Nigeria', 'tweets', 'keyword')
    this.keywordLineDataArticlesMarkets = this.parseSearchData(this.keywordData, 'keywordSearching', 'Markets', 'articles', 'keyword')
    this.keywordLineDataArticlesLonger = this.parseSearchData(this.keywordData, 'keywordSearching', '2019 Size, Share, Growth, Demand, Analysis, Research, Trends, Forecast, Applications, Products, Types, Technology, Production, Cost, Price, Profit, Leading Suppliers, Manufacturing Plants, Regions, Vendors', 'articles', 'keyword')
    this.boolqueryLineDataTweetsObama = this.parseSearchData(this.boolqueryData, 'boolQuerySearching',"Keyword: Obama, Conditions: text != \"@MrAndyNgo @elonmusk Thanks Obama\"" , 'tweets', 'boolQuery')
    this.boolqueryLineDataTweetsEisenhower = this.parseSearchData(this.boolqueryData, 'boolQuerySearching',"Keyword: Eisenhower, Conditions: text != \"@Geek4MAGA @elonmusk @LegendaryEnergy @EndWokeness Don't forget Eisenhower warned us too!\"" , 'tweets', 'boolQuery')
    this.boolqueryLineDataArticlesYear = this.parseSearchData(this.boolqueryData, 'boolQuerySearching',"Keyword: year, Conditions: author != \"J. Bradford DeLong\" AND author != Jolyjoy" , 'articles', 'boolQuery')
    this.boolqueryLineDataArticlesKeynes = this.parseSearchData(this.boolqueryData, 'boolQuerySearching',"Keyword: keynes, Conditions: author != \"J. Bradford DeLong\"" , 'articles', 'boolQuery')
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

  parseSearchData(input: any[], title: string, keyword: string, collection: string, wordKey: string): lineChartInput{
    const collectionName = collection.charAt(0).toUpperCase() + collection.slice(1);;
    const tweetData = input.filter((s)=>s.collection == collection);
    const keywordData = tweetData.filter((s)=> s[wordKey] == keyword)
    const data = this.filterService.getArrNumber(keywordData, `${this.key}Percent`)
    if (keyword.length > 50) keyword = keyword.substring(0, 50)+'...'
     const res: lineChartInput = {
      title: `${this.name} Percentage while ${title} the ${collectionName}-Collection, \n Query: ${keyword}`,
      data: data,
      xLabels: this.filterService.getxLabels(data)
    }
    return res;
  }

}
