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

  constructor(private filterService: FilterService){
    
  }

  ngOnChanges(){
    this.indexBarData = this.parseIndexData()
  }


  parseIndexData(): barChartInput{

    const tweetData = this.filterService.getTweets(this.indexData);
    console.log("TWEETS")
    console.log(tweetData);
    const articleData = this.filterService.getArticles(this.indexData);
    console.log("ARTICLES")
    console.log(articleData)
    const data = [{data: this.filterService.getNumbers(tweetData, 'running'), label: 'Tweets'},{data: this.filterService.getNumbers(articleData, 'running'), label: 'Articles'},]
   const res: barChartInput = {
      title: 'Index-Speed in MilliSeconds',
      labels: defaultLabels,
      datasets: data
    }
    return res;
  }


}
