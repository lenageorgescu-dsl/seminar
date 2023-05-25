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

    indexBarData: barChartInput = defaultBarChartInput;
    placeholderBarData: barChartInput = defaultBarChartInput;

  constructor(private filterService: FilterService){
    
  }

  ngOnChanges(){
    this.indexBarData = this.parseSmallerData(this.indexData, 'Index');
    this.placeholderBarData = this.parseSmallerData(this.placeholderData, 'PlaceholderSearch');

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


}
