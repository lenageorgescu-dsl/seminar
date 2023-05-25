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
    this.indexBarData = this.parseIndexData();
    this.placeholderBarData = this.parsePlaceholderData();

  }


  parseIndexData(): barChartInput{
    const tweetData = this.filterService.getTweets(this.indexData);
    const articleData = this.filterService.getArticles(this.indexData);
    const data = [{data: this.filterService.getNumbers(tweetData, 'running'), label: 'Tweets'},{data: this.filterService.getNumbers(articleData, 'running'), label: 'Articles'},]
    const res: barChartInput = {
      title: 'Index-Speed in MilliSeconds',
      labels: defaultLabels,
      datasets: data
    }
    return res;
  }

  parsePlaceholderData(): barChartInput{
    const tweetData = this.filterService.getTweets(this.placeholderData);
    const articleData = this.filterService.getArticles(this.placeholderData);
    const data = [{data: this.filterService.getNumbers(tweetData, 'running'), label: 'Tweets'},{data: this.filterService.getNumbers(articleData, 'running'), label: 'Articles'},]
    const res: barChartInput = {
      title: 'PlaceholderSearch in MilliSeconds',
      labels: defaultLabels,
      datasets: data
    }
    return res;

  }


}
