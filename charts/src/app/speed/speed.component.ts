import { Component, Input } from '@angular/core';
import { barChartInput, defaultBarChartInput, defaultLabels } from '../bar-chart/interfaces';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-speed',
  templateUrl: './speed.component.html',
  styleUrls: ['./speed.component.css']
})
export class SpeedComponent {


  @Input() key: string = ''
  @Input() name: string = ''
  @Input() title: string = ''

  @Input() indexData: any[]=[]
  @Input() placeholderData: any[]=[]
  @Input() keywordData: any[] = []
  @Input() boolqueryData: any[] = []

    indexBarData: barChartInput = defaultBarChartInput;
    placeholderBarData: barChartInput = defaultBarChartInput;
    keywordTweetBarData: barChartInput = defaultBarChartInput;
    keywordArticleBarData: barChartInput = defaultBarChartInput;
    boolqueryTweetBarData: barChartInput = defaultBarChartInput;
    boolqueryArticleBarData: barChartInput = defaultBarChartInput;

  constructor(private filterService: FilterService){
    
  }

  ngOnChanges(){
    this.indexBarData = this.parseSmallerData(this.indexData, 'Index');
    this.placeholderBarData = this.parseSmallerData(this.placeholderData, 'PlaceholderSearch');
    this.keywordTweetBarData = this.parseBiggerData(this.keywordData, 'KeyWordSearch', 'tweets', ['Tesla', '@elonmusk good night from Nigeria'], 'keyword')
    this.keywordArticleBarData = this.parseBiggerData(this.keywordData, 'KeyWordSearch', 'articles', ['Markets', '2019 Size, Share, Growth, Demand, Analysis, Research, Trends, Forecast, Applications, Products, Types, Technology, Production, Cost, Price, Profit, Leading Suppliers, Manufacturing Plants, Regions, Vendors'], 'keyword')
    this.boolqueryTweetBarData = this.parseBiggerData (this.boolqueryData, 'BoolQuerySearch', 'tweets', ["Keyword: Obama, Conditions: text != \"@MrAndyNgo @elonmusk Thanks Obama\"","Keyword: Eisenhower, Conditions: text != \"@Geek4MAGA @elonmusk @LegendaryEnergy @EndWokeness Don't forget Eisenhower warned us too!\""], 'boolQuery')
    this.boolqueryArticleBarData = this.parseBiggerData (this.boolqueryData, 'BoolQuerySearch', 'articles', ["Keyword: year, Conditions: author != \"J. Bradford DeLong\" AND author != Jolyjoy", "Keyword: keynes, Conditions: author != \"J. Bradford DeLong\""], 'boolQuery')
  }


  parseSmallerData(input: any, title: string): barChartInput{
    const tweetData = this.filterService.getTweets(input);
    const articleData = this.filterService.getArticles(input);
    const data = [{data: this.filterService.getNumbers(tweetData, this.key), label: 'Tweets'},{data: this.filterService.getNumbers(articleData, this.key), label: 'Articles'},]
    const res: barChartInput = {
      title: `${title}${this.name}`,
      labels: defaultLabels,
      datasets: data
    }
    return res;
  }

  parseBiggerData(input: any[], title: string, collection: string, keywords: string[], wordKey: string):  barChartInput{
    const collectionName = collection.charAt(0).toUpperCase() + collection.slice(1);
    const data = input.filter((s)=> s.collection == collection);
    const set0 = data.filter((s)=> s[wordKey] == keywords[0]);
    const set1 = data.filter((s)=> s[wordKey] == keywords[1]);
    console.log(set0);
    console.log(set1)
    let shortenedKeyWords: string[] = []
    keywords.forEach((s)=> {
      if (s.length > 50) shortenedKeyWords.push(s.substring(0, 50)+'...')
      else shortenedKeyWords.push(s)})
    const res = [{data: this.filterService.getNumbers(set0, this.key), label: shortenedKeyWords[0]},{data: this.filterService.getNumbers(set1, this.key), label: shortenedKeyWords[1]},]
    const result: barChartInput = {
      title: `${title}${this.name}, ${collectionName}-Collection`,
      labels: defaultLabels,
      datasets: res
    }
    return result;
  }

}
