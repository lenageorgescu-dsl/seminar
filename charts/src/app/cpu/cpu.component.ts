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

    indexLineDataTweets: lineChartInput = defaultLineChartInput;
    indexLineDataArticles: lineChartInput = defaultLineChartInput;
    placeholderLineDataTweets: lineChartInput = defaultLineChartInput;
    placeholderLineDataArticles: lineChartInput = defaultLineChartInput;

  constructor(private filterService: FilterService){
    
  }

   ngOnChanges(){
    this.indexLineDataTweets = this.parseDataTweets(this.indexData, 'indexing');
    this.indexLineDataArticles = this.parseDataArticles(this.indexData, 'indexing');
    this.placeholderLineDataTweets = this.parseDataTweets(this.placeholderData, 'placeholderSearching');
    this.placeholderLineDataArticles = this.parseDataArticles(this.placeholderData, 'placeholderSearching');
    console.log(this.indexData);
    console.log(this.placeholderData);
  }
  


  parseDataTweets(input: any, title: string): lineChartInput{
    const tweetData = this.filterService.getTweets(input);
    const data = this.filterService.getArrNumber(tweetData, `${this.key}Percent`);
    const res: lineChartInput = {
      title: `${this.name} Percentage while ${title} the Tweets-Collection`,
      data: data,
      xLabels: this.filterService.getxLabels(data)
    }
    console.log(title);
    console.log(res);
    return res;
  }

  parseDataArticles(input: any, title: string): lineChartInput{
    const articleData = this.filterService.getArticles(input);
    const data = this.filterService.getArrNumber(articleData, `${this.key}Percent`);
    const res: lineChartInput = {
      title: `${this.name} Percentage while ${title} the Articles-Collection`,
      data: data,
      xLabels: this.filterService.getxLabels(data)
    }
    return res;

  }

}
