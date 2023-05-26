import { Component, Input } from '@angular/core';
import { barChartInput, defaultBarChartInput, defaultLabels } from '../bar-chart/interfaces';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-speed',
  templateUrl: './speed.component.html',
  styleUrls: ['./speed.component.css']
})
export class SpeedComponent {



  @Input() indexData: any[]=[]
  @Input() placeholderData: any[]=[]
  @Input() keywordData: any[] = []

    indexBarData: barChartInput = defaultBarChartInput;
    placeholderBarData: barChartInput = defaultBarChartInput;
    keywordTweetBarData: barChartInput = defaultBarChartInput;
    keywordArticleBarData: barChartInput = defaultBarChartInput;

  constructor(private filterService: FilterService){
    
  }

  ngOnChanges(){
    this.indexBarData = this.parseSmallerData(this.indexData, 'Index');
    this.placeholderBarData = this.parseSmallerData(this.placeholderData, 'PlaceholderSearch');
    this.keywordTweetBarData = this.parseBiggerDataTweets(this.keywordData, 'KeyWordSearch')
    this.keywordArticleBarData = this.parseBiggerDataArticles(this.keywordData, 'KeyWordSearch')
    

  }


  parseSmallerData(input: any, title: string): barChartInput{
    const tweetData = this.filterService.getTweets(input);
    const articleData = this.filterService.getArticles(input);
    const data = [{data: this.filterService.getNumbers(tweetData, 'running'), label: 'Tweets'},{data: this.filterService.getNumbers(articleData, 'running'), label: 'Articles'},]
    const res: barChartInput = {
      title: `${title}-Speed in MilliSeconds`,
      labels: defaultLabels,
      datasets: data
    }
    return res;
  }

  parseBiggerDataTweets(input: any, title: string):  barChartInput{
    const data = this.filterService.getTweets(input);
    const tesla = data.filter((s)=> s.keyword == 'Tesla');
    const goodnight = data.filter((s)=> s.keyword != 'Tesla');
    const res = [{data: this.filterService.getNumbers(tesla, 'running'), label: 'Tesla'},{data: this.filterService.getNumbers(goodnight, 'running'), label: '@elonmusk good night from Nigeria'},]
    const result: barChartInput = {
      title: `${title}-Speed in MilliSeconds, Tweet-Collection`,
      labels: defaultLabels,
      datasets: res
    }
    return result;
  }

  parseBiggerDataArticles(input: any, title: string):  barChartInput{
    const data = this.filterService.getArticles(input);
    const markets = data.filter((s)=> s.keyword == 'Markets');
    const longer = data.filter((s)=> s.keyword != 'Markets');
    const res = [{data: this.filterService.getNumbers(markets, 'running'), label: 'Markets'},{data: this.filterService.getNumbers(longer, 'running'), label: '2019 Size, Share, Growth, Demand, Analysis...'},]
    const result: barChartInput = {
      title: `${title}-Speed in MilliSeconds, Article-Collection`,
      labels: defaultLabels,
      datasets: res
    }
    return result;
  }

}
